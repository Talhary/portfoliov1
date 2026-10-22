"use client";

import { usePathname } from "next/navigation";
import { Navbar } from "@/components/navbar";
import { GetToTopButton } from "@/components/get-to-top";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function LayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isToolPage = pathname.startsWith("/tools");
  const isIntroPage = pathname === "/intro";

  if (isIntroPage) {
    return <>{children}</>;
  }

  if (isToolPage) {
    return (
      <div className="w-full min-h-screen bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 flex flex-col">
        {/* Clean top header for tool page */}
        <header className="w-full sticky top-0 py-3 sm:py-4 px-3.5 sm:px-10 border-b border-zinc-200 dark:border-zinc-800 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md flex items-center justify-between z-50 shadow-sm">
          <div className="flex items-center gap-4">
            <Link 
              href="/" 
              className="h-10 w-10 rounded-xl bg-primary hover:bg-primary-hover flex items-center justify-center text-white font-extrabold text-xl shadow-md hover:scale-105 active:scale-95 transition-all select-none"
              title="Go back to Home"
            >
              T
            </Link>
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-base sm:text-lg tracking-tight text-zinc-900 dark:text-white">
                talha<span className="text-primary font-black">techs</span>
              </span>
            </div>
            <Link 
              href="/portfolio/all" 
              className="flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-zinc-500 hover:text-primary transition-colors group ml-2"
            >
              <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-0.5" />
              <span>Back to Portfolio</span>
            </Link>
          </div>
          <div className="flex items-center gap-6">
            <Link 
              href="/tools" 
              className="text-xs sm:text-sm font-bold text-zinc-700 dark:text-zinc-200 hover:text-primary transition-colors"
            >
              Tools Catalog
            </Link>
            <div className="text-xs text-zinc-400 dark:text-zinc-500 font-light max-sm:hidden">
              talhacodes Tools
            </div>
          </div>
        </header>
        
        {/* Full-width content wrapper for tools */}
        <main className="flex-grow w-full animate-fadeIn">
          {children}
        </main>
      </div>
    );
  }

  // Home page renders full-bleed sections and manages its own containers
  if (pathname === "/") {
    return (
      <div className="min-h-screen w-full flex flex-col bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100">
        <Navbar />
        <main className="flex-1 w-full">
          <GetToTopButton />
          {children}
        </main>
      </div>
    );
  }

  // Company Layout without sidebar
  return (
    <div className="min-h-screen w-full flex flex-col bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100">
      <Navbar />
      <main className="flex-1 w-full max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-6 sm:py-8">
        <div className="bg-zinc-50 dark:bg-big-card border-0 sm:border border-zinc-200 dark:border-zinc-800/70 shadow-none sm:shadow-sm dark:shadow-black/50 relative text-zinc-900 dark:text-zinc-100 rounded-none sm:rounded-2xl p-4 sm:p-7 w-full overflow-hidden">
          <GetToTopButton />
          {children}
        </div>
      </main>
    </div>
  );
}
