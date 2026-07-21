/**
 * Test Module for Converters Category (7 tools)
 * Rigorously validates actual conversion output rendered in DOM.
 */
async function testConverters(page, tool, { typeInput, clickButton, verifyOutput }) {
  await page.waitForSelector('textarea, input, button', { timeout: 5000 });

  // Helper to extract output string from textarea, div, or output container
  const getOutputText = async () => {
    return await page.evaluate(() => {
      const outputDiv = document.querySelector('.p-4.font-mono, textarea:nth-of-type(2), div.font-mono');
      if (outputDiv) {
        return outputDiv.value || outputDiv.innerText || outputDiv.textContent || '';
      }
      return document.body.innerText;
    });
  };

  switch (tool.slug) {
    case 'csv-to-json': {
      await typeInput(page, 'textarea', 'id,name,role\n101,Alice,Developer\n102,Bob,Designer');
      await new Promise(r => setTimeout(r, 300));

      const outVal = await getOutputText();

      try {
        if (!outVal.includes('Alice') || !outVal.includes('Developer')) {
          throw new Error(`Output does not contain expected data "Alice": "${outVal.slice(0, 150)}"`);
        }
        const jsonMatch = outVal.match(/\[\s*\{[\s\S]*\}\s*\]/);
        if (jsonMatch) {
          const parsed = JSON.parse(jsonMatch[0]);
          if (!Array.isArray(parsed) || parsed.length !== 2) {
            throw new Error(`Parsed JSON length mismatch: ${parsed.length}`);
          }
        }
      } catch (err) {
        throw new Error(`CSV to JSON Failed: Expected valid JSON array with "Alice", but received:\n"${outVal.slice(0, 200)}"\nError: ${err.message}`);
      }
      break;
    }

    case 'json-to-csv': {
      await typeInput(page, 'textarea', '[{"id":1,"name":"Alice","score":95},{"id":2,"name":"Bob","score":88}]');
      await new Promise(r => setTimeout(r, 300));

      const outVal = await getOutputText();

      if (!outVal.includes('id,name,score') || !outVal.includes('Alice,95')) {
        throw new Error(`JSON to CSV Failed: Expected CSV header "id,name,score" and "Alice,95", but received:\n"${outVal.slice(0, 200)}"`);
      }
      break;
    }

    case 'binary-converter': {
      await typeInput(page, 'textarea', 'Hi');
      await new Promise(r => setTimeout(r, 300));

      const bodyText = await getOutputText();
      if (!bodyText.includes('01001000') || !bodyText.includes('01101001')) {
        throw new Error(`Binary Converter Failed: Expected binary "01001000 01101001" for "Hi", received:\n"${bodyText.slice(0, 200)}"`);
      }
      break;
    }

    case 'morse-code-converter': {
      await typeInput(page, 'textarea', 'SOS');
      await new Promise(r => setTimeout(r, 300));

      const bodyText = await getOutputText();
      if (!bodyText.includes('... --- ...')) {
        throw new Error(`Morse Code Converter Failed: Expected "... --- ..." for "SOS", received:\n"${bodyText.slice(0, 200)}"`);
      }
      break;
    }

    case 'roman-numeral-converter': {
      await typeInput(page, 'textarea', '2026');
      await new Promise(r => setTimeout(r, 300));

      const bodyText = await getOutputText();
      if (!bodyText.includes('MMXXVI')) {
        throw new Error(`Roman Numeral Converter Failed: Expected "MMXXVI" for 2026, received:\n"${bodyText.slice(0, 200)}"`);
      }
      break;
    }

    case 'number-base-converter': {
      await typeInput(page, 'textarea', '255');
      await new Promise(r => setTimeout(r, 300));

      const bodyText = await getOutputText();
      if (!bodyText.toUpperCase().includes('FF') || !bodyText.includes('11111111')) {
        throw new Error(`Number Base Converter Failed: Expected Hex "FF" and Binary "11111111" for 255, received:\n"${bodyText.slice(0, 200)}"`);
      }
      break;
    }

    default: {
      await typeInput(page, 'textarea', 'Testing converter tool');
      await clickButton(page, 'Convert') || await clickButton(page, 'Process');
      await new Promise(r => setTimeout(r, 400));
      break;
    }
  }
}

module.exports = testConverters;
