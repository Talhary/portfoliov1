'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ToolDefinition } from '@/lib/tools/registry';
import { 
  ArrowRight, Cpu, Star, Calculator, Image as ImageIcon, 
  FileText, Palette, Code, Clock, RefreshCw, 
  Shield, TrendingUp, Folder 
} from 'lucide-react';
import React from 'react';

// Specific Tool Emoji Map for instant visual recognition
const TOOL_EMOJIS: Record<string, string> = {
  // Calculators
  'basic-calculator': '🔢',
  'percentage-calculator': '％',
  'bmi-calculator': '⚖️',
  'loan-calculator': '💵',
  'age-calculator': '📅',
  'tip-calculator': '🍽️',
  'currency-converter': '💱',
  'discount-calculator': '🏷️',
  'gpa-calculator': '🎓',
  'salary-calculator': '💰',
  'compound-interest-calculator': '📈',
  'time-duration-calculator': '⏱️',
  'electricity-bill-calculator': '⚡',

  // Image Tools
  'png-to-jpg': '🖼️',
  'jpg-to-png': '🖼️',
  'webp-to-png': '🔄',
  'image-resizer': '📐',
  'image-compressor': '🗜️',
  'image-to-base64': '🔤',
  'image-watermark': '💧',
  'ocr-image-to-text': '👁️',
  'color-extractor-from-image': '🧪',
  'favicon-generator': '🌟',

  // Text Tools
  'word-counter': '📊',
  'markdown-editor': '✍️',
  'lorem-ipsum-generator': '📄',
  'text-case-converter': '🔠',
  'diff-checker': '🔍',
  'string-repeater': '🔂',

  // Color Tools
  'color-picker': '🎨',
  'contrast-checker': '👁️',
  'gradient-generator': '🌈',
  'palette-generator': '🖌️',

  // Developer & Security & Utilities
  'json-formatter': '⚡',
  'jwt-decoder': '🔑',
  'regex-tester': '🧪',
  'qr-code-generator': '📱',
  'uuid-generator': '🎲',
  'hash-generator': '🔒',
  'password-generator': '🔐',
  'dns-lookup': '🌐',
  'ip-lookup': '📍',
  'cron-parser': '⏰',
  'binary-converter': '0️⃣',
  'morse-code-converter': '📻',
  'roman-numeral-converter': '🏛️',
  'pdf-tools': '📑',
};

// Deterministic HSL theme engine to generate a unique background & accent styling per tool
const getToolTheme = (tool: ToolDefinition) => {
  let hash = 0;
  const str = tool.id + tool.title;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  
  // Calculate hue (0-360)
  const hue = Math.abs(hash % 360);
  const secondaryHue = (hue + 45) % 360;

  // Background gradients for light & dark modes
  const bgLight = `linear-gradient(135deg, hsla(${hue}, 90%, 96%, 0.85) 0%, hsla(${secondaryHue}, 80%, 93%, 0.5) 55%, #ffffff 100%)`;
  const bgDark = `linear-gradient(135deg, hsla(${hue}, 50%, 11%, 0.7) 0%, hsla(${secondaryHue}, 40%, 8%, 0.8) 55%, rgba(24, 24, 27, 0.92) 100%)`;
  
  // Accent glow & highlight colors
  const accentColor = `hsl(${hue}, 85%, 46%)`;
  const accentColorDark = `hsl(${hue}, 85%, 68%)`;
  const accentGlow = `hsla(${hue}, 85%, 55%, 0.18)`;
  const borderHover = `hsla(${hue}, 80%, 55%, 0.45)`;

  // Badge styling per tool
  const badgeBg = `hsla(${hue}, 85%, 94%, 0.95)`;
  const badgeText = `hsl(${hue}, 90%, 30%)`;
  const badgeBorder = `hsla(${hue}, 75%, 80%, 0.8)`;

  // Category Icon lookup
  const categoryIcons: Record<string, React.ElementType> = {
    'calculators': Calculator,
    'image-tools': ImageIcon,
    'text-tools': FileText,
    'color-tools': Palette,
    'developer-utilities': Code,
    'date-time': Clock,
    'converters': RefreshCw,
    'security-utilities': Shield,
    'seo-tools': TrendingUp,
    'file-tools': Folder,
  };

  const Icon = categoryIcons[tool.category] || Code;

  return {
    hue,
    Icon,
    bgLight,
    bgDark,
    accentColor,
    accentColorDark,
    accentGlow,
    borderHover,
    badgeBg,
    badgeText,
    badgeBorder,
  };
};

export const ToolCard = ({ tool }: { tool: ToolDefinition }) => {
  const theme = getToolTheme(tool);

  // Derive tool-specific emoji
  const toolEmoji = TOOL_EMOJIS[tool.id] || (
    tool.title.toLowerCase().includes('calculator') ? '🧮' :
    tool.title.toLowerCase().includes('image') ? '🖼️' :
    tool.title.toLowerCase().includes('text') ? '📝' :
    tool.title.toLowerCase().includes('color') ? '🎨' :
    tool.title.toLowerCase().includes('code') || tool.title.toLowerCase().includes('json') ? '💻' :
    tool.title.toLowerCase().includes('convert') ? '🔄' :
    tool.title.toLowerCase().includes('security') || tool.title.toLowerCase().includes('password') ? '🛡️' : '⚙️'
  );

  return (
    <Link href={`/tools/${tool.category}/${tool.slug}`} className="block h-full group cursor-pointer">
      <motion.div
        whileHover={{ y: -4, transition: { duration: 0.2 } }}
        className="h-full relative flex flex-col justify-between px-4 py-4 sm:p-5 border-y sm:border border-stone-200/90 dark:border-zinc-800/80 rounded-none sm:rounded-2xl shadow-none sm:shadow-xl transition-all duration-300 backdrop-blur-md overflow-hidden group-hover:border-[var(--tool-hover-border)]"
        style={{
          background: theme.bgLight,
          '--tool-hover-border': theme.borderHover,
        } as React.CSSProperties}
      >
        {/* Dark Mode Background Overlay */}
        <div 
          className="absolute inset-0 opacity-0 dark:opacity-100 pointer-events-none transition-opacity duration-300"
          style={{ background: theme.bgDark }}
        />

        {/* Iridescent Top Accent Corner Glow */}
        <div 
          className="absolute top-0 right-0 -mr-8 -mt-8 w-28 h-28 rounded-full blur-2xl pointer-events-none transition-all duration-500 group-hover:scale-125"
          style={{ backgroundColor: theme.accentGlow }}
        />

        {/* Glowing Top Accent Line */}
        <div 
          className="absolute top-0 left-0 right-0 h-[2.5px] opacity-40 group-hover:opacity-100 transition-opacity duration-300 z-10"
          style={{ background: `linear-gradient(90deg, transparent, ${theme.accentColor}, transparent)` }}
        />

        <div className="relative z-10">
          {/* Top Row: Category Badge & Engine Badges */}
          <div className="flex items-center justify-between gap-2 mb-3.5">
            <span 
              className="inline-flex items-center gap-1.5 text-[11px] uppercase tracking-wider font-extrabold px-2.5 py-1 rounded-lg border shadow-2xs"
              style={{
                backgroundColor: theme.badgeBg,
                color: theme.badgeText,
                borderColor: theme.badgeBorder,
              }}
            >
              <theme.Icon size={13} />
              <span>{tool.category.replace('-', ' ')}</span>
            </span>

            <div className="flex items-center gap-1.5">
              {tool.isNew && (
                <span className="inline-flex items-center gap-1 text-[10px] uppercase font-bold text-amber-500 bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded-full">
                  <Star size={10} /> New
                </span>
              )}
              {tool.isAsync && (
                <span className="inline-flex items-center gap-1 text-[10px] uppercase font-semibold text-blue-500 bg-blue-500/10 border border-blue-500/20 px-2 py-0.5 rounded-full">
                  <Cpu size={10} /> VPS Engine
                </span>
              )}
            </div>
          </div>

          {/* Title with Tool Emoji */}
          <div className="flex items-start gap-2.5 mb-2">
            <span className="text-2xl shrink-0 select-none p-1 rounded-lg bg-white/70 dark:bg-zinc-800/70 border border-stone-200/60 dark:border-zinc-700/50 shadow-xs">
              {toolEmoji}
            </span>
            <h3 className="text-base sm:text-lg font-extrabold text-stone-900 dark:text-white transition-colors tracking-tight leading-snug group-hover:text-primary">
              {tool.title}
            </h3>
          </div>

          {/* Description */}
          <p className="text-xs sm:text-sm text-stone-600 dark:text-zinc-300 line-clamp-2 mb-4 leading-relaxed font-light">
            {tool.description}
          </p>
        </div>

        {/* Footer */}
        <div className="relative z-10 flex items-center justify-between pt-3 border-t border-stone-200/70 dark:border-zinc-800/70 text-xs font-semibold text-stone-500 dark:text-zinc-400">
          <div className="flex items-center gap-1.5 flex-wrap">
            {tool.tags.slice(0, 2).map((tag) => (
              <span key={tag} className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-stone-100/90 dark:bg-zinc-800/90 text-stone-700 dark:text-zinc-300 border border-stone-200/70 dark:border-zinc-700/60">
                #{tag}
              </span>
            ))}
          </div>

          <span 
            className="inline-flex items-center gap-1 group-hover:translate-x-1 transition-transform font-bold text-xs"
            style={{ color: theme.accentColor }}
          >
            Open <ArrowRight size={14} />
          </span>
        </div>
      </motion.div>
    </Link>
  );
};
