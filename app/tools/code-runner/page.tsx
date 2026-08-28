import React from 'react';
import { Metadata } from 'next';
import { Heading } from '@/components/heading';
import { CodeRunnerWidget } from '@/components/portfolio-tools/CodeRunnerWidget';
import Link from 'next/link';
import { FiArrowLeft, FiCode, FiCpu, FiTerminal } from 'react-icons/fi';

export const metadata: Metadata = {
  title: "Sandboxed Polyglot Code Runner | Python, Node.js, Shell - Talha Codes",
  description: "Execute Python, Node.js, and Shell scripts in an ephemeral, isolated Docker container sandbox with real-time stdout/stderr capture and execution metrics.",
  keywords: [
    "Polyglot Code Runner",
    "Online Python Sandbox",
    "Node.js Runner Online",
    "Docker Code Execution",
    "Talha Codes Tools"
  ],
  openGraph: {
    title: "Sandboxed Polyglot Code Runner | Talha Codes",
    description: "Execute Python, Node.js, and Shell code in a secure container sandbox with execution metrics.",
    type: "website",
    url: "https://talhacodes.site/tools/code-runner",
  }
};

export default function CodeRunnerPage() {
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
        <Heading title="Sandboxed Polyglot Code Runner" />
        <p className="text-zinc-600 dark:text-zinc-400 font-light mt-2 leading-relaxed text-sm sm:text-base">
          Isolated container execution pipeline for running Python, Node.js, and Shell scripts with strict resource boundaries, configurable timeouts, and real-time output streams.
        </p>
      </div>

      <section>
        <CodeRunnerWidget />
      </section>
    </div>
  );
}
