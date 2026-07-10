'use client'
import React, { useState, useEffect } from 'react'
import { ArrowUp } from 'lucide-react'

export const GetToTopButton = () => {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.scrollY > 300) {
        setIsVisible(true)
      } else {
        setIsVisible(false)
      }
    }
    window.addEventListener('scroll', toggleVisibility)
    return () => window.removeEventListener('scroll', toggleVisibility)
  }, [])

  if (!isVisible) return null

  return (
    <div className='bottom-6 fixed right-6 z-50 transition-all duration-300 animate-in fade-in slide-in-from-bottom-5'>
      <button 
        onClick={() => { window.scrollTo({ top: 0, left: 0, behavior: 'smooth' }) }}
        className="relative group/top w-12 h-12 bg-neutral-900 dark:bg-[#1a1a1c] text-white border border-zinc-200 dark:border-zinc-800 rounded-full flex items-center justify-center shadow-lg hover:shadow-[#e49505]/20 hover:border-[#e49505] transition-all duration-300 hover:-translate-y-1 active:scale-90 overflow-hidden"
        aria-label="Scroll to top"
      >
        <span className="absolute inset-0 rounded-full bg-gradient-to-r from-transparent via-[#e49505]/20 to-transparent -translate-x-full group-hover/top:translate-x-full transition-transform duration-1000 ease-out" />
        <ArrowUp className="h-5 w-5 text-[#e49505] transition-transform duration-300 group-hover/top:-translate-y-0.5 relative z-10" />
      </button>
    </div>
  )
}

