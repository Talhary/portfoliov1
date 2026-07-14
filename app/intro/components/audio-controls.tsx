'use client';

import React from 'react';
import { Volume2, VolumeX, Music, Settings } from 'lucide-react';
import { useIntro, SynthTheme } from '../context/intro-context';

export default function AudioControls() {
  const { isMuted, setIsMuted, synthTheme, setSynthTheme } = useIntro();

  const handleThemeChange = (theme: SynthTheme) => {
    setSynthTheme(theme);
  };

  return (
    <div className="fixed top-6 right-6 z-50 flex items-center gap-3 bg-[#0b0f19]/80 border border-zinc-800/80 p-2 sm:p-3 rounded-xl backdrop-blur-md shadow-[0_0_20px_rgba(0,0,0,0.4)] pointer-events-auto">
      <style dangerouslySetInnerHTML={{
        __html: `
        @keyframes eq-bar-1 { 0%, 100% { height: 4px; } 50% { height: 14px; } }
        @keyframes eq-bar-2 { 0%, 100% { height: 6px; } 50% { height: 10px; } }
        @keyframes eq-bar-3 { 0%, 100% { height: 3px; } 50% { height: 16px; } }
        @keyframes eq-bar-4 { 0%, 100% { height: 5px; } 50% { height: 12px; } }
        .eq-bar-1 { animation: eq-bar-1 0.6s infinite ease-in-out; }
        .eq-bar-2 { animation: eq-bar-2 0.85s infinite ease-in-out; }
        .eq-bar-3 { animation: eq-bar-3 0.5s infinite ease-in-out; }
        .eq-bar-4 { animation: eq-bar-4 0.7s infinite ease-in-out; }
      `}} />

      {/* Mini Equalizer Indicator */}
      <div className="flex items-end gap-[3px] h-4 w-5 px-1 shrink-0">
        <div className={`w-[2.5px] bg-[#e49505] rounded-full transition-all duration-300 ${isMuted ? 'h-[2px]' : 'eq-bar-1'}`} />
        <div className={`w-[2.5px] bg-[#e49505] rounded-full transition-all duration-300 ${isMuted ? 'h-[2px]' : 'eq-bar-2'}`} />
        <div className={`w-[2.5px] bg-[#e49505] rounded-full transition-all duration-300 ${isMuted ? 'h-[2px]' : 'eq-bar-3'}`} />
        <div className={`w-[2.5px] bg-[#e49505] rounded-full transition-all duration-300 ${isMuted ? 'h-[2px]' : 'eq-bar-4'}`} />
      </div>

      {/* Vertical Splitter */}
      <div className="w-[1px] h-6 bg-zinc-800" />

      {/* Mute toggle button */}
      <button
        onClick={() => setIsMuted(!isMuted)}
        className="p-1.5 rounded-lg border border-zinc-800 bg-[#020617]/50 hover:bg-[#e49505]/10 hover:border-[#e49505]/40 text-zinc-400 hover:text-[#e49505] transition-all duration-200"
        title={isMuted ? 'Unmute Audio' : 'Mute Audio'}
      >
        {isMuted ? <VolumeX size={15} /> : <Volume2 size={15} />}
      </button>

      {/* Synth Theme Selector */}
      <div className="flex items-center gap-1 bg-[#020617]/60 p-0.5 border border-zinc-900 rounded-lg">
        {(['ambient', 'cyberpunk', 'retro'] as SynthTheme[]).map((theme) => (
          <button
            key={theme}
            onClick={() => handleThemeChange(theme)}
            className={`px-2.5 py-1 rounded-md text-[9px] font-mono-code uppercase tracking-wider transition-all duration-200 ${
              synthTheme === theme
                ? 'bg-[#e49505] text-black font-bold shadow-[0_0_10px_rgba(228,149,5,0.25)]'
                : 'text-zinc-500 hover:text-zinc-300 hover:bg-white/[0.02]'
            }`}
          >
            {theme}
          </button>
        ))}
      </div>
    </div>
  );
}
