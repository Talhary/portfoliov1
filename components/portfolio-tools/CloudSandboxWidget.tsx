"use client";

import React, { useState, useEffect } from 'react';
import { 
  Terminal, 
  Code2, 
  Globe, 
  Settings, 
  Play, 
  StopCircle, 
  Copy, 
  Check, 
  ExternalLink, 
  Clock, 
  ShieldCheck, 
  Server, 
  Maximize2, 
  RefreshCw, 
  AlertTriangle, 
  Cpu, 
  Box, 
  Plus, 
  Trash2, 
  Zap, 
  Sparkles,
  Layers,
  CheckCircle2,
  HardDrive,
  Radio,
  RotateCw
} from 'lucide-react';

interface SandboxSession {
  sessionId: string;
  url: string;
  password?: string;
  type?: string;
  image?: string;
  port?: number;
  hostPort?: number;
  containerName?: string;
  tunnelStatus?: string;
  status?: string;
}

interface EnvVar {
  key: string;
  value: string;
}

const DOCKER_PRESETS = [
  {
    name: 'Python HTTP Server',
    image: 'python:3.11-slim',
    port: 8080,
    command: 'python -m http.server 8080',
    icon: '🐍',
    desc: 'Python 3.11 with live HTTP web server',
  },
  {
    name: 'Node.js Alpine Server',
    image: 'node:20-alpine',
    port: 3000,
    command: 'npx -y serve -p 3000',
    icon: '⚡',
    desc: 'Node.js 20 runtime with instant static server',
  },
  {
    name: 'Nginx Web Server',
    image: 'nginx:alpine',
    port: 80,
    command: 'nginx -g "daemon off;"',
    icon: '🌐',
    desc: 'Ultra-fast Nginx reverse proxy / static host',
  },
  {
    name: 'Golang Alpine Shell',
    image: 'golang:1.22-alpine',
    port: 8080,
    command: 'sh',
    icon: '🐹',
    desc: 'Full Go compiler and tooling environment',
  },
  {
    name: 'Ubuntu 22.04 LTS',
    image: 'ubuntu:22.04',
    port: 8080,
    command: 'bash',
    icon: '🐧',
    desc: 'Full Ubuntu Linux development shell',
  },
  {
    name: 'Deno Runtime',
    image: 'denoland/deno:alpine',
    port: 8000,
    command: 'deno eval "Deno.serve({port: 8000}, () => new Response(\'Hello from Deno Sandbox on talhacodes.site!\'))"',
    icon: '🦕',
    desc: 'Secure TypeScript & JavaScript runtime',
  },
];

export function CloudSandboxWidget() {
  // Custom Docker Container State
  const [customImage, setCustomImage] = useState<string>('python:3.11-slim');
  const [customPort, setCustomPort] = useState<number>(8080);
  const [customCommand, setCustomCommand] = useState<string>('python -m http.server 8080');
  const [envVars, setEnvVars] = useState<EnvVar[]>([{ key: 'PORT', value: '8080' }]);

  // Common TTL & Session
  const [ttlMinutes, setTtlMinutes] = useState<number>(5);
  const [loading, setLoading] = useState(false);
  const [session, setSession] = useState<SandboxSession | null>(null);
  const [remainingSecs, setRemainingSecs] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [iframeLoading, setIframeLoading] = useState(true);
  const [iframeKey, setIframeKey] = useState(0);

  // Add / Remove Env Vars
  const addEnvVar = () => setEnvVars([...envVars, { key: '', value: '' }]);
  const updateEnvVar = (index: number, field: 'key' | 'value', val: string) => {
    const updated = [...envVars];
    updated[index][field] = val;
    setEnvVars(updated);
  };
  const removeEnvVar = (index: number) => {
    setEnvVars(envVars.filter((_, i) => i !== index));
  };

  const applyPreset = (p: typeof DOCKER_PRESETS[0]) => {
    setCustomImage(p.image);
    setCustomPort(p.port);
    setCustomCommand(p.command);
    setEnvVars([{ key: 'PORT', value: String(p.port) }]);
  };

  // Launch Custom Docker Container
  const launchCustomDocker = async () => {
    if (!customImage.trim()) {
      setError('Please provide a Docker image name.');
      return;
    }

    setLoading(true);
    setError(null);

    const envMap: Record<string, string> = {};
    envVars.forEach((ev) => {
      if (ev.key.trim()) envMap[ev.key.trim()] = ev.value.trim();
    });

    try {
      const res = await fetch('/api/portfolio/demo/start', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'custom',
          image: customImage.trim(),
          port: Number(customPort) || 8080,
          command: customCommand.trim() || undefined,
          env: Object.keys(envMap).length > 0 ? envMap : undefined,
          ttlMinutes,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to start custom Docker container.');
      }

      const assignedSessionId = data.sessionId || data.id || data.session?.id;
      const assignedUrl = data.url || data.session?.url || (assignedSessionId ? `https://${assignedSessionId}.talhacodes.site` : '');

      setSession({
        sessionId: assignedSessionId,
        url: assignedUrl,
        password: data.password || data.session?.password,
        type: `Docker (${customImage.trim()})`,
        image: customImage,
        port: customPort,
        status: 'running',
        tunnelStatus: 'up',
      });

      setRemainingSecs(ttlMinutes * 60);
      setIframeLoading(true);
      setIframeKey((prev) => prev + 1);
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Error provisioning cloud Docker container.');
    } finally {
      setLoading(false);
    }
  };

  // Launch Predefined Quick Cloud Environment
  const launchQuickSandbox = async (type: 'vscode' | 'terminal' | 'browser') => {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/portfolio/demo/start', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type,
          ttlMinutes,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || `Failed to start ${type} sandbox.`);
      }

      const assignedSessionId = data.sessionId || data.id || data.session?.id;
      const assignedUrl = data.url || data.session?.url || (assignedSessionId ? `https://${assignedSessionId}.talhacodes.site` : '');

      setSession({
        sessionId: assignedSessionId,
        url: assignedUrl,
        password: data.password || data.session?.password,
        type: type === 'vscode' ? 'VS Code Cloud IDE' : type === 'terminal' ? 'Ubuntu Web Terminal' : 'Remote Chromium',
        status: 'running',
        tunnelStatus: 'up',
      });

      setRemainingSecs(ttlMinutes * 60);
      setIframeLoading(true);
      setIframeKey((prev) => prev + 1);
    } catch (err: any) {
      console.error(err);
      setError(err.message || `Error provisioning ${type} sandbox.`);
    } finally {
      setLoading(false);
    }
  };

  // Stop Sandbox Session Early
  const stopSandbox = async () => {
    if (!session) return;
    try {
      await fetch('/api/portfolio/demo/stop', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionId: session.sessionId }),
      });
    } catch (err) {
      console.error('Error stopping sandbox:', err);
    } finally {
      setSession(null);
      setRemainingSecs(null);
    }
  };

  // Poll remaining TTL & Container Status (handles both top-level and metadata nested fields)
  useEffect(() => {
    if (!session || !session.sessionId) return;
    
    const interval = setInterval(async () => {
      try {
        const res = await fetch(`/api/portfolio/demo/status?sessionId=${session.sessionId}`);
        const data = await res.json();
        
        if (data.success) {
          const sessionObj = data.session || {};
          const meta = sessionObj.metadata || {};
          
          // Extract remaining seconds from wherever it resides
          const remaining = 
            meta.remainingSeconds ?? 
            sessionObj.remainingSeconds ?? 
            data.remainingSeconds ?? 
            null;

          const isActive = 
            data.active === true || 
            meta.status === 'running' || 
            sessionObj.status === 'running' ||
            (remaining !== null && remaining > 0);

          if (isActive) {
            if (remaining !== null && remaining > 0) {
              setRemainingSecs(remaining);
            }
            // Update live metadata
            setSession((prev) => prev ? {
              ...prev,
              url: sessionObj.url || meta.cloudflaredUrl || meta.customDomain || prev.url,
              hostPort: meta.hostPort,
              containerName: meta.containerName,
              tunnelStatus: meta.tunnelStatus || 'up',
              status: meta.status || 'running',
            } : null);
          } else if (data.active === false || remaining === 0) {
            // Container expired
            setSession(null);
            setRemainingSecs(null);
          }
        }
      } catch (err) {
        console.error('Error polling sandbox status:', err);
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [session?.sessionId]);

  // Local seconds countdown tick
  useEffect(() => {
    if (!remainingSecs || remainingSecs <= 0) return;
    const timer = setInterval(() => {
      setRemainingSecs((prev) => {
        if (prev && prev > 1) return prev - 1;
        return 0;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [remainingSecs]);

  const copyPassword = () => {
    if (session?.password) {
      navigator.clipboard.writeText(session.password);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const reloadIframe = () => {
    setIframeLoading(true);
    setIframeKey((prev) => prev + 1);
  };

  const minutesLeft = Math.floor((remainingSecs || 0) / 60);
  const secondsLeft = (remainingSecs || 0) % 60;
  const progressPercent = Math.max(0, Math.min(100, ((remainingSecs || 0) / (ttlMinutes * 60)) * 100));

  return (
    <div className="w-full space-y-10">
      {/* ---------------- MAIN SECTION: DEPLOY ANY CUSTOM DOCKER CONTAINER ---------------- */}
      <div className="p-6 md:p-8 rounded-3xl bg-white dark:bg-card-bg-2 border border-zinc-200 dark:border-zinc-800 shadow-xl relative overflow-hidden transition-all duration-300">
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-56 h-56 bg-primary/10 rounded-full blur-3xl pointer-events-none" />

        <div className="space-y-6 relative z-10">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-zinc-100 dark:border-zinc-800/80 pb-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold uppercase tracking-wider mb-2">
                <Box size={14} /> Go Container Engine & Docker SDK
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-zinc-900 dark:text-white tracking-tight">
                Deploy Any Docker Container Online
              </h2>
              <p className="text-sm text-zinc-500 dark:text-zinc-400 font-light mt-1">
                Launch any Docker image from Docker Hub or public registries with custom exposed web ports, startup commands, and HTTPS subdomains on <code className="text-primary font-semibold">*.talhacodes.site</code>.
              </p>
            </div>

            {session && (
              <button
                onClick={stopSandbox}
                className="flex items-center gap-2 px-4 py-2 bg-rose-500/10 hover:bg-rose-500/20 text-rose-600 dark:text-rose-400 border border-rose-500/30 rounded-xl text-xs font-bold tracking-wider uppercase transition active:scale-95 shrink-0"
              >
                <StopCircle size={16} /> Stop Container Early
              </button>
            )}
          </div>

          {!session ? (
            <div className="space-y-6">
              {/* Popular Presets */}
              <div>
                <label className="block text-xs uppercase font-bold text-zinc-500 dark:text-zinc-400 tracking-wider mb-2.5">
                  Popular Container Presets (1-Click Fill)
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
                  {DOCKER_PRESETS.map((p) => (
                    <button
                      key={p.name}
                      type="button"
                      onClick={() => applyPreset(p)}
                      className="p-3 rounded-2xl bg-zinc-50 dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800 text-left hover:border-primary/40 hover:bg-primary/5 transition group flex flex-col justify-between gap-2 shadow-2xs"
                    >
                      <span className="text-xl">{p.icon}</span>
                      <div>
                        <h4 className="font-bold text-xs text-zinc-900 dark:text-white group-hover:text-primary transition-colors">
                          {p.name}
                        </h4>
                        <span className="font-mono text-[10px] text-zinc-400 block mt-0.5">
                          Port {p.port}
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Form: Docker Image & Port */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-xs uppercase font-bold text-zinc-500 dark:text-zinc-400 tracking-wider mb-1.5">
                    Docker Image Name (Docker Hub / Registry)
                  </label>
                  <input
                    type="text"
                    required
                    value={customImage}
                    onChange={(e) => setCustomImage(e.target.value)}
                    placeholder="e.g. python:3.11-slim, node:20-alpine, nginx:alpine, redis:alpine..."
                    className="w-full px-4 py-3 bg-zinc-50 dark:bg-zinc-900/80 border border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-white font-mono rounded-2xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition"
                  />
                </div>

                <div>
                  <label className="block text-xs uppercase font-bold text-zinc-500 dark:text-zinc-400 tracking-wider mb-1.5">
                    Exposed Web Port
                  </label>
                  <input
                    type="number"
                    required
                    value={customPort}
                    onChange={(e) => setCustomPort(Number(e.target.value))}
                    placeholder="8080"
                    className="w-full px-4 py-3 bg-zinc-50 dark:bg-zinc-900/80 border border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-white font-mono rounded-2xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition"
                  />
                </div>
              </div>

              {/* Startup Command */}
              <div>
                <label className="block text-xs uppercase font-bold text-zinc-500 dark:text-zinc-400 tracking-wider mb-1.5">
                  Startup Command / Entrypoint (Optional)
                </label>
                <input
                  type="text"
                  value={customCommand}
                  onChange={(e) => setCustomCommand(e.target.value)}
                  placeholder="e.g. python -m http.server 8080, node index.js..."
                  className="w-full px-4 py-3 bg-zinc-50 dark:bg-zinc-900/80 border border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-white font-mono rounded-2xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition"
                />
              </div>

              {/* Environment Variables Builder */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="block text-xs uppercase font-bold text-zinc-500 dark:text-zinc-400 tracking-wider">
                    Environment Variables
                  </label>
                  <button
                    type="button"
                    onClick={addEnvVar}
                    className="text-xs text-primary font-bold hover:underline flex items-center gap-1"
                  >
                    <Plus size={13} /> Add Variable
                  </button>
                </div>

                {envVars.length > 0 && (
                  <div className="space-y-2">
                    {envVars.map((ev, idx) => (
                      <div key={idx} className="flex items-center gap-2">
                        <input
                          type="text"
                          placeholder="KEY (e.g. PORT)"
                          value={ev.key}
                          onChange={(e) => updateEnvVar(idx, 'key', e.target.value)}
                          className="w-1/3 px-3 py-2 bg-zinc-50 dark:bg-zinc-900/80 border border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-white font-mono rounded-xl text-xs"
                        />
                        <span className="text-zinc-400">=</span>
                        <input
                          type="text"
                          placeholder="VALUE"
                          value={ev.value}
                          onChange={(e) => updateEnvVar(idx, 'value', e.target.value)}
                          className="flex-1 px-3 py-2 bg-zinc-50 dark:bg-zinc-900/80 border border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-white font-mono rounded-xl text-xs"
                        />
                        <button
                          type="button"
                          onClick={() => removeEnvVar(idx)}
                          className="p-2 text-zinc-400 hover:text-rose-500 transition"
                          title="Remove variable"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* TTL and Launch Button */}
              <div className="flex flex-col sm:flex-row items-center gap-4 pt-4 border-t border-zinc-100 dark:border-zinc-800">
                <div className="w-full sm:w-auto flex items-center gap-3 bg-zinc-100 dark:bg-zinc-900/80 px-4 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800">
                  <Clock size={16} className="text-zinc-400" />
                  <span className="text-xs font-semibold text-zinc-600 dark:text-zinc-300">Session TTL:</span>
                  <select
                    value={ttlMinutes}
                    onChange={(e) => setTtlMinutes(Number(e.target.value))}
                    className="bg-transparent text-xs font-bold text-primary focus:outline-none cursor-pointer"
                  >
                    <option value={5} className="dark:bg-zinc-900">5 Minutes (Auto-Reap)</option>
                    <option value={10} className="dark:bg-zinc-900">10 Minutes</option>
                    <option value={15} className="dark:bg-zinc-900">15 Minutes</option>
                  </select>
                </div>

                <button
                  onClick={launchCustomDocker}
                  disabled={loading}
                  className="w-full sm:flex-1 h-12 bg-primary hover:bg-primary-hover text-white transition-all font-bold rounded-2xl px-8 flex items-center justify-center gap-2.5 shadow-lg hover:shadow-[0_0_25px_rgba(var(--primary-rgb),0.4)] active:scale-98 duration-200 disabled:opacity-60"
                >
                  {loading ? (
                    <>
                      <RefreshCw className="h-5 w-5 animate-spin" />
                      <span>Spawning Docker Container & Named Tunnel...</span>
                    </>
                  ) : (
                    <>
                      <Play className="h-5 w-5 fill-current" />
                      <span>Deploy Container: {customImage}</span>
                    </>
                  )}
                </button>
              </div>

              {error && (
                <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-400 flex items-start gap-3 text-xs sm:text-sm animate-fadeIn">
                  <AlertTriangle className="h-5 w-5 shrink-0 mt-0.5" />
                  <div>{error}</div>
                </div>
              )}
            </div>
          ) : (
            /* Active Live Container Session View */
            <div className="space-y-4 animate-fadeIn">
              {/* Session Meta Bar */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 bg-zinc-50 dark:bg-zinc-900/90 p-4 rounded-2xl border border-zinc-200 dark:border-zinc-800">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-primary/10 text-primary">
                    <Clock size={20} />
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold text-zinc-400">TTL Remaining</span>
                    <div className="text-lg font-black text-amber-500 font-mono">
                      {String(minutesLeft).padStart(2, '0')}:{String(secondsLeft).padStart(2, '0')}
                    </div>
                  </div>
                </div>

                <div className="flex flex-col justify-center">
                  <span className="text-[10px] uppercase font-bold text-zinc-400">Target Subdomain</span>
                  <a
                    href={session.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-mono text-xs font-bold text-primary hover:underline truncate flex items-center gap-1"
                  >
                    <span className="truncate">{session.url}</span>
                    <ExternalLink size={11} className="shrink-0" />
                  </a>
                </div>

                {session.password ? (
                  <div className="flex items-center justify-between gap-2 lg:border-x border-zinc-200 dark:border-zinc-800 lg:px-3">
                    <div>
                      <span className="text-[10px] uppercase font-bold text-zinc-400">Password</span>
                      <div className="font-mono text-xs font-bold text-zinc-900 dark:text-white truncate">
                        {session.password}
                      </div>
                    </div>
                    <button
                      onClick={copyPassword}
                      className="p-1.5 rounded-lg bg-zinc-200/60 dark:bg-zinc-800 hover:text-primary transition"
                      title="Copy password"
                    >
                      {copied ? <Check size={14} className="text-emerald-500" /> : <Copy size={14} />}
                    </button>
                  </div>
                ) : (
                  <div className="flex flex-col justify-center lg:border-x border-zinc-200 dark:border-zinc-800 lg:px-3">
                    <span className="text-[10px] uppercase font-bold text-zinc-400">Container Status</span>
                    <span className="text-xs font-bold text-emerald-500 flex items-center gap-1.5 font-mono">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping inline-block" /> 
                      {session.tunnelStatus === 'up' ? 'Tunnel Up (Live)' : 'Running'}
                    </span>
                  </div>
                )}

                <div className="flex items-center justify-end gap-2">
                  <button
                    onClick={reloadIframe}
                    className="p-2.5 rounded-xl bg-zinc-200 dark:bg-zinc-800 hover:text-primary text-zinc-700 dark:text-zinc-200 text-xs font-bold transition"
                    title="Reload container frame"
                  >
                    <RotateCw size={14} />
                  </button>
                  <a
                    href={session.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2.5 bg-primary hover:bg-primary-hover text-white rounded-xl text-xs font-bold uppercase tracking-wider transition"
                  >
                    <Maximize2 size={14} /> Fullscreen
                  </a>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="w-full bg-zinc-200 dark:bg-zinc-800 h-1.5 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-primary to-amber-500 transition-all duration-1000"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>

              {/* Embedded Container Preview Frame */}
              <div className="relative w-full h-[650px] bg-zinc-950 rounded-3xl border border-zinc-800 overflow-hidden shadow-2xl">
                {iframeLoading && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center bg-zinc-950/80 backdrop-blur-sm z-10 space-y-3">
                    <RefreshCw className="h-8 w-8 text-primary animate-spin" />
                    <p className="text-xs text-zinc-400 font-mono">Routing through Cloudflare Named Tunnel...</p>
                  </div>
                )}
                <iframe
                  key={iframeKey}
                  src={session.url}
                  className="w-full h-full border-none"
                  onLoad={() => setIframeLoading(false)}
                  title="Live Container Sandbox"
                  allow="clipboard-read; clipboard-write; camera; microphone"
                />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ---------------- SECTION 2 (BELOW): PRECONFIGURED QUICK CLOUD SANDBOXES ---------------- */}
      {!session && (
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Zap className="text-primary" size={20} />
            <h3 className="text-xl font-extrabold text-zinc-900 dark:text-white tracking-tight">
              Quick Preconfigured Cloud Sandboxes
            </h3>
          </div>
          <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 font-light">
            One-click instant cloud developer environments with dedicated HTTPS tunnels on <code className="text-primary font-semibold">*.talhacodes.site</code>.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 pt-2">
            {/* VS Code Server Card */}
            <div className="p-6 rounded-3xl bg-white dark:bg-card-bg-2 border border-zinc-200 dark:border-zinc-800 flex flex-col justify-between gap-5 hover:border-primary/40 transition shadow-md group">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="p-3 rounded-2xl bg-blue-500/10 text-blue-500">
                    <Code2 size={24} />
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-md bg-blue-500/10 text-blue-500 border border-blue-500/20">
                    Cloud IDE
                  </span>
                </div>
                <h4 className="text-lg font-bold text-zinc-900 dark:text-white group-hover:text-primary transition-colors">
                  VS Code Server Sandbox
                </h4>
                <p className="text-xs text-zinc-500 dark:text-zinc-400 font-light leading-relaxed">
                  Full cloud-hosted Visual Studio Code with Monaco editor, terminal, Git integration, and extension marketplace support.
                </p>
              </div>

              <button
                onClick={() => launchQuickSandbox('vscode')}
                disabled={loading}
                className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-2xl text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-md transition active:scale-95 disabled:opacity-60"
              >
                <Play size={14} className="fill-current" />
                <span>Launch VS Code Server</span>
              </button>
            </div>

            {/* Web Terminal Card */}
            <div className="p-6 rounded-3xl bg-white dark:bg-card-bg-2 border border-zinc-200 dark:border-zinc-800 flex flex-col justify-between gap-5 hover:border-primary/40 transition shadow-md group">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="p-3 rounded-2xl bg-emerald-500/10 text-emerald-500">
                    <Terminal size={24} />
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-md bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
                    Ubuntu Shell
                  </span>
                </div>
                <h4 className="text-lg font-bold text-zinc-900 dark:text-white group-hover:text-primary transition-colors">
                  Ubuntu Web Terminal
                </h4>
                <p className="text-xs text-zinc-500 dark:text-zinc-400 font-light leading-relaxed">
                  Isolated Ubuntu Linux bash terminal preinstalled with curl, git, python, node, and standard developer tools.
                </p>
              </div>

              <button
                onClick={() => launchQuickSandbox('terminal')}
                disabled={loading}
                className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-2xl text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-md transition active:scale-95 disabled:opacity-60"
              >
                <Play size={14} className="fill-current" />
                <span>Launch Web Terminal</span>
              </button>
            </div>

            {/* Remote Chromium Browser Card */}
            <div className="p-6 rounded-3xl bg-white dark:bg-card-bg-2 border border-zinc-200 dark:border-zinc-800 flex flex-col justify-between gap-5 hover:border-primary/40 transition shadow-md group">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="p-3 rounded-2xl bg-amber-500/10 text-amber-500">
                    <Globe size={24} />
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-md bg-amber-500/10 text-amber-500 border border-amber-500/20">
                    CDP Browser
                  </span>
                </div>
                <h4 className="text-lg font-bold text-zinc-900 dark:text-white group-hover:text-primary transition-colors">
                  Remote Chromium Browser
                </h4>
                <p className="text-xs text-zinc-500 dark:text-zinc-400 font-light leading-relaxed">
                  Headless and GUI Chromium instance with real-time Chrome DevTools Protocol debugging and live browser screencasting.
                </p>
              </div>

              <button
                onClick={() => launchQuickSandbox('browser')}
                disabled={loading}
                className="w-full py-3 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-2xl text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-md transition active:scale-95 disabled:opacity-60"
              >
                <Play size={14} className="fill-current" />
                <span>Launch Remote Browser</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ---------------- VPS SECURITY & ISOLATION GUARANTEES ---------------- */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { icon: ShieldCheck, title: 'Non-Root Docker Isolation', desc: 'All containers execute in restricted namespaces with seccomp profile filtering.' },
          { icon: Clock, title: 'Automated 5-Min Reaper', desc: 'Background Go loop purges expired containers and removes Cloudflare DNS records.' },
          { icon: Server, title: 'Cloudflare Named Tunnels', desc: 'Zero open listening ports on VPS. All traffic routes through encrypted tunnels.' },
          { icon: Cpu, title: 'Cgroup Hard Ceilings', desc: 'Hard memory quotas (512MB–1GB) and CPU ceilings prevent host resource starvation.' },
        ].map((item, idx) => {
          const Icon = item.icon;
          return (
            <div key={idx} className="p-5 rounded-2xl bg-zinc-50 dark:bg-zinc-900/40 border border-zinc-200 dark:border-zinc-800/80 space-y-2">
              <div className="flex items-center gap-2 text-primary font-bold text-sm">
                <Icon size={18} /> {item.title}
              </div>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 font-light leading-relaxed">
                {item.desc}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
