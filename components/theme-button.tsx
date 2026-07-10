"use client"

import * as React from "react"
import { useTheme } from "next-themes"

export const ModeToggle = () => {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = React.useState(false)

  // Avoid hydration mismatch by waiting until mounted
  React.useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return <div className="w-14 h-8 bg-zinc-200 dark:bg-zinc-800 rounded-full animate-pulse" />
  }

  // Fallback to dark if theme is system and dark mode is active
  const isDark = theme === "dark" || (theme === "system" && typeof window !== "undefined" && window.matchMedia("(prefers-color-scheme: dark)").matches)

  const toggleTheme = () => {
    setTheme(isDark ? "light" : "dark")
  }

  return (
    <button
      onClick={toggleTheme}
      className={`relative w-14 h-8 rounded-full p-1 transition-all duration-500 ease-in-out outline-none select-none ${
        isDark 
          ? "bg-slate-950 border border-slate-800 shadow-[inset_0_2px_4px_rgba(0,0,0,0.6)]" 
          : "bg-sky-300 border border-sky-200 shadow-[inset_0_2px_4px_rgba(0,0,0,0.2)]"
      }`}
      aria-label="Toggle Theme"
    >
      {/* Stars in dark mode */}
      <div className={`absolute inset-0 transition-opacity duration-500 ${isDark ? "opacity-100" : "opacity-0 pointer-events-none"}`}>
        <div className="absolute top-1.5 left-3 w-0.5 h-0.5 bg-white rounded-full animate-pulse" />
        <div className="absolute top-3 left-6 w-0.5 h-0.5 bg-white rounded-full opacity-70" />
        <div className="absolute top-2 left-8 w-0.5 h-0.5 bg-white rounded-full opacity-40" />
        <div className="absolute top-4 left-4 w-0.5 h-0.5 bg-white rounded-full animate-pulse" style={{ animationDelay: '1s' }} />
      </div>

      {/* Clouds in light mode */}
      <div className={`absolute inset-0 transition-opacity duration-500 ${isDark ? "opacity-0 pointer-events-none" : "opacity-100"}`}>
        <div className="absolute bottom-1 right-2 w-4 h-2 bg-white rounded-full opacity-80" />
        <div className="absolute bottom-2 right-4 w-3 h-1.5 bg-white rounded-full opacity-60" />
      </div>

      {/* Knob (Sun / Moon) */}
      <div
        className={`w-6 h-6 rounded-full transition-transform duration-500 ease-in-out flex items-center justify-center shadow-md ${
          isDark
            ? "translate-x-6 bg-slate-100 shadow-[0_0_10px_rgba(255,255,255,0.4)]"
            : "translate-x-0 bg-yellow-400 shadow-[0_0_10px_rgba(250,204,21,0.6)]"
        }`}
      >
        {isDark ? (
          // Moon details (craters)
          <div className="relative w-full h-full rounded-full bg-slate-350 overflow-hidden">
            <div className="absolute top-1 left-1.5 w-1.5 h-1.5 bg-slate-450 rounded-full opacity-60" />
            <div className="absolute top-3 left-1 w-1.5 h-1.5 bg-slate-450 rounded-full opacity-65" />
            <div className="absolute top-2.5 left-3.5 w-2 h-2 bg-slate-450 rounded-full opacity-55" />
          </div>
        ) : (
          // Sun details (inner core)
          <div className="w-4 h-4 rounded-full bg-yellow-350" />
        )}
      </div>
    </button>
  )
}

