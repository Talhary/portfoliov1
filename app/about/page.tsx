import React from 'react';
import { Metadata } from 'next';
import { Heading } from '@/components/heading';
import { cn } from '@/lib/utils';
import { FaReact, FaNodeJs, FaDocker, FaBriefcase, FaPhp, FaRobot, FaWindows } from 'react-icons/fa';
import { SiNextdotjs, SiExpress, SiMongodb, SiTypescript, SiJavascript, SiUbuntu, SiPostgresql, SiMysql, SiDeno, SiRust } from 'react-icons/si';
import { Briefcase as BriefcaseIcon, Sparkles, ShieldCheck, Terminal, Layers, ArrowRight, UserCheck } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import FounderAvatar from "@/images/me.png";

const skills = [
  { name: 'Rust', icon: SiRust, color: 'bg-orange-100 text-orange-800', darkColor: 'dark:bg-orange-950 dark:text-orange-300' },
  { name: 'Next.js', icon: SiNextdotjs, color: 'bg-black text-white', darkColor: 'dark:bg-white dark:text-black' },
  { name: 'React', icon: FaReact, color: 'bg-sky-100 text-sky-800', darkColor: 'dark:bg-sky-900 dark:text-sky-300' },
  { name: 'Node.js', icon: FaNodeJs, color: 'bg-green-100 text-green-800', darkColor: 'dark:bg-green-900 dark:text-green-300' },
  { name: 'TypeScript', icon: SiTypescript, color: 'bg-blue-100 text-blue-800', darkColor: 'dark:bg-blue-900 dark:text-blue-300' },
  { name: 'JavaScript', icon: SiJavascript, color: 'bg-yellow-100 text-yellow-800', darkColor: 'dark:bg-yellow-900 dark:text-yellow-300' },
  { name: 'PostgreSQL', icon: SiPostgresql, color: 'bg-cyan-100 text-cyan-800', darkColor: 'dark:bg-cyan-900 dark:text-cyan-300' },
  { name: 'MongoDB', icon: SiMongodb, color: 'bg-emerald-100 text-emerald-800', darkColor: 'dark:bg-emerald-900 dark:text-emerald-300' },
  { name: 'Docker', icon: FaDocker, color: 'bg-blue-200 text-blue-900', darkColor: 'dark:bg-blue-800 dark:text-blue-200' },
  { name: 'Ubuntu', icon: SiUbuntu, color: 'bg-red-100 text-red-800', darkColor: 'dark:bg-red-900 dark:text-red-300' },
  { name: 'Express', icon: SiExpress, color: 'bg-neutral-100 text-neutral-800', darkColor: 'dark:bg-neutral-700 dark:text-neutral-200' },
  { name: 'PHP', icon: FaPhp, color: 'bg-indigo-100 text-indigo-800', darkColor: 'dark:bg-indigo-900 dark:text-indigo-300' },
  { name: 'MySQL', icon: SiMysql, color: 'bg-orange-100 text-orange-800', darkColor: 'dark:bg-orange-900 dark:text-orange-300' },
  { name: 'Deno', icon: SiDeno, color: 'bg-neutral-100 text-neutral-800', darkColor: 'dark:bg-neutral-700 dark:text-neutral-200' },
];

const companyPillars = [
  { 
    title: 'Native Performance & Zero Bloat', 
    icon: SiRust, 
    text: 'We favor native architectures (Tauri & Rust) that run at near-hardware speeds with tiny memory footprints and zero Electron overhead.' 
  },
  { 
    title: 'Scalable Full-Stack Engineering', 
    icon: SiNextdotjs, 
    text: 'Building robust, production-ready web platforms with Next.js, React, Node.js, and modern distributed database engines.' 
  },
  { 
    title: 'Forensic System Observability', 
    icon: ShieldCheck, 
    text: 'Empowering engineers and power users with complete transparency over processes, network sockets, DNS queries, and system storage.' 
  },
  { 
    title: 'Automation & Productivity Tools', 
    icon: Terminal, 
    text: 'Creating custom developer utilities, tunnels, scrapers, and automated bots to eliminate redundant manual engineering workloads.' 
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

const experiences = [
  {
    title: 'Full Stack Software Engineer',
    company: 'Woltrio',
    dates: `Jan 2025 - Present (${woltrioDuration})`,
    description: 'Developing and maintaining production web applications using modern stacks. Collaborating with cross-functional teams to engineer high-throughput APIs, optimize database operations, and craft high-performance client features.'
  },
  {
    title: 'Software Engineer Intern',
    company: 'Swismax Solutions',
    dates: 'Sep 2024 - Nov 2024 (3 mos)',
    description: 'Contributed directly to team workflows, learned industry-grade component architecture, Git collaboration, and wrote clean, maintainable user interfaces.'
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
  title: "About talhatechs | Company Overview & Founder Muhammad Talha",
  description: "Discover talhatechs, our native desktop utilities like Noyare, modern web systems, and the engineering foundation of company founder Muhammad Talha.",
  alternates: {
    canonical: "/about",
  },
  keywords: [
    "About talhatechs",
    "talhatechs company",
    "Muhammad Talha Founder",
    "Noyare Windows",
    "Software Engineer Islamabad",
    "Native Rust Software",
    "Full Stack Next.js Systems"
  ],
  openGraph: {
    title: "About talhatechs | Company Overview & Founder Muhammad Talha",
    description: "Discover talhatechs, our native desktop utilities like Noyare, and company founder Muhammad Talha.",
    type: "website",
    url: "https://talhacodes.site/about",
  }
};

const Page = () => {
  return (
    <div className='px-2 md:px-4 lg:px-6 pt-2 pb-10 text-neutral-800 dark:text-neutral-200 space-y-12'>
      
      {/* SECTION 1: ABOUT TALHATECHS */}
      <section className="space-y-6">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider bg-primary/10 text-primary border border-primary/20">
          <span>talhatechs · Company Overview</span>
        </div>
        <Heading title="Engineering with Microscopic Precision" />

        <div className='mx-2 max-md:mx-0'>
          <p className='text-lg md:text-xl leading-relaxed tracking-wide opacity-90 text-zinc-800 dark:text-zinc-300 dark:opacity-85 font-light'>
            <strong className="font-semibold text-zinc-900 dark:text-white">talhatechs</strong> is a forward-thinking software and systems engineering lab founded by <Highlight text="Muhammad Talha" />. Our mission is to craft digital tools that give engineers and power users absolute visibility, control, and performance over their hardware and cloud infrastructure. From forensic desktop suites like <Highlight text="Noyare" /> on the Microsoft Store to scalable full-stack web applications, we engineer with minimal overhead and maximum reliability.
          </p>
        </div>

        {/* Company Pillars */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 pt-4">
          {companyPillars.map((pillar, i) => (
            <div
              key={i}
              className="p-5 rounded-2xl bg-zinc-50 dark:bg-card-bg-3/95 border border-zinc-200 dark:border-white/5 space-y-3"
            >
              <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                {React.createElement(pillar.icon, { className: 'h-5 w-5' })}
              </div>
              <h3 className="font-bold text-base text-zinc-900 dark:text-white tracking-tight">{pillar.title}</h3>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 font-light leading-relaxed">{pillar.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Visually stunning layout section separator */}
      <div className="h-[1px] w-full bg-gradient-to-r from-transparent via-white/10 to-transparent dark:via-zinc-800" />

      {/* SECTION 2: FOUNDED BY MUHAMMAD TALHA */}
      <section className="space-y-6">
        <div className="flex items-center gap-2">
          <UserCheck className="h-5 w-5 text-primary" />
          <h2 className="text-2xl font-bold text-zinc-900 dark:text-white tracking-tight">
            Founded by Muhammad Talha
          </h2>
        </div>

        <div className="p-6 sm:p-8 rounded-3xl bg-zinc-50 dark:bg-card-bg-3/80 border border-zinc-200 dark:border-white/5 shadow-sm space-y-8">
          <div className="flex flex-col md:flex-row gap-6 items-start">
            <div className="relative w-32 h-32 sm:w-36 sm:h-36 rounded-2xl overflow-hidden bg-primary/10 border-2 border-primary/20 shrink-0">
              <Image 
                src={FounderAvatar} 
                alt="Muhammad Talha" 
                fill 
                className="object-cover object-top"
              />
            </div>
            <div className="space-y-3">
              <div className="space-y-1">
                <h3 className="text-xl sm:text-2xl font-black text-zinc-900 dark:text-white">Muhammad Talha</h3>
                <p className="text-xs text-primary font-bold uppercase tracking-wider">Founder & Lead Systems Engineer · Islamabad, Pakistan</p>
              </div>
              <p className="text-sm sm:text-base text-zinc-700 dark:text-zinc-300 font-light leading-relaxed">
                Hi, I am Talha. I founded talhatechs to bring together my passion for native systems engineering, full-stack web platforms, and automated developer tooling. Having graduated in Computer Science and actively engineering production software at Woltrio, I strive to build transparent, lightning-fast digital products that push the envelope of modern performance.
              </p>
            </div>
          </div>

          {/* Skillset Matrix */}
          <div>
            <h3 className='text-lg font-bold mb-4 text-zinc-900 dark:text-white tracking-tight'>Founder&apos;s Technical Skillset</h3>
            <div className='flex flex-wrap gap-2.5'>
              {skills.map((skill) => (
                <div
                  key={skill.name}
                  className={cn(
                    'flex items-center gap-2 px-4 py-1.5 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all duration-300 hover:scale-105 border border-zinc-200/50 dark:border-white/5 shadow-sm',
                    skill.color,
                    skill.darkColor
                  )}
                >
                  <skill.icon className="h-4 w-4 shrink-0" />
                  <span>{skill.name}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Experience */}
          <div>
            <h3 className='text-lg font-bold mb-4 text-zinc-900 dark:text-white tracking-tight'>Founder&apos;s Engineering Experience</h3>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
              {experiences.map((el, i) => (
                <div
                  key={i}
                  className="p-5 rounded-2xl bg-white dark:bg-card-bg-2 border border-zinc-200 dark:border-white/5 space-y-3"
                >
                  <div className="flex items-center gap-3">
                    <div className='p-2.5 rounded-xl bg-emerald-500/10 text-emerald-500'>
                      <BriefcaseIcon className="h-5 w-5" />
                    </div>
                    <div>
                      <h4 className='font-bold text-base text-zinc-900 dark:text-zinc-100'>{el.title}</h4>
                      <p className='text-xs text-primary font-semibold uppercase tracking-wider'>At {el.company}</p>
                    </div>
                  </div>
                  <p className='text-xs sm:text-sm text-zinc-500 dark:text-neutral-400 font-light leading-relaxed'>{el.description}</p>
                  <span className='inline-block text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-zinc-100 dark:bg-white/5 text-zinc-600 dark:text-zinc-400'>
                    {el.dates}
                  </span>
                </div>
              ))}
            </div>
          </div>

        </div>
      </section>

      {/* Link to Flagship Noyare */}
      <section className="p-6 rounded-2xl bg-gradient-to-r from-primary/10 via-primary/5 to-transparent border border-primary/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h4 className="text-base font-bold text-zinc-900 dark:text-white flex items-center gap-2">
            <FaWindows className="h-4 w-4 text-primary" />
            <span>Discover Our Flagship Desktop App: Noyare</span>
          </h4>
          <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 font-light mt-0.5">
            Forensic system monitor and diagnostic suite built with Tauri & Rust. Available on Microsoft Store.
          </p>
        </div>
        <Link href="/#noyare" className="shrink-0">
          <button className="flex items-center gap-2 bg-primary hover:bg-primary-hover text-white text-xs font-bold uppercase tracking-wider py-2.5 px-5 rounded-xl shadow-md transition-all">
            <span>View Noyare &rarr;</span>
          </button>
        </Link>
      </section>

    </div>
  );
};

export default Page;