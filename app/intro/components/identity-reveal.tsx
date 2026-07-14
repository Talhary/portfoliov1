'use client';

import React from 'react';
import { useIntro } from '../context/intro-context';
export default function IdentityReveal() {
  const { journeyMode } = useIntro();
  // Render always so GSAP selection targets exist in the DOM
  const getRoleTitle = () => {
    switch (journeyMode) {
      case 'mern':
        return 'MERN Specialist';
      case 'backend':
        return 'Backend Architect';
      case 'automation':
        return 'Automation Engineer';
      default:
        return 'Full Stack Architect';
    }
  };

  return (
    <div id="scene-identity" className="scene flex flex-col items-center justify-center text-center">
      <div className="relative">
        <h1
          id="main-name"
          className="font-synco text-7xl sm:text-8xl md:text-9xl font-black tracking-tighter m-0 leading-none text-white glitch-text-amber"
          data-text="TALHA"
        >
          TALHA
        </h1>
        <div
          id="role-mask-wrapper"
          className="mt-6 inline-block overflow-hidden relative rounded"
        >
          <div
            id="role-mask"
            className="px-6 py-2 border border-white/10 bg-black/60 backdrop-blur-md relative"
          >
            <div className="font-mono-code text-lg sm:text-2xl tracking-[0.4em] text-[#e49505] uppercase font-bold whitespace-nowrap">
              {getRoleTitle()}
            </div>
            {/* Visual glow strip */}
            <div id="role-glitch-layer" className="absolute inset-0 bg-[#e49505] mix-blend-overlay origin-left scale-x-0"></div>
          </div>
        </div>

        <p className="mt-4 font-mono-code text-zinc-400 text-xs sm:text-sm tracking-wider uppercase">
          Woltrio Engineer &bull; Islamabad, Pakistan
        </p>
      </div>
    </div>
  );
}
