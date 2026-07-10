import React from "react"
import Link from "next/link"
import * as z from 'zod'
import { formSchema } from '@/lib/form-type'
import { ImageShowcase } from './image-showcase'
import { Github, ArrowLeft, ExternalLink } from "lucide-react"
import { parseMarkdown } from '@/lib/markdown'

const getProjectColors = (title: string) => {
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
    <div className="w-full text-zinc-900 dark:text-zinc-100 flex flex-col gap-6 py-2">
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
        {/* Left Column - Dynamic Image Showcase (Sticky on desktop to prevent blank spaces) */}
        <div className="lg:col-span-7 flex flex-col gap-4 w-full h-full lg:sticky lg:top-24 lg:self-start">
          <ImageShowcase images={obj.imageUrl} />
        </div>

        {/* Right Column - Premium Details Sidebar */}
        <div className="lg:col-span-5 flex flex-col w-full h-full">
          <div 
            className="bg-zinc-50 dark:bg-[#1a1a1c]/60 border border-zinc-200 dark:border-zinc-800 p-6 sm:p-8 rounded-2xl flex flex-col justify-between h-full shadow-sm dark:shadow-2xl relative overflow-hidden group"
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
            {/* Iridescent Dual Ambient Background Glows */}
            <div className="absolute top-0 right-0 -mr-16 -mt-16 w-44 h-44 bg-[var(--project-color)]/5 rounded-full blur-3xl pointer-events-none group-hover:bg-[var(--project-color)]/10 transition-colors duration-500" />

            <div className="space-y-6">
              {/* Type / Tag Badges */}
              <div className="flex flex-wrap gap-2">
                {obj.type.split('|').map((t: string) => t.trim()).filter(Boolean).map((tag: string) => (
                  <span
                    key={tag}
                    className="text-xs font-bold border uppercase tracking-widest px-3.5 py-1 rounded-full bg-[var(--badge-bg-light)] border-[var(--badge-border-light)] text-[var(--badge-text-light)] dark:bg-[var(--badge-bg-dark)] dark:border-[var(--badge-border-dark)] dark:text-[var(--badge-text-dark)]"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              {/* Project Title */}
              <div>
                <h1 className="text-3xl sm:text-4xl font-extrabold text-zinc-900 dark:text-zinc-100 group-hover:text-[var(--project-color)] transition-colors duration-305 tracking-tight leading-tight mb-2">
                  {obj.title}
                </h1>
              </div>

              {/* Thin Premium Separator */}
              <div className="h-[1px] w-full bg-gradient-to-r from-zinc-200 via-zinc-200/50 to-transparent dark:from-zinc-800 dark:via-zinc-800/50" />

              {/* Intro Description (Preserves newlines and formatting) */}
              {descParts.intro && (
                <div
                  className="prose dark:prose-invert prose-headings:text-zinc-900 dark:prose-headings:text-white prose-a:text-[var(--project-color)] prose-strong:text-zinc-900 dark:prose-strong:text-white prose-code:text-[var(--project-color)] max-w-none text-zinc-850 dark:text-zinc-350 text-sm sm:text-base leading-relaxed font-normal whitespace-pre-line"
                  dangerouslySetInnerHTML={{ __html: parseMarkdown(descParts.intro) }}
                />
              )}

              {/* Tech Stack Section */}
              {obj.stack && obj.stack.length > 0 && (
                <div className="space-y-2 pt-2">
                  <span className="text-[10px] text-zinc-400 dark:text-zinc-500 uppercase font-bold tracking-wider">Tech Stack</span>
                  <div className="flex flex-wrap gap-1.5">
                    {obj.stack.map((tech: string) => (
                      <span
                        key={tech}
                        className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-zinc-150/40 dark:bg-zinc-800/40 text-zinc-700 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-700 transition-all duration-200 hover:border-[var(--project-color)]/35 hover:bg-[var(--project-color)]/5 hover:text-[var(--project-color)]"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Middle Spacer / Separator */}
            <div className="my-6 h-[1px] w-full bg-gradient-to-r from-zinc-200 via-zinc-200/50 to-transparent dark:from-zinc-800 dark:via-zinc-800/50" />

            <div className="space-y-6">
              {/* Dynamic Metadata Mini-Cards */}
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1 p-3.5 rounded-xl bg-zinc-150/20 dark:bg-zinc-950/20 border border-zinc-200/60 dark:border-zinc-800/50">
                  <span className="text-[10px] text-zinc-400 dark:text-zinc-500 uppercase font-semibold tracking-wider">Created</span>
                  <span className="text-xs text-zinc-800 dark:text-zinc-350 font-medium">{formatDate(obj.createdAt)}</span>
                </div>
                <div className="flex flex-col gap-1 p-3.5 rounded-xl bg-zinc-150/20 dark:bg-zinc-950/20 border border-zinc-200/60 dark:border-zinc-800/50">
                  <span className="text-[10px] text-zinc-400 dark:text-zinc-500 uppercase font-semibold tracking-wider">Last Updated</span>
                  <span className="text-xs text-zinc-800 dark:text-zinc-355 font-medium">{formatDate(obj.updatedAt)}</span>
                </div>
              </div>

              {/* Premium Responsive CTA Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 w-full">
                {obj.link && (
                  <a
                    href={obj.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 flex items-center justify-center gap-2 px-6 py-3.5 bg-gradient-to-r from-[var(--project-color)] to-[var(--project-grad-end)] hover:from-[var(--project-hover)] hover:to-[var(--project-grad-end-hover)] text-white font-bold rounded-xl shadow-lg hover:shadow-[0_0_20px_var(--project-glow)] transform hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 text-center"
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
                    className="flex-1 flex items-center justify-center gap-2 px-6 py-3.5 bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800/40 dark:hover:bg-zinc-800/80 text-zinc-850 dark:text-zinc-350 font-semibold rounded-xl border border-zinc-250 dark:border-zinc-700/60 hover:text-[var(--project-color)] hover:border-[var(--project-color)]/40 transform hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 text-center"
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

      {/* Detailed Technical Specifications (Full-Width Row below the showcase grid) */}
      {descParts.details && (
        <div 
          className="w-full bg-white dark:bg-[#1a1a1c]/40 border border-zinc-200 dark:border-zinc-800 p-6 sm:p-8 md:p-10 rounded-2xl shadow-sm dark:shadow-2xl relative overflow-hidden group mt-4"
          style={{
            '--project-color': colors.primary,
            '--project-hover': colors.hover,
            '--project-glow': `rgba(${colors.rgb}, 0.35)`,
          } as React.CSSProperties}
        >
          {/* Ambient Glow */}
          <div className="absolute top-0 right-0 -mr-16 -mt-16 w-44 h-44 bg-[var(--project-color)]/5 rounded-full blur-3xl pointer-events-none group-hover:bg-[var(--project-color)]/10 transition-colors duration-500" />
          
          <h3 className="text-xl sm:text-2xl font-extrabold text-zinc-900 dark:text-zinc-100 mb-6 tracking-tight flex items-center gap-3">
            <span className="h-6 w-1 rounded bg-[var(--project-color)]" />
            Project Architecture & Specifications
          </h3>

          <div
            className="prose dark:prose-invert prose-headings:text-zinc-900 dark:prose-headings:text-white prose-a:text-[var(--project-color)] prose-strong:text-zinc-900 dark:prose-strong:text-white prose-code:text-[var(--project-color)] max-w-none text-zinc-850 dark:text-zinc-350 text-sm sm:text-base leading-relaxed font-normal whitespace-pre-line"
            dangerouslySetInnerHTML={{ __html: parseMarkdown(descParts.details) }}
          />
        </div>
      )}
    </div>
  
  );
}
