import React from 'react';
import { Metadata } from 'next';
import { Heading } from '@/components/heading';
import { BrowserCdpWidget } from '@/components/portfolio-tools/BrowserCdpWidget';
import Link from 'next/link';
import { FiArrowLeft, FiGlobe, FiRadio, FiServer } from 'react-icons/fi';

export const metadata: Metadata = {
  title: "Browser Network CDP & Screencast Monitor | Talha Codes",
  description: "Live cluster monitor for remote Chromium worker instances with direct Chrome DevTools Protocol WebSocket debug endpoints for headless automation.",
  keywords: [
    "Chrome DevTools Protocol",
    "CDP Browser Pool",
    "Remote Chromium Automation",
    "Headless Browser Screencast",
    "Talha Codes Tools"
  ],
  openGraph: {
    title: "Browser Network CDP & Screencast Monitor | Talha Codes",
    description: "Monitor active remote Chromium nodes and WebSocket CDP debug endpoints in real-time.",
    type: "website",
    url: "https://talhacodes.site/tools/browser-cdp",
  }
};

export default function BrowserCdpPage() {
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
        <Heading title="Browser Network CDP & Screencast Pool" />
        <p className="text-zinc-600 dark:text-zinc-400 font-light mt-2 leading-relaxed text-sm sm:text-base">
          Distributed cluster monitor exposing active remote Chromium nodes with direct Chrome DevTools Protocol WebSocket debug endpoints, health heartbeats, and low-latency screencasts.
        </p>
      </div>

      <section>
        <BrowserCdpWidget />
      </section>
    </div>
  );
}
