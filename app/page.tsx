import React from 'react';
import { Metadata } from 'next';
import { cn } from '@/lib/utils';
import { FaWindows, FaGithub, FaLinkedin, FaRobot } from 'react-icons/fa';
import { SiRust, SiNextdotjs } from 'react-icons/si';
import {
  Mail,
  Phone,
  MapPin,
  ArrowRight,
  ArrowUpRight,
  Activity,
  ShieldCheck,
  Zap,
  Network,
  Globe,
  Eye,
  HardDrive,
  Clock,
  Terminal,
  Check,
  Columns2,
  Undo2,
  Search,
  FileText,
  RefreshCw,
  Copy,
  Palette,
} from 'lucide-react';
import { GetAllProjects } from "@/actions/getAllProjects";
import { AllProjects } from '@/components/all-projects';
import { ContactForm } from '@/app/contact/_components/form';
import Link from 'next/link';
import Image from 'next/image';
import { db } from "@/lib/db";
import FounderAvatar from "@/images/me.png";

export const dynamic = "force-dynamic";

const NOYARE_STORE_URL = 'https://apps.microsoft.com/detail/9PL83RF36NP4?hl=en-us&gl=US&ocid=pdpshare';

const services = [
  {
    title: 'Native desktop software',
    icon: SiRust,
    text: 'Lightweight Windows applications in Rust and Tauri for system telemetry, diagnostics and resource optimization.',
  },
  {
    title: 'Full-stack web platforms',
    icon: SiNextdotjs,
    text: 'Production web products on Next.js, React, Node.js and PostgreSQL, built to scale and easy to maintain.',
  },
  {
    title: 'Developer tooling',
    icon: Terminal,
    text: 'Utilities, proxy daemons, tunnels and tool suites that remove friction from everyday engineering work.',
  },
  {
    title: 'Automation & data pipelines',
    icon: FaRobot,
    text: 'Scrapers, data pipelines and bots that replace slow, repetitive manual workflows.',
  },
];

const noyareStats = [
  { value: '~18 MB', label: 'Install size' },
  { value: '0.4%', label: 'CPU at idle' },
  { value: '1.1 s', label: 'Telemetry interval' },
  { value: 'Rust', label: 'Native core, no Electron' },
];

const noyareModules = [
  { title: 'Resource dashboard', icon: Activity, text: 'Per-core CPU, memory and bandwidth with 90-second sparklines.' },
  { title: 'Process & trust manager', icon: ShieldCheck, text: 'PID and thread monitoring with VirusTotal and Authenticode checks.' },
  { title: 'Memory optimizer', icon: Zap, text: 'Purge standby memory and trim working sets in real time.' },
  { title: 'DNS & socket inspector', icon: Network, text: 'TCP/UDP ports and live DNS queries mapped to their processes.' },
  { title: 'Cloudflare tunnels', icon: Globe, text: 'Expose local ports over HTTPS with built-in throughput metrics.' },
  { title: 'Quick Look', icon: Eye, text: 'Spacebar previews for code, images, archives and PE headers.' },
  { title: 'Disk & cache sweeper', icon: HardDrive, text: 'Reclaim space from caches, temp files and build artifacts.' },
  { title: 'Keep awake', icon: Clock, text: 'Prevent sleep during downloads, builds and network workloads.' },
];

const FILESPRO_STORE_URL = 'https://apps.microsoft.com/detail/9NTKTTNK7JXX?hl=en-us&gl=US&ocid=pdpshare';
const FILESPRO_SITE_URL = 'https://talhary.github.io/filespro/';

const filesproStats = [
  { value: '1.1', label: 'Latest release' },
  { value: '142', label: 'Commands, every one bindable' },
  { value: '28', label: 'Color themes, plus 29 backdrops' },
  { value: 'Rust', label: 'Native core and interface' },
];

const filesproModules = [
  { title: 'Two panes, endless tabs', icon: Columns2, text: 'Folders side by side; F5 copies and F6 moves to the other pane.' },
  { title: 'Undo that survives restarts', icon: Undo2, text: 'A journal of every copy, move, rename and delete, many steps deep.' },
  { title: 'Instant search', icon: Search, text: 'A local filename index with fuzzy matching, regex and filters like size:>5mb.' },
  { title: 'Viewer tab', icon: FileText, text: 'Code with find and replace, searchable PDFs, Word, Markdown, images and video.' },
  { title: 'Terminals in tiles', icon: Terminal, text: 'PowerShell beside your files, split right or down, following your folder.' },
  { title: 'Folder sync', icon: RefreshCw, text: 'Mirror, two-way or update-only, checked before it runs and undoable after.' },
  { title: 'Duplicates & disk usage', icon: Copy, text: 'Find identical files by content and see what fills a folder in a treemap.' },
  { title: 'Themes, backdrops & music', icon: Palette, text: 'Make it yours, and play a folder of music in a player in the corner.' },
];

const founderStack = ['Rust', 'Tauri', 'TypeScript', 'Next.js', 'React', 'Node.js', 'PostgreSQL', 'MongoDB', 'Docker'];

const Container = ({ children, className }: { children: React.ReactNode; className?: string }) => (
  <div className={cn('max-w-6xl mx-auto px-4 sm:px-6 lg:px-8', className)}>{children}</div>
);

const SectionHeader = ({
  eyebrow,
  title,
  description,
  action,
}: {
  eyebrow: string;
  title: string;
  description?: string;
  action?: React.ReactNode;
}) => (
  <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-10 sm:mb-12">
    <div className="max-w-2xl">
      <p className="text-sm font-medium text-primary mb-3">{eyebrow}</p>
      <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight text-zinc-900 dark:text-white">{title}</h2>
      {description && (
        <p className="mt-4 text-base sm:text-lg text-zinc-600 dark:text-zinc-400 leading-relaxed">{description}</p>
      )}
    </div>
    {action}
  </div>
);

const TextLink = ({ href, children }: { href: string; children: React.ReactNode }) => (
  <Link
    href={href}
    className="group inline-flex items-center gap-1.5 text-sm font-medium text-zinc-900 dark:text-white hover:text-primary dark:hover:text-primary transition-colors shrink-0"
  >
    {children}
    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
  </Link>
);

const primaryButton =
  'inline-flex items-center justify-center gap-2 rounded-lg bg-zinc-900 hover:bg-zinc-700 dark:bg-white dark:hover:bg-zinc-200 text-white dark:text-zinc-900 text-sm font-medium px-5 py-3 transition-colors';
const secondaryButton =
  'inline-flex items-center justify-center gap-2 rounded-lg border border-zinc-300 dark:border-zinc-700 hover:bg-zinc-50 dark:hover:bg-zinc-900 text-zinc-900 dark:text-white text-sm font-medium px-5 py-3 transition-colors';

export const metadata: Metadata = {
  title: "talhacodes | High-Performance Software Engineering, Systems & Developer Tools",
  description: "Muhammad Talha (talhacodes) is a software engineer based in Islamabad. Creator of Noyare (high-performance Windows forensic system monitor), scalable full-stack web platforms, and open developer tools.",
  alternates: {
    canonical: "/",
  },
  keywords: [
    "talhacodes",
    "Talha Codes",
    "Noyare",
    "Noyare Windows",
    "FilesPro",
    "FilesPro file manager",
    "Muhammad Talha",
    "Talha Codes",
    "Software Engineer Portfolio",
    "Full Stack Software Engineer",
    "Rust Tauri Desktop Apps",
    "Next.js Developer Tools",
    "Software Engineer Islamabad"
  ],
  openGraph: {
    title: "talhacodes | High-Performance Software Engineering & Developer Tools",
    description: "Muhammad Talha (talhacodes) is a software engineer based in Islamabad. Creator of Noyare (forensic system monitor for Windows) and modern web systems.",
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

  const personSchema = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    '@id': `${siteUrl}/#person`,
    name: 'Muhammad Talha',
    alternateName: ['Talha Codes', 'talhacodes'],
    url: siteUrl,
    jobTitle: 'Software Engineer',
    description: 'Software engineer in Islamabad building native Windows tools in Rust and Tauri, full-stack web platforms, and developer tools.',
    worksFor: {
      '@type': 'Organization',
      name: 'Woltrio',
    },
    alumniOf: {
      '@type': 'CollegeOrUniversity',
      name: 'Quaid-i-Azam University',
    },
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Islamabad',
      addressCountry: 'PK',
    },
    sameAs: [
      'https://github.com/talhary',
      'https://linkedin.com/in/talhacodes',
    ],
    knowsAbout: [
      'Native Systems Engineering',
      'Rust & Tauri Development',
      'Noyare System Monitor',
      'FilesPro File Manager',
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
    author: { '@id': `${siteUrl}/#person` },
    description: 'Noyare is a high-performance forensic system monitor and utility suite for Windows built natively in Tauri and Rust.',
  };

  const filesproSchema = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'FilesPro Manager',
    alternateName: 'FilesPro',
    operatingSystem: 'Windows 10, Windows 11',
    applicationCategory: 'UtilitiesApplication',
    softwareVersion: '1.1',
    url: FILESPRO_SITE_URL,
    downloadUrl: FILESPRO_STORE_URL,
    author: { '@id': `${siteUrl}/#person` },
    description: 'FilesPro is a fast, keyboard-first dual-pane file manager for Windows, built in Rust: tabs, instant search, a viewer and terminals beside your files, and copies you can pause, resume, verify and undo.',
  };

  const websiteSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'talhacodes',
    alternateName: 'Muhammad Talha',
    url: siteUrl,
    publisher: { '@id': `${siteUrl}/#person` },
    description: 'High-Performance Software Engineering, Native Systems, and Developer Tools — Portfolio of Muhammad Talha',
    potentialAction: {
      '@type': 'SearchAction',
      target: `${siteUrl}/blog?search={search_term_string}`,
      'query-input': 'required name=search_term_string',
    },
  };
  return (
    <div className="w-full">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareAppSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(filesproSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
      />

      {/* Hero */}
      <section id="hero" className="relative overflow-hidden">
        <div
          aria-hidden
          className="absolute inset-0 -z-10 bg-[linear-gradient(to_right,rgb(0_0_0/0.04)_1px,transparent_1px),linear-gradient(to_bottom,rgb(0_0_0/0.04)_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,rgb(255_255_255/0.04)_1px,transparent_1px),linear-gradient(to_bottom,rgb(255_255_255/0.04)_1px,transparent_1px)] bg-[size:48px_48px] [mask-image:radial-gradient(ellipse_at_top,black_30%,transparent_75%)]"
        />
        <Container className="pt-20 sm:pt-28 pb-16 sm:pb-20 text-center">
          <Link
            href="#noyare"
            className="inline-flex items-center gap-2 rounded-full border border-zinc-200 dark:border-zinc-800 bg-white/70 dark:bg-zinc-900/70 px-3 py-1 text-xs sm:text-sm text-zinc-600 dark:text-zinc-300 hover:border-zinc-300 dark:hover:border-zinc-700 transition-colors"
          >
            <span className="h-1.5 w-1.5 rounded-full bg-primary" />
            Noyare is now on the Microsoft Store
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>

          <h1 className="mt-8 mx-auto max-w-4xl text-4xl sm:text-5xl lg:text-6xl font-semibold tracking-tight text-zinc-900 dark:text-white leading-[1.1]">
            Fast, native software and modern web platforms.
          </h1>
          <p className="mt-6 mx-auto max-w-2xl text-base sm:text-lg text-zinc-600 dark:text-zinc-400 leading-relaxed">
            Hi, I am Muhammad Talha, a software engineer based in Islamabad. I build lightweight desktop tools like Noyare
            and FilesPro, production web platforms, and developer utilities people rely on every day.
          </p>

          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-3">
            <a href={NOYARE_STORE_URL} target="_blank" rel="noopener noreferrer" className={cn(primaryButton, 'w-full sm:w-auto')}>
              <FaWindows className="h-4 w-4" />
              Get Noyare for Windows
            </a>
            <Link href="#contact" className={cn(secondaryButton, 'w-full sm:w-auto')}>
              Start a project
            </Link>
          </div>
        </Container>

        <Container className="pb-20 sm:pb-28">
          <div className="rounded-xl sm:rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-zinc-100 dark:bg-zinc-900 p-1.5 sm:p-2 shadow-2xl shadow-zinc-900/10 dark:shadow-black/40">
            <div className="overflow-hidden rounded-lg sm:rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-950">
              <img
                src="/images/noyare/preview.png"
                alt="Noyare system monitor dashboard"
                className="w-full aspect-[16/10] object-cover object-top"
              />
            </div>
          </div>
        </Container>
      </section>

      {/* Services */}
      <section id="services" className="border-t border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/30 py-20 sm:py-28">
        <Container>
          <SectionHeader
            eyebrow="What I do"
            title="Engineering across the stack"
            description="From native system utilities to cloud-backed web products, I design, build and ship software end to end."
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-px overflow-hidden rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-200 dark:bg-zinc-800">
            {services.map((service) => (
              <div key={service.title} className="bg-white dark:bg-zinc-950 p-6 sm:p-8">
                <service.icon className="h-5 w-5 text-primary" />
                <h3 className="mt-5 text-base font-semibold text-zinc-900 dark:text-white">{service.title}</h3>
                <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">{service.text}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* Noyare */}
      <section id="noyare" className="border-t border-zinc-200 dark:border-zinc-800 py-20 sm:py-28 scroll-mt-16">
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <div>
              <div className="flex items-center gap-3">
                <img src="/images/noyare/icon.png" alt="Noyare icon" className="h-11 w-11 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-900 p-1" />
                <div>
                  <p className="text-sm font-medium text-primary">Flagship product</p>
                  <p className="text-sm text-zinc-500 dark:text-zinc-400">Windows 10 & 11</p>
                </div>
              </div>
              <h2 className="mt-6 text-3xl sm:text-4xl font-semibold tracking-tight text-zinc-900 dark:text-white">
                Noyare. See your machine think, second by second.
              </h2>
              <p className="mt-5 text-base sm:text-lg text-zinc-600 dark:text-zinc-400 leading-relaxed">
                A forensic system monitor and utility suite for Windows, built natively in Rust and Tauri. Inspect suspicious
                processes, free up memory, open secure tunnels and preview files, all from one calm workspace.
              </p>

              <ul className="mt-6 space-y-2.5 text-sm text-zinc-700 dark:text-zinc-300">
                {['Free on the Microsoft Store', 'No telemetry leaves your machine', 'Native performance, tiny footprint'].map((item) => (
                  <li key={item} className="flex items-center gap-2.5">
                    <Check className="h-4 w-4 text-primary shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>

              <div className="mt-8 flex flex-col sm:flex-row gap-3">
                <a href={NOYARE_STORE_URL} target="_blank" rel="noopener noreferrer" className={primaryButton}>
                  <FaWindows className="h-4 w-4" />
                  Download free
                </a>
                <a href="https://talhary.github.io/noyare-home/" target="_blank" rel="noopener noreferrer" className={secondaryButton}>
                  Documentation
                  <ArrowUpRight className="h-4 w-4" />
                </a>
              </div>
            </div>

            <dl className="grid grid-cols-2 gap-px overflow-hidden rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-200 dark:bg-zinc-800">
              {noyareStats.map((stat) => (
                <div key={stat.label} className="bg-white dark:bg-zinc-950 p-6 sm:p-8">
                  <dt className="text-sm text-zinc-500 dark:text-zinc-400">{stat.label}</dt>
                  <dd className="mt-2 text-3xl sm:text-4xl font-semibold tracking-tight text-zinc-900 dark:text-white">{stat.value}</dd>
                </div>
              ))}
            </dl>
          </div>

          <div className="mt-20 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-10">
            {noyareModules.map((module) => (
              <div key={module.title}>
                <div className="h-9 w-9 rounded-lg border border-zinc-200 dark:border-zinc-800 flex items-center justify-center">
                  <module.icon className="h-4 w-4 text-zinc-700 dark:text-zinc-300" />
                </div>
                <h3 className="mt-4 text-sm font-semibold text-zinc-900 dark:text-white">{module.title}</h3>
                <p className="mt-1.5 text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">{module.text}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>


      {/* FilesPro */}
      <section id="filespro" className="border-t border-zinc-200 dark:border-zinc-800 py-20 sm:py-28 scroll-mt-16">
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <div className="lg:order-2">
              <div className="flex items-center gap-3">
                <img src="/images/filespro/icon.png" alt="FilesPro icon" className="h-11 w-11 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-1" />
                <div>
                  <p className="text-sm font-medium text-primary">New · FilesPro 1.1</p>
                  <p className="text-sm text-zinc-500 dark:text-zinc-400">Windows 10 &amp; 11</p>
                </div>
              </div>
              <h2 className="mt-6 text-3xl sm:text-4xl font-semibold tracking-tight text-zinc-900 dark:text-white">
                FilesPro. Move thousands of files. Undo any of them.
              </h2>
              <p className="mt-5 text-base sm:text-lg text-zinc-600 dark:text-zinc-400 leading-relaxed">
                A fast, keyboard-first file manager for Windows, built in Rust. Two panes, tabs, instant search, a viewer
                and terminals right beside your files, and an operation queue you can pause, resume, verify and undo.
              </p>

              <ul className="mt-6 space-y-2.5 text-sm text-zinc-700 dark:text-zinc-300">
                {['On the Microsoft Store', 'No account, no ads, no telemetry', 'Smooth in folders with tens of thousands of files'].map((item) => (
                  <li key={item} className="flex items-center gap-2.5">
                    <Check className="h-4 w-4 text-primary shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>

              <div className="mt-8 flex flex-col sm:flex-row gap-3">
                <a href={FILESPRO_STORE_URL} target="_blank" rel="noopener noreferrer" className={primaryButton}>
                  <FaWindows className="h-4 w-4" />
                  Get FilesPro
                </a>
                <a href={FILESPRO_SITE_URL} target="_blank" rel="noopener noreferrer" className={secondaryButton}>
                  Website
                  <ArrowUpRight className="h-4 w-4" />
                </a>
              </div>
            </div>

            <div className="lg:order-1 rounded-xl sm:rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-zinc-100 dark:bg-zinc-900 p-1.5 sm:p-2 shadow-2xl shadow-zinc-900/10 dark:shadow-black/40">
              <div className="overflow-hidden rounded-lg sm:rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white">
                <img
                  src="/images/filespro/preview.webp"
                  alt="FilesPro with two panes and tabs, in the light theme with a watercolor backdrop"
                  className="w-full aspect-[16/9] object-cover object-top"
                  loading="lazy"
                />
              </div>
            </div>
          </div>

          <dl className="mt-16 grid grid-cols-2 lg:grid-cols-4 gap-px overflow-hidden rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-200 dark:bg-zinc-800">
            {filesproStats.map((stat) => (
              <div key={stat.label} className="bg-white dark:bg-zinc-950 p-6 sm:p-8">
                <dt className="text-sm text-zinc-500 dark:text-zinc-400">{stat.label}</dt>
                <dd className="mt-2 text-3xl sm:text-4xl font-semibold tracking-tight text-zinc-900 dark:text-white">{stat.value}</dd>
              </div>
            ))}
          </dl>

          <div className="mt-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-10">
            {filesproModules.map((module) => (
              <div key={module.title}>
                <div className="h-9 w-9 rounded-lg border border-zinc-200 dark:border-zinc-800 flex items-center justify-center">
                  <module.icon className="h-4 w-4 text-zinc-700 dark:text-zinc-300" />
                </div>
                <h3 className="mt-4 text-sm font-semibold text-zinc-900 dark:text-white">{module.title}</h3>
                <p className="mt-1.5 text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">{module.text}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* Work */}
      {projects.length > 0 && (
        <section id="projects" className="border-t border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/30 py-20 sm:py-28">
          <Container>
            <SectionHeader
              eyebrow="Selected work"
              title="Platforms and tools I've shipped"
              description="Custom web applications, internal tools and products built for clients and for ourselves."
              action={<TextLink href="/portfolio/all">View all projects</TextLink>}
            />
            <AllProjects projects={projects.slice(0, 3)} />
          </Container>
        </section>
      )}

      {/* Founder */}
      <section id="founder" className="border-t border-zinc-200 dark:border-zinc-800 py-20 sm:py-28 scroll-mt-16">
        <Container>
          <div className="grid grid-cols-1 md:grid-cols-12 gap-10 lg:gap-16 items-center">
            <div className="md:col-span-4">
              <div className="relative aspect-square w-full max-w-xs mx-auto md:max-w-none overflow-hidden rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-zinc-100 dark:bg-zinc-900">
                <Image
                  src={FounderAvatar}
                  alt="Muhammad Talha, software engineer"
                  fill
                  sizes="(min-width: 768px) 33vw, 320px"
                  className="object-cover object-top"
                />
              </div>
            </div>
            <div className="md:col-span-8">
              <p className="text-sm font-medium text-primary mb-3">About</p>
              <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight text-zinc-900 dark:text-white">
                About Muhammad Talha
              </h2>
              <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">Software Engineer · Islamabad, Pakistan</p>
              <p className="mt-6 text-base sm:text-lg text-zinc-600 dark:text-zinc-400 leading-relaxed">
                Talha is a full-stack and systems engineer with a BS in Computer Science from Quaid-e-Azam University. He
                started talhacodes to build products like Noyare that pair low-level performance with a polished user
                experience, and is also a full-stack engineer at Woltrio, shipping production web platforms.
              </p>

              <div className="mt-6 flex flex-wrap gap-2">
                {founderStack.map((tech) => (
                  <span
                    key={tech}
                    className="rounded-md border border-zinc-200 dark:border-zinc-800 px-2.5 py-1 text-xs font-medium text-zinc-700 dark:text-zinc-300"
                  >
                    {tech}
                  </span>
                ))}
              </div>

              <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3 text-sm font-medium">
                <TextLink href="/about">About me</TextLink>
                <TextLink href="/resume">Resume</TextLink>
                <a href="https://github.com/talhary" target="_blank" rel="noopener noreferrer" aria-label="GitHub" className="text-zinc-500 hover:text-zinc-900 dark:hover:text-white transition-colors">
                  <FaGithub className="h-5 w-5" />
                </a>
                <a href="https://linkedin.com/in/talhacodes" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" className="text-zinc-500 hover:text-zinc-900 dark:hover:text-white transition-colors">
                  <FaLinkedin className="h-5 w-5" />
                </a>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* Writing */}
      {recentBlogs.length > 0 && (
        <section id="latest-blogs" className="border-t border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/30 py-20 sm:py-28">
          <Container>
            <SectionHeader
              eyebrow="Writing"
              title="Latest from the blog"
              description="Engineering notes, architecture deep-dives and tutorials."
              action={<TextLink href="/blog">All articles</TextLink>}
            />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {recentBlogs.map((post) => (
                <Link
                  key={post.id}
                  href={`/blog/${post.slug}`}
                  className="group flex flex-col overflow-hidden rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 hover:border-zinc-300 dark:hover:border-zinc-700 transition-colors"
                >
                  {post.imageUrl && (
                    <div className="aspect-[16/9] overflow-hidden bg-zinc-100 dark:bg-zinc-900">
                      <img
                        src={post.imageUrl}
                        alt={post.title}
                        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
                      />
                    </div>
                  )}
                  <div className="flex flex-1 flex-col p-6">
                    <div className="flex items-center gap-2 text-xs text-zinc-500 dark:text-zinc-400">
                      <time dateTime={new Date(post.createdAt).toISOString()}>
                        {new Date(post.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </time>
                      {post.tags[0] && (
                        <>
                          <span aria-hidden>·</span>
                          <span>{post.tags[0]}</span>
                        </>
                      )}
                    </div>
                    <h3 className="mt-3 text-base font-semibold text-zinc-900 dark:text-white line-clamp-2 group-hover:text-primary transition-colors">
                      {post.title}
                    </h3>
                    <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400 line-clamp-3 leading-relaxed">{post.description}</p>
                  </div>
                </Link>
              ))}
            </div>
          </Container>
        </section>
      )}

      {/* Contact */}
      <section id="contact" className="border-t border-zinc-200 dark:border-zinc-800 py-20 sm:py-28 scroll-mt-16">
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
            <div className="lg:col-span-5">
              <p className="text-sm font-medium text-primary mb-3">Contact</p>
              <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight text-zinc-900 dark:text-white">
                Let&apos;s build something together
              </h2>
              <p className="mt-4 text-base sm:text-lg text-zinc-600 dark:text-zinc-400 leading-relaxed">
                Have a product idea, a desktop utility in mind, or a contract to discuss? Send a message and I&apos;ll get back
                to you within a couple of days.
              </p>

              <dl className="mt-10 space-y-5 text-sm">
                <div className="flex items-center gap-3">
                  <dt><Mail className="h-4 w-4 text-zinc-400" /><span className="sr-only">Email</span></dt>
                  <dd><a href="mailto:mtalhamaths@gmail.com" className="text-zinc-900 dark:text-white hover:text-primary transition-colors">mtalhamaths@gmail.com</a></dd>
                </div>
                <div className="flex items-center gap-3">
                  <dt><Phone className="h-4 w-4 text-zinc-400" /><span className="sr-only">Phone</span></dt>
                  <dd><a href="tel:+923185853847" className="text-zinc-900 dark:text-white hover:text-primary transition-colors">+92 318 5853847</a></dd>
                </div>
                <div className="flex items-center gap-3">
                  <dt><MapPin className="h-4 w-4 text-zinc-400" /><span className="sr-only">Location</span></dt>
                  <dd className="text-zinc-900 dark:text-white">Islamabad, Pakistan</dd>
                </div>
              </dl>
            </div>

            <div className="lg:col-span-7 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/40 p-6 sm:p-8">
              <ContactForm />
            </div>
          </div>
        </Container>
      </section>

      {/* Footer */}
      <footer className="border-t border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/30">
        <Container className="py-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="col-span-2">
              <Link href="/" className="flex items-center gap-2.5">
                <span className="h-7 w-7 rounded-md bg-primary flex items-center justify-center text-white font-bold text-sm">T</span>
                <span className="font-semibold tracking-tight text-zinc-900 dark:text-white">
                  talha<span className="text-primary">techs</span>
                </span>
              </Link>
              <p className="mt-4 max-w-xs text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
                Native desktop software, web platforms and developer tools, built in Islamabad.
              </p>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-zinc-900 dark:text-white">Company</h3>
              <ul className="mt-4 space-y-2.5 text-sm text-zinc-600 dark:text-zinc-400">
                <li><Link href="/about" className="hover:text-zinc-900 dark:hover:text-white transition-colors">About</Link></li>
                <li><Link href="/portfolio/all" className="hover:text-zinc-900 dark:hover:text-white transition-colors">Portfolio</Link></li>
                <li><Link href="/blog" className="hover:text-zinc-900 dark:hover:text-white transition-colors">Blog</Link></li>
                <li><Link href="/contact" className="hover:text-zinc-900 dark:hover:text-white transition-colors">Contact</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-zinc-900 dark:text-white">Products</h3>
              <ul className="mt-4 space-y-2.5 text-sm text-zinc-600 dark:text-zinc-400">
                <li><a href={NOYARE_STORE_URL} target="_blank" rel="noopener noreferrer" className="hover:text-zinc-900 dark:hover:text-white transition-colors">Noyare</a></li>
                <li><Link href="/tools" className="hover:text-zinc-900 dark:hover:text-white transition-colors">Developer tools</Link></li>
                <li><Link href="/intro" className="hover:text-zinc-900 dark:hover:text-white transition-colors">3D portfolio</Link></li>
              </ul>
            </div>
          </div>
          <div className="mt-12 pt-8 border-t border-zinc-200 dark:border-zinc-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-zinc-500 dark:text-zinc-400">
            <p>© {new Date().getFullYear()} talhacodes. All rights reserved.</p>
            <div className="flex items-center gap-5">
              <Link href="/privacy" className="hover:text-zinc-900 dark:hover:text-white transition-colors">Privacy</Link>
              <a href="https://github.com/talhary" target="_blank" rel="noopener noreferrer" aria-label="GitHub" className="hover:text-zinc-900 dark:hover:text-white transition-colors">
                <FaGithub className="h-4 w-4" />
              </a>
              <a href="https://linkedin.com/in/talhacodes" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" className="hover:text-zinc-900 dark:hover:text-white transition-colors">
                <FaLinkedin className="h-4 w-4" />
              </a>
            </div>
          </div>
        </Container>
      </footer>
    </div>
  );
}
