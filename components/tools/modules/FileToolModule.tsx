'use client';

import { useState, useRef } from 'react';
import { ToolDefinition } from '@/lib/tools/registry';
import { useToolJob } from '@/hooks/use-tool-job';
import { JobProgressModal } from '@/components/tools/JobProgressModal';
import { FiUploadCloud, FiFileText, FiScissors, FiArchive, FiMusic, FiFilm } from 'react-icons/fi';

export const FileToolModule = ({ tool }: { tool: ToolDefinition }) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [pageRange, setPageRange] = useState<string>('1-5');
  const [startTime, setStartTime] = useState<string>('00:05');
  const [endTime, setEndTime] = useState<string>('01:30');
  const [bytesInput, setBytesInput] = useState<string>('10485760'); // 10MB default

  const fileInputRef = useRef<HTMLInputElement>(null);
  const { jobState, startJob, resetJob, isProcessing } = useToolJob(tool.id);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
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

  // Compute file sizes
  const bytes = parseFloat(bytesInput) || 0;
  const kb = (bytes / 1024).toFixed(2);
  const mb = (bytes / (1024 * 1024)).toFixed(2);
  const gb = (bytes / (1024 * 1024 * 1024)).toFixed(4);

  return (
    <div className="space-y-6">
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
      ) : (
        /* Async Document & Media Processing Tools (PDF, Video, Audio, ZIP) */
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

          {/* Tool specific options */}
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
