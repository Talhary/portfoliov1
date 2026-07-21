'use client';

import { useState, useRef } from 'react';
import { ToolDefinition } from '@/lib/tools/registry';
import { useToolJob } from '@/hooks/use-tool-job';
import { JobProgressModal } from '@/components/tools/JobProgressModal';
import { FiUploadCloud, FiFileText, FiScissors, FiArchive, FiMusic, FiFilm, FiImage, FiCopy, FiCheck, FiEye } from 'react-icons/fi';

export const FileToolModule = ({ tool }: { tool: ToolDefinition }) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [pageRange, setPageRange] = useState<string>('1-5');
  const [startTime, setStartTime] = useState<string>('00:05');
  const [endTime, setEndTime] = useState<string>('01:30');
  const [bytesInput, setBytesInput] = useState<string>('10485760');
  const [copied, setCopied] = useState<boolean>(false);

  // EXIF Viewer state
  const [exifData, setExifData] = useState<Record<string, string>>({});
  const [exifImagePreview, setExifImagePreview] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const { jobState, startJob, resetJob, isProcessing } = useToolJob(tool.id);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);

      if (tool.id === 'exif-viewer') {
        const url = URL.createObjectURL(file);
        setExifImagePreview(url);
        extractExifData(file);
      }
    }
  };

  const extractExifData = (file: File) => {
    const reader = new FileReader();
    reader.onload = () => {
      const buffer = reader.result as ArrayBuffer;
      const view = new DataView(buffer);

      // Check for JPEG SOI marker
      if (view.getUint16(0) !== 0xFFD8) {
        setExifData({ Error: 'Not a valid JPEG file' });
        return;
      }

      const metadata: Record<string, string> = {
        'File Name': file.name,
        'File Size': `${(file.size / 1024).toFixed(1)} KB`,
        'File Type': file.type,
      };

      // Scan for EXIF data
      let offset = 2;
      while (offset < view.byteLength - 2) {
        const marker = view.getUint16(offset);
        if (marker === 0xFFE1) {
          // APP1 - EXIF
          const exifLength = view.getUint16(offset + 2);
          const exifDataView = new DataView(buffer, offset + 4, exifLength - 2);

          // Check for "Exif\0\0"
          if (String.fromCharCode(view.getUint8(offset + 4), view.getUint8(offset + 5), view.getUint8(offset + 6), view.getUint8(offset + 7)) === 'Exif') {
            const tiffOffset = offset + 10;
            const tiffView = new DataView(buffer, tiffOffset);

            // Determine byte order
            const byteOrder = tiffView.getUint16(0);
            const littleEndian = byteOrder === 0x4949; // 'II'

            const ifdOffset = tiffView.getUint32(4, littleEndian);
            const numEntries = tiffView.getUint16(ifdOffset, littleEndian);

            metadata['EXIF Detected'] = 'Yes';
            metadata['Byte Order'] = littleEndian ? 'Little-endian (Intel)' : 'Big-endian (Motorola)';

            const tagNames: Record<number, string> = {
              0x010F: 'Camera Make',
              0x0110: 'Camera Model',
              0x0112: 'Orientation',
              0x011A: 'X Resolution',
              0x011B: 'Y Resolution',
              0x0131: 'Software',
              0x0132: 'Date/Time',
              0x0213: 'YCbCr Positioning',
              0x8769: 'EXIF IFD Pointer',
              0x829A: 'Exposure Time',
              0x829D: 'F-Number',
              0x8827: 'ISO Speed',
              0x9003: 'Date/Time Original',
              0x9004: 'Date/Time Digitized',
              0x920A: 'Focal Length',
              0xA001: 'Color Space',
              0xA002: 'Pixel X Dimension',
              0xA003: 'Pixel Y Dimension',
              0xA405: 'Focal Length in 35mm',
              0xA430: 'Camera Owner',
              0xA431: 'Body Serial Number',
              0xA432: 'Lens Info',
              0xA433: 'Lens Make',
              0xA434: 'Lens Model',
            };

            for (let i = 0; i < Math.min(numEntries, 30); i++) {
              const entryOffset = ifdOffset + 2 + (i * 12);
              if (entryOffset + 12 > view.byteLength) break;

              const tag = tiffView.getUint16(entryOffset, littleEndian);
              const type = tiffView.getUint16(entryOffset + 2, littleEndian);
              const count = tiffView.getUint32(entryOffset + 4, littleEndian);

              const tagName = tagNames[tag] || `Tag 0x${tag.toString(16).toUpperCase().padStart(4, '0')}`;

              if (type === 2 && count <= 200) {
                // ASCII string
                let strOffset = entryOffset + 8;
                if (count > 4) {
                  strOffset = tiffView.getUint32(entryOffset + 8, littleEndian);
                }
                let str = '';
                for (let j = 0; j < count - 1; j++) {
                  str += String.fromCharCode(view.getUint8(tiffOffset + strOffset + j));
                }
                if (str.trim()) metadata[tagName] = str.trim();
              } else if (type === 3 && count === 1) {
                // SHORT
                const val = tiffView.getUint16(entryOffset + 8, littleEndian);
                metadata[tagName] = String(val);
              } else if (type === 4 && count === 1) {
                // LONG
                const val = tiffView.getUint32(entryOffset + 8, littleEndian);
                metadata[tagName] = String(val);
              } else if ((type === 5 || type === 10) && count === 1) {
                // RATIONAL
                let ratOffset = entryOffset + 8;
                if (type === 5 && count > 1) {
                  ratOffset = tiffView.getUint32(entryOffset + 8, littleEndian);
                }
                const num = tiffView.getUint32(tiffOffset + ratOffset, littleEndian);
                const den = tiffView.getUint32(tiffOffset + ratOffset + 4, littleEndian);
                metadata[tagName] = den ? (num / den).toFixed(2) : 'N/A';
              }
            }
            break;
          }
        }
        offset += 2;
        if ((marker & 0xFF00) === 0xFF00) {
          offset += view.getUint16(offset);
        } else {
          break;
        }
      }

      if (!metadata['EXIF Detected']) {
        metadata['EXIF Detected'] = 'No EXIF data found (may be PNG or unprocessed)';
      }

      setExifData(metadata);
    };
    reader.readAsArrayBuffer(file);
  };

  const stripExifFromImage = () => {
    if (!selectedFile) return;
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();

    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx?.drawImage(img, 0, 0);
      canvas.toBlob((blob) => {
        if (blob) {
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = `stripped-${selectedFile.name.replace(/\.[^.]+$/, '.png')}`;
          a.click();
          URL.revokeObjectURL(url);
        }
      }, 'image/png');
    };
    img.src = URL.createObjectURL(selectedFile);
  };

  const handleRunFileJob = () => {
    if (!selectedFile && tool.id !== 'file-size-converter') return;
    startJob({
      fileName: selectedFile?.name,
      fileSize: selectedFile?.size,
      pageRange,
      startTime,
      endTime,
    });
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const bytes = parseFloat(bytesInput) || 0;
  const kb = (bytes / 1024).toFixed(2);
  const mb = (bytes / (1024 * 1024)).toFixed(2);
  const gb = (bytes / (1024 * 1024 * 1024)).toFixed(4);

  return (
    <div className="space-y-6">
      {/* File Size Converter */}
      {tool.id === 'file-size-converter' ? (
        <div className="space-y-6">
          <div>
            <label className="block text-xs font-bold uppercase text-stone-500 mb-1">Raw File Size (Bytes)</label>
            <input
              type="number"
              value={bytesInput}
              onChange={(e) => setBytesInput(e.target.value)}
              className="w-full p-3.5 bg-stone-50 dark:bg-zinc-950 border border-stone-200 dark:border-zinc-800 rounded-xl font-mono text-sm font-bold"
            />
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-4 bg-stone-50 dark:bg-zinc-950 border border-stone-200 dark:border-zinc-800 rounded-xl text-center">
              <span className="text-xs uppercase font-bold text-stone-500">Kilobytes (KB)</span>
              <div className="text-xl font-black text-primary mt-1">{kb} KB</div>
            </div>
            <div className="p-4 bg-stone-50 dark:bg-zinc-950 border border-stone-200 dark:border-zinc-800 rounded-xl text-center">
              <span className="text-xs uppercase font-bold text-stone-500">Megabytes (MB)</span>
              <div className="text-xl font-black text-stone-900 dark:text-white mt-1">{mb} MB</div>
            </div>
            <div className="p-4 bg-stone-50 dark:bg-zinc-950 border border-stone-200 dark:border-zinc-800 rounded-xl text-center">
              <span className="text-xs uppercase font-bold text-stone-500">Gigabytes (GB)</span>
              <div className="text-xl font-black text-stone-900 dark:text-white mt-1">{gb} GB</div>
            </div>
            <div className="p-4 bg-stone-50 dark:bg-zinc-950 border border-stone-200 dark:border-zinc-800 rounded-xl text-center">
              <span className="text-xs uppercase font-bold text-stone-500">Bytes</span>
              <div className="text-xl font-black text-stone-900 dark:text-white mt-1">{bytes.toLocaleString()}</div>
            </div>
          </div>
        </div>
      ) : tool.id === 'exif-viewer' ? (
        /* EXIF Data Viewer & Stripper */
        <div className="space-y-6">
          <div
            onClick={() => fileInputRef.current?.click()}
            className="border-2 border-dashed border-stone-300 dark:border-zinc-800 hover:border-primary/50 dark:hover:border-primary/50 rounded-3xl p-8 text-center bg-stone-50 dark:bg-zinc-950 cursor-pointer transition-all group"
          >
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileSelect}
              accept="image/*"
              className="hidden"
            />
            <FiEye size={40} className="mx-auto text-stone-400 dark:text-zinc-600 group-hover:text-primary transition-colors mb-3" />
            <p className="text-sm font-bold text-stone-900 dark:text-white">
              {selectedFile ? selectedFile.name : 'Upload photo to inspect EXIF metadata'}
            </p>
            <p className="text-xs text-stone-500 dark:text-zinc-500 mt-1">Supports JPG, JPEG images</p>
          </div>

          {exifImagePreview && (
            <div className="flex justify-center">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={exifImagePreview} alt="EXIF Preview" className="max-h-48 rounded-xl border border-stone-200 dark:border-zinc-800 object-contain" />
            </div>
          )}

          {Object.keys(exifData).length > 0 && (
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-xs font-bold uppercase text-stone-500">EXIF Metadata</span>
                <button
                  onClick={() => handleCopy(JSON.stringify(exifData, null, 2))}
                  className="text-xs font-bold text-primary hover:underline flex items-center gap-1"
                >
                  {copied ? <FiCheck size={14} /> : <FiCopy size={14} />} {copied ? 'Copied' : 'Copy All'}
                </button>
              </div>
              <div className="p-4 bg-stone-50 dark:bg-zinc-950 border border-stone-200 dark:border-zinc-800 rounded-2xl divide-y divide-stone-200 dark:divide-zinc-800">
                {Object.entries(exifData).map(([key, val]) => (
                  <div key={key} className="flex justify-between py-2 px-2 text-xs">
                    <span className="font-bold text-stone-500 uppercase">{key}</span>
                    <span className="font-mono text-stone-900 dark:text-white text-right max-w-[60%] break-all">{val}</span>
                  </div>
                ))}
              </div>

              <button
                onClick={stripExifFromImage}
                className="w-full py-3 bg-rose-500 hover:bg-rose-600 text-white font-bold text-sm rounded-xl shadow-lg transition-all flex items-center justify-center gap-2"
              >
                <FiScissors size={16} /> Strip EXIF & Download Clean Image
              </button>
            </div>
          )}
        </div>
      ) : tool.id === 'pdf-to-image' ? (
        /* PDF to Image Extractor */
        <div className="space-y-6">
          <div
            onClick={() => fileInputRef.current?.click()}
            className="border-2 border-dashed border-stone-300 dark:border-zinc-800 hover:border-primary/50 dark:hover:border-primary/50 rounded-3xl p-8 text-center bg-stone-50 dark:bg-zinc-950 cursor-pointer transition-all group"
          >
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileSelect}
              accept=".pdf"
              className="hidden"
            />
            <FiImage size={40} className="mx-auto text-stone-400 dark:text-zinc-600 group-hover:text-primary transition-colors mb-3" />
            <p className="text-sm font-bold text-stone-900 dark:text-white">
              {selectedFile ? selectedFile.name : 'Upload PDF to extract pages as images'}
            </p>
            <p className="text-xs text-stone-500 dark:text-zinc-500 mt-1">Each page will be converted to a high-res JPG</p>
          </div>

          {selectedFile && (
            <button
              onClick={handleRunFileJob}
              disabled={isProcessing}
              className="w-full py-3.5 bg-primary hover:bg-primary/90 text-white font-bold text-sm rounded-xl shadow-lg transition-all"
            >
              Extract Pages as Images
            </button>
          )}

          <JobProgressModal jobState={jobState} onReset={resetJob} title={tool.title} />
        </div>
      ) : (
        /* Async Document & Media Processing Tools */
        <div className="space-y-6">
          <div
            onClick={() => fileInputRef.current?.click()}
            className="border-2 border-dashed border-stone-300 dark:border-zinc-800 hover:border-primary/50 dark:hover:border-primary/50 rounded-3xl p-8 text-center bg-stone-50 dark:bg-zinc-950 cursor-pointer transition-all group"
          >
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileSelect}
              className="hidden"
            />
            <FiUploadCloud size={40} className="mx-auto text-stone-400 dark:text-zinc-600 group-hover:text-primary transition-colors mb-3" />
            <p className="text-sm font-bold text-stone-900 dark:text-white">
              {selectedFile ? selectedFile.name : 'Select file to process'}
            </p>
            <p className="text-xs text-stone-500 dark:text-zinc-500 mt-1">
              Supports PDF, DOCX, ZIP, MP3, MP4 files up to 50MB
            </p>
          </div>

          {tool.id === 'split-pdf' && (
            <div>
              <label className="block text-xs font-bold uppercase text-stone-500 mb-1">Page Ranges to Extract</label>
              <input
                type="text"
                value={pageRange}
                onChange={(e) => setPageRange(e.target.value)}
                placeholder="e.g. 1-3, 5, 8-10"
                className="w-full p-3 bg-stone-50 dark:bg-zinc-950 border border-stone-200 dark:border-zinc-800 rounded-xl font-mono text-sm font-bold"
              />
            </div>
          )}

          {tool.id === 'audio-cutter' && (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase text-stone-500 mb-1">Start Marker (mm:ss)</label>
                <input
                  type="text"
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  className="w-full p-3 bg-stone-50 dark:bg-zinc-950 border border-stone-200 dark:border-zinc-800 rounded-xl font-mono text-sm font-bold"
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase text-stone-500 mb-1">End Marker (mm:ss)</label>
                <input
                  type="text"
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                  className="w-full p-3 bg-stone-50 dark:bg-zinc-950 border border-stone-200 dark:border-zinc-800 rounded-xl font-mono text-sm font-bold"
                />
              </div>
            </div>
          )}

          {selectedFile && (
            <button
              onClick={handleRunFileJob}
              disabled={isProcessing}
              className="w-full py-3.5 bg-primary hover:bg-primary/90 text-white font-bold text-sm rounded-xl shadow-lg transition-all"
            >
              Start {tool.title} Job on VPS
            </button>
          )}

          <JobProgressModal jobState={jobState} onReset={resetJob} title={tool.title} />
        </div>
      )}
    </div>
  );
};
