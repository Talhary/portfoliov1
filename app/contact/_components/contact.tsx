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
  MessageSquare,
  ChevronDown,
  Clock,
  Briefcase,
  HelpCircle
} from "lucide-react";
import { ContactForm } from '@/app/contact/_components/form';

const faqs = [
  {
    question: "Are you open to full-time software engineering roles?",
    answer: "Yes, absolutely! I am actively looking for full-time Full Stack Software Engineer opportunities. I am open to remote contracts globally or hybrid/on-site positions in Islamabad, Pakistan."
  },
  {
    question: "What are your primary technical skills and stacks?",
    answer: "My core expertise lies in the MERN stack (MongoDB, Express, React, Node.js) and Next.js (App Router, Server Components). I also have hands-on experience with PHP, relational databases like PostgreSQL and MySQL, and building bots or automated tools."
  },
  {
    question: "Can we collaborate on short-term freelance projects?",
    answer: "Yes, I offer freelance services for custom web application design, API integrations, and database optimizations. Drop a message with your project scope and timelines, and we can discuss further."
  },
  {
    question: "How fast do you respond to messages?",
    answer: "I generally reply to all emails and contact forms within 12 to 24 hours. For urgent business inquiries, you can reach out directly via my phone number or messaging channels."
  }
];

export default function Component() {
  const [copiedText, setCopiedText] = useState<string | null>(null);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(label);
    setTimeout(() => {
      setCopiedText(null);
    }, 2000);
  };

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  return (
    <div className="w-full max-w-6xl mx-auto px-2 sm:px-4 py-8 md:py-12 dark:text-gray-100 animate-fadeIn">
      {/* Primary Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch w-full">
        
        {/* Left Section: Form & FAQs (7 Columns) */}
        <div className="lg:col-span-7 flex flex-col gap-8 h-full">
          
          {/* Contact Form Card */}
          <div className="bg-white/5 dark:bg-[#1a1a1c]/60 border border-white/10 dark:border-zinc-800/80 backdrop-blur-xl rounded-2xl p-6 sm:p-8 shadow-2xl relative overflow-hidden transition-all duration-300 hover:border-primary/20 group">
            <div className="absolute top-0 right-0 -mr-16 -mt-16 w-32 h-32 bg-primary/10 rounded-full blur-3xl pointer-events-none" />
            
            <div className="space-y-6 relative z-10">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary border border-primary/20">
                  <MessageSquare className="h-5 w-5" />
                </div>
                <div>
                  <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white dark:text-zinc-100">Get in Touch</h2>
                  <p className="text-xs sm:text-sm text-zinc-400 dark:text-zinc-400 mt-1">
                    Have a question or want to work together? Drop a message!
                  </p>
                </div>
              </div>

              <hr className="border-white/5 dark:border-zinc-800/60 my-4" />

              <ContactForm />
            </div>
          </div>

          {/* FAQ Accordion Section */}
          <div className="bg-white/5 dark:bg-[#1a1a1c]/60 border border-white/10 dark:border-zinc-800/80 backdrop-blur-xl rounded-2xl p-6 sm:p-8 shadow-2xl relative overflow-hidden transition-all duration-300 hover:border-primary/20 group">
            <div className="flex items-center gap-3 mb-6">
              <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary border border-primary/20">
                <HelpCircle className="h-5 w-5" />
              </div>
              <div>
                <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white dark:text-zinc-100">Questions & Answers</h2>
                <p className="text-xs sm:text-sm text-zinc-400 dark:text-zinc-400 mt-1">
                  Common inquiries regarding availability and services.
                </p>
              </div>
            </div>

            <hr className="border-white/5 dark:border-zinc-800/60 my-4" />

            <div className="space-y-4">
              {faqs.map((faq, i) => (
                <div 
                  key={i} 
                  className="border-b border-white/5 dark:border-zinc-800/60 pb-4 last:border-b-0 last:pb-0"
                >
                  <button
                    type="button"
                    onClick={() => toggleFaq(i)}
                    className="flex justify-between items-center w-full text-left text-sm sm:text-base font-semibold text-white hover:text-primary transition-colors py-2 focus:outline-none"
                  >
                    <span>{faq.question}</span>
                    <ChevronDown 
                      className={`h-4.5 w-4.5 text-zinc-400 transition-transform duration-300 ${
                        openFaq === i ? "transform rotate-180 text-primary" : ""
                      }`} 
                    />
                  </button>
                  <div 
                    className={`grid transition-all duration-300 ease-in-out ${
                      openFaq === i ? "grid-rows-[1fr] opacity-100 mt-2" : "grid-rows-[0fr] opacity-0 overflow-hidden"
                    }`}
                  >
                    <div className="overflow-hidden">
                      <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed font-light pl-1 border-l-2 border-primary/30">
                        {faq.answer}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Right Section: Contact Info & Meta Cards (5 Columns) */}
        <div className="lg:col-span-5 flex flex-col gap-8 h-full">
          
          {/* Main Info Card */}
          <div className="bg-white/5 dark:bg-[#1a1a1c]/60 border border-white/10 dark:border-zinc-800/80 backdrop-blur-xl rounded-2xl p-6 sm:p-8 shadow-2xl relative overflow-hidden transition-all duration-300 hover:border-primary/20 group">
            <div className="absolute top-0 right-0 -mr-16 -mt-16 w-32 h-32 bg-primary/10 rounded-full blur-3xl pointer-events-none" />

            <div className="space-y-6 relative z-10">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary border border-primary/20">
                  <Phone className="h-5 w-5" />
                </div>
                <div>
                  <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white dark:text-zinc-100">Contact Details</h2>
                  <p className="text-xs sm:text-sm text-zinc-400 dark:text-zinc-400 mt-1">
                    Direct channels to get in touch.
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
                      <p className="text-[10px] text-zinc-400 dark:text-zinc-500 font-semibold uppercase tracking-wider">Email Address</p>
                      <a href="mailto:mtalhamaths@gmail.com" className="text-sm font-semibold text-zinc-250 dark:text-zinc-300 hover:text-primary transition-colors truncate block">
                        mtalhamaths@gmail.com
                      </a>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleCopy("mtalhamaths@gmail.com", "email")}
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
                      <p className="text-[10px] text-zinc-400 dark:text-zinc-500 font-semibold uppercase tracking-wider">Direct Phone</p>
                      <a href="tel:+923185853847" className="text-sm font-semibold text-zinc-250 dark:text-zinc-300 hover:text-primary transition-colors truncate block">
                        +92-318-5853847
                      </a>
                    </div>
                  </div>
                  <button
                    type="button"
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
                      <p className="text-[10px] text-zinc-400 dark:text-zinc-500 font-semibold uppercase tracking-wider">Base Location</p>
                      <span className="text-sm font-semibold text-zinc-250 dark:text-zinc-300">
                        Bhara Kahu, Islamabad, Pakistan
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
                      <p className="text-[10px] text-zinc-400 dark:text-zinc-500 font-semibold uppercase tracking-wider">Digital Domain</p>
                      <Link href="/" className="text-sm font-semibold text-zinc-250 dark:text-zinc-300 hover:text-primary transition-colors truncate block">
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

              {/* Social Channels */}
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
                    <span>GitHub Profile</span>
                  </a>
                </div>
              </div>

            </div>
          </div>

          {/* Timezone & Availability Card */}
          <div className="bg-white/5 dark:bg-[#1a1a1c]/60 border border-white/10 dark:border-zinc-800/80 backdrop-blur-xl rounded-2xl p-6 sm:p-8 shadow-2xl relative overflow-hidden transition-all duration-300 hover:border-primary/20 group">
            <div className="absolute top-0 right-0 -mr-16 -mt-16 w-32 h-32 bg-primary/10 rounded-full blur-3xl pointer-events-none" />

            <div className="space-y-4 relative z-10">
              <div className="flex items-center gap-3">
                <div className="h-9 w-9 rounded-xl bg-primary/10 flex items-center justify-center text-primary border border-primary/20">
                  <Clock className="h-4.5 w-4.5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">Availability Status</h3>
                </div>
              </div>

              <hr className="border-white/5 dark:border-zinc-800/60 my-2" />

              <div className="space-y-3 text-xs sm:text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-zinc-400 font-light">TimeZone:</span>
                  <span className="font-semibold text-white">GMT +5:00 (PKT)</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-zinc-400 font-light">Working Hours:</span>
                  <span className="font-semibold text-white">09:00 AM - 06:00 PM</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-zinc-400 font-light">Response Time:</span>
                  <span className="font-semibold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20 text-xs">
                    Under 24 Hours
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-zinc-400 font-light">Employment Status:</span>
                  <span className="font-semibold text-[#e49505] bg-[#e49505]/10 px-2 py-0.5 rounded border border-[#e49505]/20 text-xs flex items-center gap-1">
                    <Briefcase className="h-3 w-3" />
                    <span>Open for Hire</span>
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Styled Geographic Map Visualization */}
          <div className="bg-white/5 dark:bg-[#1a1a1c]/60 border border-white/10 dark:border-zinc-800/80 backdrop-blur-xl rounded-2xl p-4 shadow-2xl relative overflow-hidden transition-all duration-300 hover:border-primary/20 group/map">
            <div className="relative h-44 rounded-xl overflow-hidden border border-white/5 bg-black/40">
              {/* Decorative grid */}
              <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px] pointer-events-none" />
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-28 h-28 bg-primary/10 rounded-full blur-2xl pointer-events-none group-hover/map:bg-primary/20 transition-all duration-500" />
              
              {/* Pulsing visual indicator */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center gap-2">
                <span className="relative flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-primary"></span>
                </span>
                <span className="text-[10px] font-bold text-white bg-black/85 px-3 py-1 rounded-full border border-white/10 shadow-lg whitespace-nowrap tracking-wide select-none">
                  Bhara Kahu, Islamabad
                </span>
              </div>
              
              <div className="absolute bottom-2 left-2 bg-black/60 backdrop-blur-sm px-2 py-0.5 rounded text-[10px] text-zinc-400 border border-white/5">
                Pakistan Standard Time (PST)
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}