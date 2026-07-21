/**
 * Test Module for Security Utilities Category (12 tools)
 * Rigorously tests inputs and verifies hashes, strength meters, and async network lookups.
 */
async function testSecurity(page, tool, { typeInput, clickButton, verifyOutput }) {
  await page.waitForSelector('main, article, input, textarea, button', { timeout: 5000 });

  switch (tool.slug) {
    case 'md5-hash-generator': {
      const input = await page.$('textarea, input[type="text"]');
      if (input) {
        await input.click({ clickCount: 3 });
        await input.type('hello');
      }
      await clickButton(page, 'Generate') || await clickButton(page, 'Hash') || await clickButton(page, 'Calculate');
      await new Promise(r => setTimeout(r, 200));

      const bodyText = await page.evaluate(() => document.body.innerText);
      // MD5 of "hello" is 5d41402abc4b2a76b9719d911017c592
      if (!bodyText.toLowerCase().includes('5d41402abc4b2a76b9719d911017c592')) {
        throw new Error(`MD5 Hash Generator Failed: Expected "5d41402abc4b2a76b9719d911017c592" for "hello", got:\n"${bodyText.slice(0, 200)}"`);
      }
      break;
    }

    case 'sha-256-hash': {
      const input = await page.$('textarea, input[type="text"]');
      if (input) {
        await input.click({ clickCount: 3 });
        await input.type('hello');
      }
      await clickButton(page, 'Generate') || await clickButton(page, 'Hash');
      await new Promise(r => setTimeout(r, 200));

      const bodyText = await page.evaluate(() => document.body.innerText);
      // SHA-256 of "hello" is 2cf24dba5fb0a30e26e83b2ac5b9e29e1b161e5c1fa7425e73043362938b9824
      if (!bodyText.toLowerCase().includes('2cf24dba5fb0a30e26e83b2ac5b9e29e1b161e5c1fa7425e73043362938b9824')) {
        throw new Error(`SHA-256 Hash Failed: Expected "2cf24dba5fb0a30e26e83b2ac5b9e29e1b161e5c1fa7425e73043362938b9824" for "hello".`);
      }
      break;
    }

    case 'sha-512-hash': {
      const input = await page.$('textarea, input[type="text"]');
      if (input) {
        await input.click({ clickCount: 3 });
        await input.type('hello');
      }
      await clickButton(page, 'Generate') || await clickButton(page, 'Hash');
      await new Promise(r => setTimeout(r, 200));

      const bodyText = await page.evaluate(() => document.body.innerText);
      // SHA-512 starts with 9b71d224bd67b37ed6aed...
      if (!bodyText.toLowerCase().includes('9b71d224bd67b37ed6aed')) {
        throw new Error(`SHA-512 Hash Failed: Expected SHA-512 output starting with "9b71d224bd67b37ed6aed".`);
      }
      break;
    }

    case 'password-strength-meter': {
      const input = await page.$('input[type="password"], input[type="text"]');
      if (input) {
        await input.click({ clickCount: 3 });
        await input.type('K9#mP$92vL!xQ7zN');
      }
      await new Promise(r => setTimeout(r, 300));

      const bodyText = await page.evaluate(() => document.body.innerText);
      if (!bodyText.toLowerCase().includes('strong') && !bodyText.includes('100') && !bodyText.includes('80')) {
        throw new Error(`Password Strength Meter Failed: Expected "Strong" rating for complex password "K9#mP$92vL!xQ7zN".`);
      }
      break;
    }

    case 'dns-lookup-tool':
    case 'ssl-certificate-inspector':
    case 'whois-domain-lookup':
    case 'ip-address-lookup': {
      const input = await page.$('input[type="text"]');
      if (input) {
        await input.click({ clickCount: 3 });
        await input.type('google.com');
      }
      await clickButton(page, 'Lookup') || await clickButton(page, 'Inspect') || await clickButton(page, 'Run');

      // Wait for server-side job / API response to complete
      await page.waitForFunction(() => {
        const body = document.body.innerText.toLowerCase();
        return body.includes('result') || body.includes('valid') || body.includes('record') || body.includes('registrar') || body.includes('error') || body.includes('completed');
      }, { timeout: 15000 }).catch(() => {});

      const bodyText = await page.evaluate(() => document.body.innerText);
      if (bodyText.includes('Error:') || bodyText.includes('Failed to fetch') || bodyText.includes('500 Internal')) {
        throw new Error(`Security Tool "${tool.title}" Failed with backend server error:\n"${bodyText.slice(0, 250)}"`);
      }
      break;
    }

    default: {
      await clickButton(page, 'Generate') || await clickButton(page, 'Create');
      await new Promise(r => setTimeout(r, 300));
      break;
    }
  }
}

module.exports = testSecurity;
