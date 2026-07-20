'use client';

import { useState } from 'react';
import { ToolDefinition } from '@/lib/tools/registry';
import { FiDroplet, FiCopy, FiCheck, FiSliders } from 'react-icons/fi';

export const ColorToolModule = ({ tool }: { tool: ToolDefinition }) => {
  const [hexColor, setHexColor] = useState<string>('#3b82f6');
  const [secondaryColor, setSecondaryColor] = useState<string>('#8b5cf6');
  const [angle, setAngle] = useState<number>(90);
  const [copied, setCopied] = useState<boolean>(false);

  // HEX to RGB helper
  const hexToRgb = (hex: string) => {
    let cleanHex = hex.replace('#', '');
    if (cleanHex.length === 3) {
      cleanHex = cleanHex.split('').map((c) => c + c).join('');
    }
    const num = parseInt(cleanHex, 16);
    return {
      r: (num >> 16) & 255,
      g: (num >> 8) & 255,
      b: num & 255,
    };
  };

  const rgb = hexToRgb(hexColor);
  const rgbString = `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`;
  const gradientCss = `linear-gradient(${angle}deg, ${hexColor}, ${secondaryColor})`;

  const handleCopy = (str: string) => {
    navigator.clipboard.writeText(str);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Primary Color Picker Input */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-bold uppercase text-stone-500 mb-1">Primary Color (HEX)</label>
          <div className="flex items-center gap-3">
            <input
              type="color"
              value={hexColor}
              onChange={(e) => setHexColor(e.target.value)}
              className="w-12 h-12 rounded-xl cursor-pointer border-0 p-0 bg-transparent"
            />
            <input
              type="text"
              value={hexColor}
              onChange={(e) => setHexColor(e.target.value)}
              className="w-full p-3 bg-stone-50 dark:bg-zinc-950 border border-stone-200 dark:border-zinc-800 rounded-xl font-mono text-sm font-bold uppercase"
            />
          </div>
        </div>

        {tool.id === 'gradient-generator' && (
          <div>
            <label className="block text-xs font-bold uppercase text-stone-500 mb-1">Secondary Color (HEX)</label>
            <div className="flex items-center gap-3">
              <input
                type="color"
                value={secondaryColor}
                onChange={(e) => setSecondaryColor(e.target.value)}
                className="w-12 h-12 rounded-xl cursor-pointer border-0 p-0 bg-transparent"
              />
              <input
                type="text"
                value={secondaryColor}
                onChange={(e) => setSecondaryColor(e.target.value)}
                className="w-full p-3 bg-stone-50 dark:bg-zinc-950 border border-stone-200 dark:border-zinc-800 rounded-xl font-mono text-sm font-bold uppercase"
              />
            </div>
          </div>
        )}
      </div>

      {/* Gradient Swatch Preview */}
      {tool.id === 'gradient-generator' ? (
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase text-stone-500 mb-1">Gradient Angle ({angle}°)</label>
            <input
              type="range"
              min={0}
              max={360}
              value={angle}
              onChange={(e) => setAngle(Number(e.target.value))}
              className="w-full accent-primary"
            />
          </div>

          <div
            style={{ background: gradientCss }}
            className="w-full h-40 rounded-2xl shadow-inner border border-stone-200 dark:border-zinc-800 flex items-center justify-center"
          >
            <span className="bg-black/60 text-white font-mono text-xs px-3 py-1.5 rounded-full backdrop-blur-md">
              {gradientCss}
            </span>
          </div>

          <button
            onClick={() => handleCopy(`background: ${gradientCss};`)}
            className="w-full py-3 bg-primary hover:bg-primary/90 text-white font-bold text-sm rounded-xl shadow-lg transition-all flex items-center justify-center gap-2"
          >
            {copied ? <FiCheck size={16} /> : <FiCopy size={16} />} {copied ? 'CSS Copied!' : 'Copy CSS Snippet'}
          </button>
        </div>
      ) : (
        /* Color Swatch & Value Output */
        <div className="space-y-4">
          <div
            style={{ backgroundColor: hexColor }}
            className="w-full h-32 rounded-2xl shadow-inner border border-stone-200 dark:border-zinc-800 flex items-center justify-center"
          >
            <span className="bg-black/60 text-white font-mono text-xs px-3 py-1.5 rounded-full backdrop-blur-md uppercase font-bold">
              {hexColor}
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            <div className="p-3 bg-stone-50 dark:bg-zinc-950 border border-stone-200 dark:border-zinc-800 rounded-xl text-center">
              <span className="text-[10px] font-bold uppercase text-stone-500">HEX</span>
              <div className="text-sm font-mono font-bold text-stone-900 dark:text-white uppercase">{hexColor}</div>
            </div>
            <div className="p-3 bg-stone-50 dark:bg-zinc-950 border border-stone-200 dark:border-zinc-800 rounded-xl text-center">
              <span className="text-[10px] font-bold uppercase text-stone-500">RGB</span>
              <div className="text-sm font-mono font-bold text-stone-900 dark:text-white">{rgbString}</div>
            </div>
            <div className="p-3 bg-stone-50 dark:bg-zinc-950 border border-stone-200 dark:border-zinc-800 rounded-xl text-center col-span-2 sm:col-span-1">
              <span className="text-[10px] font-bold uppercase text-stone-500">RGB Values</span>
              <div className="text-sm font-mono font-bold text-primary">R:{rgb.r} G:{rgb.g} B:{rgb.b}</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
