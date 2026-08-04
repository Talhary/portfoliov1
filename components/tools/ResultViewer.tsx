'use client';

import { useState } from 'react';
import {
  FiCheckCircle,
  FiCopy,
  FiGlobe,
  FiLock,
  FiCalendar,
  FiCode,
  FiTerminal,
  FiActivity,
} from 'react-icons/fi';

interface ResultViewerProps {
  data: any;
}

// Helper to parse WHOIS raw text into structured key-value pairs
function parseWhoisRaw(rawText: string) {
  if (!rawText || typeof rawText !== 'string') return null;

  const result: {
    domainName?: string;
    registrar?: string;
    creationDate?: string;
    expiryDate?: string;
    updatedDate?: string;
    registrantOrg?: string;
    nameServers: string[];
    statusList: string[];
  } = {
    nameServers: [],
    statusList: [],
  };

  const lines = rawText.split(/\r?\n/);
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('%') || trimmed.startsWith('#')) continue;

    const colonIdx = trimmed.indexOf(':');
    if (colonIdx === -1) continue;

    const key = trimmed.substring(0, colonIdx).trim().toLowerCase();
    const value = trimmed.substring(colonIdx + 1).trim();
    if (!value) continue;

    if (key.includes('name server') || key === 'nserver') {
      const nsClean = value.split(' ')[0].toLowerCase();
      if (nsClean && !result.nameServers.includes(nsClean)) {
        result.nameServers.push(nsClean);
      }
    } else if (key.includes('domain status') || key === 'status') {
      const cleanStatus = value.split(' ')[0];
      if (cleanStatus && !result.statusList.includes(cleanStatus)) {
        result.statusList.push(cleanStatus);
      }
    } else if (key === 'domain name' && !result.domainName) {
      result.domainName = value;
    } else if (key === 'registrar' && !result.registrar) {
      result.registrar = value;
    } else if ((key.includes('creation date') || key.includes('created')) && !result.creationDate) {
      result.creationDate = value;
    } else if ((key.includes('expiry date') || key.includes('expiration date') || key.includes('expires')) && !result.expiryDate) {
      result.expiryDate = value;
    } else if ((key.includes('updated date') || key.includes('last updated')) && !result.updatedDate) {
      result.updatedDate = value;
    } else if ((key.includes('registrant organization') || key === 'org') && !result.registrantOrg) {
      result.registrantOrg = value;
    }
  }

  return result;
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

  // 1. WHOIS Domain Lookup Result Handler
  if (data.raw && typeof data.raw === 'string' && (data.domain || data.raw.toLowerCase().includes('domain name'))) {
    const parsed = parseWhoisRaw(data.raw);

    return (
      <div className="space-y-4 text-left">
        {/* Parsed WHOIS Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
          <div className="p-3 bg-stone-50 dark:bg-zinc-950 border border-stone-200 dark:border-zinc-800 rounded-xl">
            <span className="text-[10px] font-bold uppercase text-stone-500 dark:text-zinc-400 block mb-1">
              Domain Name
            </span>
            <span className="font-mono font-bold text-primary break-all">
              {parsed?.domainName || data.domain || 'N/A'}
            </span>
          </div>

          <div className="p-3 bg-stone-50 dark:bg-zinc-950 border border-stone-200 dark:border-zinc-800 rounded-xl">
            <span className="text-[10px] font-bold uppercase text-stone-500 dark:text-zinc-400 block mb-1">
              Registrar
            </span>
            <span className="font-mono font-bold text-stone-900 dark:text-white break-all">
              {parsed?.registrar || 'N/A'}
            </span>
          </div>

          {parsed?.creationDate && (
            <div className="p-3 bg-stone-50 dark:bg-zinc-950 border border-stone-200 dark:border-zinc-800 rounded-xl">
              <span className="text-[10px] font-bold uppercase text-stone-500 dark:text-zinc-400 block mb-1">
                Creation Date
              </span>
              <span className="font-mono text-stone-800 dark:text-zinc-200">
                {parsed.creationDate}
              </span>
            </div>
          )}

          {parsed?.expiryDate && (
            <div className="p-3 bg-stone-50 dark:bg-zinc-950 border border-stone-200 dark:border-zinc-800 rounded-xl">
              <span className="text-[10px] font-bold uppercase text-stone-500 dark:text-zinc-400 block mb-1">
                Expiry Date
              </span>
              <span className="font-mono text-stone-800 dark:text-zinc-200">
                {parsed.expiryDate}
              </span>
            </div>
          )}
        </div>

        {/* Name Servers */}
        {parsed?.nameServers && parsed.nameServers.length > 0 && (
          <div className="p-3 bg-stone-50 dark:bg-zinc-950 border border-stone-200 dark:border-zinc-800 rounded-xl text-xs">
            <span className="text-[10px] font-bold uppercase text-stone-500 dark:text-zinc-400 block mb-1.5">
              Nameservers
            </span>
            <div className="flex flex-wrap gap-1.5">
              {parsed.nameServers.map((ns, i) => (
                <span key={i} className="font-mono text-[11px] px-2 py-0.5 rounded bg-stone-200 dark:bg-zinc-800 text-stone-800 dark:text-zinc-200">
                  {ns}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Domain Status */}
        {parsed?.statusList && parsed.statusList.length > 0 && (
          <div className="p-3 bg-stone-50 dark:bg-zinc-950 border border-stone-200 dark:border-zinc-800 rounded-xl text-xs">
            <span className="text-[10px] font-bold uppercase text-stone-500 dark:text-zinc-400 block mb-1.5">
              Domain Status
            </span>
            <div className="flex flex-wrap gap-1">
              {parsed.statusList.map((st, i) => (
                <span key={i} className="font-mono text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400">
                  {st}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Formatted Raw WHOIS Text Container */}
        <div className="space-y-1.5 pt-1">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase text-stone-500 dark:text-zinc-400 flex items-center gap-1">
              <FiTerminal size={13} /> Full Raw WHOIS Record
            </span>
            <button
              onClick={() => copyToClipboard(data.raw, 'whois-raw')}
              className="text-[11px] font-bold text-primary hover:underline flex items-center gap-1"
            >
              {copiedKey === 'whois-raw' ? <FiCheckCircle size={13} /> : <FiCopy size={13} />}
              {copiedKey === 'whois-raw' ? 'Copied' : 'Copy Record'}
            </button>
          </div>
          <pre className="p-3.5 bg-stone-900 text-stone-200 rounded-2xl font-mono text-[11px] leading-relaxed overflow-x-auto max-h-64 overflow-y-auto whitespace-pre-wrap border border-stone-800">
            {data.raw}
          </pre>
        </div>
      </div>
    );
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
      </div>
    );
  }

  // 3. Ping & Traceroute Tool
  if (data.ping || data.traceroute) {
    return (
      <div className="space-y-4 text-left">
        <div className="flex items-center justify-between p-2.5 bg-stone-100 dark:bg-zinc-950 border border-stone-200 dark:border-zinc-800 rounded-xl text-xs font-bold">
          <span className="flex items-center gap-1.5 text-stone-700 dark:text-zinc-300">
            <FiActivity size={15} /> Network Latency & Diagnostic
          </span>
          <span className="font-mono text-primary">{data.host}</span>
        </div>

        {data.ping && (
          <div className="space-y-1.5">
            <div className="flex justify-between items-center text-[11px] font-bold uppercase text-stone-500">
              <span>Ping Results</span>
              <button onClick={() => copyToClipboard(data.ping, 'ping')} className="text-primary hover:underline flex items-center gap-1">
                {copiedKey === 'ping' ? <FiCheckCircle size={12} /> : <FiCopy size={12} />} Copy Ping
              </button>
            </div>
            <pre className="p-3 bg-stone-900 text-stone-200 rounded-xl font-mono text-[11px] overflow-x-auto max-h-48 whitespace-pre-wrap border border-stone-800">
              {data.ping}
            </pre>
          </div>
        )}

        {data.traceroute && (
          <div className="space-y-1.5">
            <div className="flex justify-between items-center text-[11px] font-bold uppercase text-stone-500">
              <span>Traceroute Hops</span>
              <button onClick={() => copyToClipboard(data.traceroute, 'trace')} className="text-primary hover:underline flex items-center gap-1">
                {copiedKey === 'trace' ? <FiCheckCircle size={12} /> : <FiCopy size={12} />} Copy Traceroute
              </button>
            </div>
            <pre className="p-3 bg-stone-900 text-stone-200 rounded-xl font-mono text-[11px] overflow-x-auto max-h-48 whitespace-pre-wrap border border-stone-800">
              {data.traceroute}
            </pre>
          </div>
        )}
      </div>
    );
  }

  // 4. Port Scanner Tool
  if (data.ports && Array.isArray(data.ports)) {
    return (
      <div className="space-y-3 text-left">
        <div className="flex items-center justify-between p-3 bg-stone-100 dark:bg-zinc-950 border border-stone-200 dark:border-zinc-800 rounded-xl text-xs">
          <span className="font-bold text-stone-700 dark:text-zinc-300">
            Target Host: <span className="font-mono text-primary">{data.target}</span>
          </span>
          <span className="px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold font-mono text-[11px]">
            {data.openCount || 0} Ports Open
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {data.ports.map((p: any) => (
            <div
              key={p.port}
              className={`p-2.5 rounded-xl border flex items-center justify-between text-xs ${
                p.status === 'open'
                  ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-700 dark:text-emerald-400'
                  : 'bg-stone-50 dark:bg-zinc-950 border-stone-200 dark:border-zinc-800 text-stone-500'
              }`}
            >
              <div>
                <span className="font-mono font-bold block">{p.port}</span>
                <span className="text-[10px] opacity-75">{p.name}</span>
              </div>
              <span
                className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase font-mono ${
                  p.status === 'open' ? 'bg-emerald-500/20 text-emerald-600' : 'bg-stone-200 dark:bg-zinc-800 text-stone-500'
                }`}
              >
                {p.status}
              </span>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // 5. DNS Lookup Tool
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

  // 6. Page Speed Estimator
  if (data.score !== undefined && data.responseTimeMs !== undefined) {
    return (
      <div className="space-y-3 text-left">
        <div className="p-4 bg-stone-50 dark:bg-zinc-950 border border-stone-200 dark:border-zinc-800 rounded-2xl text-center space-y-1">
          <span className="text-[10px] uppercase font-bold text-stone-500 tracking-wider">Estimated Performance Score</span>
          <div className="text-4xl font-black text-primary">{data.score} / 100</div>
          <span className="inline-block px-3 py-0.5 bg-emerald-500/10 text-emerald-600 text-xs font-bold rounded-full">
            {data.score >= 80 ? 'Fast Response' : 'Moderate Speed'}
          </span>
        </div>

        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="p-3 bg-stone-50 dark:bg-zinc-950 border border-stone-200 dark:border-zinc-800 rounded-xl">
            <span className="text-[10px] font-bold uppercase text-stone-400 block">Server Response Time</span>
            <span className="font-mono font-bold text-stone-900 dark:text-white">{data.responseTimeMs} ms</span>
          </div>
          <div className="p-3 bg-stone-50 dark:bg-zinc-950 border border-stone-200 dark:border-zinc-800 rounded-xl">
            <span className="text-[10px] font-bold uppercase text-stone-400 block">Page Size</span>
            <span className="font-mono font-bold text-stone-900 dark:text-white">{data.pageSizeKb} KB</span>
          </div>
        </div>

        {data.estimates && (
          <div className="p-3 bg-stone-50 dark:bg-zinc-950 border border-stone-200 dark:border-zinc-800 rounded-xl text-xs space-y-1">
            <span className="text-[10px] font-bold uppercase text-stone-500 block mb-1">Estimated Load Time</span>
            <div className="grid grid-cols-3 gap-1 font-mono text-center text-[11px]">
              <div className="p-1.5 bg-stone-200/50 dark:bg-zinc-900 rounded-lg">
                <span className="text-[9px] text-stone-400 block font-sans">3G Network</span>
                {data.estimates.slow3g}
              </div>
              <div className="p-1.5 bg-stone-200/50 dark:bg-zinc-900 rounded-lg">
                <span className="text-[9px] text-stone-400 block font-sans">4G LTE</span>
                {data.estimates.fast4g}
              </div>
              <div className="p-1.5 bg-stone-200/50 dark:bg-zinc-900 rounded-lg">
                <span className="text-[9px] text-stone-400 block font-sans">WiFi / Fiber</span>
                {data.estimates.wifi}
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // 7. SEO Audits & Health Score
  if (data.overallScore !== undefined && Array.isArray(data.audits)) {
    return (
      <div className="space-y-3 text-left">
        <div className="p-4 bg-stone-50 dark:bg-zinc-950 border border-stone-200 dark:border-zinc-800 rounded-2xl text-center space-y-1">
          <span className="text-[10px] uppercase font-bold text-stone-500 tracking-wider">SEO Audit Health Score</span>
          <div className="text-4xl font-black text-primary">{data.overallScore} / 100</div>
          <span className="inline-block px-3 py-0.5 bg-primary/10 text-primary text-xs font-bold rounded-full">
            Grade {data.grade}
          </span>
        </div>

        <div className="space-y-1.5">
          {data.audits.map((a: any, idx: number) => (
            <div key={idx} className="p-2.5 bg-stone-50 dark:bg-zinc-950 border border-stone-200 dark:border-zinc-800 rounded-xl flex items-center justify-between text-xs">
              <span className="font-semibold text-stone-800 dark:text-zinc-200">{a.test}</span>
              <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase font-mono ${a.status === 'PASS' ? 'bg-emerald-500/20 text-emerald-600' : 'bg-rose-500/20 text-rose-600'}`}>
                {a.status}
              </span>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // 8. Readability Score
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

  // 9. OCR Extracted Text
  if (data.extractedText) {
    return (
      <div className="space-y-3 text-left">
        <div className="flex justify-between items-center">
          <span className="text-xs font-bold uppercase text-stone-500">Extracted Text</span>
          <button onClick={() => copyToClipboard(data.extractedText, 'ocr')} className="text-xs font-bold text-primary hover:underline flex items-center gap-1">
            {copiedKey === 'ocr' ? <FiCheckCircle size={13} /> : <FiCopy size={13} />} {copiedKey === 'ocr' ? 'Copied' : 'Copy Text'}
          </button>
        </div>
        <pre className="p-3.5 bg-stone-900 text-stone-200 rounded-xl font-mono text-xs overflow-x-auto max-h-60 whitespace-pre-wrap">
          {data.extractedText}
        </pre>
      </div>
    );
  }

  // 10. Default / Fallback Key-Value Display with Multiline Text Formatting
  const entries = Object.entries(data).filter(([key]) => key !== 'message' && key !== 'downloadName');

  return (
    <div className="space-y-3 text-left">
      <div className="grid grid-cols-1 gap-2 text-xs">
        {entries.map(([key, val]) => {
          const isMultiline = typeof val === 'string' && (val.includes('\n') || val.length > 80);
          const formattedVal = typeof val === 'object' ? JSON.stringify(val, null, 2) : String(val);

          if (isMultiline || typeof val === 'object') {
            return (
              <div key={key} className="p-3 bg-stone-50 dark:bg-zinc-950 border border-stone-200 dark:border-zinc-800 rounded-xl space-y-1.5">
                <div className="flex justify-between items-center">
                  <span className="text-[10px] font-bold uppercase text-stone-500 dark:text-zinc-400">
                    {key.replace(/([A-Z])/g, ' $1').trim()}
                  </span>
                  <button onClick={() => copyToClipboard(formattedVal, key)} className="text-[11px] text-primary hover:underline flex items-center gap-1">
                    {copiedKey === key ? <FiCheckCircle size={12} /> : <FiCopy size={12} />} Copy
                  </button>
                </div>
                <pre className="p-2.5 bg-stone-900 text-stone-200 rounded-lg font-mono text-[11px] leading-relaxed overflow-x-auto max-h-48 whitespace-pre-wrap">
                  {formattedVal}
                </pre>
              </div>
            );
          }

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
