"use client";

import React, { useState, useEffect } from 'react';
import { 
  Cpu, 
  Layers, 
  Database, 
  Network, 
  ShieldCheck, 
  RefreshCw, 
  ExternalLink, 
  Sparkles,
  ArrowRight,
  GitBranch,
  Terminal,
  Server
} from 'lucide-react';

interface Suggestion {
  id?: string;
  title: string;
  category?: string;
  description: string;
  techStack?: string[];
  architecture?: string;
  features?: string[];
}

export function SystemSuggestionsWidget() {
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fallbackSuggestions: Suggestion[] = [
    {
      title: "Bitcask LSM-Tree Storage Engine",
      category: "Storage Systems",
      description: "High-throughput log-structured append-only key-value storage engine in Golang with active hinting files, CRC checksum validation, and concurrent read indexing.",
      techStack: ["Golang", "LSM Trees", "Bitcask", "mmap", "CRC32"],
      features: [
        "Append-only write log guarantees O(1) disk writes",
        "In-memory keydir hash map for instant key lookups",
        "Automated background compaction and hintfile rebuilds",
      ],
    },
    {
      title: "Raft Consensus In-Memory Redis Clone",
      category: "Distributed Systems",
      description: "Distributed key-value store implementing the Raft consensus algorithm for leader election, log replication, snapshotting, and strict linearizable state machine transitions.",
      techStack: ["Golang", "Raft Consensus", "gRPC", "RESP Protocol", "Distributed State"],
      features: [
        "Heartbeat leader election with randomized timeouts",
        "Log replication with majority quorum commit guarantees",
        "RESP Redis protocol compatible network listener",
      ],
    },
    {
      title: "Distributed Headless Chromium Pool with CDP Screencast",
      category: "Cloud Infrastructure",
      description: "Scalable browser pool orchestrating Dockerized Chromium nodes with real-time Chrome DevTools Protocol multiplexing and low-latency JPEG screencasts.",
      techStack: ["TypeScript", "Docker SDK", "Puppeteer CDP", "WebSockets", "Cloudflare Tunnels"],
      features: [
        "Ephemeral container recycling with 0-leak memory isolation",
        "Automatic Cloudflare named tunnel CNAME mapping",
        "Direct WebSocket multiplexing for remote debugger tabs",
      ],
    },
    {
      title: "Multi-Cloud Dynamic DNS & Edge Tunnel Reconciler",
      category: "Edge Networking",
      description: "Kubernetes/Docker controller synchronizing container life-cycle events with Cloudflare DNS API and Cloudflare Tunnel daemons in real-time.",
      techStack: ["Golang", "Cloudflare API", "Docker Events", "Dynamic DNS", "Microservices"],
      features: [
        "Instant subdomain generation (*.talhacodes.site)",
        "Zero-downtime routing with TLS cert termination at edge",
        "Health check reconciliation with auto-cleanup of dead records",
      ],
    },
  ];

  const fetchSuggestions = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/portfolio/suggestions');
      const data = await res.json();
      if (res.ok && data.success && Array.isArray(data.suggestions)) {
        setSuggestions(data.suggestions);
      } else {
        setSuggestions(fallbackSuggestions);
      }
    } catch {
      setSuggestions(fallbackSuggestions);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSuggestions();
  }, []);

  return (
    <div className="w-full space-y-8">
      {/* Suggestions Card */}
      <div className="p-6 md:p-8 rounded-3xl bg-white dark:bg-card-bg-2 border border-zinc-200 dark:border-zinc-800 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-48 h-48 bg-primary/10 rounded-full blur-3xl pointer-events-none" />

        <div className="space-y-6 relative z-10">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-100 dark:border-zinc-800/80 pb-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold uppercase tracking-wider mb-2">
                <Network size={14} /> Systems Engineering Blueprints
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-zinc-900 dark:text-white tracking-tight">
                Systems Architecture & Engineering Roadmaps
              </h2>
              <p className="text-sm text-zinc-500 dark:text-zinc-400 font-light mt-1">
                Explore deep architectural proposals for low-level systems, storage engines, distributed consensus algorithms, and cloud automation.
              </p>
            </div>

            <button
              onClick={fetchSuggestions}
              disabled={loading}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-xs font-bold uppercase tracking-wider text-zinc-800 dark:text-zinc-200 hover:text-primary transition active:scale-95 shrink-0"
            >
              <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
              <span>Refresh Proposals</span>
            </button>
          </div>

          {/* Proposals Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {suggestions.map((item, idx) => (
              <div
                key={idx}
                className="p-6 rounded-2xl bg-zinc-50 dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800 hover:border-primary/40 transition flex flex-col justify-between gap-4 shadow-sm"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[10px] font-bold uppercase px-2.5 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20">
                      {item.category || 'Systems Architecture'}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-zinc-900 dark:text-white tracking-tight leading-snug">
                    {item.title}
                  </h3>

                  <p className="text-xs text-zinc-600 dark:text-zinc-300 font-light leading-relaxed">
                    {item.description}
                  </p>

                  {item.features && item.features.length > 0 && (
                    <ul className="space-y-1.5 pt-1">
                      {item.features.map((feat, fIdx) => (
                        <li key={fIdx} className="text-xs text-zinc-500 dark:text-zinc-400 flex items-start gap-2">
                          <span className="text-primary font-bold">›</span>
                          <span>{feat}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>

                {item.techStack && item.techStack.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 pt-3 border-t border-zinc-200 dark:border-zinc-800">
                    {item.techStack.map((tech) => (
                      <span
                        key={tech}
                        className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-white dark:bg-zinc-950 text-zinc-700 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-800"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
