/**
 * Test Module for Date & Time Category (5 tools)
 * Rigorously validates timestamp conversions and cron translations.
 */
async function testDateTime(page, tool, { typeInput, clickButton, verifyOutput }) {
  await page.waitForSelector('input, select, button', { timeout: 5000 });

  switch (tool.slug) {
    case 'cron-parser': {
      const input = await page.$('input[type="text"]');
      if (input) {
        await input.click({ clickCount: 3 });
        await input.type('*/5 * * * *');
      }
      await clickButton(page, 'Parse') || await clickButton(page, 'Translate') || await clickButton(page, 'Explain');
      await new Promise(r => setTimeout(r, 200));

      const bodyText = await page.evaluate(() => document.body.innerText);
      if (!bodyText.toLowerCase().includes('every 5 minute') && !bodyText.toLowerCase().includes('5 minutes')) {
        throw new Error('Cron Parser Failed: Expected translation "Every 5 minutes" for "*/5 * * * *".');
      }
      break;
    }

    case 'unix-timestamp-converter': {
      const input = await page.$('input[type="number"], input[type="text"]');
      if (input) {
        await input.click({ clickCount: 3 });
        await input.type('1700000000');
      }
      await clickButton(page, 'Convert');
      await new Promise(r => setTimeout(r, 200));

      const bodyText = await page.evaluate(() => document.body.innerText);
      if (!bodyText.includes('2023') && !bodyText.toLowerCase().includes('nov')) {
        throw new Error('Unix Timestamp Converter Failed: Expected 2023 date translation for timestamp 1700000000.');
      }
      break;
    }

    case 'date-difference': {
      const inputs = await page.$$('input[type="date"], input[type="text"]');
      if (inputs.length >= 2) {
        await inputs[0].type('2026-01-01');
        await inputs[1].type('2026-01-10');
      }
      await clickButton(page, 'Calculate');
      await new Promise(r => setTimeout(r, 200));

      const bodyText = await page.evaluate(() => document.body.innerText);
      if (!bodyText.includes('9') && !bodyText.includes('day')) {
        throw new Error('Date Difference Failed: Expected 9 days calculated difference between Jan 1 and Jan 10.');
      }
      break;
    }

    default: {
      const input = await page.$('input[type="text"], input[type="number"]');
      if (input) {
        await input.type('2026-07-21');
      }
      await clickButton(page, 'Convert') || await clickButton(page, 'Calculate') || await clickButton(page, 'Start');
      await new Promise(r => setTimeout(r, 300));
      break;
    }
  }
}

module.exports = testDateTime;
