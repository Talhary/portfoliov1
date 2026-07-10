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
        <div className="absolute inset-0 border-4 border-transparent border-t-[#e49505] border-r-[#e49505] rounded-full animate-spin duration-1000" />
        
        {/* Inner Ring (rotating in reverse) */}
        <div 
          className="absolute inset-2 border-4 border-transparent border-b-[#e49505] border-l-[#e49505] rounded-full animate-spin" 
          style={{ animationDirection: 'reverse', animationDuration: '0.8s' }} 
        />
        
        {/* Glowing Center Dot */}
        <div className="absolute inset-[20px] bg-[#e49505] rounded-full shadow-[0_0_12px_#e49505] animate-pulse" />
      </div>
      
      <span className="text-xs uppercase tracking-widest text-[#e49505] font-bold animate-pulse">
        Loading
      </span>
    </motion.div>
  )
}

