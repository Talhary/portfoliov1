'use client';

import React, { useState } from 'react';
import { SiNextdotjs, SiTypescript, SiExpress, SiMongodb, SiPostgresql } from 'react-icons/si';
import { FaReact, FaNodeJs, FaDocker } from 'react-icons/fa';
import { useIntro } from '../context/intro-context';

const skillsData = [
  { name: 'Next.js', Icon: SiNextdotjs, color: '#ffffff', desc: 'SSR/ISR, React Server Components, API routes and application bundles optimization.' },
  { name: 'React', Icon: FaReact, color: '#61DAFB', desc: 'Constructing performant reactive client frontends, custom state management and hooks.' },
  { name: 'Node.js', Icon: FaNodeJs, color: '#339933', desc: 'Developing high-throughput REST APIs, server logic and background worker processes.' },
  { name: 'TypeScript', Icon: SiTypescript, color: '#3178C6', desc: 'Applying strict type checking to establish highly maintainable, self-documenting codebases.' },
  { name: 'PostgreSQL', Icon: SiPostgresql, color: '#336791', desc: 'Designing relational database models, optimizing query plans, joins and relational structures.' },
  { name: 'Express', Icon: SiExpress, color: '#e49505', desc: 'Building clean REST architectures, routing tables, and security/logging middlewares.' },
  { name: 'MongoDB', Icon: SiMongodb, color: '#47A248', desc: 'Storing high-volume logs, document schemas, and caching session/bot statuses.' },
  { name: 'Docker', Icon: FaDocker, color: '#2496ED', desc: 'Standardizing staging containers and isolating environments for scrapers and APIs.' },
];

interface TechMatrixProps {
  playNodeSound: (idx: number) => void;
}

export default function TechMatrix({ playNodeSound }: TechMatrixProps) {
  const { currentScene, speedScale } = useIntro();
  const [activeSkill, setActiveSkill] = useState<typeof skillsData[0] | null>(null);
  // Render statically for GSAP animations to run on mount
  const handleNodeInteraction = (idx: number, skill: typeof skillsData[0]) => {
    setActiveSkill(skill);
    playNodeSound(idx);
    
    // Temporarily speed up particle tunnel rotation as a visual react
    const originalSpeed = speedScale.current.rotationSpeed;
    speedScale.current.rotationSpeed = 0.012;
    setTimeout(() => {
      speedScale.current.rotationSpeed = originalSpeed;
    }, 400);
  };

  return (
    <div id="scene-tech" className="scene flex flex-col items-center justify-center w-full h-full text-center">
      <h2 id="tech-matrix-header" className="font-synco text-3xl sm:text-4xl text-white tracking-widest absolute top-16 md:top-24 select-none">
        SYSTEM ARCHITECTURE
      </h2>

      <div
        id="tech-container-orbit"
        className="relative w-[320px] h-[320px] sm:w-[480px] sm:h-[480px] flex items-center justify-center pointer-events-auto"
        style={{ transformStyle: 'preserve-3d', perspective: '1000px' }}
      >
        {/* Mesh rings */}
        <div className="tech-ring-mesh absolute rounded-full border border-[#e49505]/20 w-[240px] h-[240px] sm:w-[380px] sm:h-[380px]" style={{ transform: 'rotateX(60deg) rotateY(0deg)' }} />
        <div className="tech-ring-mesh absolute rounded-full border border-white/10 w-[180px] h-[180px] sm:w-[280px] sm:h-[280px]" style={{ transform: 'rotateX(60deg) rotateY(30deg)' }} />

        {/* Floating skill nodes positioned dynamically by GSAP */}
        {skillsData.map((skill, index) => {
          const SkillIcon = skill.Icon;
          return (
            <button
              key={skill.name}
              onMouseEnter={() => handleNodeInteraction(index, skill)}
              onClick={() => handleNodeInteraction(index, skill)}
              className="orbit-tech-node absolute w-14 h-14 sm:w-16 sm:h-16 bg-[#020617]/95 border border-[#e49505]/30 rounded-xl flex flex-col justify-center items-center text-center opacity-0 scale-0 shadow-[0_0_20px_rgba(228,149,5,0.15)] hover:border-[#e49505] hover:shadow-[0_0_25px_rgba(228,149,5,0.45)] transition-colors duration-200 group cursor-pointer pointer-events-auto"
              style={{
                transformStyle: 'preserve-3d',
                transform: 'translate(0px, 0px) scale(0)',
              }}
            >
              <SkillIcon style={{ color: skill.color }} className="text-xl sm:text-2xl transition-transform duration-300 group-hover:scale-110" />
              <span className="font-mono-code text-[8px] sm:text-[9px] text-zinc-400 mt-1 uppercase font-bold">{skill.name}</span>
            </button>
          );
        })}
      </div>

      {/* Dynamic Skill Details Terminal Panel */}
      <div id="tech-subtext" className="absolute bottom-12 md:bottom-20 w-full max-w-xl px-6 font-mono-code text-xs sm:text-sm text-zinc-400">
        {activeSkill ? (
          <div className="bg-[#0b0f19]/80 border border-[#e49505]/20 p-4 rounded-xl shadow-lg backdrop-blur-md animate-fade-in text-left">
            <div className="flex items-center gap-2 mb-1.5">
              <span className="h-2 w-2 rounded-full bg-[#e49505] animate-ping" />
              <span className="text-[#e49505] font-bold uppercase tracking-wider">{activeSkill.name}</span>
            </div>
            <p className="text-zinc-300 text-[11px] sm:text-xs leading-relaxed font-light">{activeSkill.desc}</p>
          </div>
        ) : (
          <div className="border border-white/5 bg-[#0b0f19]/35 p-3 rounded-lg backdrop-blur-sm select-none">
            [ HOVER OR CLICK TECH NODES TO ACCESS CAPABILITY SYSTEM & PLAY SYNTH ]
          </div>
        )}
      </div>
    </div>
  );
}
