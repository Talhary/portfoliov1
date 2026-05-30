import React from 'react';
import { Metadata } from 'next';
import { Heading } from '@/components/heading';
import { Calendar, Clock, BookOpen, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export const metadata: Metadata = {
  title: "Tech Blog & Web Development Insights | Talha Riaz",
  description: "Read technical articles on Next.js, React, Node.js, TypeScript, PostgreSQL, and modern software engineering practices. Written by Talha Riaz.",
  keywords: [
    "Tech Blog",
    "Talha Riaz Blog",
    "Web Development Articles",
    "Next.js Tutorials",
    "React Performance",
    "TypeScript Backend",
    "Prisma PostgreSQL",
    "Software Engineering Insights"
  ],
  openGraph: {
    title: "Tech Blog & Web Development Insights | Talha Riaz",
    description: "Read technical articles on Next.js, React, Node.js, TypeScript, PostgreSQL, and modern software engineering practices.",
    type: "website",
    url: "https://talhatech.vercel.app/blog",
  }
};

const blogPosts = [
  {
    id: "nextjs-15-performance",
    title: "Building High-Performance Web Applications with Next.js 15",
    excerpt: "Discover the best practices for leveraging Next.js 15's Server Components, advanced caching strategies, and App Router structure to deliver lightning-fast user experiences with optimized SEO metrics.",
    date: "May 15, 2026",
    readTime: "5 min read",
    category: "Next.js",
    tags: ["Next.js", "Web Perf", "React"]
  },
  {
    id: "prisma-postgresql-design",
    title: "Robust Database Designing with Prisma and PostgreSQL",
    excerpt: "A comprehensive guide to designing type-safe databases, handling complex relations, and optimizing query performance using Prisma ORM with a PostgreSQL database.",
    date: "April 28, 2026",
    readTime: "8 min read",
    category: "Databases",
    tags: ["Prisma", "PostgreSQL", "SQL"]
  },
  {
    id: "deno-vs-nodejs-backend",
    title: "Deno vs Node.js: Selecting the Right Runtime for Backends",
    excerpt: "An in-depth comparison of Deno and Node.js, analyzing performance, security defaults, package management, and TypeScript developer experience in modern backend architectures.",
    date: "April 10, 2026",
    readTime: "6 min read",
    category: "Backend",
    tags: ["Deno", "Node.js", "Backend"]
  },
  {
    id: "react-state-animations",
    title: "Mastering Client-Side State and Animations in React",
    excerpt: "How to effectively combine React state management paradigms with Tailwind CSS and Framer Motion to create smooth, high-fidelity micro-interactions and animations that captivate users.",
    date: "March 24, 2026",
    readTime: "7 min read",
    category: "Frontend",
    tags: ["React", "Framer Motion", "Tailwind"]
  }
];

export default function BlogPage() {
  return (
    <div className="w-full flex flex-col gap-10 py-6 pb-20 scroll-smooth">
      <section id="blog-header" className="relative group">
        <div className="px-2 md:px-4 text-neutral-800 dark:text-neutral-200">
          <Heading title="Blog" />
          
          <div className="mt-6 mx-2 max-md:mx-0">
            <p className="text-lg md:text-xl leading-relaxed tracking-wide opacity-90 text-zinc-300 dark:opacity-85 font-light">
              Welcome to my tech blog. Here I share insights, tutorials, and deep-dives into modern web development, full-stack technologies, database architectures, and best practices in software engineering.
            </p>
          </div>
        </div>
      </section>

      {/* Visually stunning layout section separator */}
      <div className="h-[1px] w-full bg-gradient-to-r from-transparent via-white/10 to-transparent dark:via-zinc-800" />

      {/* Blog Posts Grid */}
      <section id="blog-posts" className="px-2 md:px-4">
        <h2 className="sr-only">Articles List</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-6">
          {blogPosts.map((post) => (
            <article 
              key={post.id}
              className="card flex flex-col justify-between rounded-2xl w-full p-6 shadow-lg border border-white/5 bg-white/[0.02] dark:bg-zinc-900/20 backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:border-[#e49505]/20 group"
            >
              <div className="space-y-4">
                {/* Meta details */}
                <div className="flex items-center gap-4 text-xs text-zinc-400 font-medium">
                  <span className="text-[#e49505] uppercase tracking-wider font-semibold bg-[#e49505]/10 px-2.5 py-0.5 rounded-full">
                    {post.category}
                  </span>
                  <div className="flex items-center gap-1">
                    <Calendar className="h-3.5 w-3.5" />
                    <span>{post.date}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="h-3.5 w-3.5" />
                    <span>{post.readTime}</span>
                  </div>
                </div>

                {/* Title */}
                <h3 className="text-xl sm:text-2xl font-bold text-white group-hover:text-[#e49505] transition-colors duration-200 tracking-tight leading-snug">
                  {post.title}
                </h3>

                {/* Excerpt */}
                <p className="text-sm text-zinc-400 leading-relaxed font-light">
                  {post.excerpt}
                </p>
              </div>

              {/* Tags and Read more */}
              <div className="mt-6 pt-4 border-t border-white/5 flex items-center justify-between">
                <div className="flex gap-2">
                  {post.tags.map((tag) => (
                    <span 
                      key={tag} 
                      className="text-[10px] text-zinc-500 bg-white/[0.02] dark:bg-black/10 border border-white/5 px-2 py-0.5 rounded"
                    >
                      #{tag.toLowerCase()}
                    </span>
                  ))}
                </div>
                
                <span className="flex items-center gap-1 text-xs font-bold text-[#e49505] group-hover:underline">
                  <span>Read Article</span>
                  <ArrowRight className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-1" />
                </span>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* Visually stunning layout section separator */}
      <div className="h-[1px] w-full bg-gradient-to-r from-transparent via-white/10 to-transparent dark:via-zinc-800" />

      {/* Blog Newsletter placeholder section for extra SEO context */}
      <section id="blog-newsletter" className="px-2 md:px-4">
        <div className="bg-white/5 dark:bg-[#1a1a1c]/60 border border-white/10 dark:border-zinc-800/80 backdrop-blur-xl rounded-2xl p-6 sm:p-8 shadow-2xl relative overflow-hidden transition-all duration-300 hover:border-primary/20 group text-center max-w-2xl mx-auto">
          <div className="absolute top-0 right-0 -mr-16 -mt-16 w-32 h-32 bg-primary/10 rounded-full blur-3xl pointer-events-none" />
          <div className="relative z-10 space-y-4">
            <BookOpen className="h-10 w-10 text-[#e49505] mx-auto" />
            <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight">Stay Updated</h3>
            <p className="text-sm text-zinc-400 max-w-md mx-auto font-light leading-relaxed">
              Subscribe to my newsletter to receive the latest updates, articles, and tutorials on modern web development directly in your inbox.
            </p>
            <div className="flex flex-col sm:flex-row gap-2 max-w-md mx-auto pt-2">
              <input 
                type="email" 
                placeholder="Enter your email address" 
                className="flex-1 px-4 py-2.5 rounded-xl bg-black/10 dark:bg-black/35 border border-white/10 text-white placeholder-zinc-500 text-sm focus:outline-none focus:border-[#e49505] transition-colors"
                disabled
              />
              <button 
                type="button"
                className="bg-[#e49505] text-white hover:bg-[#c98304] font-semibold text-sm px-6 py-2.5 rounded-xl shadow-lg transition-colors cursor-not-allowed opacity-70"
                disabled
              >
                Subscribe
              </button>
            </div>
            <p className="text-[10px] text-zinc-500">
              No spam. Unsubscribe at any time.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
