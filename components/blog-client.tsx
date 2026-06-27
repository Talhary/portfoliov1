'use client';

import React, { useState, useEffect, useTransition } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Calendar, Clock, BookOpen, ArrowRight, Search, ChevronLeft, ChevronRight, X } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  description: string;
  imageUrl: string | null;
  createdAt: Date | string;
  tags: string[];
}

interface BlogClientProps {
  initialBlogs: BlogPost[];
  totalPages: number;
  currentPage: number;
  allTags: string[];
  currentSearch: string;
  currentTag: string;
}

export function BlogClient({
  initialBlogs,
  totalPages,
  currentPage,
  allTags,
  currentSearch,
  currentTag,
}: BlogClientProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const [search, setSearch] = useState(currentSearch);

  // Synchronize state when URL query changes
  useEffect(() => {
    setSearch(currentSearch);
  }, [currentSearch]);

  const updateFilters = (newParams: { search?: string; tag?: string; page?: number }) => {
    const params = new URLSearchParams(searchParams.toString());

    if (newParams.search !== undefined) {
      if (newParams.search) {
        params.set('search', newParams.search);
      } else {
        params.delete('search');
      }
      params.set('page', '1'); // Reset to page 1 on search change
    }

    if (newParams.tag !== undefined) {
      if (newParams.tag && newParams.tag !== 'all') {
        params.set('tag', newParams.tag);
      } else {
        params.delete('tag');
      }
      params.set('page', '1'); // Reset to page 1 on tag change
    }

    if (newParams.page !== undefined) {
      params.set('page', newParams.page.toString());
    }

    startTransition(() => {
      router.push(`/blog?${params.toString()}`);
    });
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateFilters({ search });
  };

  const clearSearch = () => {
    setSearch('');
    updateFilters({ search: '' });
  };

  return (
    <div className="w-full flex flex-col gap-10 py-6 pb-20 scroll-smooth">
      {/* ---------------- SECTION 1: HEADER & SEARCH ---------------- */}
      <section id="blog-header" className="relative group px-2 md:px-4">
        <div className="text-neutral-800 dark:text-neutral-200">
          
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mt-6">
            <p className="text-lg leading-relaxed opacity-95 text-zinc-350 dark:text-zinc-300 dark:opacity-85 font-light max-w-2xl">
              Welcome to my tech blog. Here I share insights, tutorials, and deep-dives into modern web development, full-stack architectures, and software engineering practices.
            </p>
            
            {/* Search Input Bar */}
            <form onSubmit={handleSearchSubmit} className="relative w-full md:w-80 shrink-0">
              <input
                type="text"
                placeholder="Search articles..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-10 py-3 rounded-2xl bg-white/5 dark:bg-[#1a1a1c]/60 border border-white/10 dark:border-zinc-800/80 text-white placeholder-zinc-550 text-sm focus:outline-none focus:border-[#e49505] focus:shadow-[0_0_15px_rgba(228,149,5,0.15)] transition-all duration-300"
              />
              <Search className="absolute left-3.5 top-3.5 h-4 w-4 text-zinc-500" />
              {search && (
                <button
                  type="button"
                  onClick={clearSearch}
                  className="absolute right-3 top-3.5 text-zinc-550 hover:text-white transition-colors"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </form>
          </div>
        </div>
      </section>

      {/* Visually stunning layout section separator */}
      <div className="h-[1px] w-full bg-gradient-to-r from-transparent via-white/10 to-transparent dark:via-zinc-800" />

      {/* ---------------- SECTION 2: TAG FILTERS ---------------- */}
      <section className="px-2 md:px-4">
        <div className="flex flex-wrap gap-2.5 items-center">
          <span className="text-xs uppercase font-bold tracking-widest text-zinc-500 mr-2">Tags:</span>
          <button
            onClick={() => updateFilters({ tag: 'all' })}
            className={`px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider transition-all duration-200 ${
              currentTag === 'all' || !currentTag
                ? 'bg-[#e49505] text-white shadow-md shadow-[#e49505]/20 scale-105'
                : 'bg-white/5 dark:bg-[#1a1a1c]/40 border border-white/10 text-zinc-400 hover:text-white hover:bg-white/10'
            }`}
          >
            All Posts
          </button>
          {allTags.map((tag) => (
            <button
              key={tag}
              onClick={() => updateFilters({ tag })}
              className={`px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider transition-all duration-200 ${
                currentTag === tag
                  ? 'bg-[#e49505] text-white shadow-md shadow-[#e49505]/20 scale-105'
                  : 'bg-white/5 dark:bg-[#1a1a1c]/40 border border-white/10 text-zinc-400 hover:text-white hover:bg-white/10'
              }`}
            >
              {tag}
            </button>
          ))}
        </div>
      </section>

      {/* ---------------- SECTION 3: BLOG LIST ---------------- */}
      <section id="blog-posts" className="px-2 md:px-4 min-h-[300px]">
        {isPending ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-[#e49505]"></div>
          </div>
        ) : initialBlogs.length === 0 ? (
          <div className="text-center py-20 space-y-4 bg-white/5 dark:bg-[#1a1a1c]/20 border border-white/5 rounded-2xl">
            <BookOpen className="h-12 w-12 text-zinc-650 mx-auto" />
            <h3 className="text-xl font-bold text-white">No articles found</h3>
            <p className="text-sm text-zinc-450 max-w-sm mx-auto font-light leading-relaxed">
              We couldn&apos;t find any articles matching your search criteria. Try using different keywords or tags.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {initialBlogs.map((post) => {
              const formattedDate = post.createdAt
                ? new Date(post.createdAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })
                : 'Recent';

              return (
                <article
                  key={post.id}
                  className="card flex flex-col justify-between rounded-2xl w-full border border-white/5 bg-white/[0.02] dark:bg-zinc-900/20 backdrop-blur-md transition-all duration-300 hover:-translate-y-1.5 hover:border-[#e49505]/20 hover:shadow-2xl hover:shadow-[#e49505]/5 group overflow-hidden"
                >
                  {/* Blog Image */}
                  {post.imageUrl && (
                    <div className="w-full aspect-[2/1] relative overflow-hidden bg-zinc-900 border-b border-white/5">
                      <img
                        alt={post.title}
                        src={post.imageUrl}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    </div>
                  )}

                  <div className="p-6 flex-grow flex flex-col justify-between">
                    <div className="space-y-4">
                      {/* Meta details */}
                      <div className="flex items-center gap-4 text-xs text-zinc-400 font-medium">
                        <div className="flex items-center gap-1">
                          <Calendar className="h-3.5 w-3.5 text-[#e49505]" />
                          <span>{formattedDate}</span>
                        </div>
                      </div>

                      {/* Title */}
                      <Link href={`/blog/${post.slug}`} className="block group/title">
                        <h3 className="text-xl sm:text-2xl font-bold text-white group-hover/title:text-[#e49505] transition-colors duration-200 tracking-tight leading-snug">
                          {post.title}
                        </h3>
                      </Link>

                      {/* Excerpt */}
                      <p className="text-sm text-zinc-400 leading-relaxed font-light line-clamp-3">
                        {post.description}
                      </p>
                    </div>

                    {/* Tags and Read more */}
                    <div className="mt-6 pt-4 border-t border-white/5 flex items-center justify-between">
                      <div className="flex flex-wrap gap-1.5">
                        {post.tags.slice(0, 3).map((tag) => (
                          <span
                            key={tag}
                            className="text-[9px] text-zinc-500 bg-white/[0.02] dark:bg-black/10 border border-white/5 px-2 py-0.5 rounded font-semibold uppercase tracking-wider"
                          >
                            #{tag.toLowerCase()}
                          </span>
                        ))}
                      </div>

                      <Link
                        href={`/blog/${post.slug}`}
                        className="flex items-center gap-1 text-xs font-bold text-[#e49505] hover:underline shrink-0"
                      >
                        <span>Read Article</span>
                        <ArrowRight className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-1" />
                      </Link>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </section>

      {/* ---------------- SECTION 4: PAGINATION ---------------- */}
      {totalPages > 1 && !isPending && (
        <section className="flex justify-center items-center gap-2 mt-6">
          <button
            onClick={() => updateFilters({ page: currentPage - 1 })}
            disabled={currentPage <= 1}
            className="flex items-center justify-center p-2.5 rounded-xl bg-white/5 dark:bg-[#1a1a1c]/60 border border-white/10 dark:border-zinc-800/80 text-white disabled:opacity-30 disabled:cursor-not-allowed hover:bg-[#e49505]/10 hover:border-[#e49505]/30 transition-all"
            title="Previous Page"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>

          <div className="flex items-center gap-1.5 px-4 text-sm font-semibold text-zinc-400">
            <span>Page</span>
            <span className="text-[#e49505] font-bold">{currentPage}</span>
            <span>of</span>
            <span>{totalPages}</span>
          </div>

          <button
            onClick={() => updateFilters({ page: currentPage + 1 })}
            disabled={currentPage >= totalPages}
            className="flex items-center justify-center p-2.5 rounded-xl bg-white/5 dark:bg-[#1a1a1c]/60 border border-white/10 dark:border-zinc-800/80 text-white disabled:opacity-30 disabled:cursor-not-allowed hover:bg-[#e49505]/10 hover:border-[#e49505]/30 transition-all"
            title="Next Page"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </section>
      )}

      {/* Visually stunning layout section separator */}
      <div className="h-[1px] w-full bg-gradient-to-r from-transparent via-white/10 to-transparent dark:via-zinc-800" />

      {/* Blog Newsletter placeholder section */}
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
            <p className="text-[10px] text-zinc-550">
              No spam. Unsubscribe at any time.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
