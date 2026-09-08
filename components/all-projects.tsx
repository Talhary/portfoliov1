"use client";

import Image from 'next/image';
import { z } from 'zod';
import { formSchema } from "@/lib/form-type";
import Link from 'next/link';
import { Layers, ExternalLink, Eye } from 'lucide-react';
import { ProgressiveImage } from './progressive-image';
import React from 'react';

// Math formula to generate a deterministic premium color theme based on project title
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

export const AllProjects = ({ projects }: { projects: z.infer<typeof formSchema>[] }) => {
  const slugify = (text: string) => text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');

  if (projects.length === 0) {
    return (
      <div className="w-full text-center py-12 text-zinc-400 font-light text-sm">
        No projects found.
      </div>
    );
  }

  // If there's only one project, render a majestic full-width featured showcase card
  if (projects.length === 1) {
    const project = projects[0];
    const projectSlug = slugify(project.title) || project.id;
    const colors = getProjectColors(project.title);
    const isTool = (project.type && project.type.toLowerCase().includes('tool')) || (project.link && project.link.startsWith('/tools'));
    const targetLink = isTool ? project.link : `/portfolio/project/${projectSlug}`;

    return (
      <div className="w-full">
        <div 
          className="relative p-[1px] rounded-2xl sm:rounded-3xl overflow-hidden bg-zinc-200 dark:bg-zinc-800/80 hover:bg-gradient-to-br hover:from-[var(--project-color)] hover:to-[var(--project-grad-end)] transition-all duration-500 hover:shadow-[0_20px_50px_var(--project-border-glow)] group"
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
          <div className="h-full w-full rounded-2xl sm:rounded-3xl bg-white dark:bg-card-bg-3/95 p-4 sm:p-6 md:p-8 flex flex-col lg:flex-row gap-5 lg:gap-8 items-stretch relative overflow-hidden">
            {/* Iridescent Dual Ambient Background Glows */}
            <div className="absolute top-0 right-0 -mr-16 -mt-16 w-44 h-44 bg-[var(--project-color)]/5 rounded-full blur-3xl pointer-events-none group-hover:bg-[var(--project-color)]/10 transition-colors duration-500" />
            
            {/* Left: Project Image */}
            <Link 
              href={targetLink} 
              className="w-full lg:w-1/2 aspect-[16/10] lg:aspect-auto relative overflow-hidden rounded-xl sm:rounded-2xl bg-zinc-950/20 shadow-md min-h-[180px] sm:min-h-[220px] lg:min-h-[300px] group/img block cursor-pointer z-10"
            >
              {project.imageUrl && project.imageUrl.length > 0 ? (
                <ProgressiveImage 
                  src={project.imageUrl[0]} 
                  alt={project.title} 
                  fill 
                  sizes="(max-width: 768px) 100vw, 50vw"
                  objectFit="cover"
                  className="transition-transform duration-700 ease-out group-hover/img:scale-105" 
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-stone-400 dark:text-zinc-500 text-xs font-light">
                  No Preview Available
                </div>
              )}
              {/* Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60 pointer-events-none group-hover/img:opacity-40 transition-opacity" />
            </Link>

            {/* Right: Content Details */}
            <div className="w-full lg:w-1/2 flex flex-col justify-between gap-4 sm:gap-6 relative z-10">
              <div className="space-y-3 sm:space-y-4">
                {/* Type/Category Badges */}
                <div className="flex flex-wrap gap-2">
                  {project.type.split('|').map((el: string) => el.trim()).filter(Boolean).map((tag: string) => (
                    <span 
                      key={tag} 
                      className="text-[10px] font-bold border uppercase tracking-widest px-2.5 py-0.5 sm:px-3 sm:py-1 rounded-full bg-[var(--badge-bg-light)] border-[var(--badge-border-light)] text-[var(--badge-text-light)] dark:bg-[var(--badge-bg-dark)] dark:border-[var(--badge-border-dark)] dark:text-[var(--badge-text-dark)]"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                {/* Title */}
                <Link href={targetLink} className="block group/title">
                  <h4 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-stone-900 dark:text-white group-hover/title:text-[var(--project-color)] transition-colors duration-300 tracking-tight leading-tight">
                    {project.title}
                  </h4>
                </Link>

                {/* Description */}
                <p className="text-xs sm:text-sm text-zinc-550 dark:text-zinc-400 leading-relaxed font-light line-clamp-4">
                  {project.description}
                </p>

                {/* Tech Stack */}
                {project.stack && project.stack.length > 0 && (
                  <div className="space-y-2 pt-1 sm:pt-2">
                    <h5 className="text-[10px] font-semibold uppercase tracking-wider text-zinc-405 dark:text-zinc-500">Tech Stack</h5>
                    <div className="flex flex-wrap gap-1.5 sm:gap-2">
                      {project.stack.map((tech: string) => (
                        <span 
                          key={tech} 
                          className="text-[11px] sm:text-xs font-semibold px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-lg bg-zinc-150/40 dark:bg-zinc-800/40 text-zinc-650 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-700/60 transition-all duration-200 hover:border-[var(--project-color)]/35 hover:bg-[var(--project-color)]/5 hover:text-[var(--project-color)]"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center gap-3 pt-4 sm:pt-6 border-t border-stone-200/50 dark:border-white/5 mt-auto w-full">
                {!isTool && (
                  <Link href={`/portfolio/project/${projectSlug}`} className="w-full sm:w-1/2 relative z-20">
                    <button className="w-full overflow-hidden flex items-center justify-center gap-2 bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800/80 dark:hover:bg-zinc-700/80 text-zinc-800 dark:text-zinc-200 border border-zinc-300/80 dark:border-zinc-700/80 transition-all font-semibold rounded-xl text-xs sm:text-sm py-2.5 sm:py-3 px-4 shadow-sm hover:border-[var(--project-color)]/50 hover:text-[var(--project-color)] active:scale-95 duration-300">
                      <Eye className="h-4 w-4 relative z-10 transition-transform duration-300" />
                      <span className="relative z-10">View Details</span>
                    </button>
                  </Link>
                )}

                {project.link.startsWith('/') ? (
                  <Link href={project.link} className={`w-full ${!isTool ? 'sm:w-1/2' : ''} relative z-20`}>
                    <button className="w-full overflow-hidden flex items-center justify-center gap-2 bg-gradient-to-r from-[var(--project-color)] to-[var(--project-grad-end)] hover:from-[var(--project-hover)] hover:to-[var(--project-grad-end-hover)] text-white transition-all font-semibold rounded-xl text-xs sm:text-sm py-2.5 sm:py-3 px-4 shadow-md hover:shadow-[0_0_20px_var(--project-glow)] group/livebtn active:scale-95 duration-300">
                      <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover/livebtn:translate-x-full transition-transform duration-1000 ease-out" />
                      <ExternalLink className="h-4 w-4 relative z-10 transition-transform duration-300 group-hover/livebtn:translate-x-0.5 group-hover/livebtn:-translate-y-0.5" />
                      <span className="relative z-10">Use Tool</span>
                    </button>
                  </Link>
                ) : (
                  <a href={project.link} target="_blank" rel="noopener noreferrer" className={`w-full ${!isTool ? 'sm:w-1/2' : ''} relative z-20`}>
                    <button className="w-full overflow-hidden flex items-center justify-center gap-2 bg-gradient-to-r from-[var(--project-color)] to-[var(--project-grad-end)] hover:from-[var(--project-hover)] hover:to-[var(--project-grad-end-hover)] text-white transition-all font-semibold rounded-xl text-xs sm:text-sm py-2.5 sm:py-3 px-4 shadow-md hover:shadow-[0_0_20px_var(--project-glow)] group/livebtn active:scale-95 duration-300">
                      <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover/livebtn:translate-x-full transition-transform duration-1000 ease-out" />
                      <ExternalLink className="h-4 w-4 relative z-10 transition-transform duration-300 group-hover/livebtn:translate-x-0.5 group-hover/livebtn:-translate-y-0.5" />
                      <span className="relative z-10">Visit Live</span>
                    </button>
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Otherwise, render a beautifully aligned responsive grid
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mt-4 sm:mt-6 w-full">
      {projects.map((project: z.infer<typeof formSchema>) => {
        const projectSlug = slugify(project.title) || project.id;
        const colors = getProjectColors(project.title);
        const isTool = (project.type && project.type.toLowerCase().includes('tool')) || (project.link && project.link.startsWith('/tools'));
        const targetLink = isTool ? project.link : `/portfolio/project/${projectSlug}`;

        return (
          <div 
            key={project.id} 
            className="relative p-[1px] rounded-xl sm:rounded-2xl overflow-hidden bg-zinc-200 dark:bg-zinc-800/85 hover:bg-gradient-to-br hover:from-[var(--project-color)] hover:to-[var(--project-grad-end)] transition-all duration-300 hover:shadow-[0_10px_30px_var(--project-border-glow)] hover:-translate-y-1.5 group flex flex-col"
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
            <div className="h-full w-full rounded-xl sm:rounded-2xl bg-white dark:bg-card-bg-3/95 overflow-hidden flex flex-col justify-between relative">
              {/* Glowing Top Accent Line on Hover */}
              <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[var(--project-color)] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10" />

              {/* Cover Image */}
              <Link 
                href={targetLink} 
                className="relative w-full h-40 sm:h-48 overflow-hidden rounded-t-xl sm:rounded-t-2xl bg-zinc-950/20 block cursor-pointer group/img z-10"
              >
                {project.imageUrl && project.imageUrl.length > 0 ? (
                  <ProgressiveImage 
                    src={project.imageUrl[0]} 
                    alt={project.title} 
                    fill 
                    sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    objectFit="cover"
                    className="transition-transform duration-500 group-hover/img:scale-105" 
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-stone-400 dark:text-zinc-500 text-xs font-light">
                    No Preview Available
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-60 pointer-events-none group-hover/img:opacity-40 transition-opacity" />
              </Link>

              {/* Content Body */}
              <div className="p-3.5 sm:p-5 flex-grow flex flex-col justify-between gap-3 sm:gap-4 relative z-10">
                <div className="space-y-2">
                  <Link href={targetLink} className="block group/title">
                    <h4 className="text-lg font-bold text-stone-900 dark:text-white group-hover/title:text-[var(--project-color)] transition-colors tracking-tight leading-snug">
                      {project.title}
                    </h4>
                  </Link>
                  
                  {/* Category Badges */}
                  <div className="flex flex-wrap gap-1.5 pt-0.5">
                    {project.type.split('|').map((el: string) => el.trim()).filter(Boolean).map((tag: string) => (
                      <span 
                        key={tag} 
                        className="text-[9px] font-bold border uppercase tracking-wider px-2 py-0.5 rounded-full bg-[var(--badge-bg-light)] border-[var(--badge-border-light)] text-[var(--badge-text-light)] dark:bg-[var(--badge-bg-dark)] dark:border-[var(--badge-border-dark)] dark:text-[var(--badge-text-dark)]"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  {/* Tech Stack */}
                  {project.stack && project.stack.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 pt-1.5">
                      {project.stack.map((tech: string) => (
                        <span 
                          key={tech} 
                          className="text-[9px] font-semibold bg-zinc-100 dark:bg-zinc-800 text-zinc-650 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-700 px-2 py-0.5 rounded"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="flex items-center gap-2 sm:gap-3 pt-3 border-t border-stone-200/50 dark:border-white/5 mt-auto w-full">
                  {!isTool && (
                    <Link href={`/portfolio/project/${projectSlug}`} className="flex-1 relative z-20">
                      <button className="w-full overflow-hidden flex items-center justify-center gap-1.5 bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800/80 dark:hover:bg-zinc-700/80 text-zinc-800 dark:text-zinc-200 border border-zinc-300/80 dark:border-zinc-700/80 transition-all font-semibold rounded-xl text-xs py-2.5 px-3 shadow-sm hover:border-[var(--project-color)]/50 hover:text-[var(--project-color)] active:scale-95 duration-300">
                        <Eye className="h-3.5 w-3.5 relative z-10 transition-transform duration-300" />
                        <span className="relative z-10">View Details</span>
                      </button>
                    </Link>
                  )}

                  {project.link.startsWith('/') ? (
                    <Link href={project.link} className={`${!isTool ? 'flex-1' : 'w-full'} relative z-20`}>
                      <button className="w-full overflow-hidden flex items-center justify-center gap-1.5 bg-gradient-to-r from-[var(--project-color)] to-[var(--project-grad-end)] hover:from-[var(--project-hover)] hover:to-[var(--project-grad-end-hover)] text-white transition-all font-semibold rounded-xl text-xs py-2.5 px-3 shadow-md hover:shadow-[0_0_15px_var(--project-glow)] group/livebtn active:scale-95 duration-300">
                        <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover/livebtn:translate-x-full transition-transform duration-1000 ease-out" />
                        <ExternalLink className="h-3.5 w-3.5 relative z-10 transition-transform duration-300 group-hover/livebtn:translate-x-0.5 group-hover/livebtn:-translate-y-0.5" />
                        <span className="relative z-10">Use Tool</span>
                      </button>
                    </Link>
                  ) : (
                    <a href={project.link} target="_blank" rel="noopener noreferrer" className={`${!isTool ? 'flex-1' : 'w-full'} relative z-20`}>
                      <button className="w-full overflow-hidden flex items-center justify-center gap-1.5 bg-gradient-to-r from-[var(--project-color)] to-[var(--project-grad-end)] hover:from-[var(--project-hover)] hover:to-[var(--project-grad-end-hover)] text-white transition-all font-semibold rounded-xl text-xs py-2.5 px-3 shadow-md hover:shadow-[0_0_15px_var(--project-glow)] group/livebtn active:scale-95 duration-300">
                        <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover/livebtn:translate-x-full transition-transform duration-1000 ease-out" />
                        <ExternalLink className="h-3.5 w-3.5 relative z-10 transition-transform duration-300 group-hover/livebtn:translate-x-0.5 group-hover/livebtn:-translate-y-0.5" />
                        <span className="relative z-10">Visit Live</span>
                      </button>
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};