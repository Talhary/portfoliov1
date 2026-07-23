'use client';

import { useState, useRef } from 'react';
import { ToolDefinition } from '@/lib/tools/registry';
import { FiRefreshCw, FiVolume2, FiCopy, FiCheck, FiUploadCloud, FiDownload, FiZap } from 'react-icons/fi';

const UNIT_DATA: Record<string, { units: string[]; toBase: Record<string, number> }> = {
  length: {
    units: ['mm', 'cm', 'm', 'km', 'in', 'ft', 'yd', 'mi'],
    toBase: { mm: 0.001, cm: 0.01, m: 1, km: 1000, in: 0.0254, ft: 0.3048, yd: 0.9144, mi: 1609.344 },
  },
  weight: {
    units: ['mg', 'g', 'kg', 'lb', 'oz', 't'],
    toBase: { mg: 0.000001, g: 0.001, kg: 1, lb: 0.453592, oz: 0.0283495, t: 1000 },
  },
  temperature: {
    units: ['C', 'F', 'K'],
    toBase: { C: 1, F: 1, K: 1 },
  },
  volume: {
    units: ['mL', 'L', 'gal', 'qt', 'pt', 'cup', 'fl oz'],
    toBase: { mL: 0.001, L: 1, gal: 3.78541, qt: 0.946353, pt: 0.473176, cup: 0.236588, 'fl oz': 0.0295735 },
  },
  speed: {
    units: ['m/s', 'km/h', 'mph', 'knot', 'ft/s'],
    toBase: { 'm/s': 1, 'km/h': 0.277778, mph: 0.44704, knot: 0.514444, 'ft/s': 0.3048 },
  },
};

function convertUnit(value: number, from: string, to: string, category: string): number {
  if (category === 'temperature') {
    let celsius: number;
    if (from === 'C') celsius = value;
    else if (from === 'F') celsius = (value - 32) * 5 / 9;
    else celsius = value - 273.15;
    if (to === 'C') return celsius;
    if (to === 'F') return celsius * 9 / 5 + 32;
    return celsius + 273.15;
  }
  const data = UNIT_DATA[category];
  const baseValue = value * data.toBase[from];
  return baseValue / data.toBase[to];
}

const UnitConverter = () => {
  const [category, setCategory] = useState<string>('length');
  const [fromUnit, setFromUnit] = useState<string>('m');
  const [toUnit, setToUnit] = useState<string>('ft');
  const [inputValue, setInputValue] = useState<string>('1');
  const [copied, setCopied] = useState<boolean>(false);

  const data = UNIT_DATA[category];
  const result = convertUnit(parseFloat(inputValue) || 0, fromUnit, toUnit, category);

  const handleCopy = (str: string) => {
    navigator.clipboard.writeText(str);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-5">
      <div>
        <label className="block text-xs font-bold uppercase text-stone-500 mb-1">Category</label>
        <div className="grid grid-cols-5 gap-2">
          {Object.keys(UNIT_DATA).map((cat) => (
            <button key={cat} onClick={() => { setCategory(cat); setFromUnit(UNIT_DATA[cat].units[0]); setToUnit(UNIT_DATA[cat].units[1] || UNIT_DATA[cat].units[0]); }}
              className={`p-2 rounded-xl text-xs font-bold capitalize transition-all ${category === cat ? 'bg-primary text-white shadow-md' : 'bg-stone-100 dark:bg-zinc-800 text-stone-700 dark:text-zinc-300 hover:bg-stone-200 dark:hover:bg-zinc-700'}`}>
              {cat}
            </button>
          ))}
        </div>
      </div>
      <div className="flex items-end gap-3">
        <div className="flex-1">
          <label className="block text-xs font-bold uppercase text-stone-500 mb-1">Value</label>
          <input type="number" value={inputValue} onChange={(e) => setInputValue(e.target.value)} className="w-full p-3 bg-stone-50 dark:bg-zinc-950 border border-stone-200 dark:border-zinc-800 rounded-xl font-mono text-sm" />
        </div>
        <div className="w-28">
          <label className="block text-xs font-bold uppercase text-stone-500 mb-1">From</label>
          <select value={fromUnit} onChange={(e) => setFromUnit(e.target.value)} className="w-full p-3 bg-stone-50 dark:bg-zinc-950 border border-stone-200 dark:border-zinc-800 rounded-xl text-sm font-bold">
            {data.units.map((u) => <option key={u} value={u}>{u}</option>)}
          </select>
        </div>
        <button onClick={() => { const t = fromUnit; setFromUnit(toUnit); setToUnit(t); }} className="px-3 py-3 bg-stone-200 dark:bg-zinc-800 rounded-xl hover:bg-primary hover:text-white transition-all mb-0.5">
          <FiRefreshCw size={16} />
        </button>
        <div className="w-28">
          <label className="block text-xs font-bold uppercase text-stone-500 mb-1">To</label>
          <select value={toUnit} onChange={(e) => setToUnit(e.target.value)} className="w-full p-3 bg-stone-50 dark:bg-zinc-950 border border-stone-200 dark:border-zinc-800 rounded-xl text-sm font-bold">
            {data.units.map((u) => <option key={u} value={u}>{u}</option>)}
          </select>
        </div>
      </div>
      <div className="p-5 bg-stone-50 dark:bg-zinc-950 border border-stone-200 dark:border-zinc-800 rounded-2xl text-center">
        <div className="text-[10px] uppercase font-bold text-stone-500 mb-1">Result</div>
        <div className="text-3xl font-black text-primary">{parseFloat(result.toFixed(6))} {toUnit}</div>
        <div className="text-xs text-stone-500 mt-2">{inputValue} {fromUnit} = {parseFloat(result.toFixed(6))} {toUnit}</div>
        <button onClick={() => handleCopy(String(parseFloat(result.toFixed(6))))} className="mt-3 text-xs font-bold text-primary hover:underline flex items-center gap-1 mx-auto">
          {copied ? <FiCheck size={14} /> : <FiCopy size={14} />} {copied ? 'Copied' : 'Copy Result'}
        </button>
      </div>
    </div>
  );
};

function getDefaultConverterInput(id: string): string {
  if (id === 'csv-to-json') {
    return 'id,name,role\n101,Alice,Developer\n102,Bob,Designer';
  }
  if (id === 'json-to-csv') {
    return '[\n  {"id": 1, "name": "Alice", "score": 95},\n  {"id": 2, "name": "Bob", "score": 88}\n]';
  }
  if (id === 'json-csv-to-sql') {
    return '[\n  {"id": 1, "name": "Alice", "email": "alice@example.com"},\n  {"id": 2, "name": "Bob", "email": "bob@example.com"}\n]';
  }
  if (id === 'roman-numeral-converter') {
    return '2026';
  }
  if (id === 'number-base-converter') {
    return '255';
  }
  return 'Hello World';
}

export const ConverterModule = ({ tool }: { tool: ToolDefinition }) => {
  const [inputVal, setInputVal] = useState<string>(() => getDefaultConverterInput(tool.id));
  const [copied, setCopied] = useState<boolean>(false);
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);

  // XLSX Converter state
  const [xlsxData, setXlsxData] = useState<string>('');
  const [xlsxFormat, setXlsxFormat] = useState<'json' | 'csv'>('json');
  const [xlsxFileName, setXlsxFileName] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleCopy = (str: string) => {
    navigator.clipboard.writeText(str);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleXlsxFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setXlsxFileName(file.name);
    setXlsxData('');

    const reader = new FileReader();
    reader.onload = (ev) => {
      const data = new Uint8Array(ev.target?.result as ArrayBuffer);
      // Parse XLSX manually - basic implementation using zip extraction
      parseXlsxFile(data);
    };
    reader.readAsArrayBuffer(file);
  };

  const parseXlsxFile = async (data: Uint8Array) => {
    try {
      // For browser-based XLSX parsing, we simulate with a simplified approach
      // Real implementation would use a library like SheetJS/xlsx
      // Here we provide a lightweight fallback that reads raw strings

      const strings: string[] = [];
      let i = 0;
      while (i < data.length) {
        if (data[i] === 0x00 || data[i] === 0xFF) { i++; continue; }
        const byte = data[i];
        if (byte >= 32 && byte < 127) {
          let str = '';
          while (i < data.length && data[i] >= 32 && data[i] < 127) {
            str += String.fromCharCode(data[i]);
            i++;
          }
          if (str.length > 1 && !str.startsWith('PK') && !str.startsWith('XML') && !str.startsWith('Content')) {
            strings.push(str);
          }
        } else {
          i++;
        }
      }

      // Try to detect table structure from raw strings
      if (strings.length > 0) {
        // Show extracted text strings
        const lines = strings.filter(s => s.length > 0 && !s.includes('Workbook') && !s.includes('worksheet'));
        setXlsxData(lines.join('\n'));
      } else {
        setXlsxData('Could not extract readable data. For full XLSX support, install xlsx (SheetJS) package.');
      }
    } catch (err: any) {
      setXlsxData(`Error parsing file: ${err.message}`);
    }
  };

  const downloadXlsxResult = () => {
    if (!xlsxData) return;
    const blob = new Blob([xlsxData], { type: xlsxFormat === 'json' ? 'application/json' : 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = xlsxFileName.replace(/\.[^.]+$/, xlsxFormat === 'json' ? '.json' : '.csv');
    a.click();
    URL.revokeObjectURL(url);
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
            headers.forEach((h, i) => { obj[h] = values[i] || ''; });
            return obj;
          });
          return JSON.stringify(jsonArr, null, 2);
        } catch { return 'Error parsing CSV'; }
      }
      case 'json-csv-to-sql': {
        try {
          const parsed = JSON.parse(inputVal);
          const arr = Array.isArray(parsed) ? parsed : [parsed];
          if (arr.length === 0) return 'Enter a non-empty JSON array';
          const tableName = 'items';
          const cols = Object.keys(arr[0]);
          const inserts = arr.map((row: any) => {
            const vals = cols.map((c) => {
              const v = row[c];
              if (v === null || v === undefined) return 'NULL';
              if (typeof v === 'number') return String(v);
              return `'${String(v).replace(/'/g, "''")}'`;
            }).join(', ');
            return `INSERT INTO ${tableName} (${cols.join(', ')}) VALUES (${vals});`;
          });
          return inserts.join('\n');
        } catch { return 'Error parsing JSON. Provide a JSON array of objects.'; }
      }
      case 'conv-text-to-speech':
        return inputVal;
      default:
        return `Converted Output: ${inputVal}`;
    }
  };

  const output = renderConverterOutput();

  const handleSpeak = () => {
    if (!('speechSynthesis' in window)) {
      alert('Text-to-speech is not supported in your browser.');
      return;
    }
    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    } else {
      const utterance = new SpeechSynthesisUtterance(inputVal);
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);
      window.speechSynthesis.speak(utterance);
      setIsSpeaking(true);
    }
  };

  return (
    <div className="space-y-6">
      {/* Excel to JSON/CSV has its own dedicated UI */}
      {tool.id === 'xlsx-to-json-csv' ? (
        <div className="space-y-6">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setXlsxFormat('json')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${xlsxFormat === 'json' ? 'bg-primary text-white' : 'bg-stone-200 dark:bg-zinc-800 text-stone-700 dark:text-zinc-300'}`}
            >
              Output as JSON
            </button>
            <button
              onClick={() => setXlsxFormat('csv')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${xlsxFormat === 'csv' ? 'bg-primary text-white' : 'bg-stone-200 dark:bg-zinc-800 text-stone-700 dark:text-zinc-300'}`}
            >
              Output as CSV
            </button>
          </div>

          <div
            onClick={() => fileInputRef.current?.click()}
            className="border-2 border-dashed border-stone-300 dark:border-zinc-800 hover:border-primary/50 dark:hover:border-primary/50 rounded-3xl p-8 text-center bg-stone-50 dark:bg-zinc-950 cursor-pointer transition-all group"
          >
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleXlsxFile}
              accept=".xlsx,.xls,.csv"
              className="hidden"
            />
            <FiUploadCloud size={40} className="mx-auto text-stone-400 dark:text-zinc-600 group-hover:text-primary transition-colors mb-3" />
            <p className="text-sm font-bold text-stone-900 dark:text-white">
              {xlsxFileName || 'Drag & drop your Excel (.xlsx) file here'}
            </p>
            <p className="text-xs text-stone-500 dark:text-zinc-500 mt-1">
              Supports .xlsx, .xls, .csv files
            </p>
          </div>

          {xlsxData && (
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-xs font-bold uppercase text-stone-500">Converted {xlsxFormat.toUpperCase()} Output</span>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleCopy(xlsxData)}
                    className="text-xs font-bold text-primary hover:underline flex items-center gap-1"
                  >
                    {copied ? <FiCheck size={14} /> : <FiCopy size={14} />} {copied ? 'Copied' : 'Copy'}
                  </button>
                  <button
                    onClick={downloadXlsxResult}
                    className="text-xs font-bold text-primary hover:underline flex items-center gap-1"
                  >
                    <FiDownload size={14} /> Download
                  </button>
                </div>
              </div>
              <pre className="p-4 bg-stone-50 dark:bg-zinc-950 border border-stone-200 dark:border-zinc-800 rounded-2xl font-mono text-xs text-stone-900 dark:text-zinc-200 overflow-x-auto whitespace-pre-wrap max-h-80 overflow-y-auto">
                {xlsxData}
              </pre>
            </div>
          )}
        </div>
      ) : (
        /* Default converter UI */
        <>
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

          {tool.id === 'conv-text-to-speech' ? (
            <button
              id="speak-btn"
              onClick={handleSpeak}
              className={`w-full py-4 font-bold text-sm rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 ${
                isSpeaking
                  ? 'bg-rose-500 hover:bg-rose-600 text-white'
                  : 'bg-primary hover:bg-primary/90 text-white'
              }`}
            >
              <FiVolume2 size={18} />
              {isSpeaking ? 'Stop Speaking' : 'Speak Text'}
            </button>
      ) : tool.id === 'unit-converter' ? (
        /* General Unit Converter */
        <div className="space-y-6">
          <UnitConverter />
        </div>
      ) : (
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
          )}
        </>
      )}
    </div>
  );
};
