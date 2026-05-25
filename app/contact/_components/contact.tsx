
"use client";

import { useState } from "react";
import Link from "next/link";
import { 
  Phone, 
  Mail, 
  Globe, 
  MapPin, 
  Copy, 
  Check, 
  ExternalLink, 
  Github, 
  MessageSquare
} from "lucide-react";
import { ContactForm } from '@/app/contact/_components/form';

export default function Component() {
  const [copiedText, setCopiedText] = useState<string | null>(null);

  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(label);
    setTimeout(() => {
      setCopiedText(null);
    }, 2000);
  };

  return (
    <div className="w-full max-w-6xl mx-auto px-4 py-8 md:py-16 dark:text-gray-100">
      <div className="grid md:grid-cols-5 gap-8 items-start">
        
        {/* Contact Form Section (Left 3 Columns on desktop) */}
        <div className="md:col-span-3 bg-white/5 dark:bg-[#1a1a1c]/60 border border-white/10 dark:border-zinc-800/80 backdrop-blur-xl rounded-2xl p-6 sm:p-8 shadow-2xl relative overflow-hidden transition-all duration-300 hover:border-primary/20 group">
          <div className="absolute top-0 right-0 -mr-16 -mt-16 w-32 h-32 bg-primary/10 rounded-full blur-3xl pointer-events-none" />
          
          <div className="space-y-6 relative z-10">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary border border-primary/20">
                <MessageSquare className="h-5 w-5" />
              </div>
              <div>
                <h2 className="text-2xl font-bold tracking-tight text-white dark:text-zinc-100">Get in Touch</h2>
                <p className="text-sm text-zinc-400 dark:text-zinc-400 mt-1">
                  Have a question or want to work together? Drop a message!
                </p>
              </div>
            </div>
            
            <hr className="border-white/5 dark:border-zinc-800/60 my-4" />
            
            <ContactForm />
          </div>
        </div>

        {/* Contact Info Section (Right 2 Columns on desktop) */}
        <div className="md:col-span-2 space-y-6">
          
          <div className="bg-white/5 dark:bg-[#1a1a1c]/60 border border-white/10 dark:border-zinc-800/80 backdrop-blur-xl rounded-2xl p-6 sm:p-8 shadow-2xl relative overflow-hidden transition-all duration-300 hover:border-primary/20 group">
            <div className="absolute top-0 right-0 -mr-16 -mt-16 w-32 h-32 bg-primary/10 rounded-full blur-3xl pointer-events-none" />
            
            <div className="space-y-6 relative z-10">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary border border-primary/20">
                  <Phone className="h-5 w-5" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold tracking-tight text-white dark:text-zinc-100">Contact Info</h2>
                  <p className="text-sm text-zinc-400 dark:text-zinc-400 mt-1">
                    Reach out directly through these platforms.
                  </p>
                </div>
              </div>
              
              <hr className="border-white/5 dark:border-zinc-800/60 my-4" />

              <div className="space-y-4">
                
                {/* Email Item */}
                <div className="group/item flex items-center justify-between p-3 rounded-xl bg-white/[0.02] dark:bg-black/20 border border-white/[0.03] dark:border-zinc-800/30 hover:border-primary/30 transition-all duration-200">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="h-9 w-9 rounded-lg bg-primary/5 flex items-center justify-center text-primary border border-primary/10 group-hover/item:bg-primary/15 transition-all">
                      <Mail className="h-4.5 w-4.5" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs text-zinc-400 dark:text-zinc-500 font-medium uppercase tracking-wider font-semibold">Email</p>
                      <a href="mailto:talhariaz5425869@gmail.com" className="text-sm font-semibold text-zinc-200 dark:text-zinc-300 hover:text-primary transition-colors truncate block">
                        talhariaz5425869@gmail.com
                      </a>
                    </div>
                  </div>
                  <button 
                    onClick={() => handleCopy("talhariaz5425869@gmail.com", "email")}
                    className="h-8 w-8 rounded-lg bg-white/[0.03] dark:bg-zinc-900/50 flex items-center justify-center text-zinc-400 hover:text-white hover:bg-white/10 dark:hover:bg-zinc-800 transition-all ml-2 flex-shrink-0"
                    title="Copy Email"
                  >
                    {copiedText === "email" ? (
                      <Check className="h-4 w-4 text-green-500" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                  </button>
                </div>

                {/* Phone Item */}
                <div className="group/item flex items-center justify-between p-3 rounded-xl bg-white/[0.02] dark:bg-black/20 border border-white/[0.03] dark:border-zinc-800/30 hover:border-primary/30 transition-all duration-200">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="h-9 w-9 rounded-lg bg-primary/5 flex items-center justify-center text-primary border border-primary/10 group-hover/item:bg-primary/15 transition-all">
                      <Phone className="h-4.5 w-4.5" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs text-zinc-400 dark:text-zinc-500 font-medium uppercase tracking-wider font-semibold">Phone</p>
                      <a href="tel:+923185853847" className="text-sm font-semibold text-zinc-200 dark:text-zinc-300 hover:text-primary transition-colors truncate block">
                        +92-318-5853847
                      </a>
                    </div>
                  </div>
                  <button 
                    onClick={() => handleCopy("+92-318-5853847", "phone")}
                    className="h-8 w-8 rounded-lg bg-white/[0.03] dark:bg-zinc-900/50 flex items-center justify-center text-zinc-400 hover:text-white hover:bg-white/10 dark:hover:bg-zinc-800 transition-all ml-2 flex-shrink-0"
                    title="Copy Phone"
                  >
                    {copiedText === "phone" ? (
                      <Check className="h-4 w-4 text-green-500" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                  </button>
                </div>

                {/* Location Item */}
                <div className="group/item flex items-center p-3 rounded-xl bg-white/[0.02] dark:bg-black/20 border border-white/[0.03] dark:border-zinc-800/30 hover:border-primary/20 transition-all duration-200">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="h-9 w-9 rounded-lg bg-primary/5 flex items-center justify-center text-primary border border-primary/10">
                      <MapPin className="h-4.5 w-4.5" />
                    </div>
                    <div>
                      <p className="text-xs text-zinc-400 dark:text-zinc-500 font-medium uppercase tracking-wider font-semibold">Location</p>
                      <span className="text-sm font-semibold text-zinc-200 dark:text-zinc-300">
                        Bhara Kahu, Islamabad
                      </span>
                    </div>
                  </div>
                </div>

                {/* Website Item */}
                <div className="group/item flex items-center justify-between p-3 rounded-xl bg-white/[0.02] dark:bg-black/20 border border-white/[0.03] dark:border-zinc-800/30 hover:border-primary/30 transition-all duration-200">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="h-9 w-9 rounded-lg bg-primary/5 flex items-center justify-center text-primary border border-primary/10 group-hover/item:bg-primary/15 transition-all">
                      <Globe className="h-4.5 w-4.5" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs text-zinc-400 dark:text-zinc-500 font-medium uppercase tracking-wider font-semibold">Website</p>
                      <Link href="/" className="text-sm font-semibold text-zinc-200 dark:text-zinc-300 hover:text-primary transition-colors truncate block">
                        Talhatech.vercel.app
                      </Link>
                    </div>
                  </div>
                  <Link 
                    href="/"
                    className="h-8 w-8 rounded-lg bg-white/[0.03] dark:bg-zinc-900/50 flex items-center justify-center text-zinc-400 hover:text-white hover:bg-white/10 dark:hover:bg-zinc-800 transition-all ml-2 flex-shrink-0"
                    title="Visit Website"
                  >
                    <ExternalLink className="h-4 w-4" />
                  </Link>
                </div>

              </div>
              
              <hr className="border-white/5 dark:border-zinc-800/60 my-4" />
              
              {/* Social Connections */}
              <div className="space-y-3">
                <p className="text-xs text-zinc-400 dark:text-zinc-500 font-semibold uppercase tracking-wider">Social Channels</p>
                <div className="flex gap-3">
                  <a 
                    href="https://github.com/talhary" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-white/5 dark:bg-black/20 hover:bg-primary/10 border border-white/10 dark:border-zinc-800 hover:border-primary/30 hover:text-primary text-zinc-200 dark:text-zinc-300 text-sm font-semibold transition-all duration-200"
                  >
                    <Github className="h-4 w-4" />
                    <span>GitHub</span>
                  </a>
                </div>
              </div>
              
            </div>
          </div>
          
        </div>

      </div>
    </div>
  );
}