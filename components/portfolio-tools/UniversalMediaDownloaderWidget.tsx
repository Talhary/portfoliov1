"use client";

import React, { useState } from 'react';
import { 
  Download, 
  Video, 
  Music, 
  Youtube, 
  Instagram, 
  Twitter, 
  FileCheck, 
  AlertCircle, 
  Loader2, 
  Sparkles,
  ExternalLink,
  Layers,
  Radio,
  Share2,
  Play,
  FileVideo,
  HardDrive,
  Info
} from 'lucide-react';

interface YoutubeFormat {
  itag: number;
  qualityLabel?: string;
  container: string;
  hasVideo: boolean;
  hasAudio: boolean;
  url?: string;
}

interface YoutubeInfo {
  title: string;
  duration?: string;
  thumbnail?: string;
  author?: string;
  formats?: YoutubeFormat[];
}

interface MediaResult {
  caption?: string;
  title?: string;
  mediaType?: string;
  filename?: string;
  mimetype?: string;
  sizeBytes?: number;
  url?: string;
  downloadUrl?: string;
  thumbnail?: string;
  duration?: string;
}

export function UniversalMediaDownloaderWidget() {
  const [activeTab, setActiveTab] = useState<'universal' | 'youtube-info'>('universal');
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [mediaResult, setMediaResult] = useState<MediaResult | null>(null);
  const [ytInfo, setYtInfo] = useState<YoutubeInfo | null>(null);

  const supportedPlatforms = [
    { name: 'Instagram', icon: '📸' },
    { name: 'TikTok', icon: '🎵' },
    { name: 'YouTube', icon: '▶️' },
    { name: 'X / Twitter', icon: '🐦' },
    { name: 'Reddit', icon: '🤖' },
    { name: 'Facebook', icon: '👥' },
    { name: 'Pinterest', icon: '📌' },
    { name: 'Spotify', icon: '🟢' },
    { name: 'SoundCloud', icon: '☁️' },
  ];

  const formatFileSize = (bytes?: number) => {
    if (!bytes || bytes <= 0) return null;
    const mb = bytes / (1024 * 1024);
    if (mb >= 1024) return `${(mb / 1024).toFixed(2)} GB`;
    return `${mb.toFixed(1)} MB`;
  };

  const triggerBlobDownload = (blob: Blob, filename: string) => {
    const blobUrl = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = blobUrl;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(blobUrl);
  };

  const triggerUrlDownload = (fileUrl: string, filename: string) => {
    const a = document.createElement('a');
    a.href = fileUrl;
    a.download = filename;
    a.target = '_blank';
    a.rel = 'noopener noreferrer';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  // Universal Media Downloader Handler
  const handleUniversalDownload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url.trim()) {
      setError('Please provide a valid media URL.');
      return;
    }

    setLoading(true);
    setError(null);
    setSuccessMsg(null);
    setMediaResult(null);

    try {
      const response = await fetch('/api/portfolio/download', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: url.trim() }),
      });

      const contentType = response.headers.get('content-type') || '';

      // If it returned direct stream / binary data
      if (
        contentType.includes('video/') ||
        contentType.includes('audio/') ||
        contentType.includes('application/octet-stream') ||
        contentType.includes('application/pdf')
      ) {
        const blob = await response.blob();
        const fallbackFilename = `media_${Date.now()}.${contentType.includes('audio') ? 'mp3' : 'mp4'}`;
        triggerBlobDownload(blob, fallbackFilename);
        setSuccessMsg('Media downloaded directly to your device!');
        setMediaResult({
          title: 'Media Stream',
          mediaType: contentType.includes('audio') ? 'audio' : 'video',
          mimetype: contentType,
          sizeBytes: blob.size,
          filename: fallbackFilename,
        });
      } else {
        const data = await response.json();
        if (!response.ok || !data.success) {
          throw new Error(data.error || 'Failed to download media. Please check the URL and try again.');
        }

        const downloadTarget = data.downloadUrl || data.url || data.streamUrl || data.videoUrl || data.src || data.link;
        const targetFilename = data.filename || `media_${Date.now()}.${data.mediaType === 'audio' ? 'mp3' : 'mp4'}`;

        setMediaResult({
          caption: data.caption,
          title: data.title || data.caption,
          mediaType: data.mediaType || 'video',
          filename: targetFilename,
          mimetype: data.mimetype || 'video/mp4',
          sizeBytes: data.sizeBytes,
          url: downloadTarget,
          downloadUrl: downloadTarget,
          thumbnail: data.thumbnail,
          duration: data.duration,
        });

        if (downloadTarget) {
          triggerUrlDownload(downloadTarget, targetFilename);
          setSuccessMsg('Media link extracted and download initiated!');
        } else {
          setSuccessMsg(data.caption ? `Extracted: ${data.caption}` : 'Media extracted successfully!');
        }
      }
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'An error occurred during download.');
    } finally {
      setLoading(false);
    }
  };

  // YouTube Metadata Extractor Handler
  const handleYoutubeInfo = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!url.trim()) {
      setError('Please provide a YouTube video URL.');
      return;
    }

    setLoading(true);
    setError(null);
    setYtInfo(null);

    try {
      const response = await fetch('/api/portfolio/youtube/info', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: url.trim() }),
      });

      const data = await response.json();
      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Failed to extract YouTube video metadata.');
      }

      setYtInfo(data.info);
      setActiveTab('youtube-info');
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Error inspecting YouTube video.');
    } finally {
      setLoading(false);
    }
  };

  const isYouTubeUrl = url.toLowerCase().includes('youtube.com') || url.toLowerCase().includes('youtu.be');

  return (
    <div className="w-full space-y-8">
      {/* Downloader Card */}
      <div className="p-6 md:p-8 rounded-3xl bg-white dark:bg-card-bg-2 border border-zinc-200 dark:border-zinc-800 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-48 h-48 bg-primary/10 rounded-full blur-3xl pointer-events-none" />

        <div className="space-y-6 relative z-10">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-100 dark:border-zinc-800/80 pb-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold uppercase tracking-wider mb-2">
                <Sparkles size={14} /> Universal Media Engine
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-zinc-900 dark:text-white tracking-tight">
                Universal Media & Stream Downloader
              </h2>
              <p className="text-sm text-zinc-500 dark:text-zinc-400 font-light mt-1">
                Download high-definition videos, reels, tracks, and audio streams across 9+ major platforms without watermarks or rate-limits.
              </p>
            </div>

            {/* Mode Switch */}
            <div className="flex items-center p-1 rounded-xl bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shrink-0">
              <button
                type="button"
                onClick={() => { setActiveTab('universal'); setError(null); }}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                  activeTab === 'universal'
                    ? 'bg-primary text-white shadow-sm'
                    : 'text-zinc-500 hover:text-zinc-900 dark:hover:text-white'
                }`}
              >
                Media Downloader
              </button>
              <button
                type="button"
                onClick={() => { setActiveTab('youtube-info'); setError(null); }}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                  activeTab === 'youtube-info'
                    ? 'bg-primary text-white shadow-sm'
                    : 'text-zinc-500 hover:text-zinc-900 dark:hover:text-white'
                }`}
              >
                YouTube Inspector
              </button>
            </div>
          </div>

          {/* Supported Platform Badges */}
          <div className="flex flex-wrap gap-2">
            {supportedPlatforms.map((p) => (
              <span
                key={p.name}
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-zinc-50 dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 text-xs font-medium"
              >
                <span>{p.icon}</span>
                <span>{p.name}</span>
              </span>
            ))}
          </div>

          {/* Input Form */}
          <form onSubmit={activeTab === 'universal' ? handleUniversalDownload : handleYoutubeInfo} className="space-y-4">
            <div className="relative flex flex-col sm:flex-row gap-3">
              <input
                type="url"
                required
                placeholder={
                  activeTab === 'universal'
                    ? "Paste URL from TikTok, Instagram, YouTube, X, Reddit, Spotify, etc..."
                    : "Paste YouTube Video URL (e.g. https://www.youtube.com/watch?v=...)"
                }
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                disabled={loading}
                className="flex-1 px-4 py-3.5 bg-zinc-50 dark:bg-zinc-900/80 border border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-white placeholder-zinc-400 dark:placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-primary/50 rounded-2xl text-sm font-medium transition"
              />
              <button
                type="submit"
                disabled={loading}
                className="h-12 sm:h-auto bg-primary hover:bg-primary-hover text-white font-bold rounded-2xl px-8 flex items-center justify-center gap-2 shadow-lg hover:shadow-[0_0_20px_rgba(var(--primary-rgb),0.35)] active:scale-98 transition duration-200 disabled:opacity-60 shrink-0"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    <span>Processing Media...</span>
                  </>
                ) : (
                  <>
                    {activeTab === 'universal' ? <Download size={18} /> : <Layers size={18} />}
                    <span>{activeTab === 'universal' ? 'Download Media' : 'Inspect Formats'}</span>
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Error Message */}
          {error && (
            <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-400 flex items-start gap-3 text-xs sm:text-sm animate-fadeIn">
              <AlertCircle className="h-5 w-5 shrink-0 mt-0.5" />
              <div>{error}</div>
            </div>
          )}

          {/* Success Message Banner */}
          {successMsg && (
            <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-start gap-3 text-xs sm:text-sm animate-fadeIn">
              <FileCheck className="h-5 w-5 shrink-0 mt-0.5" />
              <div className="font-medium">{successMsg}</div>
            </div>
          )}

          {/* Extracted Media Details Card */}
          {mediaResult && (
            <div className="p-5 sm:p-6 rounded-3xl bg-zinc-50 dark:bg-zinc-900/90 border border-zinc-200 dark:border-zinc-800 space-y-5 animate-fadeIn shadow-md">
              <div className="flex flex-col md:flex-row items-start justify-between gap-4">
                <div className="space-y-2 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20">
                      {mediaResult.mediaType || 'Media File'}
                    </span>
                    {mediaResult.mimetype && (
                      <span className="text-[10px] font-mono text-zinc-500 dark:text-zinc-400">
                        {mediaResult.mimetype}
                      </span>
                    )}
                  </div>

                  <h3 className="text-base sm:text-lg font-bold text-zinc-900 dark:text-white leading-snug">
                    {mediaResult.caption || mediaResult.title || 'Extracted Media Stream'}
                  </h3>

                  <div className="flex flex-wrap items-center gap-3 text-xs text-zinc-500 dark:text-zinc-400">
                    {mediaResult.sizeBytes && (
                      <span className="flex items-center gap-1 font-mono">
                        <HardDrive size={13} /> {formatFileSize(mediaResult.sizeBytes)}
                      </span>
                    )}
                    {mediaResult.filename && (
                      <span className="flex items-center gap-1 font-mono truncate max-w-[280px]">
                        <FileVideo size={13} /> {mediaResult.filename}
                      </span>
                    )}
                  </div>
                </div>

                {/* Direct Action Buttons */}
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 w-full md:w-auto shrink-0">
                  {mediaResult.downloadUrl ? (
                    <a
                      href={mediaResult.downloadUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      download={mediaResult.filename || 'media.mp4'}
                      className="px-5 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-md transition active:scale-95"
                    >
                      <Download size={16} />
                      <span>Download Video (HD)</span>
                    </a>
                  ) : (
                    <button
                      onClick={handleUniversalDownload}
                      className="px-5 py-3 rounded-xl bg-primary hover:bg-primary-hover text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-md transition active:scale-95"
                    >
                      <Download size={16} />
                      <span>Re-Download File</span>
                    </button>
                  )}

                  {isYouTubeUrl && (
                    <button
                      onClick={() => handleYoutubeInfo()}
                      className="px-4 py-3 rounded-xl bg-zinc-200/80 dark:bg-zinc-800 hover:text-primary text-zinc-800 dark:text-zinc-200 font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition"
                    >
                      <Layers size={15} />
                      <span>Inspect 1080p/4K Formats</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* YouTube Video Info Result */}
          {ytInfo && (
            <div className="p-5 sm:p-6 rounded-3xl bg-zinc-50 dark:bg-zinc-900/90 border border-zinc-200 dark:border-zinc-800 space-y-5 animate-fadeIn shadow-md">
              <div className="flex flex-col md:flex-row gap-5 items-start">
                {ytInfo.thumbnail && (
                  <div className="relative w-full md:w-56 aspect-video rounded-xl overflow-hidden bg-zinc-900 shrink-0 shadow-md">
                    <img
                      src={ytInfo.thumbnail}
                      alt={ytInfo.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}

                <div className="space-y-2 flex-1">
                  <h3 className="text-base sm:text-lg font-bold text-zinc-900 dark:text-white leading-snug">
                    {ytInfo.title}
                  </h3>
                  <div className="flex flex-wrap gap-3 text-xs text-zinc-500 dark:text-zinc-400">
                    {ytInfo.author && <span>Channel: <strong className="text-zinc-700 dark:text-zinc-200">{ytInfo.author}</strong></span>}
                    {ytInfo.duration && <span>Duration: <strong className="text-zinc-700 dark:text-zinc-200">{ytInfo.duration}</strong></span>}
                  </div>
                </div>
              </div>

              {/* Formats Grid */}
              {ytInfo.formats && ytInfo.formats.length > 0 && (
                <div className="space-y-2.5 pt-3 border-t border-zinc-200 dark:border-zinc-800">
                  <h4 className="text-xs uppercase font-bold text-zinc-400 tracking-wider">Available Stream Formats (1080p, 720p, Audio)</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {ytInfo.formats.map((fmt, idx) => (
                      <div
                        key={idx}
                        className="p-3.5 rounded-2xl bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 flex items-center justify-between gap-3 shadow-xs hover:border-primary/40 transition"
                      >
                        <div className="flex items-center gap-2.5">
                          <div className={`p-2 rounded-xl ${fmt.hasVideo ? 'bg-primary/10 text-primary' : 'bg-emerald-500/10 text-emerald-500'}`}>
                            {fmt.hasVideo ? <Video size={16} /> : <Music size={16} />}
                          </div>
                          <div>
                            <div className="text-xs font-bold text-zinc-900 dark:text-white">
                              {fmt.qualityLabel || (fmt.hasAudio && !fmt.hasVideo ? 'Audio Stream' : 'Standard')}
                            </div>
                            <div className="text-[10px] text-zinc-400 uppercase font-mono">{fmt.container}</div>
                          </div>
                        </div>

                        {fmt.url && (
                          <a
                            href={fmt.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            download
                            className="px-3 py-1.5 rounded-lg bg-primary hover:bg-primary-hover text-white text-xs font-bold flex items-center gap-1 transition shadow-sm"
                            title="Direct stream download"
                          >
                            <Download size={13} />
                            <span>Get</span>
                          </a>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
