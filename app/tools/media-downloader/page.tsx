import React from 'react';
import { Metadata } from 'next';
import { Heading } from '@/components/heading';
import { UniversalMediaDownloaderWidget } from '@/components/portfolio-tools/UniversalMediaDownloaderWidget';
import Link from 'next/link';
import { FiArrowLeft, FiDownloadCloud, FiZap, FiShield } from 'react-icons/fi';

export const metadata: Metadata = {
  title: "Universal Media & Video Downloader | 9+ Platforms - Talha Codes",
  description: "High-speed media downloader supporting TikTok, Instagram, YouTube, X/Twitter, Reddit, Facebook, Pinterest, SoundCloud, and Spotify without watermarks.",
  keywords: [
    "Universal Media Downloader",
    "TikTok Downloader",
    "Instagram Video Saver",
    "YouTube 1080p Downloader",
    "Twitter Video Downloader",
    "SoundCloud Downloader",
    "Talha Codes Tools"
  ],
  openGraph: {
    title: "Universal Media & Video Downloader | Talha Codes",
    description: "Download video and audio streams across TikTok, Instagram, YouTube, X, Reddit, Spotify, and more.",
    type: "website",
    url: "https://talhacodes.site/tools/media-downloader",
  }
};

export default function MediaDownloaderPage() {
  return (
    <div className="w-full max-w-6xl mx-auto px-4 py-8 text-zinc-800 dark:text-gray-100 animate-fadeIn space-y-10">
      <nav aria-label="Breadcrumb">
        <Link
          href="/tools"
          className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-zinc-500 hover:text-primary transition-colors"
        >
          <FiArrowLeft size={14} /> Back to Developer Tools
        </Link>
      </nav>

      <div className="pr-16 md:pr-0 md:max-w-[70%]">
        <Heading title="Universal Media & Stream Downloader" />
        <p className="text-zinc-600 dark:text-zinc-400 font-light mt-2 leading-relaxed text-sm sm:text-base">
          High-performance media processing pipeline powered by Puppeteer CDP, yt-dlp, and Cheerio. Extract high-definition video, audio, and stream metadata with zero rate-limiting.
        </p>
      </div>

      <section>
        <UniversalMediaDownloaderWidget />
      </section>

      <section className="space-y-4 pt-6 border-t border-zinc-200 dark:border-zinc-800">
        <h3 className="text-lg font-bold text-zinc-900 dark:text-white flex items-center gap-2">
          <FiDownloadCloud className="text-primary" /> Supported Platforms & Features
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div className="p-5 rounded-2xl bg-zinc-50 dark:bg-card-bg-3 border border-zinc-200 dark:border-white/5 space-y-2">
            <div className="text-primary font-bold text-sm flex items-center gap-2">
              <FiZap /> 9+ Major Platforms
            </div>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed font-light">
              Native extraction for TikTok, Instagram Reels, YouTube, X/Twitter, Reddit, Facebook, Pinterest, SoundCloud, and Spotify.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-zinc-50 dark:bg-card-bg-3 border border-zinc-200 dark:border-zinc-800 space-y-2">
            <div className="text-primary font-bold text-sm flex items-center gap-2">
              <FiShield /> Clean Direct Streams
            </div>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed font-light">
              Pulls pristine 1080p/4K master streams and 320kbps audio directly without compression artifacts or watermarks.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-zinc-50 dark:bg-card-bg-3 border border-zinc-200 dark:border-zinc-800 space-y-2">
            <div className="text-primary font-bold text-sm flex items-center gap-2">
              <FiDownloadCloud /> Format Inspection
            </div>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed font-light">
              Inspect video bitrates, audio channels, thumbnails, and container specifications before initiating downloads.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
