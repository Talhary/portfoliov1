'use client';

import React, { useState } from 'react';
import { removeBlogById } from '@/actions/removeBlog';
import { Trash2, Calendar, Tag, CheckCircle2, BookOpen } from 'lucide-react';
import Image from 'next/image';

interface BlogPost {
  id: string;
  title: string;
  description: string;
  imageUrl: string | null;
  tags: string[];
  createdAt: Date | string;
}

const BlogsList = ({ initialItems }: { initialItems: BlogPost[] }) => {
  const [items, setItems] = useState<BlogPost[]>(initialItems);
  const [msg, setMsg] = useState('');

  const handleRemove = async (id: string) => {
    try {
      const data = await removeBlogById(id);
      if (data.status === 200) {
        setItems((prevItems) => prevItems.filter((el) => el.id !== id));
        setMsg('Blog post removed successfully.');
      } else {
        console.error('Something went wrong');
      }
    } catch (error: any) {
      console.error('Error removing blog post:', error);
    }
  };

  if (items.length === 0) {
    return (
      <div className="text-center py-10 text-zinc-500">
        No active blog posts found in the database.
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto px-4 py-8">
      {/* Visual Header Separator */}
      <div className="flex items-center gap-3 pb-2 border-b border-stone-200/50 dark:border-white/5">
        <h3 className="text-xl font-bold text-stone-900 dark:text-white tracking-tight">Active Live Blogs</h3>
        <span className="text-xs bg-[#e49505]/10 border border-[#e49505]/20 text-[#e49505] px-2 py-0.5 rounded-full font-semibold">
          {items.length} Total
        </span>
      </div>

      {msg && (
        <div className="flex items-center gap-2 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-sm w-fit max-w-md animate-fadeIn">
          <CheckCircle2 className="h-4 w-4 shrink-0" />
          <span>{msg}</span>
        </div>
      )}

      {/* Grid Container */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {items.map((item) => (
          <div
            key={item.id}
            className="group rounded-2xl border border-stone-200/50 dark:border-white/5 bg-white bg-opacity-20 dark:bg-zinc-900/30 backdrop-blur-md shadow-xl hover:shadow-2xl overflow-hidden flex flex-col justify-between transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[#e49505]/5 relative"
          >
            {/* Image Header */}
            {item.imageUrl && (
              <div className="w-full aspect-[2/1] relative overflow-hidden bg-black/40">
                <img
                  alt={item.title}
                  src={item.imageUrl}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>
            )}

            {/* Card Body and Controls */}
            <div className="p-5 flex-grow flex flex-col justify-between gap-4">
              <div className="space-y-2">
                <h4 className="text-lg font-bold text-stone-900 dark:text-white tracking-tight leading-snug truncate" title={item.title}>
                  {item.title}
                </h4>
                
                <p className="text-xs text-zinc-400 font-light line-clamp-2">
                  {item.description}
                </p>

                {/* Tags Badges Grid */}
                <div className="flex flex-wrap gap-1.5 pt-2">
                  {item.tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-[9px] font-bold bg-[#e49505]/10 border border-[#e49505]/20 text-[#e49505] uppercase tracking-wider px-2 py-0.5 rounded-full"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Editing & Deletion Controls */}
              <div className="flex gap-2 pt-4 border-t border-stone-200/50 dark:border-white/5 mt-auto">
                <button
                  onClick={() => handleRemove(item.id)}
                  className="w-full flex items-center justify-center gap-1.5 bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 hover:bg-red-500/20 py-2.5 px-3 rounded-xl text-xs font-semibold transition-all"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                  Remove Blog Post
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BlogsList;
