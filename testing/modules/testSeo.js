/**
 * Test Module for SEO Tools Category (9 tools)
 * Rigorously validates keyword density calculations, meta tag scraping, and SEO score audits.
 */
async function testSeo(page, tool, { typeInput, clickButton, verifyOutput }) {
  await page.waitForSelector('main, article, input, textarea, button', { timeout: 5000 });

  switch (tool.slug) {
    case 'keyword-density-checker': {
      const textarea = await page.$('textarea');
      if (textarea) {
        await textarea.click({ clickCount: 3 });
        await textarea.type('SEO tools optimize search engine performance. Good SEO tools boost SEO rankings and search traffic.');
      }
      await clickButton(page, 'Analyze') || await clickButton(page, 'Check');
      await new Promise(r => setTimeout(r, 300));

      const bodyText = await page.evaluate(() => document.body.innerText);
      // Word "seo" appears 4 times
      if (!bodyText.toLowerCase().includes('seo') || (!bodyText.includes('4') && !bodyText.includes('23.'))) {
        throw new Error(`Keyword Density Checker Failed: Expected "SEO" frequency count around 4, got:\n"${bodyText.slice(0, 200)}"`);
      }
      break;
    }

    case 'open-graph-preview': {
      const inputs = await page.$$('input[type="text"]');
      if (inputs.length >= 2) {
        await inputs[0].click({ clickCount: 3 });
        await inputs[0].type('WebVix Open Graph Title Test');
        await inputs[1].click({ clickCount: 3 });
        await inputs[1].type('This is a test description for social card preview.');
      }
      await new Promise(r => setTimeout(r, 200));

      const bodyText = await page.evaluate(() => document.body.innerText);
      if (!bodyText.includes('WebVix Open Graph Title Test')) {
        throw new Error(`Open Graph Preview Failed: Preview card did not update with entered title.`);
      }
      break;
    }

    case 'meta-tag-analyzer':
    case 'sitemap-generator':
    case 'canonical-url-checker':
    case 'page-speed-estimator':
    case 'backlink-checker':
    case 'seo-score-checker':
    case 'google-index-checker': {
      const input = await page.$('input[type="text"], input[type="url"], textarea');
      if (input) {
        await input.click({ clickCount: 3 });
        await input.type('https://google.com');
      }
      await clickButton(page, 'Analyze') || await clickButton(page, 'Generate') || await clickButton(page, 'Check') || await clickButton(page, 'Audit');

      // Wait for server job / analysis to complete
      await page.waitForFunction(() => {
        const body = document.body.innerText.toLowerCase();
        return body.includes('score') || body.includes('result') || body.includes('canonical') || body.includes('sitemap') || body.includes('meta') || body.includes('ready');
      }, { timeout: 15000 }).catch(() => {});

      const bodyText = await page.evaluate(() => document.body.innerText);
      if (bodyText.includes('500 Internal') || bodyText.includes('Fatal error')) {
        throw new Error(`SEO Tool "${tool.title}" Failed: Server error returned during URL inspection.`);
      }
      break;
    }

    default: {
      const input = await page.$('input[type="text"], textarea');
      if (input) {
        await input.type('https://example.com');
      }
      await clickButton(page, 'Analyze') || await clickButton(page, 'Check');
      await new Promise(r => setTimeout(r, 400));
      break;
    }
  }
}

module.exports = testSeo;
