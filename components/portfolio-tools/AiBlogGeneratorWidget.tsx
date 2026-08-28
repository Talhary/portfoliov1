"use client";

import React, { useState } from 'react';
import { 
  Brain, 
  Sparkles, 
  Copy, 
  Check, 
  Download, 
  Loader2, 
  AlertCircle, 
  BookOpen, 
  Tag, 
  FileText,
  Share2
} from 'lucide-react';

interface BlogResult {
  title: string;
  description: string;
  content: string;
  tags: string[];
  url?: string;
}

const TOPIC_SUGGESTIONS = [
  'High-Concurrency WebSockets in Go and Node.js: An Architectural Comparison',
  'Building an LSM-Tree Storage Engine from Scratch in Golang',
  'Distributed Consensus with Raft: Implementing an In-Memory Key-Value Store',
  'Automating Chrome DevTools Protocol (CDP) at Scale with Docker and Cloudflare Tunnels',
];

export function AiBlogGeneratorWidget() {
  const [topic, setTopic] = useState('');
  const [loading, setLoading] = useState(false);
  const [blog, setBlog] = useState<BlogResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!topic.trim()) {
      setError('Please provide a technical engineering topic.');
      return;
    }

    setLoading(true);
    setError(null);
    setBlog(null);

    try {
      const response = await fetch('/api/portfolio/blog/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic: topic.trim() }),
      });

      const data = await response.json();
      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Failed to generate technical article.');
      }

      setBlog(data);
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Error communicating with AI blog generation pipeline.');
    } finally {
      setLoading(false);
    }
  };

  const copyMarkdown = () => {
    if (blog?.content) {
      navigator.clipboard.writeText(blog.content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const downloadMarkdown = () => {
    if (!blog) return;
    const blob = new Blob([blog.content], { type: 'text/markdown;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${(blog.title || 'blog_article').toLowerCase().replace(/[^a-z0-9]+/g, '-')}.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="w-full space-y-8">
      {/* Blog Generator Card */}
      <div className="p-6 md:p-8 rounded-3xl bg-white dark:bg-card-bg-2 border border-zinc-200 dark:border-zinc-800 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-48 h-48 bg-primary/10 rounded-full blur-3xl pointer-events-none" />

        <div className="space-y-6 relative z-10">
          <div className="border-b border-zinc-100 dark:border-zinc-800/80 pb-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold uppercase tracking-wider mb-2">
              <Brain size={14} /> Google Gemini 2.5 Flash Engine
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-zinc-900 dark:text-white tracking-tight">
              Gemini AI Technical Blog & Deep-Dive Generator
            </h2>
            <p className="text-sm text-zinc-500 dark:text-zinc-400 font-light mt-1">
              Scouts trending software engineering concepts and synthesizes publication-ready deep dives with markdown diagrams, code samples, and architectural breakdowns.
            </p>
          </div>

          {/* Suggestions Chips */}
          <div>
            <label className="block text-xs uppercase font-bold text-zinc-500 dark:text-zinc-400 tracking-wider mb-2.5">
              Topic Inspiration
            </label>
            <div className="flex flex-wrap gap-2">
              {TOPIC_SUGGESTIONS.map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setTopic(t)}
                  className="p-2 sm:px-3 sm:py-1.5 rounded-xl bg-zinc-100 dark:bg-zinc-900/80 border border-zinc-200 dark:border-zinc-800 text-xs text-zinc-600 dark:text-zinc-300 hover:text-primary hover:border-primary/40 text-left transition"
                >
                  💡 {t}
                </button>
              ))}
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleGenerate} className="space-y-4">
            <div className="relative flex flex-col sm:flex-row gap-3">
              <input
                type="text"
                required
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                disabled={loading}
                placeholder="Enter technical topic (e.g. Memory layouts in Go vs Rust)..."
                className="flex-1 px-4 py-3.5 bg-zinc-50 dark:bg-zinc-900/80 border border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-white rounded-2xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary/50 transition"
              />
              <button
                type="submit"
                disabled={loading}
                className="h-12 sm:h-auto bg-primary hover:bg-primary-hover text-white font-bold rounded-2xl px-8 flex items-center justify-center gap-2 shadow-lg hover:shadow-[0_0_20px_rgba(var(--primary-rgb),0.35)] active:scale-98 transition duration-200 disabled:opacity-60 shrink-0"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    <span>Synthesizing Article with Gemini...</span>
                  </>
                ) : (
                  <>
                    <Sparkles size={18} />
                    <span>Generate Technical Blog</span>
                  </>
                )}
              </button>
            </div>
          </form>

          {error && (
            <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-400 flex items-start gap-3 text-xs sm:text-sm">
              <AlertCircle className="h-5 w-5 shrink-0 mt-0.5" />
              <div>{error}</div>
            </div>
          )}

          {/* Blog Output */}
          {blog && (
            <div className="space-y-5 pt-6 border-t border-zinc-100 dark:border-zinc-800 animate-fadeIn">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-zinc-50 dark:bg-zinc-900/60 p-5 rounded-2xl border border-zinc-200 dark:border-zinc-800">
                <div className="space-y-1">
                  <h3 className="text-lg font-bold text-zinc-900 dark:text-white">{blog.title}</h3>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400 font-light">{blog.description}</p>
                  {blog.tags && blog.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 pt-2">
                      {blog.tags.map((tag) => (
                        <span key={tag} className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-primary/10 text-primary border border-primary/20">
                          #{tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={copyMarkdown}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-zinc-200/70 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 text-xs font-bold transition hover:text-primary"
                  >
                    {copied ? <Check size={14} className="text-emerald-500" /> : <Copy size={14} />}
                    <span>{copied ? 'Copied' : 'Copy Markdown'}</span>
                  </button>
                  <button
                    onClick={downloadMarkdown}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-primary hover:bg-primary-hover text-white text-xs font-bold transition"
                  >
                    <Download size={14} />
                    <span>Download .md</span>
                  </button>
                </div>
              </div>

              {/* Rendered Markdown Preview Container */}
              <div className="p-6 rounded-2xl bg-zinc-950 border border-zinc-800 text-zinc-200 font-sans text-xs sm:text-sm leading-relaxed overflow-x-auto max-h-[600px] overflow-y-auto space-y-4">
                <pre className="whitespace-pre-wrap font-mono text-zinc-300 text-xs leading-relaxed">
                  {blog.content}
                </pre>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
