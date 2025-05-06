

import React from 'react';
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
  { title: 'PHP Development', icon: FaPhp, text: 'Developing and maintaining web solutions using PHP, often integrated with modern frontend frameworks.' },
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
    title: 'Full Stack Web Developer',
    company: 'Woltrio',
    icon: Briefcase, 
    dates: `Jan 2025 - Present (${woltrioDuration})`,
    description: 'Developing and maintaining web applications using MERN stack, Next.js, and PHP. Collaborating with teams to deliver high-quality software solutions.'
  },
  {
    title: 'Web Developer Intern',
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
const Page = () => {
 
  return (
    <>
   
      
      <div className='px-2 md:px-4 lg:px-6 pt-5 pb-10 text-neutral-800 dark:text-neutral-200'>
        <Heading title="About Me" />

      
        <AsideImageSection className='md:hidden  my-4  flex flex-col items-center justify-center' />

        <section className='mt-6 mx-2 max-md:mx-0 '>
          <h2 className="text-2xl font-semibold mb-4 text-neutral-100 dark:text-white hidden">Bio</h2>
          <p className='text-lg md:text-xl leading-relaxed tracking-wide opacity-90 text-neutral-100 dark:opacity-80'>
            Hi, I&apos;m <Highlight text="Talha"/>, a passionate <Highlight text='Full Stack' /> Web Developer based in <Highlight text="Islamabad" />. I specialize in building dynamic web applications and bots using a diverse range of technologies. Having completed my Graduation, I thrive on creating efficient, scalable, and user-friendly solutions. Currently contributing my skills at Woltrio and always eager for new challenges and learning opportunities.
          </p>
        </section>

      
        <section className='mt-12 mx-2 max-md:mx-0'>
          <h2 className='text-2xl font-semibold mb-6 text-neutral-100 dark:text-white'>My Skillset</h2>
          <div className='flex flex-wrap gap-3'>
            {skills.map((skill) => (
              <div
                key={skill.name}
             
                className={cn(
                  'flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium transition-transform duration-200 hover:scale-105',
                  skill.color,       
                  skill.darkColor   
                )}
              >
                <skill.icon className="h-4 w-4" />
                <span>
                  <code>
                    {skill.name}
                  </code>
                </span>
              </div>
            ))}
          </div>
        </section>
        <section className='mt-12  mx-2 max-md:mx-0'>
          <h2 className='text-2xl font-semibold mb-6 text-neutral-100 dark:text-white'>My Focus Areas</h2>
  
          <div className='grid grid-cols-3 gap-4 max-lg:grid-cols-2 max-md:gap-y-9 max-sm:grid-cols-1'>
            {focusAreas.map((el, i) => (
              <div
                key={i}
                className='card flex flex-col sm:flex-row items-start gap-4 rounded-2xl w-full max-md:p-3  shadow-md dark:shadow-gray-800 p-6 bg-white dark:bg-neutral-800'
              >
                <div className='flex-shrink-0 max-md:hidden'>
                  {React.createElement(el.icon, { className: 'text-blue-600 dark:text-blue-400 text-3xl sm:text-4xl' })}
                </div>
                <div className='flex-grow space-y-2'>
                  <h2 className='font-semibold text-xl text-white dark:text-primary'>{el.title}</h2>
                  <p className='text-gray-200 dark:text-neutral-300'>{el.text}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

    
        <section className='mx-2 max-md:mx-0 mt-6'>
          <h2 className='text-2xl font-semibold mb-6 text-neutral-100 dark:text-white'>Experience</h2>
     
          <div className='flex flex-wrap justify-start gap-6 mt-4'>
            {experiences.map((el, i) => (
              <div
                key={i}
                className='card flex flex-col sm:flex-row items-start gap-4 rounded-2xl w-full max-md:p-3 sm:w-80 md:w-96 shadow-md dark:shadow-gray-800 p-6 bg-white dark:bg-neutral-800'
              >
                <div className='flex-shrink-0 max-md:hidden'>
                  {React.createElement(el.icon, { className: 'text-green-600 dark:text-green-400 text-3xl sm:text-4xl' })}
                </div>
                <div className='flex-grow space-y-2'>
                  <h2 className='font-semibold text-xl text-white dark:text-primary'>{el.title}</h2>
                  <h3 className=' text-primary dark:text-green-300 text-sm pb-2'>At {el.company}</h3>
                  <p className='text-gray-200 dark:text-neutral-300'>{el.description}</p>
                  <div className='text-primary dark:text-green-300 text-sm pt-3'>
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