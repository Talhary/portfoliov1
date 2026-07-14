'use client';

import React from 'react';
import { Terminal } from 'lucide-react';
import { useIntro } from '../context/intro-context';

interface StartScreenProps {
  onStart: () => void;
  onSkip: () => void;
}

export default function StartScreen({ onStart, onSkip }: StartScreenProps) {
  const { started, audioInitializing } = useIntro();

  return (
    <div
      id="start-screen-overlay"
      className={`absolute inset-0 w-full h-full z-50 bg-[#020617]/85 backdrop-blur-md flex flex-col justify-center items-center px-4 transition-all duration-500 ${
        started ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
    >
      <div className="relative border border-[#e49505]/25 bg-[#0b0f19]/90 p-8 sm:p-10 rounded-2xl shadow-[0_0_50px_rgba(228,149,5,0.15)] overflow-hidden max-w-xl w-full text-center">
        
        {/* Decorative Sci-Fi corners */}
        <div className="absolute top-4 left-4 font-mono-code text-[8px] sm:text-[9px] text-[#e49505]/50 tracking-wider">
          [ SEQUENCE: SYS_INIT ]
        </div>
        <div className="absolute top-4 right-4 font-mono-code text-[8px] sm:text-[9px] text-[#e49505]/50 tracking-wider">
          [ NODE: ONLINE ]
        </div>
        <div className="absolute bottom-4 left-4 font-mono-code text-[8px] sm:text-[9px] text-zinc-500 tracking-wider">
          [ LATENCY: ~14ms ]
        </div>
        <div className="absolute bottom-4 right-4 font-mono-code text-[8px] sm:text-[9px] text-zinc-500 tracking-wider">
          [ MATRIX: ARMED ]
        </div>

        <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[#e49505]/40 to-transparent animate-pulse" />

        {/* Central Pulsing Icon */}
        <div className="flex justify-center mb-6">
          <div className="h-16 w-16 rounded-full bg-gradient-to-br from-[#e49505]/15 to-transparent border border-[#e49505]/40 flex items-center justify-center text-[#e49505] shadow-[0_0_20px_rgba(228,149,5,0.25)] animate-pulse">
            <Terminal size={28} />
          </div>
        </div>

        <h1 className="font-synco text-2xl sm:text-3xl font-black tracking-[0.1em] text-white mb-2 uppercase">
          TALHACODES<span className="text-[#e49505]">.SITE</span>
        </h1>

        <p className="font-mono-code text-[11px] sm:text-xs text-zinc-400 mb-8 tracking-wide max-w-sm mx-auto leading-relaxed border-y border-zinc-800 py-3">
          SYSTEM INITIALIZATION ENGINE v3.0
          <br />
          ENGAGING 3D PARTICLE FIELD & GEOMETRIC AUDIO SYNTHS
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <button
            onClick={onStart}
            className="w-full sm:w-auto px-8 py-3.5 bg-gradient-to-r from-[#e49505] to-[#f59e0b] hover:from-[#c98304] hover:to-[#d97706] text-black font-synco text-xs font-black tracking-widest rounded-xl transition-all duration-300 transform hover:scale-[1.03] active:scale-[0.97] shadow-[0_0_30px_rgba(228,149,5,0.35)] flex items-center justify-center gap-2 group/execute"
            disabled={audioInitializing}
          >
            <span>{audioInitializing ? 'INITIALIZING...' : 'EXECUTE SEQUENCE'}</span>
            {!audioInitializing && (
              <span className="transform group-hover/execute:translate-x-1 transition-transform">
                &rarr;
              </span>
            )}
          </button>
          <button
            onClick={onSkip}
            className="w-full sm:w-auto px-6 py-3.5 bg-black/40 hover:bg-white/[0.04] border border-[#e49505]/20 hover:border-[#e49505]/50 text-zinc-400 hover:text-white font-synco text-xs tracking-widest rounded-xl transition-all duration-200"
          >
            SKIP INTRO
          </button>
        </div>
      </div>
    </div>
  );
}
