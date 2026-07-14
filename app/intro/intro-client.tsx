'use client';

import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { TextPlugin } from 'gsap/TextPlugin';
import { useIntro, IntroProvider } from './context/intro-context';
import { useAudioEngine } from './hooks/use-audio-engine';

// Component Imports
import ThreeSceneBackground from './components/three-scene-background';
import AudioControls from './components/audio-controls';
import StartScreen from './components/start-screen';
import TerminalConsole from './components/terminal-console';
import IdentityReveal from './components/identity-reveal';
import TechMatrix from './components/tech-matrix';
import FocusAreas from './components/focus-areas';
import ProfessionalJourney from './components/professional-journey';
import ArchitectureFlow from './components/architecture-flow';
import FinalResolution from './components/final-resolution';

// Register GSAP TextPlugin
if (typeof window !== 'undefined') {
  gsap.registerPlugin(TextPlugin);
}

interface IntroClientProps {
  initialProjects: any[];
}

export default function IntroClient({ initialProjects }: IntroClientProps) {
  return (
    <IntroProvider>
      <IntroClientInner initialProjects={initialProjects} />
    </IntroProvider>
  );
}

function IntroClientInner({ initialProjects }: IntroClientProps) {
  const {
    started,
    setStarted,
    audioInitializing,
    currentScene,
    setCurrentScene,
    speedScale,
    skipSequence,
    registerSkipCallback
  } = useIntro();

  const { initAudio, playSound } = useAudioEngine();
  const timelineRef = useRef<gsap.core.Timeline | null>(null);

  // Skip logic definition
  const handleSkip = () => {
    playSound.stopBoot();
    // Stop GSAP timelines
    if (timelineRef.current) {
      timelineRef.current.kill();
    }
    gsap.killTweensOf('*');
    playSound.finalResolve();
    setStarted(true);
    setCurrentScene(7);

    // Speed particles tunnel down to a slow crawl
    speedScale.current.targetSpeed = 0.1;
    speedScale.current.rotationSpeed = 0.001;

    // Reset layout scenes
    gsap.set('.scene', { autoAlpha: 0, scale: 0.95 });
    gsap.set('#scene-final', { autoAlpha: 1, scale: 1 });
  };

  // Register skip function to context for accessibility
  useEffect(() => {
    registerSkipCallback(handleSkip);
  }, []);

  // Orchestrated sequence runner
  const startSequence = async () => {
    if (audioInitializing) return;
    await initAudio();
    setStarted(true);

    const masterTl = gsap.timeline();
    timelineRef.current = masterTl;

    // Reset scenes
    gsap.set('.scene', { autoAlpha: 0, scale: 0.95 });

    // --- PHASE 1: Terminal Boot & Interactive Pathway Selection ---
    masterTl.set('#scene-boot', { autoAlpha: 1, scale: 1 })
      .call(() => {
        setCurrentScene(1);
        speedScale.current.targetSpeed = 1.5;
        playSound.startBoot();
      })
      // Pause timeline here to wait for user terminal input
      .addPause()

      // --- PHASE 2: Identity Reveal ---
      .call(() => {
        setCurrentScene(2);
        playSound.warpDrive();
        speedScale.current.targetSpeed = 38; // Cinematic warp speed
        speedScale.current.rotationSpeed = 0.015;
      })
      .set('#scene-identity', { autoAlpha: 1, scale: 0.9 })
      .to('#scene-identity', { scale: 1, duration: 1.2, ease: 'power2.out' }, '<')
      .call(() => {
        playSound.slamName();
        const mainName = document.getElementById('main-name');
        if (mainName) mainName.classList.add('glitch-anim');
      }, undefined, '+=0.3')
      .fromTo('#main-name',
        { scale: 22, opacity: 0, z: -800 },
        { scale: 1, opacity: 1, z: 0, duration: 1.3, ease: 'expo.out' }
      )
      .fromTo('#role-mask-wrapper',
        { clipPath: 'inset(0 100% 0 0)' },
        { clipPath: 'inset(0 0% 0 0)', duration: 0.9, ease: 'power3.inOut' },
        '-=0.5'
      )
      .call(() => playSound.glitchRole(), undefined, '-=0.8')
      .to('#role-glitch-layer', { scaleX: 1, duration: 0.1, yoyo: true, repeat: 3 }, '-=0.9')
      // Decelerate particles speed
      .to({}, {
        duration: 1.5,
        onStart: () => {
          speedScale.current.targetSpeed = 1.0;
          speedScale.current.rotationSpeed = 0.002;
        }
      })
      .call(() => {
        const mainName = document.getElementById('main-name');
        if (mainName) mainName.classList.remove('glitch-anim');
      })
      .to('#scene-identity', {
        autoAlpha: 0,
        scale: 1.15,
        filter: 'blur(15px)',
        duration: 0.7,
        ease: 'power2.in'
      }, '+=0.8')

      // --- PHASE 3: The Tech Matrix (Orbiting skills) ---
      .call(() => {
        setCurrentScene(3);
        playSound.techRings();
      })
      .set('#scene-tech', { autoAlpha: 1, scale: 0.95 })
      .fromTo('#tech-matrix-header',
        { y: -30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, ease: 'back.out(1.5)' }
      )
      .fromTo('.tech-ring-mesh',
        { rotationX: 90, opacity: 0 },
        { rotationX: 58, opacity: 1, duration: 1.4, stagger: 0.15, ease: 'power2.out' },
        '-=0.4'
      )
      .add('shoot-nodes')
      .to('.orbit-tech-node', {
        duration: 1.1,
        opacity: 1,
        stagger: {
          each: 0.09,
          onStart: function () {
            // Trigger plucky sound on node mount
            playSound.techNode(Math.floor(Math.random() * 8));
          }
        },
        ease: 'elastic.out(1, 0.6)',
        x: (i) => Math.cos((i / 8) * Math.PI * 2) * 220,
        y: (i) => Math.sin((i / 8) * Math.PI * 2) * 220,
        scale: 1,
        rotationZ: -45
      }, 'shoot-nodes')
      .to('#tech-container-orbit', {
        rotationZ: 120,
        duration: 4.5,
        ease: 'none'
      }, 'shoot-nodes')
      .fromTo('#tech-subtext', { opacity: 0, y: 15 }, { opacity: 1, y: 0, duration: 0.6 }, '-=2')
      .to('#scene-tech', {
        autoAlpha: 0,
        scale: 0.9,
        duration: 0.7,
        ease: 'power2.in'
      }, '+=1.2')

      // --- PHASE 4: Focus Areas ---
      .call(() => {
        setCurrentScene(4);
        playSound.techRings();
      })
      .set('#scene-focus', { autoAlpha: 1, scale: 0.95 })
      .fromTo('#focus-header', { y: -25, opacity: 0 }, { y: 0, opacity: 1, duration: 0.7 })
      .fromTo('.focus-card-anim',
        { opacity: 0, y: 40, scale: 0.9 },
        { opacity: 1, y: 0, scale: 1, duration: 0.9, stagger: 0.2, ease: 'power3.out' },
        '-=0.4'
      )
      .to('#scene-focus', {
        autoAlpha: 0,
        y: -30,
        duration: 0.7,
        ease: 'power2.in'
      }, '+=2.2')

      // --- PHASE 5: Professional Journey ---
      .call(() => {
        setCurrentScene(5);
        playSound.techRings();
      })
      .set('#scene-journey', { autoAlpha: 1, scale: 0.95 })
      .fromTo('#journey-header', { opacity: 0, y: -25 }, { opacity: 1, y: 0, duration: 0.7 })
      .fromTo('.journey-timeline-card',
        { opacity: 0, x: (i) => (i % 2 === 0 ? -60 : 60) },
        { opacity: 1, x: 0, duration: 1.0, stagger: 0.3, ease: 'power2.out' },
        '-=0.4'
      )
      .to('#scene-journey', {
        autoAlpha: 0,
        scale: 1.05,
        duration: 0.7,
        ease: 'power2.in'
      }, '+=2.5')

      // --- PHASE 6: Flagship Architecture / Dynamic Projects ---
      .call(() => {
        setCurrentScene(6);
        playSound.erpDraw();
      })
      .set('#scene-projects', { autoAlpha: 1 })
      .fromTo('#projects-header', { opacity: 0, y: -20 }, { opacity: 1, y: 0, duration: 0.7 })
      .fromTo('#svg-diagram-wrapper', { opacity: 0, scale: 0.95 }, { opacity: 1, scale: 1, duration: 0.8 }, '<')
      .to('.architect-svg-path', {
        strokeDashoffset: 0,
        duration: 2.2,
        ease: 'power2.inOut',
        stagger: 0.12
      }, '-=0.4')
      .fromTo('.project-card-interactive',
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.8, stagger: 0.15 },
        '-=1.0'
      )
      .to('#scene-projects', {
        autoAlpha: 0,
        y: -30,
        duration: 0.7,
        ease: 'power2.in'
      }, '+=3.5')

      // --- PHASE 7: Academics, Contacts & Resolution ---
      .call(() => {
        setCurrentScene(7);
        playSound.finalResolve();
        speedScale.current.targetSpeed = 0.05;
      })
      .set('#scene-final', { autoAlpha: 1, scale: 0.9 })
      .to('#scene-final', { scale: 1, duration: 1.0, ease: 'power2.out' })
      .fromTo('#final-logo-glowing',
        { scale: 0, rotation: -270 },
        { scale: 1, rotation: 0, duration: 0.9, ease: 'back.out(1.8)' }
      )
      .fromTo('#final-title-text',
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.8, ease: 'power2.out' },
        '-=0.4'
      )
      .fromTo('.final-info-item',
        { opacity: 0, y: 15 },
        { opacity: 1, y: 0, duration: 0.6, stagger: 0.15 },
        '-=0.2'
      )
      .fromTo('#final-exit-btn',
        { opacity: 0, scale: 0.85 },
        { opacity: 1, scale: 1, duration: 0.5, ease: 'back.out(1.5)' }
      );
  };

  const resumeGSAPTimeline = () => {
    if (timelineRef.current) {
      timelineRef.current.play();
    }
  };

  return (
    <div className="relative w-full h-full font-sans select-none overflow-hidden bg-[#020617] text-white">
      {/* CRT Scanline grid */}
      <div className="fixed inset-0 w-full h-full pointer-events-none z-40 opacity-[0.16] bg-[linear-gradient(to_bottom,rgba(255,255,255,0),rgba(255,255,255,0)_50%,rgba(0,0,0,0.45)_50%,rgba(0,0,0,0.45))] bg-[length:100%_4px]" />

      {/* Sci-fi fonts */}
      <style dangerouslySetInnerHTML={{
        __html: `
        @import url('https://fonts.googleapis.com/css2?family=Fira+Code:wght@400;600;700&family=Syncopate:wght@700&family=Inter:wght@300;400;600;800;900&display=swap');
        .font-mono-code { font-family: 'Fira Code', monospace; }
        .font-synco { font-family: 'Syncopate', sans-serif; }
        
        .scene {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          opacity: 0;
          visibility: hidden;
          box-sizing: border-box;
          z-index: 20;
          overflow: hidden;
        }
        
        .glitch-text-amber {
          position: relative;
          color: white;
        }
        .glitch-text-amber::before, .glitch-text-amber::after {
          content: attr(data-text);
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          opacity: 0.8;
        }
        .glitch-text-amber::before {
          color: #e49505;
          z-index: -1;
          transform: translate(-3px, 1.5px);
        }
        .glitch-text-amber::after {
          color: #ff5e00;
          z-index: -2;
          transform: translate(3px, -1.5px);
        }
        
        .glitch-anim::before { animation: glitch-anim-1 1.5s infinite linear alternate-reverse; }
        .glitch-anim::after { animation: glitch-anim-2 2.2s infinite linear alternate-reverse; }

        @keyframes glitch-anim-1 {
          0% { clip-path: inset(15% 0 70% 0); transform: translate(-3px, 1.5px); }
          20% { clip-path: inset(50% 0 15% 0); transform: translate(3px, -1.5px); }
          40% { clip-path: inset(30% 0 45% 0); transform: translate(-3px, 1.5px); }
          60% { clip-path: inset(75% 0 8% 0); transform: translate(3px, -1.5px); }
          80% { clip-path: inset(5% 0 80% 0); transform: translate(-3px, 1.5px); }
          100% { clip-path: inset(25% 0 45% 0); transform: translate(3px, -1.5px); }
        }
        @keyframes glitch-anim-2 {
          0% { clip-path: inset(8% 0 55% 0); transform: translate(3px, -1.5px); }
          25% { clip-path: inset(25% 0 25% 0); transform: translate(-3px, 1.5px); }
          50% { clip-path: inset(65% 0 5% 0); transform: translate(3px, -1.5px); }
          75% { clip-path: inset(15% 0 60% 0); transform: translate(-3px, 1.5px); }
          100% { clip-path: inset(4% 0 75% 0); transform: translate(3px, -1.5px); }
        }
      `}} />

      {/* Audio controls (Mute / Unmute / Presets) */}
      {started && <AudioControls />}

      {/* Three.js interactive particle background */}
      <ThreeSceneBackground />

      {/* Start screen initialization overlay */}
      <StartScreen onStart={startSequence} onSkip={handleSkip} />

      {/* Main Overlay Scene Manager Layer */}
      <div className="absolute inset-0 w-full h-full z-20 flex justify-center items-center p-6 sm:p-12 md:p-16 pointer-events-none [&>*]:pointer-events-auto">
        
        {/* Skip button visible during scenes */}
        {currentScene > 0 && currentScene < 7 && (
          <button
            onClick={handleSkip}
            className="absolute bottom-6 right-6 z-50 px-4 py-2 border border-[#e49505]/20 bg-[#020617]/70 text-xs font-mono-code tracking-wider text-[#e49505] rounded-lg backdrop-blur-md hover:bg-[#e49505] hover:text-black hover:border-transparent transition-all duration-300 pointer-events-auto"
          >
            [ SKIP INTRO &gt;&gt; ]
          </button>
        )}

        {/* Scene 1: Interactive Terminal Console */}
        <TerminalConsole onComplete={resumeGSAPTimeline} playClickSound={playSound.clickBeep} />

        {/* Scene 2: Identity Reveal Splash */}
        <IdentityReveal />

        {/* Scene 3: Tech Matrix Orbits */}
        <TechMatrix playNodeSound={playSound.techNode} />

        {/* Scene 4: Specialization Focus */}
        <FocusAreas />

        {/* Scene 5: Career Professional Journey */}
        <ProfessionalJourney playHoverSound={playSound.clickBeep} />

        {/* Scene 6: Architectural flow SVG and filtered projects */}
        <ArchitectureFlow initialProjects={initialProjects} playPacketSound={playSound.dataPacket} />

        {/* Scene 7: Academic Contact Resolution */}
        <FinalResolution playClickSound={playSound.clickBeep} />

      </div>
    </div>
  );
}
