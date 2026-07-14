'use client'

import React from "react"
import { motion } from "framer-motion"

export const Spinner = () => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex flex-col items-center justify-center gap-4"
    >
      <div className="relative w-16 h-16">
        {/* Outer Ring */}
        <div className="absolute inset-0 border-4 border-transparent border-t-primary border-r-primary rounded-full animate-spin duration-1000" />
        
        {/* Inner Ring (rotating in reverse) */}
        <div 
          className="absolute inset-2 border-4 border-transparent border-b-primary border-l-primary rounded-full animate-spin" 
          style={{ animationDirection: 'reverse', animationDuration: '0.8s' }} 
        />
        
        {/* Glowing Center Dot */}
        <div className="absolute inset-[20px] bg-primary rounded-full shadow-[0_0_12px_var(--primary)] animate-pulse" />
      </div>
      
      <span className="text-xs uppercase tracking-widest text-primary font-bold animate-pulse">
        Loading
      </span>
    </motion.div>
  )
}

