'use client';

import { useState, useRef } from 'react';
import { ToolDefinition } from '@/lib/tools/registry';
import { useToolJob } from '@/hooks/use-tool-job';
import { JobProgressModal } from '@/components/tools/JobProgressModal';
import { FiUploadCloud, FiImage, FiDownload, FiCheck, FiCpu, FiSliders, FiCopy } from 'react-icons/fi';

export const ImageToolModule = ({ tool }: { tool: ToolDefinition }) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [convertedUrl, setConvertedUrl] = useState<string | null>(null);
  const [base64Output, setBase64Output] = useState<string>('');
  const [quality, setQuality] = useState<number>(80);
  const [width, setWidth] = useState<number>(800);
  const [height, setHeight] = useState<number>(600);

  // SVG Optimizer state
  const [svgInput, setSvgInput] = useState<string>(
    `<!-- Example SVG with comments -->\n<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100">\n  <!-- Circle shape -->\n  <circle cx="50" cy="50" r="40" fill="#3b82f6" />\n</svg>`
  );
  const [svgOutput, setSvgOutput] = useState<string>('');

  // Base64 to Image state
  const [b64Input, setB64Input] = useState<string>('');
  const [b64ImageSrc, setB64ImageSrc] = useState<string>('');
  const [b64Error, setB64Error] = useState<string>('');

  // Favicon Generator state
  const [faviconSrc, setFaviconSrc] = useState<string | null>(null);
  const [faviconSizes, setFaviconSizes] = useState<{ size: number; dataUrl: string }[]>([]);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const { jobState, startJob, resetJob, isProcessing } = useToolJob(tool.id);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
      setConvertedUrl(null);
      setBase64Output('');

      // Auto convert to Base64 if tool is image-to-base64
      if (tool.id === 'image-to-base64') {
        const reader = new FileReader();
        reader.onloadend = () => {
          setBase64Output(reader.result as string);
        };
        reader.readAsDataURL(file);
      }
    }
  };

  const handleClientImageConversion = () => {
    if (!previewUrl) return;

    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.src = previewUrl;

    img.onload = () => {
      const canvas = document.createElement('canvas');
      const targetW = tool.id === 'image-resizer' ? width : img.width;
      const targetH = tool.id === 'image-resizer' ? height : img.height;

      canvas.width = targetW;
      canvas.height = targetH;

      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      ctx.drawImage(img, 0, 0, targetW, targetH);

      let format = 'image/png';
      if (tool.id === 'png-to-jpg' || tool.id === 'image-compressor') {
        format = 'image/jpeg';
      } else if (tool.id === 'webp-to-png' || tool.id === 'jpg-to-png') {
        format = 'image/png';
      }

      const dataUrl = canvas.toDataURL(format, quality / 100);
      setConvertedUrl(dataUrl);
    };
  };

  const handleAsyncImageJob = () => {
    if (!selectedFile) return;
    startJob({ fileName: selectedFile.name, fileSize: selectedFile.size, quality });
  };

  const optimizeSvg = () => {
    // Strip XML/SVG comments, collapse excess whitespace, trim
    let out = svgInput
      .replace(/<!--[\s\S]*?-->/g, '')   // remove comments
      .replace(/\s+/g, ' ')               // collapse whitespace
      .replace(/> </g, '><')              // remove space between tags
      .trim();
    setSvgOutput(out);
  };

  const decodeBase64Image = () => {
    setB64Error('');
    setB64ImageSrc('');
    const raw = b64Input.trim();
    if (!raw) { setB64Error('Please enter a Base64 string.'); return; }
    const src = raw.startsWith('data:') ? raw : `data:image/png;base64,${raw}`;
    setB64ImageSrc(src);
  };

  const generateFavicons = () => {
    if (!faviconSrc) return;
    const sizes = [16, 32, 48, 64, 128, 180, 192, 256, 512];
    const results: { size: number; dataUrl: string }[] = [];

    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.src = faviconSrc;

    img.onload = () => {
      sizes.forEach((size) => {
        const canvas = document.createElement('canvas');
        canvas.width = size;
        canvas.height = size;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0, size, size);
          results.push({ size, dataUrl: canvas.toDataURL('image/png') });
        }
      });
      setFaviconSizes(results);
    };
  };

  const downloadFavicon = (dataUrl: string, size: number) => {
    const a = document.createElement('a');
    a.href = dataUrl;
    a.download = `favicon-${size}x${size}.png`;
    a.click();
  };

  const downloadAllFavicons = () => {
    faviconSizes.forEach(({ dataUrl, size }) => {
      setTimeout(() => downloadFavicon(dataUrl, size), 100);
    });
  };

  return (
    <div className="space-y-6">
      {/* SVG Optimizer — dedicated UI */}
      {tool.id === 'svg-optimizer' && (
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase text-stone-500 mb-1">SVG Input</label>
            <textarea
              rows={8}
              value={svgInput}
              onChange={(e) => setSvgInput(e.target.value)}
              className="w-full p-4 bg-stone-50 dark:bg-zinc-950 border border-stone-200 dark:border-zinc-800 rounded-2xl font-mono text-xs focus:ring-2 focus:ring-primary/50 outline-none"
              placeholder="Paste your SVG markup here..."
            />
          </div>
          <button
            onClick={optimizeSvg}
            className="w-full py-3.5 bg-primary hover:bg-primary/90 text-white font-bold text-sm rounded-xl shadow-lg transition-all"
          >
            Optimize SVG
          </button>
          {svgOutput && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold uppercase text-primary">Optimized SVG Output</label>
                <button
                  onClick={() => navigator.clipboard.writeText(svgOutput)}
                  className="text-xs font-bold text-primary hover:underline flex items-center gap-1"
                >
                  <FiCopy size={12} /> Copy
                </button>
              </div>
              <textarea
                rows={6}
                readOnly
                value={svgOutput}
                className="w-full p-4 bg-stone-50 dark:bg-zinc-950 border border-primary/30 rounded-2xl font-mono text-xs outline-none"
              />
              <div className="text-xs text-stone-500 font-mono">
                Original: {svgInput.length} chars → Optimized: {svgOutput.length} chars
                {' '}({Math.round((1 - svgOutput.length / svgInput.length) * 100)}% reduction)
              </div>
            </div>
          )}
        </div>
      )}

      {/* SVG to PNG/JPG Converter */}
      {tool.id === 'svg-to-raster' && (
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase text-stone-500 mb-1">SVG Input</label>
            <textarea rows={8} value={svgInput} onChange={(e) => setSvgInput(e.target.value)} className="w-full p-4 bg-stone-50 dark:bg-zinc-950 border border-stone-200 dark:border-zinc-800 rounded-2xl font-mono text-xs focus:ring-2 focus:ring-primary/50 outline-none" placeholder="Paste your SVG markup here..." />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold uppercase text-stone-500 mb-1">Width (px)</label>
              <input type="number" min={16} max={4096} value={width} onChange={(e) => setWidth(Number(e.target.value))} className="w-full p-3 bg-stone-50 dark:bg-zinc-950 border border-stone-200 dark:border-zinc-800 rounded-xl font-mono text-sm" />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase text-stone-500 mb-1">Height (px)</label>
              <input type="number" min={16} max={4096} value={height} onChange={(e) => setHeight(Number(e.target.value))} className="w-full p-3 bg-stone-50 dark:bg-zinc-950 border border-stone-200 dark:border-zinc-800 rounded-xl font-mono text-sm" />
            </div>
          </div>
          <div>
            <label className="block text-xs font-bold uppercase text-stone-500 mb-1">Output Format</label>
            <div className="flex gap-2">
              <button onClick={() => startJob({ svg: svgInput, format: 'png', width, height })} disabled={isProcessing} className="flex-1 py-3 bg-primary hover:bg-primary/90 disabled:opacity-50 text-white font-bold text-xs rounded-xl transition-all">Convert to PNG</button>
              <button onClick={() => startJob({ svg: svgInput, format: 'jpg', width, height })} disabled={isProcessing} className="flex-1 py-3 bg-stone-200 dark:bg-zinc-800 hover:bg-stone-300 dark:hover:bg-zinc-700 text-stone-800 dark:text-zinc-200 font-bold text-xs rounded-xl transition-all">Convert to JPG</button>
            </div>
          </div>
        </div>
      )}

      {/* Base64 to Image decoder */}
      {tool.id === 'base64-to-image' && (
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase text-stone-500 mb-1">Base64 Encoded String</label>
            <textarea
              rows={5}
              value={b64Input}
              onChange={(e) => setB64Input(e.target.value)}
              placeholder="Paste Base64 string or data URL (data:image/png;base64,...)"
              className="w-full p-4 bg-stone-50 dark:bg-zinc-950 border border-stone-200 dark:border-zinc-800 rounded-2xl font-mono text-xs focus:ring-2 focus:ring-primary/50 outline-none"
            />
          </div>
          <button
            id="decode-btn"
            onClick={decodeBase64Image}
            className="w-full py-3.5 bg-primary hover:bg-primary/90 text-white font-bold text-sm rounded-xl shadow-lg transition-all"
          >
            Decode &amp; Preview Image
          </button>
          {b64Error && (
            <div className="p-3 bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-800 rounded-xl text-rose-600 dark:text-rose-400 text-xs font-bold">
              {b64Error}
            </div>
          )}
          {b64ImageSrc && (
            <div className="space-y-2">
              <span className="text-xs uppercase font-bold text-primary">Decoded Image Preview</span>
              <div className="p-4 bg-stone-50 dark:bg-zinc-950 border border-primary/30 rounded-2xl flex items-center justify-center min-h-[200px]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={b64ImageSrc}
                  alt="Decoded from Base64"
                  className="max-h-72 max-w-full rounded-xl object-contain"
                  onError={() => { setB64ImageSrc(''); setB64Error('Invalid Base64 — could not decode image.'); }}
                />
              </div>
              <a
                href={b64ImageSrc}
                download="decoded-image.png"
                className="inline-flex items-center gap-1 text-xs font-bold text-primary hover:underline"
              >
                <FiDownload size={14} /> Download Image
              </a>
            </div>
          )}
        </div>
      )}

      {/* Favicon Generator */}
      {tool.id === 'favicon-generator' && (
        <div className="space-y-6">
          <div className="p-4 bg-stone-50 dark:bg-zinc-950 border border-stone-200 dark:border-zinc-800 rounded-2xl space-y-3">
            <label className="block text-xs font-bold uppercase text-stone-500">Upload Master Image</label>
            <div
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-stone-300 dark:border-zinc-800 hover:border-primary/50 rounded-xl p-6 text-center cursor-pointer transition-all"
            >
              <input
                type="file"
                ref={fileInputRef}
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    const url = URL.createObjectURL(file);
                    setFaviconSrc(url);
                    setFaviconSizes([]);
                  }
                }}
                accept="image/*"
                className="hidden"
              />
              {faviconSrc ? (
                /* eslint-disable-next-line @next/next/no-img-element */
                <img src={faviconSrc} alt="Favicon source" className="mx-auto h-24 rounded-xl object-contain" />
              ) : (
                <p className="text-xs font-bold text-stone-500">Click to upload PNG or SVG master image</p>
              )}
            </div>
          </div>

          {faviconSrc && (
            <button
              onClick={generateFavicons}
              className="w-full py-3.5 bg-primary hover:bg-primary/90 text-white font-bold text-sm rounded-xl shadow-lg transition-all flex items-center justify-center gap-2"
            >
              Generate All Favicon Sizes
            </button>
          )}

          {faviconSizes.length > 0 && (
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-xs font-bold uppercase text-stone-500">
                  Generated Favicons ({faviconSizes.length} sizes)
                </span>
                <button
                  onClick={downloadAllFavicons}
                  className="text-xs font-bold text-primary hover:underline flex items-center gap-1"
                >
                  <FiDownload size={14} /> Download All
                </button>
              </div>
              <div className="grid grid-cols-3 sm:grid-cols-5 gap-3">
                {faviconSizes.map(({ size, dataUrl }) => (
                  <div
                    key={size}
                    onClick={() => downloadFavicon(dataUrl, size)}
                    className="p-3 bg-stone-50 dark:bg-zinc-950 border border-stone-200 dark:border-zinc-800 rounded-xl flex flex-col items-center gap-2 cursor-pointer hover:border-primary/50 transition-all group"
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={dataUrl} alt={`${size}x${size}`} className="rounded-lg" style={{ width: Math.min(size, 48), height: Math.min(size, 48) }} />
                    <span className="text-[10px] font-mono text-stone-500 group-hover:text-primary transition-colors">{size}x{size}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* File Dropzone — skip for tools that have their own dedicated UI above */}
      {tool.id !== 'svg-optimizer' && tool.id !== 'base64-to-image' && tool.id !== 'favicon-generator' && (
        <>
          <div
            onClick={() => fileInputRef.current?.click()}
            className="border-2 border-dashed border-stone-300 dark:border-zinc-800 hover:border-primary/50 dark:hover:border-primary/50 rounded-2xl sm:rounded-3xl p-4 sm:p-8 text-center bg-stone-50 dark:bg-zinc-950 cursor-pointer transition-all group"
          >
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept="image/*"
              className="hidden"
            />
            <FiUploadCloud size={36} className="mx-auto text-stone-400 dark:text-zinc-600 group-hover:text-primary transition-colors mb-2 sm:mb-3" />
            <p className="text-xs sm:text-sm font-bold text-stone-900 dark:text-white">
              {selectedFile ? selectedFile.name : 'Drop image file here or click to browse'}
            </p>
            <p className="text-[11px] sm:text-xs text-stone-500 dark:text-zinc-500 mt-1">
              Supports PNG, JPG, WebP, SVG, HEIC up to 25MB
            </p>
          </div>

          {/* Controls & Sliders */}
          {previewUrl && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-stone-100 dark:bg-zinc-900/40 p-3.5 sm:p-4 rounded-xl sm:rounded-2xl border border-stone-200 dark:border-zinc-800">
              {(tool.id === 'image-compressor' || tool.id === 'png-to-jpg') && (
                <div>
                  <label className="block text-xs font-bold uppercase text-stone-500 mb-1">
                    Quality: {quality}%
                  </label>
                  <input
                    type="range"
                    min={10}
                    max={100}
                    value={quality}
                    onChange={(e) => setQuality(Number(e.target.value))}
                    className="w-full accent-primary"
                  />
                </div>
              )}

              {tool.id === 'image-resizer' && (
                <>
                  <div>
                    <label className="block text-xs font-bold uppercase text-stone-500 mb-1">Width (px)</label>
                    <input
                      type="number"
                      value={width}
                      onChange={(e) => setWidth(Number(e.target.value))}
                      className="w-full p-2 bg-white dark:bg-zinc-950 border border-stone-200 dark:border-zinc-800 rounded-lg text-sm font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase text-stone-500 mb-1">Height (px)</label>
                    <input
                      type="number"
                      value={height}
                      onChange={(e) => setHeight(Number(e.target.value))}
                      className="w-full p-2 bg-white dark:bg-zinc-950 border border-stone-200 dark:border-zinc-800 rounded-lg text-sm font-mono"
                    />
                  </div>
                </>
              )}

              <div className="sm:col-span-2 flex justify-end">
                <button
                  onClick={tool.isAsync ? handleAsyncImageJob : handleClientImageConversion}
                  disabled={isProcessing}
                  className="w-full sm:w-auto px-6 py-2.5 bg-primary hover:bg-primary/90 text-white font-bold text-sm rounded-xl shadow-lg transition-all"
                >
                  {tool.isAsync ? 'Process Image via VPS Job' : 'Process Image'}
                </button>
              </div>
            </div>
          )}

          {/* Image Preview & Output */}
          {previewUrl && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
              <div className="space-y-2">
                <span className="text-xs uppercase font-bold text-stone-500">Original Image</span>
                <div className="p-2 bg-stone-100 dark:bg-zinc-950 border border-stone-200 dark:border-zinc-800 rounded-xl sm:rounded-2xl flex items-center justify-center min-h-[160px] sm:min-h-[200px]">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={previewUrl} alt="Original" className="max-h-60 rounded-xl object-contain" />
                </div>
              </div>

              {convertedUrl && (
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-xs uppercase font-bold text-primary">Processed Result</span>
                    <a
                      href={convertedUrl}
                      download={`converted-${tool.slug}.png`}
                      className="inline-flex items-center gap-1 text-xs font-bold text-primary hover:underline"
                    >
                      <FiDownload size={14} /> Download
                    </a>
                  </div>
                  <div className="p-2 bg-stone-100 dark:bg-zinc-950 border border-primary/30 rounded-2xl flex items-center justify-center min-h-[200px]">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={convertedUrl} alt="Processed" className="max-h-60 rounded-xl object-contain" />
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Base64 Output Text */}
          {base64Output && (
            <div className="space-y-2">
              <span className="text-xs uppercase font-bold text-stone-500">Base64 Data String</span>
              <textarea
                rows={4}
                readOnly
                value={base64Output}
                className="w-full p-3 bg-stone-50 dark:bg-zinc-950 border border-stone-200 dark:border-zinc-800 rounded-xl font-mono text-xs"
              />
            </div>
          )}
        </>
      )}

      <JobProgressModal jobState={jobState} onReset={resetJob} title={tool.title} />
    </div>
  );
};
