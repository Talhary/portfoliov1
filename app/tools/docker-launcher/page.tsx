import React from 'react';
import { Metadata } from 'next';
import { Heading } from '@/components/heading';
import { CloudSandboxWidget } from '@/components/portfolio-tools/CloudSandboxWidget';
import Link from 'next/link';
import { FiArrowLeft, FiBox, FiCpu, FiServer, FiShield } from 'react-icons/fi';

export const metadata: Metadata = {
  title: "Deploy Any Docker Container Online (5-Min Sandbox) | Talha Codes",
  description: "Deploy any custom Docker container on-demand with custom image, port, command, and environment variables on *.talhacodes.site with Cloudflare tunnels and automated teardown.",
  keywords: [
    "Deploy Docker Container Online",
    "On Demand Docker Launcher",
    "Cloud Docker Sandbox",
    "Ephemeral Container Deployer",
    "Cloudflare Named Tunnels",
    "Talha Codes Tools"
  ],
  openGraph: {
    title: "Deploy Any Docker Container Online | Talha Codes",
    description: "Launch any public Docker image with custom ports, commands, and environment variables on *.talhacodes.site.",
    type: "website",
    url: "https://talhacodes.site/tools/docker-launcher",
  }
};

export default function DockerLauncherPage() {
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

      <div className="pr-16 md:pr-0 md:max-w-[75%]">
        <Heading title="On-Demand Docker Container Deployer" />
        <p className="text-zinc-600 dark:text-zinc-400 font-light mt-2 leading-relaxed text-sm sm:text-base">
          Deploy any public Docker image (Python, Node.js, Golang, Nginx, Ubuntu, Deno, or custom registry) on-demand with custom web ports, startup commands, and environment variables with dynamic HTTPS subdomains on <code className="text-primary font-semibold">*.talhacodes.site</code>.
        </p>
      </div>

      {/* Interactive Tool Widget */}
      <section>
        <CloudSandboxWidget />
      </section>

      {/* Architectural Isolation Guarantees */}
      <section className="space-y-4 pt-6 border-t border-zinc-200 dark:border-zinc-800">
        <h3 className="text-lg font-bold text-zinc-900 dark:text-white flex items-center gap-2">
          <FiServer className="text-primary" /> Cloudflare Tunnels & Docker Engine Guarantees
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div className="p-5 rounded-2xl bg-zinc-50 dark:bg-card-bg-3 border border-zinc-200 dark:border-white/5 space-y-2">
            <div className="text-primary font-bold text-sm flex items-center gap-2">
              <FiBox /> Any Public Docker Image
            </div>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed font-light">
              Pull and instantiate any Linux Docker container from Docker Hub or public registries with custom exposed HTTP ports.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-zinc-50 dark:bg-card-bg-3 border border-zinc-200 dark:border-zinc-800 space-y-2">
            <div className="text-primary font-bold text-sm flex items-center gap-2">
              <FiShield /> Dynamic Cloudflare Tunnels
            </div>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed font-light">
              Spawns ephemeral Named Tunnels with automated DNS CNAME registration, routing HTTPS traffic directly to the container.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-zinc-50 dark:bg-card-bg-3 border border-zinc-200 dark:border-zinc-800 space-y-2">
            <div className="text-primary font-bold text-sm flex items-center gap-2">
              <FiCpu /> Auto-Reaper Teardown
            </div>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed font-light">
              A background Go reconciler loops every 10 seconds to terminate expired containers and clean up Cloudflare DNS records.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
