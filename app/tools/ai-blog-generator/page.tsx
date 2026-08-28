import React from 'react';
import { Metadata } from 'next';
import { Heading } from '@/components/heading';
import { AiBlogGeneratorWidget } from '@/components/portfolio-tools/AiBlogGeneratorWidget';
import Link from 'next/link';
import { FiArrowLeft, FiBookOpen, FiCpu, FiFileText } from 'react-icons/fi';

export const metadata: Metadata = {
  title: "Gemini AI Technical Blog & Deep-Dive Generator | Talha Codes",
  description: "AI-assisted technical software engineering blog generator powered by Google Gemini 2.5 Flash. Generates in-depth architecture articles in markdown.",
  keywords: [
    "AI Blog Generator",
    "Technical Blog Writer",
    "Gemini 2.5 Flash",
    "Markdown Article Generator",
    "Talha Codes Tools"
  ],
  openGraph: {
    title: "Gemini AI Technical Blog Generator | Talha Codes",
    description: "Generate deep-dive technical engineering articles in Markdown with code samples and architectural breakdowns.",
    type: "website",
    url: "https://talhacodes.site/tools/ai-blog-generator",
  }
};

export default function AiBlogGeneratorPage() {
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
        <Heading title="Gemini AI Technical Blog & Deep-Dive Generator" />
        <p className="text-zinc-600 dark:text-zinc-400 font-light mt-2 leading-relaxed text-sm sm:text-base">
          Scout trending software engineering paradigms and synthesize comprehensive, publication-ready technical deep dives powered by Google Gemini 2.5 Flash.
        </p>
      </div>

      <section>
        <AiBlogGeneratorWidget />
      </section>
    </div>
  );
}
