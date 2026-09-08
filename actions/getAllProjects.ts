import { db } from "@/lib/db";

const slugify = (text: string) => text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');

export const STATIC_PROJECTS: any[] = [
  {
    id: "cmshac87q0001iop79qhdj3u8",
    title: "Nerihya Mobile & Ios App",
    description: "Nerihya is a complete, commercial-grade Customer Loyalty & Store Rewards platform tailored for local retail stores, cafes, and service merchants in the UK market, paired with a consumer loyalty app. Connects merchants and consumers via QR code checkout rewards, tier management, and real-time merchant analytics.",
    type: "mobile-app",
    link: "https://nerihya.com",
    imageUrl: [
      "https://utfs.io/f/oIfiQCDNNhV2kOo3eufiUn8asHcg7ZDl0m6EetYCfWSj2XrF",
      "https://utfs.io/f/oIfiQCDNNhV238VjjkD9JoRuVnSxOyPkmCd8EHfX7DThWGeM",
      "https://utfs.io/f/oIfiQCDNNhV2Rb66504OGWxXwDsveQIacyBVlqEzZHkp810j",
      "https://utfs.io/f/oIfiQCDNNhV2dRMT32BLG7suIqkWOtlbvFQYmNXC8cwfJh9H",
      "https://utfs.io/f/oIfiQCDNNhV2cw7nUogmynJAlhQXavcCtZFBqsdeozf6GPM1",
      "https://utfs.io/f/oIfiQCDNNhV2arOLESHQjk0x4rH2BOtqEVeSg7u1LAlcMnNU",
      "https://utfs.io/f/oIfiQCDNNhV2VVhZeBOJ9GBPbhHA3fkW4FTSzZLM6o1NlYaC",
      "https://utfs.io/f/oIfiQCDNNhV2tgIasXoQkR1yHCzP9xGYt302lMSXTVqnJ5pm"
    ],
    githubUrl: "https://github.com/talhary",
    order: 1,
    stack: ["React Native", "Expo", "iOS", "Android", "Node.js", "TypeScript"],
    createdAt: new Date("2026-08-06T08:53:12.200Z"),
    updatedAt: new Date("2026-08-06T08:53:12.200Z"),
  },
  {
    id: "datanodes-cloud-streaming-platform",
    title: "MJ Acedemy: Free Online Courses Platform",
    description: `DataNodes is an enterprise-grade distributed media ingestion, cloud storage virtualization, and sub-second encrypted video streaming platform powering [MJ Academy](https://mjacedemy.talhacodes.site/). It aggregates 15TB+ of decoupled cloud storage accounts into a unified virtual storage tier with dynamic load-balancing, real-time AES-256-CTR random-access stream decryption, automated rate-limit circuit breakers, and zero-proxy serverless streaming handoffs.

=== TECHNICAL SPECIFICATIONS & ARCHITECTURE ===

## 1. Executive Architecture Overview
DataNodes is an enterprise-grade distributed media ingestion, storage virtualization, and sub-second video streaming platform. It solves three critical distributed systems challenges:

- **Zero-Proxy Serverless Streaming**: Eliminates edge/serverless bandwidth saturation and execution timeout constraints by generating time-bound, cryptographically signed streaming handoffs directly from high-throughput streaming nodes.
- **Random-Access Stream Cipher Decryption**: Implements real-time, on-the-fly AES-256-CTR (Counter Mode) stream decryption with 128-bit block counter arithmetic, enabling sub-second HTTP 206 Partial Content timeline seeking over multi-gigabyte encrypted files without buffering or decrypting preceding bytes.
- **Storage Virtualization & Dynamic Pool Failover**: Aggregates multiple decoupled cloud storage accounts (Google Drive / Cloud Object Storage) into a unified, virtualized high-capacity storage pool with automated health probing, rate-limit circuit breakers, and self-healing failover.

## 2. Deep-Dive Architectural Pillars

### Pillar 1: Zero-Leak Cryptographic Architecture & Opaque Ephemeral Tokens
In conventional streaming architectures, client video players are often handed direct cloud storage URLs, exposing sensitive IDs (e.g., Google Drive File IDs, Account IDs, bucket paths, or API keys).

DataNodes implements a Strict Zero-Leak Security Boundary:
- **Opaque Stream Token**: \`"st1_" + Base64URL([12-byte IV] + [16-byte Auth Tag] + [AES-256-GCM Ciphertext])\`
- **Authenticated Encryption (AES-256-GCM)**: The token contains an initialization vector (12 bytes), a cryptographic authentication tag (16 bytes), and the encrypted JSON payload (\`{ f: driveFileId, a: accountId, n: fileName, iat: issuedAt, exp: expirationTimestamp }\`). Any client tampering immediately triggers a 403 Forbidden.
- **Time-To-Live (TTL) Hard Expiration**: Video streaming tokens expire strictly in 2 hours. Support material download tokens expire in 1 hour. Links cannot be cached or leaked onto scraping networks as permanent download links.
- **Origin & Referer Validation Guard**: The endpoint \`/api/stream-url\` enforces per-IP token bucket rate limiting (40 req/min) combined with strict HTTP Referer and Origin validation to prevent hotlinking and third-party embedding.

### Pillar 2: Random-Access Stream Cipher Decryption (Sub-Second HTTP 206 Seeking)
Most encrypted storage systems use block ciphers like AES-CBC or AES-GCM, which require decrypting from byte 0 or buffering entire multi-megabyte ciphertext blocks. This makes smooth video timeline scrubbing and HTTP 206 Partial Content requests impossible.

DataNodes utilizes AES-256-CTR (Counter Mode) stream encryption with custom block-counter arithmetic to enable true O(1) random-access stream seeking:
- **IV Extraction & Caching**: The initial 16-byte IV is prepended as a file header upon upload. During streaming, the streaming node fetches and caches this 16-byte header in an LRU memory cache.
- **Block Boundary Computation**: Starting block index and fractional offset computed in real-time:
\`\`\`terminal
Block Index      = floor(P_start / 16)
Sub-Block Offset = P_start % 16
Seek IV          = (IV_original + Block Index) mod (2^128)
Upstream Range   = [(Block Index * 16) + 16, P_end + 16]
\`\`\`
- **On-The-Fly Transform Decryption**: The incoming upstream chunk stream is piped through a Node.js Transform stream initialized with \`Seek IV\`. If \`Sub-Block Offset > 0\`, initial fractional bytes are discarded, and the decrypted stream is immediately piped to the client under HTTP status 206 Partial Content.
- **Zero Memory Buffer Overhead**: Decryption occurs strictly chunk-by-chunk in memory buffers with backpressure management. The server never writes temporary decrypted video segments to local disk.

### Pillar 3: Multi-Account Cloud Storage Virtualization & Dynamic Pooling
Rather than being tied to a single cloud storage bucket or incurring cloud provider data transfer fees, DataNodes abstracts multiple high-capacity Google Cloud/Drive accounts into a single unified virtual file system:
- **Dynamic Account Resolution**: Files are distributed across accounts based on available quota, target folder topology, and load balancing factors. When a stream request arrives, the streaming service looks up the owning account from a high-speed memory cache. In cache-miss scenarios, it issues non-blocking parallel metadata probes across accounts using \`Promise.any()\`, auto-associating the file with the responding account.
- **Seamless Permissions Layer**: Storage accounts share access to unified folder topologies via the Google Drive Permissions API (role: writer), allowing any registered worker node to upload to designated pools without cross-account permission conflicts.

### Pillar 4: Automated Rate-Limit Circuit Breaker & Self-Healing Health Shield
Cloud APIs enforce strict per-account quotas (e.g. maximum daily upload limits and requests-per-second ceilings). When an account encounters \`403 userRateLimitExceeded\`:
- **Circuit Breaker Tripped**: Flips \`is_active = FALSE\` in PostgreSQL, ejects the account from the ingestion load balancer rotation, and routes incoming uploads to alternative active accounts.
- **Zero Downtime for Readers**: Even if an account enters rate-limit quarantine for write/upload operations, read operations (streaming existing video files) remain active with graceful fallback.
- **Autonomous Probe Loop (Every 60 Seconds)**:
  - Test 1: Refresh OAuth2 access tokens.
  - Test 2: Query lightweight metadata (/about endpoint).
  - Test 3: Initiate ephemeral probe resumable upload session.
- **Self-Healing Recovery**: Upon successful probe (200 OK), flips \`is_active = TRUE\` in PostgreSQL and re-admits the account into the load-balancer rotation without restarting any services.

### Pillar 5: High-Throughput Media Ingestion & Inode-Protected Packaging Pipeline
When ingesting large interactive educational courses, code repositories often contain hundreds of thousands of microscopic files (node_modules, package trees, nested datasets). Directly uploading 300,000 tiny files to cloud object storage results in severe API rate limiting, inode exhaustion, and hours of network latency.
- **File Type Classification**: Videos (.mp4, .mkv, .webm) are preserved in structured lesson hierarchies and encrypted individually for sub-second streaming. Support materials are aggregated into a unified materials pool.
- **Multi-Core Split-Volume Packaging (7-Zip Engine)**: Materials are compressed using multi-threaded 7-Zip (\`-mmt=on\`) into fixed 1GB split volumes (\`-v1024m\`). If under 1GB, output normalizes into a single clean \`Course_Materials.zip\`.
- **Immediate Disk Reclamation (Zero-Footprint Pipeline)**: High-speed downloads utilize a compiled Go engine (\`dlengine\`) with 16 parallel TCP socket streams per part. Multi-part archives are unlinked from disk the millisecond extraction succeeds; loose materials are unlinked the moment 7-Zip split volumes finalize; split volumes and videos are unlinked immediately upon receiving 200 OK from cloud upload.
- **Impact**: An ephemeral runner with only 40GB scratch disk space can ingest, package, and upload 120GB+ course libraries without disk-full exceptions.

### Pillar 6: Next.js SSR Hybrid Architecture & Direct Node Streaming
Traditional web applications stream video by proxying media bytes through backend serverless functions, causing 10–15s function timeouts and expensive serverless egress billing.
- **Decoupled Handoff Pattern**: The Next.js SSR tier handles catalog exploration, full-text search, and server-side metadata caching.
- **Direct TCP Streaming**: Heavy media streaming connections bypass serverless edge compute entirely, communicating directly with dedicated Node.js streaming nodes built for sustained TCP streaming and low latency.

## 3. Key Technical Specifications Matrix

| Engineering Vector | Architecture Strategy | Performance & Reliability Metric |
| --- | --- | --- |
| Stream Cipher | AES-256-CTR with 128-bit modular block counter arithmetic | Sub-second HTTP 206 Partial Content random-access timeline seeking |
| Token Security | AES-256-GCM authenticated encryption (12-byte IV + 16-byte Auth Tag) | 2-Hour TTL hard expiration, HMAC-SHA256 signature verification |
| Access Control | Strict Referer & Origin validation with per-IP token bucket limits | Zero-leak file IDs; 40 req/min endpoint rate limiting prevents hotlinking |
| Storage Topology | Decoupled Multi-Account Google Drive & Object Storage virtualization | 15TB+ aggregated pooled capacity with automated quota balancing |
| Circuit Breaker | PostgreSQL account status flip with 60s probe recovery loop | Zero read downtime on 403 userRateLimitExceeded with automatic healing |
| Course Packaging | Multi-threaded 7-Zip (-mmt=on, -v1024m 1GB split volumes) | 99.9% inode drop (from 300,000 tiny files to ~30 clean archive parts) |
| Download Engine | Custom compiled Go crawler (dlengine) with 16 parallel sockets | 120GB+ course libraries ingested within ephemeral 40GB scratch disks |
| Web Architecture | Next.js 14 SSR App Router with decoupled Node.js streaming daemons | Bypasses serverless timeout limits and serverless egress bandwidth costs |`,

    type: "Distributed Systems | Cloud Virtualization | Media Streaming | Backend",
    link: "https://mjacedemy.talhacodes.site/",
    imageUrl: [
      "/projects/datanodes/mj-academy-hero.png",
      "/projects/datanodes/datanodes-architecture.jpg",
      "/projects/datanodes/mj-academy-course.png",
      "/projects/datanodes/datanodes-player-theater.jpg",
      "/projects/datanodes/datanodes-pool-dashboard.jpg",
      "/projects/datanodes/mj-academy-branding.png"
    ],
    githubUrl: "https://github.com/talhary",
    order: 2,
    stack: [
      "Next.js 14 SSR",
      "Node.js",
      "Express.js",
      "TypeScript",
      "AES-256-CTR",
      "AES-256-GCM",
      "Neon PostgreSQL",
      "Google Drive API",
      "Golang (dlengine)",
      "7-Zip Multi-Core",
      "Docker",
      "WebSockets"
    ],
    createdAt: new Date("2026-08-10T10:00:00.000Z"),
    updatedAt: new Date("2026-09-08T12:00:00.000Z"),
  },
  {
    id: "cmr99mz890001r1i40iiqriw3",
    title: "Labayik Traders ERP - Sales & Distribution Management System",
    description: "Enterprise-grade Sales, Distribution, Logistics, and Financial ERP platform designed for wholesale trading networks. Features dynamic booker routing, multi-tier credit ledger separation, double-entry accounting, P&L reporting, and offline-first mobile operations.",
    type: "backend|frontend|webapps",
    link: "https://labaiktraders.vercel.app/",
    imageUrl: [
      "https://utfs.io/f/oIfiQCDNNhV27C4k77dLETZMFeP1uNUwXKdHAqRSILQrBsCl",
      "https://utfs.io/f/oIfiQCDNNhV2devKhkBLG7suIqkWOtlbvFQYmNXC8cwfJh9H",
      "https://utfs.io/f/oIfiQCDNNhV2dIHr2JBLG7suIqkWOtlbvFQYmNXC8cwfJh9H",
      "https://utfs.io/f/oIfiQCDNNhV2pbTCfHAk0tqC1iGTsO2SlY49KmeEb3JaDXxw"
    ],
    githubUrl: "https://github.com/talhary",
    order: 3,
    stack: ["React 19", "Express.js", "PostgreSQL", "Drizzle ORM", "Tailwind CSS v4", "TypeScript"],
    createdAt: new Date("2026-07-06T13:36:00.398Z"),
    updatedAt: new Date("2026-07-06T13:36:00.398Z"),
  },
  {
    id: "google-places-lead-streamer",
    title: "Google Places Real-Time Lead Streamer",
    description: "Distributed headless browser cluster streaming verified B2B business leads (phone, rating, reviews, address, website) in real-time over Server-Sent Events (SSE) as Chromium navigates Google Maps.",
    type: "Scrapers | Tools | Backend",
    link: "/tools/places-stream",
    imageUrl: ["https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?q=80&w=1000&auto=format&fit=crop"],
    githubUrl: "https://github.com/talhary/portfoliov1",
    order: 4,
    stack: ["Puppeteer CDP", "SSE Streams", "Node.js", "TypeScript", "Headless Chrome", "Data Export"],
    createdAt: new Date("2026-08-19T00:00:00Z"),
    updatedAt: new Date("2026-08-19T00:00:00Z"),
  },
  {
    id: "go-contact-harvester",
    title: "High-Throughput Go Contact Harvester",
    description: "Multi-threaded Go crawler engine navigating entire domains concurrently to harvest verified email addresses, telephone numbers, contact forms, and social media handles with sub-second latency.",
    type: "Backend | Tools | Scrapers",
    link: "/tools/contact-scraper",
    imageUrl: ["https://images.unsplash.com/photo-1558494949-ef010cbdcc31?q=80&w=1000&auto=format&fit=crop"],
    githubUrl: "https://github.com/talhary/portfoliov1",
    order: 5,
    stack: ["Golang", "Goroutines", "Web Crawler", "RegEx Engine", "HTML Parser", "REST API"],
    createdAt: new Date("2026-08-18T00:00:00Z"),
    updatedAt: new Date("2026-08-18T00:00:00Z"),
  },
  {
    id: "universal-media-downloader",
    title: "Universal Media & Stream Extraction Pipeline",
    description: "High-speed media extraction engine supporting TikTok, Instagram Reels, YouTube, X/Twitter, Reddit, Facebook, Pinterest, SoundCloud, and Spotify without watermarks or compression loss.",
    type: "Tools | Media | Backend",
    link: "/tools/media-downloader",
    imageUrl: ["https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1000&auto=format&fit=crop"],
    githubUrl: "https://github.com/talhary/portfoliov1",
    order: 6,
    stack: ["Node.js", "TypeScript", "Puppeteer CDP", "yt-dlp", "Cheerio", "Next.js"],
    createdAt: new Date("2026-08-17T00:00:00Z"),
    updatedAt: new Date("2026-08-17T00:00:00Z"),
  },
  {
    id: "go-ats-cv-builder",
    title: "Go ATS Resume / CV Vector PDF Builder",
    description: "Dynamic Go-powered ATS vector PDF resume compiler that generates customized, high-resolution resumes tailored to specific engineering roles, system design tags, and technical skill matrices.",
    type: "Tools | Backend | Systems",
    link: "/tools/cv-builder",
    imageUrl: ["https://images.unsplash.com/photo-1586281380349-632531db7ed4?q=80&w=1000&auto=format&fit=crop"],
    githubUrl: "https://github.com/talhary/portfoliov1",
    order: 7,
    stack: ["Golang", "Vector PDF Engine", "ATS Optimization", "TypeScript", "Next.js"],
    createdAt: new Date("2026-08-16T00:00:00Z"),
    updatedAt: new Date("2026-08-16T00:00:00Z"),
  },
  {
    id: "polyglot-code-runner",
    title: "Sandboxed Polyglot Code Execution Engine",
    description: "Isolated multi-language container execution pipeline for running Python, Node.js, and Shell scripts with strict resource boundaries, configurable timeouts, and real-time stdout/stderr capture.",
    type: "Cloud & Systems | Tools | Backend",
    link: "/tools/code-runner",
    imageUrl: ["https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=1000&auto=format&fit=crop"],
    githubUrl: "https://github.com/talhary/portfoliov1",
    order: 8,
    stack: ["Docker SDK", "Linux Cgroups", "Python 3", "Node.js", "Bash", "Ephemeral Sandbox"],
    createdAt: new Date("2026-08-15T00:00:00Z"),
    updatedAt: new Date("2026-08-15T00:00:00Z"),
  },
  {
    id: "gemini-technical-blog-generator",
    title: "Gemini AI Technical Blog Generator",
    description: "AI-assisted technical software engineering blog generator powered by Google Gemini 2.5 Flash. Synthesizes in-depth architecture articles in markdown with code examples and systems analysis.",
    type: "AI & Systems | Tools",
    link: "/tools/ai-blog-generator",
    imageUrl: ["https://images.unsplash.com/photo-1677442136019-21780ecad995?q=80&w=1000&auto=format&fit=crop"],
    githubUrl: "https://github.com/talhary/portfoliov1",
    order: 9,
    stack: ["Google Gemini 2.5 Flash", "Generative AI", "Markdown Pipeline", "Prompt Engineering", "TypeScript"],
    createdAt: new Date("2026-08-14T00:00:00Z"),
    updatedAt: new Date("2026-08-14T00:00:00Z"),
  },
  {
    id: "headless-duck-search",
    title: "Headless Anti-Bot DuckDuckGo Search Engine",
    description: "Anti-bot headless search engine bypassing Cloudflare and bot protections to harvest organic web results paired with generative AI search summaries.",
    type: "Scrapers | Tools | AI & Systems",
    link: "/tools/duck-search",
    imageUrl: ["https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?q=80&w=1000&auto=format&fit=crop"],
    githubUrl: "https://github.com/talhary/portfoliov1",
    order: 10,
    stack: ["Puppeteer CDP", "Anti-Bot Bypass", "Headless Chrome", "AI Summarizer", "TypeScript"],
    createdAt: new Date("2026-08-13T00:00:00Z"),
    updatedAt: new Date("2026-08-13T00:00:00Z"),
  },
  {
    id: "browser-cdp-cluster",
    title: "Distributed Browser Pool CDP & Screencast Cluster",
    description: "Live cluster monitor for remote Chromium worker instances with direct Chrome DevTools Protocol WebSocket debug endpoints, health heartbeats, and low-latency screencasts.",
    type: "Cloud & Systems | Backend",
    link: "/tools/browser-cdp",
    imageUrl: ["https://images.unsplash.com/photo-1544197150-b99a580bb7a8?q=80&w=1000&auto=format&fit=crop"],
    githubUrl: "https://github.com/talhary/portfoliov1",
    order: 11,
    stack: ["Chrome DevTools Protocol", "WebSockets", "Remote Chromium", "Docker", "Cluster Manager"],
    createdAt: new Date("2026-08-12T00:00:00Z"),
    updatedAt: new Date("2026-08-12T00:00:00Z"),
  },
  {
    id: "systems-architecture-roadmaps",
    title: "Systems Architecture & Engineering Roadmaps",
    description: "Comprehensive systems engineering proposals including Bitcask LSM storage engines, Raft-consensus Redis clones, and distributed container lifecycle controllers.",
    type: "Systems & Architecture | Backend",
    link: "/tools/system-suggestions",
    imageUrl: ["https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=1000&auto=format&fit=crop"],
    githubUrl: "https://github.com/talhary/portfoliov1",
    order: 12,
    stack: ["Bitcask LSM", "Raft Consensus", "Distributed State", "Golang", "System Design"],
    createdAt: new Date("2026-08-11T00:00:00Z"),
    updatedAt: new Date("2026-08-11T00:00:00Z"),
  },
  {
    id: "static-instagram-reels-downloader",
    title: "Instagram Reels Downloader",
    description: "A high-performance, clean, and secure web application to download Instagram Reels and videos directly in HD. Designed with a custom orange/amber modern UI, full Google AdSense compliance, and a backend-powered secure proxy that hides source downloads to protect user privacy.",
    type: "tools",
    link: "/tools/instagram-reels-downloader",
    imageUrl: ["https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?q=80&w=1000&auto=format&fit=crop"],
    githubUrl: "https://github.com/talhary/portfoliov1",
    order: 13,
    stack: ["Next.js", "React", "Tailwind CSS", "TypeScript", "API Routes"],
    createdAt: new Date("2026-07-14T00:00:00Z"),
    updatedAt: new Date("2026-07-14T00:00:00Z"),
  }
];

export const GetAllProjects = async (filter?: string) => {
  try {
    const res = await db.projects.findMany({
      orderBy: {
        createdAt: 'desc'
      }
    });

    // Deduplicate between DB and STATIC_PROJECTS (preferring DB records)
    const dbIds = new Set(res.map(p => p.id));
    const dbSlugs = new Set(res.map(p => slugify(p.title)));
    const filteredStatic = STATIC_PROJECTS.filter(
      p => !dbIds.has(p.id) && !dbSlugs.has(slugify(p.title))
    );

    const combined = [...res, ...filteredStatic];

    const isTool = (p: any) => {
      const typeStr = (p.type || '').toLowerCase();
      const linkStr = (p.link || '').toLowerCase();
      return linkStr.startsWith('/tools') || typeStr.includes('tool');
    };

    // Prioritize custom build projects (non-tools like Nerihya and ERP) at the top,
    // then developer tools afterwards. Within each group, respect explicit order (> 0)
    // and sort unassigned projects by createdAt descending.
    const sorted = combined.sort((a, b) => {
      const toolA = isTool(a);
      const toolB = isTool(b);

      // Custom build projects come before tools
      if (!toolA && toolB) return -1;
      if (toolA && !toolB) return 1;

      const orderA = a.order ?? 0;
      const orderB = b.order ?? 0;

      if (orderA > 0 && orderB > 0) {
        if (orderA !== orderB) return orderA - orderB;
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }
      if (orderA > 0) return -1;
      if (orderB > 0) return 1;

      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });

    return sorted;
  } catch (error) {
    console.error("Error retrieving projects:", error);
    return STATIC_PROJECTS;
  }
}