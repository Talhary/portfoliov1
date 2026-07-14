'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { useState } from 'react';
import { IoFilter } from 'react-icons/io5';

const list = ['All', 'Websites', 'Web Apps', 'Front End', 'Backend'];

type inputType = {
  all?: string | null;
  websites?: string | null;
  webapps?: string | null;
  frontend?: string | null;
  backend?: string | null;
};

export const PortfolioNavbar = ({ filter, items }: { filter: string; items: Array<{ label: string, value: string }> }) => {
  const [open, setOpen] = useState(false);
  
  return (
    <div className="py-3 px-6 shadow-sm border border-stone-200 dark:border-white/5 bg-white dark:bg-zinc-900/30 dark:backdrop-blur-md rounded-2xl inline-block text-stone-900 dark:text-white mb-6 transition-all duration-300">
      <button 
        type="button"
        className="xs:hidden flex flex-row gap-x-2 items-center justify-center font-bold text-primary" 
        onClick={() => setOpen(!open)}
      > 
        <IoFilter size={20} /> 
        <span className="bg-primary/10 border border-primary/20 text-primary px-2 py-0.5 rounded-full font-semibold text-xs uppercase tracking-wider">
          {filter}
        </span> 
      </button>

      <motion.ul
        className={`w-full flex items-center text-sm md:text-base gap-x-6 text-nowrap max-xs:flex-col ${
          open ? 'max-xs:flex max-xs:items-start' : 'max-xs:hidden'
        } max-xs:space-y-3.5 max-xs:mt-3`}
      >
        {items.map((item) => (
          <li 
            key={item.value} 
            className={`tracking-wider font-bold uppercase text-xs transition-colors hover:text-primary ${
              filter === item.value 
                ? 'text-primary' 
                : 'text-stone-600 dark:text-zinc-400'
            }`}
          >
            <Link href={`/portfolio/${item.value}`}>{item.label}</Link>
          </li>
        ))}
      </motion.ul>
    </div>
  );
};
