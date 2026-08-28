"use client";

import React, { useState } from 'react';
import { 
  Search, 
  Sparkles, 
  ExternalLink, 
  ShieldCheck, 
  Loader2, 
  AlertCircle, 
  Globe, 
  Layers 
} from 'lucide-react';

interface OrganicResult {
  title: string;
  link: string;
  snippet: string;
}

interface DuckSearchResult {
  query: string;
  pageNumber: number;
  aiSummary?: string;
  organic: OrganicResult[];
}

export function DuckSearchWidget() {
  const [query, setQuery] = useState('Kubernetes vs Docker Swarm 2026');
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<DuckSearchResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) {
      setError('Please provide a search term.');
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch('/api/portfolio/search/duck', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: query.trim(),
          pageNumber,
        }),
      });

      const data = await response.json();
      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Failed to complete headless search query.');
      }

      setResult(data);
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Error executing headless search.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full space-y-8">
      {/* Search Card */}
      <div className="p-6 md:p-8 rounded-3xl bg-white dark:bg-card-bg-2 border border-zinc-200 dark:border-zinc-800 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-48 h-48 bg-primary/10 rounded-full blur-3xl pointer-events-none" />

        <div className="space-y-6 relative z-10">
          <div className="border-b border-zinc-100 dark:border-zinc-800/80 pb-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold uppercase tracking-wider mb-2">
              <ShieldCheck size={14} /> Headless CDP Anti-Bot Pipeline
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-zinc-900 dark:text-white tracking-tight">
              Headless DuckDuckGo Search & AI Summarizer
            </h2>
            <p className="text-sm text-zinc-500 dark:text-zinc-400 font-light mt-1">
              Bypasses Cloudflare & Bot-Protection via headless Chrome DevTools Protocol to harvest organic web results paired with generative AI summaries.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSearch} className="space-y-4">
            <div className="relative flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" size={18} />
                <input
                  type="text"
                  required
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  disabled={loading}
                  placeholder="Search without tracking or bot blockers (e.g. Distributed system consensus algorithms)..."
                  className="w-full pl-11 pr-4 py-3.5 bg-zinc-50 dark:bg-zinc-900/80 border border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-white rounded-2xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary/50 transition"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="h-12 sm:h-auto bg-primary hover:bg-primary-hover text-white font-bold rounded-2xl px-8 flex items-center justify-center gap-2 shadow-lg hover:shadow-[0_0_20px_rgba(var(--primary-rgb),0.35)] active:scale-98 transition duration-200 disabled:opacity-60 shrink-0"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    <span>Executing Headless Search...</span>
                  </>
                ) : (
                  <>
                    <Search size={18} />
                    <span>Search Engine</span>
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

          {/* Results Display */}
          {result && (
            <div className="space-y-6 pt-6 border-t border-zinc-100 dark:border-zinc-800 animate-fadeIn">
              {/* AI Summary Card */}
              {result.aiSummary && (
                <div className="p-5 rounded-2xl bg-primary/5 border border-primary/20 space-y-2">
                  <div className="flex items-center gap-2 text-primary font-bold text-sm">
                    <Sparkles size={16} />
                    <span>AI Synthesized Search Summary</span>
                  </div>
                  <p className="text-xs sm:text-sm text-zinc-700 dark:text-zinc-300 leading-relaxed font-light">
                    {result.aiSummary}
                  </p>
                </div>
              )}

              {/* Organic Results List */}
              <div className="space-y-3">
                <h3 className="text-sm font-bold uppercase tracking-wider text-zinc-400">
                  Organic Search Results ({result.organic?.length || 0})
                </h3>

                <div className="space-y-3">
                  {result.organic && result.organic.length > 0 ? (
                    result.organic.map((item, idx) => (
                      <div
                        key={idx}
                        className="p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800 hover:border-primary/40 transition space-y-1.5"
                      >
                        <a
                          href={item.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="group/link flex items-center gap-2"
                        >
                          <h4 className="text-sm sm:text-base font-bold text-primary hover:underline leading-snug">
                            {item.title}
                          </h4>
                          <ExternalLink size={13} className="text-zinc-400 group-hover/link:text-primary transition" />
                        </a>
                        <div className="text-[11px] font-mono text-emerald-600 dark:text-emerald-400 truncate">
                          {item.link}
                        </div>
                        <p className="text-xs text-zinc-500 dark:text-zinc-400 font-light leading-relaxed">
                          {item.snippet}
                        </p>
                      </div>
                    ))
                  ) : (
                    <p className="text-xs text-zinc-400 italic">No search results returned.</p>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
