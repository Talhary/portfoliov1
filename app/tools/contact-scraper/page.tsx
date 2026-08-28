import React from 'react';
import { Metadata } from 'next';
import { Heading } from '@/components/heading';
import { GoContactScraperWidget } from '@/components/portfolio-tools/GoContactScraperWidget';
import Link from 'next/link';
import { FiArrowLeft, FiMail, FiShare2, FiZap } from 'react-icons/fi';

export const metadata: Metadata = {
  title: "High-Throughput Go Contact & Social Scraper | Talha Codes",
  description: "Multi-threaded Go crawler engine that recursively navigates domains to harvest verified email addresses, telephone numbers, contact endpoints, and social media handles.",
  keywords: [
    "Go Contact Scraper",
    "Email Scraper Tool",
    "Social Media Harvester",
    "Domain Web Crawler",
    "Talha Codes Tools"
  ],
  openGraph: {
    title: "High-Throughput Go Contact & Social Scraper | Talha Codes",
    description: "Harvest verified emails, phone numbers, and social media accounts across any domain with high concurrency.",
    type: "website",
    url: "https://talhacodes.site/tools/contact-scraper",
  }
};

export default function ContactScraperPage() {
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
        <Heading title="High-Throughput Go Contact Harvester" />
        <p className="text-zinc-600 dark:text-zinc-400 font-light mt-2 leading-relaxed text-sm sm:text-base">
          Concurrent Go crawler engine designed to harvest deep domain contact metadata, public email addresses, telephone numbers, and social profiles with configurable worker threads.
        </p>
      </div>

      <section>
        <GoContactScraperWidget />
      </section>
    </div>
  );
}
