'use client';

import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import gsap from 'gsap';
import { TextPlugin } from 'gsap/TextPlugin';
import * as Tone from 'tone';
import Link from 'next/link';

// Icons
import { FaReact, FaNodeJs, FaDocker, FaPhp, FaRobot, FaArrowRight } from 'react-icons/fa';
import { SiNextdotjs, SiExpress, SiMongodb, SiTypescript, SiJavascript, SiUbuntu, SiPostgresql, SiMysql, SiDeno } from 'react-icons/si';
import { Briefcase, Phone, Mail, MapPin, Globe, BookOpen, Terminal, CheckCircle2 } from 'lucide-react';

// Register GSAP TextPlugin
if (typeof window !== 'undefined') {
  gsap.registerPlugin(TextPlugin);
}

// Custom brand color system mapping (primary is e49505)
const BRAND_PRIMARY = '#e49505';
const BRAND_SECONDARY = '#ffffff';
const BRAND_BG = '#020617';

interface IntroClientProps {
  initialProjects: any[];
}

export default function IntroClient({ initialProjects }: IntroClientProps) {
  const [mounted, setMounted] = useState(false);
  const [started, setStarted] = useState(false);
  const [audioInitializing, setAudioInitializing] = useState(false);
  const [currentScene, setCurrentScene] = useState(0);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Refs for elements and systems
  const webglRef = useRef<HTMLDivElement>(null);
  const startBtnRef = useRef<HTMLButtonElement>(null);

  // Sound refs
  const bassSynthRef = useRef<Tone.MembraneSynth | null>(null);
  const blipSynthRef = useRef<Tone.FMSynth | null>(null);
  const noiseSynthRef = useRef<Tone.NoiseSynth | null>(null);
  const polySynthRef = useRef<Tone.PolySynth | null>(null);
  const pluckSynthRef = useRef<Tone.PluckSynth | null>(null);
  const loopRef = useRef<Tone.Loop | null>(null);

  // Three.js animation speed controls
  const speedRef = useRef({ targetSpeed: 0.5, currentSpeed: 0.5, rotationSpeed: 0.001 });

  // Skill definitions mapped to React Icons and thematic color strings
  const skillsData = [
    { name: 'Next.js', Icon: SiNextdotjs, color: '#ffffff' },
    { name: 'React', Icon: FaReact, color: '#61DAFB' },
    { name: 'Node.js', Icon: FaNodeJs, color: '#339933' },
    { name: 'TypeScript', Icon: SiTypescript, color: '#3178C6' },
    { name: 'PostgreSQL', Icon: SiPostgresql, color: '#336791' },
    { name: 'Express', Icon: SiExpress, color: '#e49505' },
    { name: 'MongoDB', Icon: SiMongodb, color: '#47A248' },
    { name: 'Docker', Icon: FaDocker, color: '#2496ED' },
  ];

  // Focus Areas from main page
  const focusAreas = [
    { title: 'MERN Stack Development', Icon: FaReact, text: 'Architecting end-to-end applications from database models to reactive user interfaces.' },
    { title: 'Next.js Applications', Icon: SiNextdotjs, text: 'Developing highly optimized web portals with advanced rendering modes and API routes.' },
    { title: 'Bot Development', Icon: FaRobot, text: 'Writing custom scripts, scrapers, and automation bots to eliminate repetitive tasks.' },
  ];

  // Professional experiences
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
    },
  ];

  // Education list
  const education = [
    { title: 'Quaid-e-Azam University', duration: '2020 — 2024', field: 'BS Mathematics' },
    { title: 'Fsc Pre-Engineering', duration: '2018 — 2020', field: 'Pre-Engineering Sciences' }
  ];

  // Audio Engine Initialization
  const initAudio = async () => {
    setAudioInitializing(true);
    try {
      await Tone.start();
      Tone.Destination.volume.value = -8; // Comfortable volume limit

      // 1. Deep Bass for impacts
      bassSynthRef.current = new Tone.MembraneSynth({
        pitchDecay: 0.05,
        octaves: 5,
        oscillator: { type: "square" },
        envelope: { attack: 0.01, decay: 0.4, sustain: 0.01, release: 1.4 }
      }).toDestination();

      // 2. Cyber blips
      blipSynthRef.current = new Tone.FMSynth({
        harmonicity: 3,
        modulationIndex: 10,
        oscillator: { type: "sine" },
        envelope: { attack: 0.01, decay: 0.05, sustain: 0, release: 0.1 }
      }).toDestination();

      // 3. Glitch bursts
      noiseSynthRef.current = new Tone.NoiseSynth({
        noise: { type: 'pink' },
        envelope: { attack: 0.001, decay: 0.15, sustain: 0 }
      }).toDestination();

      // 4. Ethereal chords
      polySynthRef.current = new Tone.PolySynth(Tone.Synth, {
        oscillator: { type: "triangle" },
        envelope: { attack: 0.6, decay: 0.8, sustain: 0.6, release: 1.8 }
      }).toDestination();

      // 5. Orbit node pluck
      pluckSynthRef.current = new Tone.PluckSynth({
        attackNoise: 0.8,
        dampening: 3500,
        resonance: 0.85
      }).toDestination();

    } catch (err) {
      console.warn("Audio initialization failed:", err);
    }
    setAudioInitializing(false);
  };

  // Sound triggers synchronized with GSAP timeline
  const playSound = {
    startBoot: () => {
      if (!blipSynthRef.current) return;
      loopRef.current = new Tone.Loop(time => {
        blipSynthRef.current?.triggerAttackRelease("D6", "32n", time, 0.08);
      }, "16n").start(0);
      Tone.Transport.start();
    },
    stopBoot: () => {
      if (loopRef.current) {
        loopRef.current.stop();
        loopRef.current = null;
      }
    },
    warpDrive: () => {
      bassSynthRef.current?.triggerAttackRelease("D1", "2n", "+0.05");
      noiseSynthRef.current?.triggerAttackRelease("2n", "+0.05");
      polySynthRef.current?.triggerAttackRelease(["D3", "A3", "D4"], "3n", "+0.05");
    },
    slamName: () => {
      bassSynthRef.current?.triggerAttackRelease("D0", "8n", "+0.05");
      if (noiseSynthRef.current) {
        noiseSynthRef.current.envelope.decay = 0.45;
        noiseSynthRef.current.triggerAttackRelease("4n", "+0.05");
      }
    },
    glitchRole: () => {
      blipSynthRef.current?.triggerAttackRelease("D7", "32n", "+0.05");
      setTimeout(() => blipSynthRef.current?.triggerAttackRelease("F#7", "32n", "+0.05"), 60);
      setTimeout(() => blipSynthRef.current?.triggerAttackRelease("A7", "32n", "+0.05"), 120);
    },
    techRings: () => {
      polySynthRef.current?.triggerAttackRelease(["E4", "B4", "F#5"], "2n", "+0.05");
    },
    techNode: (i: number) => {
      const scale = ["D4", "E4", "F#4", "A4", "B4", "D5"];
      pluckSynthRef.current?.triggerAttackRelease(scale[i % scale.length], "8n", "+0.05");
    },
    erpDraw: () => {
      polySynthRef.current?.triggerAttackRelease(["G3", "D4", "A4"], "2n", "+0.05");
    },
    dataPacket: () => {
      blipSynthRef.current?.triggerAttackRelease("B5", "16n", "+0.05");
    },
    finalResolve: () => {
      polySynthRef.current?.triggerAttackRelease(["D4", "F#4", "A4", "C#5", "E5"], "1.5m", "+0.05");
      bassSynthRef.current?.triggerAttackRelease("D2", "2n", "+0.05");
    }
  };

  useEffect(() => {
    // --- THREE.JS SCENE SETUP ---
    if (!webglRef.current) return;
    const container = webglRef.current;

    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x020617, 0.00085);

    const camera = new THREE.PerspectiveCamera(70, container.clientWidth / container.clientHeight, 0.1, 2000);
    camera.position.z = 1000;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    // --- PARTICLE SYSTEM ---
    const particleCount = 5000;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);
    const sizes = new Float32Array(particleCount);

    const goldColor = new THREE.Color(BRAND_PRIMARY); // Primary brand gold
    const darkColor = new THREE.Color(0x353537);       // Subtle gray/charcoal

    for (let i = 0; i < particleCount * 3; i += 3) {
      // Tube tunnel distribution
      const radius = 150 + Math.random() * 1400;
      const theta = Math.random() * 2 * Math.PI;
      const z = (Math.random() - 0.5) * 3200;

      positions[i] = radius * Math.cos(theta);
      positions[i + 1] = radius * Math.sin(theta);
      positions[i + 2] = z;

      // Color interpolation: gold to slate gray
      const t = Math.random();
      const mixed = goldColor.clone().lerp(darkColor, t);
      colors[i] = mixed.r;
      colors[i + 1] = mixed.g;
      colors[i + 2] = mixed.b;

      sizes[i / 3] = 1 + Math.random() * 2.5;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));

    const material = new THREE.PointsMaterial({
      size: 2.2,
      vertexColors: true,
      blending: THREE.AdditiveBlending,
      transparent: true,
      opacity: 0.75,
      sizeAttenuation: true
    });

    const particles = new THREE.Points(geometry, material);
    scene.add(particles);

    // Animation Loop
    let animId: number;
    const animate3D = () => {
      animId = requestAnimationFrame(animate3D);

      // Interpolate speed based on GSAP timeline actions
      speedRef.current.currentSpeed += (speedRef.current.targetSpeed - speedRef.current.currentSpeed) * 0.055;
      camera.position.z -= speedRef.current.currentSpeed;
      particles.rotation.z += speedRef.current.rotationSpeed;

      // Reset camera to form endless tunnel
      if (camera.position.z < -1000) {
        camera.position.z = 1000;
      }

      renderer.render(scene, camera);
    };
    animate3D();

    // Handle viewport resize
    const handleResize = () => {
      if (!container) return;
      camera.aspect = container.clientWidth / container.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(container.clientWidth, container.clientHeight);
    };
    window.addEventListener('resize', handleResize);

    // Cleanup resources on unmount
    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);

      // Cleanup WebGL buffers
      geometry.dispose();
      material.dispose();
      renderer.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  // MASTER TIMELINE RUNNER
  const startSequence = async () => {
    if (audioInitializing) return;
    await initAudio();
    setStarted(true);

    const masterTl = gsap.timeline();

    // Hide start button overlay
    gsap.set('.scene', { autoAlpha: 0, scale: 0.95 });

    // Custom personalized boot sequence log text
    const bootLines = [
      `> INITIALIZING TALHACODES PORTFOLIO CLIENT [v3.0]`,
      `> ESTABLISHING SECURE PROTOCOLS...`,
      `> CONNECTION TO ISLAMABAD NODE SECURED [IP: 182.180.x.x]`,
      `> FETCHING EXPERIENCES FROM WOLTRIO SYSTEMS... OK`,
      `> LOADING SYSTEM ARCHITECT CREDENTIALS FOR: TALHA`,
      `> MOUNTING DATABASES FOR PROJECTS & INVENTORIES...`,
      `> SYSTEMS ONLINE. INITIATING 3D CINEMATIC INTRO...`
    ].join('\n');

    // --- PHASE 1: Terminal Boot ---
    masterTl.set('#scene-boot', { autoAlpha: 1, scale: 1 })
      .call(() => {
        setCurrentScene(1);
        speedRef.current.targetSpeed = 1.5;
        playSound.startBoot();
      })
      .to('#terminal-console', {
        duration: 3,
        text: bootLines,
        ease: "none"
      })
      .call(() => playSound.stopBoot())
      .to('#scene-boot', {
        autoAlpha: 0,
        y: -40,
        filter: 'blur(10px)',
        duration: 0.4,
        ease: "power2.in",
        delay: 0.5
      })

      // --- PHASE 2: Identity Reveal ---
      .call(() => {
        setCurrentScene(2);
        playSound.warpDrive();
        speedRef.current.targetSpeed = 38; // Extreme speed tunnel warp
        speedRef.current.rotationSpeed = 0.015;
      })
      .set('#scene-identity', { autoAlpha: 1, scale: 0.9 })
      .to('#scene-identity', { scale: 1, duration: 1.2, ease: "power2.out" }, "<")
      .call(() => {
        playSound.slamName();
        const mainName = document.getElementById('main-name');
        if (mainName) mainName.classList.add('glitch-anim');
      }, undefined, "+=0.3")
      .fromTo('#main-name',
        { scale: 22, opacity: 0, z: -800 },
        { scale: 1, opacity: 1, z: 0, duration: 1.3, ease: "expo.out" }
      )
      .fromTo('#role-mask',
        { clipPath: 'inset(0 100% 0 0)' },
        { clipPath: 'inset(0 0% 0 0)', duration: 0.9, ease: "power3.inOut" },
        "-=0.5"
      )
      .call(() => playSound.glitchRole(), undefined, "-=0.8")
      .to('#role-glitch-layer', { scaleX: 1, duration: 0.1, yoyo: true, repeat: 3 }, "-=0.9")
      // Decelerate warp speed
      .to({}, {
        duration: 1.5,
        onStart: () => {
          speedRef.current.targetSpeed = 1.0;
          speedRef.current.rotationSpeed = 0.002;
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
        ease: "power2.in"
      }, "+=0.8")

      // --- PHASE 3: The Tech Matrix (Orbiting skills) ---
      .call(() => {
        setCurrentScene(3);
        playSound.techRings();
      })
      .set('#scene-tech', { autoAlpha: 1, scale: 0.95 })
      .fromTo('#tech-matrix-header',
        { y: -30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, ease: "back.out(1.5)" }
      )
      .fromTo('.tech-ring-mesh',
        { rotationX: 90, opacity: 0 },
        { rotationX: 58, opacity: 1, duration: 1.4, stagger: 0.15, ease: "power2.out" },
        "-=0.4"
      )
      .add('shoot-nodes')
      .to('.orbit-tech-node', {
        duration: 1.1,
        opacity: 1,
        stagger: {
          each: 0.09,
          onStart: function () {
            playSound.techNode(Math.floor(Math.random() * 8));
          }
        },
        ease: "elastic.out(1, 0.6)",
        x: (i) => Math.cos((i / 8) * Math.PI * 2) * 220,
        y: (i) => Math.sin((i / 8) * Math.PI * 2) * 220,
        scale: 1,
        rotationZ: -45
      }, 'shoot-nodes')
      .to('#tech-container-orbit', {
        rotationZ: 120,
        duration: 4.5,
        ease: "none"
      }, 'shoot-nodes')
      .fromTo('#tech-subtext', { opacity: 0, y: 15 }, { opacity: 1, y: 0, duration: 0.6 }, "-=2")
      .to('#scene-tech', {
        autoAlpha: 0,
        scale: 0.9,
        duration: 0.7,
        ease: "power2.in"
      }, "+=1.2")

      // --- PHASE 4: Focus Areas ---
      .call(() => {
        setCurrentScene(4);
        playSound.techRings();
      })
      .set('#scene-focus', { autoAlpha: 1, scale: 0.95 })
      .fromTo('#focus-header', { y: -25, opacity: 0 }, { y: 0, opacity: 1, duration: 0.7 })
      .fromTo('.focus-card-anim',
        { opacity: 0, y: 40, scale: 0.9 },
        { opacity: 1, y: 0, scale: 1, duration: 0.9, stagger: 0.2, ease: "power3.out" },
        "-=0.4"
      )
      .to('#scene-focus', {
        autoAlpha: 0,
        y: -30,
        duration: 0.7,
        ease: "power2.in"
      }, "+=2.2")

      // --- PHASE 5: Professional Journey ---
      .call(() => {
        setCurrentScene(5);
        playSound.techRings();
      })
      .set('#scene-journey', { autoAlpha: 1, scale: 0.95 })
      .fromTo('#journey-header', { opacity: 0, y: -25 }, { opacity: 1, y: 0, duration: 0.7 })
      .fromTo('.journey-timeline-card',
        { opacity: 0, x: (i) => (i % 2 === 0 ? -60 : 60) },
        { opacity: 1, x: 0, duration: 1.0, stagger: 0.3, ease: "power2.out" },
        "-=0.4"
      )
      .to('#scene-journey', {
        autoAlpha: 0,
        scale: 1.05,
        duration: 0.7,
        ease: "power2.in"
      }, "+=2.5")

      // --- PHASE 6: Flagship project architectural flow ---
      .call(() => {
        setCurrentScene(6);
        playSound.erpDraw();
      })
      .set('#scene-projects', { autoAlpha: 1 })
      .fromTo('#projects-header', { opacity: 0, y: -20 }, { opacity: 1, y: 0, duration: 0.7 })
      .fromTo('#svg-diagram-wrapper', { opacity: 0, scale: 0.95 }, { opacity: 1, scale: 1, duration: 0.8 }, "<")
      .to('.architect-svg-path', {
        strokeDashoffset: 0,
        duration: 2.2,
        ease: "power2.inOut",
        stagger: 0.12
      }, "-=0.4")
      // Data Packets flowing
      .to('#packet-node-db', { opacity: 1, duration: 0.1 })
      .to('#packet-node-db', {
        attr: { cy: 300 },
        duration: 1.2,
        ease: "power1.inOut",
        yoyo: true,
        repeat: 2,
        onStart: playSound.dataPacket,
        onRepeat: playSound.dataPacket
      }, "-=1.2")
      .to('#packet-client-left', { opacity: 1, duration: 0.1 }, "-=1.2")
      .to('#packet-client-left', {
        attr: { cx: 375, cy: 90 },
        duration: 0.95,
        ease: "power1.inOut",
        yoyo: true,
        repeat: 2,
        onStart: playSound.dataPacket,
        onRepeat: playSound.dataPacket
      }, "<")
      // Projects Cards display
      .fromTo('.project-card-interactive',
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.8, stagger: 0.15 },
        "-=1.0"
      )
      .to('#scene-projects', {
        autoAlpha: 0,
        y: -30,
        duration: 0.7,
        ease: "power2.in"
      }, "+=3.5")

      // --- PHASE 7: Education, Contacts & Resolution ---
      .call(() => {
        setCurrentScene(7);
        playSound.finalResolve();
        speedRef.current.targetSpeed = 0.05;
      })
      .set('#scene-final', { autoAlpha: 1, scale: 0.9 })
      .to('#scene-final', { scale: 1, duration: 1.0, ease: "power2.out" })
      .fromTo('#final-logo-glowing',
        { scale: 0, rotation: -270 },
        { scale: 1, rotation: 0, duration: 0.9, ease: "back.out(1.8)" }
      )
      .fromTo('#final-title-text',
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.8, ease: "power2.out" },
        "-=0.4"
      )
      .fromTo('.final-info-item',
        { opacity: 0, y: 15 },
        { opacity: 1, y: 0, duration: 0.6, stagger: 0.15 },
        "-=0.2"
      )
      .fromTo('#final-exit-btn',
        { opacity: 0, scale: 0.85 },
        { opacity: 1, scale: 1, duration: 0.5, ease: "back.out(1.5)" }
      );
  };

  // Skip the cinematic sequence completely
  const skipSequence = () => {
    playSound.stopBoot();
    // Stop all audio synth loops
    Tone.Transport.stop();
    // Trigger clean major chord and jump to end
    playSound.finalResolve();
    setStarted(true);
    setCurrentScene(7);
    gsap.killTweensOf('*');

    // Animate straight to the final resolution scene
    gsap.set('.scene', { autoAlpha: 0 });
    gsap.set('#scene-final', { autoAlpha: 1, scale: 1 });
    speedRef.current.targetSpeed = 0.1;
  };

  if (!mounted) {
    return (
      <div className="w-full h-screen bg-[#020617] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#e49505]" />
      </div>
    );
  }

  return (
    <div className="relative w-full h-full font-sans select-none overflow-hidden bg-[#020617] text-white">
      {/* Dynamic CRT Scanline grid */}
      <div
        className="fixed inset-0 w-full h-full pointer-events-none z-40 opacity-[0.16] bg-[linear-gradient(to_bottom,rgba(255,255,255,0),rgba(255,255,255,0)_50%,rgba(0,0,0,0.45)_50%,rgba(0,0,0,0.45))] bg-[length:100%_4px]"
      />

      {/* Font imports injected in client to guarantee Syncopate/Fira Code load */}
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

      {/* THREE.JS CONTAINER BACKGROUND */}
      <div ref={webglRef} className="absolute inset-0 w-full h-full z-10 pointer-events-none opacity-80" />

      {/* INITIAL LOAD / SEQUENCE TRIGGER SCREEN */}
      <div
        id="start-screen-overlay"
        className={`absolute inset-0 w-full h-full z-50 bg-[#020617]/85 backdrop-blur-md flex flex-col justify-center items-center px-4 transition-all duration-500 ${
          started ? 'opacity-0 pointer-events-none' : 'opacity-100'
        }`}
      >
        <div className="relative border border-[#e49505]/25 bg-[#0b0f19]/90 p-8 sm:p-10 rounded-2xl relative shadow-[0_0_50px_rgba(228,149,5,0.15)] overflow-hidden max-w-xl w-full text-center">
          
          {/* Sci-Fi Decorative Corner Telemetries */}
          <div className="absolute top-4 left-4 font-mono-code text-[8px] sm:text-[9px] text-[#e49505]/50 tracking-wider">[ SEQUENCE: SYS_INIT ]</div>
          <div className="absolute top-4 right-4 font-mono-code text-[8px] sm:text-[9px] text-[#e49505]/50 tracking-wider">[ NODE: ONLINE ]</div>
          <div className="absolute bottom-4 left-4 font-mono-code text-[8px] sm:text-[9px] text-zinc-500 tracking-wider">[ LATENCY: ~14ms ]</div>
          <div className="absolute bottom-4 right-4 font-mono-code text-[8px] sm:text-[9px] text-zinc-500 tracking-wider">[ MATRIX: ARMED ]</div>

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
            SYSTEM INITIALIZATION ENGINE v3.0<br />
            ENGAGING 3D PARTICLE FIELD & GEOMETRIC AUDIO SYNTHS
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <button
              ref={startBtnRef}
              onClick={startSequence}
              className="w-full sm:w-auto px-8 py-3.5 bg-gradient-to-r from-[#e49505] to-[#f59e0b] hover:from-[#c98304] hover:to-[#d97706] text-black font-synco text-xs font-black tracking-widest rounded-xl transition-all duration-300 transform hover:scale-[1.03] active:scale-[0.97] shadow-[0_0_30px_rgba(228,149,5,0.35)] flex items-center justify-center gap-2 group/execute"
              disabled={audioInitializing}
            >
              <span>{audioInitializing ? 'INITIALIZING...' : 'EXECUTE SEQUENCE'}</span>
              {!audioInitializing && <span className="transform group-hover/execute:translate-x-1 transition-transform">&rarr;</span>}
            </button>
            <button
              onClick={skipSequence}
              className="w-full sm:w-auto px-6 py-3.5 bg-black/40 hover:bg-white/[0.04] border border-[#e49505]/20 hover:border-[#e49505]/50 text-zinc-400 hover:text-white font-synco text-xs tracking-widest rounded-xl transition-all duration-200"
            >
              SKIP INTRO
            </button>
          </div>
        </div>
      </div>

      {/* OVERLAY SCENE MANAGER LAYER */}
      <div className="absolute inset-0 w-full h-full z-20 flex justify-center items-center p-6 sm:p-12 md:p-16 pointer-events-none [&>*]:pointer-events-auto">

        {/* Quick Skip button in bottom corner */}
        {currentScene < 7 && (
          <button
            onClick={skipSequence}
            className="absolute bottom-6 right-6 z-50 px-4 py-2 border border-[#e49505]/20 bg-[#020617]/70 text-xs font-mono-code tracking-wider text-[#e49505] rounded-lg backdrop-blur-md hover:bg-[#e49505] hover:text-black hover:border-transparent transition-all duration-300"
          >
            [ SKIP SEQUENCE &gt;&gt; ]
          </button>
        )}

        {/* SCENE 1: Terminal Boot Console */}
        <div id="scene-boot" className="scene flex items-end justify-start p-8 sm:p-12 w-full h-full text-left z-30">
          <div className="font-mono-code text-[#e49505] text-xs sm:text-sm leading-relaxed whitespace-pre-wrap max-w-xl md:max-w-2xl bg-black/40 p-6 rounded-lg border border-white/5 backdrop-blur-sm w-full">
            <div id="terminal-console" className="drop-shadow-[0_0_4px_rgba(228,149,5,0.5)]"></div>
          </div>
        </div>

        {/* SCENE 2: Identity Reveal Smash */}
        <div id="scene-identity" className="scene flex flex-col items-center justify-center text-center">
          <div className="relative">
            <h1
              id="main-name"
              className="font-synco text-7xl sm:text-8xl md:text-9xl font-black tracking-tighter m-0 leading-none text-white glitch-text-amber"
              data-text="TALHA"
            >
              TALHA
            </h1>

            <div
              id="role-mask"
              className="mt-6 px-6 py-2 border border-white/10 bg-black/60 backdrop-blur-md overflow-hidden relative inline-block rounded"
            >
              <div className="font-mono-code text-lg sm:text-2xl tracking-[0.4em] text-[#e49505] uppercase font-bold whitespace-nowrap">
                Full Stack Architect
              </div>
              {/* Visual glow strip */}
              <div id="role-glitch-layer" className="absolute inset-0 bg-[#e49505] mix-blend-overlay origin-left scale-x-0"></div>
            </div>

            <p className="mt-4 font-mono-code text-zinc-400 text-xs sm:text-sm tracking-wider uppercase">
              Woltrio Engineer &bull; Islamabad, Pakistan
            </p>
          </div>
        </div>

        {/* SCENE 3: Tech Matrix Orbit */}
        <div id="scene-tech" className="scene flex flex-col items-center justify-center w-full h-full text-center">
          <h2 id="tech-matrix-header" className="font-synco text-3xl sm:text-4xl text-white tracking-widest absolute top-16 md:top-24">
            SYSTEM ARCHITECTURE
          </h2>

          <div id="tech-container-orbit" className="relative w-[320px] h-[320px] sm:w-[480px] sm:h-[480px] flex items-center justify-center" style={{ transformStyle: 'preserve-3d', perspective: '1000px' }}>
            {/* Mesh rings */}
            <div className="tech-ring-mesh absolute rounded-full border border-[#e49505]/20 w-[240px] h-[240px] sm:w-[380px] sm:h-[380px]" style={{ transform: 'rotateX(60deg) rotateY(0deg)' }} />
            <div className="tech-ring-mesh absolute rounded-full border border-white/10 w-[180px] h-[180px] sm:w-[280px] sm:h-[280px]" style={{ transform: 'rotateX(60deg) rotateY(30deg)' }} />

            {/* Render floating skill nodes positioned dynamically by GSAP */}
            {skillsData.map((skill, index) => {
              const SkillIcon = skill.Icon;
              return (
                <div
                  key={skill.name}
                  className="orbit-tech-node absolute w-14 h-14 sm:w-16 sm:h-16 bg-[#020617]/95 border border-[#e49505]/30 rounded-xl flex flex-col justify-center items-center text-center opacity-0 scale-0 shadow-[0_0_20px_rgba(228,149,5,0.15)] group"
                  style={{
                    transformStyle: 'preserve-3d',
                    transform: 'translate(0px, 0px) scale(0)'
                  }}
                >
                  <SkillIcon style={{ color: skill.color }} className="text-xl sm:text-2xl transition-transform duration-300 group-hover:scale-110" />
                  <span className="font-mono-code text-[8px] sm:text-[9px] text-zinc-400 mt-1 uppercase font-bold">{skill.name}</span>
                </div>
              );
            })}
          </div>

          <div id="tech-subtext" className="absolute bottom-16 md:bottom-24 font-mono-code text-xs sm:text-sm text-zinc-400 px-4 max-w-lg">
            [ NEXT.JS &bull; REACT 18 &bull; NODE.JS &bull; POSTGRESQL &bull; DRIZZLE &bull; DOCKER ]
          </div>
        </div>

        {/* SCENE 4: Focus Areas */}
        <div id="scene-focus" className="scene z-20">
          <div className="flex flex-col items-center justify-center w-full max-w-5xl text-center px-4">
            <h2 id="focus-header" className="font-synco text-2xl sm:text-4xl text-white tracking-widest mb-12 uppercase">
              CORE SPECIALIZATION
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
              {focusAreas.map((area, idx) => {
                const AreaIcon = area.Icon;
                return (
                  <div
                    key={idx}
                    className="focus-card-anim bg-[#0b101d]/85 border border-zinc-800 rounded-2xl p-6 text-left relative overflow-hidden shadow-xl backdrop-blur-md"
                  >
                    <div className="absolute top-0 right-0 w-24 h-24 bg-[#e49505]/5 rounded-full blur-xl pointer-events-none" />
                    <div className="inline-flex items-center justify-center p-3.5 rounded-xl bg-[#e49505]/10 border border-[#e49505]/20 text-[#e49505] mb-5">
                      <AreaIcon className="text-2xl" />
                    </div>
                    <h3 className="font-synco text-sm font-bold text-white tracking-tight mb-2 uppercase">{area.title}</h3>
                    <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed font-light">{area.text}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* SCENE 5: Work Experience */}
        <div id="scene-journey" className="scene z-20">
          <div className="flex flex-col items-center justify-center w-full max-w-4xl text-center px-4">
            <h2 id="journey-header" className="font-synco text-2xl sm:text-4xl text-white tracking-widest mb-12 uppercase">
              PROFESSIONAL JOURNEY
            </h2>

            <div className="relative w-full max-w-3xl flex flex-col gap-6 text-left">
              {/* Line connector */}
              <div className="absolute left-[37px] top-6 bottom-6 w-[2px] bg-gradient-to-b from-[#e49505] to-zinc-800" />

              {experiences.map((exp, idx) => (
                <div key={idx} className="journey-timeline-card flex items-start gap-4 sm:gap-6 relative z-10">
                  {/* Icon Node */}
                  <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-xl bg-[#0b101d] border border-[#e49505]/30 flex items-center justify-center text-[#e49505] shrink-0 shadow-[0_0_15px_rgba(228,149,5,0.1)]">
                    <Briefcase size={20} />
                  </div>

                  {/* Glass Box */}
                  <div className="flex-1 bg-[#0b101d]/85 border border-zinc-800 rounded-xl p-5 sm:p-6 backdrop-blur-md relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-[#e49505]/5 rounded-full blur-xl pointer-events-none" />
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 mb-2">
                      <div>
                        <h4 className="font-synco text-xs sm:text-sm font-bold text-white tracking-tight">{exp.title}</h4>
                        <p className="text-xs text-[#e49505] font-semibold mt-0.5">At {exp.company}</p>
                      </div>
                      <span className="inline-flex px-2.5 py-1 rounded-full text-[10px] font-semibold bg-[#e49505]/10 border border-[#e49505]/20 text-[#e49505] uppercase tracking-wider w-fit sm:h-fit">
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

        {/* SCENE 6: Flagship Architecture / Dynamic Projects */}
        <div id="scene-projects" className="scene z-20">
          <div className="flex flex-col items-center justify-center w-full max-w-6xl text-center px-4">

            <div id="projects-header" className="mb-8">
              <span className="font-mono-code text-[#e49505] text-sm mb-1 uppercase tracking-widest block">[ MODULE: FLAGSHIP_PRODUCTS ]</span>
              <h2 className="font-synco text-2xl sm:text-4xl text-white uppercase">Featured Projects</h2>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-center w-full">

            {/* Architecture SVG diagram (Labayik ERP inspired flow) */}
            <div
              id="svg-diagram-wrapper"
              className="lg:col-span-3 aspect-[1.8/1] w-full border border-zinc-800 bg-[#020617]/95 rounded-2xl relative overflow-hidden flex items-center justify-center shadow-2xl p-4"
            >
              <svg className="w-full h-full" viewBox="0 0 800 400" fill="none" stroke="#e49505" strokeWidth="2">
                {/* Central Node Server */}
                <rect x="350" y="50" width="100" height="60" rx="6" className="architect-svg-path stroke-white" style={{ strokeDasharray: 1000, strokeDashoffset: 1000 }} />
                <text x="400" y="85" fill="#fff" fontFamily="monospace" fontSize="11" textAnchor="middle" fontWeight="bold">API GATEWAY</text>
                <text x="400" y="100" fill="#e49505" fontFamily="monospace" fontSize="9" textAnchor="middle">NODEJS / TS</text>

                {/* DB server Node */}
                <path d="M350,320 C350,310 450,310 450,320 L450,360 C450,370 350,370 350,360 Z" className="architect-svg-path stroke-[#e49505]" style={{ strokeDasharray: 1000, strokeDashoffset: 1000 }} />
                <path d="M350,320 C350,330 450,330 450,320" className="architect-svg-path stroke-[#e49505]" style={{ strokeDasharray: 1000, strokeDashoffset: 1000 }} />
                <text x="400" y="348" fill="#fff" fontFamily="monospace" fontSize="11" textAnchor="middle" fontWeight="bold">POSTGRESQL</text>

                {/* Left Client (Booker) */}
                <rect x="60" y="170" width="130" height="70" rx="8" className="architect-svg-path stroke-[#e49505]" style={{ strokeDasharray: 1000, strokeDashoffset: 1000 }} />
                <text x="125" y="205" fill="#fff" fontFamily="monospace" fontSize="11" textAnchor="middle" fontWeight="bold">ERP BOOKER APP</text>
                <text x="125" y="222" fill="#e49505" fontFamily="monospace" fontSize="9" textAnchor="middle">REACT CLIENT</text>

                {/* Right Client (Finance) */}
                <rect x="610" y="170" width="130" height="70" rx="8" className="architect-svg-path stroke-[#e49505]" style={{ strokeDasharray: 1000, strokeDashoffset: 1000 }} />
                <text x="675" y="205" fill="#fff" fontFamily="monospace" fontSize="11" textAnchor="middle" fontWeight="bold">FINANCE PORTAL</text>
                <text x="675" y="222" fill="#e49505" fontFamily="monospace" fontSize="9" textAnchor="middle">NEXT.JS DASH</text>

                {/* Intersecting lines */}
                <path d="M400,110 L400,310" className="architect-svg-path opacity-40 stroke-zinc-500" strokeDasharray="6 6" style={{ strokeDasharray: 1000, strokeDashoffset: 1000 }} />
                <path d="M190,205 L350,80" className="architect-svg-path opacity-40 stroke-zinc-500" strokeDasharray="6 6" style={{ strokeDasharray: 1000, strokeDashoffset: 1000 }} />
                <path d="M610,205 L450,80" className="architect-svg-path opacity-40 stroke-zinc-500" strokeDasharray="6 6" style={{ strokeDasharray: 1000, strokeDashoffset: 1000 }} />

                {/* Glowing data packets */}
                <circle cx="400" cy="110" r="5" fill="#e49505" id="packet-node-db" opacity="0" />
                <circle cx="190" cy="205" r="5" fill="#fff" id="packet-client-left" opacity="0" />
              </svg>

              {/* Dashboard logs overlay */}
              <div className="absolute bottom-4 left-4 text-left font-mono-code text-[9px] text-zinc-500 leading-relaxed bg-[#020617]/70 p-2.5 rounded border border-white/5">
                [ HOSTING: DIGITALOCEAN VPS ]<br />
                [ LATENCY: ~14ms ] &bull; [ STACK: MERN + DOCKER ]<br />
                [ STATE: DISPATCHED & ACTIVE ]
              </div>
            </div>

            {/* Dynamic Projects slide container */}
            <div className="lg:col-span-2 flex flex-col gap-4 text-left">
              {initialProjects.slice(0, 2).map((proj, idx) => (
                <div
                  key={proj.id}
                  className="project-card-interactive bg-[#0b101d]/85 border border-zinc-800 rounded-xl p-5 shadow-lg backdrop-blur-md opacity-0 translate-y-8"
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

        {/* SCENE 7: Graduation, Social Contacts & Final Resolution CTA */}
        <div id="scene-final" className="scene z-20">
          <div className="flex flex-col items-center justify-center text-center max-w-xl px-4 w-full">
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

          <p className="font-mono-code text-zinc-400 text-xs sm:text-sm mb-6 uppercase tracking-widest">
            Full Stack Software Engineer &bull; Woltrio
          </p>

          <hr className="w-24 border-[#e49505]/40 mb-6" />

          {/* Structured Education & Contact Details */}
          <div className="flex flex-col gap-3.5 w-full mb-8 font-mono-code text-xs text-left px-4">

            {/* Academics Box */}
            <div className="final-info-item flex items-center gap-3 p-3 bg-white/[0.02] border border-white/5 rounded-xl">
              <BookOpen size={16} className="text-[#e49505] shrink-0" />
              <div>
                <span className="text-[10px] text-zinc-500 font-bold block">ACADEMICS</span>
                <span className="text-zinc-300">BS Mathematics &bull; Quaid-e-Azam University</span>
              </div>
            </div>

            {/* Email Box */}
            <a
              href="mailto:mtalhamaths@gmail.com"
              className="final-info-item flex items-center gap-3 p-3 bg-white/[0.02] border border-white/5 rounded-xl hover:border-[#e49505]/40 transition-colors"
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
              className="final-info-item flex items-center gap-3 p-3 bg-white/[0.02] border border-white/5 rounded-xl hover:border-[#e49505]/40 transition-colors"
            >
              <Phone size={16} className="text-[#e49505] shrink-0" />
              <div>
                <span className="text-[10px] text-zinc-500 font-bold block">PHONE CONTACT</span>
                <span className="text-zinc-300">+92-318-5853847</span>
              </div>
            </a>

            {/* Location Box */}
            <div className="final-info-item flex items-center gap-3 p-3 bg-white/[0.02] border border-white/5 rounded-xl">
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
            className="px-8 py-3.5 bg-gradient-to-r from-[#e49505] to-[#f59e0b] hover:from-[#c98304] hover:to-[#d97706] text-black font-synco text-xs font-black tracking-widest rounded-xl transition-all duration-300 transform hover:scale-[1.04] active:scale-[0.97] shadow-[0_0_25px_rgba(228,149,5,0.35)] flex items-center gap-2.5"
          >
            <span>ACCESS STANDARD PORTFOLIO</span>
            <FaArrowRight className="text-xs" />
          </Link>
        </div>

      </div>
    </div>
  </div>
  )
}
