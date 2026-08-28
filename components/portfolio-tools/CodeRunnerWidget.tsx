"use client";

import React, { useState } from 'react';
import { 
  Play, 
  Terminal, 
  Code2, 
  Clock, 
  Copy, 
  Check, 
  RotateCcw, 
  Loader2, 
  AlertCircle, 
  CheckCircle,
  FileCode,
  Zap,
  Cpu
} from 'lucide-react';

const PRESETS: Record<string, { label: string; lang: 'python' | 'node' | 'shell'; code: string }> = {
  python_math: {
    label: 'Python: Factorial Matrix',
    lang: 'python',
    code: `import math\nimport time\n\nstart = time.time()\nfactorials = {n: math.factorial(n) for n in range(1, 15)}\nprint("Computed Factorials (1..14):")\nfor k, v in factorials.items():\n    print(f"  {k}! = {v}")\n\nprint(f"\\nExecution time: {(time.time() - start)*1000:.2f}ms")`,
  },
  node_async: {
    label: 'Node.js: Async Event Loop Bench',
    lang: 'node',
    code: `const start = process.hrtime.bigint();\n\nconst tasks = Array.from({ length: 5 }, (_, i) => \n  new Promise(resolve => setTimeout(() => resolve(\`Task \${i+1} completed\`), 20 * (i + 1)))\n);\n\nPromise.all(tasks).then(results => {\n  console.log("Async Pipeline Output:");\n  results.forEach(r => console.log(" •", r));\n  const elapsed = Number(process.hrtime.bigint() - start) / 1e6;\n  console.log(\`\\nAll async promises settled in \${elapsed.toFixed(2)}ms\`);\n});`,
  },
  shell_sys: {
    label: 'Shell: Isolated Kernel & Env',
    lang: 'shell',
    code: `echo "=== Sandboxed Container Environment ==="\necho "User: $(whoami)"\necho "Uptime: $(uptime)"\necho "Architecture: $(uname -m)"\necho "Available Memory: $(free -m 2>/dev/null || cat /proc/meminfo | grep MemTotal)"\necho "Current Working Dir: $(pwd)"`,
  },
};

export function CodeRunnerWidget() {
  const [lang, setLang] = useState<'python' | 'node' | 'shell'>('python');
  const [code, setCode] = useState<string>(PRESETS.python_math.code);
  const [timeout, setTimeoutSecs] = useState<number>(15);
  const [loading, setLoading] = useState(false);
  const [stdout, setStdout] = useState<string | null>(null);
  const [stderr, setStderr] = useState<string | null>(null);
  const [durationMs, setDurationMs] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const handleRunCode = async () => {
    if (!code.trim()) {
      setError('Please write or paste code to execute.');
      return;
    }

    setLoading(true);
    setError(null);
    setStdout(null);
    setStderr(null);
    setDurationMs(null);

    try {
      const response = await fetch('/api/portfolio/code/exec', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          lang,
          code,
          timeout,
        }),
      });

      const data = await response.json();
      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Code execution failed in container.');
      }

      setStdout(data.stdout || '');
      setStderr(data.stderr || '');
      setDurationMs(data.durationMs ?? 0);
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Execution error in sandbox.');
    } finally {
      setLoading(false);
    }
  };

  const loadPreset = (presetKey: string) => {
    const p = PRESETS[presetKey];
    if (p) {
      setLang(p.lang);
      setCode(p.code);
      setStdout(null);
      setStderr(null);
      setError(null);
    }
  };

  const copyOutput = () => {
    if (stdout || stderr) {
      navigator.clipboard.writeText((stdout || '') + (stderr ? '\n[STDERR]: ' + stderr : ''));
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="w-full space-y-8">
      {/* Code Runner Card */}
      <div className="p-6 md:p-8 rounded-3xl bg-white dark:bg-card-bg-2 border border-zinc-200 dark:border-zinc-800 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-48 h-48 bg-primary/10 rounded-full blur-3xl pointer-events-none" />

        <div className="space-y-6 relative z-10">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-100 dark:border-zinc-800/80 pb-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold uppercase tracking-wider mb-2">
                <Cpu size={14} /> Ephemeral Docker Execution Engine
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-zinc-900 dark:text-white tracking-tight">
                Sandboxed Polyglot Code Runner
              </h2>
              <p className="text-sm text-zinc-500 dark:text-zinc-400 font-light mt-1">
                Execute Python, Node.js, and Shell scripts in an isolated, secure container with strict cgroups and execution timeouts.
              </p>
            </div>

            {/* Language Switch */}
            <div className="flex items-center p-1 rounded-xl bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shrink-0">
              {[
                { id: 'python', label: 'Python 3' },
                { id: 'node', label: 'Node.js' },
                { id: 'shell', label: 'Bash' },
              ].map((l) => (
                <button
                  key={l.id}
                  type="button"
                  onClick={() => setLang(l.id as any)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                    lang === l.id
                      ? 'bg-primary text-white shadow-sm'
                      : 'text-zinc-500 hover:text-zinc-900 dark:hover:text-white'
                  }`}
                >
                  {l.label}
                </button>
              ))}
            </div>
          </div>

          {/* Presets Bar */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-bold uppercase text-zinc-400 mr-1">Presets:</span>
            {Object.entries(PRESETS).map(([key, p]) => (
              <button
                key={key}
                type="button"
                onClick={() => loadPreset(key)}
                className="px-3 py-1 rounded-lg bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-xs font-medium text-zinc-600 dark:text-zinc-400 hover:text-primary hover:border-primary/40 transition"
              >
                {p.label}
              </button>
            ))}
          </div>

          {/* Editor Window */}
          <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 overflow-hidden bg-zinc-950 shadow-2xl">
            <div className="flex items-center justify-between px-4 py-2.5 bg-zinc-900 border-b border-zinc-800 text-xs text-zinc-400 font-mono">
              <div className="flex items-center gap-2">
                <div className="flex gap-1.5">
                  <span className="w-3 h-3 rounded-full bg-rose-500/80 inline-block" />
                  <span className="w-3 h-3 rounded-full bg-amber-500/80 inline-block" />
                  <span className="w-3 h-3 rounded-full bg-emerald-500/80 inline-block" />
                </div>
                <span className="text-zinc-500 ml-2">script.{lang === 'python' ? 'py' : lang === 'node' ? 'js' : 'sh'}</span>
              </div>
              <span className="text-[11px] text-zinc-500 uppercase">{lang}</span>
            </div>

            <textarea
              value={code}
              onChange={(e) => setCode(e.target.value)}
              disabled={loading}
              rows={10}
              className="w-full p-4 bg-transparent text-zinc-100 font-mono text-xs sm:text-sm leading-relaxed resize-y focus:outline-none focus:ring-0 selection:bg-primary/30"
              spellCheck={false}
            />
          </div>

          {/* Controls */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3 w-full sm:w-auto">
              <span className="text-xs font-semibold text-zinc-500">Timeout:</span>
              <select
                value={timeout}
                onChange={(e) => setTimeoutSecs(Number(e.target.value))}
                className="px-3 py-1.5 bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl text-xs font-bold text-zinc-900 dark:text-white"
              >
                <option value={5}>5 seconds</option>
                <option value={15}>15 seconds</option>
                <option value={30}>30 seconds</option>
              </select>
            </div>

            <button
              onClick={handleRunCode}
              disabled={loading}
              className="w-full sm:w-auto h-12 bg-primary hover:bg-primary-hover text-white font-bold rounded-2xl px-8 flex items-center justify-center gap-2 shadow-lg hover:shadow-[0_0_20px_rgba(var(--primary-rgb),0.35)] active:scale-98 transition duration-200 disabled:opacity-60"
            >
              {loading ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  <span>Executing in Sandbox Container...</span>
                </>
              ) : (
                <>
                  <Play size={16} className="fill-current" />
                  <span>Run Code</span>
                </>
              )}
            </button>
          </div>

          {error && (
            <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-400 flex items-start gap-3 text-xs sm:text-sm">
              <AlertCircle className="h-5 w-5 shrink-0 mt-0.5" />
              <div>{error}</div>
            </div>
          )}

          {/* Execution Output Console */}
          {(stdout !== null || stderr !== null) && (
            <div className="space-y-2 pt-4 border-t border-zinc-100 dark:border-zinc-800 animate-fadeIn">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Terminal size={16} className="text-primary" />
                  <h3 className="text-xs font-bold uppercase text-zinc-900 dark:text-white tracking-wider">
                    Console Output
                  </h3>
                  {durationMs !== null && (
                    <span className="text-[10px] font-mono text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                      ⚡ {durationMs}ms
                    </span>
                  )}
                </div>

                <button
                  onClick={copyOutput}
                  className="flex items-center gap-1 text-xs text-zinc-400 hover:text-primary transition"
                >
                  {copied ? <Check size={14} className="text-emerald-500" /> : <Copy size={14} />}
                  <span>{copied ? 'Copied' : 'Copy Output'}</span>
                </button>
              </div>

              <div className="p-4 rounded-2xl bg-zinc-950 border border-zinc-800 text-xs font-mono text-zinc-200 overflow-x-auto space-y-2 shadow-inner">
                {stdout && (
                  <pre className="whitespace-pre-wrap text-emerald-400 leading-relaxed">{stdout}</pre>
                )}
                {stderr && (
                  <pre className="whitespace-pre-wrap text-rose-400 border-t border-zinc-800 pt-2">{stderr}</pre>
                )}
                {!stdout && !stderr && (
                  <span className="text-zinc-600 italic">(Process exited with no output)</span>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
