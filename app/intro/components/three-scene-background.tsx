'use client';

import React, { useRef } from 'react';
import { useThreeBackground } from '../hooks/use-three-background';

export default function ThreeSceneBackground() {
  const containerRef = useRef<HTMLDivElement>(null);
  useThreeBackground(containerRef);

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 w-full h-full z-10 pointer-events-none opacity-80"
    />
  );
}
