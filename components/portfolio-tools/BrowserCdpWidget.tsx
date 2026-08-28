"use client";

import React, { useState, useEffect } from 'react';
import { 
  Globe, 
  Activity, 
  RefreshCw, 
  Radio, 
  Server, 
  CheckCircle2, 
  Copy, 
  Check, 
  AlertCircle,
  ExternalLink,
  Cpu
} from 'lucide-react';

interface BrowserWorker {
  workerId: string;
  status: string;
  cdpUrl: string;
  registeredAt?: number;
  lastHeartbeat?: number;
}

export function BrowserCdpWidget() {
  const [browsers, setBrowsers] = useState<BrowserWorker[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const fetchBrowsers = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/portfolio/browsers/cdp');
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to retrieve active browser worker nodes.');
      }
      setBrowsers(data.browsers || []);
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Error communicating with CDP browser pool.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBrowsers();
  }, []);

  const copyCdpUrl = (url: string, id: string) => {
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="w-full space-y-8">
      {/* CDP Network Card */}
      <div className="p-6 md:p-8 rounded-3xl bg-white dark:bg-card-bg-2 border border-zinc-200 dark:border-zinc-800 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-48 h-48 bg-primary/10 rounded-full blur-3xl pointer-events-none" />

        <div className="space-y-6 relative z-10">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-100 dark:border-zinc-800/80 pb-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold uppercase tracking-wider mb-2">
                <Globe size={14} /> Chrome DevTools Protocol Pool
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-zinc-900 dark:text-white tracking-tight">
                Browser Network CDP & Screencast Pool
              </h2>
              <p className="text-sm text-zinc-500 dark:text-zinc-400 font-light mt-1">
                Real-time monitor for remote Chromium worker instances with live Chrome DevTools Protocol WebSocket debug endpoints for headless automation.
              </p>
            </div>

            <button
              onClick={fetchBrowsers}
              disabled={loading}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-xs font-bold uppercase tracking-wider text-zinc-800 dark:text-zinc-200 hover:text-primary transition active:scale-95 shrink-0"
            >
              <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
              <span>Refresh Pool</span>
            </button>
          </div>

          {error && (
            <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-400 flex items-start gap-3 text-xs sm:text-sm">
              <AlertCircle className="h-5 w-5 shrink-0 mt-0.5" />
              <div>{error}</div>
            </div>
          )}

          {/* Active Nodes Grid */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-400">
                Active Remote Chromium Nodes ({browsers.length})
              </h3>
              <span className="flex items-center gap-1.5 text-xs text-emerald-500 font-bold">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping inline-block" />
                Live Cluster
              </span>
            </div>

            {browsers.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {browsers.map((node) => (
                  <div
                    key={node.workerId}
                    className="p-5 rounded-2xl bg-zinc-50 dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800 space-y-4 hover:border-primary/40 transition shadow-xs"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-3">
                        <div className="p-2.5 rounded-xl bg-primary/10 text-primary">
                          <Server size={20} />
                        </div>
                        <div>
                          <h4 className="font-bold text-sm text-zinc-900 dark:text-white font-mono">
                            {node.workerId}
                          </h4>
                          <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-500 uppercase">
                            <CheckCircle2 size={11} /> {node.status || 'Active'}
                          </span>
                        </div>
                      </div>

                      <button
                        onClick={() => copyCdpUrl(node.cdpUrl, node.workerId)}
                        className="p-2 rounded-lg bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 text-zinc-400 hover:text-primary transition"
                        title="Copy CDP Endpoint URL"
                      >
                        {copiedId === node.workerId ? <Check size={15} className="text-emerald-500" /> : <Copy size={15} />}
                      </button>
                    </div>

                    <div className="space-y-1 text-xs">
                      <span className="text-[10px] uppercase font-bold text-zinc-400">CDP WebSocket Endpoint</span>
                      <div className="p-2.5 rounded-xl bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 font-mono text-[11px] text-zinc-700 dark:text-zinc-300 truncate">
                        {node.cdpUrl}
                      </div>
                    </div>

                    {node.lastHeartbeat && (
                      <div className="flex items-center justify-between text-[11px] text-zinc-400 font-mono pt-1">
                        <span>Last Heartbeat:</span>
                        <span className="text-zinc-500">
                          {new Date(node.lastHeartbeat).toLocaleTimeString()}
                        </span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-8 text-center rounded-2xl bg-zinc-50 dark:bg-zinc-900/30 border border-dashed border-zinc-300 dark:border-zinc-800">
                <p className="text-xs text-zinc-500 dark:text-zinc-400 font-medium">
                  {loading ? 'Polling active worker cluster...' : 'No browser workers currently active in cluster.'}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
