import { db } from "@/lib/db";

export const STATIC_PROJECTS: any[] = [
  {
    id: "cloud-container-sandbox",
    title: "5-Minute Cloud Container Sandbox",
    description: "On-demand disposable Docker containers (VS Code, Web Terminal, Remote Chromium) spawned by our custom Go container manager with automated 5-minute TTL cleanup, non-root isolation, and dynamic Cloudflare named tunnels.",
    type: "Cloud & Systems | Tools | Backend",
    link: "/tools/cloud-sandbox",
    imageUrl: ["https://images.unsplash.com/photo-1607799279861-4dd421887fb3?q=80&w=1000&auto=format&fit=crop"],
    githubUrl: "https://github.com/talhary/portfoliov1",
    order: 1,
    stack: ["Go Container Engine", "Docker SDK", "Cloudflare Tunnels", "Dynamic DNS", "TypeScript", "Next.js"],
    createdAt: new Date("2026-08-20T00:00:00Z"),
    updatedAt: new Date("2026-08-20T00:00:00Z"),
  },
  {
    id: "google-places-lead-streamer",
    title: "Google Places Real-Time Lead Streamer",
    description: "Distributed headless browser cluster streaming verified B2B business leads (phone, rating, reviews, address, website) in real-time over Server-Sent Events (SSE) as Chromium navigates Google Maps.",
    type: "Scrapers | Tools | Backend",
    link: "/tools/places-stream",
    imageUrl: ["https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?q=80&w=1000&auto=format&fit=crop"],
    githubUrl: "https://github.com/talhary/portfoliov1",
    order: 2,
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
    order: 3,
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
    order: 4,
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
    order: 5,
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
    order: 6,
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
    order: 7,
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
    order: 8,
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
    order: 9,
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
    order: 10,
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
    order: 11,
    stack: ["Next.js", "React", "Tailwind CSS", "TypeScript", "API Routes"],
    createdAt: new Date("2026-07-14T00:00:00Z"),
    updatedAt: new Date("2026-07-14T00:00:00Z"),
  }
];

export const GetAllProjects = async(filter?:string)=>{
    try {
        const res = await db.projects.findMany({
            orderBy: {
                createdAt: 'desc'
            }
        });
        
        const combined = [...res, ...STATIC_PROJECTS];
        
        // Prioritize projects with custom order (> 0) ascending,
        // and keep unassigned projects (order = 0) at the end sorted by date descending.
        const sorted = combined.sort((a, b) => {
            const orderA = a.order ?? 0;
            const orderB = b.order ?? 0;
            const isToolA = (a.type && a.type.toLowerCase().includes('tool')) || (a.link && a.link.startsWith('/tools'));
            const isToolB = (b.type && b.type.toLowerCase().includes('tool')) || (b.link && b.link.startsWith('/tools'));

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