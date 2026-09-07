import { IoBookOutline } from "react-icons/io5";
import { Brain } from "lucide-react";
import { Metadata } from 'next';
import { FaReact, FaNodeJs, FaPhp, FaDocker } from "react-icons/fa";
import { SiNextdotjs, SiExpress, SiDeno, SiTypescript, SiJavascript, SiMongodb, SiMysql, SiPostgresql, SiUbuntu } from "react-icons/si";

import { EducationList } from '@/components/education';
import { Heading } from "@/components/heading";

export const metadata: Metadata = {
  title: "Professional Resume & CV | Talha Codes",
  description: "View the education, skills, technical expertise, and career journey of Talha Codes, a Full Stack Software Engineer specializing in modern JavaScript frameworks and database systems.",
  alternates: {
    canonical: "/resume",
  },
  keywords: [
    "Talha Codes Resume",
    "Talha Codes CV",
    "Software Engineer Education",
    "Technical Skills",
    "MERN stack developer resume",
    "Next.js engineer credentials"
  ],
  openGraph: {
    title: "Professional Resume & CV | Talha Codes",
    description: "View the education, skills, technical expertise, and career journey of Talha Codes.",
    type: "profile",
    url: "https://talhacodes.site/resume",
  }
};

const skillCategories = [
  {
    title: 'Languages',
    skills: [
      { name: 'TypeScript', icon: SiTypescript, color: 'bg-blue-100 text-blue-800 border-blue-300', darkColor: 'dark:bg-blue-955 dark:text-blue-300 dark:border-blue-850', glowColor: 'rgba(59,130,246,0.45)' },
      { name: 'JavaScript', icon: SiJavascript, color: 'bg-yellow-100 text-yellow-800 border-yellow-350', darkColor: 'dark:bg-yellow-955 dark:text-yellow-300 dark:border-yellow-850', glowColor: 'rgba(234,179,8,0.4)' },
      { name: 'PHP', icon: FaPhp, color: 'bg-indigo-100 text-indigo-800 border-indigo-300', darkColor: 'dark:bg-indigo-955 dark:text-indigo-300 dark:border-indigo-850', glowColor: 'rgba(120,119,198,0.4)' },
    ]
  },
  {
    title: 'Frontend',
    skills: [
      { name: 'Next.js', icon: SiNextdotjs, color: 'bg-black text-white border-zinc-800', darkColor: 'dark:bg-white dark:text-black dark:border-white', glowColor: 'rgba(255,255,255,0.45)' },
      { name: 'React', icon: FaReact, color: 'bg-sky-100 text-sky-800 border-sky-300', darkColor: 'dark:bg-sky-950 dark:text-sky-300 dark:border-sky-800', glowColor: 'rgba(14,165,233,0.4)' },
    ]
  },
  {
    title: 'Backend',
    skills: [
      { name: 'Node.js', icon: FaNodeJs, color: 'bg-green-100 text-green-800 border-green-300', darkColor: 'dark:bg-green-950 dark:text-green-300 dark:border-green-800', glowColor: 'rgba(34,197,94,0.4)' },
      { name: 'Express', icon: SiExpress, color: 'bg-neutral-100 text-neutral-850 border-neutral-300', darkColor: 'dark:bg-neutral-850 dark:text-neutral-200 dark:border-neutral-700', glowColor: 'rgba(115,115,115,0.4)' },
      { name: 'Deno', icon: SiDeno, color: 'bg-neutral-100 text-neutral-850 border-neutral-300', darkColor: 'dark:bg-neutral-850 dark:text-neutral-200 dark:border-neutral-700', glowColor: 'rgba(115,115,115,0.4)' },
    ]
  },
  {
    title: 'Databases',
    skills: [
      { name: 'MongoDB', icon: SiMongodb, color: 'bg-emerald-100 text-emerald-850 border-emerald-300', darkColor: 'dark:bg-emerald-955 dark:text-emerald-300 dark:border-emerald-800', glowColor: 'rgba(16,185,129,0.4)' },
      { name: 'PostgreSQL', icon: SiPostgresql, color: 'bg-cyan-100 text-cyan-800 border-cyan-300', darkColor: 'dark:bg-cyan-955 dark:text-cyan-300 dark:border-cyan-800', glowColor: 'rgba(6,182,212,0.4)' },
      { name: 'MySQL', icon: SiMysql, color: 'bg-orange-100 text-orange-800 border-orange-300', darkColor: 'dark:bg-orange-955 dark:text-orange-300 dark:border-orange-800', glowColor: 'rgba(var(--primary-rgb),0.4)' },
    ]
  },
  {
    title: 'DevOps & OS',
    skills: [
      { name: 'Docker', icon: FaDocker, color: 'bg-blue-200 text-blue-900 border-blue-300', darkColor: 'dark:bg-blue-900 dark:text-blue-200 dark:border-blue-800', glowColor: 'rgba(29,161,242,0.4)' },
      { name: 'Ubuntu', icon: SiUbuntu, color: 'bg-red-100 text-red-800 border-red-300', darkColor: 'dark:bg-red-955 dark:text-red-300 dark:border-red-800', glowColor: 'rgba(239,68,68,0.4)' },
    ]
  }
];

const Page = () => {
  return (
    <>
      <div className="w-full max-w-6xl mx-auto px-4 py-4 dark:text-gray-100 animate-fadeIn">
        <Heading title="Resume" />

        {/* Education Timeline Section */}
        <div className="mt-12">
          <div className="flex gap-x-3.5 items-center justify-start mb-8 pl-1">
            <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary border border-primary/20">
              <IoBookOutline size={22} />
            </div>
            <h2 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">Education</h2>
          </div>

          <div className="pl-1">
            <EducationList />
          </div>
        </div>

        {/* Skills Section */}
        <div className="mt-12">
          <div className="flex gap-x-3.5 items-center justify-start mb-8 pl-1">
            <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary border border-primary/20">
              <Brain size={22} className="text-primary" />
            </div>
            <h2 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">My Skills</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-4">
            {skillCategories.map((cat, idx) => (
              <div 
                key={idx}
                className="relative p-[1px] rounded-2xl overflow-hidden bg-zinc-200 dark:bg-zinc-800/80 hover:bg-gradient-to-br hover:from-primary hover:to-primary-hover transition-all duration-300 hover:shadow-[0_8px_20px_rgba(var(--primary-rgb),0.08)] group"
              >
                <div className="h-full w-full rounded-2xl bg-white dark:bg-card-bg-3/95 p-5 relative overflow-hidden flex flex-col justify-start gap-4">
                  {/* Category Title */}
                  <h3 className="text-sm font-bold text-primary uppercase tracking-widest pl-0.5">
                    {cat.title}
                  </h3>
                  
                  {/* Category Skills */}
                  <div className="flex flex-wrap gap-2 pt-1">
                    {cat.skills.map((skill) => {
                      const Icon = skill.icon;
                      return (
                        <div
                          key={skill.name}
                          className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all duration-300 hover:scale-105 border border-zinc-200 dark:border-white/5 shadow-md hover:shadow-[0_0_12px_var(--glow-color)] relative overflow-hidden group/skill ${skill.color} ${skill.darkColor}`}
                          style={{
                            '--glow-color': skill.glowColor
                          } as React.CSSProperties}
                        >
                          <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover/skill:translate-x-full transition-transform duration-1000 ease-out" />
                          <Icon className="h-4 w-4 shrink-0 transition-transform duration-300 group-hover/skill:rotate-12 relative z-10" />
                          <span className="relative z-10">{skill.name}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default Page;
