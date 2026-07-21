'use client';

import { useState } from 'react';
import { ToolDefinition } from '@/lib/tools/registry';
import { useToolJob } from '@/hooks/use-tool-job';
import { JobProgressModal } from '@/components/tools/JobProgressModal';
import { FiSearch, FiShare2, FiGlobe, FiCheckCircle } from 'react-icons/fi';

export const SeoModule = ({ tool }: { tool: ToolDefinition }) => {
  const [targetUrl, setTargetUrl] = useState<string>('https://example.com');
  const [sampleArticle, setSampleArticle] = useState<string>(
    'SEO optimization is the practice of improving your website ranking. Good SEO requires clear title tags, ' +
    'rich content density, fast server load speed, and relevant backlinks. Effective SEO strategy drives ' +
    'organic traffic. Measure your SEO performance with analytics tools.'
  );

  const { jobState, startJob, resetJob, isProcessing } = useToolJob(tool.id);

  // Keyword density calculation
  const getKeywords = (text: string) => {
    const clean = text.toLowerCase().replace(/[^a-z0-9\s]/g, '');
    const tokens = clean.split(/\s+/).filter((w) => w.length >= 3);
    const counts: Record<string, number> = {};
    tokens.forEach((w) => (counts[w] = (counts[w] || 0) + 1));
    return Object.entries(counts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 8);
  };

  const keywords = getKeywords(sampleArticle);

  return (
    <div className="space-y-6">
      {tool.id === 'keyword-density-checker' ? (
        <div className="space-y-6">
          <div>
            <label className="block text-xs font-bold uppercase text-stone-500 mb-1">Article Content</label>
            <textarea
              rows={5}
              value={sampleArticle}
              onChange={(e) => setSampleArticle(e.target.value)}
              className="w-full p-4 bg-stone-50 dark:bg-zinc-950 border border-stone-200 dark:border-zinc-800 rounded-2xl font-mono text-sm focus:ring-2 focus:ring-primary/50 outline-none"
            />
          </div>

          <div className="space-y-2">
            <span className="text-xs font-bold uppercase text-stone-500">Top Keyword Frequencies</span>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {keywords.map(([word, count]) => (
                <div key={word} className="p-3 bg-stone-50 dark:bg-zinc-950 border border-stone-200 dark:border-zinc-800 rounded-xl text-center">
                  <div className="text-xs font-bold text-primary">{word}</div>
                  <div className="text-lg font-black text-stone-900 dark:text-white mt-0.5">{count}x</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : tool.id === 'open-graph-preview' ? (
        /* OpenGraph Social Card Preview */
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase text-stone-500 mb-1">OG Title</label>
              <input
                type="text"
                id="og-title-input"
                value={targetUrl}
                onChange={(e) => setTargetUrl(e.target.value)}
                placeholder="Enter page title for preview..."
                className="w-full p-3 bg-stone-50 dark:bg-zinc-950 border border-stone-200 dark:border-zinc-800 rounded-xl font-bold text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase text-stone-500 mb-1">OG Description</label>
              <input
                type="text"
                id="og-description-input"
                value={sampleArticle.slice(0, 120)}
                onChange={(e) => setSampleArticle(e.target.value)}
                placeholder="Enter description for preview..."
                className="w-full p-3 bg-stone-50 dark:bg-zinc-950 border border-stone-200 dark:border-zinc-800 rounded-xl font-bold text-sm"
              />
            </div>
          </div>
          <div className="p-4 bg-stone-50 dark:bg-zinc-950 border border-stone-200 dark:border-zinc-800 rounded-2xl max-w-md mx-auto shadow-md">
            <div className="h-44 bg-zinc-800 rounded-xl mb-3 flex items-center justify-center text-zinc-500 font-bold text-xs uppercase">
              1200 x 630 OpenGraph Image Mockup
            </div>
            <div className="text-xs font-mono uppercase text-stone-400">EXAMPLE.COM</div>
            <div className="text-base font-bold text-stone-900 dark:text-white mt-1">
              {targetUrl || 'Title Tag - High Performance Web Development Tools'}
            </div>
            <div className="text-xs text-stone-500 dark:text-zinc-400 mt-1 line-clamp-2">
              {sampleArticle.slice(0, 120) || 'Meta description preview for social media sharing cards on Facebook, Twitter, and LinkedIn.'}
            </div>
          </div>
        </div>
      ) : (
        /* Server SEO Scraping Tools (Meta Tag Analyzer, Sitemap Generator, Speed Estimator) */
        <div className="space-y-6">
          <div>
            <label className="block text-xs font-bold uppercase text-stone-500 mb-1">Target Website URL</label>
            <div className="flex gap-2">
              <input
                type="text"
                value={targetUrl}
                onChange={(e) => setTargetUrl(e.target.value)}
                placeholder="https://yourwebsite.com"
                className="w-full p-3.5 bg-stone-50 dark:bg-zinc-950 border border-stone-200 dark:border-zinc-800 rounded-xl font-mono text-sm font-bold"
              />
              <button
                onClick={() => startJob({ url: targetUrl })}
                disabled={isProcessing}
                className="px-6 py-3.5 bg-primary hover:bg-primary/90 text-white font-bold text-xs rounded-xl shadow-lg uppercase whitespace-nowrap"
              >
                Run SEO Audit
              </button>
            </div>
          </div>

          <JobProgressModal jobState={jobState} onReset={resetJob} title={tool.title} />
        </div>
      )}
    </div>
  );
};
