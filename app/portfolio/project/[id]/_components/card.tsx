'use client';

import React, { useEffect, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import * as z from 'zod'
import { formSchema } from '@/lib/form-type'
import { ImageShowcase } from './image-showcase'
import { Github, ArrowLeft, ExternalLink, HardDrive, Zap, Cpu, ShieldCheck, Maximize2 } from "lucide-react"
import { parseMarkdown } from '@/lib/markdown'
import { Dialog, DialogContent } from '@/components/ui/dialog'

const getProjectColors = (title: string) => {
  const lowerTitle = (title || '').toLowerCase();
  
  // Custom brand colors for MJ Academy: Vibrant Red (#FF1B1C) & Deep Carbon Black
  if (lowerTitle.includes('mj acedemy') || lowerTitle.includes('mj academy') || lowerTitle.includes('datanodes')) {
    const primary = 'hsl(359, 92%, 52%)'; // #FF1B1C iconic vibrant red
    const hover = 'hsl(359, 92%, 44%)';
    const gradientEnd = 'hsl(350, 85%, 36%)'; // dark crimson transition to carbon black
    const gradientEndHover = 'hsl(350, 90%, 28%)';
    return {
      primary,
      hover,
      gradientEnd,
      gradientEndHover,
      rgb: '255, 27, 28',
      badgeBgLight: 'hsl(359, 100%, 96%)',
      badgeBorderLight: 'hsl(359, 85%, 85%)',
      badgeTextLight: 'hsl(359, 90%, 40%)',
      badgeBgDark: 'hsla(359, 90%, 18%, 0.35)',
      badgeBorderDark: 'hsla(359, 80%, 45%, 0.35)',
      badgeTextDark: 'hsl(359, 100%, 75%)',
    };
  }

  let hash = 0;
  for (let i = 0; i < title.length; i++) {
    hash = title.charCodeAt(i) + ((hash << 5) - hash);
  }
  
  // Derive a hue (0 - 360)
  const hue = Math.abs(hash % 360);
  
  // Calculate theme colors using HSL
  const primary = `hsl(${hue}, 85%, 45%)`;
  const hover = `hsl(${hue}, 85%, 38%)`;
  const gradientEnd = `hsl(${(hue + 25) % 360}, 80%, 50%)`;
  const gradientEndHover = `hsl(${(hue + 25) % 360}, 80%, 42%)`;
  
  // HSL-to-RGB conversion for alpha glows
  const h = hue / 360;
  const s = 0.85;
  const l = 0.45;
  const hue2rgb = (p: number, q: number, t: number) => {
    if (t < 0) t += 1;
    if (t > 1) t -= 1;
    if (t < 1/6) return p + (q - p) * 6 * t;
    if (t < 1/2) return q;
    if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
    return p;
  };
  const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
  const p = 2 * l - q;
  const r = hue2rgb(p, q, h + 1/3);
  const g = hue2rgb(p, q, h);
  const b = hue2rgb(p, q, h - 1/3);
  const rgbString = `${Math.round(r * 255)}, ${Math.round(g * 255)}, ${Math.round(b * 255)}`;

  return {
    primary,
    hover,
    gradientEnd,
    gradientEndHover,
    rgb: rgbString,
    // Contrast-safe badge colors
    badgeBgLight: `hsl(${hue}, 90%, 96%)`,
    badgeBorderLight: `hsl(${hue}, 80%, 88%)`,
    badgeTextLight: `hsl(${hue}, 85%, 32%)`,
    badgeBgDark: `hsla(${hue}, 75%, 15%, 0.25)`,
    badgeBorderDark: `hsla(${hue}, 65%, 40%, 0.2)`,
    badgeTextDark: `hsl(${hue}, 85%, 72%)`,
  };
};

const splitDescription = (desc: string) => {
  if (!desc) return { intro: '', details: '' };
  
  // Splitting keywords for technical documents
  const separators = ['TECHNICAL SPECIFICATIONS & ARCHITECTURE', 'SYSTEM MODULES & WORKFLOWS', 'KEY ENGINEERING ACCOMPLISHMENTS', '==='];
  let splitIndex = -1;
  
  for (const sep of separators) {
    const idx = desc.indexOf(sep);
    if (idx !== -1 && (splitIndex === -1 || idx < splitIndex)) {
      splitIndex = idx;
    }
  }
  
  if (splitIndex !== -1) {
    let intro = desc.substring(0, splitIndex).trim();
    let details = desc.substring(splitIndex).trim();
    // Clean trailing or leading '===' if present
    intro = intro.replace(/===+$/g, '').trim();
    details = details.replace(/^===+/g, '').replace(/^[A-Z\s&]+===+/g, '').trim();
    return { intro, details };
  }
  
  // Fallback: Split by first double-newline
  const paragraphs = desc.split(/\n\n+/);
  if (paragraphs.length > 1) {
    return {
      intro: paragraphs[0],
      details: paragraphs.slice(1).join('\n\n')
    };
  }
  
  return { intro: desc, details: '' };
};

export default function Component(obj: z.infer<typeof formSchema>) {
  const colors = getProjectColors(obj.title);
  const descParts = splitDescription(obj.description || "");
  const [archZoomOpen, setArchZoomOpen] = useState(false);

  const lowerTitle = (obj.title || '').toLowerCase();
  const isMJAcedemy = lowerTitle.includes('mj acedemy') || lowerTitle.includes('mj academy') || lowerTitle.includes('datanodes');

  useEffect(() => {
    let isMounted = true;
    const renderCharts = async () => {
      const mermaidElements = document.querySelectorAll<HTMLElement>('.mermaid-diagram[data-mermaid]');
      if (mermaidElements.length === 0) return;

      try {
        const mermaidModule = await import('mermaid');
        const mermaid = mermaidModule.default || mermaidModule;
        mermaid.initialize({
          startOnLoad: false,
          theme: 'dark',
          securityLevel: 'loose',
          fontFamily: 'inherit',
          themeVariables: {
            darkMode: true,
            background: '#0a0a0c',
            primaryColor: '#18181b',
            primaryTextColor: '#f4f4f5',
            primaryBorderColor: '#ef4444',
            lineColor: '#f43f5e',
            secondaryColor: '#121214',
            tertiaryColor: '#09090b',
            fontSize: '13px',
          }
        });

        for (let i = 0; i < mermaidElements.length; i++) {
          const el = mermaidElements[i];
          const rawCode = decodeURIComponent(el.getAttribute('data-mermaid') || '');
          if (!rawCode) continue;
          const id = `mermaid-graph-${Date.now()}-${i}`;
          try {
            const { svg } = await mermaid.render(id, rawCode);
            if (isMounted) {
              el.innerHTML = svg;
              el.classList.add('mermaid-rendered');
            }
          } catch (renderErr) {
            console.warn('Mermaid render error for chart', i, renderErr);
          }
        }
      } catch (err) {
        console.warn('Failed to load mermaid:', err);
      }
    };

    renderCharts();
    return () => {
      isMounted = false;
    };
  }, [descParts.details]);

  const formatDate = (date: any) => {
    if (!date) return 'N/A';
    try {
      const d = new Date(date);
      if (isNaN(d.getTime())) return 'N/A';
      return d.toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric'
      });
    } catch {
      return 'N/A';
    }
  };

  return (
    <div 
      className="w-full text-zinc-900 dark:text-zinc-100 flex flex-col gap-6 py-2"
      style={{
        '--project-color': colors.primary,
        '--project-hover': colors.hover,
        '--project-grad-end': colors.gradientEnd,
        '--project-grad-end-hover': colors.gradientEndHover,
        '--project-glow': `rgba(${colors.rgb}, 0.35)`,
        '--project-border-glow': `rgba(${colors.rgb}, 0.12)`,
        '--badge-bg-light': colors.badgeBgLight,
        '--badge-border-light': colors.badgeBorderLight,
        '--badge-text-light': colors.badgeTextLight,
        '--badge-bg-dark': colors.badgeBgDark,
        '--badge-border-dark': colors.badgeBorderDark,
        '--badge-text-dark': colors.badgeTextDark,
      } as React.CSSProperties}
    >
      {/* Back Button */}
      <div className="flex items-center justify-between">
        <Link
          href="/portfolio/all"
          className="inline-flex items-center gap-2 text-sm font-semibold text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-200 transition-colors duration-200 group"
        >
          <ArrowLeft className="w-4 h-4 transition-transform duration-200 group-hover:-translate-x-1" />
          <span>Back to Portfolio</span>
        </Link>
      </div>

      {/* Main Responsive Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch w-full">
        {/* Left Column - Dynamic Image Showcase (Sticky on desktop) */}
        <div className="lg:col-span-7 flex flex-col gap-4 w-full h-full lg:sticky lg:top-24 lg:self-start">
          <ImageShowcase images={obj.imageUrl} link={obj.link} />
        </div>

        {/* Right Column - Premium Details Sidebar */}
        <div className="lg:col-span-5 flex flex-col w-full h-full">
          <div className="bg-white dark:bg-[#121215] border border-zinc-200 dark:border-zinc-800/90 p-6 sm:p-7 rounded-2xl flex flex-col justify-between h-full shadow-lg dark:shadow-2xl relative overflow-hidden group">
            
            {/* Ambient Background Glow */}
            <div className="absolute top-0 right-0 -mr-16 -mt-16 w-52 h-52 bg-[var(--project-color)]/10 rounded-full blur-3xl pointer-events-none group-hover:bg-[var(--project-color)]/15 transition-colors duration-500" />

            <div className="space-y-5">
              {/* Type / Tag Badges */}
              <div className="flex flex-wrap gap-2">
                {obj.type.split('|').map((t: string) => t.trim()).filter(Boolean).map((tag: string) => (
                  <span
                    key={tag}
                    className="text-[11px] font-bold border uppercase tracking-wider px-3 py-1 rounded-full bg-[var(--badge-bg-light)] border-[var(--badge-border-light)] text-[var(--badge-text-light)] dark:bg-[var(--badge-bg-dark)] dark:border-[var(--badge-border-dark)] dark:text-[var(--badge-text-dark)]"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              {/* Project Title */}
              <div>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-zinc-900 dark:text-zinc-100 group-hover:text-[var(--project-color)] transition-colors duration-300 tracking-tight leading-snug">
                  {obj.title}
                </h1>
              </div>

              {/* Thin Premium Separator */}
              <div className="h-[1px] w-full bg-gradient-to-r from-zinc-200 via-zinc-200/60 to-transparent dark:from-zinc-800 dark:via-zinc-800/60" />

              {/* Intro Description */}
              {descParts.intro && (
                <div
                  className="prose dark:prose-invert prose-headings:text-zinc-900 dark:prose-headings:text-white prose-a:text-[var(--project-color)] prose-strong:text-zinc-900 dark:prose-strong:text-white max-w-none text-zinc-650 dark:text-zinc-300 text-sm sm:text-base leading-relaxed font-normal"
                  dangerouslySetInnerHTML={{ __html: parseMarkdown(descParts.intro) }}
                />
              )}

              {/* Custom Key Metrics Grid for MJ Academy */}
              {isMJAcedemy && (
                <div className="grid grid-cols-2 gap-2.5 pt-1">
                  <div className="p-3 rounded-xl bg-zinc-50 dark:bg-zinc-900/60 border border-zinc-200/80 dark:border-zinc-800 flex items-start gap-2.5">
                    <HardDrive className="w-4 h-4 text-[var(--project-color)] mt-0.5 shrink-0" />
                    <div>
                      <div className="text-xs font-bold text-zinc-900 dark:text-zinc-100">15TB+ Storage</div>
                      <div className="text-[10px] text-zinc-500 dark:text-zinc-400">Virtualized Cloud Pool</div>
                    </div>
                  </div>
                  <div className="p-3 rounded-xl bg-zinc-50 dark:bg-zinc-900/60 border border-zinc-200/80 dark:border-zinc-800 flex items-start gap-2.5">
                    <Zap className="w-4 h-4 text-[var(--project-color)] mt-0.5 shrink-0" />
                    <div>
                      <div className="text-xs font-bold text-zinc-900 dark:text-zinc-100">&lt; 800ms Seek</div>
                      <div className="text-[10px] text-zinc-500 dark:text-zinc-400">HTTP 206 Partial Stream</div>
                    </div>
                  </div>
                  <div className="p-3 rounded-xl bg-zinc-50 dark:bg-zinc-900/60 border border-zinc-200/80 dark:border-zinc-800 flex items-start gap-2.5">
                    <ShieldCheck className="w-4 h-4 text-[var(--project-color)] mt-0.5 shrink-0" />
                    <div>
                      <div className="text-xs font-bold text-zinc-900 dark:text-zinc-100">AES-256-CTR</div>
                      <div className="text-[10px] text-zinc-500 dark:text-zinc-400">Real-Time Decryption</div>
                    </div>
                  </div>
                  <div className="p-3 rounded-xl bg-zinc-50 dark:bg-zinc-900/60 border border-zinc-200/80 dark:border-zinc-800 flex items-start gap-2.5">
                    <Cpu className="w-4 h-4 text-[var(--project-color)] mt-0.5 shrink-0" />
                    <div>
                      <div className="text-xs font-bold text-zinc-900 dark:text-zinc-100">99.9% Inode Drop</div>
                      <div className="text-[10px] text-zinc-500 dark:text-zinc-400">1GB Multi-Core Chunks</div>
                    </div>
                  </div>
                </div>
              )}

              {/* Tech Stack Section */}
              {obj.stack && obj.stack.length > 0 && (
                <div className="space-y-2 pt-1">
                  <span className="text-[10px] text-zinc-400 dark:text-zinc-500 uppercase font-bold tracking-wider">Tech Stack</span>
                  <div className="flex flex-wrap gap-1.5">
                    {obj.stack.map((tech: string) => (
                      <span
                        key={tech}
                        className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-zinc-100 dark:bg-zinc-900 text-zinc-700 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-800 transition-all duration-200 hover:border-[var(--project-color)]/60 hover:text-[var(--project-color)]"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Bottom Actions & Metadata */}
            <div className="space-y-4 pt-6">
              {/* Dynamic Metadata Mini-Cards */}
              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-0.5 p-3 rounded-xl bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-200/70 dark:border-zinc-800/60">
                  <span className="text-[10px] text-zinc-400 dark:text-zinc-500 uppercase font-semibold tracking-wider">Created</span>
                  <span className="text-xs text-zinc-800 dark:text-zinc-300 font-medium">{formatDate(obj.createdAt)}</span>
                </div>
                <div className="flex flex-col gap-0.5 p-3 rounded-xl bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-200/70 dark:border-zinc-800/60">
                  <span className="text-[10px] text-zinc-400 dark:text-zinc-500 uppercase font-semibold tracking-wider">Last Updated</span>
                  <span className="text-xs text-zinc-800 dark:text-zinc-300 font-medium">{formatDate(obj.updatedAt)}</span>
                </div>
              </div>

              {/* Responsive CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 w-full">
                {obj.link && (
                  <a
                    href={obj.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 flex items-center justify-center gap-2 px-6 py-3.5 bg-gradient-to-r from-[var(--project-color)] to-[var(--project-grad-end)] hover:from-[var(--project-hover)] hover:to-[var(--project-grad-end-hover)] text-white font-bold rounded-xl shadow-lg hover:shadow-[0_0_25px_var(--project-glow)] transform hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 text-center"
                  >
                    <ExternalLink className="w-4 h-4 stroke-[2.5]" />
                    <span>Live Preview</span>
                  </a>
                )}

                {obj.githubUrl && (
                  <a
                    href={obj.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 flex items-center justify-center gap-2 px-6 py-3.5 bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-900 dark:hover:bg-zinc-800 text-zinc-800 dark:text-zinc-200 font-semibold rounded-xl border border-zinc-300/80 dark:border-zinc-800 hover:text-[var(--project-color)] hover:border-[var(--project-color)]/50 transform hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 text-center"
                  >
                    <Github className="w-4 h-4" />
                    <span>Source Code</span>
                  </a>
                )}
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* Detailed Technical Specifications Section */}
      {descParts.details && (
        <div className="w-full flex flex-col gap-6 mt-4">
          
          {/* Visual Architecture Blueprint Showcase Card (For MJ Academy / DataNodes) */}
          {isMJAcedemy && (
            <div className="w-full rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-[#0d0d10] overflow-hidden shadow-2xl relative group">
              {/* Header Bar */}
              <div className="flex items-center justify-between px-6 py-4 bg-zinc-900/90 border-b border-zinc-800/80">
                <div className="flex items-center gap-3">
                  <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse shadow-[0_0_10px_#ef4444]" />
                  <span className="text-xs sm:text-sm font-bold uppercase tracking-wider text-zinc-100">
                    System Architecture &amp; Distributed Dataflow Blueprint
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-semibold text-zinc-400 bg-zinc-800 border border-zinc-700 px-2.5 py-1 rounded-full uppercase tracking-wider">
                    Blueprint Diagram
                  </span>
                  <button
                    type="button"
                    onClick={() => setArchZoomOpen(true)}
                    className="p-1 rounded-md text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800 transition-colors"
                    title="Enlarge Architecture Diagram"
                  >
                    <Maximize2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Blueprint Image Preview Frame */}
              <div 
                className="relative w-full aspect-[16/8] sm:aspect-[16/7] bg-[#070709] overflow-hidden cursor-pointer"
                onClick={() => setArchZoomOpen(true)}
              >
                <Image
                  src="/projects/datanodes/datanodes-architecture.jpg"
                  alt="DataNodes Distributed System Architecture Blueprint"
                  fill
                  sizes="(max-width: 1200px) 100vw, 1200px"
                  className="object-contain p-2 sm:p-4 transition-transform duration-500 group-hover:scale-[1.01]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
                <div className="absolute bottom-3 left-4 text-[11px] text-zinc-400 font-mono">
                  High-Throughput Ingestion Pipeline · AES-256-CTR Decryption Engine · Decoupled Node.js Streaming Daemons
                </div>
              </div>

              {/* Fullscreen Modal for Blueprint */}
              <Dialog open={archZoomOpen} onOpenChange={setArchZoomOpen}>
                <DialogContent className="max-w-[95vw] md:max-w-[90vw] h-[88vh] p-0 border-none bg-black/95 shadow-2xl overflow-hidden sm:rounded-2xl flex items-center justify-center z-50">
                  <div className="relative w-full h-full flex items-center justify-center">
                    <Image
                      src="/projects/datanodes/datanodes-architecture.jpg"
                      alt="DataNodes Architecture Blueprint Fullscreen"
                      fill
                      className="object-contain p-4 md:p-8"
                      sizes="92vw"
                    />
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          )}

          {/* Deep-Dive Technical Documentation Card */}
          <div className="w-full bg-white dark:bg-[#121215] border border-zinc-200 dark:border-zinc-800/90 p-6 sm:p-8 md:p-10 rounded-2xl shadow-lg dark:shadow-2xl relative overflow-hidden group">
            {/* Ambient Corner Glow */}
            <div className="absolute top-0 right-0 -mr-16 -mt-16 w-52 h-52 bg-[var(--project-color)]/10 rounded-full blur-3xl pointer-events-none group-hover:bg-[var(--project-color)]/15 transition-colors duration-500" />
            
            <h3 className="text-xl sm:text-2xl font-extrabold text-zinc-900 dark:text-zinc-100 mb-6 tracking-tight flex items-center gap-3">
              <span className="h-6 w-1 rounded bg-[var(--project-color)]" />
              Project Architecture &amp; Specifications
            </h3>

            <div
              className="prose dark:prose-invert prose-headings:text-zinc-900 dark:prose-headings:text-white prose-a:text-[var(--project-color)] prose-strong:text-zinc-900 dark:prose-strong:text-white max-w-none text-zinc-700 dark:text-zinc-300 text-sm sm:text-base leading-relaxed font-normal"
              dangerouslySetInnerHTML={{ __html: parseMarkdown(descParts.details) }}
            />
          </div>
        </div>
      )}
    </div>
  );
}

