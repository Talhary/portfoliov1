'use client';

import { useEffect, useRef } from 'react';

// Client-only component to load the popunder/background monetization scripts
export function AdScripts() {
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const scriptUrls = [
      'https://pl29753492.effectivecpmnetwork.com/f5/b1/04/f5b1046a639ab89b52f2fc5b9132af21.js',
      'https://pl29753495.effectivecpmnetwork.com/1d/12/5e/1d125e85982119ff4ae4f19d16c0bbb9.js'
    ];

    const loadedScripts: HTMLScriptElement[] = [];

    scriptUrls.forEach((src) => {
      // Check if script already exists
      if (document.querySelector(`script[src="${src}"]`)) return;

      const script = document.createElement('script');
      script.src = src;
      script.async = true;
      document.body.appendChild(script);
      loadedScripts.push(script);
    });

    return () => {
      // Cleanup loaded scripts on unmount
      loadedScripts.forEach((script) => {
        if (script.parentNode) {
          script.parentNode.removeChild(script);
        }
      });
    };
  }, []);

  return null;
}

// Client-only component for the Native Ad container
export function NativeAd() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window === 'undefined' || !containerRef.current) return;

    // Clear previous contents to prevent duplicate injections in dev/strict mode
    containerRef.current.innerHTML = '';

    const script = document.createElement('script');
    script.src = 'https://pl29753493.effectivecpmnetwork.com/982bc8a5b1d8551bb6efc8fa707f494d/invoke.js';
    script.async = true;
    script.setAttribute('data-cfasync', 'false');

    containerRef.current.appendChild(script);

    return () => {
      if (containerRef.current) {
        containerRef.current.innerHTML = '';
      }
    };
  }, []);

  return (
    <div className="w-full flex flex-col items-center justify-center my-6 min-h-[100px]">
      <div 
        id="container-982bc8a5b1d8551bb6efc8fa707f494d" 
        ref={containerRef}
        className="w-full max-w-full overflow-hidden flex justify-center items-center"
      />
    </div>
  );
}

// Client-only component for the Banner Ad (468x60 iframe)
export function BannerAd() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window === 'undefined' || !containerRef.current) return;

    // Clear previous contents to prevent duplicate injections in dev/strict mode
    containerRef.current.innerHTML = '';

    // Set global options for the banner format
    (window as any).atOptions = {
      'key' : 'b40a71ba9da4562619599c850e28c1f0',
      'format' : 'iframe',
      'height' : 60,
      'width' : 468,
      'params' : {}
    };

    const script = document.createElement('script');
    script.src = 'https://www.highperformanceformat.com/b40a71ba9da4562619599c850e28c1f0/invoke.js';
    script.async = true;

    containerRef.current.appendChild(script);

    return () => {
      if (containerRef.current) {
        containerRef.current.innerHTML = '';
      }
    };
  }, []);

  return (
    <div className="w-full flex flex-col items-center justify-center my-6 min-h-[60px]">
      <div 
        ref={containerRef}
        className="w-full max-w-full overflow-x-auto flex justify-center items-center"
      />
    </div>
  );
}
