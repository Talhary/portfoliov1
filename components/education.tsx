import React from 'react';

type EducationItemProps = {
  title: string;
  duration: string;
  description: string;
  isLast: boolean;
};

const EducationItem: React.FC<EducationItemProps> = ({ title, duration, description, isLast }) => (
  <div className="relative pl-8 pb-8 group">
    {/* Timeline Vertical Line Connector */}
    {!isLast && (
      <div className="absolute left-[5px] top-2.5 bottom-0 w-[2px] bg-stone-200 dark:bg-zinc-800 group-hover:bg-[#e49505]/40 transition-colors duration-300" />
    )}
    
    {/* Timeline Dot Indicator */}
    <div className="absolute left-0 top-1.5 h-3 w-3 rounded-full bg-[#e49505] shadow shadow-[#e49505]/50 ring-4 ring-[#e49505]/15 transition-all duration-300 group-hover:scale-125" />

    {/* Degree Description Glass Card */}
    <div className="bg-zinc-50 dark:bg-[#1a1a1c]/60 border border-zinc-200 dark:border-zinc-800/80 dark:backdrop-blur-xl rounded-2xl p-5 hover:border-[#e49505]/30 transition-all duration-300 shadow-sm dark:shadow-xl relative overflow-hidden group-hover:translate-x-1">
      <div className="absolute top-0 right-0 -mr-12 -mt-12 w-24 h-24 bg-[#e49505]/5 rounded-full blur-2xl pointer-events-none group-hover:bg-[#e49505]/10 transition-colors duration-300" />
      
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1.5 relative z-10">
        <h3 className="text-lg font-bold text-stone-900 dark:text-zinc-100 tracking-tight transition-colors duration-300 group-hover:text-[#e49505]">
          {title}
        </h3>
        <span className="inline-flex px-3 py-1.5 rounded-full text-xs font-semibold bg-[#e49505]/10 border border-[#e49505]/20 text-[#e49505] uppercase tracking-wider w-fit">
          {duration}
        </span>
      </div>
      
      {description && (
        <p className="mt-3 text-sm text-stone-500 dark:text-zinc-400 font-light leading-relaxed relative z-10">
          {description}
        </p>
      )}
    </div>
  </div>
);

const educationData = [
  {
    title: 'Quaid-e-Azam University',
    duration: '2020 — 2024',
    description: 'Graduated in Mathematics, equipping me with advanced problem-solving capabilities, logical reasoning, and complex analytical thinking skills.',
  },
  {
    title: 'Fsc Pre-Engineering',
    duration: '2018 — 2020',
    description: 'Completed my higher secondary school certificate specializing in Pre-Engineering, focusing on Physics, Chemistry, and Mathematics.',
  },
  {
    title: 'Matriculation with Science',
    duration: '2016 — 2018',
    description: 'Completed secondary education with high marks, specializing in Computer Sciences and core scientific subjects.',
  },
];

const EducationList: React.FC = () => (
  <div className="relative">
    {educationData.map((item, index) => (
      <EducationItem
        key={index}
        title={item.title}
        duration={item.duration}
        description={item.description}
        isLast={index === educationData.length - 1}
      />
    ))}
  </div>
);

export { EducationList };
