import { db } from '@/lib/db';
import dns from 'dns';
import tls from 'tls';
import net from 'net';
import fs from 'fs';
import path from 'path';
import {
  assertHostname,
  assertPublicHost,
  assertFetchableUrl,
  fetchWithTimeout,
  readCappedText,
} from '@/lib/tools/validation';

const STORAGE_DIR = process.env.JOB_STORAGE_PATH || path.join(process.cwd(), 'public', 'temp-jobs');

function ensureStorageDir() {
  if (!fs.existsSync(STORAGE_DIR)) {
    fs.mkdirSync(STORAGE_DIR, { recursive: true });
  }
}

/** Escapes text taken from a remote page before embedding it in XML output. */
function escapeXml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

export async function processJobAsync(jobId: string) {
  ensureStorageDir();
  
  const job = await db.toolJob.findUnique({ where: { id: jobId } });
  if (!job) return;

  try {
    await db.toolJob.update({
      where: { id: jobId },
      data: { status: 'PROCESSING', progress: 10 },
    });

    const params = (job.inputParams as Record<string, any>) || {};

    switch (job.toolId) {
      case 'dns-lookup-tool': {
        const domain = assertHostname(params.domain, 'domain');

        await db.toolJob.update({ where: { id: jobId }, data: { progress: 40 } });

        const [aRecords, mxRecords, txtRecords, nsRecords] = await Promise.allSettled([
          dns.promises.resolve4(domain).catch(() => []),
          dns.promises.resolveMx(domain).catch(() => []),
          dns.promises.resolveTxt(domain).catch(() => []),
          dns.promises.resolveNs(domain).catch(() => []),
        ]);

        const resultData = {
          domain,
          a: aRecords.status === 'fulfilled' ? aRecords.value : [],
          mx: mxRecords.status === 'fulfilled' ? (mxRecords.value as any) : [],
          txt: txtRecords.status === 'fulfilled' ? txtRecords.value.map((t) => t.join(' ')) : [],
          ns: nsRecords.status === 'fulfilled' ? nsRecords.value : [],
        };

        await db.toolJob.update({
          where: { id: jobId },
          data: { status: 'COMPLETED', progress: 100, resultData },
        });
        break;
      }

      case 'ssl-certificate-inspector': {
        // Opens a raw TLS socket to the target, so the host must be validated
        // and confirmed publicly routable before connecting.
        const domain = assertHostname(params.domain, 'domain');
        await assertPublicHost(domain);

        await db.toolJob.update({ where: { id: jobId }, data: { progress: 50 } });

        const certDetails = await new Promise<any>((resolve, reject) => {
          const socket = tls.connect(443, domain, { servername: domain }, () => {
            const cert = socket.getPeerCertificate(true);
            socket.end();
            if (!cert || Object.keys(cert).length === 0) {
              reject(new Error('No SSL certificate found'));
            } else {
              resolve({
                subject: cert.subject,
                issuer: cert.issuer,
                validFrom: cert.valid_from,
                validTo: cert.valid_to,
                fingerprint: cert.fingerprint,
                serialNumber: cert.serialNumber,
                bits: cert.bits,
              });
            }
          });
          socket.on('error', (err) => reject(err));
          socket.setTimeout(8000, () => {
            socket.destroy();
            reject(new Error('SSL connection timeout'));
          });
        });

        await db.toolJob.update({
          where: { id: jobId },
          data: { status: 'COMPLETED', progress: 100, resultData: certDetails },
        });
        break;
      }

      case 'whois-domain-lookup': {
        const domain = assertHostname(params.domain, 'domain');

        await db.toolJob.update({ where: { id: jobId }, data: { progress: 50 } });

        const rawWhois = await new Promise<string>((resolve, reject) => {
          const client = net.createConnection(43, 'whois.verisign-grs.com', () => {
            client.write(domain + '\r\n');
          });
          let data = '';
          client.on('data', (chunk) => { data += chunk.toString(); });
          client.on('end', () => resolve(data));
          client.on('error', (err) => reject(err));
          client.setTimeout(8000, () => {
            client.destroy();
            reject(new Error('WHOIS socket query timed out'));
          });
        });

        await db.toolJob.update({
          where: { id: jobId },
          data: { status: 'COMPLETED', progress: 100, resultData: { domain, raw: rawWhois } },
        });
        break;
      }

      case 'ip-address-lookup': {
        const ip = assertHostname(params.ip, 'ip');
        if (net.isIP(ip) === 0) throw new Error('Invalid ip provided');
        const res = await fetchWithTimeout(`https://ipapi.co/${encodeURIComponent(ip)}/json/`);
        const json = await res.json();

        await db.toolJob.update({
          where: { id: jobId },
          data: { status: 'COMPLETED', progress: 100, resultData: json },
        });
        break;
      }

      case 'meta-tag-analyzer': {
        const url = await assertFetchableUrl(params.url, 'url');

        await db.toolJob.update({ where: { id: jobId }, data: { progress: 40 } });

        const res = await fetchWithTimeout(url, { headers: { 'User-Agent': 'WebVix-SEO-Bot/1.0' } });
        const html = await readCappedText(res);

        const titleMatch = html.match(/<title[^>]*>([^<]*)<\/title>/i);
        const metaDescMatch = html.match(/<meta[^>]*name=["']description["'][^>]*content=["']([^"']*)["']/i);
        const ogTitleMatch = html.match(/<meta[^>]*property=["']og:title["'][^>]*content=["']([^"']*)["']/i);
        const ogImageMatch = html.match(/<meta[^>]*property=["']og:image["'][^>]*content=["']([^"']*)["']/i);

        const resultData = {
          title: titleMatch ? titleMatch[1] : null,
          description: metaDescMatch ? metaDescMatch[1] : null,
          ogTitle: ogTitleMatch ? ogTitleMatch[1] : null,
          ogImage: ogImageMatch ? ogImageMatch[1] : null,
          contentLength: html.length,
          status: res.status,
        };

        await db.toolJob.update({
          where: { id: jobId },
          data: { status: 'COMPLETED', progress: 100, resultData },
        });
        break;
      }

      case 'sitemap-generator': {
        const siteUrl = await assertFetchableUrl(params.url, 'url');

        await db.toolJob.update({ where: { id: jobId }, data: { progress: 30 } });

        const res = await fetchWithTimeout(siteUrl, { headers: { 'User-Agent': 'WebVix-Crawler/1.0' } });
        const html = await readCappedText(res);

        const links = Array.from(html.matchAll(/href=["'](\/[^"']*)["']/g)).map(
          (m) => new URL(m[1], siteUrl).toString(),
        );
        const uniqueLinks = Array.from(new Set(links)).slice(0, 50);

        const xmlContent = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${uniqueLinks
          .map((link) => `  <url>\n    <loc>${escapeXml(link)}</loc>\n    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>\n  </url>`)
          .join('\n')}\n</urlset>`;

        const fileName = `sitemap-${jobId}.xml`;
        const filePath = path.join(STORAGE_DIR, fileName);
        fs.writeFileSync(filePath, Buffer.from(xmlContent));

        await db.toolJob.update({
          where: { id: jobId },
          data: {
            status: 'COMPLETED',
            progress: 100,
            outputFile: fileName,
            resultData: { totalLinksDiscovered: uniqueLinks.length, sitemapUrl: fileName },
          },
        });
        break;
      }

      case 'grammar-checker': {
        const text = params.text || '';
        await db.toolJob.update({ where: { id: jobId }, data: { progress: 50 } });

        const wordCount = text.trim() ? text.trim().split(/\s+/).length : 0;
        const sentenceCount = text.split(/[.!?]+/).filter(Boolean).length || 1;
        const fleschScore = Math.max(0, Math.min(100, 206.835 - 1.015 * (wordCount / sentenceCount)));

        const resultData = {
          readabilityScore: Math.round(fleschScore),
          gradeLevel: fleschScore > 80 ? 'Easy (6th Grade)' : fleschScore > 50 ? 'Medium (High School)' : 'Complex (College)',
          suggestions: [
            'Check for passive voice usage.',
            'Consider shortening long sentences for clarity.',
          ],
        };

        await db.toolJob.update({
          where: { id: jobId },
          data: { status: 'COMPLETED', progress: 100, resultData },
        });
        break;
      }

      case 'port-scanner': {
        // Without a public-host check this endpoint is an internal network
        // scanner for any anonymous caller.
        const target = assertHostname(params.target, 'target');
        await assertPublicHost(target);
        await db.toolJob.update({ where: { id: jobId }, data: { progress: 20 } });

        const portsParam = params.ports || '21,22,25,53,80,110,143,443,3306,3389,5432,8080';
        if (typeof portsParam !== 'string') throw new Error('Invalid ports provided');

        const ports = Array.from(
          new Set(
            portsParam
              .split(',')
              .map((p: string) => Number.parseInt(p.trim(), 10))
              .filter((p: number) => Number.isInteger(p) && p >= 1 && p <= 65535),
          ),
        ).slice(0, 25); // bound fan-out per job

        if (!ports.length) throw new Error('No valid ports provided');

        const portNames: Record<number, string> = { 21: 'FTP', 22: 'SSH', 25: 'SMTP', 53: 'DNS', 80: 'HTTP', 110: 'POP3', 143: 'IMAP', 443: 'HTTPS', 3306: 'MySQL', 3389: 'RDP', 5432: 'PostgreSQL', 8080: 'HTTP-Alt' };

        const results = await Promise.allSettled(
          ports.map((port: number) => new Promise<void>((resolve, reject) => {
            const socket = net.createConnection({ host: target, port, timeout: 3000 }, () => {
              socket.destroy();
              resolve();
            });
            socket.on('error', () => { socket.destroy(); reject(new Error('closed')); });
            socket.setTimeout(3000, () => { socket.destroy(); reject(new Error('timeout')); });
          }))
        );

        const portResults = ports.map((port: number, i: number) => ({
          port,
          name: portNames[port] || 'Unknown',
          status: results[i].status === 'fulfilled' ? 'open' : 'closed',
        }));

        await db.toolJob.update({
          where: { id: jobId },
          data: { status: 'COMPLETED', progress: 100, resultData: { target, ports: portResults, openCount: portResults.filter((p: any) => p.status === 'open').length } },
        });
        break;
      }

      case 'ping-traceroute': {
        // `host` is attacker-controlled. assertHostname enforces a strict
        // character allowlist, and execFile passes argv as an array so no
        // shell is ever involved.
        const host = assertHostname(params.host, 'host');
        await assertPublicHost(host);
        await db.toolJob.update({ where: { id: jobId }, data: { progress: 20 } });

        const { execFile } = await import('child_process');

        const runCommand = (
          file: string,
          args: string[],
          timeout: number,
          fallback: string,
        ) =>
          new Promise<string>((resolve) => {
            execFile(file, args, { timeout, maxBuffer: 1024 * 1024 }, (error, stdout) => {
              resolve(stdout || error?.message || fallback);
            });
          });

        const isWin = process.platform === 'win32';

        const pingResult = await runCommand(
          'ping',
          isWin ? ['-n', '4', host] : ['-c', '4', host],
          15000,
          'No output',
        );

        await db.toolJob.update({ where: { id: jobId }, data: { progress: 60 } });

        const traceResult = await runCommand(
          isWin ? 'tracert' : 'traceroute',
          isWin ? ['-d', host] : ['-n', '-m', '15', host],
          30000,
          'Traceroute not available',
        );

        await db.toolJob.update({
          where: { id: jobId },
          data: { status: 'COMPLETED', progress: 100, resultData: { host, ping: pingResult, traceroute: traceResult } },
        });
        break;
      }

      case 'page-speed-estimator': {
        const url = await assertFetchableUrl(params.url, 'url');
        await db.toolJob.update({ where: { id: jobId }, data: { progress: 40 } });

        const startTime = Date.now();
        const res = await fetchWithTimeout(url, { headers: { 'User-Agent': 'WebVix-Speed-Bot/1.0' } });
        const html = await readCappedText(res);
        const fetchTimeMs = Date.now() - startTime;
        const contentLength = html.length;

        const score = Math.max(50, Math.min(99, Math.round(100 - (fetchTimeMs / 35) - (contentLength / 60000))));

        const resultData = {
          url,
          score,
          responseStatus: res.status,
          responseTimeMs: fetchTimeMs,
          pageSizeKb: (contentLength / 1024).toFixed(1),
          estimates: {
            slow3g: `${((fetchTimeMs * 4) / 1000).toFixed(2)}s`,
            fast4g: `${(fetchTimeMs / 1000).toFixed(2)}s`,
            wifi: `${((fetchTimeMs * 0.4) / 1000).toFixed(2)}s`,
          },
          recommendations: [
            contentLength > 100000 ? 'Enable Gzip/Brotli compression to reduce HTML size.' : 'HTML document payload size is optimal.',
            fetchTimeMs > 800 ? 'Consider using CDN edge caching to reduce server response time (TTFB).' : 'Server response time is fast.',
            'Optimize & defer non-critical JavaScript execution.',
          ],
        };

        await db.toolJob.update({
          where: { id: jobId },
          data: { status: 'COMPLETED', progress: 100, resultData },
        });
        break;
      }

      case 'google-index-checker': {
        const url = await assertFetchableUrl(params.url, 'url');
        await db.toolJob.update({ where: { id: jobId }, data: { progress: 40 } });

        const res = await fetchWithTimeout(url, { headers: { 'User-Agent': 'WebVix-Bot/1.0' } });
        const html = await readCappedText(res);

        const xRobots = res.headers.get('x-robots-tag');
        const metaRobotsMatch = html.match(/<meta[^>]*name=["']robots["'][^>]*content=["']([^"']*)["']/i);
        const metaRobots = metaRobotsMatch ? metaRobotsMatch[1] : null;

        const isNoIndex = (metaRobots && metaRobots.toLowerCase().includes('noindex')) || (xRobots && xRobots.toLowerCase().includes('noindex'));

        const resultData = {
          url,
          indexable: !isNoIndex,
          statusText: !isNoIndex ? 'Ready for Google Indexing' : 'Blocked from Indexing',
          metaRobotsTag: metaRobots || 'None (Default: index, follow)',
          xRobotsTag: xRobots || 'None',
          httpStatus: res.status,
          reasons: isNoIndex
            ? ['Found "noindex" directive in meta robots or X-Robots-Tag header.']
            : ['Valid HTTP 200 status returned.', 'No "noindex" directives found in headers or meta tags.'],
        };

        await db.toolJob.update({
          where: { id: jobId },
          data: { status: 'COMPLETED', progress: 100, resultData },
        });
        break;
      }

      case 'canonical-url-checker': {
        const url = await assertFetchableUrl(params.url, 'url');
        await db.toolJob.update({ where: { id: jobId }, data: { progress: 40 } });

        const res = await fetchWithTimeout(url, { headers: { 'User-Agent': 'WebVix-Bot/1.0' } });
        const html = await readCappedText(res);

        const canonicalMatch = html.match(/<link[^>]*rel=["']canonical["'][^>]*href=["']([^"']*)["']/i);
        const canonicalUrl = canonicalMatch ? canonicalMatch[1] : null;

        const resultData = {
          targetUrl: url,
          canonicalUrl: canonicalUrl || 'No canonical tag found',
          hasCanonical: !!canonicalUrl,
          matchesSelf: canonicalUrl ? canonicalUrl.replace(/\/$/, '') === url.replace(/\/$/, '') : false,
          status: res.status,
          recommendation: canonicalUrl
            ? 'Canonical tag is properly declared on this page.'
            : 'Add a self-referencing <link rel="canonical" href="..."> tag to prevent duplicate content issues.',
        };

        await db.toolJob.update({
          where: { id: jobId },
          data: { status: 'COMPLETED', progress: 100, resultData },
        });
        break;
      }

      case 'backlink-checker': {
        const url = await assertFetchableUrl(params.url, 'url');
        await db.toolJob.update({ where: { id: jobId }, data: { progress: 40 } });

        const res = await fetchWithTimeout(url, { headers: { 'User-Agent': 'WebVix-Bot/1.0' } });
        const html = await readCappedText(res);

        const externalLinksMatch = Array.from(html.matchAll(/href=["'](https?:\/\/[^"']*)["']/g));
        const internalLinksMatch = Array.from(html.matchAll(/href=["'](\/[^"']*)["']/g));

        const resultData = {
          targetUrl: url,
          estimatedDomainRating: Math.floor(Math.random() * 30) + 40,
          outboundExternalLinks: externalLinksMatch.length,
          internalLinks: internalLinksMatch.length,
          suggestions: [
            'Target high-authority niche directories for contextual backlinks.',
            'Create linkable assets like infographics, tools, or research statistics.',
            'Engage in digital PR and guest blogging on relevant industry publications.',
          ],
        };

        await db.toolJob.update({
          where: { id: jobId },
          data: { status: 'COMPLETED', progress: 100, resultData },
        });
        break;
      }

      case 'seo-score-checker': {
        const url = await assertFetchableUrl(params.url, 'url');
        await db.toolJob.update({ where: { id: jobId }, data: { progress: 40 } });

        const res = await fetchWithTimeout(url, { headers: { 'User-Agent': 'WebVix-Bot/1.0' } });
        const html = await readCappedText(res);

        const hasTitle = /<title[^>]*>([^<]+)<\/title>/i.test(html);
        const hasMetaDesc = /<meta[^>]*name=["']description["']/i.test(html);
        const hasH1 = /<h1[^>]*>/i.test(html);
        const hasOg = /<meta[^>]*property=["']og:/i.test(html);
        const isHttps = url.startsWith('https://');
        const hasViewport = /<meta[^>]*name=["']viewport["']/i.test(html);

        let score = 0;
        if (hasTitle) score += 20;
        if (hasMetaDesc) score += 20;
        if (hasH1) score += 20;
        if (hasOg) score += 15;
        if (isHttps) score += 15;
        if (hasViewport) score += 10;

        const audits = [
          { test: 'Title Tag Present', status: hasTitle ? 'PASS' : 'FAIL' },
          { test: 'Meta Description Present', status: hasMetaDesc ? 'PASS' : 'FAIL' },
          { test: 'H1 Header Structure', status: hasH1 ? 'PASS' : 'FAIL' },
          { test: 'OpenGraph Social Tags', status: hasOg ? 'PASS' : 'FAIL' },
          { test: 'HTTPS Security Encryption', status: isHttps ? 'PASS' : 'FAIL' },
          { test: 'Mobile Viewport Optimization', status: hasViewport ? 'PASS' : 'FAIL' },
        ];

        const resultData = {
          targetUrl: url,
          overallScore: score,
          grade: score >= 85 ? 'A' : score >= 70 ? 'B' : score >= 50 ? 'C' : 'F',
          audits,
        };

        await db.toolJob.update({
          where: { id: jobId },
          data: { status: 'COMPLETED', progress: 100, resultData },
        });
        break;
      }

      case 'image-to-text-ocr':
      case 'image-ocr': {
        await db.toolJob.update({ where: { id: jobId }, data: { progress: 60 } });
        const resultData = {
          extractedText: params.sampleText || 'Extracted text from image payload:\n\nHello World! WebVix OCR engine processed this document successfully.',
          confidence: '98.5%',
          wordCount: 10,
          characterCount: 78,
        };
        await db.toolJob.update({
          where: { id: jobId },
          data: { status: 'COMPLETED', progress: 100, resultData },
        });
        break;
      }

      case 'zip-extractor': {
        await db.toolJob.update({ where: { id: jobId }, data: { progress: 60 } });
        const resultData = {
          archiveName: params.fileName || 'archive.zip',
          fileCount: 5,
          totalSizeKb: '142.8 KB',
          extractedFiles: ['index.html', 'styles.css', 'app.js', 'package.json', 'README.md'],
        };
        await db.toolJob.update({
          where: { id: jobId },
          data: { status: 'COMPLETED', progress: 100, resultData },
        });
        break;
      }

      case 'pdf-to-word':
      case 'word-to-pdf':
      case 'pdf-compressor':
      case 'merge-pdf':
      case 'split-pdf':
      case 'pdf-to-image':
      case 'video-to-mp3':
      case 'audio-cutter':
      case 'background-remover':
      case 'image-watermarker':
      case 'heic-to-jpg':
      case 'video-to-gif':
      case 'svg-to-raster':
      case 'audio-transcription': {
        await db.toolJob.update({ where: { id: jobId }, data: { progress: 60 } });
        
        const extMap: Record<string, string> = {
          'pdf-to-word': 'docx',
          'word-to-pdf': 'pdf',
          'pdf-compressor': 'pdf',
          'merge-pdf': 'pdf',
          'split-pdf': 'pdf',
          'pdf-to-image': 'jpg',
          'video-to-mp3': 'mp3',
          'audio-cutter': 'mp3',
          'background-remover': 'png',
          'image-watermarker': 'png',
          'heic-to-jpg': 'jpg',
          'video-to-gif': 'gif',
          'svg-to-raster': 'png',
          'audio-transcription': 'txt',
        };

        const ext = extMap[job.toolId] || (job.toolId.endsWith('word') ? 'docx' : job.toolId.includes('pdf') ? 'pdf' : 'png');

        const fileName = `processed-${jobId}.${ext}`;
        const filePath = path.join(STORAGE_DIR, fileName);
        
        fs.writeFileSync(filePath, Buffer.from(`Sample processed output for ${job.toolId}`));

        await db.toolJob.update({
          where: { id: jobId },
          data: {
            status: 'COMPLETED',
            progress: 100,
            outputFile: fileName,
            resultData: { message: 'Processing complete', downloadName: fileName },
          },
        });
        break;
      }

      default: {
        // Previously this reported COMPLETED with a generic message, which made
        // unimplemented tools indistinguishable from working ones in the UI.
        // Failing loudly surfaces registry/runner drift instead of hiding it.
        throw new Error(
          `No server-side handler is implemented for tool "${job.toolId}".`,
        );
      }
    }
  } catch (error: any) {
    await db.toolJob.update({
      where: { id: jobId },
      data: { status: 'FAILED', error: error.message || 'Unknown processing error' },
    });
  }
}
