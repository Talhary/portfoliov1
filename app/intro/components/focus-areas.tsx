'use client';

import React from 'react';
import { FaReact, FaRobot, FaNodeJs, FaDocker } from 'react-icons/fa';
import { SiNextdotjs, SiPostgresql, SiJavascript } from 'react-icons/si';
import { Terminal } from 'lucide-react';
import { useIntro } from '../context/intro-context';

export default function FocusAreas() {
  const { journeyMode } = useIntro();

  // Compile tailored focus areas based on selected journey
  const getFocusAreas = () => {
    switch (journeyMode) {
      case 'mern':
        return [
          {
            title: 'MERN Stack Development',
            Icon: FaReact,
            text: 'Architecting end-to-end web applications, modular React structures, and state controllers.'
          },
          {
            title: 'Next.js Applications',
            Icon: SiNextdotjs,
            text: 'Developing high-speed portals using Next.js 15, React Server Components, SSR/ISR, and routing.'
          },
          {
            title: 'UX & Fluid Animations',
            Icon: SiJavascript,
            text: 'Building rich, interactive customer frontends utilizing GSAP, custom SVG graphics, and web audio.'
          }
        ];
      case 'backend':
        return [
          {
            title: 'Backend Systems',
            Icon: FaNodeJs,
            text: 'Constructing performant web servers, RESTful routing models, and concurrent request handlers.'
          },
          {
            title: 'Database Architecture',
            Icon: SiPostgresql,
            text: 'Structuring PostgreSQL schemas, indexes, executing optimizations, and database migrations.'
          },
          {
            title: 'DevOps & Sandbox',
            Icon: FaDocker,
            text: 'Isolating backend runtime processes and packaging microservices using Docker containers.'
          }
        ];
      case 'automation':
        return [
          {
            title: 'Bot Development',
            Icon: FaRobot,
            text: 'Creating autonomous automation bots, triggers, scrapers, and task-automation software.'
          },
          {
            title: 'Data Collection Systems',
            Icon: Terminal,
            text: 'Mining and harvesting public data streams, bypass mechanisms, and clean JSON mapping.'
          },
          {
            title: 'Server Utilities',
            Icon: FaDocker,
            text: 'Configuring cron tasks, alert notification dispatch loops, and scheduled script executions.'
          }
        ];
      default:
        return [
          {
            title: 'MERN Stack Development',
            Icon: FaReact,
            text: 'Architecting end-to-end applications from database models to reactive user interfaces.'
          },
          {
            title: 'Next.js Applications',
            Icon: SiNextdotjs,
            text: 'Developing highly optimized web portals with advanced rendering modes and API routes.'
          },
          {
            title: 'Bot Development',
            Icon: FaRobot,
            text: 'Writing custom scripts, scrapers, and automation bots to eliminate repetitive tasks.'
          }
        ];
    }
  };

  const areas = getFocusAreas();

  return (
    <div id="scene-focus" className="scene z-20">
      <div className="flex flex-col items-center justify-center w-full max-w-5xl text-center px-4 select-none">
        <h2 id="focus-header" className="font-synco text-2xl sm:text-4xl text-white tracking-widest mb-12 uppercase">
          CORE SPECIALIZATION
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
          {areas.map((area, idx) => {
            const AreaIcon = area.Icon;
            return (
              <div
                key={idx}
                className="focus-card-anim bg-[#0b101d]/85 border border-zinc-800 rounded-2xl p-6 text-left relative overflow-hidden shadow-xl backdrop-blur-md hover:border-[#e49505]/40 transition-colors duration-300"
              >
                <div className="absolute top-0 right-0 w-24 h-24 bg-[#e49505]/5 rounded-full blur-xl pointer-events-none" />
                <div className="inline-flex items-center justify-center p-3.5 rounded-xl bg-[#e49505]/10 border border-[#e49505]/20 text-[#e49505] mb-5">
                  <AreaIcon className="text-2xl" />
                </div>
                <h3 className="font-synco text-sm font-bold text-white tracking-tight mb-2 uppercase">
                  {area.title}
                </h3>
                <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed font-light">
                  {area.text}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
