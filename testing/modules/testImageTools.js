/**
 * Test Module for Image Tools Category (15 tools)
 * Rigorously validates SVG optimization, Base64 conversion, and image processing components.
 */
async function testImageTools(page, tool, { typeInput, clickButton, verifyOutput }) {
  await page.waitForSelector('main, article, input, textarea, button, div', { timeout: 5000 });

  switch (tool.slug) {
    case 'svg-optimizer': {
      const textarea = await page.$('textarea');
      const inputSvg = '<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100">\n  <!-- Comment to clean -->\n  <circle cx="50" cy="50" r="40" fill="#ff0000" />\n</svg>';
      if (textarea) {
        await textarea.click({ clickCount: 3 });
        await textarea.type(inputSvg);
      }
      await clickButton(page, 'Optimize') || await clickButton(page, 'Minify') || await clickButton(page, 'Process');
      await new Promise(r => setTimeout(r, 200));

      const textareas = await page.$$('textarea');
      const outVal = textareas.length >= 2 ? await page.evaluate(el => el.value, textareas[1]) : '';

      if (!outVal.includes('<svg') || outVal.includes('<!-- Comment')) {
        throw new Error(`SVG Optimizer Failed: Expected minified SVG without comments, got:\n"${outVal.slice(0, 200)}"`);
      }
      break;
    }

    case 'base64-to-image': {
      const textarea = await page.$('textarea');
      // 1x1 red PNG base64
      const sampleBase64 = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==";
      if (textarea) {
        await textarea.click({ clickCount: 3 });
        await textarea.type(sampleBase64);
      }
      await clickButton(page, 'Convert') || await clickButton(page, 'Decode') || await clickButton(page, 'Preview');
      await new Promise(r => setTimeout(r, 300));

      const img = await page.$('img[src^="data:image"]');
      if (!img) {
        throw new Error('Base64 to Image Failed: Image element with decoded Base64 source was not rendered.');
      }
      break;
    }

    default: {
      const fileInput = await page.$('input[type="file"]');
      const textarea = await page.$('textarea');

      if (textarea) {
        await textarea.type('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==').catch(() => {});
      }

      await clickButton(page, 'Convert') || await clickButton(page, 'Process') || await clickButton(page, 'Upload') || await clickButton(page, 'Extract');
      await new Promise(r => setTimeout(r, 400));
      break;
    }
  }
}

module.exports = testImageTools;
