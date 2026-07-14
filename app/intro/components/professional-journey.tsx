'use client';

import React, { useState } from 'react';
import { Briefcase } from 'lucide-react';
import { useIntro } from '../context/intro-context';

const experiences = [
  {
    title: 'Full Stack Software Engineer',
    company: 'Woltrio',
    dates: 'Jan 2025 - Present',
    description: 'Designing and implementing production-ready features. Optimizing database queries, constructing APIs, and building clean web interfaces.'
  },
  {
    title: 'Software Engineer Intern',
    company: 'Swismax Solutions',
    dates: 'Sep 2024 - Nov 2024',
    description: 'Contributed directly to team workflows and front-end features. Focused on collaborative coding and writing clean components.'
  }
];

interface ProfessionalJourneyProps {
  playHoverSound: () => void;
}

export default function ProfessionalJourney({ playHoverSound }: ProfessionalJourneyProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const handleHover = (idx: number) => {
    setHoveredIndex(idx);
    playHoverSound();
  };

  return (
    <div id="scene-journey" className="scene z-20">
      <div className="flex flex-col items-center justify-center w-full max-w-4xl text-center px-4 select-none">
        <h2 id="journey-header" className="font-synco text-2xl sm:text-4xl text-white tracking-widest mb-12 uppercase">
          PROFESSIONAL JOURNEY
        </h2>

        <div className="relative w-full max-w-3xl flex flex-col gap-6 text-left pointer-events-auto">
          {/* Vertical line connector */}
          <div className="absolute left-[37px] top-6 bottom-6 w-[2px] bg-gradient-to-b from-[#e49505] to-zinc-800" />

          {experiences.map((exp, idx) => (
            <div
              key={idx}
              className="journey-timeline-card flex items-start gap-4 sm:gap-6 relative z-10 cursor-pointer"
              onMouseEnter={() => handleHover(idx)}
              onMouseLeave={() => setHoveredIndex(null)}
            >
              {/* Icon Node */}
              <div
                className={`h-10 w-10 sm:h-12 sm:w-12 rounded-xl flex items-center justify-center shrink-0 transition-all duration-300 ${
                  hoveredIndex === idx
                    ? 'bg-[#e49505] text-black shadow-[0_0_20px_rgba(228,149,5,0.4)] scale-110'
                    : 'bg-[#0b101d] border border-[#e49505]/30 text-[#e49505] shadow-[0_0_15px_rgba(228,149,5,0.1)]'
                }`}
              >
                <Briefcase size={20} />
              </div>

              {/* Glass Box */}
              <div
                className={`flex-1 border rounded-xl p-5 sm:p-6 backdrop-blur-md relative overflow-hidden transition-all duration-300 ${
                  hoveredIndex === idx
                    ? 'bg-[#0b101d] border-[#e49505]/45 shadow-[0_0_25px_rgba(228,149,5,0.15)]'
                    : 'bg-[#0b101d]/85 border-zinc-800'
                }`}
              >
                <div className="absolute top-0 right-0 w-24 h-24 bg-[#e49505]/5 rounded-full blur-xl pointer-events-none" />
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 mb-2">
                  <div>
                    <h4 className="font-synco text-xs sm:text-sm font-bold text-white tracking-tight">{exp.title}</h4>
                    <p className="text-xs text-[#e49505] font-semibold mt-0.5">At {exp.company}</p>
                  </div>
                  <span
                    className={`inline-flex px-2.5 py-1 rounded-full text-[10px] font-semibold uppercase tracking-wider w-fit sm:h-fit transition-colors duration-300 ${
                      hoveredIndex === idx
                        ? 'bg-[#e49505] text-black border-transparent'
                        : 'bg-[#e49505]/10 border border-[#e49505]/20 text-[#e49505]'
                    }`}
                  >
                    {exp.dates}
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-zinc-400 font-light leading-relaxed">
                  {exp.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
