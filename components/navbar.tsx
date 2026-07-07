'use client'

type PageStates = {
  about: boolean | null;
  resume: boolean | null;
  "portfolio": boolean | null;
  blog: boolean | null;
  contact: boolean | null;
};
const list = ['Home', 'About', 'Resume', 'Portfolio', 'Blog', 'Contact']
const hrefList = ['/', '/about', '/resume', '/portfolio/all', '/blog', '/contact']

import Link from 'next/link'
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import { BiMenu } from 'react-icons/bi';
import { ModeToggle } from '@/components/theme-button'

export const Navbar = ({ className }: { className?: string }) => {
  const pathname = usePathname();
  const page = pathname === '/' ? 'home' : (pathname.split('/')[1] || 'about')
  const [nav, setNav] = useState(false)
  const [visible, setVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      // If mobile dropdown menu is currently active, keep navbar pinned
      if (nav) return;

      const currentScrollY = window.scrollY;
      
      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        // Scrolling Down & past threshold -> hide
        setVisible(false);
      } else {
        // Scrolling Up -> show
        setVisible(true);
      }
      
      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [lastScrollY, nav]);

  return (
    <>
      <div 
        className={`bg-white dark:bg-card-bg-1 dark:backdrop-blur-xl text-zinc-900 dark:text-white border border-zinc-200 dark:border-zinc-850 shadow-md dark:shadow-black absolute max-md:top-4 max-md:right-4 max-xs:top-1 max-xs:right-1 md:fixed md:top-6 md:right-10 lg:right-12 z-50 rounded-tr-2xl rounded-bl-2xl md:rounded-2xl px-10 max-lg:px-2 h-20 max-lg:h-14 flex flex-col transition-all duration-300 ease-in-out ${
          nav ? 'max-md:w-40' : 'max-md:w-20'
        } ${
          visible 
            ? 'translate-y-0 opacity-100' 
            : 'translate-y-[-160%] opacity-0 pointer-events-none'
        } ${className}`}
      >
        <div className='relative rounded-tr-2xl rounded-bl-2xl md:rounded-2xl h-20 flex flex-col'>
          <button className={`md:hidden p- my-3 text-center rounded-md transition-all dark:bg-card-bg ${nav ? 'text-primary' : ''}`} onClick={() => setNav(!nav)}>
            <BiMenu size={40} className='max-xs:size-8' />
          </button>
          <ul onClick={() => setNav(false)} className={`flex flex-row items-center justify-center text-xl gap-x-10 w-full h-full max-lg:gap-x-10 max-lg:text-xl max-md:flex-col dark:max-md:bg-black max-md:bg-white max-md:text-black max-md:bg-opacity-85 dark:opacity-100 max-md:dark:text-white max-md:opacity-100 max-md:items-start max-md:h-fit max-md:mt-1 ${nav ? 'max-md:scale-1' : 'max-md:scale-0'} transition-all max-md:p-5 max-md:space-y-1 max-md:rounded-xl max-lg:gap-x-4 max-md:text-lg`}>
            {list.map((el, i) => {
              const itemKey = el.toLowerCase();
              const isActive = (itemKey === 'home' && page === 'home') || (itemKey !== 'home' && page === itemKey);
              return (
                <li key={el} className={`tracking-lighter font-semibold ${isActive ? 'text-primary' : ''}`}>
                  <Link href={hrefList[i]}>{el}</Link>
                </li>
              );
            })}
            <li>
              <ModeToggle />
            </li>
          </ul>
        </div>
      </div>
    </>
  );
};
