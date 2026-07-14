'use client';

import React from 'react';
import Link from 'next/link';
import { Terminal, BookOpen, Mail, Phone, MapPin } from 'lucide-react';
import { FaArrowRight } from 'react-icons/fa';
import { useIntro } from '../context/intro-context';

interface FinalResolutionProps {
  playClickSound: () => void;
}

export default function FinalResolution({ playClickSound }: FinalResolutionProps) {
  const { journeyMode } = useIntro();

  const getJourneyLabel = () => {
    switch (journeyMode) {
      case 'mern':
        return 'MERN SPECIALIST';
      case 'backend':
        return 'BACKEND ARCHITECT';
      case 'automation':
        return 'AUTOMATION AGENT';
      default:
        return 'FULL STACK DEV';
    }
  };

  return (
    <div id="scene-final" className="scene z-20">
      <div className="flex flex-col items-center justify-center text-center max-w-xl px-4 w-full select-none">
        
        {/* Pulsing visual seal logo */}
        <div
          id="final-logo-glowing"
          className="w-20 h-20 mb-6 rounded-full border border-[#e49505] flex items-center justify-center bg-[#0b101d] shadow-[0_0_35px_rgba(228,149,5,0.45)] relative animate-pulse"
        >
          <Terminal size={32} className="text-[#e49505]" />
        </div>

        <h1 id="final-title-text" className="font-synco text-4xl sm:text-5xl text-white mb-2">
          TALHACODES<span className="text-[#e49505]">.SITE</span>
        </h1>

        <div className="flex items-center gap-2.5 mb-6">
          <p className="font-mono-code text-zinc-400 text-xs sm:text-sm uppercase tracking-widest">
            Full Stack Software Engineer &bull; Woltrio
          </p>
          <span className="px-2 py-0.5 border border-[#e49505]/30 rounded bg-[#e49505]/10 text-[#e49505] font-mono-code text-[9px] uppercase tracking-wider font-bold">
            {getJourneyLabel()}
          </span>
        </div>

        <hr className="w-24 border-[#e49505]/40 mb-6" />

        {/* Structured Education & Contact Details */}
        <div className="flex flex-col gap-3.5 w-full mb-8 font-mono-code text-xs text-left px-4 pointer-events-auto">

          {/* Academics Box */}
          <div className="final-info-item flex items-center gap-3 p-3 bg-white/[0.02] border border-white/5 rounded-xl hover:bg-white/[0.04] transition-all duration-200">
            <BookOpen size={16} className="text-[#e49505] shrink-0" />
            <div>
              <span className="text-[10px] text-zinc-500 font-bold block">ACADEMICS</span>
              <span className="text-zinc-300">BS Mathematics &bull; Quaid-e-Azam University</span>
            </div>
          </div>

          {/* Email Box */}
          <a
            href="mailto:mtalhamaths@gmail.com"
            onClick={playClickSound}
            className="final-info-item flex items-center gap-3 p-3 bg-white/[0.02] border border-white/5 rounded-xl hover:border-[#e49505]/40 hover:bg-[#e49505]/5 transition-all duration-200"
          >
            <Mail size={16} className="text-[#e49505] shrink-0" />
            <div>
              <span className="text-[10px] text-zinc-500 font-bold block">EMAIL ADDRESS</span>
              <span className="text-zinc-300">mtalhamaths@gmail.com</span>
            </div>
          </a>

          {/* Phone Box */}
          <a
            href="tel:+923185853847"
            onClick={playClickSound}
            className="final-info-item flex items-center gap-3 p-3 bg-white/[0.02] border border-white/5 rounded-xl hover:border-[#e49505]/40 hover:bg-[#e49505]/5 transition-all duration-200"
          >
            <Phone size={16} className="text-[#e49505] shrink-0" />
            <div>
              <span className="text-[10px] text-zinc-500 font-bold block">PHONE CONTACT</span>
              <span className="text-zinc-300">+92-318-5853847</span>
            </div>
          </a>

          {/* Location Box */}
          <div className="final-info-item flex items-center gap-3 p-3 bg-white/[0.02] border border-white/5 rounded-xl hover:bg-white/[0.04] transition-all duration-200">
            <MapPin size={16} className="text-[#e49505] shrink-0" />
            <div>
              <span className="text-[10px] text-zinc-500 font-bold block">LOCATION NODE</span>
              <span className="text-zinc-300">Bhara Kahu, Islamabad, Pakistan</span>
            </div>
          </div>

        </div>

        {/* Exit CTA */}
        <Link
          id="final-exit-btn"
          href="/"
          onClick={playClickSound}
          className="px-8 py-3.5 bg-gradient-to-r from-[#e49505] to-[#f59e0b] hover:from-[#c98304] hover:to-[#d97706] text-black font-synco text-xs font-black tracking-widest rounded-xl transition-all duration-300 transform hover:scale-[1.04] active:scale-[0.97] shadow-[0_0_25px_rgba(228,149,5,0.35)] flex items-center gap-2.5 pointer-events-auto"
        >
          <span>ACCESS STANDARD PORTFOLIO</span>
          <FaArrowRight className="text-xs" />
        </Link>
      </div>
    </div>
  );
}
