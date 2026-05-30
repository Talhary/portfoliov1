import { IoBookOutline } from "react-icons/io5";
import { FaReact, FaNodeJs, FaPhp, FaDocker } from "react-icons/fa";
import { SiNextdotjs, SiExpress, SiDeno, SiTypescript, SiJavascript, SiMongodb, SiMysql, SiPostgresql, SiUbuntu } from "react-icons/si";
import { Brain } from "lucide-react";
import { Metadata } from 'next';

import { EducationList } from '@/components/education';
import { Heading } from "@/components/heading";

const skills = [
  { name: 'Next.js', value: 80, icon: SiNextdotjs },
  { name: 'React', value: 90, icon: FaReact },
  { name: 'Node.js', value: 99, icon: FaNodeJs },
  { name: 'Express', value: 80, icon: SiExpress },
  { name: 'Deno', value: 70, icon: SiDeno },
  { name: 'TypeScript', value: 85, icon: SiTypescript },
  { name: 'JavaScript', value: 90, icon: SiJavascript },
  { name: 'PHP', value: 80, icon: FaPhp },
  { name: 'MongoDB', value: 80, icon: SiMongodb },
  { name: 'MySQL', value: 75, icon: SiMysql },
  { name: 'PostgreSQL', value: 80, icon: SiPostgresql },
  { name: 'Docker', value: 65, icon: FaDocker },
  { name: 'Ubuntu', value: 70, icon: SiUbuntu },
];

export const metadata: Metadata = {
  title: "Professional Resume & CV | Talha Riaz",
  description: "View the education, skills, technical expertise, and career journey of Muhammad Talha Riaz, a Full Stack Software Engineer specializing in modern JavaScript frameworks and database systems.",
  keywords: [
    "Talha Riaz Resume",
    "Talha Riaz CV",
    "Software Engineer Education",
    "Technical Skills",
    "MERN stack developer resume",
    "Next.js engineer credentials"
  ],
  openGraph: {
    title: "Professional Resume & CV | Talha Riaz",
    description: "View the education, skills, technical expertise, and career journey of Muhammad Talha Riaz.",
    type: "profile",
    url: "https://talhatech.vercel.app/resume",
  }
};

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
            <h2 className="text-2xl font-bold tracking-tight text-white dark:text-zinc-100">Education</h2>
          </div>

          <div className="pl-1">
            <EducationList />
          </div>
        </div>

        {/* Skills Section */}
        <div className="mt-12">
          <div className="flex gap-x-3.5 items-center justify-start mb-8 pl-1">
            <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary border border-primary/20">
              <Brain size={22} className="text-[#e49505]" />
            </div>
            <h2 className="text-2xl font-bold tracking-tight text-white dark:text-zinc-100">My Skills</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {skills.map((el, i) => (
              <div 
                key={i} 
                className="bg-white/5 dark:bg-[#1a1a1c]/60 border border-white/10 dark:border-zinc-800/80 backdrop-blur-xl rounded-2xl p-5 hover:border-[#e49505]/30 hover:shadow-lg hover:shadow-primary/5 transition-all duration-300 relative overflow-hidden group"
              >
                {/* Glowing Effect on Card Hover */}
                <div className="absolute top-0 right-0 -mr-8 -mt-8 w-16 h-16 bg-[#e49505]/5 rounded-full blur-xl pointer-events-none group-hover:bg-[#e49505]/10 transition-colors duration-300" />
                
                <div className="flex items-center justify-between mb-3.5 relative z-10">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="h-9 w-9 rounded-lg bg-white/5 flex items-center justify-center border border-white/10 text-[#e49505] shrink-0">
                      {el.icon && <el.icon className="h-5 w-5" />}
                    </div>
                    <span className="font-semibold text-zinc-100 dark:text-zinc-200 text-sm md:text-base tracking-wide truncate">{el.name}</span>
                  </div>
                  <span className="text-xs md:text-sm font-bold text-[#e49505] shrink-0">{el.value}%</span>
                </div>

                {/* Customized Premium Progress Bar */}
                <div className="w-full h-2 bg-black/10 dark:bg-black/35 border border-white/5 rounded-full overflow-hidden relative z-10">
                  <div 
                    className="h-full bg-[#e49505] rounded-full shadow-[#e49505]/20 shadow-sm transition-all duration-1000 ease-out"
                    style={{ width: `${el.value}%` }}
                  />
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
