'use client';

import { useState, useRef } from 'react';
import { ToolDefinition } from '@/lib/tools/registry';
import { useToolJob } from '@/hooks/use-tool-job';
import { JobProgressModal } from '@/components/tools/JobProgressModal';
import { FiUploadCloud, FiImage, FiDownload, FiCheck, FiCpu, FiSliders } from 'react-icons/fi';

export const ImageToolModule = ({ tool }: { tool: ToolDefinition }) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [convertedUrl, setConvertedUrl] = useState<string | null>(null);
  const [base64Output, setBase64Output] = useState<string>('');
  const [quality, setQuality] = useState<number>(80);
  const [width, setWidth] = useState<number>(800);
  const [height, setHeight] = useState<number>(600);

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

  return (
    <div className="space-y-6">
      {/* File Dropzone */}
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

      <JobProgressModal jobState={jobState} onReset={resetJob} title={tool.title} />
    </div>
  );
};
