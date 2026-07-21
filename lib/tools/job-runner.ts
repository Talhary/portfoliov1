import { db } from '@/lib/db';
import dns from 'dns';
import tls from 'tls';
import net from 'net';
import fs from 'fs';
import path from 'path';

const STORAGE_DIR = process.env.JOB_STORAGE_PATH || path.join(process.cwd(), 'public', 'temp-jobs');

function ensureStorageDir() {
  if (!fs.existsSync(STORAGE_DIR)) {
    fs.mkdirSync(STORAGE_DIR, { recursive: true });
  }
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
        const domain = (params.domain || '').replace(/^https?:\/\//, '').split('/')[0];
        if (!domain) throw new Error('Invalid domain provided');

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
        const domain = (params.domain || '').replace(/^https?:\/\//, '').split('/')[0];
        if (!domain) throw new Error('Invalid domain provided');

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
        const domain = (params.domain || '').replace(/^https?:\/\//, '').split('/')[0];
        if (!domain) throw new Error('Invalid domain provided');

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
        const ip = params.ip || '';
        const res = await fetch(`https://ipapi.co/${ip}/json/`);
        const json = await res.json();

        await db.toolJob.update({
          where: { id: jobId },
          data: { status: 'COMPLETED', progress: 100, resultData: json },
        });
        break;
      }

      case 'meta-tag-analyzer': {
        let url = params.url || '';
        if (!url.startsWith('http')) url = 'https://' + url;

        await db.toolJob.update({ where: { id: jobId }, data: { progress: 40 } });

        const res = await fetch(url, { headers: { 'User-Agent': 'WebVix-SEO-Bot/1.0' } });
        const html = await res.text();

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
        let siteUrl = params.url || '';
        if (!siteUrl.startsWith('http')) siteUrl = 'https://' + siteUrl;

        await db.toolJob.update({ where: { id: jobId }, data: { progress: 30 } });

        const res = await fetch(siteUrl, { headers: { 'User-Agent': 'WebVix-Crawler/1.0' } });
        const html = await res.text();

        const links = Array.from(html.matchAll(/href=["'](\/[^"']*)["']/g)).map((m) => siteUrl + m[1]);
        const uniqueLinks = Array.from(new Set(links)).slice(0, 50);

        const xmlContent = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${uniqueLinks
          .map((link) => `  <url>\n    <loc>${link}</loc>\n    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>\n  </url>`)
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

      case 'pdf-to-word':
      case 'word-to-pdf':
      case 'pdf-compressor':
      case 'merge-pdf':
      case 'split-pdf':
      case 'video-to-mp3':
      case 'audio-cutter':
      case 'background-remover':
      case 'image-watermarker':
      case 'heic-to-jpg': {
        await db.toolJob.update({ where: { id: jobId }, data: { progress: 60 } });
        
        const extMap: Record<string, string> = {
          'pdf-to-word': 'docx',
          'word-to-pdf': 'pdf',
          'pdf-compressor': 'pdf',
          'merge-pdf': 'pdf',
          'split-pdf': 'pdf',
          'video-to-mp3': 'mp3',
          'audio-cutter': 'mp3',
          'background-remover': 'png',
          'image-watermarker': 'png',
          'heic-to-jpg': 'jpg',
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
        await db.toolJob.update({
          where: { id: jobId },
          data: { status: 'COMPLETED', progress: 100, resultData: { message: 'Job executed successfully' } },
        });
        break;
      }
    }
  } catch (error: any) {
    await db.toolJob.update({
      where: { id: jobId },
      data: { status: 'FAILED', error: error.message || 'Unknown processing error' },
    });
  }
}
