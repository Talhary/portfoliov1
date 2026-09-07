

import React from 'react';
import { Metadata } from 'next';
import { Heading } from '@/components/heading';


import AsideImageSection from '@/components/aside-image-section';
import { cn } from '@/lib/utils';


import { FaReact, FaNodeJs, FaDocker, FaDatabase, FaBriefcase, FaPhp, FaRobot } from 'react-icons/fa';
import { SiNextdotjs, SiExpress, SiMongodb, SiTypescript, SiJavascript, SiUbuntu, SiPostgresql, SiMysql, SiDeno, SiMaterialdesign } from 'react-icons/si';
import { Briefcase } from 'lucide-react';



const skills = [
  { name: 'Next.js', icon: SiNextdotjs, color: 'bg-black text-white', darkColor: 'dark:bg-white dark:text-black' }, // Special case for Next.js logo
  { name: 'React', icon: FaReact, color: 'bg-sky-100 text-sky-800', darkColor: 'dark:bg-sky-900 dark:text-sky-300' },
  { name: 'Node.js', icon: FaNodeJs, color: 'bg-green-100 text-green-800', darkColor: 'dark:bg-green-900 dark:text-green-300' },
  { name: 'Express', icon: SiExpress, color: 'bg-neutral-100 text-neutral-800', darkColor: 'dark:bg-neutral-700 dark:text-neutral-200' },
  { name: 'Deno', icon: SiDeno, color: 'bg-neutral-100 text-neutral-800', darkColor: 'dark:bg-neutral-700 dark:text-neutral-200' },
  { name: 'TypeScript', icon: SiTypescript, color: 'bg-blue-100 text-blue-800', darkColor: 'dark:bg-blue-900 dark:text-blue-300' },
  { name: 'JavaScript', icon: SiJavascript, color: 'bg-yellow-100 text-yellow-800', darkColor: 'dark:bg-yellow-900 dark:text-yellow-300' },
  { name: 'PHP', icon: FaPhp, color: 'bg-indigo-100 text-indigo-800', darkColor: 'dark:bg-indigo-900 dark:text-indigo-300' },
  { name: 'MongoDB', icon: SiMongodb, color: 'bg-emerald-100 text-emerald-800', darkColor: 'dark:bg-emerald-900 dark:text-emerald-300' },
  { name: 'MySQL', icon: SiMysql, color: 'bg-orange-100 text-orange-800', darkColor: 'dark:bg-orange-900 dark:text-orange-300' },
  { name: 'PostgreSQL', icon: SiPostgresql, color: 'bg-cyan-100 text-cyan-800', darkColor: 'dark:bg-cyan-900 dark:text-cyan-300' },
  { name: 'Docker', icon: FaDocker, color: 'bg-blue-200 text-blue-900', darkColor: 'dark:bg-blue-800 dark:text-blue-200' },
  { name: 'Ubuntu', icon: SiUbuntu, color: 'bg-red-100 text-red-800', darkColor: 'dark:bg-red-900 dark:text-red-300' },
];

const focusAreas = [
  { title: 'MERN Stack Development', icon: FaReact, text: 'Building robust full-stack applications using MongoDB, Express.js, React, and Node.js.' },
  { title: 'Next.js Applications', icon: SiNextdotjs, text: 'Leveraging Next.js for server-side rendering, static site generation, and full-stack capabilities.' },
  { title: 'Bot Development', icon: FaRobot, text: 'Creating automated solutions and bots using various technologies.' }, // Example if you want to add bots
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
    description: 'Developing and maintaining web applications using MERN stack, Next.js, and PHP. Collaborating with teams to deliver high-quality software solutions.'
  },
  {
    title: 'Software Engineer Intern',
    company: 'Swismax Solutions',
    icon: Briefcase,
    dates: 'Sep 2024 - Nov 2024 (3 mos)',
    description: 'Gained practical experience in web development, contributing to projects and learning industry best practices during a 3-month internship.'
  },
];


// --- Component ---
const Highlight = ({ text }: { text: string }) => {
  return <span className='dark:text-primary dark:font-semibold text-black font-bold'>
    <code>
      {text}
    </code>
  </span>
}
export const metadata: Metadata = {
  title: "About Talha Codes | Full Stack Software Engineer",
  description: "Learn about Talha Codes' software engineering background, skillset, focus areas in full stack MERN, Next.js, PHP, and bot development, and work experience.",
  alternates: {
    canonical: "/about",
  },
  keywords: [
    "About Talha Codes",
    "Talha Codes Skills",
    "Software Engineer Islamabad",
    "MERN Stack Developer",
    "Full Stack Resume"
  ],
  openGraph: {
    title: "About Talha Codes | Full Stack Software Engineer",
    description: "Learn about Talha Codes' software engineering background, skillset, focus areas, and experience.",
    type: "profile",
    url: "https://talhacodes.site/about",
  }
};

const Page = () => {

  return (
    <>


      <div className='px-2 md:px-4 lg:px-6 pt-5 pb-10 text-neutral-800 dark:text-neutral-200'>
        <Heading title="About Me" />


        <AsideImageSection className='md:hidden  my-4  flex flex-col items-center justify-center' />

        <section className='mt-6 mx-2 max-md:mx-0 '>
          <h2 className="text-2xl font-semibold mb-4 text-zinc-900 dark:text-white hidden">Bio</h2>
          <p className='text-lg md:text-xl leading-relaxed tracking-wide opacity-90 text-zinc-800 dark:text-zinc-300 dark:opacity-80'>
            Hi, I&apos;m <Highlight text="Talha" />, a passionate <Highlight text='Full Stack' /> Software Engineer based in <Highlight text="Islamabad" />. I specialize in building dynamic web applications and bots using a diverse range of technologies. Having completed my Graduation, I thrive on creating efficient, scalable, and user-friendly solutions. Currently contributing my skills at Woltrio and always eager for new challenges and learning opportunities.
          </p>
        </section>


        <section className='mt-12 mx-2 max-md:mx-0'>
          <h2 className='text-2xl font-semibold mb-6 text-zinc-900 dark:text-white'>My Skillset</h2>
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
                    <code>
                      {skill.name}
                    </code>
                  </span>
                </div>
              );
            })}
          </div>
        </section>
        <section className='mt-12 mx-2 max-md:mx-0'>
          <h2 className='text-2xl font-semibold mb-6 text-zinc-900 dark:text-white'>My Focus Areas</h2>

          <div className='grid grid-cols-3 gap-4 max-lg:grid-cols-2 max-md:gap-y-9 max-sm:grid-cols-1'>
            {focusAreas.map((el, i) => (
              <div
                key={i}
                className="relative p-[1px] rounded-2xl overflow-hidden bg-zinc-200 dark:bg-zinc-800/80 hover:bg-gradient-to-br hover:from-primary hover:to-primary-hover transition-all duration-300 hover:shadow-[0_10px_30px_rgba(var(--primary-rgb),0.15)] group"
              >
                <div className="h-full w-full rounded-2xl bg-zinc-50 dark:bg-card-bg-3/95 p-6 flex flex-col sm:flex-row items-start gap-4 relative overflow-hidden">
                  <div className="absolute top-0 right-0 -mr-8 -mt-8 w-16 h-16 bg-primary/5 rounded-full blur-xl pointer-events-none group-hover:bg-primary/10 transition-colors duration-300" />
                  <div className='flex-shrink-0 max-md:hidden'>
                    {React.createElement(el.icon, { className: 'text-primary text-3xl sm:text-4xl' })}
                  </div>
                  <div className='flex-grow space-y-2 relative z-10'>
                    <h3 className='font-semibold text-xl text-zinc-900 dark:text-primary'>{el.title}</h3>
                    <p className='text-zinc-550 dark:text-neutral-350'>{el.text}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>


        <section className='mx-2 max-md:mx-0 mt-12'>
          <h2 className='text-2xl font-semibold mb-6 text-zinc-900 dark:text-white'>Experience</h2>

          <div className='grid grid-cols-1 md:grid-cols-2 gap-6 mt-4'>
            {experiences.map((el, i) => (
              <div
                key={i}
                className="relative p-[1px] rounded-2xl overflow-hidden bg-zinc-200 dark:bg-zinc-800/80 hover:bg-gradient-to-br hover:from-primary hover:to-primary-hover transition-all duration-300 hover:shadow-[0_10px_30px_rgba(var(--primary-rgb),0.15)] group"
              >
                <div className="h-full w-full rounded-2xl bg-zinc-50 dark:bg-card-bg-3/95 p-6 flex flex-col gap-4 relative overflow-hidden">
                  <div className="absolute top-0 right-0 -mr-12 -mt-12 w-24 h-24 bg-emerald-500/5 rounded-full blur-2xl pointer-events-none group-hover:bg-emerald-500/10 transition-colors duration-300" />
                  <div className="flex items-center gap-3">
                    <div className='flex items-center justify-center p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-450'>
                      {React.createElement(el.icon, { className: 'text-2xl shrink-0' })}
                    </div>
                    <div>
                      <h3 className='font-bold text-lg text-zinc-900 dark:text-zinc-100 tracking-tight'>{el.title}</h3>
                      <h3 className='text-xs text-primary uppercase tracking-wider font-semibold'>At {el.company}</h3>
                    </div>
                  </div>
                  <p className='text-sm text-zinc-500 dark:text-neutral-450 leading-relaxed font-light'>{el.description}</p>
                  <div className='text-xs font-semibold px-3 py-1 w-fit rounded-full bg-black/5 dark:bg-white/[0.03] border border-zinc-200 dark:border-white/5 text-zinc-550 dark:text-zinc-450'>
                    {el.dates}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

      </div>
    </>
  );
};

export default Page;