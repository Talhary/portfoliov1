import React from 'react';
import { Metadata } from 'next';
import { Heading } from '@/components/heading';
import { CvBuilderWidget } from '@/components/portfolio-tools/CvBuilderWidget';
import Link from 'next/link';
import { FiArrowLeft, FiFileText, FiAward, FiCheckCircle } from 'react-icons/fi';

export const metadata: Metadata = {
  title: "Go ATS Resume / CV PDF Builder | Dynamic Tailoring - Talha Codes",
  description: "Generate customized, high-resolution vector ATS resumes dynamically compiled in Go based on selected skills, project stacks, and target engineering roles.",
  keywords: [
    "ATS Resume Generator",
    "Go PDF Builder",
    "Dynamic CV Generator",
    "Vector PDF Resume",
    "Talha Codes Tools"
  ],
  openGraph: {
    title: "Go ATS Resume / CV PDF Builder | Talha Codes",
    description: "Generate customized, high-resolution vector ATS resumes dynamically compiled in Go.",
    type: "website",
    url: "https://talhacodes.site/tools/cv-builder",
  }
};

export default function CvBuilderPage() {
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
        <Heading title="Go ATS Resume / CV Vector PDF Builder" />
        <p className="text-zinc-600 dark:text-zinc-400 font-light mt-2 leading-relaxed text-sm sm:text-base">
          Dynamically compiles an ATS-tailored, high-resolution vector PDF resume based on selected engineering skill matrices, backend proficiencies, and system design project tags.
        </p>
      </div>

      <section>
        <CvBuilderWidget />
      </section>
    </div>
  );
}
