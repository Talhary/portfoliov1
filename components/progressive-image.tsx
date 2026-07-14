'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { cn } from '@/lib/utils';

interface ProgressiveImageProps {
  src: string;
  alt: string;
  fill?: boolean;
  priority?: boolean;
  className?: string;
  sizes?: string;
  objectFit?: 'cover' | 'contain';
}

export function ProgressiveImage({
  src,
  alt,
  fill = true,
  priority = false,
  className,
  sizes,
  objectFit = 'contain',
}: ProgressiveImageProps) {
  const [highResLoaded, setHighResLoaded] = useState(false);

  // Reset loaded status if src changes
  useEffect(() => {
    setHighResLoaded(false);
  }, [src]);

  const fitClass = objectFit === 'cover' ? 'object-cover' : 'object-contain';

  return (
    <div className="relative w-full h-full overflow-hidden flex items-center justify-center">
      {/* Low-res placeholder image (blurred) */}
      {!highResLoaded && (
        <Image
          key={`lowres-${src}`}
          src={src}
          alt={alt}
          fill={fill}
          sizes="16px" // requests extremely tiny version from Next.js optimizer
          quality={10} // extremely low quality for speed
          priority={true}
          className={cn(
            fitClass,
            "w-full h-full blur-md scale-[1.03] transition-opacity duration-300 pointer-events-none",
            highResLoaded ? "opacity-0" : "opacity-100"
          )}
        />
      )}

      {/* High-res image */}
      <Image
        key={`highres-${src}`}
        src={src}
        alt={alt}
        fill={fill}
        sizes={sizes}
        priority={priority}
        onLoad={() => setHighResLoaded(true)}
        className={cn(
          fitClass,
          "w-full h-full transition-all duration-500 ease-out",
          highResLoaded ? "opacity-100 scale-100 blur-0" : "opacity-0 scale-[0.98] blur-sm",
          className
        )}
      />

      {/* Loading Spinner / Sleek Gold Progress Ring Overlay */}
      {!highResLoaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/5 dark:bg-black/20 backdrop-blur-[1px] pointer-events-none transition-opacity duration-300">
          <div className="relative flex items-center justify-center">
            {/* Spinning Gold Arc */}
            <div className="w-8 h-8 border-2 border-primary/15 border-t-primary rounded-full animate-spin" />
          </div>
        </div>
      )}
    </div>
  );
}
