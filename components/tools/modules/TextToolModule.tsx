'use client';

import { useState, useEffect } from 'react';
import { ToolDefinition } from '@/lib/tools/registry';
import { useToolJob } from '@/hooks/use-tool-job';
import { JobProgressModal } from '@/components/tools/JobProgressModal';
import { FiVolume2, FiMic, FiCopy, FiCheck, FiRefreshCw } from 'react-icons/fi';

const LOREM_WORDS = 'lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor incididunt ut labore et dolore magna aliqua ut enim ad minim veniam quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur excepteur sint occaecat cupidatat non proident sunt in culpa qui officia deserunt mollit anim id est laborum sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium totam rem aperiam eaque ipsa quae ab illo inventore veritatis quasi architecto beatae vitae dicta sunt explicabo nemo ipsam quia voluptas aspernatur aut odit aut fugit consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt neque porro quisquam dolorem adipisci numquam eius modi tempora corporis suscipit laboriosam nisi aliquid commodi consequatur quidem rerum facilis distinctio nam libero tempore cum soluta nobis eligendi optio cumque nihil impedit quo minus maxime placeat facere possimus omnis assumenda repudiandae repellat';

function generateLoremParagraph(wordCount: number): string {
  const words = LOREM_WORDS.split(' ');
  const result: string[] = [];
  for (let i = 0; i < wordCount; i++) {
    result.push(words[Math.floor(Math.random() * words.length)]);
  }
  result[0] = result[0].charAt(0).toUpperCase() + result[0].slice(1);
  return result.join(' ') + '.';
}

const GOOGLE_FONTS = [
  'Inter', 'Roboto', 'Open Sans', 'Lato', 'Montserrat', 'Poppins', 'Playfair Display',
  'Merriweather', 'Source Sans 3', 'Raleway', 'Nunito', 'Work Sans', 'PT Serif',
  'Ubuntu', 'Crimson Text', 'DM Sans', 'Space Grotesk', 'Outfit', 'Plus Jakarta Sans',
  'Manrope', 'Sora', 'Josefin Sans', 'Libre Baskerville', 'Bitter', 'Cormorant Garamond',
  'Archivo', 'Rubik', 'Karla', 'Fira Sans', 'Inconsolata', 'IBM Plex Mono',
  'DM Serif Display', 'Fraunces', 'Bebas Neue', 'Oswald', 'Quicksand', 'Vollkorn',
  'Cabin', 'Barlow', 'Muli', 'Noto Sans', 'Roboto Slab', 'Abril Fatface',
  'Antic Slab', 'Arvo', 'Asap', 'Athiti', 'Boogaloo', 'Bree Serif', 'Concert One',
];

export const TextToolModule = ({ tool }: { tool: { id: string; title: string; isAsync: boolean } }) => {
  const [textVal, setTextVal] = useState<string>('Hello world! Welcome to the developer tools catalog.');
  const [copied, setCopied] = useState<boolean>(false);
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);
  const [isListening, setIsListening] = useState<boolean>(false);

  // Lorem Ipsum state
  const [loremParagraphs, setLoremParagraphs] = useState<number>(3);
  const [loremWordsPer, setLoremWordsPer] = useState<number>(50);
  const [loremIncludeHtml, setLoremIncludeHtml] = useState<boolean>(false);
  const [loremOutput, setLoremOutput] = useState<string>('');

  // Font Pairing state
  const [fontHeader, setFontHeader] = useState<string>('Playfair Display');
  const [fontBody, setFontBody] = useState<string>('Inter');
  const [loadedFonts, setLoadedFonts] = useState<Set<string>>(new Set());

  // Diff Checker state
  const [diffLeft, setDiffLeft] = useState<string>('function greet(name) {\n  console.log("Hello, " + name);\n}\n\ngreet("World");');
  const [diffRight, setDiffRight] = useState<string>('function greet(name, age) {\n  console.log(`Hello, ${name}! You are ${age}.`);\n}\n\ngreet("World", 25);');
  const [diffResult, setDiffResult] = useState<{ type: 'equal' | 'add' | 'remove'; text: string }[]>([]);

  const { jobState, startJob, resetJob, isProcessing } = useToolJob(tool.id);

  const words = textVal.trim() ? textVal.trim().split(/\s+/).length : 0;
  const chars = textVal.length;
  const sentences = textVal.split(/[.!?]+/).filter(Boolean).length;
  const paragraphs = textVal.split(/\n+/).filter(Boolean).length;
  const readingTimeMinutes = Math.ceil(words / 200);

  const handleCopy = (str: string) => {
    navigator.clipboard.writeText(str);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleTextToSpeech = () => {
    if ('speechSynthesis' in window) {
      if (isSpeaking) {
        window.speechSynthesis.cancel();
        setIsSpeaking(false);
      } else {
        const utterance = new SpeechSynthesisUtterance(textVal);
        utterance.onend = () => setIsSpeaking(false);
        window.speechSynthesis.speak(utterance);
        setIsSpeaking(true);
      }
    }
  };

  const handleSpeechToText = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) { alert('Speech Recognition not supported.'); return; }
    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    if (isListening) { recognition.stop(); setIsListening(false); }
    else {
      recognition.start(); setIsListening(true);
      recognition.onresult = (event: any) => {
        let transcript = '';
        for (let i = event.resultIndex; i < event.results.length; i++) transcript += event.results[i][0].transcript;
        setTextVal((prev) => prev + ' ' + transcript);
      };
      recognition.onend = () => setIsListening(false);
    }
  };

  const transformCase = (type: 'upper' | 'lower' | 'title' | 'camel' | 'snake') => {
    if (type === 'upper') setTextVal(textVal.toUpperCase());
    if (type === 'lower') setTextVal(textVal.toLowerCase());
    if (type === 'title') setTextVal(textVal.replace(/\w\S*/g, (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()));
    if (type === 'camel') setTextVal(textVal.toLowerCase().replace(/[^a-zA-Z0-9]+(.)/g, (m, chr) => chr.toUpperCase()));
    if (type === 'snake') setTextVal(textVal.toLowerCase().replace(/\s+/g, '_'));
  };

  const removeDuplicates = () => { setTextVal(Array.from(new Set(textVal.split('\n'))).join('\n')); };
  const reverseText = () => { setTextVal(textVal.split('').reverse().join('')); };

  // Font loading helper
  function loadFont(fontName: string) {
    if (loadedFonts.has(fontName)) return;
    const link = document.createElement('link');
    link.href = `https://fonts.googleapis.com/css2?family=${fontName.replace(/ /g, '+')}:wght@400;700&display=swap`;
    link.rel = 'stylesheet';
    document.head.appendChild(link);
    setLoadedFonts((prev) => new Set([...prev, fontName]));
  }

  useEffect(() => { loadFont(fontHeader); loadFont(fontBody); }, [fontHeader, fontBody]);

  // Simple line diff
  function computeDiff() {
    const leftLines = diffLeft.split('\n');
    const rightLines = diffRight.split('\n');
    const maxLen = Math.max(leftLines.length, rightLines.length);
    const result: { type: 'equal' | 'add' | 'remove'; text: string }[] = [];
    for (let i = 0; i < maxLen; i++) {
      const l = leftLines[i];
      const r = rightLines[i];
      if (l === r) {
        result.push({ type: 'equal', text: l });
      } else {
        if (l !== undefined) result.push({ type: 'remove', text: l });
        if (r !== undefined) result.push({ type: 'add', text: r });
      }
    }
    setDiffResult(result);
  }

  // --- LOREM IPSUM ---
  if (tool.id === 'lorem-ipsum') {
    return (
      <div className="space-y-5">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div>
            <label className="block text-xs font-bold uppercase text-stone-500 mb-1">Paragraphs</label>
            <input type="number" min={1} max={20} value={loremParagraphs} onChange={(e) => setLoremParagraphs(Number(e.target.value))} className="w-full p-3 bg-stone-50 dark:bg-zinc-950 border border-stone-200 dark:border-zinc-800 rounded-xl text-sm font-bold" />
          </div>
          <div>
            <label className="block text-xs font-bold uppercase text-stone-500 mb-1">Words / Paragraph</label>
            <input type="number" min={10} max={200} value={loremWordsPer} onChange={(e) => setLoremWordsPer(Number(e.target.value))} className="w-full p-3 bg-stone-50 dark:bg-zinc-950 border border-stone-200 dark:border-zinc-800 rounded-xl text-sm font-bold" />
          </div>
          <div className="flex items-end pb-1">
            <label className="flex items-center gap-2 text-xs font-bold text-stone-500 cursor-pointer">
              <input type="checkbox" checked={loremIncludeHtml} onChange={(e) => setLoremIncludeHtml(e.target.checked)} className="accent-primary" />
              Wrap in &lt;p&gt; tags
            </label>
          </div>
        </div>
        <button
          onClick={() => {
            const ps = Array.from({ length: loremParagraphs }, () => generateLoremParagraph(loremWordsPer));
            setLoremOutput(loremIncludeHtml ? ps.map((p) => `<p>${p}</p>`).join('\n\n') : ps.join('\n\n'));
          }}
          className="px-6 py-3 bg-primary hover:bg-primary/90 text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-lg transition-all flex items-center gap-2"
        >
          <FiRefreshCw size={14} /> Generate Lorem Ipsum
        </button>
        {loremOutput && (
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-xs font-bold uppercase text-stone-500">Generated Text</span>
              <button onClick={() => handleCopy(loremOutput)} className="text-xs font-bold text-primary hover:underline flex items-center gap-1">
                {copied ? <FiCheck size={14} /> : <FiCopy size={14} />} {copied ? 'Copied' : 'Copy'}
              </button>
            </div>
            <pre className="p-4 bg-stone-50 dark:bg-zinc-950 border border-stone-200 dark:border-zinc-800 rounded-2xl font-mono text-xs text-stone-900 dark:text-zinc-200 whitespace-pre-wrap overflow-x-auto max-h-80 overflow-y-auto">
              {loremOutput}
            </pre>
          </div>
        )}
      </div>
    );
  }

  // --- FONT PAIRING TESTER ---
  if (tool.id === 'font-pairing-tester') {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold uppercase text-stone-500 mb-1">Header Font</label>
            <select value={fontHeader} onChange={(e) => setFontHeader(e.target.value)} className="w-full p-3 bg-stone-50 dark:bg-zinc-950 border border-stone-200 dark:border-zinc-800 rounded-xl text-sm font-bold">
              {GOOGLE_FONTS.map((f) => <option key={f} value={f}>{f}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs font-bold uppercase text-stone-500 mb-1">Body Font</label>
            <select value={fontBody} onChange={(e) => setFontBody(e.target.value)} className="w-full p-3 bg-stone-50 dark:bg-zinc-950 border border-stone-200 dark:border-zinc-800 rounded-xl text-sm font-bold">
              {GOOGLE_FONTS.map((f) => <option key={f} value={f}>{f}</option>)}
            </select>
          </div>
        </div>

        <div className="p-6 bg-white dark:bg-zinc-900 rounded-2xl border border-stone-200 dark:border-zinc-800 space-y-4">
          <h2 style={{ fontFamily: fontHeader }} className="text-3xl font-bold text-stone-900 dark:text-white">
            The Quick Brown Fox Jumps Over
          </h2>
          <p style={{ fontFamily: fontBody }} className="text-base text-stone-600 dark:text-zinc-400 leading-relaxed">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
          </p>
          <p style={{ fontFamily: fontBody }} className="text-sm text-stone-500 dark:text-zinc-500 leading-relaxed">
            Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
          </p>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-xs font-bold uppercase text-stone-500">CSS Import</span>
            <button onClick={() => handleCopy(`@import url('https://fonts.googleapis.com/css2?family=${fontHeader.replace(/ /g, '+')}:wght@400;700&family=${fontBody.replace(/ /g, '+')}:wght@400;700&display=swap');\n\nh1, h2, h3 { font-family: '${fontHeader}', serif; }\nbody, p { font-family: '${fontBody}', sans-serif; }`)} className="text-xs font-bold text-primary hover:underline flex items-center gap-1">
              {copied ? <FiCheck size={14} /> : <FiCopy size={14} />} {copied ? 'Copied' : 'Copy CSS'}
            </button>
          </div>
          <pre className="p-4 bg-stone-900 text-emerald-400 border border-stone-200 dark:border-zinc-800 rounded-2xl font-mono text-xs overflow-x-auto whitespace-pre-wrap">
            {`@import url('https://fonts.googleapis.com/css2?family=${fontHeader.replace(/ /g, '+')}:wght@400;700&family=${fontBody.replace(/ /g, '+')}:wght@400;700&display=swap');\n\nh1, h2, h3 { font-family: '${fontHeader}', serif; }\nbody, p { font-family: '${fontBody}', sans-serif; }`}
          </pre>
        </div>
      </div>
    );
  }

  // --- CODE DIFF CHECKER ---
  if (tool.id === 'code-diff-checker') {
    return (
      <div className="space-y-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold uppercase text-stone-500 mb-1">Original (Left)</label>
            <textarea rows={12} value={diffLeft} onChange={(e) => setDiffLeft(e.target.value)} className="w-full p-4 bg-stone-50 dark:bg-zinc-950 border border-stone-200 dark:border-zinc-800 rounded-2xl font-mono text-sm focus:ring-2 focus:ring-primary/50 outline-none resize-none" />
          </div>
          <div>
            <label className="block text-xs font-bold uppercase text-stone-500 mb-1">Modified (Right)</label>
            <textarea rows={12} value={diffRight} onChange={(e) => setDiffRight(e.target.value)} className="w-full p-4 bg-stone-50 dark:bg-zinc-950 border border-stone-200 dark:border-zinc-800 rounded-2xl font-mono text-sm focus:ring-2 focus:ring-primary/50 outline-none resize-none" />
          </div>
        </div>
        <button onClick={computeDiff} className="px-6 py-3 bg-primary hover:bg-primary/90 text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-lg transition-all flex items-center gap-2">
          <FiRefreshCw size={14} /> Compare Differences
        </button>
        {diffResult.length > 0 && (
          <div className="space-y-2">
            <div className="flex items-center gap-4 text-xs font-bold">
              <span className="text-stone-500">{diffResult.filter((d) => d.type === 'equal').length} unchanged</span>
              <span className="text-emerald-600 dark:text-emerald-400">{diffResult.filter((d) => d.type === 'add').length} additions</span>
              <span className="text-rose-600 dark:text-rose-400">{diffResult.filter((d) => d.type === 'remove').length} removals</span>
            </div>
            <pre className="p-4 bg-stone-50 dark:bg-zinc-950 border border-stone-200 dark:border-zinc-800 rounded-2xl font-mono text-xs overflow-x-auto max-h-80 overflow-y-auto">
              {diffResult.map((line, i) => (
                <div key={i} className={`px-2 py-0.5 ${
                  line.type === 'add' ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-800 dark:text-emerald-300' :
                  line.type === 'remove' ? 'bg-rose-100 dark:bg-rose-900/30 text-rose-800 dark:text-rose-300' :
                  'text-stone-600 dark:text-zinc-400'
                }`}>
                  <span className="inline-block w-4 text-stone-400 select-none">{line.type === 'add' ? '+' : line.type === 'remove' ? '-' : ' '}</span>
                  {line.text}
                </div>
              ))}
            </pre>
          </div>
        )}
      </div>
    );
  }

  // --- DEFAULT TEXT TOOLS (word counter, case converter, etc.) ---
  return (
    <div className="space-y-6">
      {/* Metrics Dashboard */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        <div className="p-3 bg-stone-50 dark:bg-zinc-950 border border-stone-200 dark:border-zinc-800 rounded-xl text-center">
          <div className="text-[11px] font-bold uppercase text-stone-500">Words</div>
          <div className="text-xl font-black text-primary">{words}</div>
        </div>
        <div className="p-3 bg-stone-50 dark:bg-zinc-950 border border-stone-200 dark:border-zinc-800 rounded-xl text-center">
          <div className="text-[11px] font-bold uppercase text-stone-500">Chars</div>
          <div className="text-xl font-black text-stone-900 dark:text-white">{chars}</div>
        </div>
        <div className="p-3 bg-stone-50 dark:bg-zinc-950 border border-stone-200 dark:border-zinc-800 rounded-xl text-center">
          <div className="text-[11px] font-bold uppercase text-stone-500">Sentences</div>
          <div className="text-xl font-black text-stone-900 dark:text-white">{sentences}</div>
        </div>
        <div className="p-3 bg-stone-50 dark:bg-zinc-950 border border-stone-200 dark:border-zinc-800 rounded-xl text-center">
          <div className="text-[11px] font-bold uppercase text-stone-500">Paragraphs</div>
          <div className="text-xl font-black text-stone-900 dark:text-white">{paragraphs}</div>
        </div>
        <div className="p-3 bg-stone-50 dark:bg-zinc-950 border border-stone-200 dark:border-zinc-800 rounded-xl text-center col-span-2 sm:col-span-1">
          <div className="text-[11px] font-bold uppercase text-stone-500">Read Time</div>
          <div className="text-xl font-black text-emerald-500">{readingTimeMinutes} min</div>
        </div>
      </div>

      {/* Main Text Input Area */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="text-xs font-bold uppercase text-stone-500">Content Buffer</label>
          <div className="flex items-center gap-2">
            <button onClick={handleSpeechToText} className={`inline-flex items-center gap-1 px-3 py-1 text-xs font-bold rounded-lg border transition-all ${isListening ? 'bg-rose-500 text-white border-rose-600 animate-pulse' : 'bg-stone-100 dark:bg-zinc-800 text-stone-700 dark:text-zinc-300'}`}>
              <FiMic size={14} /> {isListening ? 'Listening...' : 'Dictate'}
            </button>
            <button onClick={handleTextToSpeech} className={`inline-flex items-center gap-1 px-3 py-1 text-xs font-bold rounded-lg border transition-all ${isSpeaking ? 'bg-primary text-white border-primary' : 'bg-stone-100 dark:bg-zinc-800 text-stone-700 dark:text-zinc-300'}`}>
              <FiVolume2 size={14} /> {isSpeaking ? 'Stop Speech' : 'Listen'}
            </button>
            <button onClick={() => handleCopy(textVal)} className="inline-flex items-center gap-1 px-3 py-1 text-xs font-bold rounded-lg bg-stone-100 dark:bg-zinc-800 text-stone-700 dark:text-zinc-300">
              {copied ? <FiCheck size={14} /> : <FiCopy size={14} />} {copied ? 'Copied' : 'Copy'}
            </button>
          </div>
        </div>
        <textarea rows={6} value={textVal} onChange={(e) => setTextVal(e.target.value)} className="w-full p-4 bg-stone-50 dark:bg-zinc-950 border border-stone-200 dark:border-zinc-800 rounded-2xl font-mono text-sm focus:ring-2 focus:ring-primary/50 outline-none" />
      </div>

      {/* Action Tool Buttons */}
      <div className="flex flex-wrap gap-2">
        <button onClick={() => transformCase('upper')} className="px-3 py-1.5 text-xs font-bold bg-stone-200 dark:bg-zinc-800 rounded-lg hover:bg-primary hover:text-white transition-colors">UPPERCASE</button>
        <button onClick={() => transformCase('lower')} className="px-3 py-1.5 text-xs font-bold bg-stone-200 dark:bg-zinc-800 rounded-lg hover:bg-primary hover:text-white transition-colors">lowercase</button>
        <button onClick={() => transformCase('title')} className="px-3 py-1.5 text-xs font-bold bg-stone-200 dark:bg-zinc-800 rounded-lg hover:bg-primary hover:text-white transition-colors">Title Case</button>
        <button onClick={() => transformCase('camel')} className="px-3 py-1.5 text-xs font-bold bg-stone-200 dark:bg-zinc-800 rounded-lg hover:bg-primary hover:text-white transition-colors">camelCase</button>
        <button onClick={() => transformCase('snake')} className="px-3 py-1.5 text-xs font-bold bg-stone-200 dark:bg-zinc-800 rounded-lg hover:bg-primary hover:text-white transition-colors">snake_case</button>
        <button onClick={removeDuplicates} className="px-3 py-1.5 text-xs font-bold bg-stone-200 dark:bg-zinc-800 rounded-lg hover:bg-primary hover:text-white transition-colors">Remove Duplicate Lines</button>
        <button onClick={reverseText} className="px-3 py-1.5 text-xs font-bold bg-stone-200 dark:bg-zinc-800 rounded-lg hover:bg-primary hover:text-white transition-colors">Reverse Text</button>
      </div>

      {tool.id === 'text-to-speech' && (
        <div className="pt-2">
          <button onClick={handleTextToSpeech} className={`w-full px-6 py-4 font-bold text-sm rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 ${isSpeaking ? 'bg-rose-500 hover:bg-rose-600 text-white' : 'bg-primary hover:bg-primary/90 text-white'}`}>
            <FiVolume2 size={18} /> {isSpeaking ? 'Stop Speaking' : 'Speak Text'}
          </button>
        </div>
      )}

      {tool.isAsync && (
        <div className="pt-2">
          <button onClick={() => startJob({ text: textVal })} disabled={isProcessing} className="w-full px-6 py-3 bg-primary hover:bg-primary/90 text-white font-bold text-sm rounded-xl shadow-lg transition-all">
            Run Server Grammar & Readability Check
          </button>
        </div>
      )}

      <JobProgressModal jobState={jobState} onReset={resetJob} title={tool.title} />
    </div>
  );
};
