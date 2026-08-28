import React from 'react';
import { Metadata } from 'next';
import { Heading } from '@/components/heading';
import { CloudSandboxWidget } from '@/components/portfolio-tools/CloudSandboxWidget';
import Link from 'next/link';
import { FiArrowLeft, FiShield, FiCpu, FiServer, FiLock } from 'react-icons/fi';

export const metadata: Metadata = {
  title: "5-Minute Cloud Container Sandbox | VS Code & Terminal - Talha Codes",
  description: "Launch disposable, isolated Docker containers (VS Code, Web Terminal, Remote Chromium) with automated 5-minute TTL cleanup and Cloudflare HTTPS subdomains.",
  keywords: [
    "Cloud Sandbox",
    "Docker Container Sandbox",
    "VS Code Online",
    "Web Terminal",
    "Cloudflare Named Tunnels",
    "Talha Codes Tools",
    "Disposable Containers"
  ],
  openGraph: {
    title: "5-Minute Cloud Container Sandbox | Talha Codes",
    description: "Launch disposable, isolated Docker containers (VS Code, Web Terminal, Remote Chromium) with automated 5-minute TTL cleanup.",
    type: "website",
    url: "https://talhacodes.site/tools/cloud-sandbox",
  }
};

export default function CloudSandboxPage() {
  return (
    <div className="w-full max-w-6xl mx-auto px-4 py-8 text-zinc-800 dark:text-gray-100 animate-fadeIn space-y-10">
      {/* Breadcrumb */}
      <nav aria-label="Breadcrumb">
        <Link
          href="/tools"
          className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-zinc-500 hover:text-primary transition-colors"
        >
          <FiArrowLeft size={14} /> Back to Developer Tools
        </Link>
      </nav>

      <div className="pr-16 md:pr-0 md:max-w-[70%]">
        <Heading title="5-Minute Isolated Container Sandbox" />
        <p className="text-zinc-600 dark:text-zinc-400 font-light mt-2 leading-relaxed text-sm sm:text-base">
          On-demand disposable Docker environments spawned by our custom Go container manager with automated 5-minute TTL cleanup, non-root privileges, and dynamic Cloudflare named tunnels on <code className="text-primary font-semibold">*.talhacodes.site</code>.
        </p>
      </div>

      {/* Interactive Tool Widget */}
      <section>
        <CloudSandboxWidget />
      </section>

      {/* Architectural Guarantee Cards */}
      <section className="space-y-4 pt-6 border-t border-zinc-200 dark:border-zinc-800">
        <h3 className="text-lg font-bold text-zinc-900 dark:text-white flex items-center gap-2">
          <FiServer className="text-primary" /> Architecture & Isolation Guarantees
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div className="p-5 rounded-2xl bg-zinc-50 dark:bg-card-bg-3 border border-zinc-200 dark:border-white/5 space-y-2">
            <div className="text-primary font-bold text-sm flex items-center gap-2">
              <FiShield /> 100% Host Protection
            </div>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed font-light">
              User code and processes execute strictly within isolated container namespaces without root privileges or host filesystem access.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-zinc-50 dark:bg-card-bg-3 border border-zinc-200 dark:border-zinc-800 space-y-2">
            <div className="text-primary font-bold text-sm flex items-center gap-2">
              <FiLock /> Cloudflare Tunnel Ingress
            </div>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed font-light">
              Zero public listening ports on the host VPS. Encrypted Named Tunnels bind dynamically to ephemeral subdomains.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-zinc-50 dark:bg-card-bg-3 border border-zinc-200 dark:border-zinc-800 space-y-2">
            <div className="text-primary font-bold text-sm flex items-center gap-2">
              <FiCpu /> Reconciler Reaper Loop
            </div>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed font-light">
              A background Go daemon continuously reconciles TTL deadlines every 10 seconds, purging containers and expunging DNS records immediately.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
