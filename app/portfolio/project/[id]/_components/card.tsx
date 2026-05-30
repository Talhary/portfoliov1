import React from "react"
import Link from "next/link"
import * as z from 'zod'
import { formSchema } from '@/lib/form-type'
import { ImageShowcase } from './image-showcase'
import { Github, ArrowLeft, ExternalLink } from "lucide-react"
import { parseMarkdown } from '@/lib/markdown'

export default function Component(obj: z.infer<typeof formSchema>) {

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
    <div className="w-full text-white dark:text-foreground flex flex-col gap-6 py-2">
      {/* Back Button */}
      <div className="flex items-center justify-between">
        <Link
          href="/portfolio/all"
          className="inline-flex items-center gap-2 text-sm font-semibold text-white/50 hover:text-white dark:text-foreground/60 dark:hover:text-foreground transition-colors duration-200 group"
        >
          <ArrowLeft className="w-4 h-4 transition-transform duration-200 group-hover:-translate-x-1" />
          <span>Back to Portfolio</span>
        </Link>
      </div>

      {/* Main Responsive Grid Layout - autofit on 100 width */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch w-full">
        {/* Left Column - Beautiful Dynamic Image Showcase */}
        <div className="lg:col-span-7 flex flex-col gap-4 w-full h-full">
          <ImageShowcase images={obj.imageUrl} />
        </div>

        {/* Right Column - Premium Details Sidebar */}
        <div className="lg:col-span-5 flex flex-col w-full h-full">
          <div className="bg-white/10 dark:bg-zinc-900/40 backdrop-blur-xl border border-white/10 dark:border-zinc-800 p-6 sm:p-8 rounded-2xl flex flex-col justify-between h-full shadow-2xl relative overflow-hidden group">

            {/* Ambient gold glow decorative element */}
            <div className="absolute -top-12 -right-12 w-32 h-32 bg-[#e49505]/10 rounded-full blur-3xl pointer-events-none transition-opacity duration-500 group-hover:bg-[#e49505]/15" />

            <div className="space-y-6">
              {/* Type / Tag Badges */}
              <div className="flex flex-wrap gap-2">
                {obj.type.split('|').map((t: string) => t.trim()).filter(Boolean).map((tag: string) => (
                  <span
                    key={tag}
                    className="text-xs font-semibold px-3.5 py-1 rounded-full bg-[#e49505]/10 border border-[#e49505]/20 text-[#e49505] uppercase tracking-wider transition-colors hover:bg-[#e49505]/20"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              {/* Project Title */}
              <div>
                <h1 className="text-3xl sm:text-4xl font-extrabold text-white dark:text-foreground tracking-tight leading-tight mb-2">
                  {obj.title}
                </h1>
              </div>

              {/* Thin Premium Separator */}
              <div className="h-[1px] w-full bg-gradient-to-r from-white/10 via-white/5 to-transparent dark:from-zinc-800 dark:via-zinc-800/50" />

              {/* Description */}
              {/* Description / Content (Rendered as Visual Markdown via Tailwind Typography) */}
              {obj.description && (
                <div
                  className="prose prose-invert prose-headings:text-white prose-a:text-[#e49505] prose-strong:text-white prose-code:text-[#e49505] max-w-none text-zinc-200 dark:text-zinc-300 text-sm sm:text-base leading-relaxed font-normal"
                  dangerouslySetInnerHTML={{ __html: parseMarkdown(obj.description || "") }}
                />
              )}
            </div>

            {/* Middle Spacer / Separator */}
            <div className="my-6 h-[1px] w-full bg-gradient-to-r from-white/10 via-white/5 to-transparent dark:from-zinc-800 dark:via-zinc-800/50" />

            <div className="space-y-6">
              {/* Dynamic Metadata Mini-Cards */}
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1 p-3.5 rounded-xl bg-white/[0.02] dark:bg-zinc-950/20 border border-white/5 dark:border-zinc-800/50">
                  <span className="text-[10px] text-zinc-450 dark:text-zinc-500 uppercase font-semibold tracking-wider">Created</span>
                  <span className="text-xs text-white/90 dark:text-zinc-300 font-medium">{formatDate(obj.createdAt)}</span>
                </div>
                <div className="flex flex-col gap-1 p-3.5 rounded-xl bg-white/[0.02] dark:bg-zinc-950/20 border border-white/5 dark:border-zinc-800/50">
                  <span className="text-[10px] text-zinc-450 dark:text-zinc-500 uppercase font-semibold tracking-wider">Last Updated</span>
                  <span className="text-xs text-white/90 dark:text-zinc-300 font-medium">{formatDate(obj.updatedAt)}</span>
                </div>
              </div>

              {/* Premium Responsive CTA Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 w-full">
                {obj.link && (
                  <a
                    href={obj.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 flex items-center justify-center gap-2 px-6 py-3.5 bg-gradient-to-r from-[#e49505] to-[#f39c12] hover:from-[#f39c12] hover:to-[#e49505] text-black font-bold rounded-xl shadow-lg hover:shadow-[#e49505]/20 transform hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 text-center"
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
                    className="flex-1 flex items-center justify-center gap-2 px-6 py-3.5 bg-white/5 hover:bg-white/10 dark:bg-zinc-800/50 dark:hover:bg-zinc-800 text-white dark:text-zinc-300 font-semibold rounded-xl border border-white/15 dark:border-zinc-700 hover:border-white/30 dark:hover:border-zinc-600 transform hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 text-center"
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
    </div>
  )
}