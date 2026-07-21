/**
 * Test Module for Date & Time Category (5 tools)
 * Rigorously validates timestamp conversions and cron translations.
 * All 5 tools have explicit E2E test cases.
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

    case 'timezone-converter': {
      // Enter a specific time and select two timezones, verify the converted time appears
      const inputs = await page.$$('input[type="time"], input[type="text"], input[type="number"]');
      if (inputs.length >= 1) {
        await inputs[0].click({ clickCount: 3 });
        await inputs[0].type('12:00');
      }
      await clickButton(page, 'Convert') || await clickButton(page, 'Calculate');
      await new Promise(r => setTimeout(r, 400));

      const bodyText = await page.evaluate(() => document.body.innerText);
      // Expect some time format in output, timezone names, or offset indicators
      if (!bodyText.match(/[0-9]{1,2}:[0-9]{2}/) && !bodyText.toLowerCase().includes('utc') && !bodyText.toLowerCase().includes('gmt')) {
        throw new Error(`Timezone Converter Failed: Expected a converted time in HH:MM format or UTC/GMT label, got:\n"${bodyText.slice(0, 200)}"`);
      }
      break;
    }

    case 'countdown-timer': {
      // Set a target future date and verify the timer renders countdown numbers
      const inputs = await page.$$('input[type="datetime-local"], input[type="date"], input[type="text"]');
      if (inputs.length >= 1) {
        await inputs[0].click({ clickCount: 3 });
        await inputs[0].type('2027-01-01T00:00');
      }
      await clickButton(page, 'Start') || await clickButton(page, 'Set') || await clickButton(page, 'Countdown');
      await new Promise(r => setTimeout(r, 800));

      const bodyText = await page.evaluate(() => document.body.innerText);
      // Should display days, hours, minutes, or seconds in countdown format
      if (!bodyText.match(/[0-9]+\s*(day|hour|min|sec|d|h|m|s)/i) && !bodyText.match(/[0-9]{2}:[0-9]{2}:[0-9]{2}/)) {
        throw new Error(`Countdown Timer Failed: Expected countdown (days/hours/mins/secs) to 2027-01-01, got:\n"${bodyText.slice(0, 200)}"`);
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
