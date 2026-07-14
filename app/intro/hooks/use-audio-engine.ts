'use client';

import { useEffect, useRef } from 'react';
import * as Tone from 'tone';
import { useIntro, SynthTheme } from '../context/intro-context';

export const useAudioEngine = () => {
  const { isMuted, synthTheme, audioInitializing, setAudioInitializing } = useIntro();

  // Synth References
  const bassSynthRef = useRef<Tone.MembraneSynth | null>(null);
  const blipSynthRef = useRef<Tone.FMSynth | null>(null);
  const noiseSynthRef = useRef<Tone.NoiseSynth | null>(null);
  const polySynthRef = useRef<Tone.PolySynth | null>(null);
  const pluckSynthRef = useRef<Tone.PluckSynth | null>(null);
  const loopRef = useRef<Tone.Loop | null>(null);

  // Sync mute state to Tone.Destination
  useEffect(() => {
    Tone.Destination.mute = isMuted;
  }, [isMuted]);

  // Sync synth settings to the current theme
  useEffect(() => {
    updateSynthParameters(synthTheme);
  }, [synthTheme]);

  const updateSynthParameters = (theme: SynthTheme) => {
    if (!polySynthRef.current || !blipSynthRef.current) return;

    if (theme === 'ambient') {
      // Warm, lush, high decay and soft attack
      polySynthRef.current.set({
        oscillator: { type: 'triangle' },
        envelope: { attack: 0.8, decay: 1.0, sustain: 0.8, release: 2.0 },
      });
      blipSynthRef.current.set({
        oscillator: { type: 'sine' },
        envelope: { attack: 0.05, decay: 0.1, sustain: 0.1, release: 0.2 },
      });
    } else if (theme === 'cyberpunk') {
      // Aggressive, distorted, fast square / sawtooth waves
      polySynthRef.current.set({
        oscillator: { type: 'sawtooth' },
        envelope: { attack: 0.1, decay: 0.4, sustain: 0.4, release: 0.8 },
      });
      blipSynthRef.current.set({
        oscillator: { type: 'square' },
        envelope: { attack: 0.01, decay: 0.05, sustain: 0, release: 0.1 },
      });
    } else if (theme === 'retro') {
      // 8-bit style retro waves
      polySynthRef.current.set({
        oscillator: { type: 'square' },
        envelope: { attack: 0.01, decay: 0.15, sustain: 0.2, release: 0.3 },
      });
      blipSynthRef.current.set({
        oscillator: { type: 'pulse', width: 0.25 },
        envelope: { attack: 0.001, decay: 0.04, sustain: 0, release: 0.05 },
      });
    }
  };

  const initAudio = async () => {
    if (audioInitializing) return;
    setAudioInitializing(true);
    try {
      await Tone.start();
      Tone.Destination.volume.value = -8; // Safe volume limit

      // Deep Bass
      bassSynthRef.current = new Tone.MembraneSynth({
        pitchDecay: 0.05,
        octaves: 5,
        oscillator: { type: 'square' },
        envelope: { attack: 0.01, decay: 0.4, sustain: 0.01, release: 1.4 },
      }).toDestination();

      // Cyber blips
      blipSynthRef.current = new Tone.FMSynth({
        harmonicity: 3,
        modulationIndex: 10,
        oscillator: { type: 'sine' },
        envelope: { attack: 0.01, decay: 0.05, sustain: 0, release: 0.1 },
      }).toDestination();

      // Glitch bursts
      noiseSynthRef.current = new Tone.NoiseSynth({
        noise: { type: 'pink' },
        envelope: { attack: 0.001, decay: 0.15, sustain: 0 },
      }).toDestination();

      // Ethereal chords
      polySynthRef.current = new Tone.PolySynth(Tone.Synth, {
        oscillator: { type: 'triangle' },
        envelope: { attack: 0.6, decay: 0.8, sustain: 0.6, release: 1.8 },
      }).toDestination();

      // Plucky nodes
      pluckSynthRef.current = new Tone.PluckSynth({
        attackNoise: 0.8,
        dampening: 3500,
        resonance: 0.85,
      }).toDestination();

      // Apply initial theme
      updateSynthParameters(synthTheme);
    } catch (err) {
      console.warn('Audio context initialization failed:', err);
    } finally {
      setAudioInitializing(false);
    }
  };

  // Sound triggers
  const playSound = {
    startBoot: () => {
      if (!blipSynthRef.current) return;
      // Stop existing loop if any
      if (loopRef.current) {
        loopRef.current.stop();
      }
      loopRef.current = new Tone.Loop((time) => {
        blipSynthRef.current?.triggerAttackRelease('D6', '32n', time, 0.08);
      }, '16n').start(0);
      Tone.Transport.start();
    },
    stopBoot: () => {
      if (loopRef.current) {
        loopRef.current.stop();
        loopRef.current = null;
      }
    },
    warpDrive: () => {
      bassSynthRef.current?.triggerAttackRelease('D1', '2n', '+0.05');
      noiseSynthRef.current?.triggerAttackRelease('2n', '+0.05');
      polySynthRef.current?.triggerAttackRelease(['D3', 'A3', 'D4'], '3n', '+0.05');
    },
    slamName: () => {
      bassSynthRef.current?.triggerAttackRelease('D0', '8n', '+0.05');
      if (noiseSynthRef.current) {
        noiseSynthRef.current.envelope.decay = 0.45;
        noiseSynthRef.current.triggerAttackRelease('4n', '+0.05');
      }
    },
    glitchRole: () => {
      blipSynthRef.current?.triggerAttackRelease('D7', '32n', '+0.05');
      setTimeout(() => blipSynthRef.current?.triggerAttackRelease('F#7', '32n', '+0.05'), 60);
      setTimeout(() => blipSynthRef.current?.triggerAttackRelease('A7', '32n', '+0.05'), 120);
    },
    techRings: () => {
      polySynthRef.current?.triggerAttackRelease(['E4', 'B4', 'F#5'], '2n', '+0.05');
    },
    techNode: (i: number) => {
      const scale = ['D4', 'E4', 'F#4', 'A4', 'B4', 'D5'];
      pluckSynthRef.current?.triggerAttackRelease(scale[i % scale.length], '8n', '+0.05');
    },
    erpDraw: () => {
      polySynthRef.current?.triggerAttackRelease(['G3', 'D4', 'A4'], '2n', '+0.05');
    },
    dataPacket: () => {
      blipSynthRef.current?.triggerAttackRelease('B5', '16n', '+0.05');
    },
    finalResolve: () => {
      polySynthRef.current?.triggerAttackRelease(['D4', 'F#4', 'A4', 'C#5', 'E5'], '1.5m', '+0.05');
      bassSynthRef.current?.triggerAttackRelease('D2', '2n', '+0.05');
    },
    clickBeep: () => {
      blipSynthRef.current?.triggerAttackRelease('A5', '64n', '+0.01', 0.15);
    },
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (loopRef.current) {
        loopRef.current.stop();
      }
      Tone.Transport.stop();

      // Dispose synths
      bassSynthRef.current?.dispose();
      blipSynthRef.current?.dispose();
      noiseSynthRef.current?.dispose();
      polySynthRef.current?.dispose();
      pluckSynthRef.current?.dispose();
    };
  }, []);

  return {
    initAudio,
    playSound,
  };
};
