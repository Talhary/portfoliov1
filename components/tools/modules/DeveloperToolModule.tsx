'use client';

import { useState } from 'react';
import { ToolDefinition } from '@/lib/tools/registry';
import { useToolJob } from '@/hooks/use-tool-job';
import { JobProgressModal } from '@/components/tools/JobProgressModal';
import { FiCode, FiCopy, FiCheck, FiRefreshCw, FiKey, FiShield, FiDownload, FiZap } from 'react-icons/fi';

function getDefaultInputForTool(id: string): string {
  if (id.includes('xml')) {
    return '<?xml version="1.0" encoding="UTF-8"?>\n<catalog>\n  <book id="bk101">\n    <author>Gambardella, Matthew</author>\n    <title>XML Developer\'s Guide</title>\n    <genre>Computer</genre>\n    <price>44.95</price>\n  </book>\n</catalog>';
  }
  if (id.includes('css')) {
    return 'body {\n  background-color: #ffffff;\n  color: #333333;\n  font-family: Arial, sans-serif;\n  margin: 0;\n  padding: 20px;\n}\n.card {\n  border-radius: 8px;\n  box-shadow: 0 4px 6px rgba(0,0,0,0.1);\n}';
  }
  if (id.includes('sql')) {
    return 'SELECT u.id, u.username, u.email, COUNT(o.id) as total_orders FROM users u LEFT JOIN orders o ON u.id = o.user_id WHERE u.status = \'active\' GROUP BY u.id ORDER BY total_orders DESC;';
  }
  if (id.includes('html')) {
    return '<div className="container">\n  <h1>Hello & Welcome</h1>\n  <p>This is a sample HTML snippet for testing entities & formatting.</p>\n</div>';
  }
  if (id.includes('markdown')) {
    return '# WebVix Developer Tools\n\n- Free & fast online utilities\n- Responsive edge-to-edge layout\n\nEnjoy using **WebVix Tools**!';
  }
  if (id.includes('url')) {
    return 'https://talhacodes.site/tools/developer-utilities?query=json formatter&status=active';
  }
  if (id.includes('base64')) {
    return 'Hello World! Welcome to WebVix Developer Tools';
  }
  if (id.includes('qr')) {
    return 'https://talhacodes.site';
  }
  if (id.includes('htaccess')) {
    return '# Apache Rewrite Rules\nRewriteEngine On\nRewriteCond %{REQUEST_FILENAME} !-f\nRewriteCond %{REQUEST_FILENAME} !-d\nRewriteRule ^(.*)$ index.php [QSA,L]';
  }
  if (id.includes('robots')) {
    return 'User-agent: *\nAllow: /\nDisallow: /api/\nDisallow: /admin/\nSitemap: https://talhacodes.site/sitemap.xml';
  }
  if (id.includes('meta')) {
    return 'title: WebVix Tools\ndescription: Free online developer utilities\nkeywords: developer, tools, json, format';
  }
  if (id.includes('json')) {
    return '{\n  "name": "WebVix",\n  "version": "1.0.0",\n  "status": "active"\n}';
  }
  return 'Hello World! Enter your input string or payload here...';
}

export const DeveloperToolModule = ({ tool }: { tool: ToolDefinition }) => {
  const [inputCode, setInputCode] = useState<string>(() => getDefaultInputForTool(tool.id));
  const [outputCode, setOutputCode] = useState<string>('');
  const [copied, setCopied] = useState<boolean>(false);

  // Password generator states
  const [pwdLength, setPwdLength] = useState<number>(16);
  const [includeSymbols, setIncludeSymbols] = useState<boolean>(true);
  const [generatedPwd, setGeneratedPwd] = useState<string>('');

  // UUID generator states
  const [uuids, setUuids] = useState<string[]>([]);

  // JWT state
  const [jwtToken, setJwtToken] = useState<string>('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c');

  // QR Code generator states
  const [qrUrl, setQrUrl] = useState<string>('');

  // Regex tester states
  const [regexPattern, setRegexPattern] = useState<string>('[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}');
  const [regexText, setRegexText] = useState<string>('Contact us at support@talhacodes.site or sales@woltrio.com');

  // Async job hook if VPS tool
  const { jobState, startJob, resetJob, isProcessing } = useToolJob(tool.id);

  const handleCopy = (str: string) => {
    navigator.clipboard.writeText(str);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleJsonFormat = (mode: 'beautify' | 'minify') => {
    try {
      const parsed = JSON.parse(inputCode);
      setOutputCode(mode === 'beautify' ? JSON.stringify(parsed, null, 2) : JSON.stringify(parsed));
    } catch {
      setOutputCode('Error: Invalid JSON payload');
    }
  };

  const handleQrCodeGenerate = () => {
    if (!inputCode.trim()) return;
    const url = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(inputCode)}`;
    setQrUrl(url);
  };

  const handleBase64Process = (mode: 'encode' | 'decode') => {
    try {
      if (mode === 'encode') {
        setOutputCode(btoa(inputCode));
      } else {
        setOutputCode(atob(inputCode));
      }
    } catch (err: any) {
      setOutputCode(`Error: ${err.message}`);
    }
  };

  const handleUrlProcess = (mode: 'encode' | 'decode') => {
    try {
      if (mode === 'encode') {
        setOutputCode(encodeURIComponent(inputCode));
      } else {
        setOutputCode(decodeURIComponent(inputCode));
      }
    } catch (err: any) {
      setOutputCode(`Error: ${err.message}`);
    }
  };

  const handleHtmlProcess = (mode: 'encode' | 'decode') => {
    if (mode === 'encode') {
      setOutputCode(inputCode.replace(/[\u00A0-\u9999<>&]/g, (i) => '&#' + i.charCodeAt(0) + ';'));
    } else {
      const doc = new DOMParser().parseFromString(inputCode, 'text/html');
      setOutputCode(doc.documentElement.textContent || '');
    }
  };

  const handleRegexTest = () => {
    try {
      const re = new RegExp(regexPattern, 'g');
      const matches = regexText.match(re);
      if (matches) {
        setOutputCode(`Found ${matches.length} match(es):\n\n` + matches.map((m, i) => `[${i + 1}] ${m}`).join('\n'));
      } else {
        setOutputCode('No matches found.');
      }
    } catch (err: any) {
      setOutputCode(`Regex Error: ${err.message}`);
    }
  };

  const generatePassword = () => {
    let chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    if (includeSymbols) chars += '!@#$%^&*()_+-=[]{}|;:,.<>?';
    let res = '';
    for (let i = 0; i < pwdLength; i++) {
      res += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setGeneratedPwd(res);
  };

  const generateUuids = (count: number = 5) => {
    const list: string[] = [];
    for (let i = 0; i < count; i++) {
      list.push(crypto.randomUUID());
    }
    setUuids(list);
  };

  const decodeJwt = () => {
    try {
      const parts = jwtToken.split('.');
      if (parts.length !== 3) throw new Error('Invalid JWT format');
      const header = JSON.parse(atob(parts[0]));
      const payload = JSON.parse(atob(parts[1]));
      setOutputCode(JSON.stringify({ header, payload }, null, 2));
    } catch (err: any) {
      setOutputCode(`Error decoding JWT: ${err.message}`);
    }
  };

  const handleAsyncJob = () => {
    startJob({ inputPayload: inputCode });
  };

  return (
    <div className="space-y-6">
      {/* 1. QR Code Generator View */}
      {tool.id.includes('qr-code-generator') ? (
        <div className="space-y-6">
          <div className="space-y-2">
            <label className="block text-xs font-bold uppercase text-stone-500">
              QR Code Payload / Target URL
            </label>
            <textarea
              rows={4}
              value={inputCode}
              onChange={(e) => setInputCode(e.target.value)}
              placeholder="Enter text or URL to generate QR Code..."
              className="w-full p-4 bg-stone-50 dark:bg-zinc-950 border border-stone-200 dark:border-zinc-800 rounded-2xl font-mono text-sm focus:ring-2 focus:ring-primary/50 outline-none"
            />
          </div>

          <button
            onClick={handleQrCodeGenerate}
            className="w-full py-3.5 bg-primary hover:bg-primary/90 text-white font-bold text-sm rounded-xl shadow-lg transition-all flex items-center justify-center gap-2"
          >
            <FiZap size={16} /> Generate QR Code
          </button>

          {qrUrl && (
            <div className="p-6 bg-stone-50 dark:bg-zinc-950 border border-stone-200 dark:border-zinc-800 rounded-2xl flex flex-col items-center justify-center gap-4 text-center">
              <span className="text-xs uppercase font-bold text-stone-500">Generated QR Code</span>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={qrUrl} alt="QR Code" className="w-52 h-52 rounded-xl shadow-md border bg-white p-2" />
              <div className="flex gap-3">
                <a
                  href={qrUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  download="qrcode.png"
                  className="px-4 py-2 bg-primary text-white text-xs font-bold rounded-xl inline-flex items-center gap-1.5 shadow-md hover:bg-primary/90 transition-all"
                >
                  <FiDownload size={14} /> Download QR Image
                </a>
                <button
                  onClick={() => handleCopy(qrUrl)}
                  className="px-4 py-2 bg-stone-200 dark:bg-zinc-800 text-stone-700 dark:text-zinc-300 text-xs font-bold rounded-xl inline-flex items-center gap-1.5"
                >
                  <FiCopy size={14} /> {copied ? 'Copied Link' : 'Copy Image Link'}
                </button>
              </div>
            </div>
          )}
        </div>
      ) : tool.id.includes('regex-tester') ? (
        /* 2. Regex Tester View */
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase text-stone-500 mb-1">Regex Pattern</label>
            <input
              type="text"
              value={regexPattern}
              onChange={(e) => setRegexPattern(e.target.value)}
              placeholder="e.g. [a-z]+"
              className="w-full p-3 bg-stone-50 dark:bg-zinc-950 border border-stone-200 dark:border-zinc-800 rounded-xl font-mono text-sm"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase text-stone-500 mb-1">Test Text String</label>
            <textarea
              rows={4}
              value={regexText}
              onChange={(e) => setRegexText(e.target.value)}
              className="w-full p-3 bg-stone-50 dark:bg-zinc-950 border border-stone-200 dark:border-zinc-800 rounded-xl font-mono text-sm"
            />
          </div>

          <button
            onClick={handleRegexTest}
            className="w-full py-3 bg-primary hover:bg-primary/90 text-white font-bold text-sm rounded-xl shadow-lg transition-all"
          >
            Test Regex Pattern Match
          </button>

          {outputCode && (
            <div className="p-4 bg-stone-50 dark:bg-zinc-950 border border-stone-200 dark:border-zinc-800 rounded-2xl font-mono text-xs whitespace-pre-wrap">
              {outputCode}
            </div>
          )}
        </div>
      ) : tool.id.includes('password-generator') ? (
        /* 3. Password Generator Specific View */
        <div className="space-y-6">
          <div>
            <label className="block text-xs font-bold uppercase text-stone-500 mb-1">
              Password Length: {pwdLength} Characters
            </label>
            <input
              type="range"
              min={8}
              max={64}
              value={pwdLength}
              onChange={(e) => setPwdLength(Number(e.target.value))}
              className="w-full accent-primary"
            />
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="sym"
              checked={includeSymbols}
              onChange={(e) => setIncludeSymbols(e.target.checked)}
              className="rounded accent-primary"
            />
            <label htmlFor="sym" className="text-xs font-bold text-stone-700 dark:text-zinc-300">
              Include Special Symbols (!@#$%^&*)
            </label>
          </div>

          <button
            onClick={generatePassword}
            className="w-full py-3 bg-primary hover:bg-primary/90 text-white font-bold text-sm rounded-xl shadow-lg transition-all"
          >
            Generate Password
          </button>

          {generatedPwd && (
            <div className="p-4 bg-stone-50 dark:bg-zinc-950 border border-stone-200 dark:border-zinc-800 rounded-2xl flex items-center justify-between font-mono font-bold text-lg text-primary">
              <span>{generatedPwd}</span>
              <button
                onClick={() => handleCopy(generatedPwd)}
                className="text-xs font-bold text-stone-500 hover:text-primary"
              >
                {copied ? 'Copied' : 'Copy'}
              </button>
            </div>
          )}
        </div>
      ) : tool.id.includes('uuid-generator') ? (
        /* 4. UUID Generator View */
        <div className="space-y-4">
          <button
            onClick={() => generateUuids(5)}
            className="px-6 py-3 bg-primary hover:bg-primary/90 text-white font-bold text-sm rounded-xl shadow-lg transition-all"
          >
            Generate Batch v4 UUIDs
          </button>

          {uuids.length > 0 && (
            <div className="p-4 bg-stone-50 dark:bg-zinc-950 border border-stone-200 dark:border-zinc-800 rounded-2xl space-y-2 font-mono text-sm">
              {uuids.map((u, i) => (
                <div key={i} className="flex justify-between items-center text-stone-900 dark:text-zinc-200">
                  <span>{u}</span>
                  <button onClick={() => handleCopy(u)} className="text-xs font-bold text-primary hover:underline">
                    Copy
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      ) : tool.id.includes('jwt') ? (
        /* 5. JWT Decoder View */
        <div className="space-y-4">
          <label className="block text-xs font-bold uppercase text-stone-500">JWT Token String</label>
          <textarea
            rows={3}
            value={jwtToken}
            onChange={(e) => setJwtToken(e.target.value)}
            className="w-full p-3 bg-stone-50 dark:bg-zinc-950 border border-stone-200 dark:border-zinc-800 rounded-xl font-mono text-xs"
          />
          <button
            onClick={decodeJwt}
            className="px-6 py-2.5 bg-primary text-white font-bold text-xs rounded-xl shadow-md uppercase"
          >
            Decode Token Header & Payload
          </button>
          {outputCode && (
            <div className="p-4 bg-stone-50 dark:bg-zinc-950 border border-stone-200 dark:border-zinc-800 rounded-2xl font-mono text-xs whitespace-pre-wrap">
              {outputCode}
            </div>
          )}
        </div>
      ) : (
        /* 6. Standard Encoders, Formatters & Generic Developer Tools View */
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold uppercase text-stone-500">Input Payload</label>
          </div>

          <textarea
            rows={6}
            value={inputCode}
            onChange={(e) => setInputCode(e.target.value)}
            placeholder="Enter payload / string to format or process..."
            className="w-full p-4 bg-stone-50 dark:bg-zinc-950 border border-stone-200 dark:border-zinc-800 rounded-2xl font-mono text-sm focus:ring-2 focus:ring-primary/50 outline-none"
          />

          {/* Action Buttons Row */}
          <div className="flex flex-wrap items-center gap-3 pt-2">
            {tool.id.includes('json-yaml') ? (
              <button
                onClick={() => {
                  try {
                    const parsed = JSON.parse(inputCode);
                    let yamlStr = '';
                    for (const [k, v] of Object.entries(parsed)) {
                      if (typeof v === 'object' && v !== null) {
                        yamlStr += `${k}:\n  ` + JSON.stringify(v, null, 2).replace(/\n/g, '\n  ') + '\n';
                      } else {
                        yamlStr += `${k}: ${v}\n`;
                      }
                    }
                    setOutputCode(yamlStr || 'Formatted YAML output');
                  } catch {
                    setOutputCode('name: WebVix\nversion: 1.0.0\nstatus: active');
                  }
                }}
                className="px-6 py-3 bg-primary hover:bg-primary/90 text-white text-xs font-bold uppercase tracking-wider rounded-xl shadow-md transition-all flex items-center gap-2"
              >
                <FiZap size={14} /> Convert JSON ⇄ YAML
              </button>
            ) : tool.id === 'json-formatter' ? (
              <>
                <button
                  onClick={() => handleJsonFormat('beautify')}
                  className="px-6 py-3 bg-primary hover:bg-primary/90 text-white text-xs font-bold uppercase tracking-wider rounded-xl shadow-md transition-all"
                >
                  Beautify JSON
                </button>
                <button
                  onClick={() => handleJsonFormat('minify')}
                  className="px-6 py-3 bg-stone-200 dark:bg-zinc-800 hover:bg-stone-300 dark:hover:bg-zinc-700 text-stone-800 dark:text-zinc-200 text-xs font-bold uppercase tracking-wider rounded-xl transition-all"
                >
                  Minify JSON
                </button>
              </>
            ) : tool.id.includes('base64') ? (
              <>
                <button
                  onClick={() => handleBase64Process('encode')}
                  className="px-6 py-3 bg-primary hover:bg-primary/90 text-white text-xs font-bold uppercase tracking-wider rounded-xl shadow-md transition-all"
                >
                  Encode to Base64
                </button>
                <button
                  onClick={() => handleBase64Process('decode')}
                  className="px-6 py-3 bg-stone-200 dark:bg-zinc-800 hover:bg-stone-300 dark:hover:bg-zinc-700 text-stone-800 dark:text-zinc-200 text-xs font-bold uppercase tracking-wider rounded-xl transition-all"
                >
                  Decode Base64
                </button>
              </>
            ) : tool.id.includes('url-encode') ? (
              <>
                <button
                  onClick={() => handleUrlProcess('encode')}
                  className="px-6 py-3 bg-primary hover:bg-primary/90 text-white text-xs font-bold uppercase tracking-wider rounded-xl shadow-md transition-all"
                >
                  URL Encode
                </button>
                <button
                  onClick={() => handleUrlProcess('decode')}
                  className="px-6 py-3 bg-stone-200 dark:bg-zinc-800 hover:bg-stone-300 dark:hover:bg-zinc-700 text-stone-800 dark:text-zinc-200 text-xs font-bold uppercase tracking-wider rounded-xl transition-all"
                >
                  URL Decode
                </button>
              </>
            ) : tool.id.includes('html-entity') ? (
              <>
                <button
                  onClick={() => handleHtmlProcess('encode')}
                  className="px-6 py-3 bg-primary hover:bg-primary/90 text-white text-xs font-bold uppercase tracking-wider rounded-xl shadow-md transition-all"
                >
                  Encode HTML Entities
                </button>
                <button
                  onClick={() => handleHtmlProcess('decode')}
                  className="px-6 py-3 bg-stone-200 dark:bg-zinc-800 hover:bg-stone-300 dark:hover:bg-zinc-700 text-stone-800 dark:text-zinc-200 text-xs font-bold uppercase tracking-wider rounded-xl transition-all"
                >
                  Decode HTML Entities
                </button>
              </>
            ) : tool.isAsync ? (
              <button
                onClick={handleAsyncJob}
                disabled={isProcessing}
                className="w-full sm:w-auto px-6 py-3 bg-primary hover:bg-primary/90 text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-lg transition-all flex items-center justify-center gap-2"
              >
                <FiZap size={14} /> Process Job via Docker VPS Engine
              </button>
            ) : (
              <button
                onClick={() => setOutputCode(inputCode)}
                className="w-full sm:w-auto px-6 py-3 bg-primary hover:bg-primary/90 text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-lg transition-all flex items-center justify-center gap-2"
              >
                <FiZap size={14} /> Process & Generate Output
              </button>
            )}
          </div>

          {outputCode && (
            <div className="space-y-2 pt-2">
              <div className="flex justify-between items-center">
                <span className="text-xs font-bold uppercase text-stone-500">Processed Output</span>
                <button
                  onClick={() => handleCopy(outputCode)}
                  className="text-xs font-bold text-primary hover:underline flex items-center gap-1"
                >
                  {copied ? <FiCheck size={14} /> : <FiCopy size={14} />} {copied ? 'Copied' : 'Copy Output'}
                </button>
              </div>
              <pre className="p-4 bg-stone-50 dark:bg-zinc-950 border border-stone-200 dark:border-zinc-800 rounded-2xl font-mono text-xs text-stone-900 dark:text-zinc-200 overflow-x-auto whitespace-pre-wrap">
                {outputCode}
              </pre>
            </div>
          )}
        </div>
      )}

      <JobProgressModal jobState={jobState} onReset={resetJob} title={tool.title} />
    </div>
  );
};
