"use client";

import React, { useState } from 'react';
import { 
  Globe, 
  Mail, 
  Phone, 
  Share2, 
  Sliders, 
  Copy, 
  Check, 
  ExternalLink, 
  Loader2, 
  AlertCircle, 
  Zap, 
  Layers, 
  FileText,
  Clock
} from 'lucide-react';

interface ScrapeResult {
  domain: string;
  emails: string[];
  phones: string[];
  socials: Record<string, string>;
  forms: string[];
  pagesCrawled: number;
  durationMs: number;
}

export function GoContactScraperWidget() {
  const [url, setUrl] = useState('https://example.com');
  const [maxPages, setMaxPages] = useState<number>(15);
  const [workers, setWorkers] = useState<number>(5);
  const [timeout, setTimeoutSecs] = useState<number>(30);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ScrapeResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [copiedEmail, setCopiedEmail] = useState<string | null>(null);

  const handleScrape = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url.trim()) {
      setError('Please provide a target domain or website URL.');
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const res = await fetch('/api/portfolio/scrape/contacts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          url: url.trim(),
          maxPages,
          workers,
          timeout,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Contact scraping failed. Please verify the domain is reachable.');
      }

      setResult(data);
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Error executing contact crawler.');
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedEmail(text);
    setTimeout(() => setCopiedEmail(null), 2000);
  };

  return (
    <div className="w-full space-y-8">
      {/* Scraper Card */}
      <div className="p-6 md:p-8 rounded-3xl bg-white dark:bg-card-bg-2 border border-zinc-200 dark:border-zinc-800 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-48 h-48 bg-primary/10 rounded-full blur-3xl pointer-events-none" />

        <div className="space-y-6 relative z-10">
          <div className="border-b border-zinc-100 dark:border-zinc-800/80 pb-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold uppercase tracking-wider mb-2">
              <Zap size={14} /> Multi-Threaded Go Crawler Engine
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-zinc-900 dark:text-white tracking-tight">
              High-Throughput Go Contact & Leads Harvester
            </h2>
            <p className="text-sm text-zinc-500 dark:text-zinc-400 font-light mt-1">
              Recursively traverse entire domains at high concurrency to extract verified email addresses, telephone numbers, contact pages, and social media handles.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleScrape} className="space-y-5">
            <div>
              <label className="block text-xs uppercase font-bold text-zinc-500 dark:text-zinc-400 tracking-wider mb-2">
                Target Domain / Website URL
              </label>
              <div className="relative">
                <Globe className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" size={18} />
                <input
                  type="url"
                  required
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  disabled={loading}
                  placeholder="https://company-agency.com"
                  className="w-full pl-11 pr-4 py-3.5 bg-zinc-50 dark:bg-zinc-900/80 border border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-white rounded-2xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary/50 transition"
                />
              </div>
            </div>

            {/* Sliders Configuration */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-900/40 border border-zinc-200 dark:border-zinc-800">
              <div>
                <div className="flex justify-between text-xs font-bold text-zinc-700 dark:text-zinc-300 mb-2">
                  <span>Concurrent Workers</span>
                  <span className="text-primary font-mono">{workers} threads</span>
                </div>
                <input
                  type="range"
                  min={1}
                  max={10}
                  value={workers}
                  onChange={(e) => setWorkers(Number(e.target.value))}
                  disabled={loading}
                  className="w-full accent-primary cursor-pointer"
                />
              </div>

              <div>
                <div className="flex justify-between text-xs font-bold text-zinc-700 dark:text-zinc-300 mb-2">
                  <span>Max Crawl Pages</span>
                  <span className="text-primary font-mono">{maxPages} pages</span>
                </div>
                <input
                  type="range"
                  min={5}
                  max={30}
                  value={maxPages}
                  onChange={(e) => setMaxPages(Number(e.target.value))}
                  disabled={loading}
                  className="w-full accent-primary cursor-pointer"
                />
              </div>

              <div>
                <div className="flex justify-between text-xs font-bold text-zinc-700 dark:text-zinc-300 mb-2">
                  <span>Timeout Ceiling</span>
                  <span className="text-primary font-mono">{timeout}s</span>
                </div>
                <input
                  type="range"
                  min={10}
                  max={60}
                  value={timeout}
                  onChange={(e) => setTimeoutSecs(Number(e.target.value))}
                  disabled={loading}
                  className="w-full accent-primary cursor-pointer"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full sm:w-auto h-12 bg-primary hover:bg-primary-hover text-white font-bold rounded-2xl px-8 flex items-center justify-center gap-2 shadow-lg hover:shadow-[0_0_20px_rgba(var(--primary-rgb),0.35)] active:scale-98 transition duration-200 disabled:opacity-60"
            >
              {loading ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  <span>Crawling Website via Go Engine...</span>
                </>
              ) : (
                <>
                  <Zap size={18} />
                  <span>Crawl & Harvest Contacts</span>
                </>
              )}
            </button>
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
              {/* Metrics Banner */}
              <div className="flex flex-wrap items-center gap-4 p-4 rounded-2xl bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-xs font-mono">
                <span className="text-zinc-500">Domain: <strong className="text-zinc-900 dark:text-white">{result.domain}</strong></span>
                <span className="text-zinc-500">Pages Crawled: <strong className="text-primary">{result.pagesCrawled}</strong></span>
                <span className="text-zinc-500">Execution Time: <strong className="text-emerald-500">{result.durationMs} ms</strong></span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Emails Card */}
                <div className="p-5 rounded-2xl bg-zinc-50 dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800 space-y-3">
                  <div className="flex items-center gap-2 text-sm font-bold text-zinc-900 dark:text-white">
                    <Mail size={16} className="text-primary" />
                    <span>Discovered Emails ({result.emails?.length || 0})</span>
                  </div>
                  {result.emails && result.emails.length > 0 ? (
                    <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                      {result.emails.map((email) => (
                        <div
                          key={email}
                          className="flex items-center justify-between p-2 rounded-xl bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 text-xs"
                        >
                          <span className="font-mono text-zinc-700 dark:text-zinc-200 truncate">{email}</span>
                          <button
                            onClick={() => copyToClipboard(email)}
                            className="p-1 text-zinc-400 hover:text-primary transition"
                            title="Copy email"
                          >
                            {copiedEmail === email ? <Check size={14} className="text-emerald-500" /> : <Copy size={14} />}
                          </button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-xs text-zinc-400 font-light">No public email addresses detected on scanned pages.</p>
                  )}
                </div>

                {/* Phones Card */}
                <div className="p-5 rounded-2xl bg-zinc-50 dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800 space-y-3">
                  <div className="flex items-center gap-2 text-sm font-bold text-zinc-900 dark:text-white">
                    <Phone size={16} className="text-emerald-500" />
                    <span>Phone Numbers ({result.phones?.length || 0})</span>
                  </div>
                  {result.phones && result.phones.length > 0 ? (
                    <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                      {result.phones.map((phone) => (
                        <div
                          key={phone}
                          className="flex items-center justify-between p-2 rounded-xl bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 text-xs"
                        >
                          <span className="font-mono text-zinc-700 dark:text-zinc-200">{phone}</span>
                          <a href={`tel:${phone}`} className="text-primary hover:underline">
                            Call
                          </a>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-xs text-zinc-400 font-light">No phone numbers detected.</p>
                  )}
                </div>

                {/* Social Profiles */}
                <div className="p-5 rounded-2xl bg-zinc-50 dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800 space-y-3">
                  <div className="flex items-center gap-2 text-sm font-bold text-zinc-900 dark:text-white">
                    <Share2 size={16} className="text-blue-500" />
                    <span>Social Media Profiles ({Object.keys(result.socials || {}).length})</span>
                  </div>
                  {result.socials && Object.keys(result.socials).length > 0 ? (
                    <div className="space-y-2">
                      {Object.entries(result.socials).map(([network, link]) => (
                        <div
                          key={network}
                          className="flex items-center justify-between p-2 rounded-xl bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 text-xs"
                        >
                          <span className="font-bold capitalize text-zinc-900 dark:text-white">{network}</span>
                          <a
                            href={link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-primary flex items-center gap-1 hover:underline truncate max-w-[200px]"
                          >
                            <span className="truncate">{link.replace(/^https?:\/\//, '')}</span>
                            <ExternalLink size={12} className="shrink-0" />
                          </a>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-xs text-zinc-400 font-light">No social links harvested.</p>
                  )}
                </div>

                {/* Contact Forms */}
                <div className="p-5 rounded-2xl bg-zinc-50 dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800 space-y-3">
                  <div className="flex items-center gap-2 text-sm font-bold text-zinc-900 dark:text-white">
                    <FileText size={16} className="text-amber-500" />
                    <span>Contact Forms & Pages ({result.forms?.length || 0})</span>
                  </div>
                  {result.forms && result.forms.length > 0 ? (
                    <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                      {result.forms.map((formUrl) => (
                        <div
                          key={formUrl}
                          className="p-2 rounded-xl bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 text-xs flex items-center justify-between"
                        >
                          <a
                            href={formUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-primary flex items-center gap-1 hover:underline truncate"
                          >
                            <span className="truncate">{formUrl}</span>
                            <ExternalLink size={12} className="shrink-0" />
                          </a>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-xs text-zinc-400 font-light">No direct contact form endpoints found.</p>
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
