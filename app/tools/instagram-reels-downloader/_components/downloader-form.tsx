"use client";

import React, { useState } from 'react';
import { Loader2, Download, AlertTriangle, CheckCircle } from 'lucide-react';

export default function DownloaderForm() {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url.trim()) {
      setError('Please paste an Instagram Reel or Video URL.');
      return;
    }

    if (!url.includes('instagram.com')) {
      setError('Invalid URL. Please enter a valid Instagram link (e.g., https://www.instagram.com/reels/...)');
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const response = await fetch('/api/tools/instagram-download', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url: url.trim() }),
      });

      if (!response.ok) {
        let errData;
        try {
          errData = await response.json();
        } catch (_) {}
        throw new Error(errData?.error || 'Failed to download video. Please verify the link is public and try again.');
      }

      // Get the response as a blob
      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      
      // Trigger browser download
      const a = document.createElement('a');
      a.href = blobUrl;
      a.download = `instagram_reel_${Date.now()}.mp4`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      
      // Clean up the URL
      window.URL.revokeObjectURL(blobUrl);
      setSuccess(true);
      setUrl('');
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'An unexpected error occurred during download.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto mt-8 p-6 rounded-2xl bg-zinc-50 dark:bg-card-bg-2 border border-zinc-200 dark:border-white/5 shadow-md">
      <h3 className="text-xl font-semibold mb-4 text-zinc-900 dark:text-white flex items-center gap-2">
        <Download className="text-primary h-5 w-5" />
        Paste Reel Link & Download
      </h3>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="relative flex flex-col sm:flex-row gap-3">
          <input
            type="url"
            placeholder="https://www.instagram.com/reels/..."
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            disabled={loading}
            className="flex-1 px-4 py-3 bg-zinc-100/50 dark:bg-black/35 border border-zinc-250 dark:border-zinc-800/80 text-zinc-900 dark:text-white placeholder-zinc-400 dark:placeholder-zinc-500 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary rounded-xl h-12 transition-all duration-300 focus:shadow-[0_0_15px_rgba(var(--primary-rgb),0.15)] text-sm"
          />
          <button
            type="submit"
            disabled={loading}
            className="h-12 bg-primary hover:bg-primary-hover text-white transition-all font-semibold rounded-xl px-6 flex items-center justify-center gap-2 shadow-lg hover:shadow-[0_0_20px_rgba(var(--primary-rgb),0.45)] hover:scale-[1.01] active:scale-[0.99] duration-300 disabled:opacity-50 disabled:pointer-events-none shrink-0"
          >
            {loading ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                <span>Downloading...</span>
              </>
            ) : (
              <>
                <Download className="h-5 w-5" />
                <span>Download Video</span>
              </>
            )}
          </button>
        </div>
      </form>

      {error && (
        <div className="mt-4 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 flex items-start gap-3 animate-fadeIn">
          <AlertTriangle className="h-5 w-5 shrink-0 mt-0.5" />
          <div className="text-sm font-light leading-relaxed">{error}</div>
        </div>
      )}

      {success && (
        <div className="mt-4 p-4 rounded-xl bg-green-500/10 border border-green-500/20 text-green-500 flex items-start gap-3 animate-fadeIn">
          <CheckCircle className="h-5 w-5 shrink-0 mt-0.5" />
          <div className="text-sm font-light leading-relaxed">
            Reel downloaded successfully! Your download should start automatically.
          </div>
        </div>
      )}
    </div>
  );
}
