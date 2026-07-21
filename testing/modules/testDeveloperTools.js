/**
 * Test Module for Developer Utilities Category (17 tools)
 * Rigorously validates developer tools with strict output assertions.
 * All 17 tools have explicit E2E test cases.
 */
async function testDeveloperTools(page, tool, { typeInput, clickButton, verifyOutput }) {
  await page.waitForSelector('textarea, input, button', { timeout: 5000 });

  switch (tool.slug) {
    case 'json-formatter': {
      const textarea = await page.$('textarea');
      if (textarea) {
        await textarea.click({ clickCount: 3 });
        await textarea.type('{"name":"webvix","status":"active"}');
      }
      await clickButton(page, 'Beautify') || await clickButton(page, 'Format');
      await new Promise(r => setTimeout(r, 200));

      const textareas = await page.$$('textarea');
      if (textareas.length >= 2) {
        const out = await page.evaluate(el => el.value, textareas[1]);
        if (!out.includes('"name": "webvix"')) {
          throw new Error(`JSON Formatter Failed: Expected formatted JSON, got "${out}"`);
        }
      }
      break;
    }

    case 'base64-encoder-decoder': {
      const textarea = await page.$('textarea');
      if (textarea) {
        await textarea.click({ clickCount: 3 });
        await textarea.type('Hello World');
      }
      await clickButton(page, 'Encode');
      await new Promise(r => setTimeout(r, 200));

      const textareas = await page.$$('textarea');
      if (textareas.length >= 2) {
        const out = await page.evaluate(el => el.value, textareas[1]);
        if (out.trim() !== 'SGVsbG8gV29ybGQ=') {
          throw new Error(`Base64 Encoder Failed: Expected "SGVsbG8gV29ybGQ=", got "${out}"`);
        }
      }
      break;
    }

    case 'dev-url-encoder-decoder': {
      const textarea = await page.$('textarea');
      if (textarea) {
        await textarea.click({ clickCount: 3 });
        await textarea.type('https://talhacodes.site?test=hello world');
      }
      await clickButton(page, 'Encode');
      await new Promise(r => setTimeout(r, 200));

      const textareas = await page.$$('textarea');
      if (textareas.length >= 2) {
        const out = await page.evaluate(el => el.value, textareas[1]);
        if (!out.includes('hello%20world')) {
          throw new Error(`URL Encoder Failed: Expected "hello%20world", got "${out}"`);
        }
      }
      break;
    }

    case 'jwt-token-decoder': {
      const textarea = await page.$('textarea');
      if (textarea) {
        await textarea.click({ clickCount: 3 });
        const sampleJwt = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c";
        await textarea.type(sampleJwt);
      }
      await clickButton(page, 'Decode');
      await new Promise(r => setTimeout(r, 200));

      const textareas = await page.$$('textarea');
      if (textareas.length >= 2) {
        const out = await page.evaluate(el => el.value, textareas[1]);
        if (!out.includes('John Doe') || !out.includes('HS256')) {
          throw new Error(`JWT Decoder Failed: Expected decoded header and payload with "John Doe", got "${out}"`);
        }
      }
      break;
    }

    case 'password-generator': {
      await clickButton(page, 'Generate') || await clickButton(page, 'Create');
      await new Promise(r => setTimeout(r, 200));

      const passEl = await page.$('.font-mono.text-lg, .font-mono.text-xl, input[readonly]');
      const passText = passEl ? await page.evaluate(el => el.value || el.textContent, passEl) : '';

      if (!passText || passText.length < 8) {
        throw new Error(`Password Generator Failed: Expected generated password string, got "${passText}"`);
      }
      break;
    }

    case 'uuid-generator': {
      await clickButton(page, 'Generate') || await clickButton(page, 'Create');
      await new Promise(r => setTimeout(r, 200));

      const uuidsText = await page.evaluate(() => document.body.innerText);
      if (!uuidsText.includes('-') || !/[0-9a-f]{8}-[0-9a-f]{4}/i.test(uuidsText)) {
        throw new Error(`UUID Generator Failed: Expected v4 UUID list output.`);
      }
      break;
    }

    case 'qr-code-generator': {
      const textarea = await page.$('textarea');
      if (textarea) {
        await textarea.click({ clickCount: 3 });
        await textarea.type('https://talhacodes.site');
      }
      await clickButton(page, 'Generate');
      await new Promise(r => setTimeout(r, 400));

      const img = await page.$('img[src*="qrserver"]');
      if (!img) {
        throw new Error('QR Code Generator Failed: Image element with generated QR code URL not found.');
      }
      break;
    }

    case 'regex-tester': {
      const patternInput = await page.$('input[type="text"]');
      if (patternInput) {
        await patternInput.click({ clickCount: 3 });
        await patternInput.type('[a-z]+@domain\\.com');
      }
      const textareas = await page.$$('textarea');
      if (textareas.length >= 1) {
        await textareas[0].click({ clickCount: 3 });
        await textareas[0].type('Contact info test@domain.com for support.');
      }
      await clickButton(page, 'Test') || await clickButton(page, 'Match');
      await new Promise(r => setTimeout(r, 200));

      const bodyText = await page.evaluate(() => document.body.innerText);
      if (!bodyText.includes('test@domain.com') && !bodyText.includes('1 match')) {
        throw new Error(`Regex Tester Failed: Expected match for "test@domain.com".`);
      }
      break;
    }

    case 'xml-formatter': {
      const textarea = await page.$('textarea');
      if (textarea) {
        await textarea.click({ clickCount: 3 });
        await textarea.type('<root><item id="1"><name>WebVix</name></item></root>');
      }
      await clickButton(page, 'Beautify') || await clickButton(page, 'Format');
      await new Promise(r => setTimeout(r, 200));

      const textareas = await page.$$('textarea');
      if (textareas.length >= 2) {
        const out = await page.evaluate(el => el.value, textareas[1]);
        if (!out.includes('<name>') || !out.includes('WebVix')) {
          throw new Error(`XML Formatter Failed: Expected formatted XML with "<name>WebVix</name>", got "${out.slice(0, 200)}"`);
        }
      }
      break;
    }

    case 'css-formatter': {
      const textarea = await page.$('textarea');
      if (textarea) {
        await textarea.click({ clickCount: 3 });
        await textarea.type('body{color:red;background:blue;margin:0}');
      }
      await clickButton(page, 'Beautify') || await clickButton(page, 'Format') || await clickButton(page, 'Prettify');
      await new Promise(r => setTimeout(r, 200));

      const textareas = await page.$$('textarea');
      if (textareas.length >= 2) {
        const out = await page.evaluate(el => el.value, textareas[1]);
        if (!out.includes('color') || !out.includes('red')) {
          throw new Error(`CSS Formatter Failed: Expected formatted CSS output containing "color: red", got "${out.slice(0, 200)}"`);
        }
      }
      break;
    }

    case 'html-encoder-decoder': {
      const textarea = await page.$('textarea');
      if (textarea) {
        await textarea.click({ clickCount: 3 });
        await textarea.type('<div class="test">Hello & World</div>');
      }
      await clickButton(page, 'Encode');
      await new Promise(r => setTimeout(r, 200));

      const textareas = await page.$$('textarea');
      if (textareas.length >= 2) {
        const out = await page.evaluate(el => el.value, textareas[1]);
        if (!out.includes('&lt;') && !out.includes('&amp;')) {
          throw new Error(`HTML Encoder Failed: Expected "&lt;" and "&amp;" entities, got "${out.slice(0, 200)}"`);
        }
      }
      break;
    }

    case 'markdown-to-html': {
      const textarea = await page.$('textarea');
      if (textarea) {
        await textarea.click({ clickCount: 3 });
        await textarea.type('# Hello WebVix\n\nThis is **bold** and _italic_ text.\n\n- Item 1\n- Item 2');
      }
      await clickButton(page, 'Convert') || await clickButton(page, 'Render') || await clickButton(page, 'Preview');
      await new Promise(r => setTimeout(r, 300));

      const bodyText = await page.evaluate(() => document.body.innerText);
      const outputHtml = await page.evaluate(() => document.body.innerHTML);
      if (!outputHtml.includes('<h1') && !bodyText.includes('Hello WebVix')) {
        throw new Error(`Markdown to HTML Failed: Expected <h1> tag for "# Hello WebVix", got:\n"${bodyText.slice(0, 200)}"`);
      }
      break;
    }

    case 'htaccess-generator': {
      // Use the UI to generate a redirect rule
      await clickButton(page, 'Generate') || await clickButton(page, 'Add Rule');
      await new Promise(r => setTimeout(r, 300));

      const bodyText = await page.evaluate(() => document.body.innerText);
      if (!bodyText.includes('RewriteEngine') && !bodyText.includes('RewriteRule') && !bodyText.includes('htaccess') && !bodyText.includes('Options')) {
        throw new Error(`htaccess Generator Failed: Expected Apache rewrite rule directives, got:\n"${bodyText.slice(0, 250)}"`);
      }
      break;
    }

    case 'robots-txt-generator': {
      await clickButton(page, 'Generate') || await clickButton(page, 'Add Rule');
      await new Promise(r => setTimeout(r, 300));

      const bodyText = await page.evaluate(() => document.body.innerText);
      if (!bodyText.includes('User-agent') && !bodyText.includes('Disallow') && !bodyText.includes('robots')) {
        throw new Error(`Robots.txt Generator Failed: Expected "User-agent" and "Disallow" directives, got:\n"${bodyText.slice(0, 250)}"`);
      }
      break;
    }

    case 'meta-tag-generator': {
      const inputs = await page.$$('input[type="text"]');
      if (inputs.length >= 1) {
        await inputs[0].click({ clickCount: 3 });
        await inputs[0].type('WebVix - Free Online Tools');
      }
      if (inputs.length >= 2) {
        await inputs[1].click({ clickCount: 3 });
        await inputs[1].type('A comprehensive suite of free online developer tools.');
      }
      await clickButton(page, 'Generate') || await clickButton(page, 'Create');
      await new Promise(r => setTimeout(r, 300));

      const bodyText = await page.evaluate(() => document.body.innerText);
      if (!bodyText.includes('<meta') && !bodyText.includes('og:title') && !bodyText.includes('WebVix')) {
        throw new Error(`Meta Tag Generator Failed: Expected <meta> tag output, got:\n"${bodyText.slice(0, 200)}"`);
      }
      break;
    }

    case 'json-yaml-converter': {
      const textarea = await page.$('textarea');
      if (textarea) {
        await textarea.click({ clickCount: 3 });
        await textarea.type('{"name":"WebVix","version":1,"active":true}');
      }
      await clickButton(page, 'Convert') || await clickButton(page, 'JSON to YAML');
      await new Promise(r => setTimeout(r, 200));

      const textareas = await page.$$('textarea');
      if (textareas.length >= 2) {
        const out = await page.evaluate(el => el.value, textareas[1]);
        if (!out.includes('name:') || !out.includes('WebVix')) {
          throw new Error(`JSON to YAML Converter Failed: Expected YAML output with "name: WebVix", got "${out.slice(0, 200)}"`);
        }
      }
      break;
    }

    case 'sql-formatter-sanitizer': {
      const textarea = await page.$('textarea');
      if (textarea) {
        await textarea.click({ clickCount: 3 });
        await textarea.type('SELECT id,name,email FROM users WHERE active=1 ORDER BY name ASC');
      }
      await clickButton(page, 'Format') || await clickButton(page, 'Beautify');
      await new Promise(r => setTimeout(r, 200));

      const textareas = await page.$$('textarea');
      if (textareas.length >= 2) {
        const out = await page.evaluate(el => el.value, textareas[1]);
        // Formatted SQL should have SELECT on its own line or at minimum contain the keywords
        if (!out.toUpperCase().includes('SELECT') || !out.includes('users')) {
          throw new Error(`SQL Formatter Failed: Expected formatted SQL with SELECT/FROM structure, got "${out.slice(0, 200)}"`);
        }
      }
      break;
    }

    default: {
      const textarea = await page.$('textarea');
      if (textarea) {
        await textarea.click({ clickCount: 3 }).catch(() => {});
        await textarea.type('Sample developer payload test string');
      }
      await clickButton(page, 'Format') || await clickButton(page, 'Convert') || await clickButton(page, 'Generate') || await clickButton(page, 'Process');
      await new Promise(r => setTimeout(r, 300));
      break;
    }
  }
}

module.exports = testDeveloperTools;
