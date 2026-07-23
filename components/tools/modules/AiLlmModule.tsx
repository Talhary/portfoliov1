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

  // AI Image Prompt Generator state
  const [imgSubject, setImgSubject] = useState<string>('A majestic dragon perched on a mountain');
  const [imgStyle, setImgStyle] = useState<string>('Photorealistic');
  const [imgLighting, setImgLighting] = useState<string>('Golden Hour');
  const [imgCamera, setImgCamera] = useState<string>('Wide-Angle');
  const [imgMedium, setImgMedium] = useState<string>('Digital Art');
  const [imgMood, setImgMood] = useState<string>('Epic');
  const [imgColor, setImgColor] = useState<string>('Warm Tones');
  const [imgNegative, setImgNegative] = useState<string>('');
  const [imgGeneratedPrompt, setImgGeneratedPrompt] = useState<string>('');

  // RAG Chunking Visualizer state
  const [ragDocument, setRagDocument] = useState<string>('Retrieval-Augmented Generation (RAG) is a technique that enhances large language models by retrieving relevant external knowledge before generating a response. This approach combines the power of pre-trained language models with the ability to access up-to-date information from external databases or document collections. RAG systems typically work by first encoding the input query into a vector representation, then searching a vector database for similar document chunks. The retrieved chunks are then concatenated with the original query and passed to the language model for response generation. This technique has become increasingly popular in enterprise applications where accuracy and grounding in factual data are critical requirements. Companies like Microsoft, Google, and Amazon have all integrated RAG patterns into their AI offerings. The key advantage of RAG over fine-tuning is that it allows models to access new information without retraining, making it cost-effective and rapidly updatable.');
  const [ragStrategy, setRagStrategy] = useState<string>('fixed-size');
  const [ragChunkSize, setRagChunkSize] = useState<number>(100);
  const [ragOverlap, setRagOverlap] = useState<number>(20);
  const [ragChunks, setRagChunks] = useState<{ text: string; index: number; charCount: number; tokenEst: number }[]>([]);

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

      {/* 4. AI Image Prompt Generator */}
      {tool.id === 'ai-image-prompt-generator' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-xs font-bold uppercase text-stone-500 mb-1">Subject</label>
              <input type="text" value={imgSubject} onChange={(e) => setImgSubject(e.target.value)} placeholder="Describe the main subject..." className="w-full p-3.5 bg-stone-50 dark:bg-zinc-950 border border-stone-200 dark:border-zinc-800 rounded-xl text-sm font-bold" />
            </div>
            {[
              { label: 'Art Style', value: imgStyle, set: setImgStyle, options: ['Photorealistic', 'Oil Painting', 'Watercolor', 'Anime', 'Pixel Art', '3D Render', 'Pencil Sketch', 'Pop Art', 'Art Nouveau', 'Cyberpunk'] },
              { label: 'Lighting', value: imgLighting, set: setImgLighting, options: ['Golden Hour', 'Studio', 'Dramatic', 'Soft Diffused', 'Neon', 'Moonlight', 'Backlit', 'Volumetric', 'Cinematic', 'Natural'] },
              { label: 'Camera Angle', value: imgCamera, set: setImgCamera, options: ['Wide-Angle', 'Macro', 'Bird\'s Eye', 'Low Angle', 'Dutch Angle', 'Close-Up', 'Aerial Drone', 'Eye Level', 'Over the Shoulder', 'Fish Eye'] },
              { label: 'Medium', value: imgMedium, set: setImgMedium, options: ['Digital Art', 'Oil on Canvas', 'Charcoal Drawing', 'Acrylic', 'Ink Wash', 'Vector Illustration', 'Collage', 'Mixed Media', 'Photography', 'Film Still'] },
              { label: 'Mood', value: imgMood, set: setImgMood, options: ['Epic', 'Serene', 'Mysterious', 'Whimsical', 'Dark', 'Joyful', 'Melancholic', 'Ethereal', 'Intense', 'Nostalgic'] },
              { label: 'Color Palette', value: imgColor, set: setImgColor, options: ['Warm Tones', 'Cool Tones', 'Monochrome', 'Pastel', 'Vibrant', 'Muted Earth', 'Neon', 'Sepia', 'High Contrast', 'Duotone'] },
            ].map((field) => (
              <div key={field.label}>
                <label className="block text-xs font-bold uppercase text-stone-500 mb-1">{field.label}</label>
                <select value={field.value} onChange={(e) => field.set(e.target.value)} className="w-full p-3 bg-stone-50 dark:bg-zinc-950 border border-stone-200 dark:border-zinc-800 rounded-xl text-sm font-bold">
                  {field.options.map((o) => <option key={o} value={o}>{o}</option>)}
                </select>
              </div>
            ))}
            <div className="sm:col-span-2">
              <label className="block text-xs font-bold uppercase text-stone-500 mb-1">Negative Prompt (optional)</label>
              <input type="text" value={imgNegative} onChange={(e) => setImgNegative(e.target.value)} placeholder="blurry, low quality, watermark, text..." className="w-full p-3 bg-stone-50 dark:bg-zinc-950 border border-stone-200 dark:border-zinc-800 rounded-xl text-sm" />
            </div>
          </div>
          <button onClick={() => {
            const prompt = `${imgSubject}, ${imgStyle.toLowerCase()} style, ${imgMedium.toLowerCase()}, ${imgLighting.toLowerCase()} lighting, ${imgCamera.toLowerCase()} view, ${imgMood.toLowerCase()} mood, ${imgColor.toLowerCase()} palette, masterpiece, best quality, highly detailed`;
            setImgGeneratedPrompt(prompt + (imgNegative ? `\n\nNegative prompt: ${imgNegative}` : ''));
          }} className="w-full py-3.5 bg-primary hover:bg-primary/90 text-white font-bold text-sm rounded-xl shadow-lg transition-all flex items-center justify-center gap-2">
            <FiZap size={16} /> Generate Image Prompt
          </button>
          {imgGeneratedPrompt && (
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-xs font-bold uppercase text-stone-500">Generated Prompt</span>
                <button onClick={() => handleCopy(imgGeneratedPrompt, 'imgprompt')} className="text-xs font-bold text-primary hover:underline flex items-center gap-1">
                  {copied === 'imgprompt' ? <FiCheck size={14} /> : <FiCopy size={14} />} {copied === 'imgprompt' ? 'Copied' : 'Copy'}
                </button>
              </div>
              <pre className="p-4 bg-stone-50 dark:bg-zinc-950 border border-stone-200 dark:border-zinc-800 rounded-2xl font-mono text-xs text-stone-900 dark:text-zinc-200 whitespace-pre-wrap overflow-x-auto">
                {imgGeneratedPrompt}
              </pre>
            </div>
          )}
        </div>
      )}

      {/* 5. RAG Chunking Visualizer */}
      {tool.id === 'rag-chunking-visualizer' && (
        <div className="space-y-6">
          <div>
            <label className="block text-xs font-bold uppercase text-stone-500 mb-1">Document Text</label>
            <textarea rows={6} value={ragDocument} onChange={(e) => setRagDocument(e.target.value)} placeholder="Paste a long document to visualize chunking..." className="w-full p-4 bg-stone-50 dark:bg-zinc-950 border border-stone-200 dark:border-zinc-800 rounded-2xl font-mono text-sm focus:ring-2 focus:ring-primary/50 outline-none resize-none" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase text-stone-500 mb-1">Chunking Strategy</label>
              <select value={ragStrategy} onChange={(e) => setRagStrategy(e.target.value)} className="w-full p-3 bg-stone-50 dark:bg-zinc-950 border border-stone-200 dark:border-zinc-800 rounded-xl text-sm font-bold">
                <option value="fixed-size">Fixed Character Count</option>
                <option value="sentence">Sentence-Based</option>
                <option value="paragraph">Paragraph-Based</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold uppercase text-stone-500 mb-1">Chunk Size: {ragChunkSize}</label>
              <input type="range" min={50} max={500} step={10} value={ragChunkSize} onChange={(e) => setRagChunkSize(Number(e.target.value))} className="w-full accent-primary mt-2" />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase text-stone-500 mb-1">Overlap: {ragOverlap}</label>
              <input type="range" min={0} max={100} step={5} value={ragOverlap} onChange={(e) => setRagOverlap(Number(e.target.value))} className="w-full accent-primary mt-2" />
            </div>
          </div>
          <button onClick={() => {
            const chunks: { text: string; index: number; charCount: number; tokenEst: number }[] = [];
            if (ragStrategy === 'fixed-size') {
              for (let i = 0; i < ragDocument.length; i += ragChunkSize - ragOverlap) {
                const chunk = ragDocument.slice(i, i + ragChunkSize);
                if (chunk.trim()) chunks.push({ text: chunk, index: chunks.length, charCount: chunk.length, tokenEst: Math.ceil(chunk.length / 4) });
              }
            } else if (ragStrategy === 'sentence') {
              const sentences = ragDocument.match(/[^.!?]+[.!?]+/g) || [ragDocument];
              let buffer = '';
              sentences.forEach((s) => {
                if (buffer.length + s.length > ragChunkSize && buffer.trim()) {
                  chunks.push({ text: buffer.trim(), index: chunks.length, charCount: buffer.trim().length, tokenEst: Math.ceil(buffer.trim().length / 4) });
                  buffer = buffer.slice(-ragOverlap) + s;
                } else {
                  buffer += s;
                }
              });
              if (buffer.trim()) chunks.push({ text: buffer.trim(), index: chunks.length, charCount: buffer.trim().length, tokenEst: Math.ceil(buffer.trim().length / 4) });
            } else {
              const paragraphs = ragDocument.split(/\n\n+/);
              let buffer = '';
              paragraphs.forEach((p) => {
                if (buffer.length + p.length > ragChunkSize && buffer.trim()) {
                  chunks.push({ text: buffer.trim(), index: chunks.length, charCount: buffer.trim().length, tokenEst: Math.ceil(buffer.trim().length / 4) });
                  buffer = p;
                } else {
                  buffer += (buffer ? '\n\n' : '') + p;
                }
              });
              if (buffer.trim()) chunks.push({ text: buffer.trim(), index: chunks.length, charCount: buffer.trim().length, tokenEst: Math.ceil(buffer.trim().length / 4) });
            }
            setRagChunks(chunks);
          }} className="w-full py-3.5 bg-primary hover:bg-primary/90 text-white font-bold text-sm rounded-xl shadow-lg transition-all flex items-center justify-center gap-2">
            <FiCpu size={16} /> Visualize Chunks
          </button>
          {ragChunks.length > 0 && (
            <div className="space-y-4">
              <div className="grid grid-cols-3 gap-3 text-center">
                <div className="p-3 bg-stone-50 dark:bg-zinc-950 border border-stone-200 dark:border-zinc-800 rounded-xl">
                  <span className="text-[10px] uppercase font-bold text-stone-500">Chunks</span>
                  <div className="text-2xl font-black text-primary">{ragChunks.length}</div>
                </div>
                <div className="p-3 bg-stone-50 dark:bg-zinc-950 border border-stone-200 dark:border-zinc-800 rounded-xl">
                  <span className="text-[10px] uppercase font-bold text-stone-500">Avg Size</span>
                  <div className="text-2xl font-black text-stone-900 dark:text-white">{Math.round(ragChunks.reduce((s, c) => s + c.charCount, 0) / ragChunks.length)}c</div>
                </div>
                <div className="p-3 bg-stone-50 dark:bg-zinc-950 border border-stone-200 dark:border-zinc-800 rounded-xl">
                  <span className="text-[10px] uppercase font-bold text-stone-500">Est. Tokens</span>
                  <div className="text-2xl font-black text-emerald-500">{ragChunks.reduce((s, c) => s + c.tokenEst, 0)}</div>
                </div>
              </div>
              <div className="space-y-2 max-h-80 overflow-y-auto">
                {ragChunks.map((chunk) => {
                  const colors = ['bg-primary/10 border-primary/30', 'bg-emerald-50 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-800', 'bg-blue-50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-800', 'bg-amber-50 dark:bg-amber-950/20 border-amber-200 dark:border-amber-800', 'bg-rose-50 dark:bg-rose-950/20 border-rose-200 dark:border-rose-800'];
                  return (
                    <div key={chunk.index} className={`p-3 rounded-xl border ${colors[chunk.index % colors.length]}`}>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-[10px] font-bold uppercase text-stone-500">Chunk #{chunk.index + 1}</span>
                        <span className="text-[10px] font-mono text-stone-500">{chunk.charCount} chars ~ {chunk.tokenEst} tokens</span>
                      </div>
                      <p className="text-xs text-stone-700 dark:text-zinc-300 leading-relaxed line-clamp-3">{chunk.text}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
