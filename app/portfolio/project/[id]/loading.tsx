import React from 'react';

const Loading = () => {
  return (
    <div className="w-full text-zinc-900 dark:text-zinc-100 flex flex-col gap-6 py-2 animate-pulse">
      {/* Back Button Skeleton */}
      <div className="h-5 w-32 bg-stone-300/10 dark:bg-zinc-800/40 rounded-lg" />

      {/* Main Responsive Grid Layout Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch w-full">
        {/* Left Column - Image Showcase Aspect Ratio Placeholder */}
        <div className="lg:col-span-7 flex flex-col gap-4 w-full h-full">
          <div className="w-full aspect-[16/10] bg-stone-300/10 dark:bg-zinc-800/30 border border-white/5 dark:border-zinc-800/50 rounded-2xl" />
          {/* Thumbnails placeholder */}
          <div className="flex gap-2.5 items-center py-1">
            <div className="w-20 aspect-[16/10] rounded-lg bg-stone-300/10 dark:bg-zinc-800/30 border border-white/5 dark:border-zinc-800/50" />
            <div className="w-20 aspect-[16/10] rounded-lg bg-stone-300/10 dark:bg-zinc-800/30 border border-white/5 dark:border-zinc-800/50" />
            <div className="w-20 aspect-[16/10] rounded-lg bg-stone-300/10 dark:bg-zinc-800/30 border border-white/5 dark:border-zinc-800/50" />
          </div>
        </div>

        {/* Right Column - Premium Sidebar Placeholder */}
        <div className="lg:col-span-5 flex flex-col w-full h-full">
          <div className="bg-stone-300/5 dark:bg-zinc-900/20 border border-white/10 dark:border-zinc-800 p-6 sm:p-8 rounded-2xl flex flex-col justify-between h-full space-y-6">
            <div className="space-y-6">
              {/* Tag Badges */}
              <div className="flex gap-2">
                <div className="h-6 w-16 bg-primary/10 border border-primary/20 rounded-full" />
                <div className="h-6 w-20 bg-primary/10 border border-primary/20 rounded-full" />
              </div>

              {/* Title */}
              <div className="space-y-2">
                <div className="h-9 w-3/4 bg-stone-300/10 dark:bg-zinc-800/40 rounded-xl" />
                <div className="h-9 w-1/2 bg-stone-300/10 dark:bg-zinc-800/40 rounded-xl" />
              </div>

              {/* Separator */}
              <div className="h-[1px] w-full bg-stone-300/10 dark:bg-zinc-800/20" />

              {/* Description */}
              <div className="space-y-3">
                <div className="h-4 w-full bg-stone-300/10 dark:bg-zinc-800/40 rounded-md" />
                <div className="h-4 w-full bg-stone-300/10 dark:bg-zinc-800/40 rounded-md" />
                <div className="h-4 w-5/6 bg-stone-300/10 dark:bg-zinc-800/40 rounded-md" />
                <div className="h-4 w-2/3 bg-stone-300/10 dark:bg-zinc-800/40 rounded-md" />
              </div>
            </div>

            {/* Separator */}
            <div className="h-[1px] w-full bg-stone-300/10 dark:bg-zinc-800/20" />

            {/* Metadata Mini-Cards & CTA buttons */}
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="h-14 bg-stone-300/5 dark:bg-zinc-800/20 border border-white/5 dark:border-zinc-800/50 rounded-xl" />
                <div className="h-14 bg-stone-300/5 dark:bg-zinc-800/20 border border-white/5 dark:border-zinc-800/50 rounded-xl" />
              </div>

              {/* CTA buttons */}
              <div className="flex gap-3 w-full">
                <div className="flex-1 h-12 bg-stone-300/10 dark:bg-zinc-800/40 rounded-xl" />
                <div className="flex-1 h-12 bg-stone-300/10 dark:bg-zinc-800/40 rounded-xl" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Loading;