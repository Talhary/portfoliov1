'use client';

import { useState, useMemo } from 'react';
import { TOOL_CATEGORIES, ALL_TOOLS } from '@/lib/tools/registry';
import { ToolCard } from '@/components/tools/ToolCard';
import { FiSearch, FiSliders, FiCpu } from 'react-icons/fi';

export default function ToolsHubPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const filteredTools = useMemo(() => {
    return ALL_TOOLS.filter((tool) => {
      const matchesCategory = selectedCategory === 'all' || tool.category === selectedCategory;
      const matchesSearch =
        tool.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tool.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tool.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchesCategory && matchesSearch;
    });
  }, [searchQuery, selectedCategory]);

  return (
    <div className="w-full min-h-screen py-2 sm:py-10 px-0 sm:px-8 lg:px-16 max-w-[1600px] mx-auto">
      {/* Hero Header */}
      <div className="text-center max-w-3xl mx-auto mb-8 sm:mb-12">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-[11px] sm:text-xs font-bold uppercase tracking-wider mb-3 sm:mb-4">
          <FiSliders size={14} /> Built-in & Server-Side Tools
        </div>
        <h1 className="text-3xl sm:text-5xl font-black text-stone-900 dark:text-white tracking-tight mb-3 sm:mb-4">
          Developer <span className="text-primary">Tools & Utilities</span>
        </h1>
        <p className="text-stone-600 dark:text-zinc-400 text-xs sm:text-lg">
          Complete catalog of 106 high-performance developer tools, conversion utilities, security scanners, and async job-based server microservices.
        </p>
      </div>

      {/* Search & Category Navigation */}
      <div className="space-y-4 sm:space-y-6 mb-8 sm:mb-10">
        {/* Search Bar */}
        <div className="relative max-w-xl mx-auto">
          <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400 dark:text-zinc-500" size={18} />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search all 106 tools (e.g. PDF, DNS, JSON, Base64, OCR)..."
            className="w-full pl-11 pr-4 py-3 bg-white dark:bg-zinc-900/80 border border-stone-200 dark:border-zinc-800 rounded-xl sm:rounded-2xl shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/50 text-stone-900 dark:text-white placeholder:text-stone-400 dark:placeholder:text-zinc-500 transition-all text-xs sm:text-base"
          />
        </div>

        {/* Category Selector Pills */}
        <div className="flex items-center justify-start sm:justify-center gap-2 overflow-x-auto pb-2 scrollbar-none px-1">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-lg sm:rounded-xl text-[11px] sm:text-xs uppercase font-bold tracking-wider transition-all whitespace-nowrap ${
              selectedCategory === 'all'
                ? 'bg-primary text-white shadow-md shadow-primary/20'
                : 'bg-white dark:bg-zinc-900/60 border border-stone-200 dark:border-zinc-800 text-stone-600 dark:text-zinc-400 hover:text-primary'
            }`}
          >
            All Tools ({ALL_TOOLS.length})
          </button>

          {TOOL_CATEGORIES.map((cat) => {
            const count = ALL_TOOLS.filter((t) => t.category === cat.id).length;
            const isSelected = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-lg sm:rounded-xl text-[11px] sm:text-xs uppercase font-bold tracking-wider transition-all whitespace-nowrap ${
                  isSelected
                    ? 'bg-primary text-white shadow-md shadow-primary/20'
                    : 'bg-white dark:bg-zinc-900/60 border border-stone-200 dark:border-zinc-800 text-stone-600 dark:text-zinc-400 hover:text-primary'
                }`}
              >
                {cat.name} ({count})
              </button>
            );
          })}
        </div>
      </div>

      {/* Tools Grid */}
      {filteredTools.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3.5 sm:gap-5">
          {filteredTools.map((tool) => (
            <ToolCard key={tool.id} tool={tool} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-white dark:bg-zinc-900/30 border border-dashed border-stone-300 dark:border-zinc-800 rounded-3xl">
          <p className="text-stone-500 dark:text-zinc-400 text-base font-semibold">
            No tools found matching &quot;{searchQuery}&quot;
          </p>
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedCategory('all');
            }}
            className="mt-3 text-xs font-bold text-primary hover:underline"
          >
            Clear filters
          </button>
        </div>
      )}
    </div>
  );
}
