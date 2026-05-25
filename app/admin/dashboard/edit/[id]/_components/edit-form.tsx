"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { updateProjectById } from '@/actions/update';
import { UploadDropzone } from "@/lib/utils/uploadthing";
import { Button } from "@/components/ui/button";
import { 
  ArrowLeft, 
  Trash2, 
  Loader2, 
  CheckCircle2, 
  AlertCircle,
  Save,
  ChevronLeft,
  ChevronRight,
  Terminal,
  Globe,
  Github,
  Image as ImageIcon
} from 'lucide-react';
import Link from 'next/link';

export default function EditProjectForm({ project }: { project: any }) {
  const router = useRouter();
  const [title, setTitle] = useState(project.title || '');
  const [description, setDescription] = useState(project.description || '');
  const [type, setType] = useState(project.type || '');
  const [link, setLink] = useState(project.link || '');
  const [githubUrl, setGithubUrl] = useState(project.githubUrl || '');
  const [imageUrl, setImageUrl] = useState<string[]>(project.imageUrl || []);
  
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState('');

  const moveLeft = (index: number) => {
    if (index === 0) return;
    const newImages = [...imageUrl];
    [newImages[index - 1], newImages[index]] = [newImages[index], newImages[index - 1]];
    setImageUrl(newImages);
  };

  const moveRight = (index: number) => {
    if (index === imageUrl.length - 1) return;
    const newImages = [...imageUrl];
    [newImages[index + 1], newImages[index]] = [newImages[index], newImages[index + 1]];
    setImageUrl(newImages);
  };

  const removeImage = (urlToRemove: string) => {
    setImageUrl(imageUrl.filter(url => url !== urlToRemove));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !description || !type || !link || !githubUrl) {
      setMsg('Failed: Please fill in all required fields.');
      return;
    }

    setLoading(true);
    setMsg('');

    try {
      const updateData = {
        title,
        description,
        type,
        link,
        githubUrl,
        imageUrl
      };

      const res = await updateProjectById(project.id, updateData);
      if (res.status === 200) {
        setMsg('Success: Project updated successfully!');
        setTimeout(() => {
          router.push('/admin/dashboard');
          router.refresh();
        }, 1500);
      } else {
        setMsg('Failed to update project.');
        setLoading(false);
      }
    } catch (error) {
      console.error(error);
      setMsg('Failed to update project. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Return Button */}
      <div className="flex justify-between items-center pb-4 border-b border-stone-200/50 dark:border-white/5">
        <Link href="/admin/dashboard">
          <button className="flex items-center gap-1.5 px-4 py-2 rounded-xl border border-stone-300 dark:border-zinc-800 text-stone-700 dark:text-zinc-300 hover:bg-white/5 transition-all text-xs font-semibold">
            <ArrowLeft className="h-3.5 w-3.5" />
            Back to Dashboard
          </button>
        </Link>
        <span className="text-xs bg-[#e49505]/10 border border-[#e49505]/20 text-[#e49505] px-3 py-1 rounded-full font-semibold uppercase tracking-wider">
          Live Editor
        </span>
      </div>

      <form onSubmit={handleSave} className="space-y-6 py-8 px-6 sm:px-8 rounded-2xl border border-stone-200/50 dark:border-white/5 bg-white bg-opacity-20 dark:bg-zinc-900/30 backdrop-blur-md shadow-2xl relative overflow-hidden transition-all hover:shadow-[#e49505]/5 duration-300 text-white">
        
        {/* Top Accent Line */}
        <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-transparent via-[#e49505] to-transparent animate-pulse" />

        {/* Title Field */}
        <div className="space-y-1.5">
          <label className="block text-xs font-semibold uppercase tracking-wider text-stone-600 dark:text-zinc-400" htmlFor="title">
            Project Title
          </label>
          <div className="relative rounded-xl border border-stone-250 dark:border-zinc-800 bg-white/[0.05] dark:bg-black/25 transition-all focus-within:border-[#e49505] focus-within:ring-1 focus-within:ring-[#e49505]">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-stone-400 dark:text-zinc-500">
              <Terminal className="h-4 w-4" />
            </span>
            <input 
              id="title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Next-Gen Portfolio..." 
              className="w-full bg-transparent border-0 shadow-none py-2.5 pl-10 pr-4 text-sm text-stone-900 dark:text-white placeholder-stone-450 dark:placeholder-zinc-650 focus:outline-none rounded-xl"
              required
            />
          </div>
        </div>

        {/* Description Field */}
        <div className="space-y-1.5">
          <label className="block text-xs font-semibold uppercase tracking-wider text-stone-600 dark:text-zinc-400" htmlFor="description">
            Description
          </label>
          <div className="relative rounded-xl border border-stone-250 dark:border-zinc-800 bg-white/[0.05] dark:bg-black/25 transition-all focus-within:border-[#e49505] focus-within:ring-1 focus-within:ring-[#e49505]">
            <textarea 
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              placeholder="Describe the stack, layout features, and context..." 
              className="w-full bg-transparent border-0 shadow-none py-2.5 px-4 text-sm text-stone-900 dark:text-white placeholder-stone-450 dark:placeholder-zinc-650 focus:outline-none rounded-xl resize-y"
              required
            />
          </div>
        </div>

        {/* Categories Field */}
        <div className="space-y-1.5">
          <label className="block text-xs font-semibold uppercase tracking-wider text-stone-600 dark:text-zinc-400" htmlFor="type">
            Categories (separated by |)
          </label>
          <div className="relative rounded-xl border border-stone-250 dark:border-zinc-800 bg-white/[0.05] dark:bg-black/25 transition-all focus-within:border-[#e49505] focus-within:ring-1 focus-within:ring-[#e49505]">
            <input 
              id="type"
              type="text"
              value={type}
              onChange={(e) => setType(e.target.value)}
              placeholder="websites | webapps | frontend" 
              className="w-full bg-transparent border-0 shadow-none py-2.5 px-4 text-sm text-stone-900 dark:text-white placeholder-stone-450 dark:placeholder-zinc-650 focus:outline-none rounded-xl"
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Live Link Field */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold uppercase tracking-wider text-stone-600 dark:text-zinc-400" htmlFor="link">
              Production Live Url
            </label>
            <div className="relative rounded-xl border border-stone-250 dark:border-zinc-800 bg-white/[0.05] dark:bg-black/25 transition-all focus-within:border-[#e49505] focus-within:ring-1 focus-within:ring-[#e49505]">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-stone-400 dark:text-zinc-500">
                <Globe className="h-4 w-4" />
              </span>
              <input 
                id="link"
                type="text"
                value={link}
                onChange={(e) => setLink(e.target.value)}
                placeholder="https://..." 
                className="w-full bg-transparent border-0 shadow-none py-2.5 pl-10 pr-4 text-sm text-stone-900 dark:text-white placeholder-stone-450 dark:placeholder-zinc-650 focus:outline-none rounded-xl"
                required
              />
            </div>
          </div>

          {/* GitHub Repository Field */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold uppercase tracking-wider text-stone-600 dark:text-zinc-400" htmlFor="githubUrl">
              Repository Github Url
            </label>
            <div className="relative rounded-xl border border-stone-250 dark:border-zinc-800 bg-white/[0.05] dark:bg-black/25 transition-all focus-within:border-[#e49505] focus-within:ring-1 focus-within:ring-[#e49505]">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-stone-400 dark:text-zinc-500">
                <Github className="h-4 w-4" />
              </span>
              <input 
                id="githubUrl"
                type="text"
                value={githubUrl}
                onChange={(e) => setGithubUrl(e.target.value)}
                placeholder="https://github.com/..." 
                className="w-full bg-transparent border-0 shadow-none py-2.5 pl-10 pr-4 text-sm text-stone-900 dark:text-white placeholder-stone-450 dark:placeholder-zinc-650 focus:outline-none rounded-xl"
                required
              />
            </div>
          </div>
        </div>

        {/* IMAGE ORDERING AND UPLOAD MANAGER */}
        <div className="space-y-3 pt-4 border-t border-stone-200/50 dark:border-white/5">
          <label className="block text-xs font-semibold uppercase tracking-wider text-stone-600 dark:text-zinc-400 flex items-center gap-1.5">
            <ImageIcon className="h-4 w-4 text-[#e49505]" />
            <span>Manage & Order Screenshots (1st is Main Cover)</span>
          </label>

          {imageUrl.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 w-full">
              {imageUrl.map((url, index) => (
                <div 
                  key={url} 
                  className="group relative aspect-video rounded-xl overflow-hidden border border-stone-250/30 dark:border-zinc-800 bg-black/40 shadow-lg transition-all duration-300"
                >
                  <Image 
                    alt={`Screenshot ${index + 1}`} 
                    src={url} 
                    fill 
                    sizes="(max-width: 768px) 50vw, 33vw"
                    className="object-cover" 
                  />

                  {/* Order Number Badge */}
                  <div className="absolute top-2 left-2 bg-[#e49505] text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-md z-20">
                    {index === 0 ? "Cover (1st)" : `${index + 1}`}
                  </div>

                  {/* Ordering and Control Interface on Hover */}
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex flex-col justify-between p-3 backdrop-blur-[2px] z-10">
                    
                    {/* Top Row: Remove Button */}
                    <div className="flex justify-end">
                      <button 
                        type="button"
                        onClick={() => removeImage(url)}
                        className="bg-red-600 hover:bg-red-700 text-white p-1.5 rounded-full shadow-md transition-all transform hover:scale-105 active:scale-95 flex items-center justify-center"
                        title="Remove Image"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>

                    {/* Bottom Row: Shift Order Buttons */}
                    <div className="flex justify-between items-center w-full gap-2">
                      <button
                        type="button"
                        onClick={() => moveLeft(index)}
                        disabled={index === 0}
                        className="flex-1 bg-white/10 hover:bg-[#e49505] disabled:bg-zinc-800/50 disabled:text-zinc-600 text-white font-semibold py-1.5 rounded-lg text-xs transition-all active:scale-[0.95] flex items-center justify-center gap-0.5 disabled:pointer-events-none"
                        title="Move Left"
                      >
                        <ChevronLeft className="h-4 w-4" />
                        <span>Move Left</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => moveRight(index)}
                        disabled={index === imageUrl.length - 1}
                        className="flex-1 bg-white/10 hover:bg-[#e49505] disabled:bg-zinc-800/50 disabled:text-zinc-650 text-white font-semibold py-1.5 rounded-lg text-xs transition-all active:scale-[0.95] flex items-center justify-center gap-0.5 disabled:pointer-events-none"
                        title="Move Right"
                      >
                        <span>Move Right</span>
                        <ChevronRight className="h-4 w-4" />
                      </button>
                    </div>

                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-xs text-zinc-500 italic py-2">No screenshots uploaded yet.</div>
          )}

          {/* Upload Dropzone */}
          <div className="rounded-xl border border-dashed border-stone-250 dark:border-zinc-800 bg-white/[0.03] dark:bg-black/15 p-4 transition-all hover:bg-white/[0.06] dark:hover:bg-black/25 mt-4">
            <UploadDropzone
              endpoint="imageUploader"
              onClientUploadComplete={(res: any) => {
                if (res && res.length > 0) {
                  const uploadedUrls = res.map((file: any) => file.url).filter(Boolean);
                  setImageUrl([...imageUrl, ...uploadedUrls]);
                }
              }}
              onUploadError={(error: Error) => {
                alert(`Upload Error! ${error.message}`);
              }}
              className="border-0 bg-transparent ut-allowed-content:text-stone-500 dark:ut-allowed-content:text-zinc-500 ut-label:text-stone-700 dark:ut-label:text-zinc-300 ut-button:bg-[#e49505] ut-button:hover:bg-[#c98304] ut-button:text-white ut-button:rounded-xl ut-button:font-semibold rounded-xl p-4 cursor-pointer"
            />
          </div>
        </div>

        {/* Message Feedback Banner */}
        {msg && (
          <div className={`flex items-center gap-2.5 p-4 rounded-xl border text-sm animate-fadeIn ${
            msg.toLowerCase().includes('failed')
              ? 'bg-red-500/10 border-red-500/20 text-red-650 dark:text-red-400'
              : 'bg-emerald-500/10 border-emerald-500/20 text-emerald-650 dark:text-emerald-400'
          }`}>
            {msg.toLowerCase().includes('failed') ? (
              <AlertCircle className="h-5 w-5 shrink-0" />
            ) : (
              <CheckCircle2 className="h-5 w-5 shrink-0" />
            )}
            <span>{msg}</span>
          </div>
        )}

        {/* Submit Save Button */}
        <Button 
          type="submit" 
          disabled={loading} 
          className="w-full flex items-center justify-center bg-[#e49505] hover:bg-[#c98304] disabled:bg-[#e49505]/50 text-white font-semibold py-3.5 px-4 rounded-xl shadow-lg shadow-[#e49505]/10 hover:shadow-[#e49505]/20 transition-all active:scale-[0.98] duration-200 text-base"
        >
          {loading ? (
            <>
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              Saving Changes...
            </>
          ) : (
            <>
              <Save className="mr-2 h-4 w-4" />
              Save Project Changes
            </>
          )}
        </Button>

      </form>
    </div>
  );
}
