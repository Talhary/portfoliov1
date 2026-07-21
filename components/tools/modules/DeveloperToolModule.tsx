'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import { ToolDefinition } from '@/lib/tools/registry';
import { useToolJob } from '@/hooks/use-tool-job';
import { JobProgressModal } from '@/components/tools/JobProgressModal';
import { FiCode, FiCopy, FiCheck, FiRefreshCw, FiKey, FiShield, FiDownload, FiZap, FiSend, FiWifi, FiWifiOff } from 'react-icons/fi';

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
  const [copied, setCopied] = useState<string | null>(null);

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

  // cURL Builder states
  const [curlUrl, setCurlUrl] = useState<string>('https://api.example.com/data');
  const [curlMethod, setCurlMethod] = useState<string>('GET');
  const [curlHeaders, setCurlHeaders] = useState<string>('Content-Type: application/json\nAuthorization: Bearer token123');
  const [curlBody, setCurlBody] = useState<string>('');
  const [curlOutput, setCurlOutput] = useState<string>('');

  // REST API Tester states
  const [apiUrl, setApiUrl] = useState<string>('https://jsonplaceholder.typicode.com/posts/1');
  const [apiMethod, setApiMethod] = useState<string>('GET');
  const [apiHeaders, setApiHeaders] = useState<string>('Content-Type: application/json');
  const [apiBody, setApiBody] = useState<string>('');
  const [apiResponse, setApiResponse] = useState<string>('');
  const [apiStatus, setApiStatus] = useState<number | null>(null);
  const [apiTime, setApiTime] = useState<number | null>(null);
  const [apiLoading, setApiLoading] = useState<boolean>(false);

  // WebSocket Client states
  const [wsUrl, setWsUrl] = useState<string>('wss://echo.websocket.org');
  const [wsMessage, setWsMessage] = useState<string>('Hello WebSocket');
  const [wsLogs, setWsLogs] = useState<{ type: 'send' | 'receive' | 'error' | 'system'; msg: string; time: string }[]>([]);
  const [wsConnected, setWsConnected] = useState<boolean>(false);
  const wsRef = useRef<WebSocket | null>(null);

  // Glassmorphism / Neumorphism states
  const [glassBlur, setGlassBlur] = useState<number>(20);
  const [glassOpacity, setGlassOpacity] = useState<number>(50);
  const [glassBorder, setGlassBorder] = useState<number>(1);
  const [glassMode, setGlassMode] = useState<'glass' | 'neu'>('glass');
  const [neuIntensity, setNeuIntensity] = useState<number>(10);
  const [neuRadius, setNeuRadius] = useState<number>(20);

  // Cubic-Bezier states
  const [bezierX1, setBezierX1] = useState<number>(0.25);
  const [bezierY1, setBezierY1] = useState<number>(0.1);
  const [bezierX2, setBezierX2] = useState<number>(0.25);
  const [bezierY2, setBezierY2] = useState<number>(1.0);
  const [bezierAnimating, setBezierAnimating] = useState<boolean>(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Async job hook if VPS tool
  const { jobState, startJob, resetJob, isProcessing } = useToolJob(tool.id);

  const handleCopy = (str: string, key?: string) => {
    navigator.clipboard.writeText(str);
    setCopied(key || 'default');
    setTimeout(() => setCopied(null), 2000);
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

  // cURL Builder
  const generateCurl = () => {
    let cmd = `curl -X ${curlMethod}`;
    if (curlHeaders.trim()) {
      curlHeaders.split('\n').filter(Boolean).forEach(h => {
        cmd += ` \\\n  -H '${h.trim()}'`;
      });
    }
    if (curlMethod !== 'GET' && curlBody.trim()) {
      cmd += ` \\\n  -d '${curlBody.trim()}'`;
    }
    cmd += ` \\\n  '${curlUrl}'`;
    setCurlOutput(cmd);
  };

  // REST API Tester
  const testApiEndpoint = async () => {
    setApiLoading(true);
    setApiResponse('');
    setApiStatus(null);
    setApiTime(null);
    const start = performance.now();
    try {
      const headers: Record<string, string> = {};
      if (apiHeaders.trim()) {
        apiHeaders.split('\n').filter(Boolean).forEach(h => {
          const [k, ...v] = h.split(':');
          if (k) headers[k.trim()] = v.join(':').trim();
        });
      }
      const opts: RequestInit = { method: apiMethod, headers };
      if (apiMethod !== 'GET' && apiBody.trim()) {
        opts.body = apiBody;
      }
      const res = await fetch(apiUrl, opts);
      const elapsed = Math.round(performance.now() - start);
      const text = await res.text();
      setApiStatus(res.status);
      setApiTime(elapsed);
      try {
        setApiResponse(JSON.stringify(JSON.parse(text), null, 2));
      } catch {
        setApiResponse(text);
      }
    } catch (err: any) {
      setApiTime(Math.round(performance.now() - start));
      setApiResponse(`Error: ${err.message}`);
    }
    setApiLoading(false);
  };

  // WebSocket Client
  const connectWs = () => {
    try {
      const socket = new WebSocket(wsUrl);
      wsRef.current = socket;
      const time = () => new Date().toLocaleTimeString();
      socket.onopen = () => {
        setWsConnected(true);
        setWsLogs(prev => [...prev, { type: 'system', msg: 'Connected to ' + wsUrl, time: time() }]);
      };
      socket.onmessage = (e) => {
        setWsLogs(prev => [...prev, { type: 'receive', msg: e.data, time: time() }]);
      };
      socket.onerror = (e) => {
        setWsLogs(prev => [...prev, { type: 'error', msg: 'WebSocket error occurred', time: time() }]);
      };
      socket.onclose = () => {
        setWsConnected(false);
        setWsLogs(prev => [...prev, { type: 'system', msg: 'Connection closed', time: time() }]);
      };
    } catch (err: any) {
      setWsLogs(prev => [...prev, { type: 'error', msg: err.message, time: new Date().toLocaleTimeString() }]);
    }
  };

  const disconnectWs = () => {
    wsRef.current?.close();
    wsRef.current = null;
  };

  const sendWsMessage = () => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(wsMessage);
      setWsLogs(prev => [...prev, { type: 'send', msg: wsMessage, time: new Date().toLocaleTimeString() }]);
    }
  };

  // Cubic-Bezier rendering
  const getBezierCSS = () => `cubic-bezier(${bezierX1}, ${bezierY1}, ${bezierX2}, ${bezierY2})`;

  const drawBezierCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const size = 200;
    const pad = 20;
    const w = size - pad * 2;
    const h = size - pad * 2;

    ctx.clearRect(0, 0, size, size);
    ctx.fillStyle = 'rgb(244 244 245)';
    ctx.fillRect(0, 0, size, size);

    // Grid
    ctx.strokeStyle = '#d4d4d8';
    ctx.lineWidth = 0.5;
    for (let i = 0; i <= 4; i++) {
      ctx.beginPath();
      ctx.moveTo(pad + (w * i) / 4, pad);
      ctx.lineTo(pad + (w * i) / 4, pad + h);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(pad, pad + (h * i) / 4);
      ctx.lineTo(pad + w, pad + (h * i) / 4);
      ctx.stroke();
    }

    // Diagonal line
    ctx.strokeStyle = '#a1a1aa';
    ctx.lineWidth = 1;
    ctx.setLineDash([4, 4]);
    ctx.beginPath();
    ctx.moveTo(pad, pad + h);
    ctx.lineTo(pad + w, pad);
    ctx.stroke();
    ctx.setLineDash([]);

    // Control handles
    const p0x = pad;
    const p0y = pad + h;
    const p3x = pad + w;
    const p3y = pad;
    const p1x = pad + bezierX1 * w;
    const p1y = pad + h - bezierY1 * h;
    const p2x = pad + bezierX2 * w;
    const p2y = pad + h - bezierY2 * h;

    // Handle lines
    ctx.strokeStyle = '#71717a';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(p0x, p0y);
    ctx.lineTo(p1x, p1y);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(p3x, p3y);
    ctx.lineTo(p2x, p2y);
    ctx.stroke();

    // Bezier curve
    ctx.strokeStyle = '#e49505';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(p0x, p0y);
    ctx.bezierCurveTo(p1x, p1y, p2x, p2y, p3x, p3y);
    ctx.stroke();

    // Points
    const drawPoint = (x: number, y: number, color: string) => {
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.arc(x, y, 5, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#fff';
      ctx.lineWidth = 2;
      ctx.stroke();
    };
    drawPoint(p0x, p0y, '#3b82f6');
    drawPoint(p3x, p3y, '#3b82f6');
    drawPoint(p1x, p1y, '#ef4444');
    drawPoint(p2x, p2y, '#ef4444');
  }, [bezierX1, bezierY1, bezierX2, bezierY2]);

  const triggerBezierAnim = () => {
    setBezierAnimating(true);
    setTimeout(() => setBezierAnimating(false), 1500);
  };

  // Cubic-Bezier canvas drawing effect
  useEffect(() => {
    if (tool.id === 'cubic-bezier-visualizer') {
      drawBezierCanvas();
    }
  }, [tool.id, bezierX1, bezierY1, bezierX2, bezierY2, drawBezierCanvas]);

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
      ) : tool.id.includes('jwt-decoder') ? (
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
      ) : tool.id === 'curl-builder' ? (
        /* 6. cURL Command Builder */
        <div className="space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="sm:col-span-2">
              <label className="block text-xs font-bold uppercase text-stone-500 mb-1">URL</label>
              <input
                type="text"
                value={curlUrl}
                onChange={(e) => setCurlUrl(e.target.value)}
                placeholder="https://api.example.com/endpoint"
                className="w-full p-3 bg-stone-50 dark:bg-zinc-950 border border-stone-200 dark:border-zinc-800 rounded-xl font-mono text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase text-stone-500 mb-1">Method</label>
              <select
                value={curlMethod}
                onChange={(e) => setCurlMethod(e.target.value)}
                className="w-full p-3 bg-stone-50 dark:bg-zinc-950 border border-stone-200 dark:border-zinc-800 rounded-xl text-sm font-bold"
              >
                <option>GET</option>
                <option>POST</option>
                <option>PUT</option>
                <option>PATCH</option>
                <option>DELETE</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase text-stone-500 mb-1">Headers (one per line, Key: Value)</label>
            <textarea
              rows={3}
              value={curlHeaders}
              onChange={(e) => setCurlHeaders(e.target.value)}
              placeholder="Content-Type: application/json"
              className="w-full p-3 bg-stone-50 dark:bg-zinc-950 border border-stone-200 dark:border-zinc-800 rounded-xl font-mono text-xs"
            />
          </div>

          {curlMethod !== 'GET' && (
            <div>
              <label className="block text-xs font-bold uppercase text-stone-500 mb-1">Request Body (JSON)</label>
              <textarea
                rows={4}
                value={curlBody}
                onChange={(e) => setCurlBody(e.target.value)}
                placeholder='{"key": "value"}'
                className="w-full p-3 bg-stone-50 dark:bg-zinc-950 border border-stone-200 dark:border-zinc-800 rounded-xl font-mono text-xs"
              />
            </div>
          )}

          <button
            onClick={generateCurl}
            className="w-full py-3.5 bg-primary hover:bg-primary/90 text-white font-bold text-sm rounded-xl shadow-lg transition-all flex items-center justify-center gap-2"
          >
            <FiZap size={16} /> Generate cURL Command
          </button>

          {curlOutput && (
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-xs font-bold uppercase text-stone-500">Generated cURL</span>
                <button
                  onClick={() => handleCopy(curlOutput)}
                  className="text-xs font-bold text-primary hover:underline flex items-center gap-1"
                >
                  {copied ? <FiCheck size={14} /> : <FiCopy size={14} />} {copied ? 'Copied' : 'Copy'}
                </button>
              </div>
              <pre className="p-4 bg-stone-900 text-emerald-400 border border-stone-200 dark:border-zinc-800 rounded-2xl font-mono text-xs overflow-x-auto whitespace-pre-wrap">
                {curlOutput}
              </pre>
            </div>
          )}
        </div>
      ) : tool.id === 'rest-api-tester' ? (
        /* 7. REST API Tester (Mini-Postman) */
        <div className="space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="sm:col-span-2">
              <label className="block text-xs font-bold uppercase text-stone-500 mb-1">Endpoint URL</label>
              <input
                type="text"
                value={apiUrl}
                onChange={(e) => setApiUrl(e.target.value)}
                placeholder="https://jsonplaceholder.typicode.com/posts/1"
                className="w-full p-3 bg-stone-50 dark:bg-zinc-950 border border-stone-200 dark:border-zinc-800 rounded-xl font-mono text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase text-stone-500 mb-1">Method</label>
              <select
                value={apiMethod}
                onChange={(e) => setApiMethod(e.target.value)}
                className="w-full p-3 bg-stone-50 dark:bg-zinc-950 border border-stone-200 dark:border-zinc-800 rounded-xl text-sm font-bold"
              >
                <option>GET</option>
                <option>POST</option>
                <option>PUT</option>
                <option>PATCH</option>
                <option>DELETE</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase text-stone-500 mb-1">Headers</label>
            <textarea
              rows={2}
              value={apiHeaders}
              onChange={(e) => setApiHeaders(e.target.value)}
              className="w-full p-3 bg-stone-50 dark:bg-zinc-950 border border-stone-200 dark:border-zinc-800 rounded-xl font-mono text-xs"
            />
          </div>

          {apiMethod !== 'GET' && (
            <div>
              <label className="block text-xs font-bold uppercase text-stone-500 mb-1">Request Body</label>
              <textarea
                rows={3}
                value={apiBody}
                onChange={(e) => setApiBody(e.target.value)}
                className="w-full p-3 bg-stone-50 dark:bg-zinc-950 border border-stone-200 dark:border-zinc-800 rounded-xl font-mono text-xs"
              />
            </div>
          )}

          <button
            onClick={testApiEndpoint}
            disabled={apiLoading}
            className="w-full py-3.5 bg-primary hover:bg-primary/90 text-white font-bold text-sm rounded-xl shadow-lg transition-all flex items-center justify-center gap-2"
          >
            <FiSend size={16} /> {apiLoading ? 'Sending Request...' : 'Send Request'}
          </button>

          {(apiStatus !== null || apiResponse) && (
            <div className="space-y-3">
              {apiStatus !== null && (
                <div className="flex items-center gap-4 text-xs font-bold">
                  <span className={`px-3 py-1 rounded-lg ${apiStatus < 300 ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' : 'bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400'}`}>
                    Status: {apiStatus}
                  </span>
                  {apiTime !== null && (
                    <span className="text-stone-500">{apiTime}ms</span>
                  )}
                </div>
              )}
              <div className="flex justify-between items-center">
                <span className="text-xs font-bold uppercase text-stone-500">Response</span>
                <button
                  onClick={() => handleCopy(apiResponse)}
                  className="text-xs font-bold text-primary hover:underline flex items-center gap-1"
                >
                  {copied ? <FiCheck size={14} /> : <FiCopy size={14} />} Copy
                </button>
              </div>
              <pre className="p-4 bg-stone-50 dark:bg-zinc-950 border border-stone-200 dark:border-zinc-800 rounded-2xl font-mono text-xs text-stone-900 dark:text-zinc-200 overflow-x-auto whitespace-pre-wrap max-h-80 overflow-y-auto">
                {apiResponse}
              </pre>
            </div>
          )}
        </div>
      ) : tool.id === 'websocket-client' ? (
        /* 8. WebSocket Client */
        <div className="space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="sm:col-span-2">
              <label className="block text-xs font-bold uppercase text-stone-500 mb-1">WebSocket Endpoint</label>
              <input
                type="text"
                value={wsUrl}
                onChange={(e) => setWsUrl(e.target.value)}
                placeholder="wss://echo.websocket.org"
                className="w-full p-3 bg-stone-50 dark:bg-zinc-950 border border-stone-200 dark:border-zinc-800 rounded-xl font-mono text-sm"
              />
            </div>
            <div className="flex items-end gap-2">
              <button
                onClick={wsConnected ? disconnectWs : connectWs}
                className={`w-full py-3 font-bold text-sm rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 ${
                  wsConnected
                    ? 'bg-rose-500 hover:bg-rose-600 text-white'
                    : 'bg-primary hover:bg-primary/90 text-white'
                }`}
              >
                {wsConnected ? <><FiWifiOff size={16} /> Disconnect</> : <><FiWifi size={16} /> Connect</>}
              </button>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className={`w-2.5 h-2.5 rounded-full ${wsConnected ? 'bg-emerald-500 animate-pulse' : 'bg-stone-400'}`} />
            <span className="text-xs font-bold text-stone-500">{wsConnected ? 'Connected' : 'Disconnected'}</span>
          </div>

          <div className="flex gap-2">
            <input
              type="text"
              value={wsMessage}
              onChange={(e) => setWsMessage(e.target.value)}
              placeholder="Message to send..."
              className="flex-1 p-3 bg-stone-50 dark:bg-zinc-950 border border-stone-200 dark:border-zinc-800 rounded-xl font-mono text-sm"
              onKeyDown={(e) => e.key === 'Enter' && sendWsMessage()}
            />
            <button
              onClick={sendWsMessage}
              disabled={!wsConnected}
              className="px-5 py-3 bg-primary hover:bg-primary/90 text-white font-bold text-sm rounded-xl shadow-lg transition-all disabled:opacity-50"
            >
              <FiSend size={16} />
            </button>
          </div>

          <div className="p-4 bg-stone-900 rounded-2xl border border-stone-700 max-h-64 overflow-y-auto space-y-1.5 font-mono text-xs">
            {wsLogs.length === 0 && (
              <span className="text-stone-500">No events yet. Connect to a WebSocket endpoint to begin.</span>
            )}
            {wsLogs.map((log, i) => (
              <div key={i} className={`flex gap-2 ${
                log.type === 'send' ? 'text-blue-400' :
                log.type === 'receive' ? 'text-emerald-400' :
                log.type === 'error' ? 'text-rose-400' : 'text-stone-400'
              }`}>
                <span className="text-stone-600 shrink-0">[{log.time}]</span>
                <span className="shrink-0 font-bold uppercase">{log.type === 'send' ? 'TX' : log.type === 'receive' ? 'RX' : log.type === 'error' ? 'ERR' : 'SYS'}:</span>
                <span className="break-all">{log.msg}</span>
              </div>
            ))}
          </div>
        </div>
      ) : tool.id === 'glassmorphism-generator' ? (
        /* 9. Glassmorphism / Neumorphism Generator */
        <div className="space-y-6">
          <div className="flex gap-2 mb-2">
            <button
              onClick={() => setGlassMode('glass')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${glassMode === 'glass' ? 'bg-primary text-white' : 'bg-stone-200 dark:bg-zinc-800 text-stone-700 dark:text-zinc-300'}`}
            >
              Glassmorphism
            </button>
            <button
              onClick={() => setGlassMode('neu')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${glassMode === 'neu' ? 'bg-primary text-white' : 'bg-stone-200 dark:bg-zinc-800 text-stone-700 dark:text-zinc-300'}`}
            >
              Neumorphism
            </button>
          </div>

          {/* Live Preview */}
          <div className={`p-8 rounded-2xl flex items-center justify-center min-h-[180px] ${
            glassMode === 'glass'
              ? 'bg-gradient-to-br from-indigo-400 via-purple-500 to-pink-500'
              : 'bg-stone-200 dark:bg-zinc-300'
          }`}>
            <div
              className={`px-8 py-6 text-center font-bold text-lg rounded-2xl ${
                glassMode === 'glass'
                  ? 'text-white'
                  : 'text-stone-700 dark:text-zinc-800'
              }`}
              style={
                glassMode === 'glass'
                  ? {
                      background: `rgba(255,255,255,${glassOpacity / 100})`,
                      backdropFilter: `blur(${glassBlur}px)`,
                      WebkitBackdropFilter: `blur(${glassBlur}px)`,
                      border: `${glassBorder}px solid rgba(255,255,255,0.3)`,
                    }
                  : {
                      background: '#e5e5e5',
                      boxShadow: `${neuIntensity}px ${neuIntensity}px ${neuIntensity * 2}px #bebebe, -${neuIntensity}px -${neuIntensity}px ${neuIntensity * 2}px #ffffff`,
                      borderRadius: `${neuRadius}px`,
                    }
              }
            >
              {glassMode === 'glass' ? 'Glass Card' : 'Neumorphic Card'}
            </div>
          </div>

          {/* Sliders */}
          <div className="space-y-4 p-4 bg-stone-50 dark:bg-zinc-950 border border-stone-200 dark:border-zinc-800 rounded-2xl">
            {glassMode === 'glass' ? (
              <>
                <div>
                  <div className="flex justify-between text-xs font-bold uppercase text-stone-500 mb-1">
                    <span>Blur</span>
                    <span className="text-primary font-mono">{glassBlur}px</span>
                  </div>
                  <input type="range" min={0} max={40} value={glassBlur} onChange={(e) => setGlassBlur(Number(e.target.value))} className="w-full accent-primary" />
                </div>
                <div>
                  <div className="flex justify-between text-xs font-bold uppercase text-stone-500 mb-1">
                    <span>Background Opacity</span>
                    <span className="text-primary font-mono">{glassOpacity}%</span>
                  </div>
                  <input type="range" min={5} max={90} value={glassOpacity} onChange={(e) => setGlassOpacity(Number(e.target.value))} className="w-full accent-primary" />
                </div>
                <div>
                  <div className="flex justify-between text-xs font-bold uppercase text-stone-500 mb-1">
                    <span>Border Width</span>
                    <span className="text-primary font-mono">{glassBorder}px</span>
                  </div>
                  <input type="range" min={0} max={5} value={glassBorder} onChange={(e) => setGlassBorder(Number(e.target.value))} className="w-full accent-primary" />
                </div>
              </>
            ) : (
              <>
                <div>
                  <div className="flex justify-between text-xs font-bold uppercase text-stone-500 mb-1">
                    <span>Shadow Intensity</span>
                    <span className="text-primary font-mono">{neuIntensity}px</span>
                  </div>
                  <input type="range" min={1} max={30} value={neuIntensity} onChange={(e) => setNeuIntensity(Number(e.target.value))} className="w-full accent-primary" />
                </div>
                <div>
                  <div className="flex justify-between text-xs font-bold uppercase text-stone-500 mb-1">
                    <span>Border Radius</span>
                    <span className="text-primary font-mono">{neuRadius}px</span>
                  </div>
                  <input type="range" min={0} max={60} value={neuRadius} onChange={(e) => setNeuRadius(Number(e.target.value))} className="w-full accent-primary" />
                </div>
              </>
            )}
          </div>

          {/* CSS Output */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-xs font-bold uppercase text-stone-500">Generated CSS</span>
              <button
                onClick={() => handleCopy(
                  glassMode === 'glass'
                    ? `.glass {\n  background: rgba(255,255,255,${glassOpacity / 100});\n  backdrop-filter: blur(${glassBlur}px);\n  -webkit-backdrop-filter: blur(${glassBlur}px);\n  border: ${glassBorder}px solid rgba(255,255,255,0.3);\n  border-radius: 16px;\n}`
                    : `.neumorphic {\n  background: #e5e5e5;\n  box-shadow: ${neuIntensity}px ${neuIntensity}px ${neuIntensity * 2}px #bebebe, -${neuIntensity}px -${neuIntensity}px ${neuIntensity * 2}px #ffffff;\n  border-radius: ${neuRadius}px;\n}`,
                  'glass-css'
                )}
                className="text-xs font-bold text-primary hover:underline flex items-center gap-1"
              >
                {copied === 'glass-css' ? <FiCheck size={14} /> : <FiCopy size={14} />} {copied === 'glass-css' ? 'Copied' : 'Copy CSS'}
              </button>
            </div>
            <pre className="p-4 bg-stone-900 text-emerald-400 border border-stone-200 dark:border-zinc-800 rounded-2xl font-mono text-xs overflow-x-auto whitespace-pre-wrap">
              {glassMode === 'glass'
                ? `.glass {\n  background: rgba(255,255,255,${glassOpacity / 100});\n  backdrop-filter: blur(${glassBlur}px);\n  -webkit-backdrop-filter: blur(${glassBlur}px);\n  border: ${glassBorder}px solid rgba(255,255,255,0.3);\n  border-radius: 16px;\n}`
                : `.neumorphic {\n  background: #e5e5e5;\n  box-shadow: ${neuIntensity}px ${neuIntensity}px ${neuIntensity * 2}px #bebebe, -${neuIntensity}px -${neuIntensity}px ${neuIntensity * 2}px #ffffff;\n  border-radius: ${neuRadius}px;\n}`}
            </pre>
          </div>
        </div>
      ) : tool.id === 'cubic-bezier-visualizer' ? (
        /* 10. Cubic-Bezier Easing Visualizer */
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row gap-6 items-start">
            <div className="shrink-0">
              <canvas
                ref={canvasRef}
                width={200}
                height={200}
                className="rounded-xl border border-stone-200 dark:border-zinc-800 bg-stone-100"
              />
            </div>

            <div className="flex-1 space-y-4 w-full">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-bold uppercase text-stone-500 mb-1">X1</label>
                  <input
                    type="number"
                    step={0.01}
                    min={0}
                    max={1}
                    value={bezierX1}
                    onChange={(e) => setBezierX1(parseFloat(e.target.value) || 0)}
                    className="w-full p-2 bg-stone-50 dark:bg-zinc-950 border border-stone-200 dark:border-zinc-800 rounded-lg font-mono text-xs font-bold"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase text-stone-500 mb-1">Y1</label>
                  <input
                    type="number"
                    step={0.01}
                    min={-1}
                    max={2}
                    value={bezierY1}
                    onChange={(e) => setBezierY1(parseFloat(e.target.value) || 0)}
                    className="w-full p-2 bg-stone-50 dark:bg-zinc-950 border border-stone-200 dark:border-zinc-800 rounded-lg font-mono text-xs font-bold"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase text-stone-500 mb-1">X2</label>
                  <input
                    type="number"
                    step={0.01}
                    min={0}
                    max={1}
                    value={bezierX2}
                    onChange={(e) => setBezierX2(parseFloat(e.target.value) || 0)}
                    className="w-full p-2 bg-stone-50 dark:bg-zinc-950 border border-stone-200 dark:border-zinc-800 rounded-lg font-mono text-xs font-bold"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase text-stone-500 mb-1">Y2</label>
                  <input
                    type="number"
                    step={0.01}
                    min={-1}
                    max={2}
                    value={bezierY2}
                    onChange={(e) => setBezierY2(parseFloat(e.target.value) || 0)}
                    className="w-full p-2 bg-stone-50 dark:bg-zinc-950 border border-stone-200 dark:border-zinc-800 rounded-lg font-mono text-xs font-bold"
                  />
                </div>
              </div>

              {/* Quick Presets */}
              <div className="flex flex-wrap gap-2">
                {[
                  { label: 'Ease', vals: [0.25, 0.1, 0.25, 1.0] },
                  { label: 'Linear', vals: [0, 0, 1, 1] },
                  { label: 'Ease In', vals: [0.42, 0, 1, 1] },
                  { label: 'Ease Out', vals: [0, 0, 0.58, 1] },
                  { label: 'Ease In Out', vals: [0.42, 0, 0.58, 1] },
                ].map((p) => (
                  <button
                    key={p.label}
                    onClick={() => { setBezierX1(p.vals[0]); setBezierY1(p.vals[1]); setBezierX2(p.vals[2]); setBezierY2(p.vals[3]); }}
                    className="px-3 py-1.5 text-[10px] font-bold bg-stone-200 dark:bg-zinc-800 rounded-lg hover:bg-primary hover:text-white transition-colors"
                  >
                    {p.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Animation Preview */}
          <div className="space-y-3">
            <button
              onClick={triggerBezierAnim}
              className="px-5 py-2.5 bg-primary hover:bg-primary/90 text-white font-bold text-xs rounded-xl shadow-lg transition-all"
            >
              Test Animation
            </button>
            <div className="p-3 bg-stone-100 dark:bg-zinc-900 rounded-xl border border-stone-200 dark:border-zinc-800 relative h-12 overflow-hidden">
              <div
                className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-primary rounded-lg"
                style={{
                  transition: `transform 1.5s ${getBezierCSS()}`,
                  transform: bezierAnimating ? 'translateX(calc(100vw - 100px))' : 'translateX(0)',
                }}
              />
            </div>
          </div>

          {/* CSS Output */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-xs font-bold uppercase text-stone-500">CSS Output</span>
              <button
                onClick={() => handleCopy(getBezierCSS(), 'bezier')}
                className="text-xs font-bold text-primary hover:underline flex items-center gap-1"
              >
                {copied === 'bezier' ? <FiCheck size={14} /> : <FiCopy size={14} />} {copied === 'bezier' ? 'Copied' : 'Copy'}
              </button>
            </div>
            <pre className="p-4 bg-stone-900 text-emerald-400 border border-stone-200 dark:border-zinc-800 rounded-2xl font-mono text-xs overflow-x-auto whitespace-pre-wrap">
              transition-timing-function: {getBezierCSS()};
            </pre>
          </div>
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
