'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Play, Square, Cpu } from 'lucide-react';
import { useIntro } from '../context/intro-context';

interface ArchitectureFlowProps {
  initialProjects: any[];
  playPacketSound: () => void;
}

const mockLogTemplates = [
  'IP [182.180.20.91] REQUEST GET /api/v1/projects - 200 OK (18ms)',
  'SQL QUERY: SELECT * FROM "projects" LIMIT 5 - 4ms',
  'DB STATUS: POOL CONNECTION ACQUIRED - 1 active',
  'IP [182.180.20.91] REQUEST GET /api/v1/about - 304 Not Modified (2ms)',
  'WORKER #1: RUNNING SCRAPER CRON TASK "github_stats" - ACTIVE',
  'WORKER #1: RESOLVED SCRAPER CRON TASK "github_stats" - SUCCESS',
  'IP [109.12.87.112] REQUEST POST /api/v1/contact/send - 201 Created (145ms)',
  'SQL QUERY: INSERT INTO "messages" (id, email) VALUES ($1, $2) - 8ms',
  'SYSTEM THREAD: CPU LOAD 12% - DISPATCH OK',
  'IP [45.89.2.14] REQUEST GET /api/v1/blog - 200 OK (31ms)',
  'SQL QUERY: SELECT * FROM "posts" ORDER BY created_at DESC - 11ms'
];

export default function ArchitectureFlow({ initialProjects, playPacketSound }: ArchitectureFlowProps) {
  const { currentScene, journeyMode, isSimulatingTraffic, setIsSimulatingTraffic } = useIntro();
  const [logs, setLogs] = useState<string[]>([
    '[SYSTEM] HOSTING: DIGITALOCEAN VPS ONLINE',
    '[SYSTEM] NODE ENGINE STATUS: IDLE',
    '[SYSTEM] STATE: SECURE DISPATCH DISPATCHED'
  ]);
  const [animatedPackets, setAnimatedPackets] = useState<{ id: number; path: string; speed: number }[]>([]);
  const logContainerRef = useRef<HTMLDivElement>(null);
  const packetIdRef = useRef(0);

  // Sync log scroll
  useEffect(() => {
    if (logContainerRef.current) {
      logContainerRef.current.scrollTop = logContainerRef.current.scrollHeight;
    }
  }, [logs]);

  // Traffic Simulation Loop
  useEffect(() => {
    if (currentScene !== 6) {
      setIsSimulatingTraffic(false);
      return;
    }

    if (!isSimulatingTraffic) return;

    const interval = setInterval(() => {
      // 1. Play packet sound
      playPacketSound();

      // 2. Generate random logs
      const randLog = mockLogTemplates[Math.floor(Math.random() * mockLogTemplates.length)];
      const timestamp = new Date().toLocaleTimeString();
      setLogs((prev) => [...prev.slice(-30), `[${timestamp}] ${randLog}`]);

      // 3. Trigger SVG packet flows
      const paths = ['path-left', 'path-right', 'path-db'];
      const chosenPath = paths[Math.floor(Math.random() * paths.length)];
      const id = packetIdRef.current++;
      setAnimatedPackets((prev) => [...prev, { id, path: chosenPath, speed: 0.8 + Math.random() * 0.7 }]);

      // Cleanup packet after animation
      setTimeout(() => {
        setAnimatedPackets((prev) => prev.filter((p) => p.id !== id));
      }, 1800);

    }, 380);
    return () => clearInterval(interval);
  }, [isSimulatingTraffic, currentScene]);

  // Filter projects dynamically based on user's journey mode
  const getFilteredProjects = () => {
    let filtered = initialProjects;
    if (journeyMode === 'mern') {
      filtered = initialProjects.filter(
        (p) =>
          p.type?.toLowerCase().includes('frontend') ||
          p.type?.toLowerCase().includes('react') ||
          p.stack?.some((s: string) => ['React', 'Next.js', 'Tailwind'].includes(s))
      );
    } else if (journeyMode === 'backend') {
      filtered = initialProjects.filter(
        (p) =>
          p.type?.toLowerCase().includes('backend') ||
          p.type?.toLowerCase().includes('api') ||
          p.stack?.some((s: string) => ['PostgreSQL', 'Express', 'Node.js', 'Prisma', 'MongoDB'].includes(s))
      );
    } else if (journeyMode === 'automation') {
      filtered = initialProjects.filter(
        (p) =>
          p.title?.toLowerCase().includes('bot') ||
          p.title?.toLowerCase().includes('scrap') ||
          p.description?.toLowerCase().includes('automation') ||
          p.description?.toLowerCase().includes('script')
      );
    }

    // Fallback to all projects if filter yields nothing
    if (!filtered || filtered.length === 0) {
      filtered = initialProjects;
    }

    return filtered.slice(0, 2);
  };

  const displayedProjects = getFilteredProjects();

  return (
    <div id="scene-projects" className="scene z-20">
      <style dangerouslySetInnerHTML={{
        __html: `
        @keyframes svg-flow {
          0% { stroke-dashoffset: 20; }
          100% { stroke-dashoffset: 0; }
        }
        .svg-flow-anim {
          stroke-dasharray: 6 6;
          animation: svg-flow 1.2s infinite linear;
        }
        .svg-flow-anim-fast {
          stroke-dasharray: 4 4;
          animation: svg-flow 0.4s infinite linear;
        }
      `}} />

      <div className="flex flex-col items-center justify-center w-full max-w-6xl text-center px-4 select-none">
        
        <div id="projects-header" className="mb-6">
          <span className="font-mono-code text-[#e49505] text-xs sm:text-sm mb-1 uppercase tracking-widest block">
            [ MODULE: ARCHITECTURE_&_PRODUCTS ]
          </span>
          <h2 className="font-synco text-2xl sm:text-4xl text-white uppercase tracking-tight">
            Featured Projects
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-center w-full pointer-events-auto">
          
          {/* Architecture diagram & Live Logger */}
          <div
            id="svg-diagram-wrapper"
            className="lg:col-span-3 border border-zinc-800 bg-[#020617]/95 rounded-2xl relative overflow-hidden flex flex-col justify-between shadow-2xl p-4 min-h-[350px]"
          >
            {/* Control Panel Header */}
            <div className="flex justify-between items-center border-b border-zinc-800/80 pb-3 mb-2 z-30">
              <div className="flex items-center gap-2">
                <Cpu size={16} className="text-[#e49505] animate-spin" style={{ animationDuration: isSimulatingTraffic ? '3s' : '10s' }} />
                <span className="font-mono-code text-[10px] text-zinc-400 font-bold uppercase tracking-wider">
                  Live System Gateway
                </span>
              </div>

              {/* Traffic Simulator Toggle Button */}
              <button
                onClick={() => setIsSimulatingTraffic(!isSimulatingTraffic)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border font-mono-code text-[9px] uppercase tracking-wider font-bold transition-all duration-300 ${
                  isSimulatingTraffic
                    ? 'bg-[#e49505] border-transparent text-black shadow-[0_0_15px_rgba(228,149,5,0.3)]'
                    : 'bg-[#0b101d] border-zinc-800 text-zinc-400 hover:border-zinc-700 hover:text-white'
                }`}
              >
                {isSimulatingTraffic ? (
                  <>
                    <Square size={10} className="fill-current" />
                    <span>Stop Traffic</span>
                  </>
                ) : (
                  <>
                    <Play size={10} className="fill-current animate-pulse" />
                    <span>Simulate Load</span>
                  </>
                )}
              </button>
            </div>

            {/* SVG Diagram Canvas */}
            <div className="relative flex-1 flex items-center justify-center min-h-[220px]">
              <svg className="w-full h-full max-h-[240px]" viewBox="0 0 800 360" fill="none" stroke="#e49505" strokeWidth="2">
                {/* Central Server Node */}
                <rect x="315" y="25" width="170" height="60" rx="6" className="architect-svg-path stroke-white" />
                <text x="400" y="50" fill="#fff" fontFamily="monospace" fontSize="11" textAnchor="middle" fontWeight="bold">API GATEWAY</text>
                <text x="400" y="66" fill="#e49505" fontFamily="monospace" fontSize="9.5" textAnchor="middle">EXPRESS / TS</text>

                {/* Database Node */}
                <path d="M325,250 C325,240 475,240 475,250 L475,295 C475,305 325,305 325,295 Z" className="architect-svg-path stroke-[#e49505]" />
                <path d="M325,250 C325,260 475,260 475,250" className="architect-svg-path stroke-[#e49505]" />
                <text x="400" y="285" fill="#fff" fontFamily="monospace" fontSize="11" textAnchor="middle" fontWeight="bold">POSTGRESQL</text>

                {/* Left Booker Client */}
                <rect x="110" y="135" width="150" height="70" rx="8" className="architect-svg-path stroke-[#e49505]" />
                <text x="185" y="166" fill="#fff" fontFamily="monospace" fontSize="11" textAnchor="middle" fontWeight="bold">REACT CLIENT</text>
                <text x="185" y="184" fill="#e49505" fontFamily="monospace" fontSize="9.5" textAnchor="middle">BOOKER APP</text>

                {/* Right Analytics Client */}
                <rect x="540" y="135" width="150" height="70" rx="8" className="architect-svg-path stroke-[#e49505]" />
                <text x="615" y="166" fill="#fff" fontFamily="monospace" fontSize="11" textAnchor="middle" fontWeight="bold">NEXT.JS DASH</text>
                <text x="615" y="184" fill="#e49505" fontFamily="monospace" fontSize="9.5" textAnchor="middle">ANALYTICS</text>

                {/* Paths (connection lines) */}
                <path
                  id="path-db"
                  d="M400,85 L400,250"
                  className={`architect-svg-path stroke-zinc-500 opacity-60 ${isSimulatingTraffic ? 'svg-flow-anim-fast' : 'svg-flow-anim'}`}
                />
                <path
                  id="path-left"
                  d="M260,170 L315,55"
                  className={`architect-svg-path stroke-zinc-500 opacity-60 ${isSimulatingTraffic ? 'svg-flow-anim-fast' : 'svg-flow-anim'}`}
                />
                <path
                  id="path-right"
                  d="M540,170 L485,55"
                  className={`architect-svg-path stroke-zinc-500 opacity-60 ${isSimulatingTraffic ? 'svg-flow-anim-fast' : 'svg-flow-anim'}`}
                />

                {/* Base Packet Nodes (when traffic simulator is off) */}
                {!isSimulatingTraffic && (
                  <>
                    <circle cx="400" cy="85" r="4" fill="#e49505" id="packet-node-db" opacity="0.6" className="animate-ping" style={{ animationDuration: '2.5s' }} />
                    <circle cx="260" cy="170" r="4" fill="#fff" id="packet-client-left" opacity="0.6" className="animate-ping" style={{ animationDuration: '3s' }} />
                  </>
                )}

                {/* Simulated Moving Packets */}
                {animatedPackets.map((packet) => {
                  let pathD = '';
                  let color = '#e49505';
                  if (packet.path === 'path-db') {
                    pathD = 'M400,85 L400,250';
                    color = '#f59e0b';
                  } else if (packet.path === 'path-left') {
                    pathD = 'M260,170 L315,55';
                    color = '#ffffff';
                  } else if (packet.path === 'path-right') {
                    pathD = 'M540,170 L485,55';
                    color = '#61DAFB';
                  }

                  return (
                    <circle key={packet.id} r="5" fill={color}>
                      <animateMotion path={pathD} dur={`${packet.speed}s`} repeatCount="1" />
                    </circle>
                  );
                })}
              </svg>
            </div>

            {/* Dynamic Console Logs */}
            <div
              ref={logContainerRef}
              className="w-full text-left font-mono-code text-[9px] text-zinc-500 leading-relaxed bg-[#020617]/70 p-3 rounded-lg border border-zinc-900/60 max-h-[85px] overflow-y-auto"
            >
              {logs.map((log, index) => (
                <div
                  key={index}
                  className={`border-l-2 pl-2 mb-1.5 ${
                    log.includes('SQL')
                      ? 'border-[#e49505]/40 text-zinc-400'
                      : log.includes('REQUEST')
                      ? 'border-emerald-500/40 text-emerald-400/90'
                      : 'border-zinc-800'
                  }`}
                >
                  {log}
                </div>
              ))}
            </div>
          </div>

          {/* Specialization Filtered Projects */}
          <div className="lg:col-span-2 flex flex-col gap-4 text-left">
            <div className="border-b border-zinc-900 pb-2 mb-1">
              <span className="font-mono-code text-[10px] text-zinc-500 uppercase tracking-widest">
                [ JOURNEY FOCUS: {journeyMode.toUpperCase()} ]
              </span>
            </div>
            
            {displayedProjects.map((proj, idx) => (
              <div
                key={proj.id}
                className="project-card-interactive bg-[#0b101d]/85 border border-zinc-800 rounded-xl p-5 shadow-lg backdrop-blur-md hover:border-[#e49505]/40 transition-colors duration-300 opacity-0 translate-y-8"
              >
                <span className="font-mono-code text-[9px] text-[#e49505] font-bold tracking-widest uppercase">
                  PROJ_0{idx + 1} &bull; {proj.type}
                </span>
                <h3 className="font-synco text-xs font-bold text-white tracking-wide mt-1 uppercase">
                  {proj.title}
                </h3>
                <p className="text-[11px] sm:text-xs text-zinc-400 leading-relaxed font-light mt-2 line-clamp-3">
                  {proj.description}
                </p>
                <div className="flex flex-wrap gap-1.5 mt-4">
                  {proj.stack?.slice(0, 3).map((st: string) => (
                    <span key={st} className="px-2 py-0.5 border border-zinc-800 rounded text-[9px] font-mono-code bg-black/40 text-zinc-300">
                      {st}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>

        </div>
      </div>
    </div>
  );
}
