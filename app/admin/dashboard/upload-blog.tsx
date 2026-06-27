"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { blogFormSchema } from '@/lib/form-type';
import { AddBlog } from '@/actions/addBlog';
import { useState, useEffect } from 'react';
import UploadButton from './Upload-btn';
import { Terminal, Image as ImageIcon, Loader2, CheckCircle2, AlertCircle, FileText, Tags, Plus } from 'lucide-react';
import MarkdownEditor from '@/components/markdown-editor';

export const BlogForm = () => {
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState('');
  const [imgUrlArray, setImgUrlArray] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');

  const form = useForm<z.infer<typeof blogFormSchema>>({
    resolver: zodResolver(blogFormSchema),
    defaultValues: {
      title: "",
      description: "",
      content: "",
      imageUrl: "",
      tags: [],
    },
  });

  // Handle single image update
  useEffect(() => {
    if (imgUrlArray.length > 0) {
      form.setValue('imageUrl', imgUrlArray[imgUrlArray.length - 1]);
    } else {
      form.setValue('imageUrl', null);
    }
  }, [imgUrlArray, form]);

  // Convert comma separated tags to array
  useEffect(() => {
    const parsedTags = tagInput
      .split(',')
      .map(tag => tag.trim())
      .filter(tag => tag.length > 0);
    form.setValue('tags', parsedTags);
  }, [tagInput, form]);

  async function onSubmit(values: z.infer<typeof blogFormSchema>) {
    setLoading(true);
    setMsg('');
    try {
      const res = await AddBlog({
        title: values.title,
        description: values.description,
        content: values.content,
        imageUrl: values.imageUrl || undefined,
        tags: values.tags,
      });

      if (res.status === 201) {
        setMsg('Blog post added successfully!');
        window.location.reload();
        form.reset();
        setImgUrlArray([]);
        setTagInput('');
      } else {
        setMsg(res.message || 'Failed to add blog post.');
        setLoading(false);
      }
    } catch (e: any) {
      console.error(e);
      setMsg('Failed to add blog post. Please try again.');
      setLoading(false);
    }
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="bg-white/5 dark:bg-[#1a1a1c]/60 border border-white/10 dark:border-zinc-800/80 backdrop-blur-xl rounded-2xl p-6 sm:p-8 shadow-2xl relative overflow-hidden group">
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-32 h-32 bg-primary/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="space-y-6 relative z-10">
          <div>
            <h3 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
              <FileText className="h-6 w-6 text-[#e49505]" />
              Publish Dynamic Blog Post
            </h3>
            <p className="text-sm text-zinc-400 mt-1 font-light leading-relaxed">
              Create and share technical articles, tutorials, and development insights.
            </p>
          </div>
          
          <hr className="border-white/5 dark:border-zinc-800/60 my-4" />

          {msg && (
            <div className={`flex items-center gap-2 p-4 rounded-xl border text-sm ${
              msg.includes('successfully') 
                ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' 
                : 'bg-red-500/10 border-red-500/20 text-red-400'
            }`}>
              {msg.includes('successfully') ? <CheckCircle2 className="h-4 w-4 shrink-0" /> : <AlertCircle className="h-4 w-4 shrink-0" />}
              <span>{msg}</span>
            </div>
          )}

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              
              {/* Title Field */}
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-zinc-300 font-semibold tracking-wide">Article Title</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="e.g. Mastering React State & Animations" 
                        {...field} 
                        className="bg-black/10 dark:bg-black/35 border-white/10 text-white rounded-xl py-3 focus:border-[#e49505] transition-colors"
                      />
                    </FormControl>
                    <FormMessage className="text-red-450" />
                  </FormItem>
                )}
              />

              {/* Description / Excerpt Field */}
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-zinc-300 font-semibold tracking-wide">Description / Excerpt</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="A brief summary shown in the listing card..." 
                        {...field} 
                        className="bg-black/10 dark:bg-black/35 border-white/10 text-white rounded-xl py-3 focus:border-[#e49505] transition-colors"
                      />
                    </FormControl>
                    <FormDescription className="text-[10px] text-zinc-500">
                      Keep this under 180 characters for optimal display in cards.
                    </FormDescription>
                    <FormMessage className="text-red-450" />
                  </FormItem>
                )}
              />

              {/* Tags Field */}
              <FormItem>
                <FormLabel className="text-zinc-300 font-semibold tracking-wide flex items-center gap-1.5">
                  <Tags className="h-4 w-4 text-[#e49505]" />
                  Tags (Comma Separated)
                </FormLabel>
                <FormControl>
                  <Input 
                    placeholder="e.g. Next.js, Performance, Frontend, React" 
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    className="bg-black/10 dark:bg-black/35 border-white/10 text-white rounded-xl py-3 focus:border-[#e49505] transition-colors"
                  />
                </FormControl>
                <FormDescription className="text-[10px] text-zinc-500">
                  Separate tags with commas. E.g. Next.js, React, Backend
                </FormDescription>
              </FormItem>

              {/* Content Markdown Editor */}
              <FormField
                control={form.control}
                name="content"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-zinc-300 font-semibold tracking-wide flex items-center gap-1.5">
                      <Terminal className="h-4 w-4 text-[#e49505]" />
                      Article Body (Markdown Supported)
                    </FormLabel>
                    <FormControl>
                      <MarkdownEditor 
                        id="blog-content-editor"
                        value={field.value} 
                        onChange={field.onChange} 
                        placeholder="Write your detailed tech article using Markdown syntax..." 
                      />
                    </FormControl>
                    <FormMessage className="text-red-450" />
                  </FormItem>
                )}
              />

              {/* Main Banner Image Upload */}
              <FormItem className="space-y-3">
                <FormLabel className="text-zinc-300 font-semibold tracking-wide flex items-center gap-1.5">
                  <ImageIcon className="h-4 w-4 text-[#e49505]" />
                  Cover Image (Upload via Uploadthing)
                </FormLabel>
                <div className="border border-white/5 bg-black/10 dark:bg-black/25 rounded-2xl p-4">
                  <UploadButton setImgUrl={setImgUrlArray} imgUrl={imgUrlArray} />
                </div>
              </FormItem>

              {/* Submit Button */}
              <div className="pt-4">
                <Button 
                  type="submit" 
                  disabled={loading}
                  className="w-full flex items-center justify-center gap-2 bg-[#e49505] hover:bg-[#c98304] text-white font-bold py-3.5 rounded-xl transition-all shadow-lg shadow-[#e49505]/10 hover:shadow-[#e49505]/20 hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span>Publishing...</span>
                    </>
                  ) : (
                    <>
                      <Plus className="h-4 w-4 stroke-[2.5]" />
                      <span>Publish Article</span>
                    </>
                  )}
                </Button>
              </div>

            </form>
          </Form>
        </div>
      </div>
    </div>
  );
};
