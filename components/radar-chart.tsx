"use client";

import React, { useState } from 'react';
import { Sparkles, CheckCircle2 } from 'lucide-react';

const CATEGORIES = [
  { name: 'Languages', value: 90, desc: 'TypeScript, JS, PHP' },
  { name: 'Frontend', value: 85, desc: 'Next.js, React' },
  { name: 'Backend', value: 88, desc: 'Node.js, Express, Deno' },
  { name: 'Databases', value: 80, desc: 'Postgres, Mongo, MySQL' },
  { name: 'DevOps & OS', value: 70, desc: 'Docker, Ubuntu, Linux' },
];

export const RadarChart = () => {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  // SVG dimensions
  const size = 320;
  const center = size / 2;
  const maxRadius = 110;

  // Angles for pentagon vertices (360 / 5 = 72 degrees = 1.2566 radians)
  const getCoordinates = (index: number, value: number) => {
    const angle = (index * 2 * Math.PI) / 5 - Math.PI / 2; // Subtract PI/2 to start pointing straight up
    const r = (value / 100) * maxRadius;
    const x = center + r * Math.cos(angle);
    const y = center + r * Math.sin(angle);
    return { x, y };
  };

  // Concentric background pentagons (grid rings)
  const rings = [25, 50, 75, 100];
  const ringPolygons = rings.map((ringValue) => {
    return Array.from({ length: 5 })
      .map((_, i) => {
        const { x, y } = getCoordinates(i, ringValue);
        return `${x},${y}`;
      })
      .join(' ');
  });

  // Calculate points for the active skills polygon
  const skillPoints = CATEGORIES.map((cat, i) => {
    const { x, y } = getCoordinates(i, cat.value);
    return `${x},${y}`;
  }).join(' ');

  // Calculate text coordinates for category labels
  const labelPositions = Array.from({ length: 5 }).map((_, i) => {
    const angle = (i * 2 * Math.PI) / 5 - Math.PI / 2;
    // Push labels slightly outside the 100% ring
    const labelRadius = maxRadius + 24;
    const x = center + labelRadius * Math.cos(angle);
    const y = center + labelRadius * Math.sin(angle);
    return { x, y };
  });

  return (
    <div className="bg-white/5 dark:bg-[#1a1a1c]/60 border border-white/10 dark:border-zinc-800/80 backdrop-blur-xl rounded-2xl p-6 sm:p-8 shadow-2xl relative overflow-hidden transition-all duration-300 hover:border-[#e49505]/20 group flex flex-col md:flex-row items-center gap-8">
      {/* Glow highlight */}
      <div className="absolute top-0 right-0 -mr-12 -mt-12 w-28 h-28 bg-[#e49505]/5 rounded-full blur-3xl pointer-events-none group-hover:bg-[#e49505]/10 transition-colors duration-300" />

      {/* Left Column: Visual SVG Chart */}
      <div className="relative shrink-0 select-none">
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="overflow-visible">
          <defs>
            {/* Soft gold drop shadow glow for the active shape */}
            <filter id="gold-glow" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="0" stdDeviation="6" floodColor="#e49505" floodOpacity="0.4" />
            </filter>
            {/* Gradient fill */}
            <radialGradient id="gold-grad" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#e49505" stopOpacity="0.15" />
              <stop offset="100%" stopColor="#e49505" stopOpacity="0.35" />
            </radialGradient>
          </defs>

          {/* 1. Draw Concentric Grid Rings */}
          {ringPolygons.map((points, idx) => (
            <polygon
              key={idx}
              points={points}
              className="fill-none stroke-stone-300/40 dark:stroke-zinc-850/60 stroke-[1]"
            />
          ))}

          {/* 2. Draw Radial Grid Lines */}
          {Array.from({ length: 5 }).map((_, i) => {
            const outerPoint = getCoordinates(i, 100);
            return (
              <line
                key={i}
                x1={center}
                y1={center}
                x2={outerPoint.x}
                y2={outerPoint.y}
                className="stroke-stone-350/40 dark:stroke-zinc-850/60 stroke-[1]"
              />
            );
          })}

          {/* 3. Draw Active Skills Polygon Shape */}
          <polygon
            points={skillPoints}
            fill="url(#gold-grad)"
            className="stroke-[#e49505] stroke-2"
            filter="url(#gold-glow)"
          />

          {/* 4. Draw Circular Vertices (Interactivity on hover) */}
          {CATEGORIES.map((cat, i) => {
            const { x, y } = getCoordinates(i, cat.value);
            const isHovered = hoveredIdx === i;
            return (
              <g 
                key={i} 
                className="cursor-pointer"
                onMouseEnter={() => setHoveredIdx(i)}
                onMouseLeave={() => setHoveredIdx(null)}
              >
                <circle
                  cx={x}
                  cy={y}
                  r={isHovered ? 6 : 4}
                  className={`fill-[#e49505] stroke-white dark:stroke-black transition-all duration-200 ${
                    isHovered ? 'ring-4 ring-[#e49505]/40 scale-125' : ''
                  }`}
                  strokeWidth={2}
                />
              </g>
            );
          })}

          {/* 5. Draw Category Text Labels */}
          {CATEGORIES.map((cat, i) => {
            const pos = labelPositions[i];
            const isHovered = hoveredIdx === i;
            // Align text anchor dynamically based on position
            let anchor :"middle" | "end" | "start" | "inherit" | 'undefined'= 'middle';
            if (pos.x < center - 10) anchor = 'end';
            if (pos.x > center + 10) anchor = 'start';
                 
            return (
              <text
                key={i}
                x={pos.x}
                y={pos.y + 4}
                textAnchor={anchor}
                className={`text-[11px] font-bold uppercase tracking-wider transition-colors duration-200 select-none ${
                  isHovered 
                    ? 'fill-[#e49505]' 
                    : 'fill-stone-600 dark:fill-zinc-400'
                }`}
              >
                {cat.name}
              </text>
            );
          })}
        </svg>
      </div>

      {/* Right Column: Detailed Skill Descriptions & Hover Info */}
      <div className="flex-1 space-y-4 w-full">
        <div>
          <span className="text-[10px] text-[#e49505] bg-[#e49505]/10 border border-[#e49505]/20 px-2.5 py-1 rounded-full font-bold uppercase tracking-widest">
            Infographic
          </span>
          <h4 className="text-xl font-bold text-white tracking-tight mt-2.5">
            Full-Stack Radar Matrix
          </h4>
          <p className="text-xs text-zinc-450 dark:text-zinc-400 leading-relaxed font-light mt-1.5">
            A comprehensive visual index mapping core proficiency levels across different development sectors. Hover over the nodes to drill down details.
          </p>
        </div>

        <hr className="border-white/5 dark:border-zinc-800/60 my-2" />

        {/* Categories Details List */}
        <div className="space-y-2.5">
          {CATEGORIES.map((cat, i) => {
            const isHovered = hoveredIdx === i;
            return (
              <div
                key={i}
                onMouseEnter={() => setHoveredIdx(i)}
                onMouseLeave={() => setHoveredIdx(null)}
                className={`flex items-center justify-between p-2 rounded-xl border transition-all duration-200 ${
                  isHovered
                    ? 'bg-[#e49505]/10 border-[#e49505]/30 translate-x-1'
                    : 'bg-white/[0.01] border-transparent hover:border-white/5 dark:hover:border-zinc-800/30'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <div className={`h-6 w-6 rounded-lg flex items-center justify-center border text-xs font-semibold ${
                    isHovered
                      ? 'bg-[#e49505] text-black border-[#e49505]'
                      : 'bg-white/5 border-white/10 text-[#e49505]'
                  }`}>
                    {i + 1}
                  </div>
                  <div>
                    <span className="text-xs font-bold text-white block uppercase tracking-wider leading-none">
                      {cat.name}
                    </span>
                    <span className="text-[10px] text-zinc-500 font-light block mt-0.5">
                      {cat.desc}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <span className="text-xs font-bold text-[#e49505]">{cat.value}%</span>
                  <CheckCircle2 className={`h-3.5 w-3.5 text-[#e49505] transition-all ${isHovered ? 'scale-110 opacity-100' : 'opacity-40'}`} />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
