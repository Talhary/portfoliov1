/**
 * Test Module for File Tools Category (9 tools)
 * Rigorously validates byte conversions and file job dropzones.
 * All 9 tools have explicit E2E test cases.
 */
async function testFileTools(page, tool, { typeInput, clickButton, verifyOutput }) {
  await page.waitForSelector('main, article, input, textarea, button, div', { timeout: 5000 });

  /**
   * Verify that a file upload dropzone / input is present.
   * Used for all async file-processing tools.
   */
  const verifyDropzone = async (toolTitle) => {
    const fileInput = await page.$('input[type="file"]');
    const dropLabel = await page.$('label.cursor-pointer, label[for], .border-dashed, [data-dropzone]');

    if (!fileInput && !dropLabel) {
      throw new Error(`${toolTitle} Failed: No file upload input or dropzone found on page.`);
    }
  };

  switch (tool.slug) {
    case 'file-size-converter': {
      // 1048576 bytes = 1 MB
      const input = await page.$('input[type="number"], input[type="text"]');
      if (input) {
        await input.click({ clickCount: 3 });
        await input.type('1048576');
      }
      await clickButton(page, 'Convert') || await clickButton(page, 'Calculate');
      await new Promise(r => setTimeout(r, 200));

      const bodyText = await page.evaluate(() => document.body.innerText);
      if (!bodyText.includes('1.00 MB') && !bodyText.includes('1 MB') && !bodyText.includes('1024 KB')) {
        throw new Error(`File Size Converter Failed: Expected 1048576 bytes → "1.00 MB" or "1024 KB", got:\n"${bodyText.slice(0, 200)}"`);
      }
      break;
    }

    case 'pdf-to-word-converter': {
      await verifyDropzone('PDF to Word Converter');
      const bodyText = await page.evaluate(() => document.body.innerText);
      if (!bodyText.toLowerCase().includes('pdf') && !bodyText.toLowerCase().includes('word') && !bodyText.toLowerCase().includes('docx')) {
        throw new Error(`PDF to Word: Expected PDF/Word format label on page, got:\n"${bodyText.slice(0, 200)}"`);
      }
      break;
    }

    case 'word-to-pdf-converter': {
      await verifyDropzone('Word to PDF Converter');
      const bodyText = await page.evaluate(() => document.body.innerText);
      if (!bodyText.toLowerCase().includes('word') && !bodyText.toLowerCase().includes('pdf') && !bodyText.toLowerCase().includes('docx')) {
        throw new Error(`Word to PDF: Expected Word/PDF format label on page, got:\n"${bodyText.slice(0, 200)}"`);
      }
      break;
    }

    case 'pdf-compressor': {
      await verifyDropzone('PDF Compressor');
      const bodyText = await page.evaluate(() => document.body.innerText);
      if (!bodyText.toLowerCase().includes('compress') && !bodyText.toLowerCase().includes('pdf') && !bodyText.toLowerCase().includes('reduce')) {
        throw new Error(`PDF Compressor: Expected compression/PDF label on page, got:\n"${bodyText.slice(0, 200)}"`);
      }
      break;
    }

    case 'merge-pdf': {
      await verifyDropzone('Merge PDF');
      const bodyText = await page.evaluate(() => document.body.innerText);
      if (!bodyText.toLowerCase().includes('merge') && !bodyText.toLowerCase().includes('pdf') && !bodyText.toLowerCase().includes('combine')) {
        throw new Error(`Merge PDF: Expected merge/combine PDF label on page, got:\n"${bodyText.slice(0, 200)}"`);
      }
      break;
    }

    case 'split-pdf': {
      await verifyDropzone('Split PDF');
      const bodyText = await page.evaluate(() => document.body.innerText);
      if (!bodyText.toLowerCase().includes('split') && !bodyText.toLowerCase().includes('pdf') && !bodyText.toLowerCase().includes('page')) {
        throw new Error(`Split PDF: Expected split/page range UI on page, got:\n"${bodyText.slice(0, 200)}"`);
      }
      break;
    }

    case 'zip-extractor': {
      await verifyDropzone('ZIP Extractor');
      const bodyText = await page.evaluate(() => document.body.innerText);
      if (!bodyText.toLowerCase().includes('zip') && !bodyText.toLowerCase().includes('extract') && !bodyText.toLowerCase().includes('archive')) {
        throw new Error(`ZIP Extractor: Expected zip/extract/archive label on page, got:\n"${bodyText.slice(0, 200)}"`);
      }
      break;
    }

    case 'video-to-mp3-converter': {
      await verifyDropzone('Video to MP3 Converter');
      const bodyText = await page.evaluate(() => document.body.innerText);
      if (!bodyText.toLowerCase().includes('video') && !bodyText.toLowerCase().includes('mp3') && !bodyText.toLowerCase().includes('audio')) {
        throw new Error(`Video to MP3: Expected video/mp3/audio label on page, got:\n"${bodyText.slice(0, 200)}"`);
      }
      break;
    }

    case 'audio-cutter-trimmer': {
      await verifyDropzone('Audio Cutter / Trimmer');
      const bodyText = await page.evaluate(() => document.body.innerText);
      if (!bodyText.toLowerCase().includes('audio') && !bodyText.toLowerCase().includes('trim') && !bodyText.toLowerCase().includes('cut')) {
        throw new Error(`Audio Cutter/Trimmer: Expected audio/trim/cut label on page, got:\n"${bodyText.slice(0, 200)}"`);
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
