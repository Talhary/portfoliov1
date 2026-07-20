'use client';

import { useState } from 'react';
import { ToolDefinition } from '@/lib/tools/registry';
import { useToolJob } from '@/hooks/use-tool-job';
import { JobProgressModal } from '@/components/tools/JobProgressModal';
import { FiVolume2, FiMic, FiCopy, FiCheck, FiRefreshCw } from 'react-icons/fi';

export const TextToolModule = ({ tool }: { tool: ToolDefinition }) => {
  const [textVal, setTextVal] = useState<string>('Hello world! Welcome to the developer tools catalog.');
  const [compareVal, setCompareVal] = useState<string>('');
  const [copied, setCopied] = useState<boolean>(false);
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);
  const [isListening, setIsListening] = useState<boolean>(false);

  const { jobState, startJob, resetJob, isProcessing } = useToolJob(tool.id);

  // Compute metrics
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
    } else {
      alert('Text-to-speech is not supported in your browser.');
    }
  };

  const handleSpeechToText = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert('Speech Recognition is not supported in your browser.');
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;

    if (isListening) {
      recognition.stop();
      setIsListening(false);
    } else {
      recognition.start();
      setIsListening(true);

      recognition.onresult = (event: any) => {
        let transcript = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          transcript += event.results[i][0].transcript;
        }
        setTextVal((prev) => prev + ' ' + transcript);
      };

      recognition.onend = () => setIsListening(false);
    }
  };

  const transformCase = (type: 'upper' | 'lower' | 'title' | 'camel' | 'snake') => {
    if (type === 'upper') setTextVal(textVal.toUpperCase());
    if (type === 'lower') setTextVal(textVal.toLowerCase());
    if (type === 'title') {
      setTextVal(
        textVal.replace(/\w\S*/g, (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase())
      );
    }
    if (type === 'camel') {
      setTextVal(
        textVal
          .toLowerCase()
          .replace(/[^a-zA-Z0-9]+(.)/g, (m, chr) => chr.toUpperCase())
      );
    }
    if (type === 'snake') {
      setTextVal(textVal.toLowerCase().replace(/\s+/g, '_'));
    }
  };

  const removeDuplicates = () => {
    const lines = textVal.split('\n');
    const unique = Array.from(new Set(lines));
    setTextVal(unique.join('\n'));
  };

  const reverseText = () => {
    setTextVal(textVal.split('').reverse().join(''));
  };

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
            <button
              onClick={handleSpeechToText}
              className={`inline-flex items-center gap-1 px-3 py-1 text-xs font-bold rounded-lg border transition-all ${
                isListening
                  ? 'bg-rose-500 text-white border-rose-600 animate-pulse'
                  : 'bg-stone-100 dark:bg-zinc-800 text-stone-700 dark:text-zinc-300'
              }`}
            >
              <FiMic size={14} /> {isListening ? 'Listening...' : 'Dictate'}
            </button>
            <button
              onClick={handleTextToSpeech}
              className={`inline-flex items-center gap-1 px-3 py-1 text-xs font-bold rounded-lg border transition-all ${
                isSpeaking
                  ? 'bg-primary text-white border-primary'
                  : 'bg-stone-100 dark:bg-zinc-800 text-stone-700 dark:text-zinc-300'
              }`}
            >
              <FiVolume2 size={14} /> {isSpeaking ? 'Stop Speech' : 'Listen'}
            </button>
            <button
              onClick={() => handleCopy(textVal)}
              className="inline-flex items-center gap-1 px-3 py-1 text-xs font-bold rounded-lg bg-stone-100 dark:bg-zinc-800 text-stone-700 dark:text-zinc-300"
            >
              {copied ? <FiCheck size={14} /> : <FiCopy size={14} />} {copied ? 'Copied' : 'Copy'}
            </button>
          </div>
        </div>

        <textarea
          rows={6}
          value={textVal}
          onChange={(e) => setTextVal(e.target.value)}
          className="w-full p-4 bg-stone-50 dark:bg-zinc-950 border border-stone-200 dark:border-zinc-800 rounded-2xl font-mono text-sm focus:ring-2 focus:ring-primary/50 outline-none"
        />
      </div>

      {/* Action Tool Buttons */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => transformCase('upper')}
          className="px-3 py-1.5 text-xs font-bold bg-stone-200 dark:bg-zinc-800 rounded-lg hover:bg-primary hover:text-white transition-colors"
        >
          UPPERCASE
        </button>
        <button
          onClick={() => transformCase('lower')}
          className="px-3 py-1.5 text-xs font-bold bg-stone-200 dark:bg-zinc-800 rounded-lg hover:bg-primary hover:text-white transition-colors"
        >
          lowercase
        </button>
        <button
          onClick={() => transformCase('title')}
          className="px-3 py-1.5 text-xs font-bold bg-stone-200 dark:bg-zinc-800 rounded-lg hover:bg-primary hover:text-white transition-colors"
        >
          Title Case
        </button>
        <button
          onClick={() => transformCase('camel')}
          className="px-3 py-1.5 text-xs font-bold bg-stone-200 dark:bg-zinc-800 rounded-lg hover:bg-primary hover:text-white transition-colors"
        >
          camelCase
        </button>
        <button
          onClick={() => transformCase('snake')}
          className="px-3 py-1.5 text-xs font-bold bg-stone-200 dark:bg-zinc-800 rounded-lg hover:bg-primary hover:text-white transition-colors"
        >
          snake_case
        </button>
        <button
          onClick={removeDuplicates}
          className="px-3 py-1.5 text-xs font-bold bg-stone-200 dark:bg-zinc-800 rounded-lg hover:bg-primary hover:text-white transition-colors"
        >
          Remove Duplicate Lines
        </button>
        <button
          onClick={reverseText}
          className="px-3 py-1.5 text-xs font-bold bg-stone-200 dark:bg-zinc-800 rounded-lg hover:bg-primary hover:text-white transition-colors"
        >
          Reverse Text
        </button>
      </div>

      {tool.isAsync && (
        <div className="pt-2">
          <button
            onClick={() => startJob({ text: textVal })}
            disabled={isProcessing}
            className="w-full px-6 py-3 bg-primary hover:bg-primary/90 text-white font-bold text-sm rounded-xl shadow-lg transition-all"
          >
            Run Server Grammar & Readability Check
          </button>
        </div>
      )}

      <JobProgressModal jobState={jobState} onReset={resetJob} title={tool.title} />
    </div>
  );
};
