'use client';

import React, { useState } from 'react';
import { ProfileForm } from './upload-data';
import Projects from './projects';
import { BlogForm } from './upload-blog';
import BlogsList from './blogs-list';
import { FolderGit, BookOpen, Briefcase, FileText } from 'lucide-react';

interface DashboardTabsProps {
  initialProjects: any[];
  initialBlogs: any[];
}

export default function DashboardTabs({
  initialProjects,
  initialBlogs,
}: DashboardTabsProps) {
  const [activeTab, setActiveTab] = useState<'projects' | 'blogs'>('projects');

  return (
    <div className="w-full space-y-6">
      {/* Premium Tab Toggles */}
      <div className="flex justify-center items-center">
        <div className="flex bg-white/5 dark:bg-[#1a1a1c]/60 border border-white/10 dark:border-zinc-800/80 p-1.5 rounded-2xl shadow-xl backdrop-blur-md">
          <button
            onClick={() => setActiveTab('projects')}
            className={`flex items-center gap-2.5 px-6 py-3 rounded-xl text-sm font-bold tracking-wide transition-all duration-300 ${
              activeTab === 'projects'
                ? 'bg-[#e49505] text-white shadow-lg shadow-[#e49505]/10 scale-[1.02]'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            <Briefcase className="h-4.5 w-4.5" />
            <span>Manage Projects</span>
          </button>
          
          <button
            onClick={() => setActiveTab('blogs')}
            className={`flex items-center gap-2.5 px-6 py-3 rounded-xl text-sm font-bold tracking-wide transition-all duration-300 ${
              activeTab === 'blogs'
                ? 'bg-[#e49505] text-white shadow-lg shadow-[#e49505]/10 scale-[1.02]'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            <FileText className="h-4.5 w-4.5" />
            <span>Manage Blogs</span>
          </button>
        </div>
      </div>

      {/* Tab Contents */}
      <div className="transition-all duration-500 ease-in-out">
        {activeTab === 'projects' ? (
          <div className="animate-fadeIn">
            <ProfileForm />
            <Projects initialItems={initialProjects} />
          </div>
        ) : (
          <div className="animate-fadeIn">
            <BlogForm />
            <BlogsList initialItems={initialBlogs} />
          </div>
        )}
      </div>
    </div>
  );
}
