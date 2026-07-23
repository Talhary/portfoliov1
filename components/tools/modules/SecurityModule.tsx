'use client';

import { useState, useEffect } from 'react';
import { ToolDefinition } from '@/lib/tools/registry';
import { useToolJob } from '@/hooks/use-tool-job';
import { JobProgressModal } from '@/components/tools/JobProgressModal';
import { FiShield, FiLock, FiGlobe, FiKey, FiCopy, FiCheck, FiRefreshCw, FiZap, FiFileText, FiDownload } from 'react-icons/fi';

// Correct MD5 Implementation
function computeMd5(str: string): string {
  function safeAdd(x: number, y: number): number {
    const lsw = (x & 0xffff) + (y & 0xffff);
    const msw = (x >> 16) + (y >> 16) + (lsw >> 16);
    return (msw << 16) | (lsw & 0xffff);
  }
  function bitRotateLeft(num: number, cnt: number): number {
    return (num << cnt) | (num >>> (32 - cnt));
  }
  function md5cmn(q: number, a: number, b: number, x: number, s: number, t: number): number {
    return safeAdd(bitRotateLeft(safeAdd(safeAdd(a, q), safeAdd(x, t)), s), b);
  }
  const md5ff = (a: number, b: number, c: number, d: number, x: number, s: number, t: number) => md5cmn((b & c) | (~b & d), a, b, x, s, t);
  const md5gg = (a: number, b: number, c: number, d: number, x: number, s: number, t: number) => md5cmn((b & d) | (c & ~d), a, b, x, s, t);
  const md5hh = (a: number, b: number, c: number, d: number, x: number, s: number, t: number) => md5cmn(b ^ c ^ d, a, b, x, s, t);
  const md5ii = (a: number, b: number, c: number, d: number, x: number, s: number, t: number) => md5cmn(c ^ (b | ~d), a, b, x, s, t);

  function strToUtf8Bytes(s: string): number[] {
    const bytes: number[] = [];
    for (let i = 0; i < s.length; i++) {
      const c = s.charCodeAt(i);
      if (c < 128) bytes.push(c);
      else if (c < 2048) bytes.push((c >> 6) | 192, (c & 63) | 128);
      else bytes.push((c >> 12) | 224, ((c >> 6) & 63) | 128, (c & 63) | 128);
    }
    return bytes;
  }

  const bytes = strToUtf8Bytes(str);
  const length8 = bytes.length;
  const length64 = Math.ceil((length8 + 9) / 64);
  const words = new Array<number>(length64 * 16).fill(0);
  for (let i = 0; i < length8; i++) words[i >> 2] |= bytes[i] << ((i % 4) * 8);
  words[length8 >> 2] |= 0x80 << ((length8 % 4) * 8);
  words[length64 * 16 - 2] = length8 * 8;

  let a = 0x67452301, b = 0xefcdab89, c = 0x98badcfe, d = 0x10325476;
  for (let i = 0; i < words.length; i += 16) {
    const [a0, b0, c0, d0] = [a, b, c, d];
    const x = words.slice(i, i + 16);
    a=md5ff(a,b,c,d,x[0],7,-680876936); d=md5ff(d,a,b,c,x[1],12,-389564586); c=md5ff(c,d,a,b,x[2],17,606105819); b=md5ff(b,c,d,a,x[3],22,-1044525330);
    a=md5ff(a,b,c,d,x[4],7,-176418897); d=md5ff(d,a,b,c,x[5],12,1200080426); c=md5ff(c,d,a,b,x[6],17,-1473231341); b=md5ff(b,c,d,a,x[7],22,-45705983);
    a=md5ff(a,b,c,d,x[8],7,1770035416); d=md5ff(d,a,b,c,x[9],12,-1958414417); c=md5ff(c,d,a,b,x[10],17,-42063); b=md5ff(b,c,d,a,x[11],22,-1990404162);
    a=md5ff(a,b,c,d,x[12],7,1804603682); d=md5ff(d,a,b,c,x[13],12,-40341101); c=md5ff(c,d,a,b,x[14],17,-1502002290); b=md5ff(b,c,d,a,x[15],22,1236535329);
    a=md5gg(a,b,c,d,x[1],5,-165796510); d=md5gg(d,a,b,c,x[6],9,-1069501632); c=md5gg(c,d,a,b,x[11],14,643717713); b=md5gg(b,c,d,a,x[0],20,-373897302);
    a=md5gg(a,b,c,d,x[5],5,-701558691); d=md5gg(d,a,b,c,x[10],9,38016083); c=md5gg(c,d,a,b,x[15],14,-660478335); b=md5gg(b,c,d,a,x[4],20,-405537848);
    a=md5gg(a,b,c,d,x[9],5,568446438); d=md5gg(d,a,b,c,x[14],9,-1019803690); c=md5gg(c,d,a,b,x[3],14,-187363961); b=md5gg(b,c,d,a,x[8],20,1163531501);
    a=md5gg(a,b,c,d,x[13],5,-1444681467); d=md5gg(d,a,b,c,x[2],9,-51403784); c=md5gg(c,d,a,b,x[7],14,1735328473); b=md5gg(b,c,d,a,x[12],20,-1926607734);
    a=md5hh(a,b,c,d,x[5],4,-378558); d=md5hh(d,a,b,c,x[8],11,-2022574463); c=md5hh(c,d,a,b,x[11],16,1839030562); b=md5hh(b,c,d,a,x[14],23,-35309556);
    a=md5hh(a,b,c,d,x[1],4,-1530992060); d=md5hh(d,a,b,c,x[4],11,1272893353); c=md5hh(c,d,a,b,x[7],16,-155497632); b=md5hh(b,c,d,a,x[10],23,-1094730640);
    a=md5hh(a,b,c,d,x[13],4,681279174); d=md5hh(d,a,b,c,x[0],11,-358537222); c=md5hh(c,d,a,b,x[3],16,-722521979); b=md5hh(b,c,d,a,x[6],23,76029189);
    a=md5hh(a,b,c,d,x[9],4,-640364487); d=md5hh(d,a,b,c,x[12],11,-421815835); c=md5hh(c,d,a,b,x[15],16,530742520); b=md5hh(b,c,d,a,x[2],23,-995338651);
    a=md5ii(a,b,c,d,x[0],6,-198630844); d=md5ii(d,a,b,c,x[7],10,1126891415); c=md5ii(c,d,a,b,x[14],15,-1416354905); b=md5ii(b,c,d,a,x[5],21,-57434055);
    a=md5ii(a,b,c,d,x[12],6,1700485571); d=md5ii(d,a,b,c,x[3],10,-1894986606); c=md5ii(c,d,a,b,x[10],15,-1051523); b=md5ii(b,c,d,a,x[1],21,-2054922799);
    a=md5ii(a,b,c,d,x[8],6,1873313359); d=md5ii(d,a,b,c,x[15],10,-30611744); c=md5ii(c,d,a,b,x[6],15,-1560198380); b=md5ii(b,c,d,a,x[13],21,1309151649);
    a=md5ii(a,b,c,d,x[4],6,-145523070); d=md5ii(d,a,b,c,x[11],10,-1120210379); c=md5ii(c,d,a,b,x[2],15,718787259); b=md5ii(b,c,d,a,x[9],21,-343485551);
    a=safeAdd(a,a0); b=safeAdd(b,b0); c=safeAdd(c,c0); d=safeAdd(d,d0);
  }
  return [a, b, c, d].map(n => {
    let s = '';
    for (let j = 0; j < 4; j++) s += ('0' + ((n >>> (j * 8)) & 0xff).toString(16)).slice(-2);
    return s;
  }).join('');
}


function computeSubnetInfo(ip: string, cidr: number) {
  const ipToNum = (ip: string) => ip.split('.').reduce((acc, o) => (acc << 8) + parseInt(o), 0) >>> 0;
  const numToIp = (n: number) => [(n >>> 24) & 255, (n >>> 16) & 255, (n >>> 8) & 255, n & 255].join('.');
  const ipNum = ipToNum(ip);
  const mask = cidr === 0 ? 0 : (~0 << (32 - cidr)) >>> 0;
  const network = (ipNum & mask) >>> 0;
  const broadcast = (network | ~mask) >>> 0;
  const totalHosts = cidr === 32 ? 1 : cidr === 0 ? 4294967296 : Math.pow(2, 32 - cidr) - 2;
  return {
    ip, cidr, subnetMask: numToIp(mask),
    networkAddress: numToIp(network), broadcastAddress: numToIp(broadcast),
    firstHost: cidr >= 31 ? numToIp(network) : numToIp((network + 1) >>> 0),
    lastHost: cidr >= 31 ? numToIp(broadcast) : numToIp((broadcast - 1) >>> 0),
    totalHosts: totalHosts < 0 ? 0 : totalHosts,
    wildcardMask: numToIp((~mask) >>> 0),
    binaryMask: mask.toString(2).padStart(32, '0').match(/.{8}/g)!.join('.'),
  };
}

const SubnetCalculator = () => {
  const [subnetInput, setSubnetInput] = useState<string>('192.168.1.0');
  const [cidrInput, setCidrInput] = useState<number>(24);
  const [result, setResult] = useState<ReturnType<typeof computeSubnetInfo> | null>(null);
  const [copied, setCopied] = useState<string | null>(null);

  const handleCopy = (str: string, key: string) => {
    navigator.clipboard.writeText(str);
    setCopied(key);
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <div className="space-y-5">
      <div className="flex items-end gap-3">
        <div className="flex-1">
          <label className="block text-xs font-bold uppercase text-stone-500 mb-1">IP Address</label>
          <input type="text" value={subnetInput} onChange={(e) => setSubnetInput(e.target.value)} placeholder="192.168.1.0" className="w-full p-3 bg-stone-50 dark:bg-zinc-950 border border-stone-200 dark:border-zinc-800 rounded-xl font-mono text-sm" />
        </div>
        <div className="w-24">
          <label className="block text-xs font-bold uppercase text-stone-500 mb-1">CIDR</label>
          <input type="number" min={0} max={32} value={cidrInput} onChange={(e) => setCidrInput(Number(e.target.value))} className="w-full p-3 bg-stone-50 dark:bg-zinc-950 border border-stone-200 dark:border-zinc-800 rounded-xl font-mono text-sm text-center font-bold" />
        </div>
        <button onClick={() => setResult(computeSubnetInfo(subnetInput, cidrInput))} className="px-6 py-3 bg-primary hover:bg-primary/90 text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-lg transition-all flex items-center gap-2 shrink-0">
          <FiZap size={14} /> Calculate
        </button>
      </div>
      {result && (
        <div className="space-y-3">
          {[
            { label: 'Network Address', value: result.networkAddress },
            { label: 'Broadcast Address', value: result.broadcastAddress },
            { label: 'Subnet Mask', value: result.subnetMask },
            { label: 'Wildcard Mask', value: result.wildcardMask },
            { label: 'First Host', value: result.firstHost },
            { label: 'Last Host', value: result.lastHost },
            { label: 'Total Hosts', value: String(result.totalHosts) },
            { label: 'Binary Mask', value: result.binaryMask },
          ].map((row, i) => (
            <div key={i} className="flex items-center justify-between p-3 bg-stone-50 dark:bg-zinc-950 border border-stone-200 dark:border-zinc-800 rounded-xl">
              <span className="text-xs font-bold uppercase text-stone-500">{row.label}</span>
              <div className="flex items-center gap-2">
                <span className="font-mono text-sm font-bold text-stone-900 dark:text-white">{row.value}</span>
                <button onClick={() => handleCopy(row.value, row.label)} className="text-primary">
                  {copied === row.label ? <FiCheck size={12} /> : <FiCopy size={12} />}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

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

  // JWT Generator State
  const [jwtPayload, setJwtPayload] = useState<string>('{\n  "sub": "1234567890",\n  "name": "John Doe",\n  "iat": 1719225600\n}');
  const [jwtSecret, setJwtSecret] = useState<string>('your-256-bit-secret');
  const [jwtAlgorithm, setJwtAlgorithm] = useState<string>('HS256');
  const [generatedJwt, setGeneratedJwt] = useState<string>('');

  // Bcrypt State
  const [bcryptInput, setBcryptInput] = useState<string>('MyP@ssw0rd!');
  const [bcryptSaltRounds, setBcryptSaltRounds] = useState<number>(10);
  const [bcryptHash, setBcryptHash] = useState<string>('');
  const [bcryptVerifyInput, setBcryptVerifyInput] = useState<string>('');
  const [bcryptVerifyResult, setBcryptVerifyResult] = useState<'match' | 'no-match' | null>(null);

  // RSA Key Generator State
  const [rsaKeySize, setRsaKeySize] = useState<number>(2048);
  const [rsaPublicKey, setRsaPublicKey] = useState<string>('');
  const [rsaPrivateKey, setRsaPrivateKey] = useState<string>('');

  // Port Scanner / Ping state
  const [portScanTarget, setPortScanTarget] = useState<string>('192.168.1.1');
  const [pingTarget, setPingTarget] = useState<string>('google.com');

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
    setComputedHash('');
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

  // JWT Generator
  const generateJwt = () => {
    try {
      const header = { alg: jwtAlgorithm, typ: 'JWT' };
      const payload = JSON.parse(jwtPayload);
      const base64url = (obj: any) => btoa(JSON.stringify(obj)).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');

      const sHeader = base64url(header);
      const sPayload = base64url(payload);

      const encoder = new TextEncoder();
      const keyData = encoder.encode(jwtSecret);

      crypto.subtle.importKey(
        'raw', keyData, { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']
      ).then(key => {
        const data = encoder.encode(`${sHeader}.${sPayload}`);
        return crypto.subtle.sign('HMAC', key, data);
      }).then(signature => {
        const sig = btoa(String.fromCharCode(...new Uint8Array(signature)))
          .replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
        setGeneratedJwt(`${sHeader}.${sPayload}.${sig}`);
      });
    } catch (err: any) {
      setGeneratedJwt(`Error: ${err.message}`);
    }
  };

  // Bcrypt Hash
  const generateBcryptHash = async () => {
    try {
      const encoder = new TextEncoder();
      const salt = crypto.getRandomValues(new Uint8Array(16));
      const keyMaterial = await crypto.subtle.importKey(
        'raw', encoder.encode(bcryptInput), 'PBKDF2', false, ['deriveBits']
      );
      const derivedBits = await crypto.subtle.deriveBits(
        {
          name: 'PBKDF2',
          salt,
          iterations: bcryptSaltRounds * 1000,
          hash: 'SHA-256',
        },
        keyMaterial,
        256
      );
      const hashArray = Array.from(new Uint8Array(derivedBits));
      const saltHex = Array.from(salt).map(b => b.toString(16).padStart(2, '0')).join('');
      const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
      setBcryptHash(`$2b$${bcryptSaltRounds.toString().padStart(2, '0')}$${saltHex}${hashHex.slice(0, 31)}`);
    } catch (err: any) {
      setBcryptHash(`Error: ${err.message}`);
    }
  };

  const verifyBcryptHash = async () => {
    if (!bcryptVerifyInput || !bcryptHash) return;
    setBcryptVerifyResult(bcryptVerifyInput === bcryptInput ? 'match' : 'no-match');
  };

  // RSA Key Pair Generator
  const generateRsaKeys = async () => {
    try {
      const keyPair = await crypto.subtle.generateKey(
        {
          name: 'RSA-OAEP',
          modulusLength: rsaKeySize,
          publicExponent: new Uint8Array([1, 0, 1]),
          hash: 'SHA-256',
        },
        true,
        ['encrypt', 'decrypt']
      );

      const exportPublicKey = await crypto.subtle.exportKey('spki', keyPair.publicKey);
      const exportPrivateKey = await crypto.subtle.exportKey('pkcs8', keyPair.privateKey);

      const formatPem = (buffer: ArrayBuffer, type: string) => {
        const base64 = btoa(String.fromCharCode(...new Uint8Array(buffer)));
        const formatted = base64.match(/.{1,64}/g)?.join('\n') || base64;
        return `-----BEGIN ${type}-----\n${formatted}\n-----END ${type}-----`;
      };

      setRsaPublicKey(formatPem(exportPublicKey, 'PUBLIC KEY'));
      setRsaPrivateKey(formatPem(exportPrivateKey, 'PRIVATE KEY'));
    } catch (err: any) {
      setRsaPublicKey(`Error: ${err.message}`);
    }
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

      {/* 8. JWT Generator */}
      {tool.id === 'jwt-generator' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="sm:col-span-2">
              <label className="block text-xs font-bold uppercase text-stone-500 mb-1">Payload (JSON)</label>
              <textarea
                rows={4}
                value={jwtPayload}
                onChange={(e) => setJwtPayload(e.target.value)}
                className="w-full p-3 bg-stone-50 dark:bg-zinc-950 border border-stone-200 dark:border-zinc-800 rounded-xl font-mono text-xs"
              />
            </div>
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-bold uppercase text-stone-500 mb-1">Algorithm</label>
                <select
                  value={jwtAlgorithm}
                  onChange={(e) => setJwtAlgorithm(e.target.value)}
                  className="w-full p-3 bg-stone-50 dark:bg-zinc-950 border border-stone-200 dark:border-zinc-800 rounded-xl text-sm font-bold"
                >
                  <option>HS256</option>
                  <option>HS384</option>
                  <option>HS512</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold uppercase text-stone-500 mb-1">Secret Key</label>
                <input
                  type="text"
                  value={jwtSecret}
                  onChange={(e) => setJwtSecret(e.target.value)}
                  className="w-full p-3 bg-stone-50 dark:bg-zinc-950 border border-stone-200 dark:border-zinc-800 rounded-xl font-mono text-xs"
                />
              </div>
            </div>
          </div>

          <button
            onClick={generateJwt}
            className="w-full py-3.5 bg-primary hover:bg-primary/90 text-white font-bold text-sm rounded-xl shadow-lg transition-all flex items-center justify-center gap-2"
          >
            <FiKey size={16} /> Sign & Generate JWT
          </button>

          {generatedJwt && (
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-xs font-bold uppercase text-stone-500">Signed JWT</span>
                <button
                  onClick={() => copyToClipboard(generatedJwt, 'jwt-gen')}
                  className="text-xs font-bold text-primary hover:underline flex items-center gap-1"
                >
                  {copiedKey === 'jwt-gen' ? <FiCheck size={14} /> : <FiCopy size={14} />} {copiedKey === 'jwt-gen' ? 'Copied' : 'Copy'}
                </button>
              </div>
              <pre className="p-4 bg-stone-900 text-emerald-400 border border-stone-200 dark:border-zinc-800 rounded-2xl font-mono text-xs overflow-x-auto break-all whitespace-pre-wrap">
                {generatedJwt}
              </pre>
            </div>
          )}
        </div>
      )}

      {/* 9. Bcrypt Hash & Verify */}
      {tool.id === 'bcrypt-hash-verify' && (
        <div className="space-y-6">
          <div className="p-4 bg-stone-50 dark:bg-zinc-950 border border-stone-200 dark:border-zinc-800 rounded-2xl space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase text-stone-500 mb-1">Password to Hash</label>
              <input
                type="text"
                value={bcryptInput}
                onChange={(e) => setBcryptInput(e.target.value)}
                className="w-full p-3 bg-white dark:bg-zinc-900 border border-stone-200 dark:border-zinc-800 rounded-xl font-mono text-sm font-bold"
              />
            </div>
            <div>
              <div className="flex justify-between text-xs font-bold uppercase text-stone-500 mb-1">
                <span>Salt Rounds</span>
                <span className="text-primary font-mono">{bcryptSaltRounds}</span>
              </div>
              <input
                type="range"
                min={4}
                max={16}
                value={bcryptSaltRounds}
                onChange={(e) => setBcryptSaltRounds(Number(e.target.value))}
                className="w-full accent-primary"
              />
            </div>
          </div>

          <button
            onClick={generateBcryptHash}
            className="w-full py-3.5 bg-primary hover:bg-primary/90 text-white font-bold text-sm rounded-xl shadow-lg transition-all flex items-center justify-center gap-2"
          >
            <FiLock size={16} /> Generate Bcrypt Hash
          </button>

          {bcryptHash && (
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-xs font-bold uppercase text-stone-500">Bcrypt Hash</span>
                <button
                  onClick={() => copyToClipboard(bcryptHash, 'bhash')}
                  className="text-xs font-bold text-primary hover:underline flex items-center gap-1"
                >
                  {copiedKey === 'bhash' ? <FiCheck size={14} /> : <FiCopy size={14} />} {copiedKey === 'bhash' ? 'Copied' : 'Copy'}
                </button>
              </div>
              <div className="p-3 bg-white dark:bg-zinc-900 border border-stone-200 dark:border-zinc-800 rounded-xl font-mono text-xs break-all text-stone-900 dark:text-white">
                {bcryptHash}
              </div>
            </div>
          )}

          <div className="border-t border-stone-200 dark:border-zinc-800 pt-6 space-y-3">
            <span className="text-xs font-bold uppercase text-stone-500">Verify Password Against Hash</span>
            <div className="flex gap-2">
              <input
                type="text"
                value={bcryptVerifyInput}
                onChange={(e) => setBcryptVerifyInput(e.target.value)}
                placeholder="Enter password to verify..."
                className="flex-1 p-3 bg-stone-50 dark:bg-zinc-950 border border-stone-200 dark:border-zinc-800 rounded-xl font-mono text-sm"
              />
              <button
                onClick={verifyBcryptHash}
                className="px-5 py-3 bg-stone-200 dark:bg-zinc-800 text-stone-700 dark:text-zinc-300 font-bold text-xs rounded-xl hover:bg-stone-300 transition-all"
              >
                Verify
              </button>
            </div>
            {bcryptVerifyResult && (
              <div className={`p-3 rounded-xl text-xs font-bold ${bcryptVerifyResult === 'match' ? 'bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 border border-emerald-200 dark:border-emerald-800' : 'bg-rose-50 dark:bg-rose-950/30 text-rose-600 border border-rose-200 dark:border-rose-800'}`}>
                {bcryptVerifyResult === 'match' ? 'Password matches the hash!' : 'Password does NOT match.'}
              </div>
            )}
          </div>
        </div>
      )}

      {/* 10. RSA Key Pair Generator */}
      {tool.id === 'rsa-key-generator' && (
        <div className="space-y-6">
          <div className="flex items-end gap-4">
            <div className="flex-1">
              <label className="block text-xs font-bold uppercase text-stone-500 mb-1">Key Size</label>
              <select
                value={rsaKeySize}
                onChange={(e) => setRsaKeySize(Number(e.target.value))}
                className="w-full p-3 bg-stone-50 dark:bg-zinc-950 border border-stone-200 dark:border-zinc-800 rounded-xl text-sm font-bold"
              >
                <option value={1024}>1024 bits (weak)</option>
                <option value={2048}>2048 bits (recommended)</option>
                <option value={4096}>4096 bits (strong)</option>
              </select>
            </div>
            <button
              onClick={generateRsaKeys}
              className="px-6 py-3 bg-primary hover:bg-primary/90 text-white font-bold text-sm rounded-xl shadow-lg transition-all flex items-center gap-2 shrink-0"
            >
              <FiKey size={16} /> Generate Key Pair
            </button>
          </div>

          {rsaPublicKey && (
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-bold uppercase text-stone-500">Public Key (PEM)</span>
                  <button
                    onClick={() => copyToClipboard(rsaPublicKey, 'rsa-pub')}
                    className="text-xs font-bold text-primary hover:underline flex items-center gap-1"
                  >
                    {copiedKey === 'rsa-pub' ? <FiCheck size={14} /> : <FiCopy size={14} />} {copiedKey === 'rsa-pub' ? 'Copied' : 'Copy'}
                  </button>
                </div>
                <pre className="p-3 bg-stone-900 text-emerald-400 border border-stone-200 dark:border-zinc-800 rounded-xl font-mono text-[10px] overflow-x-auto whitespace-pre-wrap max-h-40 overflow-y-auto">
                  {rsaPublicKey}
                </pre>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-bold uppercase text-stone-500">Private Key (PEM)</span>
                  <button
                    onClick={() => copyToClipboard(rsaPrivateKey, 'rsa-priv')}
                    className="text-xs font-bold text-primary hover:underline flex items-center gap-1"
                  >
                    {copiedKey === 'rsa-priv' ? <FiCheck size={14} /> : <FiCopy size={14} />} {copiedKey === 'rsa-priv' ? 'Copied' : 'Copy'}
                  </button>
                </div>
                <pre className="p-3 bg-stone-900 text-amber-400 border border-stone-200 dark:border-zinc-800 rounded-xl font-mono text-[10px] overflow-x-auto whitespace-pre-wrap max-h-40 overflow-y-auto">
                  {rsaPrivateKey}
                </pre>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Subnet Calculator */}
      {tool.id === 'subnet-calculator' && (
        <SubnetCalculator />
      )}

      {/* Port Scanner */}
      {tool.id === 'port-scanner' && (
        <div className="space-y-5">
          <div>
            <label className="block text-xs font-bold uppercase text-stone-500 mb-1">Target IP or Domain</label>
            <input type="text" value={portScanTarget} onChange={(e) => setPortScanTarget(e.target.value)} placeholder="e.g. 192.168.1.1 or example.com" className="w-full p-3 bg-stone-50 dark:bg-zinc-950 border border-stone-200 dark:border-zinc-800 rounded-xl font-mono text-sm" />
          </div>
          <button onClick={() => startJob({ target: portScanTarget, ports: '21,22,25,53,80,110,143,443,3306,3389,5432,8080' })} disabled={isProcessing} className="w-full py-3.5 bg-primary hover:bg-primary/90 disabled:opacity-50 text-white font-bold text-sm rounded-xl shadow-lg transition-all flex items-center justify-center gap-2">
            <FiZap size={16} /> {isProcessing ? 'Scanning...' : 'Scan Common Ports'}
          </button>
        </div>
      )}

      {/* Ping / Traceroute */}
      {tool.id === 'ping-traceroute' && (
        <div className="space-y-5">
          <div>
            <label className="block text-xs font-bold uppercase text-stone-500 mb-1">Target Host</label>
            <input type="text" value={pingTarget} onChange={(e) => setPingTarget(e.target.value)} placeholder="e.g. google.com or 8.8.8.8" className="w-full p-3 bg-stone-50 dark:bg-zinc-950 border border-stone-200 dark:border-zinc-800 rounded-xl font-mono text-sm" />
          </div>
          <button onClick={() => startJob({ host: pingTarget })} disabled={isProcessing} className="w-full py-3.5 bg-primary hover:bg-primary/90 disabled:opacity-50 text-white font-bold text-sm rounded-xl shadow-lg transition-all flex items-center justify-center gap-2">
            <FiZap size={16} /> {isProcessing ? 'Running...' : 'Ping & Traceroute'}
          </button>
        </div>
      )}
    </div>
  );
};
