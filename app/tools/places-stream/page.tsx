import React from 'react';
import { Metadata } from 'next';
import { Heading } from '@/components/heading';
import { GooglePlacesStreamWidget } from '@/components/portfolio-tools/GooglePlacesStreamWidget';
import Link from 'next/link';
import { FiArrowLeft, FiMapPin, FiRadio, FiFileText } from 'react-icons/fi';

export const metadata: Metadata = {
  title: "Google Places Real-Time Lead Streamer (SSE) | Talha Codes",
  description: "Live Server-Sent Events (SSE) stream for business leads, phones, reviews, ratings, and addresses harvested from Google Maps in real-time.",
  keywords: [
    "Google Places Scraper",
    "Real-Time SSE Lead Stream",
    "Google Maps Lead Scraper",
    "B2B Lead Generation Tool",
    "Talha Codes Tools"
  ],
  openGraph: {
    title: "Google Places Real-Time Lead Streamer | Talha Codes",
    description: "Stream verified business leads in real-time over SSE as headless Chromium navigates Google Maps.",
    type: "website",
    url: "https://talhacodes.site/tools/places-stream",
  }
};

export default function PlacesStreamPage() {
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
        <Heading title="Google Places Real-Time Lead Streamer" />
        <p className="text-zinc-600 dark:text-zinc-400 font-light mt-2 leading-relaxed text-sm sm:text-base">
          Distributed headless browser automation that scrolls Google Maps and streams live business lead events over Server-Sent Events (SSE) with instant CSV and JSON exports.
        </p>
      </div>

      <section>
        <GooglePlacesStreamWidget />
      </section>
    </div>
  );
}
