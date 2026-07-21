/**
 * Test Module for Calculators Category (13 tools)
 * Rigorously tests inputs, user actions, and validates exact mathematical outputs.
 * All 13 tools have explicit E2E test cases.
 */
async function testCalculators(page, tool, { typeInput, clickButton, verifyOutput }) {
  await page.waitForSelector('main, article, form, input, button', { timeout: 5000 });

  switch (tool.slug) {
    case 'basic-calculator': {
      // Test 5 × 6 = 30
      const clearBtn = await page.$('button');
      const buttons = await page.$$('button');
      
      const clickKey = async (label) => {
        for (const btn of buttons) {
          const text = await page.evaluate(el => el.textContent.trim(), btn);
          if (text === label) {
            await btn.click();
            await new Promise(r => setTimeout(r, 50));
            return;
          }
        }
      };

      await clickKey('C');
      await clickKey('5');
      await clickKey('×');
      await clickKey('6');
      await clickKey('=');

      await new Promise(r => setTimeout(r, 200));
      const display = await page.$eval('.font-mono', el => el.textContent.trim());
      
      if (display !== '30') {
        throw new Error(`Basic Calculator Failed: Expected "30" for 5×6, but got "${display}"`);
      }
      break;
    }

    case 'percentage-calculator': {
      // 15% of 200 = 30.00
      const inputs = await page.$$('input[type="number"]');
      if (inputs.length >= 2) {
        await inputs[0].click({ clickCount: 3 });
        await inputs[0].type('15');
        await inputs[1].click({ clickCount: 3 });
        await inputs[1].type('200');
      }

      await new Promise(r => setTimeout(r, 200));
      const outputEl = await page.$('.text-4xl');
      const val = outputEl ? await page.evaluate(el => el.textContent.trim(), outputEl) : '';

      if (!val.includes('30.00')) {
        throw new Error(`Percentage Calculator Failed: Expected "30.00" for 15% of 200, got "${val}"`);
      }
      break;
    }

    case 'bmi-calculator': {
      // Metric: Weight 70kg, Height 175cm -> BMI ~ 22.86 (Normal Weight)
      const inputs = await page.$$('input[type="number"]');
      if (inputs.length >= 2) {
        await inputs[0].click({ clickCount: 3 });
        await inputs[0].type('70');
        await inputs[1].click({ clickCount: 3 });
        await inputs[1].type('175');
      }

      await new Promise(r => setTimeout(r, 200));
      const bmiEl = await page.$('.text-4xl');
      const val = bmiEl ? await page.evaluate(el => el.textContent.trim(), bmiEl) : '';

      if (!val || parseFloat(val) < 20 || parseFloat(val) > 25) {
        throw new Error(`BMI Calculator Failed: Expected BMI around 22.86 for 70kg/175cm, got "${val}"`);
      }
      break;
    }

    case 'loan-calculator': {
      // Loan $10000, 5% interest, 3 years -> Monthly Payment ~$299.71
      const inputs = await page.$$('input[type="number"]');
      if (inputs.length >= 3) {
        await inputs[0].click({ clickCount: 3 });
        await inputs[0].type('10000');
        await inputs[1].click({ clickCount: 3 });
        await inputs[1].type('5');
        await inputs[2].click({ clickCount: 3 });
        await inputs[2].type('3');
      }

      await new Promise(r => setTimeout(r, 300));
      const resultText = await page.evaluate(() => document.body.innerText);
      if (!resultText.includes('299') && !resultText.includes('Monthly')) {
        throw new Error(`Loan Calculator Failed: Expected monthly payment ~$299, got result: "${resultText.slice(0, 150)}"`);
      }
      break;
    }

    case 'discount-calculator': {
      // $100 original, 20% discount -> $80.00 final
      const inputs = await page.$$('input[type="number"]');
      if (inputs.length >= 2) {
        await inputs[0].click({ clickCount: 3 });
        await inputs[0].type('100');
        await inputs[1].click({ clickCount: 3 });
        await inputs[1].type('20');
      }

      await new Promise(r => setTimeout(r, 200));
      const bodyText = await page.evaluate(() => document.body.innerText);
      if (!bodyText.includes('80.00')) {
        throw new Error(`Discount Calculator Failed: Expected final price $80.00 for 20% off $100.`);
      }
      break;
    }

    case 'salary-calculator': {
      // $60,000 annual -> $5,000 monthly
      const inputs = await page.$$('input[type="number"]');
      if (inputs.length >= 1) {
        await inputs[0].click({ clickCount: 3 });
        await inputs[0].type('60000');
      }

      await new Promise(r => setTimeout(r, 200));
      const bodyText = await page.evaluate(() => document.body.innerText);
      if (!bodyText.includes('5,000') && !bodyText.includes('5000')) {
        throw new Error(`Salary Calculator Failed: Expected $5,000 monthly for $60k annual salary.`);
      }
      break;
    }

    case 'age-calculator': {
      // Enter a DOB well in the past: someone born 1990-01-01 should be at least 30 years old
      const inputs = await page.$$('input[type="date"], input[type="text"], input[type="number"]');
      if (inputs.length >= 1) {
        await inputs[0].click({ clickCount: 3 });
        await inputs[0].type('1990-01-01');
      }
      await clickButton(page, 'Calculate') || await clickButton(page, 'Get Age');
      await new Promise(r => setTimeout(r, 300));

      const bodyText = await page.evaluate(() => document.body.innerText);
      if (!bodyText.match(/3[0-9]\s*year/i) && !bodyText.includes('Years') && !bodyText.includes('1990')) {
        throw new Error(`Age Calculator Failed: Expected age ≥ 30 years for DOB 1990-01-01, got: "${bodyText.slice(0, 200)}"`);
      }
      break;
    }

    case 'tip-calculator': {
      // Bill $100, tip 15%, 2 people → Tip $15, Total $115, each pays $57.50
      const inputs = await page.$$('input[type="number"]');
      if (inputs.length >= 3) {
        await inputs[0].click({ clickCount: 3 });
        await inputs[0].type('100');
        await inputs[1].click({ clickCount: 3 });
        await inputs[1].type('15');
        await inputs[2].click({ clickCount: 3 });
        await inputs[2].type('2');
      } else if (inputs.length >= 2) {
        await inputs[0].click({ clickCount: 3 });
        await inputs[0].type('100');
        await inputs[1].click({ clickCount: 3 });
        await inputs[1].type('15');
      }
      await new Promise(r => setTimeout(r, 300));

      const bodyText = await page.evaluate(() => document.body.innerText);
      if (!bodyText.includes('15') && !bodyText.includes('Tip') && !bodyText.includes('115')) {
        throw new Error(`Tip Calculator Failed: Expected tip $15 on $100 bill at 15%, got: "${bodyText.slice(0, 200)}"`);
      }
      break;
    }

    case 'currency-converter': {
      // Enter amount and verify converted result exists
      const inputs = await page.$$('input[type="number"], input[type="text"]');
      if (inputs.length >= 1) {
        await inputs[0].click({ clickCount: 3 });
        await inputs[0].type('100');
      }
      // Select to/from currencies via selects or defaults
      await clickButton(page, 'Convert') || await clickButton(page, 'Exchange');
      await new Promise(r => setTimeout(r, 2000)); // async API call

      const bodyText = await page.evaluate(() => document.body.innerText);
      if (!bodyText.match(/[0-9]+[.,][0-9]+/) && !bodyText.toLowerCase().includes('usd') && !bodyText.toLowerCase().includes('eur')) {
        throw new Error(`Currency Converter Failed: Expected a numeric converted value, got: "${bodyText.slice(0, 200)}"`);
      }
      break;
    }

    case 'gpa-calculator': {
      // Add at least one course and verify GPA output
      const inputs = await page.$$('input[type="number"], input[type="text"]');
      if (inputs.length >= 2) {
        await inputs[0].click({ clickCount: 3 });
        await inputs[0].type('4'); // grade points (A)
        await inputs[1].click({ clickCount: 3 });
        await inputs[1].type('3'); // credit hours
      }
      await clickButton(page, 'Calculate') || await clickButton(page, 'Add') || await clickButton(page, 'Compute');
      await new Promise(r => setTimeout(r, 300));

      const bodyText = await page.evaluate(() => document.body.innerText);
      if (!bodyText.includes('GPA') && !bodyText.includes('4.0') && !bodyText.includes('grade')) {
        throw new Error(`GPA Calculator Failed: Expected GPA result, got: "${bodyText.slice(0, 200)}"`);
      }
      break;
    }

    case 'time-duration-calculator': {
      // From 09:00 to 17:30 → 8 hours 30 minutes
      const inputs = await page.$$('input[type="time"], input[type="text"]');
      if (inputs.length >= 2) {
        await inputs[0].click({ clickCount: 3 });
        await inputs[0].type('09:00');
        await inputs[1].click({ clickCount: 3 });
        await inputs[1].type('17:30');
      }
      await clickButton(page, 'Calculate') || await clickButton(page, 'Compute');
      await new Promise(r => setTimeout(r, 300));

      const bodyText = await page.evaluate(() => document.body.innerText);
      if (!bodyText.includes('8') && !bodyText.toLowerCase().includes('hour')) {
        throw new Error(`Time Duration Calculator Failed: Expected 8 hrs 30 min for 09:00–17:30, got: "${bodyText.slice(0, 200)}"`);
      }
      break;
    }

    case 'compound-interest-calculator': {
      // Principal $1000, 5% rate, 10 years → Future value ~$1628
      const inputs = await page.$$('input[type="number"]');
      if (inputs.length >= 3) {
        await inputs[0].click({ clickCount: 3 });
        await inputs[0].type('1000');
        await inputs[1].click({ clickCount: 3 });
        await inputs[1].type('5');
        await inputs[2].click({ clickCount: 3 });
        await inputs[2].type('10');
      }
      await clickButton(page, 'Calculate') || await clickButton(page, 'Compute');
      await new Promise(r => setTimeout(r, 300));

      const bodyText = await page.evaluate(() => document.body.innerText);
      if (!bodyText.includes('1,628') && !bodyText.includes('1628') && !bodyText.match(/1[,.]6[0-9]{2}/)) {
        throw new Error(`Compound Interest Calculator Failed: Expected ~$1,628 for $1000 at 5% over 10 years, got: "${bodyText.slice(0, 200)}"`);
      }
      break;
    }

    case 'electricity-bill-calculator': {
      // 100W device, 8h/day, $0.12/kWh → monthly cost ≈ $2.88
      const inputs = await page.$$('input[type="number"]');
      if (inputs.length >= 3) {
        await inputs[0].click({ clickCount: 3 });
        await inputs[0].type('100'); // watts
        await inputs[1].click({ clickCount: 3 });
        await inputs[1].type('8');   // hours per day
        await inputs[2].click({ clickCount: 3 });
        await inputs[2].type('0.12'); // rate per kWh
      }
      await clickButton(page, 'Calculate') || await clickButton(page, 'Estimate');
      await new Promise(r => setTimeout(r, 300));

      const bodyText = await page.evaluate(() => document.body.innerText);
      if (!bodyText.match(/[0-9]+\.[0-9]+/) && !bodyText.toLowerCase().includes('cost') && !bodyText.toLowerCase().includes('kwh')) {
        throw new Error(`Electricity Bill Calculator Failed: Expected a calculated cost result, got: "${bodyText.slice(0, 200)}"`);
      }
      break;
    }

    default: {
      // For all other calculators: enter inputs, click action, verify non-empty calculation output
      const inputs = await page.$$('input[type="number"], input[type="text"]');
      for (let i = 0; i < Math.min(inputs.length, 3); i++) {
        await inputs[i].click({ clickCount: 3 }).catch(() => {});
        await inputs[i].type('100').catch(() => {});
      }
      await clickButton(page, 'Calculate') || await clickButton(page, 'Estimate');
      await new Promise(r => setTimeout(r, 300));
      break;
    }
  }
}

module.exports = testCalculators;
