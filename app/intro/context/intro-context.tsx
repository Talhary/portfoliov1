'use client';

import React, { createContext, useContext, useState, useRef } from 'react';

export type JourneyMode = 'all' | 'mern' | 'backend' | 'automation';
export type SynthTheme = 'ambient' | 'cyberpunk' | 'retro';

export interface SpeedControl {
  targetSpeed: number;
  currentSpeed: number;
  rotationSpeed: number;
}

interface IntroContextType {
  started: boolean;
  setStarted: (started: boolean) => void;
  audioInitializing: boolean;
  setAudioInitializing: (initializing: boolean) => void;
  currentScene: number;
  setCurrentScene: (scene: number) => void;
  journeyMode: JourneyMode;
  setJourneyMode: (mode: JourneyMode) => void;
  isMuted: boolean;
  setIsMuted: (muted: boolean) => void;
  synthTheme: SynthTheme;
  setSynthTheme: (theme: SynthTheme) => void;
  isSimulatingTraffic: boolean;
  setIsSimulatingTraffic: (simulating: boolean) => void;
  speedScale: React.MutableRefObject<SpeedControl>;
  skipSequence: () => void;
  registerSkipCallback: (cb: () => void) => void;
}

const IntroContext = createContext<IntroContextType | undefined>(undefined);

export const IntroProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [started, setStarted] = useState(false);
  const [audioInitializing, setAudioInitializing] = useState(false);
  const [currentScene, setCurrentScene] = useState(0);
  const [journeyMode, setJourneyMode] = useState<JourneyMode>('all');
  const [isMuted, setIsMuted] = useState(false);
  const [synthTheme, setSynthTheme] = useState<SynthTheme>('ambient');
  const [isSimulatingTraffic, setIsSimulatingTraffic] = useState(false);

  // Speed controls referenced inside the Three.js requestAnimationFrame loop
  const speedScale = useRef<SpeedControl>({
    targetSpeed: 0.5,
    currentSpeed: 0.5,
    rotationSpeed: 0.001,
  });

  // Reference for GSAP skip callback registered by the orchestration runner
  const skipCallbackRef = useRef<(() => void) | null>(null);

  const registerSkipCallback = (cb: () => void) => {
    skipCallbackRef.current = cb;
  };

  const skipSequence = () => {
    if (skipCallbackRef.current) {
      skipCallbackRef.current();
    }
  };

  return (
    <IntroContext.Provider
      value={{
        started,
        setStarted,
        audioInitializing,
        setAudioInitializing,
        currentScene,
        setCurrentScene,
        journeyMode,
        setJourneyMode,
        isMuted,
        setIsMuted,
        synthTheme,
        setSynthTheme,
        isSimulatingTraffic,
        setIsSimulatingTraffic,
        speedScale,
        skipSequence,
        registerSkipCallback,
      }}
    >
      {children}
    </IntroContext.Provider>
  );
};

export const useIntro = () => {
  const context = useContext(IntroContext);
  if (!context) {
    throw new Error('useIntro must be used within an IntroProvider');
  }
  return context;
};
