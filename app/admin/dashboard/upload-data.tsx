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
import {
  MultiSelector,
  MultiSelectorTrigger,
  MultiSelectorInput,
  MultiSelectorContent,
  MultiSelectorList,
  MultiSelectorItem,
} from "@/components/ui/multi-select";
import { Input } from "@/components/ui/input";
import { formSchema } from '@/lib/form-type';
import { AddProject } from '@/actions/addProject';
import { getCategories, addCategory } from '@/actions/categories';
import { useState, useEffect, FormEvent } from 'react';
import UploadButton from './Upload-btn';
import { Terminal, Globe, Github, Image as ImageIcon, Loader2, CheckCircle2, AlertCircle, Sparkles, FolderPlus, Plus } from 'lucide-react';

export const ProfileForm = () => {
  const [options, setOptions] = useState<Array<{ label: string, value: string }>>([
    { label: "Website", value: "websites" },
    { label: "Web App", value: "webapps" },
    { label: "Front End", value: "frontend" },
    { label: "Backend", value: "backend" },
  ]);

  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState('');
  const [imgUrl, setImgUrl] = useState<string[]>([]);
  const [value, setValue] = useState<string[]>([]);

  // Category management states
  const [newCatName, setNewCatName] = useState('');
  const [catLoading, setCatLoading] = useState(false);
  const [catMsg, setCatMsg] = useState('');

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      type: "",
      link: "",
      createdAt: new Date(),
      updatedAt: new Date(),
      imageUrl: [],
      githubUrl: "",
      order: 0,
    },
  });

  const loadCategories = async () => {
    const res = await getCategories();
    if (res.success && res.data.length > 0) {
      setOptions(res.data.map((cat: any) => ({ label: cat.name, value: cat.value })));
    } else if (res.success && res.data.length === 0) {
      // Seed default categories
      const defaults = [
        { name: "Website", value: "websites" },
        { name: "Web App", value: "webapps" },
        { name: "Front End", value: "frontend" },
        { name: "Backend", value: "backend" },
      ];
      for (const cat of defaults) {
        await addCategory(cat.name, cat.value);
      }
      const reFetch = await getCategories();
      if (reFetch.success && reFetch.data.length > 0) {
        setOptions(reFetch.data.map((cat: any) => ({ label: cat.name, value: cat.value })));
      }
    }
  };

  useEffect(() => {
    loadCategories();
  }, []);

  useEffect(() => {
    form.setValue('imageUrl', imgUrl);
  }, [imgUrl, form]);

  useEffect(() => {
    if (value.length === 0) return;
    form.setValue('type', value.join('|'));
  }, [value, form]);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setLoading(true);
    setMsg('');
    try {
      const res = await AddProject(values);
      if (res.status === 201) {
        setMsg('Item Added Successfully!');
        window.location.reload();
        form.reset();
        setImgUrl([]);
        setValue([]);
      } else {
        setMsg('Failed to add Item.');
        setLoading(false);
      }
    } catch (e: any) {
      console.error(e);
      setMsg('Failed to add Item. Please try again.');
      setLoading(false);
    }
  }

  const handleCatSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!newCatName.trim()) return;

    setCatLoading(true);
    setCatMsg('');

    try {
      const res = await addCategory(newCatName, newCatName);
      if (res.success) {
        setCatMsg('Category added!');
        setNewCatName('');
        await loadCategories();
      } else {
        setCatMsg(res.message || 'Failed to add category.');
      }
    } catch (err) {
      setCatMsg('Error adding category.');
    } finally {
      setCatLoading(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-7xl mx-auto px-4 py-8">
      {/* Main Upload Form */}
      <div className="lg:col-span-2">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 py-8 px-8 rounded-2xl border border-stone-200/50 dark:border-white/5 bg-white bg-opacity-20 dark:bg-zinc-900/30 backdrop-blur-md shadow-2xl relative overflow-hidden transition-all hover:shadow-[#e49505]/5 duration-300">
            
            {/* Glowing Top Accent Line */}
            <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-transparent via-[#e49505] to-transparent animate-pulse" />

            <div className="flex items-center gap-3 pb-2 border-b border-stone-200/50 dark:border-white/5">
              <div className="flex items-center justify-center p-2.5 rounded-xl bg-[#e49505]/10 text-[#e49505]">
                <Sparkles className="h-5 w-5 animate-pulse" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-stone-900 dark:text-white tracking-tight">Add New Project</h3>
                <p className="text-xs text-stone-500 dark:text-zinc-400 font-light mt-0.5">Publish a new masterpiece to your live portfolio.</p>
              </div>
            </div>

            {/* Title Input */}
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem className="space-y-1.5">
                  <FormLabel className="text-xs font-semibold uppercase tracking-wider text-stone-600 dark:text-zinc-400">Project Title</FormLabel>
                  <FormControl>
                    <div className="relative rounded-xl border border-stone-250 dark:border-zinc-800 bg-white/[0.05] dark:bg-black/25 transition-all focus-within:border-[#e49505] focus-within:ring-1 focus-within:ring-[#e49505]">
                      <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-stone-400 dark:text-zinc-500">
                        <Terminal className="h-4 w-4" />
                      </span>
                      <Input 
                        placeholder="Enter project name..." 
                        className="w-full bg-transparent border-0 shadow-none py-2.5 pl-10 pr-4 text-sm text-stone-900 dark:text-white placeholder-stone-450 dark:placeholder-zinc-650 focus-visible:ring-0 focus-visible:border-0 rounded-xl"
                        {...field} 
                      />
                    </div>
                  </FormControl>
                  <FormMessage className="text-red-500 text-xs" />
                </FormItem>
              )}
            />

            {/* Description Input */}
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem className="space-y-1.5">
                  <FormLabel className="text-xs font-semibold uppercase tracking-wider text-stone-600 dark:text-zinc-400">Description</FormLabel>
                  <FormControl>
                    <div className="relative rounded-xl border border-stone-250 dark:border-zinc-800 bg-white/[0.05] dark:bg-black/25 transition-all focus-within:border-[#e49505] focus-within:ring-1 focus-within:ring-[#e49505]">
                      <Input 
                        placeholder="Describe the project objective, stack, features, etc..." 
                        className="w-full bg-transparent border-0 shadow-none py-2.5 px-4 text-sm text-stone-900 dark:text-white placeholder-stone-450 dark:placeholder-zinc-650 focus-visible:ring-0 focus-visible:border-0 rounded-xl"
                        {...field} 
                      />
                    </div>
                  </FormControl>
                  <FormMessage className="text-red-500 text-xs" />
                </FormItem>
              )}
            />

            {/* Type Multi-Selector Input */}
            <FormField
              control={form.control}
              name="type"
              render={() => (
                <FormItem className="space-y-1.5">
                  <FormLabel className="text-xs font-semibold uppercase tracking-wider text-stone-600 dark:text-zinc-400">Categories / Tag Types</FormLabel>
                  <FormControl>
                    <MultiSelector values={value} onValuesChange={setValue} loop={false}>
                      <MultiSelectorTrigger className="rounded-xl border border-stone-250 dark:border-zinc-800 bg-white/[0.05] dark:bg-black/25 text-stone-900 dark:text-white focus-within:border-[#e49505] focus-within:ring-1 focus-within:ring-[#e49505] py-2 px-3">
                        <MultiSelectorInput placeholder="Choose tag categories..." className="placeholder-stone-450 dark:placeholder-zinc-650" />
                      </MultiSelectorTrigger>
                      <MultiSelectorContent>
                        <MultiSelectorList className="bg-white dark:bg-zinc-950 border border-stone-200 dark:border-zinc-800 text-stone-900 dark:text-white rounded-xl shadow-2xl p-1.5 space-y-1 z-50">
                          {options.map((option, i) => (
                            <MultiSelectorItem key={i} value={option.value} className="rounded-lg hover:bg-[#e49505]/10 hover:text-[#e49505] cursor-pointer">
                              {option.label}
                            </MultiSelectorItem>
                          ))}
                        </MultiSelectorList>
                      </MultiSelectorContent>
                    </MultiSelector>
                  </FormControl>
                  <FormMessage className="text-red-500 text-xs" />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Live Link Input */}
              <FormField
                control={form.control}
                name="link"
                render={({ field }) => (
                  <FormItem className="space-y-1.5">
                    <FormLabel className="text-xs font-semibold uppercase tracking-wider text-stone-600 dark:text-zinc-400">Production Live Url</FormLabel>
                    <FormControl>
                      <div className="relative rounded-xl border border-stone-250 dark:border-zinc-800 bg-white/[0.05] dark:bg-black/25 transition-all focus-within:border-[#e49505] focus-within:ring-1 focus-within:ring-[#e49505]">
                        <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-stone-400 dark:text-zinc-500">
                          <Globe className="h-4 w-4" />
                        </span>
                        <Input 
                          placeholder="https://..." 
                          className="w-full bg-transparent border-0 shadow-none py-2.5 pl-10 pr-4 text-sm text-stone-900 dark:text-white placeholder-stone-450 dark:placeholder-zinc-650 focus-visible:ring-0 focus-visible:border-0 rounded-xl"
                          {...field} 
                        />
                      </div>
                    </FormControl>
                    <FormMessage className="text-red-500 text-xs" />
                  </FormItem>
                )}
              />

              {/* GitHub URL Input */}
              <FormField
                control={form.control}
                name="githubUrl"
                render={({ field }) => (
                  <FormItem className="space-y-1.5">
                    <FormLabel className="text-xs font-semibold uppercase tracking-wider text-stone-600 dark:text-zinc-400">Repository Github Url</FormLabel>
                    <FormControl>
                      <div className="relative rounded-xl border border-stone-250 dark:border-zinc-800 bg-white/[0.05] dark:bg-black/25 transition-all focus-within:border-[#e49505] focus-within:ring-1 focus-within:ring-[#e49505]">
                        <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-stone-400 dark:text-zinc-500">
                          <Github className="h-4 w-4" />
                        </span>
                        <Input 
                          placeholder="https://github.com/..." 
                          className="w-full bg-transparent border-0 shadow-none py-2.5 pl-10 pr-4 text-sm text-stone-900 dark:text-white placeholder-stone-450 dark:placeholder-zinc-650 focus-visible:ring-0 focus-visible:border-0 rounded-xl"
                          {...field} 
                        />
                      </div>
                    </FormControl>
                    <FormMessage className="text-red-500 text-xs" />
                  </FormItem>
                )}
              />

              {/* Display Order (Numbering) Input */}
              <FormField
                control={form.control}
                name="order"
                render={({ field }) => (
                  <FormItem className="space-y-1.5">
                    <FormLabel className="text-xs font-semibold uppercase tracking-wider text-stone-600 dark:text-zinc-400">Display Order</FormLabel>
                    <FormControl>
                      <div className="relative rounded-xl border border-stone-250 dark:border-zinc-800 bg-white/[0.05] dark:bg-black/25 transition-all focus-within:border-[#e49505] focus-within:ring-1 focus-within:ring-[#e49505]">
                        <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-stone-400 dark:text-zinc-500 text-xs font-bold">
                          #
                        </span>
                        <Input 
                          type="number"
                          placeholder="0, 1, 2..." 
                          className="w-full bg-transparent border-0 shadow-none py-2.5 pl-10 pr-4 text-sm text-stone-900 dark:text-white placeholder-stone-450 dark:placeholder-zinc-650 focus-visible:ring-0 focus-visible:border-0 rounded-xl"
                          {...field} 
                        />
                      </div>
                    </FormControl>
                    <FormMessage className="text-red-500 text-xs" />
                  </FormItem>
                )}
              />
            </div>

            {/* Upload Project Image */}
            <FormField
              control={form.control}
              name="imageUrl"
              render={() => (
                <FormItem className="space-y-2">
                  <FormLabel className="text-xs font-semibold uppercase tracking-wider text-stone-600 dark:text-zinc-400 flex items-center gap-1.5">
                    <ImageIcon className="h-4 w-4 text-[#e49505]" />
                    <span>Upload Project Screenshots</span>
                  </FormLabel>
                  <FormControl>
                    <div className="rounded-xl border border-dashed border-stone-250 dark:border-zinc-800 bg-white/[0.03] dark:bg-black/15 p-6 transition-all hover:bg-white/[0.06] dark:hover:bg-black/25">
                      <UploadButton setImgUrl={setImgUrl} imgUrl={imgUrl} />
                    </div>
                  </FormControl>
                  <FormDescription className="text-stone-500 dark:text-zinc-500 text-[10px] uppercase font-semibold tracking-wider">
                    Upload image assets directly through UploadThing.
                  </FormDescription>
                  <FormMessage className="text-red-500 text-xs" />
                </FormItem>
              )}
            />

            {/* Message Alert Panel */}
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

            {/* Submit Action Button */}
            <Button 
              type="submit" 
              disabled={loading} 
              className="w-full flex items-center justify-center bg-[#e49505] hover:bg-[#c98304] disabled:bg-[#e49505]/50 text-white font-semibold py-3.5 px-4 rounded-xl shadow-lg shadow-[#e49505]/10 hover:shadow-[#e49505]/20 transition-all active:scale-[0.98] duration-200 text-base"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Adding Project...
                </>
              ) : (
                <>
                  <Sparkles className="mr-2 h-4 w-4" />
                  Create Project
                </>
              )}
            </Button>
          </form>
        </Form>
      </div>

      {/* Sidebar Manage Categories Card */}
      <div className="lg:col-span-1">
        <div className="py-8 px-6 rounded-2xl border border-stone-200/50 dark:border-white/5 bg-white bg-opacity-20 dark:bg-zinc-900/30 backdrop-blur-md shadow-2xl relative overflow-hidden transition-all hover:shadow-[#e49505]/5 duration-300 flex flex-col gap-6">
          <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-transparent via-[#e49505] to-transparent animate-pulse" />
          
          <div className="flex items-center gap-3 pb-2 border-b border-stone-200/50 dark:border-white/5">
            <div className="flex items-center justify-center p-2.5 rounded-xl bg-[#e49505]/10 text-[#e49505]">
              <FolderPlus className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-stone-900 dark:text-white tracking-tight">Categories</h3>
              <p className="text-xs text-stone-500 dark:text-zinc-400 font-light mt-0.5">Manage dynamic categories.</p>
            </div>
          </div>

          {/* Active Categories List */}
          <div className="space-y-2">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-stone-600 dark:text-zinc-400">Current Categories</h4>
            <div className="flex flex-wrap gap-2 max-h-[160px] overflow-y-auto custom-scrollbar p-1">
              {options.map((option, idx) => (
                <span key={idx} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-[#e49505]/10 border border-[#e49505]/20 text-[#e49505] uppercase tracking-wider">
                  {option.label}
                </span>
              ))}
            </div>
          </div>

          {/* Add Category Form */}
          <form onSubmit={handleCatSubmit} className="space-y-4 pt-4 border-t border-stone-200/50 dark:border-white/5">
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold uppercase tracking-wider text-stone-600 dark:text-zinc-400" htmlFor="newCatName">
                New Category Name
              </label>
              <div className="relative rounded-xl border border-stone-250 dark:border-zinc-800 bg-white/[0.05] dark:bg-black/25 transition-all focus-within:border-[#e49505] focus-within:ring-1 focus-within:ring-[#e49505]">
                <Input 
                  id="newCatName"
                  value={newCatName}
                  onChange={(e) => setNewCatName(e.target.value)}
                  placeholder="e.g. Mobile Apps..." 
                  className="w-full bg-transparent border-0 shadow-none py-2.5 px-4 text-sm text-stone-900 dark:text-white placeholder-stone-450 dark:placeholder-zinc-650 focus-visible:ring-0 focus-visible:border-0 rounded-xl"
                  required
                />
              </div>
            </div>

            {catMsg && (
              <div className={`flex items-center gap-2 p-2.5 rounded-xl border text-xs ${
                catMsg.toLowerCase().includes('failed') || catMsg.toLowerCase().includes('exists') || catMsg.toLowerCase().includes('error')
                  ? 'bg-red-500/10 border-red-500/20 text-red-650 dark:text-red-400'
                  : 'bg-emerald-500/10 border-emerald-500/20 text-emerald-650 dark:text-emerald-400'
              }`}>
                <span className="font-medium">{catMsg}</span>
              </div>
            )}

            <Button 
              type="submit" 
              disabled={catLoading} 
              className="w-full flex items-center justify-center bg-[#e49505] hover:bg-[#c98304] disabled:bg-[#e49505]/50 text-white font-semibold py-2.5 px-4 rounded-xl shadow-lg shadow-[#e49505]/10 hover:shadow-[#e49505]/20 transition-all active:scale-[0.98] duration-200 text-sm"
            >
              {catLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Adding...
                </>
              ) : (
                <>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Category
                </>
              )}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};


