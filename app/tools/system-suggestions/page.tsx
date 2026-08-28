import React from 'react';
import { Metadata } from 'next';
import { Heading } from '@/components/heading';
import { SystemSuggestionsWidget } from '@/components/portfolio-tools/SystemSuggestionsWidget';
import Link from 'next/link';
import { FiArrowLeft, FiLayers, FiServer, FiCpu } from 'react-icons/fi';

export const metadata: Metadata = {
  title: "Systems Architecture & Engineering Proposals | Talha Codes",
  description: "Explore systems engineering architectural blueprints, Bitcask LSM-tree storage engines, Raft-consensus Redis clones, and distributed container networks.",
  keywords: [
    "Systems Architecture",
    "Bitcask LSM Tree",
    "Raft Consensus Redis",
    "Distributed Systems Roadmap",
    "Talha Codes Engineering"
  ],
  openGraph: {
    title: "Systems Architecture & Engineering Proposals | Talha Codes",
    description: "Deep-dive architectural proposals and engineering roadmaps for distributed systems and storage engines.",
    type: "website",
    url: "https://talhacodes.site/tools/system-suggestions",
  }
};

export default function SystemSuggestionsPage() {
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
        <Heading title="Systems Architecture & Engineering Roadmaps" />
        <p className="text-zinc-600 dark:text-zinc-400 font-light mt-2 leading-relaxed text-sm sm:text-base">
          Interactive systems engineering blueprints and architectural design proposals covering low-level LSM storage engines, Raft consensus protocols, and container lifecycle controllers.
        </p>
      </div>

      <section>
        <SystemSuggestionsWidget />
      </section>
    </div>
  );
}
