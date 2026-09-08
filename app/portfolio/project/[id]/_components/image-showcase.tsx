'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight, Maximize2, Globe, Lock } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { ProgressiveImage } from '@/components/progressive-image';

interface ImageShowcaseProps {
  images: string[];
  link?: string;
}

export function ImageShowcase({ images, link }: ImageShowcaseProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);

  let displayDomain = 'talhacodes.site';
  if (link) {
    try {
      if (link.startsWith('http')) {
        const u = new URL(link);
        displayDomain = u.hostname;
      } else if (link.startsWith('/')) {
        displayDomain = `talhacodes.site${link}`;
      }
    } catch {
      displayDomain = link.replace(/https?:\/\//, '').split('/')[0];
    }
  }

  if (!images || images.length === 0) {
    return (
      <div className="w-full aspect-[16/10] bg-zinc-900/50 border border-zinc-800 rounded-2xl flex items-center justify-center text-zinc-400">
        <span className="text-sm">No images available</span>
      </div>
    );
  }

  const handlePrev = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const handleNext = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  const handleThumbnailClick = (idx: number, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentIndex(idx);
  };

  const nextIndex = (currentIndex + 1) % images.length;
  const prevIndex = (currentIndex - 1 + images.length) % images.length;

  return (
    <div className="w-full flex flex-col gap-3">
      {/* Modern Browser Mockup Frame */}
      <div className="w-full rounded-2xl overflow-hidden border border-zinc-200 dark:border-zinc-800 bg-[#0d0d10] shadow-2xl flex flex-col group transition-all duration-300">
        
        {/* Browser Top Navigation Bar */}
        <div className="flex items-center justify-between px-4 py-2.5 bg-zinc-100/90 dark:bg-zinc-900/90 border-b border-zinc-200/80 dark:border-zinc-800/80 backdrop-blur-md select-none">
          {/* Window Control Buttons */}
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-[#ff5f56] border border-black/10 inline-block shadow-sm" />
            <span className="w-3 h-3 rounded-full bg-[#ffbd2e] border border-black/10 inline-block shadow-sm" />
            <span className="w-3 h-3 rounded-full bg-[#27c93f] border border-black/10 inline-block shadow-sm" />
          </div>

          {/* Centered URL Hostname Pill */}
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/70 dark:bg-zinc-950/80 border border-zinc-200 dark:border-zinc-800 text-[11px] text-zinc-600 dark:text-zinc-400 font-mono tracking-tight max-w-[220px] sm:max-w-xs truncate shadow-inner">
            <Lock className="w-3 h-3 text-emerald-500 shrink-0" />
            <span className="truncate">{displayDomain}</span>
          </div>

          {/* Right Counter & Zoom Action */}
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-semibold text-zinc-500 dark:text-zinc-400 font-mono">
              {currentIndex + 1}/{images.length}
            </span>
            <button 
              type="button"
              className="p-1 rounded-md text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800/80 transition-colors"
              title="Fullscreen view"
              onClick={(e) => {
                e.stopPropagation();
                setIsZoomed(true);
              }}
            >
              <Maximize2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Viewport Display Area */}
        <div 
          className="relative w-full aspect-[16/10] bg-[#070709] overflow-hidden flex items-center justify-center cursor-pointer"
          onClick={() => setIsZoomed(true)}
        >
          {/* Subtle Ambient Radial Glow */}
          <div 
            className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--project-color,_#ef4444)_0%,_transparent_75%)] opacity-10 pointer-events-none transition-opacity duration-500 group-hover:opacity-20" 
          />

          <ProgressiveImage
            src={images[currentIndex]}
            alt={`Showcase Image ${currentIndex + 1}`}
            fill
            sizes="(max-width: 1024px) 100vw, 60vw"
            priority
            className="object-contain w-full h-full p-1.5 sm:p-2.5 transition-transform duration-500 ease-out group-hover:scale-[1.01]"
          />

          {/* Navigation Arrows */}
          {images.length > 1 && (
            <>
              <button
                type="button"
                onClick={handlePrev}
                className="absolute left-3 top-1/2 -translate-y-1/2 z-10 p-2.5 rounded-full bg-black/60 hover:bg-[var(--project-color,#ef4444)] border border-white/10 text-white/90 hover:text-white backdrop-blur-md opacity-0 group-hover:opacity-100 focus:opacity-100 transition-all duration-200 transform hover:scale-105 active:scale-95 shadow-xl"
                aria-label="Previous image"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                type="button"
                onClick={handleNext}
                className="absolute right-3 top-1/2 -translate-y-1/2 z-10 p-2.5 rounded-full bg-black/60 hover:bg-[var(--project-color,#ef4444)] border border-white/10 text-white/90 hover:text-white backdrop-blur-md opacity-0 group-hover:opacity-100 focus:opacity-100 transition-all duration-200 transform hover:scale-105 active:scale-95 shadow-xl"
                aria-label="Next image"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </>
          )}
        </div>
      </div>

      {/* Thumbnail Strip */}
      {images.length > 1 && (
        <div className="flex flex-wrap gap-2.5 items-center justify-start py-1">
          {images.map((img, idx) => (
            <button
              key={img}
              type="button"
              onClick={(e) => handleThumbnailClick(idx, e)}
              className={cn(
                "relative w-16 sm:w-20 aspect-[16/10] rounded-lg overflow-hidden border transition-all duration-200 bg-zinc-950",
                idx === currentIndex
                  ? "border-[var(--project-color,#ef4444)] ring-2 ring-[var(--project-color,#ef4444)]/40 scale-105 opacity-100 shadow-md"
                  : "border-zinc-200 dark:border-zinc-800 opacity-60 hover:opacity-100 hover:border-[var(--project-color,#ef4444)]/50"
              )}
            >
              <Image
                src={img}
                alt={`Thumbnail ${idx + 1}`}
                fill
                sizes="80px"
                className="object-cover w-full h-full"
              />
            </button>
          ))}
        </div>
      )}

      {/* Fullscreen Modal Dialog */}
      <Dialog open={isZoomed} onOpenChange={setIsZoomed}>
        <DialogContent className="max-w-[95vw] md:max-w-[88vw] h-[85vh] p-0 border-none bg-black/95 shadow-2xl overflow-hidden sm:rounded-2xl flex items-center justify-center z-50">
          <div className="relative w-full h-full flex items-center justify-center">
            
            <ProgressiveImage
              src={images[currentIndex]}
              alt={`Fullscreen Showcase Image ${currentIndex + 1}`}
              fill
              className="object-contain p-3 md:p-8"
              sizes="90vw"
              priority
            />

            {images.length > 1 && (
              <>
                <button
                  type="button"
                  onClick={handlePrev}
                  className="absolute left-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/10 hover:bg-[var(--project-color,#ef4444)] border border-white/10 text-white backdrop-blur-md transition-all transform hover:scale-105 active:scale-95 z-50 shadow-xl"
                  aria-label="Previous image"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
                <button
                  type="button"
                  onClick={handleNext}
                  className="absolute right-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/10 hover:bg-[var(--project-color,#ef4444)] border border-white/10 text-white backdrop-blur-md transition-all transform hover:scale-105 active:scale-95 z-50 shadow-xl"
                  aria-label="Next image"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>
              </>
            )}

            <div className="absolute top-4 left-4 z-50">
              <span className="px-3.5 py-1.5 text-xs font-semibold rounded-full bg-white/10 border border-white/10 backdrop-blur-md text-white font-mono tracking-wide">
                {currentIndex + 1} / {images.length}
              </span>
            </div>
            
          </div>
        </DialogContent>
      </Dialog>

      {/* Preload adjacent images */}
      {images.length > 1 && (
        <div className="hidden" aria-hidden="true">
          <Image
            key={`preload-next-${nextIndex}`}
            src={images[nextIndex]}
            alt="preload-next"
            fill
            sizes="(max-width: 1024px) 100vw, 60vw"
            priority
          />
          <Image
            key={`preload-prev-${prevIndex}`}
            src={images[prevIndex]}
            alt="preload-prev"
            fill
            sizes="(max-width: 1024px) 100vw, 60vw"
            priority
          />
        </div>
      )}
    </div>
  );
}


