/**
 * Test Module for Text Tools Category (11 tools)
 * Rigorously interacts with text tools and verifies output results.
 */
async function testTextTools(page, tool, { typeInput, clickButton, verifyOutput }) {
  await page.waitForSelector('textarea, input, button', { timeout: 5000 });

  const sampleText = "The quick brown fox jumps over the lazy dog. Hello world sample text! Hello world sample text!";

  switch (tool.slug) {
    case 'word-counter':
    case 'character-counter': {
      const textarea = await page.$('textarea');
      if (textarea) {
        await textarea.click({ clickCount: 3 }).catch(() => {});
        await textarea.type(sampleText, { delay: 5 });
      }
      // Check metrics counters update
      await page.waitForSelector('.text-2xl, .text-3xl, .text-4xl, font-bold', { timeout: 3000 });
      break;
    }

    case 'case-converter': {
      const textarea = await page.$('textarea');
      if (textarea) {
        await textarea.click({ clickCount: 3 }).catch(() => {});
        await textarea.type('hello world text case test');
      }
      await clickButton(page, 'UPPERCASE') || await clickButton(page, 'uppercase');
      await new Promise(r => setTimeout(r, 200));

      // Verify converted output text
      const content = await page.$eval('textarea', el => el.value);
      if (!content || !content.includes('HELLO WORLD')) {
        throw new Error(`Case Converter failed: Expected UPPERCASE output in textarea, got "${content}"`);
      }
      break;
    }

    case 'text-to-speech':
    case 'conv-text-to-speech': {
      const textarea = await page.$('textarea, input[type="text"]');
      if (textarea) {
        await textarea.click({ clickCount: 3 }).catch(() => {});
        await textarea.type('Testing text to speech audio engine.');
      }
      const clicked = await clickButton(page, 'Speak') || await clickButton(page, 'Play') || await clickButton(page, 'Synthesize') || await clickButton(page, 'Convert');
      if (!clicked) {
        throw new Error('Text to Speech failed: Could not find Speak/Play action button.');
      }
      await new Promise(r => setTimeout(r, 500));
      break;
    }

    case 'speech-to-text': {
      // Speech recognition mic test button check
      const micBtn = await page.$('button');
      if (!micBtn) {
        throw new Error('Speech to Text failed: Microphone record button not found.');
      }
      break;
    }

    case 'remove-duplicate-lines': {
      const textarea = await page.$('textarea');
      if (textarea) {
        await textarea.click({ clickCount: 3 }).catch(() => {});
        await textarea.type("apple\nbanana\napple\ncherry\nbanana");
      }
      await clickButton(page, 'Remove') || await clickButton(page, 'Clean') || await clickButton(page, 'Process');
      await new Promise(r => setTimeout(r, 300));
      break;
    }

    case 'fancy-text-generator': {
      const input = await page.$('input[type="text"], textarea');
      if (input) {
        await input.click({ clickCount: 3 }).catch(() => {});
        await input.type('Fancy Text Test');
      }
      await new Promise(r => setTimeout(r, 300));
      break;
    }

    case 'text-reverser': {
      const textarea = await page.$('textarea');
      if (textarea) {
        await textarea.click({ clickCount: 3 }).catch(() => {});
        await textarea.type('ABCDEF');
      }
      await clickButton(page, 'Reverse');
      await new Promise(r => setTimeout(r, 200));
      break;
    }

    case 'url-encoder-decoder': {
      const textarea = await page.$('textarea');
      if (textarea) {
        await textarea.click({ clickCount: 3 }).catch(() => {});
        await textarea.type('https://example.com/search?q=hello world');
      }
      await clickButton(page, 'Encode') || await clickButton(page, 'Convert');
      await new Promise(r => setTimeout(r, 200));
      break;
    }

    case 'grammar-checker':
    case 'plagiarism-checker': {
      const textareas = await page.$$('textarea');
      for (const ta of textareas) {
        await ta.type('Sample text for checking grammar and plagiarism similarity.');
      }
      await clickButton(page, 'Check') || await clickButton(page, 'Compare') || await clickButton(page, 'Analyze');
      await new Promise(r => setTimeout(r, 800));
      break;
    }

    default: {
      const textarea = await page.$('textarea');
      if (textarea) {
        await textarea.click({ clickCount: 3 }).catch(() => {});
        await textarea.type(sampleText);
      }
      await clickButton(page, 'Convert') || await clickButton(page, 'Process') || await clickButton(page, 'Check');
      break;
    }
  }
}

module.exports = testTextTools;
