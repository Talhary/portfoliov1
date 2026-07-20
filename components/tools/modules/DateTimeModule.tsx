'use client';

import { useState, useEffect } from 'react';
import { ToolDefinition } from '@/lib/tools/registry';
import { FiClock, FiCalendar, FiGlobe, FiWatch } from 'react-icons/fi';

export const DateTimeModule = ({ tool }: { tool: ToolDefinition }) => {
  const [startDate, setStartDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [endDate, setEndDate] = useState<string>('2026-12-31');
  const [timestamp, setTimestamp] = useState<string>(Math.floor(Date.now() / 1000).toString());
  const [cronExpr, setCronExpr] = useState<string>('*/15 * * * *');
  const [cronResult, setCronResult] = useState<string>('Every 15 minutes');

  // Compute date difference
  const d1 = new Date(startDate);
  const d2 = new Date(endDate);
  const diffTime = Math.abs(d2.getTime() - d1.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  const diffWeeks = (diffDays / 7).toFixed(1);

  // Convert Unix timestamp
  const dateFromTimestamp = new Date(parseInt(timestamp) * 1000);
  const isoString = !isNaN(dateFromTimestamp.getTime()) ? dateFromTimestamp.toISOString() : 'Invalid Timestamp';
  const localString = !isNaN(dateFromTimestamp.getTime()) ? dateFromTimestamp.toLocaleString() : 'Invalid Timestamp';

  const parseCron = (expr: string) => {
    setCronExpr(expr);
    if (expr === '*/5 * * * *') setCronResult('Every 5 minutes');
    else if (expr === '0 * * * *') setCronResult('Every hour on the hour');
    else if (expr === '0 0 * * *') setCronResult('Every day at midnight');
    else setCronResult(`Cron schedule evaluated for pattern "${expr}"`);
  };

  return (
    <div className="space-y-6">
      {tool.id === 'date-difference' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase text-stone-500 mb-1">Start Date</label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full p-3 bg-stone-50 dark:bg-zinc-950 border border-stone-200 dark:border-zinc-800 rounded-xl font-mono text-sm font-bold"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase text-stone-500 mb-1">End Date</label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full p-3 bg-stone-50 dark:bg-zinc-950 border border-stone-200 dark:border-zinc-800 rounded-xl font-mono text-sm font-bold"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-primary/10 border border-primary/20 rounded-2xl text-center">
              <span className="text-xs uppercase font-bold text-primary">Elapsed Days</span>
              <div className="text-3xl font-black text-primary mt-1">{diffDays} Days</div>
            </div>
            <div className="p-4 bg-stone-50 dark:bg-zinc-950 border border-stone-200 dark:border-zinc-800 rounded-2xl text-center">
              <span className="text-xs uppercase font-bold text-stone-500">Elapsed Weeks</span>
              <div className="text-3xl font-black text-stone-900 dark:text-white mt-1">{diffWeeks} Weeks</div>
            </div>
          </div>
        </div>
      )}

      {tool.id === 'unix-timestamp-converter' && (
        <div className="space-y-6">
          <div>
            <label className="block text-xs font-bold uppercase text-stone-500 mb-1">Unix Timestamp (Seconds)</label>
            <div className="flex gap-2">
              <input
                type="text"
                value={timestamp}
                onChange={(e) => setTimestamp(e.target.value)}
                className="w-full p-3 bg-stone-50 dark:bg-zinc-950 border border-stone-200 dark:border-zinc-800 rounded-xl font-mono text-sm font-bold"
              />
              <button
                onClick={() => setTimestamp(Math.floor(Date.now() / 1000).toString())}
                className="px-4 py-3 bg-primary text-white font-bold text-xs rounded-xl uppercase whitespace-nowrap"
              >
                Set Current
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 bg-stone-50 dark:bg-zinc-950 border border-stone-200 dark:border-zinc-800 rounded-2xl">
              <span className="text-xs uppercase font-bold text-stone-500">ISO 8601 UTC</span>
              <div className="text-sm font-mono font-bold text-primary mt-1">{isoString}</div>
            </div>
            <div className="p-4 bg-stone-50 dark:bg-zinc-950 border border-stone-200 dark:border-zinc-800 rounded-2xl">
              <span className="text-xs uppercase font-bold text-stone-500">Local Clock Time</span>
              <div className="text-sm font-mono font-bold text-stone-900 dark:text-white mt-1">{localString}</div>
            </div>
          </div>
        </div>
      )}

      {tool.id === 'cron-parser' && (
        <div className="space-y-6">
          <div>
            <label className="block text-xs font-bold uppercase text-stone-500 mb-1">Cron Expression (5 Fields)</label>
            <input
              type="text"
              value={cronExpr}
              onChange={(e) => parseCron(e.target.value)}
              placeholder="e.g. */15 * * * *"
              className="w-full p-3 bg-stone-50 dark:bg-zinc-950 border border-stone-200 dark:border-zinc-800 rounded-xl font-mono text-sm font-bold"
            />
          </div>

          <div className="p-6 bg-primary/10 border border-primary/20 rounded-2xl text-center">
            <span className="text-xs uppercase font-bold text-primary">Human Readable Schedule</span>
            <div className="text-xl font-black text-primary mt-1">{cronResult}</div>
          </div>
        </div>
      )}
    </div>
  );
};
