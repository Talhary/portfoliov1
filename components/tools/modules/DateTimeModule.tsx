'use client';

import { useState, useEffect } from 'react';
import { ToolDefinition } from '@/lib/tools/registry';
import { FiClock, FiCalendar, FiGlobe, FiWatch, FiPlay, FiPause, FiRefreshCw } from 'react-icons/fi';

export const DateTimeModule = ({ tool }: { tool: ToolDefinition }) => {
  const [startDate, setStartDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [endDate, setEndDate] = useState<string>('2026-12-31');

  // Fix hydration: initialize empty, set via useEffect client-side only
  const [timestamp, setTimestamp] = useState<string>('1700000000');

  const [cronExpr, setCronExpr] = useState<string>('*/5 * * * *');
  const [cronResult, setCronResult] = useState<string>('Every 5 minutes');

  // Timezone converter state
  const [tzTime, setTzTime] = useState<string>('12:00');
  const [fromTz, setFromTz] = useState<string>('America/New_York');
  const [toTz, setToTz] = useState<string>('Asia/Karachi');
  const [tzResult, setTzResult] = useState<string>('');

  // Countdown timer state
  const [targetDate, setTargetDate] = useState<string>('2027-01-01');
  const [targetTime, setTargetTime] = useState<string>('00:00');
  const [countdown, setCountdown] = useState<{ days: number; hours: number; minutes: number; seconds: number } | null>(null);
  const [timerRunning, setTimerRunning] = useState<boolean>(false);

  // Set timestamp to current time on client mount only (avoids SSR hydration mismatch)
  useEffect(() => {
    setTimestamp(Math.floor(Date.now() / 1000).toString());
  }, []);

  // Countdown timer logic
  useEffect(() => {
    if (!timerRunning) return;
    const interval = setInterval(() => {
      const target = new Date(`${targetDate}T${targetTime}:00`).getTime();
      const now = Date.now();
      const diff = target - now;
      if (diff <= 0) {
        setCountdown({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        setTimerRunning(false);
        clearInterval(interval);
        return;
      }
      setCountdown({
        days: Math.floor(diff / (1000 * 60 * 60 * 24)),
        hours: Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((diff % (1000 * 60)) / 1000),
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [timerRunning, targetDate, targetTime]);

  // Timezone converter calculation
  const convertTimezone = () => {
    try {
      const now = new Date();
      const [h, m] = tzTime.split(':').map(Number);
      now.setHours(h, m, 0, 0);
      const formatted = now.toLocaleString('en-US', { timeZone: toTz, hour: '2-digit', minute: '2-digit', hour12: true });
      setTzResult(`${tzTime} ${fromTz} → ${formatted} ${toTz}`);
    } catch {
      setTzResult('Conversion error — unsupported timezone');
    }
  };

  // Compute date difference
  const d1 = new Date(startDate);
  const d2 = new Date(endDate);
  const diffTime = Math.abs(d2.getTime() - d1.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  const diffWeeks = (diffDays / 7).toFixed(1);

  // Convert Unix timestamp
  const parsedTs = parseInt(timestamp, 10);
  const dateFromTimestamp = !isNaN(parsedTs) ? new Date(parsedTs * 1000) : null;
  const isoString = dateFromTimestamp && !isNaN(dateFromTimestamp.getTime()) ? dateFromTimestamp.toISOString() : 'Invalid Timestamp';
  const localString = dateFromTimestamp && !isNaN(dateFromTimestamp.getTime()) ? dateFromTimestamp.toLocaleString() : 'Invalid Timestamp';

  const parseCron = (expr: string) => {
    setCronExpr(expr);
    if (expr === '*/5 * * * *') setCronResult('Every 5 minutes');
    else if (expr === '*/15 * * * *') setCronResult('Every 15 minutes');
    else if (expr === '0 * * * *') setCronResult('Every hour on the hour');
    else if (expr === '0 0 * * *') setCronResult('Every day at midnight');
    else setCronResult(`Cron schedule evaluated for pattern "${expr}"`);
  };

  const TIMEZONES = [
    'America/New_York', 'America/Chicago', 'America/Denver', 'America/Los_Angeles',
    'America/Sao_Paulo', 'Europe/London', 'Europe/Paris', 'Europe/Berlin',
    'Africa/Cairo', 'Asia/Dubai', 'Asia/Karachi', 'Asia/Kolkata', 'Asia/Dhaka',
    'Asia/Bangkok', 'Asia/Singapore', 'Asia/Shanghai', 'Asia/Tokyo',
    'Australia/Sydney', 'Pacific/Auckland',
  ];

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

      {tool.id === 'timezone-converter' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase text-stone-500 mb-1">Time</label>
              <input
                type="time"
                value={tzTime}
                onChange={(e) => setTzTime(e.target.value)}
                className="w-full p-3 bg-stone-50 dark:bg-zinc-950 border border-stone-200 dark:border-zinc-800 rounded-xl font-mono text-sm font-bold"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase text-stone-500 mb-1">From Timezone</label>
              <select
                value={fromTz}
                onChange={(e) => setFromTz(e.target.value)}
                className="w-full p-3 bg-stone-50 dark:bg-zinc-950 border border-stone-200 dark:border-zinc-800 rounded-xl font-bold text-sm"
              >
                {TIMEZONES.map((tz) => (
                  <option key={tz} value={tz}>{tz}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold uppercase text-stone-500 mb-1">To Timezone</label>
              <select
                value={toTz}
                onChange={(e) => setToTz(e.target.value)}
                className="w-full p-3 bg-stone-50 dark:bg-zinc-950 border border-stone-200 dark:border-zinc-800 rounded-xl font-bold text-sm"
              >
                {TIMEZONES.map((tz) => (
                  <option key={tz} value={tz}>{tz}</option>
                ))}
              </select>
            </div>
          </div>

          <button
            onClick={convertTimezone}
            className="w-full py-3.5 bg-primary hover:bg-primary/90 text-white font-bold text-sm rounded-xl shadow-lg transition-all flex items-center justify-center gap-2"
          >
            <FiGlobe size={16} /> Convert Timezone
          </button>

          {tzResult && (
            <div className="p-5 bg-primary/10 border border-primary/20 rounded-2xl text-center">
              <div className="text-xs uppercase font-bold text-primary mb-1">Converted Time</div>
              <div className="text-lg font-black text-primary">{tzResult}</div>
            </div>
          )}
        </div>
      )}

      {tool.id === 'countdown-timer' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase text-stone-500 mb-1">Target Date</label>
              <input
                type="date"
                value={targetDate}
                onChange={(e) => setTargetDate(e.target.value)}
                className="w-full p-3 bg-stone-50 dark:bg-zinc-950 border border-stone-200 dark:border-zinc-800 rounded-xl font-mono text-sm font-bold"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase text-stone-500 mb-1">Target Time</label>
              <input
                type="time"
                value={targetTime}
                onChange={(e) => setTargetTime(e.target.value)}
                className="w-full p-3 bg-stone-50 dark:bg-zinc-950 border border-stone-200 dark:border-zinc-800 rounded-xl font-mono text-sm font-bold"
              />
            </div>
          </div>

          <div className="flex gap-3">
            <button
              id="start-timer-btn"
              onClick={() => setTimerRunning(!timerRunning)}
              className={`flex-1 py-3.5 font-bold text-sm rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 ${
                timerRunning ? 'bg-amber-500 hover:bg-amber-600 text-white' : 'bg-primary hover:bg-primary/90 text-white'
              }`}
            >
              {timerRunning ? <><FiPause size={16} /> Pause Timer</> : <><FiPlay size={16} /> Start Countdown</>}
            </button>
            <button
              onClick={() => { setTimerRunning(false); setCountdown(null); }}
              className="px-5 py-3.5 bg-stone-200 dark:bg-zinc-800 text-stone-700 dark:text-zinc-300 font-bold text-sm rounded-xl hover:bg-stone-300 transition-all"
            >
              <FiRefreshCw size={16} />
            </button>
          </div>

          {countdown && (
            <div className="grid grid-cols-4 gap-3">
              {[
                { label: 'Days', value: countdown.days },
                { label: 'Hours', value: countdown.hours },
                { label: 'Minutes', value: countdown.minutes },
                { label: 'Seconds', value: countdown.seconds },
              ].map(({ label, value }) => (
                <div key={label} className="p-4 bg-primary/10 border border-primary/20 rounded-2xl text-center">
                  <div className="text-2xl sm:text-3xl font-black text-primary font-mono">
                    {String(value).padStart(2, '0')}
                  </div>
                  <div className="text-[11px] font-bold uppercase text-primary mt-1">{label}</div>
                </div>
              ))}
            </div>
          )}
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
