'use client';

import { useState } from 'react';
import { ToolDefinition } from '@/lib/tools/registry';
import { FiRefreshCw, FiVolume2, FiCopy, FiCheck } from 'react-icons/fi';

export const ConverterModule = ({ tool }: { tool: ToolDefinition }) => {
  const [inputVal, setInputVal] = useState<string>('Hello');
  const [copied, setCopied] = useState<boolean>(false);

  const handleCopy = (str: string) => {
    navigator.clipboard.writeText(str);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const textToBinary = (str: string) => {
    return str
      .split('')
      .map((char) => char.charCodeAt(0).toString(2).padStart(8, '0'))
      .join(' ');
  };

  const textToMorse = (str: string) => {
    const MORSE_MAP: Record<string, string> = {
      A: '.-', B: '-...', C: '-.-.', D: '-..', E: '.', F: '..-.', G: '--.', H: '....',
      I: '..', J: '.---', K: '-.-', L: '.-..', M: '--', N: '-.', O: '---', P: '.--.',
      Q: '--.-', R: '.-.', S: '...', T: '-', U: '..-', V: '...-', W: '.--', X: '-..-',
      Y: '-.--', Z: '--..', '1': '.----', '2': '..---', '3': '...--', '4': '....-',
      '5': '.....', '6': '-....', '7': '--...', '8': '---..', '9': '----.', '0': '-----',
      ' ': '/',
    };
    return str
      .toUpperCase()
      .split('')
      .map((c) => MORSE_MAP[c] || c)
      .join(' ');
  };

  const toRoman = (num: number) => {
    const lookup: Record<string, number> = {
      M: 1000, CM: 900, D: 500, CD: 400, C: 100, XC: 90, L: 50, XL: 40, X: 10, IX: 9, V: 5, IV: 4, I: 1
    };
    let roman = '';
    for (let i in lookup) {
      while (num >= lookup[i]) {
        roman += i;
        num -= lookup[i];
      }
    }
    return roman;
  };

  const renderConverterOutput = () => {
    switch (tool.id) {
      case 'binary-converter':
        return textToBinary(inputVal);
      case 'morse-code-converter':
        return textToMorse(inputVal);
      case 'roman-numeral-converter': {
        const n = parseInt(inputVal) || 0;
        return n > 0 && n < 4000 ? toRoman(n) : 'Enter number between 1 and 3999';
      }
      case 'number-base-converter': {
        const dec = parseInt(inputVal, 10) || 0;
        return `Dec: ${dec}\nBin: ${dec.toString(2)}\nHex: 0x${dec.toString(16).toUpperCase()}\nOct: 0o${dec.toString(8)}`;
      }
      case 'json-to-csv': {
        try {
          const parsed = JSON.parse(inputVal);
          if (Array.isArray(parsed) && parsed.length > 0) {
            const headers = Object.keys(parsed[0]);
            const rows = parsed.map((obj: any) => headers.map((h) => obj[h] ?? '').join(','));
            return [headers.join(','), ...rows].join('\n');
          }
          return 'Enter valid JSON array of objects';
        } catch {
          return 'Error parsing JSON';
        }
      }
      case 'csv-to-json': {
        try {
          const lines = inputVal.trim().split('\n');
          if (lines.length < 2) return 'Enter CSV with headers';
          const headers = lines[0].split(',').map((h) => h.trim());
          const jsonArr = lines.slice(1).map((line) => {
            const values = line.split(',').map((v) => v.trim());
            const obj: Record<string, string> = {};
            headers.forEach((h, i) => {
              obj[h] = values[i] || '';
            });
            return obj;
          });
          return JSON.stringify(jsonArr, null, 2);
        } catch {
          return 'Error parsing CSV';
        }
      }
      default:
        return `Converted Output: ${inputVal}`;
    }
  };

  const output = renderConverterOutput();

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <label className="block text-xs font-bold uppercase text-stone-500">Source Payload</label>
        <textarea
          rows={4}
          value={inputVal}
          onChange={(e) => setInputVal(e.target.value)}
          placeholder="Enter content to convert..."
          className="w-full p-4 bg-stone-50 dark:bg-zinc-950 border border-stone-200 dark:border-zinc-800 rounded-2xl font-mono text-sm focus:ring-2 focus:ring-primary/50 outline-none"
        />
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="text-xs font-bold uppercase text-primary">Converted Result</label>
          <button
            onClick={() => handleCopy(output)}
            className="text-xs font-bold text-primary hover:underline flex items-center gap-1"
          >
            {copied ? <FiCheck size={14} /> : <FiCopy size={14} />} {copied ? 'Copied' : 'Copy'}
          </button>
        </div>
        <div className="p-4 bg-stone-50 dark:bg-zinc-950 border border-stone-200 dark:border-zinc-800 rounded-2xl font-mono text-sm text-stone-900 dark:text-zinc-200 whitespace-pre-wrap">
          {output}
        </div>
      </div>
    </div>
  );
};
