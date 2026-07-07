import Image from 'next/image';
import { z } from 'zod';
import { formSchema } from "@/lib/form-type";
import Link from 'next/link';
import { Layers, ExternalLink } from 'lucide-react';
import { ProgressiveImage } from './progressive-image';

export const AllProjects = ({ projects }: { projects: z.infer<typeof formSchema>[] }) => {
  const slugify = (text: string) => text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-6 max-w-7xl mx-auto">
      {projects.map((project: z.infer<typeof formSchema>) => {
        return (
          <div 
            key={project.id} 
            className="group rounded-2xl border border-stone-200 dark:border-white/5 bg-white dark:bg-zinc-900/30 dark:backdrop-blur-md shadow-sm hover:shadow-xl overflow-hidden flex flex-col justify-between transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[#e49505]/5 relative"
          >
            {/* Glowing Top Accent Line on Hover */}
            <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#e49505] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10" />

            {/* Static Project Cover Image (Saves loading overhead and looks extremely premium) */}
            <div className="relative w-full h-48 overflow-hidden rounded-t-2xl bg-zinc-950/20">
              {project.imageUrl && project.imageUrl.length > 0 ? (
                <ProgressiveImage 
                  src={project.imageUrl[0]} 
                  alt={project.title} 
                  fill 
                  sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  objectFit="cover"
                  className="transition-transform duration-500 group-hover:scale-105" 
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-stone-400 dark:text-zinc-500 text-xs font-light">
                  No Preview Available
                </div>
              )}
              {/* Subtle Ambient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-60 pointer-events-none" />
            </div>

            {/* Content Body */}
            <div className="p-5 flex-grow flex flex-col justify-between gap-4">
              <div className="space-y-2">
                <h4 className="text-lg font-bold text-stone-900 dark:text-white group-hover:text-[#e49505] transition-colors tracking-tight leading-snug">
                  {project.title}
                </h4>
                
                {/* Dynamic Category Badges */}
                <div className="flex flex-wrap gap-1.5 pt-0.5">
                  {project.type.split('|').map((el: string) => el.trim()).filter(Boolean).map((tag: string) => (
                    <span 
                      key={tag} 
                      className="text-[9px] font-bold bg-[#e49505]/10 border border-[#e49505]/20 text-[#e49505] uppercase tracking-wider px-2 py-0.5 rounded-full"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                {/* Tech Stack Badges */}
                {project.stack && project.stack.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 pt-1.5">
                    {project.stack.map((tech: string) => (
                      <span 
                        key={tech} 
                        className="text-[9px] font-semibold bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-700 px-2 py-0.5 rounded"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-3 pt-3 border-t border-stone-200/50 dark:border-white/5 mt-auto">
                <Link href={`/portfolio/project/${slugify(project.title)}`} className="flex-1 after:absolute after:inset-0 after:z-10 cursor-pointer">
                  <button className="w-full flex items-center justify-center gap-1.5 border border-stone-350 dark:border-zinc-700 text-stone-700 dark:text-stone-300 hover:bg-[#e49505]/10 hover:text-[#e49505] hover:border-[#e49505]/20 transition-all font-semibold rounded-xl text-xs py-2.5 px-3 relative z-20">
                    <Layers className="h-3.5 w-3.5" />
                    Details
                  </button>
                </Link>
                <a href={project.link} target="_blank" rel="noopener noreferrer" className="flex-1 relative z-20">
                  <button className="w-full flex items-center justify-center gap-1.5 bg-[#e49505] hover:bg-[#c98304] text-white transition-all font-semibold rounded-xl text-xs py-2.5 px-3 shadow-md shadow-[#e49505]/10">
                    <ExternalLink className="h-3.5 w-3.5" />
                    Visit Live
                  </button>
                </a>
              </div>
            </div>

          </div>
        );
      })}
    </div>
  );
};