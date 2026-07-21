'use client';

import { useState, useEffect } from 'react';
import { ToolDefinition } from '@/lib/tools/registry';
import { FiCopy, FiCheck, FiZap, FiCpu, FiDatabase, FiRefreshCw } from 'react-icons/fi';

function estimateTokens(text: string, model: string): { tokens: number; chars: number; words: number; cost: number } {
  const chars = text.length;
  const words = text.trim() ? text.trim().split(/\s+/).length : 0;

  let tokensPerWord: number;
  let costPer1k: number;

  switch (model) {
    case 'gpt-4o':
      tokensPerWord = 1.3;
      costPer1k = 0.0025;
      break;
    case 'gpt-4o-mini':
      tokensPerWord = 1.3;
      costPer1k = 0.00015;
      break;
    case 'claude-3.5-sonnet':
      tokensPerWord = 1.35;
      costPer1k = 0.003;
      break;
    case 'gpt-3.5-turbo':
      tokensPerWord = 1.33;
      costPer1k = 0.0005;
      break;
    default:
      tokensPerWord = 1.3;
      costPer1k = 0.002;
  }

  const tokens = Math.ceil(words * tokensPerWord + chars * 0.1);
  const cost = (tokens / 1000) * costPer1k;

  return { tokens, chars, words, cost };
}

function generateEmbeddings(text: string, dimensions: number): number[] {
  const vector: number[] = [];
  const seed = text.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0);

  for (let i = 0; i < dimensions; i++) {
    const pseudoRand = Math.sin(seed * (i + 1) * 0.1) * 10000;
    vector.push(parseFloat((pseudoRand - Math.floor(pseudoRand) - 0.5).toFixed(6)));
  }

  const magnitude = Math.sqrt(vector.reduce((sum, v) => sum + v * v, 0));
  return vector.map(v => parseFloat((v / magnitude).toFixed(6)));
}

export const AiLlmModule = ({ tool }: { tool: ToolDefinition }) => {
  const [inputText, setInputText] = useState<string>('You are a helpful coding assistant that writes clean, well-documented code in TypeScript. Always follow best practices and explain your reasoning.');
  const [copied, setCopied] = useState<string | null>(null);

  // Token counter state
  const [tokenModel, setTokenModel] = useState<string>('gpt-4o');

  // System prompt builder state
  const [promptRole, setPromptRole] = useState<string>('Senior Software Engineer');
  const [promptConstraints, setPromptConstraints] = useState<string>('- Keep responses under 500 words\n- Use TypeScript only\n- Never use console.log in production code');
  const [promptTone, setPromptTone] = useState<string>('Professional, concise, and helpful');
  const [promptOutputFormat, setPromptOutputFormat] = useState<string>('Provide code blocks with language tags, followed by brief explanations.');
  const [builtPrompt, setBuiltPrompt] = useState<string>('');

  // Embeddings state
  const [embeddingDimensions, setEmbeddingDimensions] = useState<number>(8);
  const [embeddings, setEmbeddings] = useState<number[]>([]);

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopied(key);
    setTimeout(() => setCopied(null), 2000);
  };

  // Token counter logic
  const tokenResult = estimateTokens(inputText, tokenModel);

  // Build system prompt
  const compilePrompt = () => {
    let prompt = `# Role\nYou are ${promptRole}.\n\n`;
    prompt += `# Constraints\n${promptConstraints}\n\n`;
    prompt += `# Tone\n${promptTone}\n\n`;
    prompt += `# Output Format\n${promptOutputFormat}`;
    setBuiltPrompt(prompt);
  };

  useEffect(() => {
    if (tool.id === 'system-prompt-builder') {
      compilePrompt();
    }
    if (tool.id === 'text-to-embeddings') {
      setEmbeddings(generateEmbeddings(inputText, embeddingDimensions));
    }
  }, [tool.id, promptRole, promptConstraints, promptTone, promptOutputFormat, inputText, embeddingDimensions]);

  const getEmbeddings = () => {
    setEmbeddings(generateEmbeddings(inputText, embeddingDimensions));
  };

  return (
    <div className="space-y-6">
      {/* 1. LLM Token Counter */}
      {tool.id === 'llm-token-counter' && (
        <div className="space-y-6">
          <div>
            <label className="block text-xs font-bold uppercase text-stone-500 mb-1">Select Model</label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {[
                { id: 'gpt-4o', label: 'GPT-4o', cost: '$2.50/1M' },
                { id: 'gpt-4o-mini', label: 'GPT-4o Mini', cost: '$0.15/1M' },
                { id: 'claude-3.5-sonnet', label: 'Claude 3.5', cost: '$3.00/1M' },
                { id: 'gpt-3.5-turbo', label: 'GPT-3.5 Turbo', cost: '$0.50/1M' },
              ].map((m) => (
                <button
                  key={m.id}
                  onClick={() => setTokenModel(m.id)}
                  className={`p-3 rounded-xl text-left text-xs font-bold border transition-all ${
                    tokenModel === m.id
                      ? 'bg-primary text-white border-primary shadow-md'
                      : 'bg-stone-50 dark:bg-zinc-950 border-stone-200 dark:border-zinc-800 text-stone-700 dark:text-zinc-300'
                  }`}
                >
                  <div>{m.label}</div>
                  <div className={`text-[10px] mt-0.5 ${tokenModel === m.id ? 'text-white/80' : 'text-stone-500'}`}>{m.cost}</div>
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase text-stone-500 mb-1">Input Text</label>
            <textarea
              rows={6}
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Paste your prompt, system message, or text to count tokens for..."
              className="w-full p-4 bg-stone-50 dark:bg-zinc-950 border border-stone-200 dark:border-zinc-800 rounded-2xl font-mono text-sm focus:ring-2 focus:ring-primary/50 outline-none resize-none"
            />
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-4 bg-stone-50 dark:bg-zinc-950 border border-stone-200 dark:border-zinc-800 rounded-xl text-center">
              <span className="text-[10px] uppercase font-bold text-stone-500">Tokens</span>
              <div className="text-2xl font-black text-primary mt-1">{tokenResult.tokens.toLocaleString()}</div>
            </div>
            <div className="p-4 bg-stone-50 dark:bg-zinc-950 border border-stone-200 dark:border-zinc-800 rounded-xl text-center">
              <span className="text-[10px] uppercase font-bold text-stone-500">Characters</span>
              <div className="text-2xl font-black text-stone-900 dark:text-white mt-1">{tokenResult.chars.toLocaleString()}</div>
            </div>
            <div className="p-4 bg-stone-50 dark:bg-zinc-950 border border-stone-200 dark:border-zinc-800 rounded-xl text-center">
              <span className="text-[10px] uppercase font-bold text-stone-500">Words</span>
              <div className="text-2xl font-black text-stone-900 dark:text-white mt-1">{tokenResult.words.toLocaleString()}</div>
            </div>
            <div className="p-4 bg-stone-50 dark:bg-zinc-950 border border-stone-200 dark:border-zinc-800 rounded-xl text-center">
              <span className="text-[10px] uppercase font-bold text-stone-500">Est. Cost (1K)</span>
              <div className="text-2xl font-black text-emerald-500 mt-1">${tokenResult.cost.toFixed(4)}</div>
            </div>
          </div>
        </div>
      )}

      {/* 2. System Prompt Builder */}
      {tool.id === 'system-prompt-builder' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase text-stone-500 mb-1">Role</label>
              <input
                type="text"
                value={promptRole}
                onChange={(e) => setPromptRole(e.target.value)}
                placeholder="e.g. Senior Software Engineer"
                className="w-full p-3.5 bg-stone-50 dark:bg-zinc-950 border border-stone-200 dark:border-zinc-800 rounded-xl text-sm font-bold"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase text-stone-500 mb-1">Tone</label>
              <input
                type="text"
                value={promptTone}
                onChange={(e) => setPromptTone(e.target.value)}
                placeholder="e.g. Professional, concise, helpful"
                className="w-full p-3.5 bg-stone-50 dark:bg-zinc-950 border border-stone-200 dark:border-zinc-800 rounded-xl text-sm font-bold"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase text-stone-500 mb-1">Constraints (one per line)</label>
            <textarea
              rows={4}
              value={promptConstraints}
              onChange={(e) => setPromptConstraints(e.target.value)}
              placeholder="- Keep responses under 500 words&#10;- Use TypeScript only&#10;- Never use console.log"
              className="w-full p-4 bg-stone-50 dark:bg-zinc-950 border border-stone-200 dark:border-zinc-800 rounded-2xl font-mono text-sm focus:ring-2 focus:ring-primary/50 outline-none resize-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase text-stone-500 mb-1">Output Format</label>
            <textarea
              rows={3}
              value={promptOutputFormat}
              onChange={(e) => setPromptOutputFormat(e.target.value)}
              placeholder="e.g. Provide code blocks with language tags, followed by brief explanations."
              className="w-full p-4 bg-stone-50 dark:bg-zinc-950 border border-stone-200 dark:border-zinc-800 rounded-2xl font-mono text-sm focus:ring-2 focus:ring-primary/50 outline-none resize-none"
            />
          </div>

          <button
            onClick={compilePrompt}
            className="w-full py-3.5 bg-primary hover:bg-primary/90 text-white font-bold text-sm rounded-xl shadow-lg transition-all flex items-center justify-center gap-2"
          >
            <FiZap size={16} /> Compile System Prompt
          </button>

          {builtPrompt && (
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-xs font-bold uppercase text-stone-500">Generated System Prompt</span>
                <button
                  onClick={() => handleCopy(builtPrompt, 'prompt')}
                  className="text-xs font-bold text-primary hover:underline flex items-center gap-1"
                >
                  {copied === 'prompt' ? <FiCheck size={14} /> : <FiCopy size={14} />}
                  {copied === 'prompt' ? 'Copied' : 'Copy Prompt'}
                </button>
              </div>
              <pre className="p-4 bg-stone-50 dark:bg-zinc-950 border border-stone-200 dark:border-zinc-800 rounded-2xl font-mono text-xs text-stone-900 dark:text-zinc-200 whitespace-pre-wrap overflow-x-auto max-h-80 overflow-y-auto">
                {builtPrompt}
              </pre>
            </div>
          )}
        </div>
      )}

      {/* 3. Text to Embeddings */}
      {tool.id === 'text-to-embeddings' && (
        <div className="space-y-6">
          <div>
            <label className="block text-xs font-bold uppercase text-stone-500 mb-1">Input Text</label>
            <textarea
              rows={4}
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Enter text to convert into an embedding vector..."
              className="w-full p-4 bg-stone-50 dark:bg-zinc-950 border border-stone-200 dark:border-zinc-800 rounded-2xl font-mono text-sm focus:ring-2 focus:ring-primary/50 outline-none resize-none"
            />
          </div>

          <div className="flex items-end gap-4">
            <div className="flex-1">
              <label className="block text-xs font-bold uppercase text-stone-500 mb-1">
                Vector Dimensions: {embeddingDimensions}
              </label>
              <input
                type="range"
                min={4}
                max={32}
                value={embeddingDimensions}
                onChange={(e) => setEmbeddingDimensions(Number(e.target.value))}
                className="w-full accent-primary"
              />
            </div>
            <button
              onClick={getEmbeddings}
              className="px-6 py-3 bg-primary hover:bg-primary/90 text-white font-bold text-sm rounded-xl shadow-lg transition-all shrink-0 flex items-center gap-2"
            >
              <FiCpu size={16} /> Generate Embeddings
            </button>
          </div>

          {embeddings.length > 0 && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-xs font-bold uppercase text-stone-500">
                  Generated Vector ({embeddings.length} dimensions)
                </span>
                <button
                  onClick={() => handleCopy(JSON.stringify(embeddings), 'emb')}
                  className="text-xs font-bold text-primary hover:underline flex items-center gap-1"
                >
                  {copied === 'emb' ? <FiCheck size={14} /> : <FiCopy size={14} />}
                  {copied === 'emb' ? 'Copied' : 'Copy Vector'}
                </button>
              </div>

              <pre className="p-4 bg-stone-50 dark:bg-zinc-950 border border-stone-200 dark:border-zinc-800 rounded-2xl font-mono text-xs text-primary whitespace-pre-wrap overflow-x-auto max-h-60 overflow-y-auto">
                [{embeddings.map(v => v.toFixed(6)).join(', ')}]
              </pre>

              <div className="grid grid-cols-4 sm:grid-cols-8 gap-2">
                {embeddings.map((v, i) => {
                  const barHeight = Math.abs(v) * 100;
                  return (
                    <div key={i} className="flex flex-col items-center gap-1">
                      <div className="w-full h-12 bg-stone-100 dark:bg-zinc-800 rounded-lg flex items-end justify-center overflow-hidden">
                        <div
                          className={`w-full rounded-t-md transition-all ${v >= 0 ? 'bg-primary/70' : 'bg-rose-400/70'}`}
                          style={{ height: `${Math.min(barHeight * 3, 100)}%` }}
                        />
                      </div>
                      <span className="text-[9px] font-mono text-stone-500">{v.toFixed(2)}</span>
                    </div>
                  );
                })}
              </div>

              <div className="p-4 bg-stone-50 dark:bg-zinc-950 border border-stone-200 dark:border-zinc-800 rounded-2xl space-y-2">
                <div className="flex items-center gap-2 text-xs font-bold text-stone-500">
                  <FiDatabase size={14} /> Vector Info
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs font-mono">
                  <div>
                    <span className="text-stone-500">Dimensions:</span>{' '}
                    <span className="text-stone-900 dark:text-white font-bold">{embeddings.length}</span>
                  </div>
                  <div>
                    <span className="text-stone-500">Magnitude:</span>{' '}
                    <span className="text-stone-900 dark:text-white font-bold">
                      {Math.sqrt(embeddings.reduce((s, v) => s + v * v, 0)).toFixed(4)}
                    </span>
                  </div>
                  <div>
                    <span className="text-stone-500">L2 Norm:</span>{' '}
                    <span className="text-stone-900 dark:text-white font-bold">
                      {Math.sqrt(embeddings.reduce((s, v) => s + v * v, 0)).toFixed(4)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
