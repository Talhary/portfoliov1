'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useIntro, JourneyMode } from '../context/intro-context';

interface TerminalConsoleProps {
  onComplete: () => void;
  playClickSound: () => void;
}

export default function TerminalConsole({ onComplete, playClickSound }: TerminalConsoleProps) {
  const { currentScene, setJourneyMode, setSynthTheme } = useIntro();
  const [terminalLogs, setTerminalLogs] = useState<string[]>([]);
  const [showPrompt, setShowPrompt] = useState(false);
  const [commandInput, setCommandInput] = useState('');
  const [commandResponse, setCommandResponse] = useState('');
  const [isDone, setIsDone] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Diagnostic lines typed at start
  const initialLogs = [
    `> INITIALIZING TALHACODES PORTFOLIO CLIENT [v3.0]`,
    `> ESTABLISHING SECURE SECSH SHELL CONNECTION... OK`,
    `> CONNECTION TO ISLAMABAD NODE SECURED [IP: 182.180.x.x]`,
    `> LOADING CORE SYSTEM CREDENTIALS FOR "TALHA"... OK`,
    `> SCANNING DATABASES & INVENTORIES... CONNECTED`,
    `> SYSTEMS READY.`
  ];

  // Auto-focus terminal input
  useEffect(() => {
    if (showPrompt && inputRef.current) {
      inputRef.current.focus();
    }
  }, [showPrompt]);

  // Handle active scene change to trigger scroll logging
  useEffect(() => {
    if (currentScene !== 1) return;

    let index = 0;
    const interval = setInterval(() => {
      if (index < initialLogs.length) {
        setTerminalLogs((prev) => [...prev, initialLogs[index]]);
        index++;
      } else {
        clearInterval(interval);
        setShowPrompt(true);
      }
    }, 450);

    return () => clearInterval(interval);
  }, [currentScene]);

  // Scroll to bottom of terminal
  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [terminalLogs, showPrompt, commandResponse]);

  const selectJourney = (mode: JourneyMode, modeName: string) => {
    if (isDone) return;
    playClickSound();
    setJourneyMode(mode);
    setIsDone(true);
    setShowPrompt(false);
    
    // Log choice
    setTerminalLogs((prev) => [
      ...prev,
      `> talhacodes@site:~$ select-mode --type=${mode}`,
      `> CONFIGURING PORTFOLIO TO PATH: [ ${modeName.toUpperCase()} ]`,
      `> ALLOCATING CORE INTERFACES... SUCCESS`,
      `> LOADING CINEMATIC GSAP WARP TRAJECTORY... ENGINE ARMED.`
    ]);

    setTimeout(() => {
      onComplete();
    }, 1200);
  };

  const handleCommandSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isDone) return;
    const cmd = commandInput.trim().toLowerCase();
    setCommandInput('');

    if (!cmd) return;

    playClickSound();
    setTerminalLogs((prev) => [...prev, `talhacodes@site:~$ ${commandInput}`]);

    if (cmd === '1' || cmd === 'mern' || cmd === 'react') {
      selectJourney('mern', 'MERN & React Web Apps');
    } else if (cmd === '2' || cmd === 'backend' || cmd === 'node') {
      selectJourney('backend', 'Backend & Databases');
    } else if (cmd === '3' || cmd === 'automation' || cmd === 'bots') {
      selectJourney('automation', 'Automation & Bots');
    } else if (cmd === '4' || cmd === 'all' || cmd === 'full') {
      selectJourney('all', 'Full Cinematic');
    } else if (cmd === 'help') {
      setTerminalLogs((prev) => [
        ...prev,
        'SYSTEM COMMAND LIST:',
        '  mern / 1       - Select MERN Frontend pathway',
        '  backend / 2    - Select Backend & Databases pathway',
        '  automation / 3 - Select Automation & Bots pathway',
        '  all / 4        - Full standard journey',
        '  retro          - Switch synthesizer to 8-bit retro theme',
        '  cyberpunk      - Switch synthesizer to cyberpunk theme',
        '  ambient        - Switch synthesizer to ambient theme',
        '  clear          - Clear terminal log buffer'
      ]);
    } else if (cmd === 'retro') {
      setSynthTheme('retro');
      setTerminalLogs((prev) => [...prev, '> SYNTH PARAMETERS ADJUSTED TO: RETRO 8-BIT']);
    } else if (cmd === 'cyberpunk') {
      setSynthTheme('cyberpunk');
      setTerminalLogs((prev) => [...prev, '> SYNTH PARAMETERS ADJUSTED TO: CYBERPUNK SAW']);
    } else if (cmd === 'ambient') {
      setSynthTheme('ambient');
      setTerminalLogs((prev) => [...prev, '> SYNTH PARAMETERS ADJUSTED TO: AMBIENT TRIANGLE']);
    } else if (cmd === 'clear') {
      setTerminalLogs([]);
    } else {
      setTerminalLogs((prev) => [
        ...prev,
        `command not found: "${cmd}". Type "help" for options.`
      ]);
    }
  };
  // Render container always for GSAP animation selectors to find it
  return (
    <div
      id="scene-boot"
      className="scene flex items-end justify-start p-6 sm:p-12 w-full h-full text-left z-30"
      onClick={() => inputRef.current?.focus()}
    >
      <div
        ref={containerRef}
        className="font-mono-code text-[#e49505] text-xs sm:text-sm leading-relaxed whitespace-pre-wrap max-w-xl md:max-w-2xl bg-black/75 p-6 rounded-xl border border-zinc-800/80 backdrop-blur-md w-full max-h-[75vh] overflow-y-auto shadow-[0_0_30px_rgba(0,0,0,0.5)] flex flex-col justify-between"
      >
        <div className="drop-shadow-[0_0_3px_rgba(228,149,5,0.4)] flex-1">
          {terminalLogs.map((log, index) => (
            <div key={index} className="mb-1">{log}</div>
          ))}

          {showPrompt && (
            <div className="mt-4 border-t border-zinc-800/60 pt-4 animate-fade-in">
              <div className="text-zinc-400 font-bold mb-3 text-[11px] sm:text-xs tracking-wider">
                [?] CHOOSE A SPECIALIZATION FOCUS TO BEGIN:
              </div>
              <div className="flex flex-col gap-2.5 mb-5 font-mono-code">
                <button
                  onClick={() => selectJourney('mern', 'MERN & React Web Apps')}
                  className="w-full text-left px-3 py-2 border border-zinc-800 hover:border-[#e49505]/40 bg-zinc-950/60 hover:bg-[#e49505]/10 rounded-lg text-white hover:text-[#e49505] transition-all duration-200 flex items-center justify-between"
                >
                  <span>[1] MERN Stack & React Web Apps</span>
                  <span className="text-[10px] text-zinc-500 font-normal">Command: mern</span>
                </button>
                <button
                  onClick={() => selectJourney('backend', 'Backend & Databases')}
                  className="w-full text-left px-3 py-2 border border-zinc-800 hover:border-[#e49505]/40 bg-zinc-950/60 hover:bg-[#e49505]/10 rounded-lg text-white hover:text-[#e49505] transition-all duration-200 flex items-center justify-between"
                >
                  <span>[2] Node.js, Databases & PostgreSQL</span>
                  <span className="text-[10px] text-zinc-500 font-normal">Command: backend</span>
                </button>
                <button
                  onClick={() => selectJourney('automation', 'Automation & Bots')}
                  className="w-full text-left px-3 py-2 border border-zinc-800 hover:border-[#e49505]/40 bg-zinc-950/60 hover:bg-[#e49505]/10 rounded-lg text-white hover:text-[#e49505] transition-all duration-200 flex items-center justify-between"
                >
                  <span>[3] Automation Scripts, Scrapers & Bots</span>
                  <span className="text-[10px] text-zinc-500 font-normal">Command: automation</span>
                </button>
                <button
                  onClick={() => selectJourney('all', 'Full Cinematic')}
                  className="w-full text-left px-3 py-2 border border-zinc-800 hover:border-[#e49505]/40 bg-zinc-950/60 hover:bg-[#e49505]/10 rounded-lg text-white hover:text-[#e49505] transition-all duration-200 flex items-center justify-between"
                >
                  <span>[4] Full Cinematic Journey (Standard)</span>
                  <span className="text-[10px] text-zinc-500 font-normal">Command: all</span>
                </button>
              </div>

              {/* Command input prompt */}
              <form onSubmit={handleCommandSubmit} className="flex items-center gap-2 border-t border-zinc-900 pt-3">
                <span className="text-zinc-500">talhacodes@site:~$</span>
                <input
                  ref={inputRef}
                  type="text"
                  value={commandInput}
                  onChange={(e) => setCommandInput(e.target.value)}
                  placeholder="Type command or help..."
                  className="flex-1 bg-transparent border-none outline-none text-white font-mono-code focus:ring-0 p-0 text-xs sm:text-sm"
                  disabled={isDone}
                />
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
