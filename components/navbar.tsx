'use client'

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import { BiMenu, BiX } from 'react-icons/bi';
import { ModeToggle } from '@/components/theme-button';

const list = ['Home', 'About', 'Resume', 'Portfolio', 'Tools', 'Blog', 'Contact'];
const hrefList = ['/', '/about', '/resume', '/portfolio/all', '/tools', '/blog', '/contact'];

export const Navbar = ({ className }: { className?: string }) => {
  const pathname = usePathname();
  const page = pathname === '/' ? 'home' : (pathname.split('/')[1] || 'about');
  const [nav, setNav] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <header 
      className={`sticky top-0 z-50 w-full transition-all duration-300 ${
        scrolled 
          ? 'bg-white/95 dark:bg-zinc-950/95 backdrop-blur-md shadow-md border-b border-zinc-200/80 dark:border-zinc-800/80' 
          : 'bg-white/80 dark:bg-zinc-950/80 backdrop-blur-sm border-b border-zinc-200/40 dark:border-zinc-800/40'
      } ${className || ''}`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 sm:h-20 flex items-center justify-between gap-4">
        {/* Brand */}
        <Link href="/" className="flex items-center gap-3 group select-none">
          <div className="h-10 w-10 rounded-xl bg-primary hover:bg-primary-hover flex items-center justify-center text-white font-extrabold text-xl shadow-md transition-all group-hover:scale-105 active:scale-95">
            T
          </div>
          <div className="flex items-center gap-2">
            <span className="font-extrabold text-xl sm:text-2xl tracking-tight text-zinc-900 dark:text-white transition-colors group-hover:text-primary">
              talha<span className="text-primary font-black">techs</span>
            </span>
            <span className="hidden sm:inline-flex items-center text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20">
              Founded by Talha
            </span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-1 lg:gap-2">
          {list.map((el, i) => {
            const itemKey = el.toLowerCase();
            const isActive = (itemKey === 'home' && page === 'home') || (itemKey !== 'home' && page === itemKey);
            return (
              <Link
                key={el}
                href={hrefList[i]}
                className={`px-3 py-1.5 rounded-xl text-sm font-semibold transition-all duration-200 ${
                  isActive 
                    ? 'text-primary bg-primary/10 shadow-sm font-bold' 
                    : 'text-zinc-600 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800/60'
                }`}
              >
                {el}
              </Link>
            );
          })}
        </nav>

        {/* Right Action Buttons */}
        <div className="flex items-center gap-2 sm:gap-3">
          <Link 
            href="/#noyare" 
            className="hidden lg:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-primary to-primary-hover text-white text-xs font-bold uppercase tracking-wider shadow-sm hover:shadow-md hover:scale-105 active:scale-95 transition-all"
            title="Explore our flagship Windows app Noyare"
          >
            <span>★ Noyare</span>
          </Link>
          <ModeToggle />
          <button 
            onClick={() => setNav(!nav)} 
            className="md:hidden p-2 rounded-xl text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
            aria-label="Toggle navigation menu"
          >
            {nav ? <BiX size={28} /> : <BiMenu size={28} />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Dropdown */}
      {nav && (
        <div className="md:hidden border-t border-zinc-200 dark:border-zinc-800 bg-white/95 dark:bg-zinc-950/95 backdrop-blur-xl px-4 py-4 space-y-2 animate-fadeIn shadow-lg">
          <div className="flex items-center justify-between pb-2 mb-2 border-b border-zinc-150 dark:border-zinc-850">
            <span className="text-xs font-semibold uppercase tracking-wider text-zinc-500">
              Company Navigation
            </span>
            <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20">
              talhatechs
            </span>
          </div>
          <div className="grid grid-cols-2 gap-2">
            {list.map((el, i) => {
              const itemKey = el.toLowerCase();
              const isActive = (itemKey === 'home' && page === 'home') || (itemKey !== 'home' && page === itemKey);
              return (
                <Link
                  key={el}
                  href={hrefList[i]}
                  onClick={() => setNav(false)}
                  className={`p-2.5 rounded-xl text-sm font-semibold transition-all ${
                    isActive 
                      ? 'text-primary bg-primary/10 font-bold' 
                      : 'text-zinc-700 dark:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800/60'
                  }`}
                >
                  {el}
                </Link>
              );
            })}
          </div>
          <div className="pt-2 border-t border-zinc-150 dark:border-zinc-850">
            <Link 
              href="/#noyare" 
              onClick={() => setNav(false)}
              className="w-full flex items-center justify-center gap-2 p-2.5 rounded-xl bg-primary text-white font-bold text-xs uppercase tracking-wider shadow-sm"
            >
              <span>★ Flagship App: Noyare</span>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};
