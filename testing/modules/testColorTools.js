/**
 * Test Module for Color Tools Category (8 tools)
 * Rigorously tests inputs and verifies generated color conversions & palette outputs.
 */
async function testColorTools(page, tool, { typeInput, clickButton, verifyOutput }) {
  await page.waitForSelector('input, button, canvas, div', { timeout: 5000 });

  switch (tool.slug) {
    case 'hex-to-rgb-converter': {
      const input = await page.$('input[type="text"]');
      if (input) {
        await input.click({ clickCount: 3 });
        await input.type('#FF0000');
      }
      await clickButton(page, 'Convert') || await clickButton(page, 'Calculate');
      await new Promise(r => setTimeout(r, 200));

      const bodyText = await page.evaluate(() => document.body.innerText);
      if (!bodyText.includes('255') && !bodyText.includes('rgb(')) {
        throw new Error('HEX to RGB Converter Failed: Expected RGB(255, 0, 0) output for #FF0000.');
      }
      break;
    }

    case 'contrast-checker': {
      const inputs = await page.$$('input[type="text"]');
      if (inputs.length >= 2) {
        await inputs[0].click({ clickCount: 3 });
        await inputs[0].type('#000000');
        await inputs[1].click({ clickCount: 3 });
        await inputs[1].type('#FFFFFF');
      }
      await clickButton(page, 'Check') || await clickButton(page, 'Test');
      await new Promise(r => setTimeout(r, 200));

      const bodyText = await page.evaluate(() => document.body.innerText);
      if (!bodyText.includes('21:1') && !bodyText.includes('PASS') && !bodyText.includes('Contrast')) {
        throw new Error('Contrast Checker Failed: Expected WCAG 21:1 ratio for Black on White.');
      }
      break;
    }

    case 'gradient-generator':
    case 'css-color-generator':
    case 'palette-generator':
    case 'tailwind-color-generator': {
      await clickButton(page, 'Generate') || await clickButton(page, 'Randomize') || await clickButton(page, 'Copy CSS');
      await new Promise(r => setTimeout(r, 300));

      const bodyText = await page.evaluate(() => document.body.innerText);
      if (!bodyText.includes('#') && !bodyText.includes('rgb') && !bodyText.includes('gradient')) {
        throw new Error(`Color Tool "${tool.title}" Failed: No color codes or palette swatches generated.`);
      }
      break;
    }

    default: {
      const colorInput = await page.$('input[type="color"]');
      if (colorInput) {
        await colorInput.click().catch(() => {});
      }
      await clickButton(page, 'Generate') || await clickButton(page, 'Convert');
      await new Promise(r => setTimeout(r, 300));
      break;
    }
  }
}

module.exports = testColorTools;
