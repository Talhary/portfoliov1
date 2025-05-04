// src/app/about/page.tsx (or similar path)

import React from 'react';
import { Heading } from '@/components/heading';
// Assuming Navbar is potentially in a layout file, but keeping it if needed here
// import { Navbar } from '@/components/navbar';
import AsideImageSection from '@/components/aside-image-section';
import { cn } from '@/lib/utils'; // Optional: for merging classes

// Import necessary icons
import { FaReact, FaNodeJs, FaDocker, FaDatabase, FaBriefcase, FaPhp, FaRobot } from 'react-icons/fa';
import { SiNextdotjs, SiExpress, SiMongodb, SiTypescript, SiJavascript, SiUbuntu, SiPostgresql, SiMysql, SiDeno, SiMaterialdesign } from 'react-icons/si';
import { Briefcase } from 'lucide-react'; // Or use FaBriefcase

// --- Data ---

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
  { title: 'PHP Development', icon: FaPhp, text: 'Developing and maintaining web solutions using PHP, often integrated with modern frontend frameworks.' },
  { title: 'Bot Development', icon: FaRobot, text: 'Creating automated solutions and bots using various technologies.' }, // Example if you want to add bots
];

// --- Calculate Experience Duration ---
const getCurrentDuration = (startDate: Date): string => {
  const now = new Date(); // Use current date from context if available, otherwise system date
  let years = now.getFullYear() - startDate.getFullYear();
  let months = now.getMonth() - startDate.getMonth();

  if (months < 0) {
    years--;
    months += 12;
  }
  // Only show months if duration is less than a year or if there are remaining months
  const yearStr = years > 0 ? `${years} yr${years > 1 ? 's' : ''}` : '';
  const monthStr = months > 0 || years === 0 ? `${months} mo${months > 1 ? 's' : ''}` : '';

  return [yearStr, monthStr].filter(Boolean).join(' ');
};

const woltrioStartDate = new Date(2025, 0, 1); // Month is 0-indexed (0 = January)
const woltrioDuration = getCurrentDuration(woltrioStartDate);

const experiences = [
  {
    title: 'Full Stack Web Developer',
    company: 'Woltrio',
    icon: Briefcase, // Or FaBriefcase
    dates: `Jan 2025 - Present (${woltrioDuration})`,
    description: 'Developing and maintaining web applications using MERN stack, Next.js, and PHP. Collaborating with teams to deliver high-quality software solutions.'
  },
  {
    title: 'Web Developer Intern',
    company: 'Swismax Solutions',
    icon: Briefcase, // Or FaBriefcase
    dates: 'Sep 2024 - Nov 2024 (3 mos)',
    description: 'Gained practical experience in web development, contributing to projects and learning industry best practices during a 3-month internship.'
  },
];


// --- Component ---

const Page = () => {

  return (
    <>
      {/* Optional: <Navbar /> */}
      {/* Use padding-top for space below navbar/header */}
      <div className='px-2 md:px-4 lg:px-6 pt-5 pb-10 text-neutral-800 dark:text-neutral-200'>
        <Heading title="About Me" />

        {/* Responsive Image - Shown on Mobile */}
        <AsideImageSection className='md:hidden my-4 flex flex-col items-start justify-center' />

        {/* --- Introduction --- */}
        <section className='mt-6 mx-2'>
          <h2 className="text-2xl font-semibold mb-4 text-neutral-100 dark:text-white">Bio</h2>
          <p className='text-lg md:text-xl leading-relaxed tracking-wide opacity-90 text-neutral-100 dark:opacity-80'>
            Hi, I&apos;m Talha, a passionate Full Stack Web Developer based in Islamabad. I specialize in building dynamic web applications and bots using a diverse range of technologies. Having completed my Graduation, I thrive on creating efficient, scalable, and user-friendly solutions. Currently contributing my skills at Woltrio and always eager for new challenges and learning opportunities.
          </p>
        </section>

        {/* --- Skills --- */}
        <section className='mt-12 mx-2'>
          <h2 className='text-2xl font-semibold mb-6 text-neutral-100 dark:text-white'>My Skillset</h2>
          <div className='flex flex-wrap gap-3'>
            {skills.map((skill) => (
              <div
                key={skill.name}
                // Colorful light theme, consistent dark theme
                className={cn(
                  'flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium transition-transform duration-200 hover:scale-105',
                  skill.color,        // Light theme color classes
                  skill.darkColor    // Dark theme color classes (will override light ones in dark mode)
                )}
              >
                <skill.icon className="h-4 w-4" />
                <span>{skill.name}</span>
              </div>
            ))}
          </div>
        </section>

        <section className='mt-12 mx-2'>
          <h2 className='text-2xl font-semibold mb-2 text-neutral-100 dark:text-white'>My Focus Areas</h2>
          {/* Structure from the user's snippet */}
          <div className='flex flex-wrap mt-4'>
            {focusAreas.map((el, i) => (
              <div
                key={i} // Using index as key per the snippet
                // Applying classes directly from the snippet, with minor fixes/adjustments
                className='card max-md:gap-y-2 max-sm:flex-col flex flex-row gap-x-4 rounded-2xl m-3 max-sm:m-2 max-w-md shadow-md dark:shadow-gray-800 p-4 px-7 max-sm:px-3 max-sm:py-4 bg-white dark:bg-neutral-800'
              // Added bg-white dark:bg-neutral-800 for explicit background
              // Changed shadow-black to shadow-md for light theme
              >
                <div className='flex items-start my-2 text-center max-sm:items-center '>
                  {/* Using SiMaterialdesign and adjusting text-primary */}
                  {<el.icon className='text-blue-600 dark:text-blue-400 max-sm:size-9' size={30}/>}
                </div>
                {/* Fixed space-y- typo */}
                <div className='space-y-1'>
                  {/* Fixed `text-xl r` typo and applying theme text colors */}
                  <h2 className='font-semibold text-xl text-neutral-100 dark:text-white'>{el.title}</h2>
                  {/* Applying theme text colors */}
                  <p className='text-neutral-300 dark:text-neutral-300'>{el.text}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* --- Experience (Using the requested structure) --- */}
        <section className='mt-12 mx-2'>
          <h2 className='text-2xl font-semibold mb-2 text-neutral-100 dark:text-white'>Experience</h2>
          {/* Structure from the user's snippet */}
          <div className='flex flex-wrap mt-4'>
            {experiences.map((el, i) => (
              <div
                key={i} // Using index as key per the snippet
                // Applying classes directly from the snippet, with minor fixes/adjustments
                className='card max-md:gap-y-2  max-sm:flex-col flex flex-row gap-x-4 rounded-2xl m-3 max-sm:m-2 max-w-md shadow-md dark:shadow-gray-800 p-4 py-5 px-7 max-sm:px-3 max-sm:py-4 bg-white dark:bg-neutral-800'
              // Added bg-white dark:bg-neutral-800 for explicit background
              // Changed shadow-black to shadow-md for light theme
              >
                <div className='flex items-start my-2 text-center max-sm:items-center '>
                  {/* Using SiMaterialdesign and adjusting text-primary */}
                  {<el.icon className='text-green-600 dark:text-green-400 max-sm:size-9'/>}
                </div>
                {/* Fixed space-y- typo */}
                <div className='space-y-1'>
                  {/* Fixed `text-xl r` typo and applying theme text colors */}
                  <h2 className='font-semibold text-xl text-neutral-100 dark:text-white'>{el.title}</h2>
                  <h3 className='text-gray-300 pt-0 pb-3'>At {el.company}</h3>

                  {/* Applying theme text colors */}
                  <p className='text-neutral-300 dark:text-neutral-300'>{el.description}</p>
                  <div className='text-gray-400 pt-4'>
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