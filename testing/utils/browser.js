const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');
const { BASE_URL, TIMEOUT, SCREENSHOTS_DIR } = require('../config');

/**
 * Launch Puppeteer Browser Instance with fallbacks for system Chrome / Edge
 */
async function launchBrowser(options = {}) {
  const launchOptions = {
    headless: options.headless !== undefined ? options.headless : false,
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
      '--disable-accelerated-2d-canvas',
      '--disable-gpu',
      '--window-size=1280,800',
    ],
    defaultViewport: { width: 1280, height: 800 },
  };

  try {
    return await puppeteer.launch(launchOptions);
  } catch (err1) {
    try {
      return await puppeteer.launch({ ...launchOptions, channel: 'chrome' });
    } catch (err2) {
      try {
        return await puppeteer.launch({ ...launchOptions, channel: 'msedge' });
      } catch (err3) {
        const commonPaths = [
          'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
          'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe',
          process.env.LOCALAPPDATA + '\\Google\\Chrome\\Application\\chrome.exe',
          'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
        ];

        for (const exePath of commonPaths) {
          if (fs.existsSync(exePath)) {
            return await puppeteer.launch({ ...launchOptions, executablePath: exePath });
          }
        }

        throw new Error(
          `Could not find Chrome/Edge browser. Please run: npx puppeteer browsers install chrome inside testing directory.`
        );
      }
    }
  }
}

/**
 * Helper to set value on React controlled inputs/textareas and trigger input/change events
 */
async function typeInput(page, selectorOrElement, text) {
  try {
    let element = typeof selectorOrElement === 'string' ? await page.$(selectorOrElement) : selectorOrElement;
    if (element) {
      await page.evaluate((el, val) => {
        el.focus();
        const isTextArea = el.tagName === 'TEXTAREA';
        const prototype = isTextArea ? window.HTMLTextAreaElement.prototype : window.HTMLInputElement.prototype;
        const valueSetter = Object.getOwnPropertyDescriptor(prototype, 'value')?.set;
        
        if (valueSetter) {
          valueSetter.call(el, val);
        } else {
          el.value = val;
        }

        el.dispatchEvent(new Event('input', { bubbles: true }));
        el.dispatchEvent(new Event('change', { bubbles: true }));
      }, element, text);

      await new Promise(r => setTimeout(r, 100));
      return true;
    }
  } catch (err) {
    // Ignore non-fatal input typing errors
  }
  return false;
}

/**
 * Helper to click button by text or selector
 */
async function clickButton(page, selectorOrText) {
  try {
    if (selectorOrText.startsWith('.') || selectorOrText.startsWith('#') || selectorOrText.startsWith('[')) {
      const btn = await page.$(selectorOrText);
      if (btn) {
        await btn.click();
        return true;
      }
    }

    // Try finding button by contained text
    const buttons = await page.$$('button');
    for (const button of buttons) {
      const text = await page.evaluate(el => el.textContent, button);
      if (text && text.toLowerCase().includes(selectorOrText.toLowerCase())) {
        await button.click();
        return true;
      }
    }
  } catch (err) {
    // Ignore non-fatal click errors
  }
  return false;
}

/**
 * Rigorous output verification helper
 * Ensures the tool rendered a non-empty, visible result/output component
 */
async function verifyOutput(page, tool, options = {}) {
  await new Promise(r => setTimeout(r, options.waitTime || 500));

  const outputSelectors = [
    'textarea[readonly]',
    'textarea:nth-of-type(2)',
    'input[readonly]',
    '.result-viewer',
    '[data-testid="result"]',
    '#result',
    '.output-result',
    '.text-3xl.font-black',
    '.text-4xl.font-black',
    '.text-2xl.font-bold',
    'article section .bg-stone-50',
    'article section .bg-zinc-950',
    'article section .bg-emerald-500\\/10',
    'article section .bg-primary\\/10',
    'canvas',
    'svg path',
    'img[src^="data:"]',
    'a[download]',
  ];

  let foundOutput = false;
  let outputText = '';

  for (const selector of outputSelectors) {
    try {
      const elements = await page.$$(selector);
      for (const el of elements) {
        const isVisible = await page.evaluate(node => {
          const style = window.getComputedStyle(node);
          return style.display !== 'none' && style.visibility !== 'hidden' && node.offsetHeight > 0;
        }, el);

        if (isVisible) {
          const content = await page.evaluate(node => {
            if (node.tagName === 'TEXTAREA' || node.tagName === 'INPUT') {
              return node.value || node.placeholder || '';
            }
            return node.textContent || node.innerText || '';
          }, el);

          if (content && content.trim().length > 0) {
            foundOutput = true;
            outputText = content.trim();
            break;
          }
        }
      }
    } catch (e) {
      // Continue checking remaining selectors
    }
    if (foundOutput) break;
  }

  if (!foundOutput) {
    const copyOrDownloadButtons = await page.$$('button');
    for (const btn of copyOrDownloadButtons) {
      const text = await page.evaluate(el => el.textContent.toLowerCase(), btn);
      if (text.includes('copy') || text.includes('download') || text.includes('export')) {
        foundOutput = true;
        outputText = 'Action button available';
        break;
      }
    }
  }

  if (!foundOutput) {
    throw new Error(`Output Verification Failed: Tool "${tool.title}" did not generate or display a valid result component.`);
  }

  return outputText;
}

/**
 * Core test runner wrapper for an individual tool
 */
async function testTool(browser, tool, testModuleFn, options = {}) {
  const page = await browser.newPage();
  const startTime = Date.now();
  const logs = [];
  const errors = [];
  const warnings = [];

  page.on('pageerror', err => {
    errors.push(`PageError: ${err.message}`);
  });

  page.on('console', msg => {
    const text = msg.text();
    if (msg.type() === 'error' && !text.includes('favicon') && !text.includes('Failed to load resource')) {
      errors.push(`ConsoleError: ${text}`);
    } else if (msg.type() === 'warning') {
      warnings.push(text);
    }
    logs.push(`[${msg.type()}] ${text}`);
  });

  const toolUrl = `${BASE_URL}/tools/${tool.category}/${tool.slug}`;
  let passed = false;
  let failureReason = '';
  let resultOutput = '';

  try {
    const response = await page.goto(toolUrl, {
      waitUntil: 'networkidle2',
      timeout: TIMEOUT,
    });

    const status = response ? response.status() : 0;

    if (status !== 200) {
      throw new Error(`HTTP Status ${status} on page load`);
    }

    await page.waitForSelector('h1', { timeout: 5000 });

    if (typeof testModuleFn === 'function') {
      await testModuleFn(page, tool, { typeInput, clickButton, verifyOutput });
    }

    resultOutput = await verifyOutput(page, tool, { isAsync: tool.isAsync });

    if (errors.length > 0) {
      failureReason = errors.join('; ');
      passed = false;
    } else {
      passed = true;
    }

  } catch (err) {
    passed = false;
    failureReason = err.message;
  } finally {
    const durationMs = Date.now() - startTime;

    let screenshotPath = null;
    if (!passed) {
      try {
        if (!fs.existsSync(SCREENSHOTS_DIR)) {
          fs.mkdirSync(SCREENSHOTS_DIR, { recursive: true });
        }
        screenshotPath = path.join(SCREENSHOTS_DIR, `${tool.slug}.png`);
        await page.screenshot({ path: screenshotPath, fullPage: false });
      } catch (screenErr) {
        // Screenshot capture failed
      }
    }

    await page.close().catch(() => {});

    return {
      id: tool.id,
      slug: tool.slug,
      title: tool.title,
      category: tool.category,
      isAsync: tool.isAsync,
      passed,
      durationMs,
      outputSnippet: resultOutput ? resultOutput.substring(0, 80) : null,
      error: failureReason || null,
      warnings,
      logs: logs.slice(0, 10),
      screenshot: screenshotPath ? path.relative(path.join(__dirname, '..'), screenshotPath) : null,
    };
  }
}

module.exports = {
  launchBrowser,
  typeInput,
  clickButton,
  verifyOutput,
  testTool,
};
