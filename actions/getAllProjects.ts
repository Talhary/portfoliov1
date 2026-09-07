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
    order: 2,
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
    order: 3,
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
    order: 4,
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
    order: 5,
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
    order: 6,
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
    order: 7,
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
    order: 8,
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
    order: 9,
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
    order: 10,
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
    order: 11,
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
    order: 12,
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