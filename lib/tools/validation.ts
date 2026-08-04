import dns from 'dns';
import net from 'net';

/**
 * Shared input validation for server-side tool jobs.
 *
 * Every value handled here originates from an unauthenticated request body
 * (`POST /api/tools/jobs`), so it is treated as hostile until proven otherwise.
 */

// RFC 1123 hostname: labels of alphanumerics/hyphens, no leading/trailing hyphen.
const HOSTNAME_RE = /^(?=.{1,253}$)([a-z0-9]([a-z0-9-]{0,61}[a-z0-9])?\.)*[a-z0-9]([a-z0-9-]{0,61}[a-z0-9])?$/i;

/**
 * Normalises user input into a bare hostname or IP literal.
 *
 * Strips scheme, credentials, port and path, then enforces a strict character
 * allowlist. Anything carrying shell metacharacters fails here rather than
 * reaching a command line.
 */
export function assertHostname(raw: unknown, field = 'domain'): string {
  if (typeof raw !== 'string' || !raw.trim()) {
    throw new Error(`Invalid ${field} provided`);
  }

  let host = raw.trim().replace(/^[a-z][a-z0-9+.-]*:\/\//i, '');
  host = host.split('/')[0].split('?')[0].split('#')[0];
  host = host.split('@').pop() as string; // drop user:pass@
  host = host.replace(/^\[([^\]]+)\]$/, '$1'); // unwrap [::1]
  if (host.includes(':') && net.isIP(host) === 0) {
    host = host.split(':')[0]; // strip :port from non-IPv6
  }
  host = host.replace(/\.$/, '').toLowerCase();

  if (!host) throw new Error(`Invalid ${field} provided`);

  if (net.isIP(host) === 0 && !HOSTNAME_RE.test(host)) {
    throw new Error(`Invalid ${field} provided`);
  }

  return host;
}

/** IPv4/IPv6 ranges that must never be reachable through a user-supplied target. */
function isPrivateAddress(ip: string): boolean {
  const version = net.isIP(ip);

  if (version === 4) {
    const [a, b] = ip.split('.').map(Number);
    if (a === 10) return true;
    if (a === 127) return true;
    if (a === 0) return true;
    if (a === 169 && b === 254) return true; // link-local + cloud metadata
    if (a === 172 && b >= 16 && b <= 31) return true;
    if (a === 192 && b === 168) return true;
    if (a === 100 && b >= 64 && b <= 127) return true; // CGNAT
    if (a >= 224) return true; // multicast + reserved
    return false;
  }

  if (version === 6) {
    const v6 = ip.toLowerCase();
    if (v6 === '::' || v6 === '::1') return true;
    if (v6.startsWith('fe80') || v6.startsWith('fc') || v6.startsWith('fd')) return true;
    // IPv4-mapped (::ffff:169.254.169.254) must be unwrapped and rechecked.
    const mapped = v6.match(/^::ffff:(\d+\.\d+\.\d+\.\d+)$/);
    if (mapped) return isPrivateAddress(mapped[1]);
    return false;
  }

  return true;
}

/**
 * Resolves a hostname and rejects it if any answer points into private space.
 *
 * This closes the SSRF path where a public hostname resolves to 127.0.0.1 or
 * 169.254.169.254 (cloud instance metadata).
 */
export async function assertPublicHost(host: string): Promise<void> {
  if (net.isIP(host) !== 0) {
    if (isPrivateAddress(host)) {
      throw new Error('Target resolves to a private or reserved address');
    }
    return;
  }

  let addresses: string[];
  try {
    const records = await dns.promises.lookup(host, { all: true });
    addresses = records.map((r) => r.address);
  } catch {
    throw new Error('Target hostname could not be resolved');
  }

  if (!addresses.length || addresses.some(isPrivateAddress)) {
    throw new Error('Target resolves to a private or reserved address');
  }
}

/**
 * Validates a user-supplied URL for server-side fetching.
 *
 * Enforces http/https only and verifies the host is publicly routable.
 */
export async function assertFetchableUrl(raw: unknown, field = 'url'): Promise<string> {
  if (typeof raw !== 'string' || !raw.trim()) {
    throw new Error(`Invalid ${field} provided`);
  }

  const candidate = /^[a-z][a-z0-9+.-]*:\/\//i.test(raw.trim())
    ? raw.trim()
    : `https://${raw.trim()}`;

  let parsed: URL;
  try {
    parsed = new URL(candidate);
  } catch {
    throw new Error(`Invalid ${field} provided`);
  }

  if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') {
    throw new Error('Only http and https URLs are supported');
  }

  await assertPublicHost(assertHostname(parsed.hostname, field));
  return parsed.toString();
}

/** Caps a remote response so a hostile server cannot exhaust server memory. */
export async function readCappedText(res: Response, maxBytes = 2_000_000): Promise<string> {
  const declared = Number(res.headers.get('content-length') ?? 0);
  if (declared > maxBytes) {
    throw new Error('Remote response exceeds the maximum allowed size');
  }

  if (!res.body) return '';

  const reader = res.body.getReader();
  const chunks: Uint8Array[] = [];
  let total = 0;

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    total += value.length;
    if (total > maxBytes) {
      await reader.cancel();
      throw new Error('Remote response exceeds the maximum allowed size');
    }
    chunks.push(value);
  }

  return Buffer.concat(chunks.map((c) => Buffer.from(c))).toString('utf8');
}

/** Fetch with an enforced timeout so a slow remote cannot pin a worker open. */
export async function fetchWithTimeout(
  url: string,
  init: RequestInit = {},
  timeoutMs = 10_000,
): Promise<Response> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    return await fetch(url, { ...init, signal: controller.signal, redirect: 'manual' });
  } finally {
    clearTimeout(timer);
  }
}
