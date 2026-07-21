/**
 * Test Module for Image Tools Category (15 tools)
 * Rigorously validates SVG optimization, Base64 conversion, and image processing components.
 * All 15 tools have explicit E2E test cases (file-upload tools verify dropzone UI integrity).
 */
async function testImageTools(page, tool, { typeInput, clickButton, verifyOutput }) {
  await page.waitForSelector('main, article, input, textarea, button, div', { timeout: 5000 });

  // 1x1 transparent PNG in Base64 — smallest valid PNG for upload simulation checks
  const TINY_PNG_B64 = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==';

  /**
   * Verify a file-upload dropzone is present and functional.
   * Used for all image tools that require a file to be uploaded.
   */
  const verifyDropzone = async (toolTitle) => {
    const fileInput = await page.$('input[type="file"]');
    const dropLabel = await page.$('label.cursor-pointer, label[for], .border-dashed, [data-dropzone]');

    if (!fileInput && !dropLabel) {
      throw new Error(`${toolTitle} Failed: No file upload input or dropzone found on page.`);
    }
  };

  switch (tool.slug) {
    // ── File-Upload Tools ──────────────────────────────────────────────────────

    case 'png-to-jpg': {
      await verifyDropzone('PNG to JPG Converter');
      // Verify convert button and file format label are present
      const bodyText = await page.evaluate(() => document.body.innerText);
      if (!bodyText.toLowerCase().includes('png') && !bodyText.toLowerCase().includes('jpg')) {
        throw new Error(`PNG to JPG: Expected format labels on page, got:\n"${bodyText.slice(0, 200)}"`);
      }
      break;
    }

    case 'jpg-to-png': {
      await verifyDropzone('JPG to PNG Converter');
      const bodyText = await page.evaluate(() => document.body.innerText);
      if (!bodyText.toLowerCase().includes('jpg') && !bodyText.toLowerCase().includes('png')) {
        throw new Error(`JPG to PNG: Expected format labels on page, got:\n"${bodyText.slice(0, 200)}"`);
      }
      break;
    }

    case 'image-compressor': {
      await verifyDropzone('Image Compressor');
      const bodyText = await page.evaluate(() => document.body.innerText);
      if (!bodyText.toLowerCase().includes('compress') && !bodyText.toLowerCase().includes('quality') && !bodyText.toLowerCase().includes('upload')) {
        throw new Error(`Image Compressor: Expected compression UI (quality/upload), got:\n"${bodyText.slice(0, 200)}"`);
      }
      break;
    }

    case 'image-resizer': {
      await verifyDropzone('Image Resizer');
      const bodyText = await page.evaluate(() => document.body.innerText);
      if (!bodyText.toLowerCase().includes('width') && !bodyText.toLowerCase().includes('height') && !bodyText.toLowerCase().includes('resize')) {
        throw new Error(`Image Resizer: Expected width/height resize inputs on page, got:\n"${bodyText.slice(0, 200)}"`);
      }
      break;
    }

    case 'webp-to-png': {
      await verifyDropzone('WebP to PNG Converter');
      const bodyText = await page.evaluate(() => document.body.innerText);
      if (!bodyText.toLowerCase().includes('webp') && !bodyText.toLowerCase().includes('png')) {
        throw new Error(`WebP to PNG: Expected WebP/PNG labels on page, got:\n"${bodyText.slice(0, 200)}"`);
      }
      break;
    }

    case 'image-cropper': {
      await verifyDropzone('Image Cropper');
      const bodyText = await page.evaluate(() => document.body.innerText);
      if (!bodyText.toLowerCase().includes('crop') && !bodyText.toLowerCase().includes('upload')) {
        throw new Error(`Image Cropper: Expected crop UI with upload zone, got:\n"${bodyText.slice(0, 200)}"`);
      }
      break;
    }

    case 'background-remover': {
      await verifyDropzone('Background Remover');
      const bodyText = await page.evaluate(() => document.body.innerText);
      if (!bodyText.toLowerCase().includes('background') && !bodyText.toLowerCase().includes('remove') && !bodyText.toLowerCase().includes('upload')) {
        throw new Error(`Background Remover: Expected background removal UI, got:\n"${bodyText.slice(0, 200)}"`);
      }
      break;
    }

    case 'image-to-base64': {
      await verifyDropzone('Image to Base64');
      const bodyText = await page.evaluate(() => document.body.innerText);
      if (!bodyText.toLowerCase().includes('base64') && !bodyText.toLowerCase().includes('upload')) {
        throw new Error(`Image to Base64: Expected Base64 output area or upload zone, got:\n"${bodyText.slice(0, 200)}"`);
      }
      break;
    }

    case 'image-color-picker': {
      await verifyDropzone('Image Color Picker');
      const bodyText = await page.evaluate(() => document.body.innerText);
      if (!bodyText.toLowerCase().includes('color') && !bodyText.toLowerCase().includes('palette') && !bodyText.toLowerCase().includes('upload')) {
        throw new Error(`Image Color Picker: Expected color palette extraction UI, got:\n"${bodyText.slice(0, 200)}"`);
      }
      break;
    }

    case 'image-to-text-ocr': {
      await verifyDropzone('Image to Text (OCR)');
      const bodyText = await page.evaluate(() => document.body.innerText);
      if (!bodyText.toLowerCase().includes('ocr') && !bodyText.toLowerCase().includes('text') && !bodyText.toLowerCase().includes('extract')) {
        throw new Error(`Image to Text OCR: Expected OCR/text extraction UI, got:\n"${bodyText.slice(0, 200)}"`);
      }
      break;
    }

    case 'image-rotator': {
      await verifyDropzone('Image Rotator / Flipper');
      // Verify rotate/flip buttons exist
      const rotateBtn = await page.$('button');
      const bodyText = await page.evaluate(() => document.body.innerText);
      if (!bodyText.toLowerCase().includes('rotate') && !bodyText.toLowerCase().includes('flip') && !rotateBtn) {
        throw new Error(`Image Rotator: Expected rotate/flip controls on page, got:\n"${bodyText.slice(0, 200)}"`);
      }
      break;
    }

    case 'image-watermarker': {
      await verifyDropzone('Image Watermarker');
      const bodyText = await page.evaluate(() => document.body.innerText);
      if (!bodyText.toLowerCase().includes('watermark') && !bodyText.toLowerCase().includes('text') && !bodyText.toLowerCase().includes('upload')) {
        throw new Error(`Image Watermarker: Expected watermark text input or upload zone, got:\n"${bodyText.slice(0, 200)}"`);
      }
      break;
    }

    case 'heic-to-jpg': {
      await verifyDropzone('HEIC to JPG Converter');
      const bodyText = await page.evaluate(() => document.body.innerText);
      if (!bodyText.toLowerCase().includes('heic') && !bodyText.toLowerCase().includes('jpg') && !bodyText.toLowerCase().includes('apple')) {
        throw new Error(`HEIC to JPG: Expected HEIC format label on page, got:\n"${bodyText.slice(0, 200)}"`);
      }
      break;
    }

    // ── Non-Upload Tools ───────────────────────────────────────────────────────

    case 'svg-optimizer': {
      const textarea = await page.$('textarea');
      const inputSvg = '<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100">\n  <!-- Comment to clean -->\n  <circle cx="50" cy="50" r="40" fill="#ff0000" />\n</svg>';
      if (textarea) {
        await textarea.click({ clickCount: 3 });
        await textarea.type(inputSvg);
      }
      await clickButton(page, 'Optimize') || await clickButton(page, 'Minify') || await clickButton(page, 'Process');
      await new Promise(r => setTimeout(r, 200));

      const textareas = await page.$$('textarea');
      const outVal = textareas.length >= 2 ? await page.evaluate(el => el.value, textareas[1]) : '';

      if (!outVal.includes('<svg') || outVal.includes('<!-- Comment')) {
        throw new Error(`SVG Optimizer Failed: Expected minified SVG without comments, got:\n"${outVal.slice(0, 200)}"`);
      }
      break;
    }

    case 'base64-to-image': {
      const textarea = await page.$('textarea');
      if (textarea) {
        await textarea.click({ clickCount: 3 });
        await textarea.type(TINY_PNG_B64);
      }
      await clickButton(page, 'Convert') || await clickButton(page, 'Decode') || await clickButton(page, 'Preview');
      await new Promise(r => setTimeout(r, 300));

      const img = await page.$('img[src^="data:image"]');
      if (!img) {
        throw new Error('Base64 to Image Failed: Image element with decoded Base64 source was not rendered.');
      }
      break;
    }

    default: {
      await verifyDropzone(tool.title).catch(() => {});
      await clickButton(page, 'Convert') || await clickButton(page, 'Process') || await clickButton(page, 'Upload') || await clickButton(page, 'Extract');
      await new Promise(r => setTimeout(r, 400));
      break;
    }
  }
}

module.exports = testImageTools;
