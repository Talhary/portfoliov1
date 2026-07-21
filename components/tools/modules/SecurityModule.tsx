'use client';

import { useState, useEffect } from 'react';
import { ToolDefinition } from '@/lib/tools/registry';
import { useToolJob } from '@/hooks/use-tool-job';
import { JobProgressModal } from '@/components/tools/JobProgressModal';
import { FiShield, FiLock, FiGlobe, FiKey, FiCopy, FiCheck, FiRefreshCw, FiZap } from 'react-icons/fi';

// Pure JS MD5 Implementation
function computeMd5(str: string): string {
  function rotateLeft(lValue: number, iShiftBits: number) {
    return (lValue << iShiftBits) | (lValue >>> (32 - iShiftBits));
  }
  function addUnsigned(lX: number, lY: number) {
    const lX4 = lX & 0x40000000;
    const lY4 = lY & 0x40000000;
    const lX8 = lX & 0x80000000;
    const lY8 = lY & 0x80000000;
    const lResult = (lX & 0x3fffffff) + (lY & 0x3fffffff);
    if (lX4 & lY4) return lResult ^ 0x80000000 ^ lX8 ^ lY8;
    if (lX4 | lY4) {
      if (lResult & 0x40000000) return lResult ^ 0xc0000000 ^ lX8 ^ lY8;
      return lResult ^ 0x40000000 ^ lX8 ^ lY8;
    }
    return lResult ^ lX8 ^ lY8;
  }
  function F(x: number, y: number, z: number) { return (x & y) | (~x & z); }
  function G(x: number, y: number, z: number) { return (x & z) | (y & ~z); }
  function H(x: number, y: number, z: number) { return x ^ y ^ z; }
  function I(x: number, y: number, z: number) { return y ^ (x | ~z); }
  function FF(a: number, b: number, c: number, d: number, x: number, s: number, ac: number) {
    a = addUnsigned(a, addUnsigned(addUnsigned(F(b, c, d), x), ac));
    return addUnsigned(rotateLeft(a, s), b);
  }
  function GG(a: number, b: number, c: number, d: number, x: number, s: number, ac: number) {
    a = addUnsigned(a, addUnsigned(addUnsigned(G(b, c, d), x), ac));
    return addUnsigned(rotateLeft(a, s), b);
  }
  function HH(a: number, b: number, c: number, d: number, x: number, s: number, ac: number) {
    a = addUnsigned(a, addUnsigned(addUnsigned(H(b, c, d), x), ac));
    return addUnsigned(rotateLeft(a, s), b);
  }
  function II(a: number, b: number, c: number, d: number, x: number, s: number, ac: number) {
    a = addUnsigned(a, addUnsigned(addUnsigned(I(b, c, d), x), ac));
    return addUnsigned(rotateLeft(a, s), b);
  }
  function convertToWordArray(string: string) {
    let lMessageLength = string.length;
    let lNumberOfWords_temp1 = lMessageLength + 8;
    let lNumberOfWords_temp2 = (lNumberOfWords_temp1 - (lNumberOfWords_temp1 % 64)) / 64;
    let lNumberOfWords = (lNumberOfWords_temp2 + 1) * 16;
    let lWordArray = Array(lNumberOfWords - 1);
    let lBytePosition = 0;
    let lByteCount = 0;
    while (lByteCount < lMessageLength) {
      const lWordCount = (lByteCount - (lByteCount % 4)) / 4;
      lBytePosition = (lByteCount % 4) * 8;
      lWordArray[lWordCount] = (lWordArray[lWordCount] | (string.charCodeAt(lByteCount) << lBytePosition));
      lByteCount++;
    }
    const lWordCount = (lByteCount - (lByteCount % 4)) / 4;
    lBytePosition = (lByteCount % 4) * 8;
    lWordArray[lWordCount] = lWordArray[lWordCount] | (0x80 << lBytePosition);
    lWordArray[lNumberOfWords - 2] = lMessageLength << 3;
    lWordArray[lNumberOfWords - 1] = lMessageLength >>> 29;
    return lWordArray;
  }
  function wordToHex(lValue: number) {
    let WordToHexValue = '', WordToHexValue_temp = '', lByte, lCount;
    for (lCount = 0; lCount <= 3; lCount++) {
      lByte = (lValue >>> (lCount * 8)) & 255;
      WordToHexValue_temp = '0' + lByte.toString(16);
      WordToHexValue += WordToHexValue_temp.substr(WordToHexValue_temp.length - 2, 2);
    }
    return WordToHexValue;
  }
  const x = convertToWordArray(str);
  let k, AA, BB, CC, DD, a = 0x67452301, b = 0xefcdab89, c = 0x98badcfe, d = 0x10325476;
  const S11=7, S12=12, S13=17, S14=22, S21=5, S22=9, S23=14, S24=20, S31=4, S32=11, S33=16, S34=23, S41=6, S42=10, S43=15, S44=21;
  for (k = 0; k < x.length; k += 16) {
    AA = a; BB = b; CC = c; DD = d;
    a = FF(a, b, c, d, x[k + 0], S11, 0xd76aa478); d = FF(d, a, b, c, x[k + 1], S12, 0xe8c7b756); c = FF(c, d, a, b, x[k + 2], S13, 0x242070db); b = FF(b, c, d, a, x[k + 3], S14, 0xc1bdceee);
    a = FF(a, b, c, d, x[k + 4], S11, 0xf57c0faf); d = FF(d, a, b, c, x[k + 5], S12, 0x4787c62a); c = FF(c, d, a, b, x[k + 6], S13, 0xa8304613); b = FF(b, c, d, a, x[k + 7], S14, 0xfd469501);
    a = FF(a, b, c, d, x[k + 8], S11, 0x698098d8); d = FF(d, a, b, c, x[k + 9], S12, 0x8b44f7af); c = FF(c, d, a, b, x[k + 10], S13, 0xffff5bb1); b = FF(b, c, d, a, x[k + 11], S14, 0x895cd7be);
    a = FF(a, b, c, d, x[k + 12], S11, 0x6b901122); d = FF(d, a, b, c, x[k + 13], S12, 0xfd987193); c = FF(c, d, a, b, x[k + 14], S13, 0xa679438e); b = FF(b, c, d, a, x[k + 15], S14, 0x49b40821);
    a = GG(a, b, c, d, x[k + 1], S21, 0xf61e2562); d = GG(d, a, b, c, x[k + 6], S22, 0xc040b340); c = GG(c, d, a, b, x[k + 11], S23, 0x265e5a51); b = GG(b, c, d, a, x[k + 0], S24, 0xe9b6c7aa);
    a = GG(a, b, c, d, x[k + 5], S21, 0xd62f105d); d = GG(d, a, b, c, x[k + 10], S22, 0x2441453); c = GG(c, d, a, b, x[k + 15], S23, 0xd8a1e681); b = GG(b, c, d, a, x[k + 4], S24, 0xe7d3fbc8);
    a = GG(a, b, c, d, x[k + 9], S21, 0x21e1cde6); d = GG(d, a, b, c, x[k + 14], S22, 0xc33707d6); c = GG(c, d, a, b, x[k + 3], S23, 0xf4d50d87); b = GG(b, c, d, a, x[k + 8], S24, 0x455a14ed);
    a = GG(a, b, c, d, x[k + 13], S21, 0xa9e3e905); d = GG(d, a, b, c, x[k + 2], S22, 0xfcefa3f8); c = GG(c, d, a, b, x[k + 7], S23, 0x676f02d9); b = GG(b, c, d, a, x[k + 12], S24, 0x8d2a4c8a);
    a = HH(a, b, c, d, x[k + 5], S31, 0xfffa3942); d = HH(d, a, b, c, x[k + 8], S32, 0x8771f681); c = HH(c, d, a, b, x[k + 11], S33, 0x6d9d6122); b = HH(b, c, d, a, x[k + 14], S34, 0xfde5380c);
    a = HH(a, b, c, d, x[k + 1], S31, 0xa4beea44); d = HH(d, a, b, c, x[k + 4], S32, 0x4bdecfa9); c = HH(c, d, a, b, x[k + 7], S33, 0xf6bb4b60); b = HH(b, c, d, a, x[k + 10], S34, 0xbebfbc70);
    a = HH(a, b, c, d, x[k + 13], S31, 0x289b7ec6); d = HH(d, a, b, c, x[k + 0], S32, 0xeaa127fa); c = HH(c, d, a, b, x[k + 3], S33, 0xd4ef3085); b = HH(b, c, d, a, x[k + 6], S34, 0x4881d05);
    a = HH(a, b, c, d, x[k + 9], S31, 0xd9d4d039); d = HH(d, a, b, c, x[k + 12], S32, 0xe6db99e5); c = HH(c, d, a, b, x[k + 15], S33, 0x1fa27cf8); b = HH(b, c, d, a, x[k + 2], S34, 0xc4ac5665);
    a = II(a, b, c, d, x[k + 0], S41, 0xf4292244); d = II(d, a, b, c, x[k + 7], S42, 0x432aff97); c = II(c, d, a, b, x[k + 14], S43, 0xab9423a7); b = II(b, c, d, a, x[k + 5], S44, 0xfc93a039);
    a = II(a, b, c, d, x[k + 12], S41, 0x655b59c3); d = II(d, a, b, c, x[k + 3], S42, 0x8f0ccc92); c = II(c, d, a, b, x[k + 10], S43, 0xffeff47d); b = II(b, c, d, a, x[k + 1], S44, 0x85845dd1);
    a = II(a, b, c, d, x[k + 8], S41, 0x6fa87e4f); d = II(d, a, b, c, x[k + 15], S42, 0xfe2ce6e0); c = II(c, d, a, b, x[k + 6], S43, 0xa3014314); b = II(b, c, d, a, x[k + 13], S44, 0x4e0811a1);
    a = addUnsigned(a, AA); b = addUnsigned(b, BB); c = addUnsigned(c, CC); d = addUnsigned(d, DD);
  }
  return (wordToHex(a) + wordToHex(b) + wordToHex(c) + wordToHex(d)).toLowerCase();
}

export const SecurityModule = ({ tool }: { tool: ToolDefinition }) => {
  const [domainInput, setDomainInput] = useState<string>('google.com');
  const [passwordInput, setPasswordInput] = useState<string>('P@ssw0rd2026!');
  
  // Custom Rules Password Builder State
  const [pwdLength, setPwdLength] = useState<number>(16);
  const [incUppercase, setIncUppercase] = useState<boolean>(true);
  const [incLowercase, setIncLowercase] = useState<boolean>(true);
  const [incNumbers, setIncNumbers] = useState<boolean>(true);
  const [incSymbols, setIncSymbols] = useState<boolean>(true);
  const [generatedPwd, setGeneratedPwd] = useState<string>('');
  
  // UUID Generator State
  const [uuidCount, setUuidCount] = useState<number>(5);
  const [uuidList, setUuidList] = useState<string[]>([]);

  // Random String Generator State
  const [strLength, setStrLength] = useState<number>(24);
  const [generatedStr, setGeneratedStr] = useState<string>('');

  // Random Number Generator State
  const [minNum, setMinNum] = useState<number>(1);
  const [maxNum, setMaxNum] = useState<number>(100);
  const [numQuantity, setNumQuantity] = useState<number>(5);
  const [generatedNums, setGeneratedNums] = useState<number[]>([]);

  // Hash Generators State
  const [hashInputText, setHashInputText] = useState<string>('Hello World 2026');
  const [computedHash, setComputedHash] = useState<string>('');

  // UI state
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const { jobState, startJob, resetJob, isProcessing } = useToolJob(tool.id);

  const copyToClipboard = (text: string, key: string = 'main') => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  // 1. Password Generator logic
  const generateCustomPassword = () => {
    let chars = '';
    if (incUppercase) chars += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    if (incLowercase) chars += 'abcdefghijklmnopqrstuvwxyz';
    if (incNumbers) chars += '0123456789';
    if (incSymbols) chars += '!@#$%^&*()_+-=[]{}|;:,.<>?';

    if (!chars) chars = 'abcdefghijklmnopqrstuvwxyz';

    let res = '';
    const array = new Uint32Array(pwdLength);
    crypto.getRandomValues(array);
    for (let i = 0; i < pwdLength; i++) {
      res += chars[array[i] % chars.length];
    }
    setGeneratedPwd(res);
  };

  // 2. UUID Generator logic
  const generateUuids = (count: number) => {
    const list: string[] = [];
    for (let i = 0; i < count; i++) {
      list.push(crypto.randomUUID());
    }
    setUuidList(list);
  };

  // 3. Random String Generator logic
  const generateRandomString = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*';
    let res = '';
    const array = new Uint32Array(strLength);
    crypto.getRandomValues(array);
    for (let i = 0; i < strLength; i++) {
      res += chars[array[i] % chars.length];
    }
    setGeneratedStr(res);
  };

  // 4. Random Number Generator logic
  const generateRandomNumbers = () => {
    const nums: number[] = [];
    const min = Math.ceil(minNum);
    const max = Math.floor(maxNum);
    for (let i = 0; i < numQuantity; i++) {
      const rand = Math.floor(Math.random() * (max - min + 1)) + min;
      nums.push(rand);
    }
    setGeneratedNums(nums);
  };

  // Initial calculations on mount/tool change
  useEffect(() => {
    if (tool.id === 'sec-password-generator') generateCustomPassword();
    if (tool.id === 'sec-uuid-generator') generateUuids(uuidCount);
    if (tool.id === 'random-string-generator') generateRandomString();
    if (tool.id === 'random-number-generator') generateRandomNumbers();
  }, [tool.id]);

  // Hash Generator effect
  useEffect(() => {
    if (tool.id === 'md5-hash') {
      setComputedHash(computeMd5(hashInputText));
    } else if (tool.id === 'sha256-hash') {
      const msgUint8 = new TextEncoder().encode(hashInputText);
      crypto.subtle.digest('SHA-256', msgUint8).then(buffer => {
        const hashArray = Array.from(new Uint8Array(buffer));
        setComputedHash(hashArray.map(b => b.toString(16).padStart(2, '0')).join(''));
      });
    } else if (tool.id === 'sha512-hash') {
      const msgUint8 = new TextEncoder().encode(hashInputText);
      crypto.subtle.digest('SHA-512', msgUint8).then(buffer => {
        const hashArray = Array.from(new Uint8Array(buffer));
        setComputedHash(hashArray.map(b => b.toString(16).padStart(2, '0')).join(''));
      });
    }
  }, [tool.id, hashInputText]);

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

  const pwdScore = getPasswordScore(passwordInput || generatedPwd);
  const pwdLabel = pwdScore < 40 ? 'Weak' : pwdScore < 70 ? 'Medium' : pwdScore < 90 ? 'Strong' : 'Very Strong';

  const handleRunSecurityJob = () => {
    if (!domainInput) return;
    startJob({ domain: domainInput, ip: domainInput });
  };

  return (
    <div className="space-y-6">
      {/* 1. Custom Rules Password Builder */}
      {tool.id === 'sec-password-generator' && (
        <div className="space-y-6">
          <div className="p-4 sm:p-6 bg-stone-50 dark:bg-zinc-950 border border-stone-200 dark:border-zinc-800 rounded-2xl space-y-4">
            <div>
              <span className="text-xs uppercase font-bold text-stone-500 block mb-2">Generated Password</span>
              <div className="flex gap-2">
                <input
                  type="text"
                  readOnly
                  value={generatedPwd}
                  className="w-full p-4 bg-white dark:bg-zinc-900 border border-stone-200 dark:border-zinc-800 rounded-xl font-mono text-lg font-bold text-primary"
                />
                <button
                  onClick={() => copyToClipboard(generatedPwd, 'pwd')}
                  className="px-5 bg-primary hover:bg-primary/90 text-white font-bold rounded-xl shadow-md transition-all inline-flex items-center gap-2 shrink-0"
                >
                  {copiedKey === 'pwd' ? <FiCheck size={18} /> : <FiCopy size={18} />}
                  <span className="hidden sm:inline">{copiedKey === 'pwd' ? 'Copied' : 'Copy'}</span>
                </button>
                <button
                  onClick={generateCustomPassword}
                  className="p-4 bg-stone-200 dark:bg-zinc-800 text-stone-700 dark:text-zinc-300 font-bold rounded-xl hover:bg-stone-300 dark:hover:bg-zinc-700 transition-all shrink-0"
                  title="Generate New Password"
                >
                  <FiRefreshCw size={18} />
                </button>
              </div>
            </div>

            {/* Password Rules */}
            <div className="space-y-4 pt-2">
              <div>
                <div className="flex justify-between text-xs font-bold uppercase text-stone-500 mb-1">
                  <span>Password Length</span>
                  <span className="text-primary font-mono">{pwdLength} characters</span>
                </div>
                <input
                  type="range"
                  min={8}
                  max={64}
                  value={pwdLength}
                  onChange={(e) => setPwdLength(Number(e.target.value))}
                  className="w-full accent-primary"
                />
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <label className="flex items-center gap-2 p-3 bg-white dark:bg-zinc-900 border border-stone-200 dark:border-zinc-800 rounded-xl cursor-pointer text-xs font-bold">
                  <input
                    type="checkbox"
                    checked={incUppercase}
                    onChange={(e) => setIncUppercase(e.target.checked)}
                    className="accent-primary"
                  />
                  ABC (Uppercase)
                </label>
                <label className="flex items-center gap-2 p-3 bg-white dark:bg-zinc-900 border border-stone-200 dark:border-zinc-800 rounded-xl cursor-pointer text-xs font-bold">
                  <input
                    type="checkbox"
                    checked={incLowercase}
                    onChange={(e) => setIncLowercase(e.target.checked)}
                    className="accent-primary"
                  />
                  abc (Lowercase)
                </label>
                <label className="flex items-center gap-2 p-3 bg-white dark:bg-zinc-900 border border-stone-200 dark:border-zinc-800 rounded-xl cursor-pointer text-xs font-bold">
                  <input
                    type="checkbox"
                    checked={incNumbers}
                    onChange={(e) => setIncNumbers(e.target.checked)}
                    className="accent-primary"
                  />
                  123 (Numbers)
                </label>
                <label className="flex items-center gap-2 p-3 bg-white dark:bg-zinc-900 border border-stone-200 dark:border-zinc-800 rounded-xl cursor-pointer text-xs font-bold">
                  <input
                    type="checkbox"
                    checked={incSymbols}
                    onChange={(e) => setIncSymbols(e.target.checked)}
                    className="accent-primary"
                  />
                  !@# (Symbols)
                </label>
              </div>
            </div>
          </div>

          <button
            onClick={generateCustomPassword}
            className="w-full py-4 bg-primary hover:bg-primary/90 text-white font-bold text-sm rounded-xl shadow-lg transition-all flex items-center justify-center gap-2"
          >
            <FiZap size={18} /> Generate Secure Password
          </button>
        </div>
      )}

      {/* 2. Secure UUID Generator */}
      {tool.id === 'sec-uuid-generator' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between gap-4 p-4 bg-stone-50 dark:bg-zinc-950 border border-stone-200 dark:border-zinc-800 rounded-2xl">
            <div>
              <label className="block text-xs font-bold uppercase text-stone-500 mb-1">Quantity to Generate</label>
              <div className="flex gap-2">
                {[1, 5, 10, 25].map((cnt) => (
                  <button
                    key={cnt}
                    onClick={() => {
                      setUuidCount(cnt);
                      generateUuids(cnt);
                    }}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                      uuidCount === cnt ? 'bg-primary text-white' : 'bg-stone-200 dark:bg-zinc-800 text-stone-700 dark:text-zinc-300'
                    }`}
                  >
                    {cnt} UUID{cnt > 1 ? 's' : ''}
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={() => copyToClipboard(uuidList.join('\n'), 'all-uuid')}
              className="px-4 py-2 bg-stone-200 dark:bg-zinc-800 text-stone-800 dark:text-zinc-200 text-xs font-bold rounded-xl flex items-center gap-1.5 hover:bg-stone-300 transition-all"
            >
              {copiedKey === 'all-uuid' ? <FiCheck className="text-emerald-500" /> : <FiCopy />}
              Copy All
            </button>
          </div>

          <div className="space-y-2">
            {uuidList.map((uuid, idx) => (
              <div key={idx} className="p-3 bg-stone-50 dark:bg-zinc-950 border border-stone-200 dark:border-zinc-800 rounded-xl flex items-center justify-between gap-2 font-mono text-sm font-bold text-stone-900 dark:text-white">
                <span className="truncate">{uuid}</span>
                <button
                  onClick={() => copyToClipboard(uuid, `uuid-${idx}`)}
                  className="p-1.5 text-stone-500 hover:text-primary transition-colors"
                >
                  {copiedKey === `uuid-${idx}` ? <FiCheck className="text-emerald-500" /> : <FiCopy size={16} />}
                </button>
              </div>
            ))}
          </div>

          <button
            onClick={() => generateUuids(uuidCount)}
            className="w-full py-3.5 bg-primary hover:bg-primary/90 text-white font-bold text-sm rounded-xl shadow-lg transition-all flex items-center justify-center gap-2"
          >
            <FiRefreshCw size={16} /> Regenerate UUIDs
          </button>
        </div>
      )}

      {/* 3. Random String Generator */}
      {tool.id === 'random-string-generator' && (
        <div className="space-y-6">
          <div className="p-6 bg-stone-50 dark:bg-zinc-950 border border-stone-200 dark:border-zinc-800 rounded-2xl space-y-4">
            <div>
              <span className="text-xs uppercase font-bold text-stone-500 block mb-2">Generated Random String</span>
              <div className="flex gap-2">
                <input
                  type="text"
                  readOnly
                  value={generatedStr}
                  className="w-full p-4 bg-white dark:bg-zinc-900 border border-stone-200 dark:border-zinc-800 rounded-xl font-mono text-base font-bold text-primary"
                />
                <button
                  onClick={() => copyToClipboard(generatedStr, 'rand-str')}
                  className="px-5 bg-primary text-white font-bold rounded-xl shadow-md flex items-center gap-2"
                >
                  {copiedKey === 'rand-str' ? <FiCheck size={18} /> : <FiCopy size={18} />}
                  Copy
                </button>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-bold uppercase text-stone-500 mb-1">
                <span>String Length</span>
                <span className="text-primary font-mono">{strLength} chars</span>
              </div>
              <input
                type="range"
                min={8}
                max={128}
                value={strLength}
                onChange={(e) => setStrLength(Number(e.target.value))}
                className="w-full accent-primary"
              />
            </div>
          </div>

          <button
            onClick={generateRandomString}
            className="w-full py-3.5 bg-primary text-white font-bold text-sm rounded-xl shadow-lg flex items-center justify-center gap-2"
          >
            <FiRefreshCw size={16} /> Generate New String
          </button>
        </div>
      )}

      {/* 4. Random Number Generator */}
      {tool.id === 'random-number-generator' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-stone-50 dark:bg-zinc-950 p-4 rounded-2xl border border-stone-200 dark:border-zinc-800">
            <div>
              <label className="block text-xs font-bold uppercase text-stone-500 mb-1">Minimum</label>
              <input
                type="number"
                value={minNum}
                onChange={(e) => setMinNum(Number(e.target.value))}
                className="w-full p-3 bg-white dark:bg-zinc-900 border border-stone-200 dark:border-zinc-800 rounded-xl font-mono text-sm font-bold"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase text-stone-500 mb-1">Maximum</label>
              <input
                type="number"
                value={maxNum}
                onChange={(e) => setMaxNum(Number(e.target.value))}
                className="w-full p-3 bg-white dark:bg-zinc-900 border border-stone-200 dark:border-zinc-800 rounded-xl font-mono text-sm font-bold"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase text-stone-500 mb-1">Quantity</label>
              <input
                type="number"
                min={1}
                max={50}
                value={numQuantity}
                onChange={(e) => setNumQuantity(Number(e.target.value))}
                className="w-full p-3 bg-white dark:bg-zinc-900 border border-stone-200 dark:border-zinc-800 rounded-xl font-mono text-sm font-bold"
              />
            </div>
          </div>

          <button
            onClick={generateRandomNumbers}
            className="w-full py-3.5 bg-primary text-white font-bold text-sm rounded-xl shadow-lg flex items-center justify-center gap-2"
          >
            <FiZap size={16} /> Generate Numbers
          </button>

          {generatedNums.length > 0 && (
            <div className="p-6 bg-stone-50 dark:bg-zinc-950 border border-stone-200 dark:border-zinc-800 rounded-2xl space-y-3">
              <div className="flex justify-between items-center text-xs font-bold uppercase">
                <span>Generated Numbers</span>
                <button
                  onClick={() => copyToClipboard(generatedNums.join(', '), 'nums')}
                  className="text-primary hover:underline inline-flex items-center gap-1"
                >
                  {copiedKey === 'nums' ? <FiCheck /> : <FiCopy />} Copy All
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {generatedNums.map((n, i) => (
                  <span key={i} className="px-4 py-2 bg-primary/10 border border-primary/20 text-primary text-base font-black font-mono rounded-xl">
                    {n}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* 5. Hash Generators (MD5, SHA-256, SHA-512) */}
      {(tool.id === 'md5-hash' || tool.id === 'sha256-hash' || tool.id === 'sha512-hash') && (
        <div className="space-y-6">
          <div>
            <label className="block text-xs font-bold uppercase text-stone-500 mb-1">Input Text to Hash</label>
            <textarea
              rows={4}
              value={hashInputText}
              onChange={(e) => setHashInputText(e.target.value)}
              placeholder="Enter text to generate cryptographic hash..."
              className="w-full p-4 bg-stone-50 dark:bg-zinc-950 border border-stone-200 dark:border-zinc-800 rounded-2xl font-mono text-sm focus:ring-2 focus:ring-primary/50 outline-none"
            />
          </div>

          <div className="p-4 bg-stone-50 dark:bg-zinc-950 border border-stone-200 dark:border-zinc-800 rounded-2xl space-y-2">
            <div className="flex justify-between items-center text-xs font-bold uppercase text-stone-500">
              <span>{tool.title} Output</span>
              <button
                onClick={() => copyToClipboard(computedHash, 'hash')}
                className="text-primary hover:underline inline-flex items-center gap-1 font-sans"
              >
                {copiedKey === 'hash' ? <FiCheck /> : <FiCopy />} Copy Hash
              </button>
            </div>
            <div className="p-3 bg-white dark:bg-zinc-900 border border-stone-200 dark:border-zinc-800 rounded-xl font-mono text-xs sm:text-sm font-bold text-stone-900 dark:text-white break-all">
              {computedHash || 'Calculating...'}
            </div>
          </div>
        </div>
      )}

      {/* 6. Password Strength Meter */}
      {tool.id === 'password-strength-meter' && (
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
      )}

      {/* 7. Network & Security Tools (DNS / SSL / WHOIS / IP) */}
      {(tool.id === 'dns-lookup-tool' || tool.id === 'ssl-certificate-inspector' || tool.id === 'whois-domain-lookup' || tool.id === 'ip-address-lookup') && (
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
