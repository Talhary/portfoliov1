import React from 'react';
import { Metadata } from 'next';
import { Heading } from '@/components/heading';
import { DuckSearchWidget } from '@/components/portfolio-tools/DuckSearchWidget';
import Link from 'next/link';
import { FiArrowLeft, FiSearch, FiShield } from 'react-icons/fi';

export const metadata: Metadata = {
  title: "Headless DuckDuckGo Search & AI Summarizer | Talha Codes",
  description: "Anti-bot headless search engine bypassing Cloudflare and bot protections to harvest organic web results paired with generative AI summaries.",
  keywords: [
    "DuckDuckGo Headless Search",
    "Anti-Bot Web Search",
    "AI Search Engine",
    "Puppeteer Search Scraper",
    "Talha Codes Tools"
  ],
  openGraph: {
    title: "Headless DuckDuckGo Search & AI Summarizer | Talha Codes",
    description: "Anti-bot headless search engine returning organic web results with generative AI summaries.",
    type: "website",
    url: "https://talhacodes.site/tools/duck-search",
  }
};

export default function DuckSearchPage() {
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
        <Heading title="Headless DuckDuckGo Search & AI Summarizer" />
        <p className="text-zinc-600 dark:text-zinc-400 font-light mt-2 leading-relaxed text-sm sm:text-base">
          Headless CDP pipeline that navigates search engines bypassing Cloudflare/CAPTCHA bot barriers and extracts organic ranking results paired with an instant generative AI summary.
        </p>
      </div>

      <section>
        <DuckSearchWidget />
      </section>
    </div>
  );
}
