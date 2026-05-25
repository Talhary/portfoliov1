'use client';

import React, { useState } from 'react';
import { removeProjectById } from '@/actions/remove';
import { ImageCarousel } from '@/app/admin/dashboard/image-Carosal';
import { z } from 'zod';
import { formSchema } from '@/lib/form-type';
import { Trash2, Edit2, ExternalLink, Code2, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';

const ItemList = ({ initialItems }: { initialItems: any }) => {
  const [items, setItems] = useState<any>(initialItems);
  const [msg, setMsg] = useState('');

  const handleRemove = async (id: any) => {
    try {
      const data = await removeProjectById(id);
      if (data.status === 200) {
        setItems((prevItems: any) => prevItems.filter((el: any) => el?.id !== id));
        setMsg('Project removed successfully.');
      } else {
        console.error('Something went wrong');
      }
    } catch (error: any) {
      console.error('Error removing project:', error);
    }
  };

  if (items.length === 0) {
    return null;
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto px-4 py-8">
      {/* Visual Header Separator */}
      <div className="flex items-center gap-3 pb-2 border-b border-stone-200/50 dark:border-white/5">
        <h3 className="text-xl font-bold text-stone-900 dark:text-white tracking-tight">Active Live Projects</h3>
        <span className="text-xs bg-[#e49505]/10 border border-[#e49505]/20 text-[#e49505] px-2 py-0.5 rounded-full font-semibold">
          {items.length} Total
        </span>
      </div>

      {msg && (
        <div className="flex items-center gap-2 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-650 dark:text-emerald-400 text-sm w-fit max-w-md">
          <CheckCircle2 className="h-4 w-4 shrink-0" />
          <span>{msg}</span>
        </div>
      )}

      {/* Grid Container */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {items.map((item: z.infer<typeof formSchema>) => (
          <div
            key={item.id}
            className="group rounded-2xl border border-stone-200/50 dark:border-white/5 bg-white bg-opacity-20 dark:bg-zinc-900/30 backdrop-blur-md shadow-xl hover:shadow-2xl overflow-hidden flex flex-col justify-between transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[#e49505]/5 relative"
          >
            {/* Image Gallery Header Carousel */}
            <div className="w-full relative overflow-hidden">
              <ImageCarousel images={item.imageUrl} />
            </div>

            {/* Card Body and Controls */}
            <div className="p-5 flex-grow flex flex-col justify-between gap-4">
              <div className="space-y-2">
                <h4 className="text-lg font-bold text-stone-900 dark:text-white tracking-tight leading-snug truncate">
                  {item.title}
                </h4>
                
                {/* Category Badges Grid */}
                <div className="flex flex-wrap gap-1.5 pt-0.5">
                  {item.type.split('|').map((el: any) => (
                    <span
                      key={el}
                      className="text-[9px] font-bold bg-[#e49505]/10 border border-[#e49505]/20 text-[#e49505] uppercase tracking-wider px-2 py-0.5 rounded-full"
                    >
                      {el}
                    </span>
                  ))}
                </div>
              </div>

              {/* Visit Live & Repository Buttons */}
              <div className="flex items-center gap-3 pt-3 border-t border-stone-200/50 dark:border-white/5 mt-auto">
                <a href={item.link} className="flex-1" target="_blank" rel="noopener noreferrer">
                  <button className="w-full flex items-center justify-center gap-1.5 border border-stone-350 dark:border-zinc-700 text-stone-700 dark:text-stone-300 hover:bg-[#e49505]/10 hover:text-[#e49505] hover:border-[#e49505]/20 transition-all font-semibold rounded-xl text-xs py-2 px-3">
                    <ExternalLink className="h-3.5 w-3.5" />
                    Visit
                  </button>
                </a>
                <a href={item.githubUrl} className="flex-1" target="_blank" rel="noopener noreferrer">
                  <button className="w-full flex items-center justify-center gap-1.5 bg-[#e49505] hover:bg-[#c98304] text-white transition-all font-semibold rounded-xl text-xs py-2 px-3 shadow-md shadow-[#e49505]/10">
                    <Code2 className="h-3.5 w-3.5" />
                    Code
                  </button>
                </a>
              </div>

              {/* Editing & Deletion Controls */}
              <div className="flex gap-2 pt-2 border-t border-stone-200/50 dark:border-white/5">
                <Link href={`/admin/dashboard/edit/${item.id}`} className="flex-1">
                  <button
                    className="w-full flex items-center justify-center gap-1.5 bg-amber-500/10 border border-amber-500/20 text-amber-650 dark:text-amber-400 hover:bg-amber-500/20 py-2 px-3 rounded-xl text-xs font-semibold transition-all"
                  >
                    <Edit2 className="h-3.5 w-3.5" />
                    Edit Details
                  </button>
                </Link>
                <button
                  onClick={() => handleRemove(item.id)}
                  className="flex-1 flex items-center justify-center gap-1.5 bg-red-500/10 border border-red-500/20 text-red-650 dark:text-red-450 hover:bg-red-500/20 py-2 px-3 rounded-xl text-xs font-semibold transition-all"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                  Remove
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ItemList;
