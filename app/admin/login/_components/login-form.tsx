'use client';

import { LoginUser } from '@/actions/login';
import { FormEvent, useState } from 'react';
import { Mail, Lock, Fingerprint, AlertCircle, Loader2 } from 'lucide-react';

const LoginForm = () => {
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    if (!email || !password) {
      setError('Please provide both email and password.');
      setLoading(false);
      return;
    }

    try {
      const res = await LoginUser(email, password);
      if (res && !res.success) {
        setError(res.message || 'Invalid credentials.');
        setLoading(false);
      }
    } catch (err: any) {
      // If Next.js server-side redirect occurs, keep loading active while navigating
      if (err instanceof Error && err.message.includes('NEXT_REDIRECT')) {
        throw err;
      }
      setError('Invalid credentials or a network error occurred.');
      setLoading(false);
    }
  };

  return (
    <div className="h-[100vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md p-8 rounded-2xl border border-stone-250/30 dark:border-white/5 bg-white bg-opacity-20 dark:bg-zinc-900/30 backdrop-blur-md shadow-2xl space-y-6 relative overflow-hidden transition-all hover:shadow-[#e49505]/5 duration-300">

        {/* Decorative Top Accent Glow Line */}
        <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-transparent via-[#e49505] to-transparent animate-pulse" />

        <div className="text-center">
          {/* Fingerprint Header Icon */}
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-[#e49505]/10 border border-[#e49505]/20 text-[#e49505] mb-4">
            <Fingerprint className="h-6 w-6 animate-pulse" />
          </div>
          <h2 className="text-2xl font-bold tracking-tight text-stone-900 dark:text-white">
            Admin Portal
          </h2>
          <p className="text-sm text-stone-500 dark:text-zinc-400 font-light mt-1.5">
            Authenticate to access your administrator dashboard.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Email Field */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold uppercase tracking-wider text-stone-550 dark:text-zinc-400" htmlFor="email">
              Email Address
            </label>
            <div className="relative rounded-xl border border-stone-200 dark:border-zinc-800 bg-white/[0.05] dark:bg-black/25 transition-all focus-within:border-[#e49505] focus-within:ring-1 focus-within:ring-[#e49505]">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-stone-400 dark:text-zinc-505">
                <Mail className="h-4 w-4" />
              </span>
              <input
                type="email"
                name="email"
                id="email"
                placeholder="admin@example.com"
                disabled={loading}
                className="w-full bg-transparent py-2.5 pl-10 pr-4 text-sm text-stone-900 dark:text-white placeholder-stone-400 dark:placeholder-zinc-650 rounded-xl focus:outline-none disabled:opacity-50"
                required
              />
            </div>
          </div>

          {/* Password Field */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold uppercase tracking-wider text-stone-550 dark:text-zinc-400" htmlFor="password">
              Password
            </label>
            <div className="relative rounded-xl border border-stone-200 dark:border-zinc-800 bg-white/[0.05] dark:bg-black/25 transition-all focus-within:border-[#e49505] focus-within:ring-1 focus-within:ring-[#e49505]">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-stone-400 dark:text-zinc-555">
                <Lock className="h-4 w-4" />
              </span>
              <input
                type="password"
                name="password"
                id="password"
                placeholder="••••••••"
                disabled={loading}
                className="w-full bg-transparent py-2.5 pl-10 pr-4 text-sm text-stone-900 dark:text-white placeholder-stone-400 dark:placeholder-zinc-655 rounded-xl focus:outline-none disabled:opacity-50"
                required
              />
            </div>
          </div>

          {/* Error Message Box */}
          {error && (
            <div className="flex items-start gap-2.5 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-650 dark:text-red-400 text-sm animate-shake">
              <AlertCircle className="h-4.5 w-4.5 shrink-0 text-red-550 dark:text-red-400 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center bg-[#e49505] hover:bg-[#c98304] disabled:bg-[#e49505]/50 text-white font-semibold py-3 px-4 rounded-xl shadow-lg shadow-[#e49505]/10 hover:shadow-[#e49505]/20 transition-all active:scale-[0.98] duration-200 disabled:pointer-events-none"
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin text-white" />
                Authenticating...
              </>
            ) : (
              "Sign In"
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginForm;
