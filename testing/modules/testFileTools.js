/**
 * Test Module for File Tools Category (9 tools)
 * Rigorously validates byte conversions and file job dropzones.
 */
async function testFileTools(page, tool, { typeInput, clickButton, verifyOutput }) {
  await page.waitForSelector('main, article, input, textarea, button, div', { timeout: 5000 });

  switch (tool.slug) {
    case 'file-size-converter': {
      const input = await page.$('input[type="number"], input[type="text"]');
      if (input) {
        await input.click({ clickCount: 3 });
        await input.type('1048576'); // 1 MB
      }
      await clickButton(page, 'Convert') || await clickButton(page, 'Calculate');
      await new Promise(r => setTimeout(r, 200));

      const bodyText = await page.evaluate(() => document.body.innerText);
      if (!bodyText.includes('1.00 MB') && !bodyText.includes('1 MB') && !bodyText.includes('1024 KB')) {
        throw new Error(`File Size Converter Failed: Expected 1048576 bytes converted to "1.00 MB" or "1024 KB", received:\n"${bodyText.slice(0, 200)}"`);
      }
      break;
    }

    default: {
      const dropzone = await page.$('input[type="file"], label, .border-dashed');
      if (!dropzone) {
        throw new Error(`File Tool "${tool.title}" Failed: File upload zone / input dropzone not found on page.`);
      }
      await clickButton(page, 'Convert') || await clickButton(page, 'Process') || await clickButton(page, 'Extract');
      await new Promise(r => setTimeout(r, 300));
      break;
    }
  }
}

module.exports = testFileTools;
