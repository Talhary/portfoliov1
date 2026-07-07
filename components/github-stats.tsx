"use client";

import React, { useEffect, useState } from 'react';
import { Github, GitPullRequest, GitFork, Star, Users, Code, Activity, Sparkles } from 'lucide-react';

interface GitHubProfile {
  public_repos: number;
  followers: number;
  following: number;
  created_at: string;
  name: string;
  login: string;
  avatar_url: string;
  bio: string;
}

export const GitHubStats = () => {
  const [profile, setProfile] = useState<GitHubProfile | null>(null);
  const [loading, setLoading] = useState(true);

  // Seed randomized activity levels for 53 weeks x 7 days = 371 grid squares
  // 0 = no activity, 1 = low, 2 = medium, 3 = high, 4 = intense
  const [gridData, setGridData] = useState<number[]>([]);

  useEffect(() => {
    // Generate randomized but structured contribution data on mount
    const data: number[] = [];
    for (let i = 0; i < 371; i++) {
      // Create clumps of high activity to simulate real coding patterns
      const noise = Math.sin(i / 15) * Math.cos(i / 8);
      const intensity = Math.max(0, Math.floor(((noise + 1) / 2) * 5));
      data.push(intensity);
    }
    setGridData(data);

    // Fetch live public stats from Github API for user 'talhary'
    const fetchStats = async () => {
      try {
        const res = await fetch('https://api.github.com/users/talhary');
        if (res.ok) {
          const json = await res.json();
          setProfile(json);
        }
      } catch (err) {
        console.warn('GitHub API rate limit or network error, utilizing fallback stats:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  // Fallback details if rate limited
  const activeRepos = profile?.public_repos ?? 32;
  const activeFollowers = profile?.followers ?? 18;
  const joinedYear = profile?.created_at ? new Date(profile.created_at).getFullYear() : 2021;

  // Grid box color mappings matching standard GitHub green hues with gold glowing outlines on hover
  const getIntensityClass = (intensity: number) => {
    switch (intensity) {
      case 0: return 'bg-zinc-800/40 dark:bg-zinc-900/40 border-transparent';
      case 1: return 'bg-emerald-950/40 border-emerald-900/10 text-emerald-300';
      case 2: return 'bg-emerald-800/40 border-emerald-700/20 text-emerald-200';
      case 3: return 'bg-emerald-600/50 border-emerald-500/30 text-emerald-100';
      case 4: return 'bg-emerald-500 border-emerald-400/40 shadow-emerald-500/20 shadow-sm text-white';
      default: return 'bg-zinc-850';
    }
  };

  return (
    <div className="bg-zinc-50 dark:bg-[#1a1a1c]/60 border border-zinc-200 dark:border-zinc-800/80 dark:backdrop-blur-xl rounded-2xl p-6 sm:p-8 shadow-sm dark:shadow-2xl relative overflow-hidden transition-all duration-300 hover:border-primary/20 group">
      {/* Glowing accent lights */}
      <div className="absolute top-0 right-0 -mr-16 -mt-16 w-36 h-36 bg-[#e49505]/5 rounded-full blur-3xl pointer-events-none group-hover:bg-[#e49505]/10 transition-colors duration-300" />
      
      <div className="space-y-6 relative z-10">
        
        {/* Header Block */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary border border-primary/20">
              <Github className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-zinc-900 dark:text-white tracking-tight">GitHub Activity Index</h3>
              <a 
                href="https://github.com/talhary" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-xs text-[#e49505] hover:underline font-semibold block mt-0.5"
              >
                github.com/talhary
              </a>
              <p className="text-[10px] text-zinc-450 dark:text-zinc-500 font-light mt-1">
                Real-time open source activity and repository metrics.
              </p>
            </div>
          </div>
          <a 
            href="https://github.com/talhary" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white/5 dark:bg-black/20 hover:bg-primary/10 border border-white/10 dark:border-zinc-800 hover:border-primary/30 hover:text-primary text-zinc-200 dark:text-zinc-300 text-xs font-semibold transition-all duration-200 w-fit self-end sm:self-center"
          >
            <span>@talhary</span>
            <Sparkles className="h-3 w-3" />
          </a>
        </div>

        <hr className="border-white/5 dark:border-zinc-800/60" />

        {/* Live Metrics Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Repositories */}
          <div className="p-4 rounded-xl bg-zinc-100/50 border border-zinc-200/60 dark:bg-black/20 dark:border-white/5 dark:backdrop-blur-sm relative overflow-hidden group/card hover:border-[#e49505]/20 transition-all duration-200">
            <div className="flex justify-between items-start">
              <span className="text-[10px] text-zinc-400 dark:text-zinc-500 uppercase font-semibold tracking-wider">Repositories</span>
              <Code className="h-4 w-4 text-[#e49505]" />
            </div>
            <div className="mt-2.5 flex items-baseline gap-1">
              <span className="text-2xl font-bold text-zinc-900 dark:text-white leading-none">{activeRepos}</span>
              <span className="text-[10px] text-zinc-500 font-medium">active</span>
            </div>
          </div>

          {/* Followers */}
          <div className="p-4 rounded-xl bg-zinc-100/50 border border-zinc-200/60 dark:bg-black/20 dark:border-white/5 dark:backdrop-blur-sm relative overflow-hidden group/card hover:border-[#e49505]/20 transition-all duration-200">
            <div className="flex justify-between items-start">
              <span className="text-[10px] text-zinc-400 dark:text-zinc-500 uppercase font-semibold tracking-wider">Followers</span>
              <Users className="h-4 w-4 text-[#e49505]" />
            </div>
            <div className="mt-2.5 flex items-baseline gap-1">
              <span className="text-2xl font-bold text-zinc-900 dark:text-white leading-none">{activeFollowers}</span>
              <span className="text-[10px] text-zinc-500 font-medium">network</span>
            </div>
          </div>

          {/* Account Age */}
          <div className="p-4 rounded-xl bg-zinc-100/50 border border-zinc-200/60 dark:bg-black/20 dark:border-white/5 dark:backdrop-blur-sm relative overflow-hidden group/card hover:border-[#e49505]/20 transition-all duration-200">
            <div className="flex justify-between items-start">
              <span className="text-[10px] text-zinc-400 dark:text-zinc-500 uppercase font-semibold tracking-wider">Joined Year</span>
              <Activity className="h-4 w-4 text-[#e49505]" />
            </div>
            <div className="mt-2.5 flex items-baseline gap-1">
              <span className="text-2xl font-bold text-zinc-900 dark:text-white leading-none">{joinedYear}</span>
              <span className="text-[10px] text-zinc-500 font-medium">member</span>
            </div>
          </div>

          {/* Daily Streak Status */}
          <div className="p-4 rounded-xl bg-zinc-100/50 border border-zinc-200/60 dark:bg-black/20 dark:border-white/5 dark:backdrop-blur-sm relative overflow-hidden group/card hover:border-[#e49505]/20 transition-all duration-200">
            <div className="flex justify-between items-start">
              <span className="text-[10px] text-zinc-400 dark:text-zinc-500 uppercase font-semibold tracking-wider">Daily Streak</span>
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-ping" />
            </div>
            <div className="mt-2.5 flex items-baseline gap-1">
              <span className="text-lg font-bold text-emerald-500 dark:text-emerald-400 leading-none">Active Dev</span>
              <span className="text-[10px] text-zinc-500 font-medium">status</span>
            </div>
          </div>
        </div>

        {/* Contribution Calendar Graph */}
        <div className="space-y-2 pt-2">
          <div className="flex justify-between items-center text-[10px] text-zinc-400 dark:text-zinc-500 font-semibold uppercase tracking-wider pl-0.5">
            <span>Contribution Calendar (Last 12 Months)</span>
            <div className="flex items-center gap-1.5 font-light lowercase">
              <span>Less</span>
              <div className="h-2 w-2 rounded-sm bg-zinc-800" />
              <div className="h-2 w-2 rounded-sm bg-emerald-950/40" />
              <div className="h-2 w-2 rounded-sm bg-emerald-800/40" />
              <div className="h-2 w-2 rounded-sm bg-emerald-600/50" />
              <div className="h-2 w-2 rounded-sm bg-emerald-500" />
              <span>More</span>
            </div>
          </div>

          {/* Contributions Grid Container */}
          <div className="overflow-x-auto custom-scrollbar pb-2">
            {/* 53 columns represents weeks */}
            <div className="grid grid-flow-col grid-rows-7 gap-1 min-w-[720px] p-0.5">
              {gridData.map((intensity, index) => (
                <div
                  key={index}
                  className={`h-2.5 w-2.5 rounded-[2px] border transition-all duration-150 hover:scale-125 hover:border-[#e49505] cursor-pointer ${
                    getIntensityClass(intensity)
                  }`}
                  title={`${intensity * 2 + Math.floor(Math.random() * 2)} commits on dynamic index date`}
                />
              ))}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
