import React from 'react';
import { Metadata } from 'next';
import { Heading } from '@/components/heading';
import { cn } from '@/lib/utils';
import { FaReact, FaNodeJs, FaDocker, FaPhp, FaRobot, FaWindows } from 'react-icons/fa';
import { SiNextdotjs, SiExpress, SiMongodb, SiTypescript, SiJavascript, SiUbuntu, SiPostgresql, SiMysql, SiDeno, SiRust } from 'react-icons/si';
import { 
  Briefcase, 
  BookOpen, 
  Phone, 
  Mail, 
  Globe, 
  MapPin, 
  ArrowRight, 
  Download, 
  ExternalLink, 
  Cpu, 
  HardDrive, 
  Network, 
  Sparkles, 
  Activity, 
  Eye, 
  Zap, 
  ShieldCheck, 
  Terminal, 
  Layers, 
  Clock, 
  CheckCircle2, 
  Calendar, 
  Flag 
} from 'lucide-react';
import { EducationList } from '@/components/education';
import { GetAllProjects } from "@/actions/getAllProjects";
import { AllProjects } from '@/components/all-projects';
import { ContactForm } from '@/app/contact/_components/form';
import Link from 'next/link';
import Image from 'next/image';
import { GitHubStats } from '@/components/github-stats';
import { db } from "@/lib/db";
import FounderAvatar from "@/images/me.png";

export const dynamic = "force-dynamic";

// Founder skillset data
const skills = [
  { name: 'Rust', value: 85, icon: SiRust, color: 'bg-orange-100 text-orange-800', darkColor: 'dark:bg-orange-950 dark:text-orange-300' },
  { name: 'Next.js', value: 92, icon: SiNextdotjs, color: 'bg-black text-white', darkColor: 'dark:bg-white dark:text-black' },
  { name: 'React', value: 95, icon: FaReact, color: 'bg-sky-100 text-sky-800', darkColor: 'dark:bg-sky-900 dark:text-sky-300' },
  { name: 'Node.js', value: 98, icon: FaNodeJs, color: 'bg-green-100 text-green-800', darkColor: 'dark:bg-green-900 dark:text-green-300' },
  { name: 'TypeScript', value: 90, icon: SiTypescript, color: 'bg-blue-100 text-blue-800', darkColor: 'dark:bg-blue-900 dark:text-blue-300' },
  { name: 'JavaScript', value: 95, icon: SiJavascript, color: 'bg-yellow-100 text-yellow-800', darkColor: 'dark:bg-yellow-900 dark:text-yellow-300' },
  { name: 'PostgreSQL', value: 85, icon: SiPostgresql, color: 'bg-cyan-100 text-cyan-800', darkColor: 'dark:bg-cyan-900 dark:text-cyan-300' },
  { name: 'MongoDB', value: 85, icon: SiMongodb, color: 'bg-emerald-100 text-emerald-800', darkColor: 'dark:bg-emerald-900 dark:text-emerald-300' },
  { name: 'Docker', value: 75, icon: FaDocker, color: 'bg-blue-200 text-blue-900', darkColor: 'dark:bg-blue-800 dark:text-blue-200' },
  { name: 'Ubuntu', value: 80, icon: SiUbuntu, color: 'bg-red-100 text-red-800', darkColor: 'dark:bg-red-900 dark:text-red-300' },
  { name: 'Express', value: 85, icon: SiExpress, color: 'bg-neutral-100 text-neutral-800', darkColor: 'dark:bg-neutral-700 dark:text-neutral-200' },
  { name: 'PHP', value: 80, icon: FaPhp, color: 'bg-indigo-100 text-indigo-800', darkColor: 'dark:bg-indigo-900 dark:text-indigo-300' },
  { name: 'MySQL', value: 80, icon: SiMysql, color: 'bg-orange-100 text-orange-800', darkColor: 'dark:bg-orange-900 dark:text-orange-300' },
  { name: 'Deno', value: 75, icon: SiDeno, color: 'bg-neutral-100 text-neutral-800', darkColor: 'dark:bg-neutral-700 dark:text-neutral-200' },
];

const companyFocusAreas = [
  { 
    title: 'Native Forensic Systems', 
    icon: SiRust, 
    text: 'Building ultra-lightweight desktop software in Tauri & Rust for real-time operating system telemetry and resource optimization.' 
  },
  { 
    title: 'Modern Full-Stack Platforms', 
    icon: SiNextdotjs, 
    text: 'Architecting high-scale web platforms with Next.js, React, Node.js, PostgreSQL, and modern distributed database backends.' 
  },
  { 
    title: 'Developer Tooling & Cloud Tunnels', 
    icon: Terminal, 
    text: 'Creating instant web developer utilities, proxy daemons, cloud tunnels, and automated tool suites that boost productivity.' 
  },
  { 
    title: 'Process & Automation Bots', 
    icon: FaRobot, 
    text: 'Engineering autonomous web scrapers, data pipelines, and communication bots to automate complex manual workflows.' 
  },
];

const getCurrentDuration = (startDate: Date): string => {
  const now = new Date();
  let years = now.getFullYear() - startDate.getFullYear();
  let months = now.getMonth() - startDate.getMonth();

  if (months < 0) {
    years--;
    months += 12;
  }

  const yearStr = years > 0 ? `${years} yr${years > 1 ? 's' : ''}` : '';
  const monthStr = months > 0 || years === 0 ? `${months} mo${months > 1 ? 's' : ''}` : '';

  return [yearStr, monthStr].filter(Boolean).join(' ');
};

const woltrioStartDate = new Date(2025, 0, 1);
const woltrioDuration = getCurrentDuration(woltrioStartDate);

const founderExperiences = [
  {
    title: 'Full Stack Software Engineer',
    company: 'Woltrio',
    icon: Briefcase,
    dates: `Jan 2025 - Present (${woltrioDuration})`,
    description: 'Designing and implementing production-ready features across multiple websites. Utilizing modern stacks to optimize database queries, construct clean APIs, and work alongside cross-functional teams to meet client goals.'
  },
  {
    title: 'Software Engineer Intern',
    company: 'Swismax Solutions',
    icon: Briefcase,
    dates: 'Sep 2024 - Nov 2024 (3 mos)',
    description: 'Contributed directly to team workflows and front-end features. Gained valuable insights into collaborative coding, version control, and writing clean, maintainable components.'
  },
];

const Highlight = ({ text }: { text: string }) => {
  return (
    <span className='text-primary font-bold dark:font-semibold'>
      <code>{text}</code>
    </span>
  );
};

export const metadata: Metadata = {
  title: "talhatechs | High-Performance Software Engineering, Systems & Developer Tools",
  description: "talhatechs is a modern software company founded by Muhammad Talha. Home of Noyare (high-performance Windows forensic system monitor), scalable full-stack web platforms, and open developer tools.",
  alternates: {
    canonical: "/",
  },
  keywords: [
    "talhatechs",
    "Talha Techs",
    "Noyare",
    "Noyare Windows",
    "Muhammad Talha",
    "Talha Codes",
    "Software Engineering Company",
    "Full Stack Software Engineer",
    "Rust Tauri Desktop Apps",
    "Next.js Developer Tools",
    "Islamabad Tech Company"
  ],
  openGraph: {
    title: "talhatechs | High-Performance Software Engineering & Developer Tools",
    description: "talhatechs is a technology & software engineering company founded by Muhammad Talha. Home of Noyare (forensic system monitor for Windows) and modern web systems.",
    type: "website",
    url: "https://talhacodes.site",
  }
};

export default async function Home() {
  const projects = await GetAllProjects('all');

  let recentBlogs: Array<{
    id: string;
    title: string;
    slug: string;
    description: string;
    imageUrl: string | null;
    createdAt: Date;
    tags: string[];
  }> = [];

  try {
    recentBlogs = await db.blogPost.findMany({
      where: { published: true },
      orderBy: { createdAt: 'desc' },
      take: 3,
      select: {
        id: true,
        title: true,
        slug: true,
        description: true,
        imageUrl: true,
        createdAt: true,
        tags: true,
      },
    });
  } catch (error) {
    console.error("Failed to fetch recent blogs for homepage:", error);
  }

  const siteUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://talhacodes.site';

  const organizationSchema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'talhatechs',
    alternateName: 'TalhaTechs',
    url: siteUrl,
    logo: `${siteUrl}/images/noyare/logo.png`,
    founder: {
      '@type': 'Person',
      name: 'Muhammad Talha',
      alternateName: 'Talha Codes',
      jobTitle: 'Founder & Lead Systems Engineer',
      sameAs: [
        'https://github.com/talhary',
        'https://linkedin.com/in/talhacodes',
      ],
    },
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Islamabad',
      addressCountry: 'PK',
    },
    knowsAbout: [
      'Native Systems Engineering',
      'Rust & Tauri Development',
      'Noyare System Monitor',
      'Full Stack Web Platforms',
      'Next.js & React',
      'Developer Tools Automation'
    ],
  };

  const softwareAppSchema = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'Noyare',
    operatingSystem: 'Windows 10, Windows 11',
    applicationCategory: 'UtilitiesApplication',
    url: 'https://apps.microsoft.com/detail/9PL83RF36NP4?hl=en-us&gl=US&ocid=pdpshare',
    downloadUrl: 'https://apps.microsoft.com/detail/9PL83RF36NP4?hl=en-us&gl=US&ocid=pdpshare',
    author: {
      '@type': 'Organization',
      name: 'talhatechs',
      url: 'https://talhary.github.io/noyare-home/'
    },
    description: 'Noyare is a high-performance forensic system monitor and utility suite for Windows built natively in Tauri and Rust.',
  };

  const websiteSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'talhatechs',
    url: siteUrl,
    description: 'High-Performance Software Engineering, Native Systems, and Developer Tools — Founded by Muhammad Talha',
    potentialAction: {
      '@type': 'SearchAction',
      target: `${siteUrl}/blog?search={search_term_string}`,
      'query-input': 'required name=search_term_string',
    },
  };

  return (
    <div className="w-full flex flex-col gap-16 py-4 pb-4 scroll-smooth">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareAppSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
      />

      {/* ============================================================== */}
      {/* ---------------- SECTION 1: HERO (TALHATECHS) ----------------- */}
      {/* ============================================================== */}
      <section id="hero" className="relative group pt-2 pb-6">
        <div className="px-2 md:px-4 text-neutral-800 dark:text-neutral-200">
          
          {/* Company Badge */}
          <div className="flex items-center gap-2 mb-4">
            <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider bg-primary/10 text-primary border border-primary/20 shadow-sm">
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
              </span>
              <span>talhatechs · Software & Systems Lab</span>
            </span>
            <span className="hidden sm:inline-flex text-xs text-zinc-500 font-medium">
              Founded by Muhammad Talha
            </span>
          </div>

          {/* Main Hero Headline */}
          <div className="space-y-4 max-w-4xl">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black tracking-tight text-zinc-950 dark:text-white leading-[1.15]">
              Engineering High-Performance <span className="text-primary">Native Systems</span> & Modern Web Platforms.
            </h1>
            <p className="text-base sm:text-lg md:text-xl text-zinc-650 dark:text-zinc-300 font-light leading-relaxed max-w-3xl">
              <strong className="font-semibold text-zinc-900 dark:text-white">talhatechs</strong> is a technology and software engineering company founded by <Highlight text="Muhammad Talha" />. We craft lightweight, forensic desktop applications like <Highlight text="Noyare" />, production-grade cloud and web architectures, and free high-efficiency developer tools.
            </p>
          </div>

          {/* Action CTAs */}
          <div className="mt-8 flex flex-wrap items-center gap-3 sm:gap-4">
            <a href="#noyare" className="shrink-0">
              <button className="flex items-center gap-2 bg-primary hover:bg-primary-hover text-white text-xs sm:text-sm font-bold uppercase tracking-wider py-3.5 px-6 sm:px-8 rounded-xl shadow-lg hover:shadow-[0_0_20px_rgba(var(--primary-rgb),0.4)] hover:scale-105 active:scale-95 transition-all duration-300">
                <span>★ Flagship Product: Noyare</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            </a>
            <a href="#founder" className="shrink-0">
              <button className="flex items-center gap-2 bg-zinc-100 hover:bg-zinc-200 dark:bg-card-bg-2 dark:hover:bg-card-bg-1 text-zinc-800 dark:text-white text-xs sm:text-sm font-semibold py-3.5 px-6 rounded-xl border border-zinc-200 dark:border-white/10 hover:border-primary/40 transition-all duration-300">
                <span>About Founder & Leadership</span>
              </button>
            </a>
            <Link href="/portfolio/all" className="shrink-0">
              <button className="flex items-center gap-2 text-zinc-600 dark:text-zinc-400 hover:text-primary dark:hover:text-primary text-xs sm:text-sm font-semibold py-3.5 px-4 transition-colors">
                <span>View All Projects</span>
                <ExternalLink className="h-3.5 w-3.5" />
              </button>
            </Link>
          </div>

          {/* Core Pillars Grid */}
          <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
            <div className="p-4 rounded-xl bg-zinc-100/60 dark:bg-white/[0.02] border border-zinc-200/60 dark:border-white/5 space-y-1">
              <div className="flex items-center gap-2 text-primary font-bold text-sm">
                <SiRust className="h-4 w-4" />
                <span>Native Rust</span>
              </div>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 font-light">Sub-millisecond desktop diagnostics & zero Electron bloat.</p>
            </div>
            <div className="p-4 rounded-xl bg-zinc-100/60 dark:bg-white/[0.02] border border-zinc-200/60 dark:border-white/5 space-y-1">
              <div className="flex items-center gap-2 text-primary font-bold text-sm">
                <SiNextdotjs className="h-4 w-4" />
                <span>Next.js Full-Stack</span>
              </div>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 font-light">Production web platforms with edge rendering & fast APIs.</p>
            </div>
            <div className="p-4 rounded-xl bg-zinc-100/60 dark:bg-white/[0.02] border border-zinc-200/60 dark:border-white/5 space-y-1">
              <div className="flex items-center gap-2 text-primary font-bold text-sm">
                <ShieldCheck className="h-4 w-4" />
                <span>Forensic Security</span>
              </div>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 font-light">Live socket telemetry, DNS auditing & VirusTotal checks.</p>
            </div>
            <div className="p-4 rounded-xl bg-zinc-100/60 dark:bg-white/[0.02] border border-zinc-200/60 dark:border-white/5 space-y-1">
              <div className="flex items-center gap-2 text-primary font-bold text-sm">
                <Terminal className="h-4 w-4" />
                <span>Free Tool Suite</span>
              </div>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 font-light">Docker sandbox, lead streamers & media utilities online.</p>
            </div>
          </div>

        </div>
      </section>

      {/* Visually stunning layout section separator */}
      <div className="h-[1px] w-full bg-gradient-to-r from-transparent via-primary/30 to-transparent" />

      {/* ============================================================== */}
      {/* ----------- SECTION 2: MAIN COMPANY PROJECT: NOYARE ---------- */}
      {/* ============================================================== */}
      <section id="noyare" className="relative group scroll-mt-24">
        <div className="px-2 md:px-4 text-neutral-800 dark:text-neutral-200">
          
          {/* Noyare Header Badge */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
            <div className="space-y-1">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-emerald-500/10 text-emerald-500 dark:text-emerald-400 border border-emerald-500/20">
                <FaWindows className="h-3.5 w-3.5" />
                <span>Main Company Project · Available on Microsoft Store</span>
              </div>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-zinc-900 dark:text-white tracking-tight">
                Noyare — See Your Machine Think, Second by Second.
              </h2>
              <p className="text-sm sm:text-base text-zinc-600 dark:text-zinc-300 font-light max-w-2xl">
                Noyare is talhatechs&apos; next-generation forensic system utility and monitoring cockpit for Windows. Built natively on Tauri and Rust, Noyare combines a sleek, modern surface with high-performance diagnostics—all within a single, calm workspace.
              </p>
            </div>

            {/* Quick Live Status */}
            <div className="shrink-0 flex items-center gap-3 bg-zinc-100 dark:bg-zinc-900/80 border border-zinc-200 dark:border-white/10 px-4 py-2.5 rounded-2xl">
              <div className="flex h-3 w-3 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
              </div>
              <div className="text-xs">
                <span className="font-bold text-zinc-900 dark:text-white block">Noyare v0.1.5 Live</span>
                <span className="text-zinc-500 font-mono text-[10px]">Sampling: 1.1s</span>
              </div>
            </div>
          </div>

          {/* Noyare Spec Metrics Strip */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
            <div className="p-4 rounded-2xl bg-zinc-50 dark:bg-card-bg-3/80 border border-zinc-200 dark:border-white/5 shadow-sm text-center">
              <span className="text-2xl sm:text-3xl font-black text-primary block">~18 MB</span>
              <span className="text-xs text-zinc-500 font-medium">Self-Contained Install</span>
            </div>
            <div className="p-4 rounded-2xl bg-zinc-50 dark:bg-card-bg-3/80 border border-zinc-200 dark:border-white/5 shadow-sm text-center">
              <span className="text-2xl sm:text-3xl font-black text-emerald-500 block">0.4% CPU</span>
              <span className="text-xs text-zinc-500 font-medium">At Rest Polling Every 1.1s</span>
            </div>
            <div className="p-4 rounded-2xl bg-zinc-50 dark:bg-card-bg-3/80 border border-zinc-200 dark:border-white/5 shadow-sm text-center">
              <span className="text-2xl sm:text-3xl font-black text-sky-500 block">1.1 s</span>
              <span className="text-xs text-zinc-500 font-medium">Telemetry Resolution</span>
            </div>
            <div className="p-4 rounded-2xl bg-zinc-50 dark:bg-card-bg-3/80 border border-zinc-200 dark:border-white/5 shadow-sm text-center">
              <span className="text-2xl sm:text-3xl font-black text-amber-500 block">Tauri · Rust</span>
              <span className="text-xs text-zinc-500 font-medium">Native · Zero Electron Bloat</span>
            </div>
          </div>

          {/* Noyare Showcase Hero Box */}
          <div className="relative rounded-3xl overflow-hidden border border-zinc-200 dark:border-white/10 bg-gradient-to-b from-zinc-100 to-zinc-50 dark:from-zinc-900 dark:to-zinc-950 p-4 sm:p-8 shadow-xl">
            <div className="absolute top-0 right-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl pointer-events-none" />
            
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              
              {/* Left Column: App Overview & Download CTAs */}
              <div className="lg:col-span-5 space-y-6">
                <div className="flex items-center gap-3.5">
                  <div className="h-14 w-14 rounded-2xl overflow-hidden bg-zinc-900 border border-white/10 shadow-md p-1.5 shrink-0">
                    <img 
                      src="/images/noyare/icon.png" 
                      alt="Noyare App Icon" 
                      className="w-full h-full object-contain rounded-xl"
                    />
                  </div>
                  <div>
                    <h3 className="text-xl sm:text-2xl font-black text-zinc-900 dark:text-white tracking-tight">
                      Noyare Desktop
                    </h3>
                    <p className="text-xs text-primary font-bold uppercase tracking-wider">
                      Forensic System Monitor & Utility Suite
                    </p>
                  </div>
                </div>

                <p className="text-sm text-zinc-650 dark:text-zinc-300 leading-relaxed font-light">
                  Whether you need to isolate a suspect background process with VirusTotal, optimize standby RAM buffer, build local Cloudflare network tunnels, or preview code instantaneously via Spacebar Quick Look, Noyare provides total visibility.
                </p>

                {/* Primary CTA Buttons */}
                <div className="space-y-2.5 pt-2">
                  <a
                    href="https://apps.microsoft.com/detail/9PL83RF36NP4?hl=en-us&gl=US&ocid=pdpshare"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full flex items-center justify-center gap-3 bg-primary hover:bg-primary-hover text-white text-sm font-bold uppercase tracking-wider py-4 px-6 rounded-2xl shadow-lg hover:shadow-[0_0_25px_rgba(var(--primary-rgb),0.45)] hover:scale-[1.02] active:scale-[0.98] transition-all duration-300"
                  >
                    <FaWindows className="h-5 w-5" />
                    <span>Get on Microsoft Store (Free)</span>
                    <ExternalLink className="h-4 w-4 ml-auto opacity-75" />
                  </a>

                  <div className="grid grid-cols-2 gap-2.5">
                    <a
                      href="https://github.com/talhary/noyare-home"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-2 p-3 rounded-xl bg-zinc-200/70 hover:bg-zinc-200 dark:bg-card-bg-2 dark:hover:bg-card-bg-1 text-zinc-800 dark:text-zinc-200 text-xs font-semibold border border-zinc-300/50 dark:border-white/5 transition-all"
                    >
                      <Terminal className="h-3.5 w-3.5 text-primary" />
                      <span>GitHub Source</span>
                    </a>
                    <a
                      href="https://talhary.github.io/noyare-home/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-2 p-3 rounded-xl bg-zinc-200/70 hover:bg-zinc-200 dark:bg-card-bg-2 dark:hover:bg-card-bg-1 text-zinc-800 dark:text-zinc-200 text-xs font-semibold border border-zinc-300/50 dark:border-white/5 transition-all"
                    >
                      <Globe className="h-3.5 w-3.5 text-primary" />
                      <span>Documentation</span>
                    </a>
                  </div>
                </div>

                {/* Verification badges */}
                <div className="pt-2 flex flex-wrap items-center gap-4 text-xs text-zinc-500 dark:text-zinc-400">
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                    <span>Windows 10 / 11 Verified</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                    <span>Slint & WebView2 Engines</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                    <span>Zero Telemetry Leaks</span>
                  </div>
                </div>
              </div>

              {/* Right Column: Interactive App Preview Window */}
              <div className="lg:col-span-7">
                <div className="rounded-2xl overflow-hidden border border-zinc-300 dark:border-zinc-700/80 bg-zinc-950 shadow-2xl group/preview">
                  {/* Window Titlebar */}
                  <div className="flex items-center justify-between px-4 py-2.5 bg-zinc-900 border-b border-zinc-800">
                    <div className="flex items-center gap-2">
                      <span className="h-3 w-3 rounded-full bg-red-500/80 inline-block" />
                      <span className="h-3 w-3 rounded-full bg-amber-500/80 inline-block" />
                      <span className="h-3 w-3 rounded-full bg-emerald-500/80 inline-block" />
                      <span className="ml-2 text-xs font-mono text-zinc-400">Noyare — Cockpit v0.1.5</span>
                    </div>
                    <div className="flex items-center gap-2 text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-md border border-emerald-500/20">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                      <span>LIVE 1.1s</span>
                    </div>
                  </div>

                  {/* Preview Image */}
                  <div className="relative aspect-[16/10] overflow-hidden bg-zinc-950">
                    <img 
                      src="/images/noyare/preview.png" 
                      alt="Noyare Forensic Cockpit Dashboard Preview" 
                      className="w-full h-full object-cover object-top transition-transform duration-500 group-hover/preview:scale-[1.02]"
                    />
                  </div>
                </div>
              </div>

            </div>

            {/* Noyare Core Modules Grid */}
            <div className="mt-12 pt-8 border-t border-zinc-200 dark:border-white/10">
              <h4 className="text-base font-bold uppercase tracking-wider text-zinc-900 dark:text-zinc-200 mb-6 flex items-center gap-2">
                <Layers className="h-4 w-4 text-primary" />
                <span>Noyare Core Modules & Diagnostic Engines</span>
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                
                <div className="p-4 rounded-xl bg-white dark:bg-card-bg-3/60 border border-zinc-200 dark:border-white/5 space-y-2">
                  <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary font-bold">
                    <Activity className="h-4 w-4" />
                  </div>
                  <h5 className="font-bold text-sm text-zinc-900 dark:text-white">Resource Dashboard</h5>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed font-light">
                    Track CPU across 8+ individual cores, live RAM buffer fluctuations, and bandwidth with 90-second sparklines.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-white dark:bg-card-bg-3/60 border border-zinc-200 dark:border-white/5 space-y-2">
                  <div className="h-8 w-8 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-500 font-bold">
                    <ShieldCheck className="h-4 w-4" />
                  </div>
                  <h5 className="font-bold text-sm text-zinc-900 dark:text-white">Process & Trust Manager</h5>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed font-light">
                    Granular PID & thread monitoring with background VirusTotal hash checks and Authenticode verification.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-white dark:bg-card-bg-3/60 border border-zinc-200 dark:border-white/5 space-y-2">
                  <div className="h-8 w-8 rounded-lg bg-sky-500/10 flex items-center justify-center text-sky-500 font-bold">
                    <Zap className="h-4 w-4" />
                  </div>
                  <h5 className="font-bold text-sm text-zinc-900 dark:text-white">RAM ISLC Optimizer</h5>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed font-light">
                    Intelligent Standby List Cleaner engine to purge standby memory and trim working sets in real-time.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-white dark:bg-card-bg-3/60 border border-zinc-200 dark:border-white/5 space-y-2">
                  <div className="h-8 w-8 rounded-lg bg-amber-500/10 flex items-center justify-center text-amber-500 font-bold">
                    <Network className="h-4 w-4" />
                  </div>
                  <h5 className="font-bold text-sm text-zinc-900 dark:text-white">DNS & Sockets Sniffer</h5>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed font-light">
                    Inspect TCP/UDP ports and capture live outgoing DNS queries mapped directly to originating system processes.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-white dark:bg-card-bg-3/60 border border-zinc-200 dark:border-white/5 space-y-2">
                  <div className="h-8 w-8 rounded-lg bg-indigo-500/10 flex items-center justify-center text-indigo-500 font-bold">
                    <Globe className="h-4 w-4" />
                  </div>
                  <h5 className="font-bold text-sm text-zinc-900 dark:text-white">Cloudflare Tunnels</h5>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed font-light">
                    Native wrapper for cloudflared daemon to safely expose local dev ports to public HTTPS with throughput metrics.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-white dark:bg-card-bg-3/60 border border-zinc-200 dark:border-white/5 space-y-2">
                  <div className="h-8 w-8 rounded-lg bg-rose-500/10 flex items-center justify-center text-rose-500 font-bold">
                    <Eye className="h-4 w-4" />
                  </div>
                  <h5 className="font-bold text-sm text-zinc-900 dark:text-white">Spacebar Quick Look</h5>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed font-light">
                    Instant Windows Explorer preview for code with live text editing, images with cropping, archives, and PE headers.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-white dark:bg-card-bg-3/60 border border-zinc-200 dark:border-white/5 space-y-2">
                  <div className="h-8 w-8 rounded-lg bg-teal-500/10 flex items-center justify-center text-teal-500 font-bold">
                    <HardDrive className="h-4 w-4" />
                  </div>
                  <h5 className="font-bold text-sm text-zinc-900 dark:text-white">Disk & Cache Sweeper</h5>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed font-light">
                    Reclaim gigabytes from browser caches, temp files, and developer folders (node_modules, target/ build artifacts).
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-white dark:bg-card-bg-3/60 border border-zinc-200 dark:border-white/5 space-y-2">
                  <div className="h-8 w-8 rounded-lg bg-violet-500/10 flex items-center justify-center text-violet-500 font-bold">
                    <Clock className="h-4 w-4" />
                  </div>
                  <h5 className="font-bold text-sm text-zinc-900 dark:text-white">Keep Awake (Insomnia)</h5>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed font-light">
                    Smart power management preventing sleep during downloads, compilations, or active network workloads.
                  </p>
                </div>

              </div>
            </div>

          </div>

        </div>
      </section>

      {/* Visually stunning layout section separator */}
      <div className="h-[1px] w-full bg-gradient-to-r from-transparent via-white/10 to-transparent dark:via-zinc-800" />

      {/* ============================================================== */}
      {/* ---------- SECTION 3: COMPANY FOCUS AREAS -------------------- */}
      {/* ============================================================== */}
      <section id="focus" className="relative group">
        <div className="px-2 md:px-4 text-neutral-800 dark:text-neutral-200">
          <Heading title="talhatechs Core Capabilities" />

          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {companyFocusAreas.map((el, i) => (
              <div
                key={i}
                className="relative p-[1px] rounded-2xl overflow-hidden bg-zinc-200 dark:bg-zinc-800/80 hover:bg-gradient-to-br hover:from-primary hover:to-primary-hover transition-all duration-300 hover:shadow-[0_10px_30px_rgba(var(--primary-rgb),0.15)] hover:-translate-y-1 group"
              >
                <div className="h-full w-full rounded-2xl bg-zinc-50 dark:bg-card-bg-3/95 p-6 flex flex-col items-start gap-4 relative overflow-hidden">
                  <div className="absolute top-0 right-0 -mr-8 -mt-8 w-16 h-16 bg-primary/5 rounded-full blur-xl pointer-events-none group-hover:bg-primary/10 transition-colors duration-300" />
                  <div className='flex items-center justify-center p-3 rounded-xl bg-primary/10 border border-primary/20 text-primary'>
                    {React.createElement(el.icon, { className: 'text-2xl shrink-0' })}
                  </div>
                  <div className='space-y-1.5'>
                    <h4 className='font-semibold text-lg text-zinc-900 dark:text-primary tracking-tight'>{el.title}</h4>
                    <p className='text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed font-light'>{el.text}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Visually stunning layout section separator */}
      <div className="h-[1px] w-full bg-gradient-to-r from-transparent via-white/10 to-transparent dark:via-zinc-800" />

      {/* ============================================================== */}
      {/* --------- SECTION 4: FOUNDED BY TALHA (LEADERSHIP) ----------- */}
      {/* ============================================================== */}
      <section id="founder" className="relative group scroll-mt-24">
        <div className="px-2 md:px-4 text-neutral-800 dark:text-neutral-200">
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-primary/10 text-primary border border-primary/20 mb-2">
                <span>Company Leadership & Technical Foundation</span>
              </div>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-zinc-900 dark:text-white tracking-tight">
                Founded by Muhammad Talha
              </h2>
            </div>
            <span className="text-xs text-zinc-500 font-mono">
              Founder & Lead Systems Engineer
            </span>
          </div>

          {/* Founder Bio Card */}
          <div className="p-6 sm:p-8 rounded-3xl bg-zinc-50 dark:bg-card-bg-3/80 border border-zinc-200 dark:border-white/5 shadow-md relative overflow-hidden">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              
              {/* Founder Avatar & Contact Info */}
              <div className="lg:col-span-4 flex flex-col items-center text-center p-6 rounded-2xl bg-zinc-100/70 dark:bg-black/20 border border-zinc-200/70 dark:border-white/5">
                <div className="relative w-40 h-40 rounded-2xl overflow-hidden bg-primary/10 border-2 border-primary/20 shadow-lg mb-4">
                  <Image 
                    src={FounderAvatar} 
                    alt="Muhammad Talha - Founder of talhatechs" 
                    fill 
                    className="object-cover object-top"
                    priority
                  />
                </div>
                <h3 className="text-xl font-bold text-zinc-900 dark:text-white tracking-tight">Muhammad Talha</h3>
                <p className="text-xs text-primary font-bold uppercase tracking-wider mt-0.5">Founder & Lead Engineer</p>
                <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-2 font-light">Islamabad, Pakistan</p>

                <div className="w-full mt-6 pt-6 border-t border-zinc-200 dark:border-white/5 space-y-2.5 text-left text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-zinc-400 font-medium flex items-center gap-1.5"><Mail className="h-3.5 w-3.5 text-primary" /> Email</span>
                    <a href="mailto:mtalhamaths@gmail.com" className="font-semibold text-zinc-800 dark:text-zinc-200 hover:text-primary truncate">mtalhamaths@gmail.com</a>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-zinc-400 font-medium flex items-center gap-1.5"><Phone className="h-3.5 w-3.5 text-primary" /> Phone</span>
                    <a href="tel:+923185853847" className="font-semibold text-zinc-800 dark:text-zinc-200 hover:text-primary">+92 318 5853847</a>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-zinc-400 font-medium flex items-center gap-1.5"><Calendar className="h-3.5 w-3.5 text-primary" /> Birth</span>
                    <span className="font-semibold text-zinc-800 dark:text-zinc-200">28 Nov 2003</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-zinc-400 font-medium flex items-center gap-1.5"><Flag className="h-3.5 w-3.5 text-primary" /> Nationality</span>
                    <span className="font-semibold text-zinc-800 dark:text-zinc-200">Pakistani</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-zinc-400 font-medium flex items-center gap-1.5"><Globe className="h-3.5 w-3.5 text-primary" /> GitHub</span>
                    <a href="https://github.com/talhary" target="_blank" rel="noopener noreferrer" className="font-semibold text-primary hover:underline">github.com/talhary</a>
                  </div>
                </div>
              </div>

              {/* Founder Narrative & Experience */}
              <div className="lg:col-span-8 space-y-6">
                <div>
                  <h4 className="text-lg font-bold text-zinc-900 dark:text-white mb-2">The Founder&apos;s Mission</h4>
                  <p className="text-base text-zinc-750 dark:text-zinc-300 font-light leading-relaxed">
                    I am <Highlight text="Muhammad Talha" />, a software engineer based in Islamabad specializing in complete <Highlight text="Full Stack" /> architectures, native systems development (Rust & Tauri), and automated developer tools. With a rigorous academic foundation, I founded <strong className="font-semibold text-zinc-900 dark:text-white">talhatechs</strong> to build high-grade products like <Highlight text="Noyare" /> that merge microscopic performance with elegant developer experience. I currently also engineer scalable web platforms at <Highlight text="Woltrio" />.
                  </p>
                </div>

                {/* 3D Cinematic Portfolio Experience CTA */}
                <div className="p-5 rounded-2xl border border-primary/25 bg-gradient-to-r from-primary/10 via-primary/5 to-transparent relative overflow-hidden group/cinemabanner">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div className="space-y-1">
                      <h5 className="font-semibold text-sm sm:text-base text-zinc-900 dark:text-white flex items-center gap-2">
                        <Sparkles className="h-4 w-4 text-primary" />
                        <span>Interactive 3D Portfolio Matrix</span>
                      </h5>
                      <p className="text-xs text-zinc-500 dark:text-zinc-400 font-light max-w-xl">
                        Launch a 3D Three.js particle presentation with generative synthesizers displaying Talha&apos;s complete engineering portfolio.
                      </p>
                    </div>
                    <Link href="/intro" className="shrink-0 max-sm:w-full">
                      <button className="w-full flex items-center justify-center gap-2 bg-primary hover:bg-primary-hover text-white text-xs font-semibold uppercase tracking-wider py-2.5 px-5 rounded-xl shadow-md transition-all">
                        Launch 3D View &rarr;
                      </button>
                    </Link>
                  </div>
                </div>

                {/* Professional Work History */}
                <div>
                  <h4 className="text-base font-bold text-zinc-900 dark:text-white mb-3">Professional Track Record</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {founderExperiences.map((el, i) => (
                      <div
                        key={i}
                        className="p-4 rounded-xl bg-white dark:bg-card-bg-2 border border-zinc-200 dark:border-white/5 space-y-2"
                      >
                        <div className="flex items-center gap-2">
                          <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-500">
                            <Briefcase className="h-4 w-4" />
                          </div>
                          <div>
                            <h5 className="font-bold text-sm text-zinc-900 dark:text-zinc-100">{el.title}</h5>
                            <span className="text-xs text-primary font-semibold">At {el.company}</span>
                          </div>
                        </div>
                        <p className="text-xs text-zinc-500 dark:text-zinc-400 font-light leading-relaxed">{el.description}</p>
                        <span className="inline-block text-[10px] font-semibold px-2 py-0.5 rounded-full bg-zinc-100 dark:bg-white/5 text-zinc-600 dark:text-zinc-400">
                          {el.dates}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

              </div>

            </div>

            {/* Founder Skillset Matrix */}
            <div className="mt-8 pt-8 border-t border-zinc-200 dark:border-white/10">
              <h4 className="text-base font-bold text-zinc-900 dark:text-white mb-4">Founder&apos;s Engineering Skill Matrix</h4>
              <div className="flex flex-wrap gap-2">
                {skills.map((skill) => (
                  <div
                    key={skill.name}
                    className={cn(
                      'flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all duration-300 hover:scale-105 border border-zinc-200/50 dark:border-white/5 shadow-sm',
                      skill.color,
                      skill.darkColor
                    )}
                  >
                    <skill.icon className="h-3.5 w-3.5 shrink-0" />
                    <span>{skill.name}</span>
                  </div>
                ))}
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* Visually stunning layout section separator */}
      <div className="h-[1px] w-full bg-gradient-to-r from-transparent via-white/10 to-transparent dark:via-zinc-800" />

      {/* ============================================================== */}
      {/* ------------ SECTION 5: OTHER FEATURED PROJECTS -------------- */}
      {/* ============================================================== */}
      <section id="projects" className="relative group">
        <div className="px-2 md:px-4 text-neutral-800 dark:text-neutral-200">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
            <div>
              <Heading title="More Systems & Web Projects" />
              <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1 font-light">
                Custom full-stack web applications, tools, and platforms engineered by talhatechs.
              </p>
            </div>
            <Link
              href="/portfolio/all"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:underline group/all shrink-0 self-start sm:self-auto"
            >
              <span>View complete project catalog</span>
              <ArrowRight className="h-3.5 w-3.5 transition-transform duration-200 group-hover/all:translate-x-1" />
            </Link>
          </div>

          <div>
            <AllProjects projects={projects.slice(0, 3)} />
          </div>

          <div className="mt-8 flex justify-center">
            <Link href="/portfolio/all">
              <button className="flex items-center gap-2 bg-zinc-100 hover:bg-zinc-200 dark:bg-card-bg-2 dark:hover:bg-card-bg-1 text-zinc-800 dark:text-white font-semibold rounded-xl text-sm py-3 px-8 border border-zinc-200 dark:border-white/10 hover:border-primary/40 transition-all duration-300">
                <span>Explore All Projects & Architecture Details</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* Visually stunning layout section separator */}
      <div className="h-[1px] w-full bg-gradient-to-r from-transparent via-white/10 to-transparent dark:via-zinc-800" />

      {/* ============================================================== */}
      {/* ------------- SECTION 6: RESUME & EDUCATION ------------------ */}
      {/* ============================================================== */}
      <section id="education" className="relative group">
        <div className="px-2 md:px-4 text-neutral-800 dark:text-zinc-300">
          <div className="flex gap-x-3 items-center justify-start mb-6">
            <BookOpen className="text-primary w-6 h-6 shrink-0" />
            <h3 className='text-2xl font-semibold text-zinc-900 dark:text-zinc-100 tracking-tight'>
              Founder&apos;s Academic Foundation
            </h3>
          </div>

          <div className="p-1.5 rounded-2xl bg-white/[0.01] border border-white/[0.03] dark:bg-zinc-950/10">
            <EducationList />
          </div>
        </div>
      </section>

      {/* Visually stunning layout section separator */}
      <div className="h-[1px] w-full bg-gradient-to-r from-transparent via-white/10 to-transparent dark:via-zinc-800" />

      {/* ============================================================== */}
      {/* ---------------- SECTION 7: GITHUB ACTIVITY ------------------ */}
      {/* ============================================================== */}
      <section id="github" className="relative group">
        <div className="px-2 md:px-4 text-neutral-800 dark:text-neutral-200">
          <GitHubStats />
        </div>
      </section>

      {/* ============================================================== */}
      {/* ----------- SECTION 8: LATEST TECHNICAL ARTICLES ------------- */}
      {/* ============================================================== */}
      {recentBlogs.length > 0 && (
        <>
          <div className="h-[1px] w-full bg-gradient-to-r from-transparent via-white/10 to-transparent dark:via-zinc-800" />
          <section id="latest-blogs" className="relative group">
            <div className="px-2 md:px-4 text-neutral-800 dark:text-neutral-200">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6">
                <div>
                  <Heading title="Latest Technical Articles" as="h2" />
                  <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1 font-light">
                    Practical engineering insights, architecture deep-dives, and tutorials from talhatechs.
                  </p>
                </div>
                <Link
                  href="/blog"
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:underline group/all shrink-0 self-start sm:self-auto"
                >
                  <span>View all articles</span>
                  <ArrowRight className="h-3.5 w-3.5 transition-transform duration-200 group-hover/all:translate-x-1" />
                </Link>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {recentBlogs.map((post) => (
                  <Link
                    key={post.id}
                    href={`/blog/${post.slug}`}
                    className="group/card flex flex-col bg-zinc-50 dark:bg-card-bg-3/60 border border-zinc-200 dark:border-zinc-800/80 dark:backdrop-blur-xl rounded-2xl overflow-hidden hover:border-primary/30 transition-all duration-300 hover:-translate-y-1 shadow-sm"
                  >
                    {post.imageUrl && (
                      <div className="w-full aspect-[16/9] relative overflow-hidden bg-zinc-100 dark:bg-zinc-900">
                        <img
                          src={post.imageUrl}
                          alt={post.title}
                          className="w-full h-full object-cover transition-transform duration-300 group-hover/card:scale-105"
                        />
                      </div>
                    )}
                    <div className="p-5 flex flex-col flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        {post.tags.slice(0, 2).map((tag) => (
                          <span
                            key={tag}
                            className="text-[10px] font-semibold uppercase tracking-wider text-primary bg-primary/10 px-2 py-0.5 rounded-md"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                      <h3 className="font-bold text-base text-zinc-900 dark:text-white line-clamp-2 mb-2 group-hover/card:text-primary transition-colors">
                        {post.title}
                      </h3>
                      <p className="text-xs text-zinc-600 dark:text-zinc-400 line-clamp-3 font-light mb-4 flex-1">
                        {post.description}
                      </p>
                      <div className="flex items-center justify-between text-[11px] text-zinc-500 dark:text-zinc-400 pt-3 border-t border-zinc-200/50 dark:border-zinc-800/60 mt-auto">
                        <span>
                          {new Date(post.createdAt).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric',
                          })}
                        </span>
                        <span className="text-primary font-medium flex items-center gap-1 group-hover/card:underline">
                          Read <ArrowRight className="h-3 w-3" />
                        </span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        </>
      )}

      {/* Visually stunning layout section separator */}
      <div className="h-[1px] w-full bg-gradient-to-r from-transparent via-white/10 to-transparent dark:via-zinc-800" />

      {/* ============================================================== */}
      {/* ------------------ SECTION 9: CONTACT ------------------------ */}
      {/* ============================================================== */}
      <section id="contact" className="relative group">
        <div className="px-2 md:px-4 text-neutral-800 dark:text-neutral-200">
          <Heading title="Contact talhatechs" as="h2" />

          <div className="mx-2 mt-6 max-md:mx-0">
            <div className="w-full px-0 py-6 dark:text-gray-100">
              <div className="grid md:grid-cols-5 gap-8 items-start">

                {/* Contact Form Card */}
                <div className="md:col-span-3 bg-zinc-50 dark:bg-card-bg-3/60 border border-zinc-200 dark:border-zinc-800/80 dark:backdrop-blur-xl rounded-2xl p-4 sm:p-8 shadow-sm dark:shadow-2xl relative overflow-hidden transition-all duration-300 hover:border-primary/20 group">
                  <div className="absolute top-0 right-0 -mr-16 -mt-16 w-32 h-32 bg-primary/10 rounded-full blur-3xl pointer-events-none" />

                  <div className="space-y-6 relative z-10">
                    <div>
                      <h3 className="text-2xl font-bold text-zinc-900 dark:text-white tracking-tight">Connect with Us</h3>
                      <p className="text-sm text-zinc-400 mt-1 font-light leading-relaxed">
                        Have a software concept, desktop utility request, enterprise contract, or collaboration opportunity? Send a message and let&apos;s discuss.
                      </p>
                    </div>

                    <hr className="border-white/5 dark:border-zinc-800/60 my-4" />

                    <ContactForm />
                  </div>
                </div>

                {/* Contact Details Card */}
                <div className="md:col-span-2 bg-zinc-50 dark:bg-card-bg-3/60 border border-zinc-200 dark:border-zinc-800/80 dark:backdrop-blur-xl rounded-2xl p-4 sm:p-8 shadow-sm dark:shadow-2xl relative overflow-hidden transition-all duration-300 hover:border-primary/20 group">
                  <div className="absolute top-0 right-0 -mr-16 -mt-16 w-32 h-32 bg-primary/10 rounded-full blur-3xl pointer-events-none" />

                  <div className="space-y-6 relative z-10">
                    <div>
                      <h3 className="text-2xl font-bold text-zinc-900 dark:text-white tracking-tight">Direct Channels</h3>
                      <p className="text-sm text-zinc-400 mt-1 font-light leading-relaxed">
                        Reach out directly to talhatechs leadership and founder Muhammad Talha.
                      </p>
                    </div>

                    <hr className="border-white/5 dark:border-zinc-800/60 my-4" />

                    <div className="space-y-4">

                      {/* Phone Item */}
                      <div className="group/item flex items-center gap-3.5 p-3 rounded-xl bg-white/[0.02] dark:bg-black/20 border border-white/[0.03] dark:border-zinc-800/30 hover:border-primary/30 transition-all duration-200">
                        <div className="h-9 w-9 rounded-lg bg-primary/10 flex items-center justify-center text-primary border border-primary/20 group-hover/item:bg-primary/15 transition-all">
                          <Phone className="h-4.5 w-4.5 shrink-0" />
                        </div>
                        <div className="flex flex-col min-w-0">
                          <span className="text-[10px] text-zinc-450 dark:text-zinc-550 uppercase font-semibold tracking-wider">Phone</span>
                          <a href="tel:+923185853847" className="text-sm font-semibold text-zinc-200 dark:text-zinc-300 hover:text-primary transition-colors truncate">
                            +92-318-5853847
                          </a>
                        </div>
                      </div>

                      {/* Email Item */}
                      <div className="group/item flex items-center gap-3.5 p-3 rounded-xl bg-white/[0.02] dark:bg-black/20 border border-white/[0.03] dark:border-zinc-800/30 hover:border-primary/30 transition-all duration-200">
                        <div className="h-9 w-9 rounded-lg bg-primary/10 flex items-center justify-center text-primary border border-primary/20 group-hover/item:bg-primary/15 transition-all">
                          <Mail className="h-4.5 w-4.5 shrink-0" />
                        </div>
                        <div className="flex flex-col min-w-0">
                          <span className="text-[10px] text-zinc-450 dark:text-zinc-555 uppercase font-semibold tracking-wider">Email</span>
                          <a href="mailto:mtalhamaths@gmail.com" className="text-sm font-semibold text-zinc-200 dark:text-zinc-300 hover:text-primary transition-colors truncate">
                            mtalhamaths@gmail.com
                          </a>
                        </div>
                      </div>

                      {/* Website Item */}
                      <div className="group/item flex items-center gap-3.5 p-3 rounded-xl bg-white/[0.02] dark:bg-black/20 border border-white/[0.03] dark:border-zinc-800/30 hover:border-primary/30 transition-all duration-200">
                        <div className="h-9 w-9 rounded-lg bg-primary/10 flex items-center justify-center text-primary border border-primary/20 group-hover/item:bg-primary/15 transition-all">
                          <Globe className="h-4.5 w-4.5 shrink-0" />
                        </div>
                        <div className="flex flex-col min-w-0">
                          <span className="text-[10px] text-zinc-450 dark:text-zinc-555 uppercase font-semibold tracking-wider">Company Domain</span>
                          <Link href="/" className="text-sm font-semibold text-zinc-200 dark:text-primary hover:text-primary hover:underline transition-colors truncate">
                            talhacodes.site (talhatechs)
                          </Link>
                        </div>
                      </div>

                      {/* Location Item */}
                      <div className="group/item flex items-center gap-3.5 p-3 rounded-xl bg-white/[0.02] dark:bg-black/20 border border-white/[0.03] dark:border-zinc-800/30 hover:border-primary/20 transition-all duration-200">
                        <div className="h-9 w-9 rounded-lg bg-primary/10 flex items-center justify-center text-primary border border-primary/20">
                          <MapPin className="h-4.5 w-4.5 shrink-0" />
                        </div>
                        <div className="flex flex-col min-w-0">
                          <span className="text-[10px] text-zinc-455 dark:text-zinc-555 uppercase font-semibold tracking-wider">Location</span>
                          <span className="text-sm font-semibold text-zinc-200 dark:text-zinc-300 truncate">
                            Islamabad, Pakistan
                          </span>
                        </div>
                      </div>

                    </div>
                  </div>
                </div>

              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================== */}
      {/* -------------------- SECTION 10: FOOTER ---------------------- */}
      {/* ============================================================== */}
      <footer className="w-full mt-12 pt-8 border-t border-zinc-200 dark:border-zinc-800/60 text-center relative overflow-hidden group">
        <div className="absolute inset-0 bg-gradient-to-t from-black/5 to-transparent dark:from-black/20 pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6 px-6 py-6 rounded-2xl bg-zinc-50 dark:bg-black/10 border border-zinc-200 dark:border-zinc-800/50 shadow-sm dark:shadow-none">

          <div className="flex flex-col items-center md:items-start text-center md:text-left gap-1.5">
            <div className="flex items-center gap-2">
              <span className="text-base font-extrabold text-zinc-900 dark:text-white tracking-tight">
                talha<span className="text-primary font-black">techs</span>
              </span>
              <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20">
                Founded by Talha
              </span>
            </div>
            <p className="text-xs text-zinc-650 dark:text-zinc-400 font-light max-w-sm">
              Engineering high-performance native desktop systems (Noyare) and scalable web platforms.
            </p>
          </div>

          <div className="flex flex-col items-center md:items-end gap-2.5">
            <div className="flex items-center gap-1.5 text-[10px] text-zinc-500 font-semibold uppercase tracking-widest">
              <span>Rust</span>
              <span>•</span>
              <span className="text-primary font-bold">Tauri</span>
              <span>•</span>
              <span className="text-primary font-bold">Next.js</span>
              <span>•</span>
              <span className="text-primary font-bold">Tailwind</span>
            </div>
            <p className="text-[11px] text-zinc-600 dark:text-zinc-500 font-light">
              © {new Date().getFullYear()} talhatechs. Founded by Muhammad Talha. All rights reserved. • <Link href="/privacy" className="hover:text-primary transition-colors">Privacy Policy</Link>
            </p>
          </div>

        </div>
      </footer>
    </div>
  );
}
