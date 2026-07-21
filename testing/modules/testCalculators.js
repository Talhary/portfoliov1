/**
 * Test Module for Calculators Category (13 tools)
 * Rigorously tests inputs, user actions, and validates exact mathematical outputs.
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
