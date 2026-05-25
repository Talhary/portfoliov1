'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight, Maximize2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { ProgressiveImage } from '@/components/progressive-image';

interface ImageShowcaseProps {
  images: string[];
}

export function ImageShowcase({ images }: ImageShowcaseProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);

  if (!images || images.length === 0) {
    return (
      <div className="w-full aspect-[16/10] bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center text-zinc-400">
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
    <div className="w-full flex flex-col gap-4">
      {/* Main Image Viewport */}
      <div 
        className="w-full aspect-[16/10] relative rounded-2xl overflow-hidden border border-stone-200/50 dark:border-white/5 bg-zinc-950/60 shadow-2xl group transition-all duration-300 cursor-pointer"
        onClick={() => setIsZoomed(true)}
      >
        <ProgressiveImage
          src={images[currentIndex]}
          alt={`Project Showcase Image ${currentIndex + 1}`}
          fill
          sizes="(max-width: 1024px) 100vw, 60vw"
          priority
          className="object-contain w-full h-full transition-transform duration-700 ease-out group-hover:scale-[1.02]"
        />

        {/* Ambient Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent pointer-events-none" />

        {/* Navigation Arrows */}
        {images.length > 1 && (
          <>
            <button
              type="button"
              onClick={handlePrev}
              className="absolute left-4 top-1/2 -translate-y-1/2 z-10 p-2.5 rounded-full bg-black/40 hover:bg-[#e49505] border border-white/10 text-white/80 hover:text-white backdrop-blur-md opacity-0 group-hover:opacity-100 focus:opacity-100 transition-all duration-200 transform hover:scale-105 active:scale-95"
              aria-label="Previous image"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              type="button"
              onClick={handleNext}
              className="absolute right-4 top-1/2 -translate-y-1/2 z-10 p-2.5 rounded-full bg-black/40 hover:bg-[#e49505] border border-white/10 text-white/80 hover:text-white backdrop-blur-md opacity-0 group-hover:opacity-100 focus:opacity-100 transition-all duration-200 transform hover:scale-105 active:scale-95"
              aria-label="Next image"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </>
        )}

        {/* Top Floating Badge for Zoom / Info */}
        <div className="absolute top-4 right-4 flex items-center gap-2 z-10">
          <span className="px-3 py-1 text-xs font-semibold rounded-full bg-black/50 border border-white/10 backdrop-blur-md text-white/95 tracking-wide">
            {currentIndex + 1} / {images.length}
          </span>
          <button 
            type="button"
            className="p-1.5 rounded-full bg-black/50 border border-white/10 backdrop-blur-md text-white/80 hover:text-white hover:bg-black/70 transition-all"
            title="View fullscreen"
            onClick={(e) => {
              e.stopPropagation();
              setIsZoomed(true);
            }}
          >
            <Maximize2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Fullscreen Dialog Enlarger (Portal-backed to prevent parent stacking context bugs) */}
      <Dialog open={isZoomed} onOpenChange={setIsZoomed}>
        <DialogContent className="max-w-[95vw] md:max-w-[85vw] h-[85vh] p-0 border-none bg-black/95 shadow-none overflow-hidden sm:rounded-2xl flex items-center justify-center z-50">
          <div className="relative w-full h-full flex items-center justify-center">
            
            <ProgressiveImage
              src={images[currentIndex]}
              alt={`Fullscreen Showcase Image ${currentIndex + 1}`}
              fill
              className="object-contain p-2 md:p-8"
              sizes="90vw"
              priority
            />

            {/* Fullscreen Dialog Navigation Arrows */}
            {images.length > 1 && (
              <>
                <button
                  type="button"
                  onClick={handlePrev}
                  className="absolute left-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/10 hover:bg-[#e49505] border border-white/10 text-white backdrop-blur-md transition-all transform hover:scale-105 active:scale-95 z-50"
                  aria-label="Previous image"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
                <button
                  type="button"
                  onClick={handleNext}
                  className="absolute right-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/10 hover:bg-[#e49505] border border-white/10 text-white backdrop-blur-md transition-all transform hover:scale-105 active:scale-95 z-50"
                  aria-label="Next image"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>
              </>
            )}

            {/* Top Info Floating Badge */}
            <div className="absolute top-4 left-4 z-50">
              <span className="px-3.5 py-1.5 text-xs font-semibold rounded-full bg-white/10 border border-white/10 backdrop-blur-md text-white tracking-wide">
                {currentIndex + 1} / {images.length}
              </span>
            </div>
            
          </div>
        </DialogContent>
      </Dialog>

      {/* Thumbnail Bar (Only if multiple images) */}
      {images.length > 1 && (
        <div className="flex flex-wrap gap-2.5 items-center justify-start py-1">
          {images.map((img, idx) => (
            <button
              key={img}
              type="button"
              onClick={(e) => handleThumbnailClick(idx, e)}
              className={cn(
                "relative w-20 aspect-[16/10] rounded-lg overflow-hidden border transition-all duration-200 bg-zinc-900",
                idx === currentIndex
                  ? "border-[#e49505] ring-2 ring-[#e49505]/30 scale-105 opacity-100"
                  : "border-white/10 opacity-60 hover:opacity-100 hover:border-[#e49505]/40"
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

      {/* Hidden preloader for adjacent images (high-res optimized versions) */}
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

