'use client';

import React, { useState, useEffect, useTransition } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Calendar, Clock, BookOpen, ArrowRight, Search, ChevronLeft, ChevronRight, X } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
// @ts-ignore
import { animate, stagger } from 'animejs';

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
  const [tagSearch, setTagSearch] = useState('');
  const [showAllTags, setShowAllTags] = useState(false);

  // Synchronize state when URL query changes
  useEffect(() => {
    setSearch(currentSearch);
  }, [currentSearch]);

  const filteredTags = allTags.filter(tag => tag.toLowerCase().includes(tagSearch.toLowerCase()));
  const displayedTags = showAllTags ? filteredTags : filteredTags.slice(0, 12);

  // Stagger animation for tags on search or toggle
  useEffect(() => {
    animate('.tag-item', {
      opacity: [0, 1],
      scale: [0.9, 1],
      delay: stagger(15),
      duration: 250,
      ease: 'easeOutQuad'
    });
  }, [tagSearch, showAllTags]);

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
            <p className="text-lg leading-relaxed opacity-95 text-zinc-700 dark:text-zinc-300 dark:opacity-85 font-light max-w-2xl">
              Welcome to my tech blog. Here I share insights, tutorials, and deep-dives into modern web development, full-stack architectures, and software engineering practices.
            </p>
            
            {/* Search Input Bar */}
            <form onSubmit={handleSearchSubmit} className="relative w-full md:w-80 shrink-0">
              <input
                type="text"
                placeholder="Search articles..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-10 py-3 rounded-2xl bg-zinc-100 dark:bg-card-bg-3/60 border border-zinc-200 dark:border-zinc-800/80 text-zinc-900 dark:text-white placeholder-zinc-500 text-sm focus:outline-none focus:border-primary focus:shadow-[0_0_15px_rgba(var(--primary-rgb),0.15)] transition-all duration-300"
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
      <section className="px-2 md:px-4 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-200 dark:border-zinc-800 pb-3">
          <div className="flex items-center gap-2">
            <span className="text-xs uppercase font-bold tracking-widest text-zinc-500 mr-2">Tags:</span>
            {currentTag && currentTag !== 'all' && (
              <span className="text-xs bg-primary/10 border border-primary/20 text-primary px-2.5 py-0.5 rounded-full font-semibold uppercase tracking-wider">
                Active: {currentTag}
              </span>
            )}
          </div>
          
          {/* Tag Search Input */}
          <div className="relative w-full sm:w-60">
            <input
              type="text"
              placeholder="Search tags..."
              value={tagSearch}
              onChange={(e) => {
                setTagSearch(e.target.value);
                setShowAllTags(true); // Automatically expand when searching
              }}
              className="w-full pl-8 pr-8 py-1.5 rounded-xl bg-zinc-100 dark:bg-card-bg-3/60 border border-zinc-200 dark:border-zinc-800/80 text-zinc-900 dark:text-white placeholder-zinc-500 text-xs focus:outline-none focus:border-primary transition-all duration-300"
            />
            <Search className="absolute left-2.5 top-2 h-3.5 w-3.5 text-zinc-500" />
            {tagSearch && (
              <button
                type="button"
                onClick={() => setTagSearch('')}
                className="absolute right-2.5 top-2 text-zinc-500 hover:text-zinc-800 dark:hover:text-white"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Tags Container */}
        <div className="flex flex-wrap gap-2.5 items-center">
          <button
            onClick={() => updateFilters({ tag: 'all' })}
            className={`px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider transition-all duration-200 ${
              currentTag === 'all' || !currentTag
                ? 'bg-primary text-white shadow-md shadow-primary/20 scale-105'
                : 'bg-zinc-100 dark:bg-card-bg-3/40 border border-zinc-200 dark:border-white/10 text-zinc-650 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-200 dark:hover:bg-white/10'
            }`}
          >
            All Posts
          </button>
          
          {displayedTags.map((tag) => (
            <button
              key={tag}
              onClick={() => updateFilters({ tag })}
              className={`tag-item px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider transition-all duration-200 ${
                currentTag === tag
                  ? 'bg-primary text-white shadow-md shadow-primary/20 scale-105'
                  : 'bg-zinc-100 dark:bg-card-bg-3/40 border border-zinc-200 dark:border-white/10 text-zinc-650 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-200 dark:hover:bg-white/10'
              }`}
            >
              {tag}
            </button>
          ))}

          {/* Show More / Show Less Toggle Button */}
          {filteredTags.length > 12 && !tagSearch && (
            <button
              onClick={() => setShowAllTags(!showAllTags)}
              className="px-4 py-1.5 rounded-full text-xs font-bold text-primary bg-primary/10 border border-primary/20 hover:bg-primary/20 transition-all uppercase tracking-wider"
            >
              {showAllTags ? 'Show Less' : `Show More (+${filteredTags.length - 12})`}
            </button>
          )}

          {/* Empty Search State */}
          {displayedTags.length === 0 && (
            <span className="text-xs text-zinc-500 italic pl-1">No matching tags found.</span>
          )}
        </div>
      </section>

      {/* ---------------- SECTION 3: BLOG LIST ---------------- */}
      <section id="blog-posts" className="px-2 md:px-4 min-h-[300px]">
        {isPending ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-primary"></div>
          </div>
        ) : initialBlogs.length === 0 ? (
          <div className="text-center py-20 space-y-4 bg-zinc-50 dark:bg-card-bg-3/20 border border-zinc-200 dark:border-white/5 rounded-2xl">
            <BookOpen className="h-12 w-12 text-zinc-650 mx-auto" />
            <h3 className="text-xl font-bold text-zinc-900 dark:text-white">No articles found</h3>
            <p className="text-sm text-zinc-500 dark:text-zinc-450 max-w-sm mx-auto font-light leading-relaxed">
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
                <div
                  key={post.id}
                  className="relative p-[1px] rounded-2xl overflow-hidden bg-zinc-200 dark:bg-zinc-800/85 hover:bg-gradient-to-br hover:from-primary hover:to-primary-hover transition-all duration-300 hover:shadow-[0_10px_30px_rgba(var(--primary-rgb),0.12)] hover:-translate-y-1.5 group flex flex-col"
                >
                  <div className="h-full w-full rounded-2xl bg-white dark:bg-card-bg-3/95 overflow-hidden flex flex-col justify-between relative">
                    {/* Blog Image */}
                    {post.imageUrl && (
                      <div className="w-full aspect-[2/1] relative overflow-hidden bg-zinc-100 dark:bg-zinc-900 border-b border-zinc-200 dark:border-white/5">
                        <img
                          alt={post.title}
                          src={post.imageUrl}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                      </div>
                    )}

                    <div className="p-6 flex-grow flex flex-col justify-between relative z-10">
                      <div className="space-y-4">
                        {/* Meta details */}
                        <div className="flex items-center gap-4 text-xs text-zinc-400 dark:text-zinc-505 font-medium">
                          <div className="flex items-center gap-1">
                            <Calendar className="h-3.5 w-3.5 text-primary" />
                            <span>{formattedDate}</span>
                          </div>
                        </div>

                        {/* Title */}
                        <Link href={`/blog/${post.slug}`} className="block group/title">
                          <h3 className="text-xl sm:text-2xl font-bold text-zinc-900 dark:text-white group-hover/title:text-primary transition-colors duration-200 tracking-tight leading-snug">
                            {post.title}
                          </h3>
                        </Link>

                        {/* Excerpt */}
                        <p className="text-sm text-zinc-650 dark:text-zinc-450 leading-relaxed font-light line-clamp-3">
                          {post.description}
                        </p>
                      </div>

                      {/* Tags and Read more */}
                      <div className="mt-6 pt-4 border-t border-zinc-200 dark:border-white/5 flex items-center justify-between">
                        <div className="flex flex-wrap gap-1.5">
                          {post.tags.slice(0, 3).map((tag) => (
                            <span
                              key={tag}
                              className="text-[9px] text-zinc-650 dark:text-zinc-400 bg-zinc-100 dark:bg-black/10 border border-zinc-200/50 dark:border-white/5 px-2 py-0.5 rounded font-semibold uppercase tracking-wider"
                            >
                              #{tag.toLowerCase()}
                            </span>
                          ))}
                        </div>

                        <Link
                          href={`/blog/${post.slug}`}
                          className="flex items-center gap-1 text-xs font-bold text-primary hover:underline shrink-0 group/read"
                        >
                          <span>Read Article</span>
                          <ArrowRight className="h-3.5 w-3.5 transition-transform duration-200 group-hover/read:translate-x-1" />
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
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
            className="flex items-center justify-center p-2.5 rounded-xl bg-zinc-100 dark:bg-card-bg-3/60 border border-zinc-200 dark:border-zinc-800/80 text-zinc-800 dark:text-white disabled:opacity-30 disabled:cursor-not-allowed hover:bg-primary/10 hover:border-primary/30 transition-all"
            title="Previous Page"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>

          <div className="flex items-center gap-1.5 px-4 text-sm font-semibold text-zinc-700 dark:text-zinc-400">
            <span>Page</span>
            <span className="text-primary font-bold">{currentPage}</span>
            <span>of</span>
            <span>{totalPages}</span>
          </div>

          <button
            onClick={() => updateFilters({ page: currentPage + 1 })}
            disabled={currentPage >= totalPages}
            className="flex items-center justify-center p-2.5 rounded-xl bg-zinc-100 dark:bg-card-bg-3/60 border border-zinc-200 dark:border-zinc-800/80 text-zinc-800 dark:text-white disabled:opacity-30 disabled:cursor-not-allowed hover:bg-primary/10 hover:border-primary/30 transition-all"
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
        <div className="bg-zinc-50 dark:bg-card-bg-3/60 border border-zinc-200 dark:border-zinc-800/80 dark:backdrop-blur-xl rounded-2xl p-6 sm:p-8 shadow-sm dark:shadow-2xl relative overflow-hidden transition-all duration-300 hover:border-primary/20 group text-center max-w-2xl mx-auto">
          <div className="absolute top-0 right-0 -mr-16 -mt-16 w-32 h-32 bg-primary/10 rounded-full blur-3xl pointer-events-none" />
          <div className="relative z-10 space-y-4">
            <BookOpen className="h-10 w-10 text-primary mx-auto" />
            <h3 className="text-xl sm:text-2xl font-bold text-zinc-900 dark:text-white tracking-tight">Stay Updated</h3>
            <p className="text-sm text-zinc-400 max-w-md mx-auto font-light leading-relaxed">
              Subscribe to my newsletter to receive the latest updates, articles, and tutorials on modern web development directly in your inbox.
            </p>
            <div className="flex flex-col sm:flex-row gap-2 max-w-md mx-auto pt-2">
              <input
                type="email"
                placeholder="Enter your email address"
                className="flex-1 px-4 py-2.5 rounded-xl bg-zinc-100 dark:bg-black/35 border border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-white placeholder-zinc-500 text-sm focus:outline-none focus:border-primary transition-colors"
                disabled
              />
              <button
                type="button"
                className="bg-primary text-white hover:bg-primary-hover font-semibold text-sm px-6 py-2.5 rounded-xl shadow-lg transition-colors cursor-not-allowed opacity-70"
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
