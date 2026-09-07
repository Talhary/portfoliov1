import React from 'react';
import { Metadata } from 'next';
import { Heading } from '@/components/heading';
import AsideImageSection from '@/components/aside-image-section';
import { cn } from '@/lib/utils';
import { FaReact, FaNodeJs, FaDocker, FaPhp, FaRobot } from 'react-icons/fa';
import { SiNextdotjs, SiExpress, SiMongodb, SiTypescript, SiJavascript, SiUbuntu, SiPostgresql, SiMysql, SiDeno } from 'react-icons/si';
import { Briefcase, BookOpen, Phone, Mail, Globe, MapPin, ArrowRight } from 'lucide-react';
import { EducationList } from '@/components/education';
import { GetAllProjects } from "@/actions/getAllProjects";
import { AllProjects } from '@/components/all-projects';
import { ContactForm } from '@/app/contact/_components/form';
import Link from 'next/link';
import { GitHubStats } from '@/components/github-stats';

import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

// Data definitions imported from original page contents to keep details synchronized
const skills = [
  { name: 'Next.js', value: 80, icon: SiNextdotjs, color: 'bg-black text-white', darkColor: 'dark:bg-white dark:text-black' },
  { name: 'React', value: 90, icon: FaReact, color: 'bg-sky-100 text-sky-800', darkColor: 'dark:bg-sky-900 dark:text-sky-300' },
  { name: 'Node.js', value: 99, icon: FaNodeJs, color: 'bg-green-100 text-green-800', darkColor: 'dark:bg-green-900 dark:text-green-300' },
  { name: 'Express', value: 80, icon: SiExpress, color: 'bg-neutral-100 text-neutral-800', darkColor: 'dark:bg-neutral-700 dark:text-neutral-200' },
  { name: 'Deno', value: 70, icon: SiDeno, color: 'bg-neutral-100 text-neutral-800', darkColor: 'dark:bg-neutral-700 dark:text-neutral-200' },
  { name: 'TypeScript', value: 85, icon: SiTypescript, color: 'bg-blue-100 text-blue-800', darkColor: 'dark:bg-blue-900 dark:text-blue-300' },
  { name: 'JavaScript', value: 90, icon: SiJavascript, color: 'bg-yellow-100 text-yellow-800', darkColor: 'dark:bg-yellow-900 dark:text-yellow-300' },
  { name: 'PHP', value: 80, icon: FaPhp, color: 'bg-indigo-100 text-indigo-800', darkColor: 'dark:bg-indigo-900 dark:text-indigo-300' },
  { name: 'MongoDB', value: 80, icon: SiMongodb, color: 'bg-emerald-100 text-emerald-800', darkColor: 'dark:bg-emerald-900 dark:text-emerald-300' },
  { name: 'MySQL', value: 75, icon: SiMysql, color: 'bg-orange-100 text-orange-800', darkColor: 'dark:bg-orange-900 dark:text-orange-300' },
  { name: 'PostgreSQL', value: 80, icon: SiPostgresql, color: 'bg-cyan-100 text-cyan-800', darkColor: 'dark:bg-cyan-900 dark:text-cyan-300' },
  { name: 'Docker', value: 65, icon: FaDocker, color: 'bg-blue-200 text-blue-900', darkColor: 'dark:bg-blue-800 dark:text-blue-200' },
  { name: 'Ubuntu', value: 70, icon: SiUbuntu, color: 'bg-red-100 text-red-800', darkColor: 'dark:bg-red-900 dark:text-red-300' },
];

const focusAreas = [
  { title: 'MERN Stack Development', icon: FaReact, text: 'Architecting end-to-end applications from database models to reactive user interfaces.' },
  { title: 'Next.js Applications', icon: SiNextdotjs, text: 'Developing highly optimized web portals with advanced rendering modes and API routes.' },
  { title: 'Bot Development', icon: FaRobot, text: 'Writing custom scripts, web scrapers, and communication bots to automate manual tasks.' },
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

const experiences = [
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
    <span className='dark:text-primary dark:font-semibold text-primary font-bold'>
      <code>{text}</code>
    </span>
  );
};

export const metadata: Metadata = {
  title: "Talha Codes | Full Stack Software Engineer Portfolio",
  description: "Talha Codes - Full Stack Software Engineer based in Islamabad. Specializing in MERN stack, Next.js, React, Node.js, PHP, and bot development.",
  alternates: {
    canonical: "/",
  },
  keywords: [
    "Talha Codes",
    "Full Stack Software Engineer",
    "Web Developer Portfolio",
    "Islamabad Developer",
    "Next.js Developer",
    "React Developer",
    "Node.js Developer",
    "MERN Stack Developer",
    "Woltrio Engineer"
  ],
  openGraph: {
    title: "Talha Codes | Full Stack Software Engineer Portfolio",
    description: "Talha Codes - Full Stack Software Engineer based in Islamabad. Specializing in MERN stack, Next.js, React, Node.js, PHP, and bot development.",
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
    name: 'Talha',
    alternateName: 'Talha Codes',
    url: siteUrl,
    jobTitle: 'Full Stack Software Engineer',
    worksFor: {
      '@type': 'Organization',
      name: 'Woltrio',
    },
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Islamabad',
      addressCountry: 'PK',
    },
    sameAs: [
      'https://github.com/Talha-Woltrio',
      'https://linkedin.com/in/talhacodes',
    ],
    knowsAbout: [
      'Full Stack Development',
      'Next.js',
      'React',
      'Node.js',
      'TypeScript',
      'PostgreSQL',
      'MongoDB',
      'Docker',
      'Web Automation',
    ],
  };

  const websiteSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Talha Codes',
    url: siteUrl,
    description: 'Full Stack Software Engineer Portfolio, Developer Tools, and Technical Blog',
    potentialAction: {
      '@type': 'SearchAction',
      target: `${siteUrl}/blog?search={search_term_string}`,
      'query-input': 'required name=search_term_string',
    },
  };

  return (
    <div className="w-full flex flex-col gap-16 py-6 pb-4 scroll-smooth">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
      />
      {/* ---------------- SECTION 1: ABOUT ME ---------------- */}
      <section id="about" className="relative group">
        <div className="px-2 md:px-4 text-neutral-800 dark:text-neutral-200">
          <Heading title="About Me" />

          <AsideImageSection className='md:hidden my-4 flex flex-col items-center justify-center' />

          <div className='mt-6 mx-2 max-md:mx-0'>
            <p className='text-lg md:text-xl leading-relaxed tracking-wide opacity-90 text-zinc-800 dark:text-zinc-300 dark:opacity-85 font-light'>
              Welcome! I am <Highlight text="Talha" />, an Islamabad-based software engineer specializing in complete <Highlight text='Full Stack' /> web architectures. I engineer responsive web applications and automate complex processes with custom bots. With a solid academic foundation, my focus is on designing robust, high-performance, and secure digital tools. I currently write code at <Highlight text="Woltrio" />, where I build scalable features while continuously exploring modern frameworks and system design patterns.
            </p>
          </div>

          {/* 3D Cinematic Portfolio Experience CTA banner */}
          <div className="mt-8 mx-2 max-md:mx-0 p-5 rounded-2xl border border-primary/25 bg-gradient-to-r from-primary/10 via-primary/5 to-transparent relative overflow-hidden group/cinemabanner">
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-2xl pointer-events-none group-hover/cinemabanner:bg-primary/20 transition-all duration-300" />
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <h4 className="font-semibold text-base sm:text-lg text-zinc-900 dark:text-white flex items-center gap-2">
                  <span className="flex h-2.5 w-2.5 relative">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-primary"></span>
                  </span>
                  <span>Interactive 3D Cinematic Experience</span>
                </h4>
                <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 font-light max-w-xl">
                  Launch a responsive 3D particle matrix presentation with generative synthesizers displaying my complete software engineering portfolio details.
                </p>
              </div>
              <Link href="/intro" className="shrink-0 max-sm:w-full">
                <button className="w-full relative flex items-center justify-center gap-2 bg-primary hover:bg-primary-hover text-white text-xs font-semibold uppercase tracking-wider py-3 px-6 rounded-xl shadow-md hover:shadow-[0_0_15px_rgba(var(--primary-rgb),0.35)] transition-all duration-300">
                  Launch 3D View &rarr;
                </button>
              </Link>
            </div>
          </div>

          {/* Skillset list */}
          <div className='mt-12 mx-2 max-md:mx-0'>
            <h3 className='text-2xl font-semibold mb-6 text-zinc-900 dark:text-zinc-100 tracking-tight'>My Skillset</h3>
            <div className='flex flex-wrap gap-2.5'>
              {skills.map((skill) => {
                const glowColor = 
                  skill.name === 'Next.js' ? 'rgba(255,255,255,0.45)' :
                  skill.name === 'React' ? 'rgba(14,165,233,0.4)' :
                  skill.name === 'Node.js' ? 'rgba(34,197,94,0.4)' :
                  skill.name === 'TypeScript' ? 'rgba(59,130,246,0.4)' :
                  skill.name === 'JavaScript' ? 'rgba(234,179,8,0.4)' :
                  skill.name === 'MongoDB' ? 'rgba(16,185,129,0.4)' :
                  'rgba(var(--primary-rgb),0.4)';
                return (
                  <div
                    key={skill.name}
                    className={cn(
                      'flex items-center gap-2 px-4 py-1.5 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all duration-300 hover:scale-105 border border-zinc-200/50 dark:border-white/5 shadow-md hover:shadow-[0_0_15px_var(--glow-color)] relative overflow-hidden group/skill',
                      skill.color,
                      skill.darkColor
                    )}
                    style={{
                      '--glow-color': glowColor
                    } as React.CSSProperties}
                  >
                    <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover/skill:translate-x-full transition-transform duration-1000 ease-out" />
                    <skill.icon className="h-4 w-4 shrink-0 transition-transform duration-300 group-hover/skill:rotate-12 relative z-10" />
                    <span className="relative z-10">
                      <code>{skill.name}</code>
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Focus Areas */}
          <div className='mt-16 mx-2 max-md:mx-0'>
            <h3 className='text-2xl font-semibold mb-6 text-zinc-900 dark:text-zinc-100 tracking-tight'>My Focus Areas</h3>
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4'>
              {focusAreas.map((el, i) => (
                <div
                  key={i}
                  className="relative p-[1px] rounded-2xl overflow-hidden bg-zinc-200 dark:bg-zinc-800/80 hover:bg-gradient-to-br hover:from-primary hover:to-primary-hover transition-all duration-300 hover:shadow-[0_10px_30px_rgba(var(--primary-rgb),0.15)] hover:-translate-y-1 group"
                >
                  <div className="h-full w-full rounded-2xl bg-zinc-50 dark:bg-card-bg-3/95 p-5 flex flex-col items-start gap-4 relative overflow-hidden">
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

          {/* Professional Experience */}
          <div className='mt-16 mx-2 max-md:mx-0'>
            <h3 className='text-2xl font-semibold mb-6 text-zinc-900 dark:text-zinc-100 tracking-tight'>Work Experience</h3>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
              {experiences.map((el, i) => (
                <div
                  key={i}
                  className="relative p-[1px] rounded-2xl overflow-hidden bg-zinc-200 dark:bg-zinc-800/80 hover:bg-gradient-to-br hover:from-primary hover:to-primary-hover transition-all duration-300 hover:shadow-[0_10px_30px_rgba(var(--primary-rgb),0.15)] hover:-translate-y-1 group"
                >
                  <div className="h-full w-full rounded-2xl bg-zinc-50 dark:bg-card-bg-3/95 p-6 flex flex-col gap-4 relative overflow-hidden">
                    <div className="absolute top-0 right-0 -mr-12 -mt-12 w-24 h-24 bg-emerald-500/5 rounded-full blur-2xl pointer-events-none group-hover:bg-emerald-500/10 transition-colors duration-300" />
                    <div className="flex items-center gap-3">
                      <div className='flex items-center justify-center p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400'>
                        {React.createElement(el.icon, { className: 'text-2xl shrink-0' })}
                      </div>
                      <div>
                        <h4 className='font-bold text-lg text-zinc-900 dark:text-zinc-100 tracking-tight'>{el.title}</h4>
                        <p className='text-xs text-primary uppercase tracking-wider font-semibold'>At {el.company}</p>
                      </div>
                    </div>
                    <p className='text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed font-light'>{el.description}</p>
                    <div className='text-xs font-semibold px-3 py-1 w-fit rounded-full bg-black/5 dark:bg-white/[0.03] border border-zinc-200 dark:border-white/5 text-zinc-550 dark:text-zinc-450'>
                      {el.dates}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Projects Subsection */}
          <div className='mt-16 mx-2 max-md:mx-0'>
            <h3 className='text-2xl font-semibold mb-6 text-zinc-900 dark:text-zinc-100 tracking-tight'>Featured Projects</h3>
            <div>
              <AllProjects projects={projects.slice(0, 3)} />
            </div>

            <div className="mt-10 flex justify-center max-md:mx-0">
              <Link href="/portfolio/all" className="group/btn relative overflow-hidden rounded-xl">
                <button className="relative group/uibtn flex items-center gap-2 bg-primary hover:bg-primary-hover text-white transition-all font-semibold rounded-xl text-sm py-3 px-8 shadow-lg hover:shadow-[0_0_20px_rgba(var(--primary-rgb),0.45)] hover:scale-[1.02] active:scale-[0.98] duration-300 overflow-hidden">
                  <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover/uibtn:translate-x-full transition-transform duration-1000 ease-out" />
                  <span className="relative z-10 flex items-center gap-2">
                    <span>View All Projects</span>
                    <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover/uibtn:translate-x-1" />
                  </span>
                </button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Visually stunning layout section separator */}
      <div className="h-[1px] w-full bg-gradient-to-r from-transparent via-white/10 to-transparent dark:via-zinc-800" />

      {/* ---------------- SECTION 2: RESUME & SKILLS ---------------- */}
      <section id="resume" className="relative group">
        <div className="px-2 md:px-4 text-neutral-800 dark:text-zinc-300">
          <Heading title="Resume" as="h2" />

          <div className="mx-2 mt-8 max-md:mx-0">
            <div className="flex gap-x-3 items-center justify-start mb-6">
              <BookOpen className="text-primary w-6 h-6 shrink-0" />
              <h3 className='text-2xl font-semibold text-zinc-900 dark:text-zinc-100 tracking-tight'>Education</h3>
            </div>

            <div className="p-1.5 rounded-2xl bg-white/[0.01] border border-white/[0.03] dark:bg-zinc-950/10">
              <EducationList />
            </div>
          </div>


        </div>
      </section>

      {/* Visually stunning layout section separator */}
      <div className="h-[1px] w-full bg-gradient-to-r from-transparent via-white/10 to-transparent dark:via-zinc-800" />

      {/* ---------------- SECTION 2.5: GITHUB ACTIVITY ---------------- */}
      <section id="github" className="relative group">
        <div className="px-2 md:px-4 text-neutral-800 dark:text-neutral-200">
          <GitHubStats />
        </div>
      </section>

      {/* ---------------- SECTION 3.5: LATEST TECHNICAL ARTICLES ---------------- */}
      {recentBlogs.length > 0 && (
        <>
          <div className="h-[1px] w-full bg-gradient-to-r from-transparent via-white/10 to-transparent dark:via-zinc-800" />
          <section id="latest-blogs" className="relative group">
            <div className="px-2 md:px-4 text-neutral-800 dark:text-neutral-200">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6">
                <div>
                  <Heading title="Latest Technical Articles" as="h2" />
                  <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1 font-light">
                    Practical engineering insights, architecture deep-dives, and tutorials.
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

      {/* ---------------- SECTION 4: CONTACT ---------------- */}
      <section id="contact" className="relative group">
        <div className="px-2 md:px-4 text-neutral-800 dark:text-neutral-200">
          <Heading title="Contact" as="h2" />

          <div className="mx-2 mt-6 max-md:mx-0">
            <div className="w-full px-0 py-6 dark:text-gray-100">
              <div className="grid md:grid-cols-5 gap-8 items-start">

                {/* Contact Form Card */}
                <div className="md:col-span-3 bg-zinc-50 dark:bg-card-bg-3/60 border border-zinc-200 dark:border-zinc-800/80 dark:backdrop-blur-xl rounded-2xl p-4 sm:p-8 shadow-sm dark:shadow-2xl relative overflow-hidden transition-all duration-300 hover:border-primary/20 group">
                  <div className="absolute top-0 right-0 -mr-16 -mt-16 w-32 h-32 bg-primary/10 rounded-full blur-3xl pointer-events-none" />

                  <div className="space-y-6 relative z-10">
                    <div>
                      <h3 className="text-2xl font-bold text-zinc-900 dark:text-white tracking-tight">Get in Touch</h3>
                      <p className="text-sm text-zinc-400 mt-1 font-light leading-relaxed">
                        Have a project concept, job opening, or collaboration request? Send a message and let&apos;s discuss details.
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
                      <h3 className="text-2xl font-bold text-zinc-900 dark:text-white tracking-tight">Contact Info</h3>
                      <p className="text-sm text-zinc-400 mt-1 font-light leading-relaxed">
                        Get in touch through my direct channels or find me online.
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
                          <span className="text-[10px] text-zinc-450 dark:text-zinc-555 uppercase font-semibold tracking-wider">Website</span>
                          <Link href="/" className="text-sm font-semibold text-zinc-200 dark:text-primary hover:text-primary hover:underline transition-colors truncate">
                            talhacodes.site
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
                            Bhara Kahu, Islamabad
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

      {/* ---------------- SECTION 5: FOOTER ---------------- */}
      <footer className="w-full mt-12 pt-8 border-t border-zinc-200 dark:border-zinc-800/60 text-center relative overflow-hidden group">
        <div className="absolute inset-0 bg-gradient-to-t from-black/5 to-transparent dark:from-black/20 pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6 px-6 py-6 rounded-2xl bg-zinc-50 dark:bg-black/10 border border-zinc-200 dark:border-zinc-800/50 shadow-sm dark:shadow-none">

          <div className="flex flex-col items-center md:items-start text-center md:text-left gap-1.5">
            <h4 className="text-sm font-bold text-zinc-900 dark:text-zinc-100 tracking-wider uppercase">Talha Codes</h4>
            <p className="text-xs text-zinc-650 dark:text-zinc-400 font-light max-w-sm">
              Building high-performance web systems and software automation with modern coding standards.
            </p>
          </div>

          <div className="flex flex-col items-center md:items-end gap-2.5">
            <div className="flex items-center gap-1.5 text-[10px] text-zinc-500 font-semibold uppercase tracking-widest">
              <span>Built with</span>
              <span className="text-primary font-bold">Next.js</span>
              <span>•</span>
              <span className="text-primary font-bold">Tailwind</span>
              <span>•</span>
              <span className="text-primary font-bold">Prisma</span>
            </div>
            <p className="text-[11px] text-zinc-600 dark:text-zinc-500 font-light">
              © {new Date().getFullYear()} Talha Codes. All rights reserved. • <Link href="/privacy" className="hover:text-primary transition-colors">Privacy Policy</Link>
            </p>
          </div>

        </div>
      </footer>
    </div>
  );
}
