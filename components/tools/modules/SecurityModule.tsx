'use client';

import { useState } from 'react';
import { ToolDefinition } from '@/lib/tools/registry';
import { useToolJob } from '@/hooks/use-tool-job';
import { JobProgressModal } from '@/components/tools/JobProgressModal';
import { FiShield, FiLock, FiGlobe, FiKey, FiServer } from 'react-icons/fi';

export const SecurityModule = ({ tool }: { tool: ToolDefinition }) => {
  const [domainInput, setDomainInput] = useState<string>('google.com');
  const [passwordInput, setPasswordInput] = useState<string>('P@ssw0rd2026!');

  const { jobState, startJob, resetJob, isProcessing } = useToolJob(tool.id);

  // Compute password strength
  const getPasswordScore = (pass: string) => {
    let score = 0;
    if (pass.length > 8) score += 25;
    if (pass.length > 12) score += 25;
    if (/[A-Z]/.test(pass)) score += 15;
    if (/[0-9]/.test(pass)) score += 15;
    if (/[^A-Za-z0-9]/.test(pass)) score += 20;
    return Math.min(100, score);
  };

  const pwdScore = getPasswordScore(passwordInput);
  const pwdLabel = pwdScore < 40 ? 'Weak' : pwdScore < 70 ? 'Medium' : pwdScore < 90 ? 'Strong' : 'Very Strong';

  const handleRunSecurityJob = () => {
    if (!domainInput) return;
    startJob({ domain: domainInput, ip: domainInput });
  };

  return (
    <div className="space-y-6">
      {tool.id === 'password-strength-meter' ? (
        <div className="space-y-6">
          <div>
            <label className="block text-xs font-bold uppercase text-stone-500 mb-1">Evaluate Password</label>
            <input
              type="text"
              value={passwordInput}
              onChange={(e) => setPasswordInput(e.target.value)}
              className="w-full p-4 bg-stone-50 dark:bg-zinc-950 border border-stone-200 dark:border-zinc-800 rounded-2xl font-mono text-base font-bold"
            />
          </div>

          <div className="p-6 bg-stone-50 dark:bg-zinc-950 border border-stone-200 dark:border-zinc-800 rounded-2xl space-y-3">
            <div className="flex justify-between items-center text-xs font-bold uppercase">
              <span>Security Score</span>
              <span className={pwdScore > 60 ? 'text-emerald-500' : 'text-rose-500'}>{pwdLabel} ({pwdScore}%)</span>
            </div>
            <div className="w-full h-3 bg-stone-200 dark:bg-zinc-800 rounded-full overflow-hidden">
              <div
                className={`h-full transition-all duration-300 ${
                  pwdScore < 40 ? 'bg-rose-500' : pwdScore < 70 ? 'bg-amber-500' : 'bg-emerald-500'
                }`}
                style={{ width: `${pwdScore}%` }}
              />
            </div>
          </div>
        </div>
      ) : (
        /* Network & Security Tools (DNS / SSL / WHOIS / IP) */
        <div className="space-y-6">
          <div>
            <label className="block text-xs font-bold uppercase text-stone-500 mb-1">
              Target Domain or IP Address
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={domainInput}
                onChange={(e) => setDomainInput(e.target.value)}
                placeholder="e.g. example.com or 8.8.8.8"
                className="w-full p-3.5 bg-stone-50 dark:bg-zinc-950 border border-stone-200 dark:border-zinc-800 rounded-xl font-mono text-sm font-bold"
              />
              <button
                onClick={handleRunSecurityJob}
                disabled={isProcessing}
                className="px-6 py-3.5 bg-primary hover:bg-primary/90 text-white font-bold text-xs rounded-xl shadow-lg uppercase whitespace-nowrap"
              >
                Inspect Network
              </button>
            </div>
          </div>

          <JobProgressModal jobState={jobState} onReset={resetJob} title={tool.title} />
        </div>
      )}
    </div>
  );
};
