'use client';

import { useState } from 'react';
import { FiShield, FiCheckCircle, FiCopy, FiGlobe, FiServer, FiLock, FiCalendar, FiFileText, FiCode } from 'react-icons/fi';

interface ResultViewerProps {
  data: any;
}

export function ResultViewer({ data }: ResultViewerProps) {
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [showRaw, setShowRaw] = useState(false);

  if (!data || typeof data !== 'object') return null;

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  // 1. If resultData is just standard job completion message for file downloads, don't show raw JSON
  if (data.message && data.downloadName && Object.keys(data).length <= 2) {
    return null;
  }

  // 2. SSL / TLS Certificate Inspector
  if (data.validTo || data.validFrom || (data.subject && data.issuer)) {
    const subjectCN = typeof data.subject === 'object' ? data.subject?.CN || JSON.stringify(data.subject) : data.subject;
    const issuerCN = typeof data.issuer === 'object' ? data.issuer?.CN || data.issuer?.O || JSON.stringify(data.issuer) : data.issuer;

    return (
      <div className="space-y-3 text-left">
        <div className="flex items-center justify-between p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-emerald-600 dark:text-emerald-400 text-xs font-bold">
          <span className="flex items-center gap-1.5">
            <FiLock size={15} /> SSL Certificate Valid & Active
          </span>
          <span className="px-2 py-0.5 rounded-md bg-emerald-500/20 text-[10px] uppercase font-mono">
            TLS / SSL
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
          <div className="p-3 bg-stone-50 dark:bg-zinc-950 border border-stone-200 dark:border-zinc-800 rounded-xl">
            <span className="text-[10px] font-bold uppercase text-stone-500 dark:text-zinc-400 block mb-1">
              Issued To (Domain)
            </span>
            <span className="font-mono font-bold text-stone-900 dark:text-white break-all">
              {subjectCN || 'N/A'}
            </span>
          </div>

          <div className="p-3 bg-stone-50 dark:bg-zinc-950 border border-stone-200 dark:border-zinc-800 rounded-xl">
            <span className="text-[10px] font-bold uppercase text-stone-500 dark:text-zinc-400 block mb-1">
              Issuer
            </span>
            <span className="font-mono font-bold text-stone-900 dark:text-white break-all">
              {issuerCN || 'N/A'}
            </span>
          </div>
        </div>

        {(data.validFrom || data.validTo) && (
          <div className="p-3 bg-stone-50 dark:bg-zinc-950 border border-stone-200 dark:border-zinc-800 rounded-xl text-xs space-y-1">
            <div className="flex items-center gap-1.5 text-stone-500 dark:text-zinc-400 font-semibold text-[11px]">
              <FiCalendar size={13} /> Validity Period
            </div>
            <div className="grid grid-cols-2 gap-2 pt-1 font-mono text-[11px] text-stone-800 dark:text-zinc-200">
              <div>
                <span className="text-[10px] text-stone-400 block uppercase font-sans">Valid From</span>
                {data.validFrom ? new Date(data.validFrom).toLocaleDateString(undefined, { dateStyle: 'medium' }) : 'N/A'}
              </div>
              <div>
                <span className="text-[10px] text-stone-400 block uppercase font-sans">Valid Until</span>
                {data.validTo ? new Date(data.validTo).toLocaleDateString(undefined, { dateStyle: 'medium' }) : 'N/A'}
              </div>
            </div>
          </div>
        )}

        {data.fingerprint && (
          <div className="p-2.5 bg-stone-50 dark:bg-zinc-950 border border-stone-200 dark:border-zinc-800 rounded-xl text-xs flex items-center justify-between gap-2">
            <div className="overflow-hidden">
              <span className="text-[10px] font-bold uppercase text-stone-400 block">SHA-1 Fingerprint</span>
              <span className="font-mono text-[11px] text-stone-700 dark:text-zinc-300 truncate block">
                {data.fingerprint}
              </span>
            </div>
            <button
              onClick={() => copyToClipboard(data.fingerprint, 'fp')}
              className="p-1.5 rounded-lg border border-stone-200 dark:border-zinc-800 hover:bg-stone-200 dark:hover:bg-zinc-800 text-stone-600 dark:text-zinc-400 shrink-0"
              title="Copy Fingerprint"
            >
              {copiedKey === 'fp' ? <FiCheckCircle size={14} className="text-emerald-500" /> : <FiCopy size={14} />}
            </button>
          </div>
        )}

        {data.serialNumber && (
          <div className="p-2.5 bg-stone-50 dark:bg-zinc-950 border border-stone-200 dark:border-zinc-800 rounded-xl text-xs flex items-center justify-between gap-2">
            <div className="overflow-hidden">
              <span className="text-[10px] font-bold uppercase text-stone-400 block">Serial Number</span>
              <span className="font-mono text-[11px] text-stone-700 dark:text-zinc-300 truncate block">
                {data.serialNumber}
              </span>
            </div>
            <button
              onClick={() => copyToClipboard(data.serialNumber, 'sn')}
              className="p-1.5 rounded-lg border border-stone-200 dark:border-zinc-800 hover:bg-stone-200 dark:hover:bg-zinc-800 text-stone-600 dark:text-zinc-400 shrink-0"
              title="Copy Serial Number"
            >
              {copiedKey === 'sn' ? <FiCheckCircle size={14} className="text-emerald-500" /> : <FiCopy size={14} />}
            </button>
          </div>
        )}
      </div>
    );
  }

  // 3. DNS Lookup Tool
  if (data.domain && (data.a || data.mx || data.txt || data.ns)) {
    return (
      <div className="space-y-3 text-left">
        <div className="flex items-center justify-between p-2.5 bg-stone-100 dark:bg-zinc-950 border border-stone-200 dark:border-zinc-800 rounded-xl text-xs">
          <span className="font-bold text-stone-700 dark:text-zinc-300 flex items-center gap-1.5">
            <FiGlobe size={14} /> Domain Records
          </span>
          <span className="font-mono font-bold text-primary">{data.domain}</span>
        </div>

        {Array.isArray(data.a) && data.a.length > 0 && (
          <div className="p-3 bg-stone-50 dark:bg-zinc-950 border border-stone-200 dark:border-zinc-800 rounded-xl">
            <span className="text-[10px] font-bold uppercase text-stone-500 dark:text-zinc-400 block mb-1.5">
              A Records (IPv4)
            </span>
            <div className="flex flex-wrap gap-1.5">
              {data.a.map((ip: string, idx: number) => (
                <span key={idx} className="font-mono text-xs px-2.5 py-1 rounded-md bg-stone-200 dark:bg-zinc-800 text-stone-900 dark:text-white font-semibold">
                  {ip}
                </span>
              ))}
            </div>
          </div>
        )}

        {Array.isArray(data.mx) && data.mx.length > 0 && (
          <div className="p-3 bg-stone-50 dark:bg-zinc-950 border border-stone-200 dark:border-zinc-800 rounded-xl">
            <span className="text-[10px] font-bold uppercase text-stone-500 dark:text-zinc-400 block mb-1.5">
              MX Records (Mail)
            </span>
            <div className="space-y-1">
              {data.mx.map((mx: any, idx: number) => (
                <div key={idx} className="font-mono text-xs flex justify-between p-1.5 rounded-lg bg-stone-200/50 dark:bg-zinc-800/50">
                  <span>{typeof mx === 'object' ? mx.exchange : mx}</span>
                  {typeof mx === 'object' && <span className="text-stone-500">Prio: {mx.priority}</span>}
                </div>
              ))}
            </div>
          </div>
        )}

        {Array.isArray(data.ns) && data.ns.length > 0 && (
          <div className="p-3 bg-stone-50 dark:bg-zinc-950 border border-stone-200 dark:border-zinc-800 rounded-xl">
            <span className="text-[10px] font-bold uppercase text-stone-500 dark:text-zinc-400 block mb-1.5">
              NS Records (Nameservers)
            </span>
            <div className="flex flex-wrap gap-1.5">
              {data.ns.map((ns: string, idx: number) => (
                <span key={idx} className="font-mono text-xs px-2 py-0.5 rounded bg-stone-200 dark:bg-zinc-800 text-stone-800 dark:text-zinc-200">
                  {ns}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }

  // 4. Readability Score
  if (data.readabilityScore !== undefined) {
    return (
      <div className="space-y-3 text-left">
        <div className="p-4 bg-stone-50 dark:bg-zinc-950 border border-stone-200 dark:border-zinc-800 rounded-2xl text-center space-y-2">
          <span className="text-[10px] uppercase font-bold text-stone-500 tracking-wider">Readability Score</span>
          <div className="text-3xl font-black text-primary">{data.readabilityScore} / 100</div>
          {data.gradeLevel && (
            <span className="inline-block px-3 py-1 bg-primary/10 text-primary text-xs font-bold rounded-full border border-primary/20">
              {data.gradeLevel}
            </span>
          )}
        </div>

        {Array.isArray(data.suggestions) && data.suggestions.length > 0 && (
          <div className="p-3 bg-stone-50 dark:bg-zinc-950 border border-stone-200 dark:border-zinc-800 rounded-xl text-xs">
            <span className="text-[10px] font-bold uppercase text-stone-500 block mb-2">Suggestions</span>
            <ul className="space-y-1 list-disc list-inside text-stone-700 dark:text-zinc-300">
              {data.suggestions.map((s: string, idx: number) => (
                <li key={idx}>{s}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    );
  }

  // 5. Generic Key-Value List + Optional Raw JSON Toggle
  const entries = Object.entries(data).filter(([key]) => key !== 'message' && key !== 'downloadName');

  return (
    <div className="space-y-3 text-left">
      <div className="grid grid-cols-1 gap-2 text-xs">
        {entries.map(([key, val]) => {
          const formattedVal = typeof val === 'object' ? JSON.stringify(val) : String(val);
          return (
            <div key={key} className="p-2.5 bg-stone-50 dark:bg-zinc-950 border border-stone-200 dark:border-zinc-800 rounded-xl flex items-center justify-between gap-3">
              <span className="text-[10px] font-bold uppercase text-stone-500 dark:text-zinc-400 shrink-0">
                {key.replace(/([A-Z])/g, ' $1').trim()}
              </span>
              <span className="font-mono text-xs font-semibold text-stone-900 dark:text-white truncate">
                {formattedVal}
              </span>
            </div>
          );
        })}
      </div>

      <div className="flex justify-end pt-1">
        <button
          onClick={() => setShowRaw(!showRaw)}
          className="inline-flex items-center gap-1 text-[11px] font-bold text-stone-500 hover:text-primary transition-colors"
        >
          <FiCode size={13} /> {showRaw ? 'Hide Raw JSON' : 'Show Raw JSON'}
        </button>
      </div>

      {showRaw && (
        <div className="p-3 bg-stone-900 text-stone-200 rounded-xl font-mono text-[11px] overflow-auto max-h-48">
          <pre>{JSON.stringify(data, null, 2)}</pre>
        </div>
      )}
    </div>
  );
}
