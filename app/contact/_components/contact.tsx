"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Phone,
  Mail,
  Globe,
  MapPin,
  Copy,
  Check,
  ExternalLink,
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
    answer: "My core expertise lies in the MERN stack (MongoDB, Express, React, Node.js) and Next.js (App Router, Server Components). I also have hands-on experience with relational databases like PostgreSQL and MySQL, and building bots or automated tools."
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

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.1,
      duration: 0.6,
      ease: [0.21, 1.02, 0.43, 1.01]
    }
  })
};

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
    <div className="w-full max-w-6xl mx-auto px-4 py-8">
      {/* Grid container: 1 column on mobile/tablet, 2 columns on desktop */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Contact Form (takes 7 cols of 12 on desktop) */}
        <motion.div
          custom={0}
          initial="hidden"
          animate="visible"
          variants={cardVariants}
          className="lg:col-span-7 bg-zinc-50 dark:bg-[#1a1a1c]/60 border border-zinc-200 dark:border-zinc-800/80 dark:backdrop-blur-xl rounded-2xl p-6 sm:p-8 shadow-sm dark:shadow-2xl relative overflow-hidden transition-all duration-300 hover:border-primary/20 flex flex-col"
        >
          <div className="absolute top-0 right-0 -mr-16 -mt-16 w-32 h-32 bg-primary/10 rounded-full blur-3xl pointer-events-none" />
          <div className="space-y-6 relative z-10 flex-1">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary border border-primary/20">
                <MessageSquare className="h-5 w-5" />
              </div>
              <div>
                <h2 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">Get in Touch</h2>
                <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">Have a project in mind or want to hire me? Drop a message!</p>
              </div>
            </div>
            <hr className="border-zinc-200 dark:border-zinc-800/60 my-4" />
            <ContactForm />
          </div>
        </motion.div>

        {/* Right Column: Contact Details, FAQ, Status, and Map (takes 5 cols of 12 on desktop) */}
        <div className="lg:col-span-5 flex flex-col gap-6">
          
          {/* Contact Details Card */}
          <motion.div
            custom={1}
            initial="hidden"
            animate="visible"
            variants={cardVariants}
            className="bg-zinc-50 dark:bg-[#1a1a1c]/60 border border-zinc-200 dark:border-zinc-800/80 dark:backdrop-blur-xl rounded-2xl p-6 shadow-sm dark:shadow-2xl relative overflow-hidden transition-all duration-300 hover:border-primary/20"
          >
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="h-9 w-9 rounded-xl bg-primary/10 flex items-center justify-center text-primary border border-primary/20">
                  <Phone className="h-4.5 w-4.5" />
                </div>
                <h2 className="text-lg font-bold text-zinc-900 dark:text-zinc-100">Contact Details</h2>
              </div>
              <hr className="border-zinc-200 dark:border-zinc-800/60" />
              <div className="space-y-3">
                {/* Email */}
                <div className="group/item flex items-center justify-between p-2.5 rounded-xl bg-zinc-100/50 dark:bg-black/20 border border-zinc-200/50 dark:border-zinc-800/30 hover:border-primary/30 transition-all duration-200">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="h-8 w-8 rounded-lg bg-zinc-200/50 dark:bg-primary/5 flex items-center justify-center text-[#e49505] border border-zinc-300/50 dark:border-primary/10">
                      <Mail className="h-4 w-4" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-[9px] text-zinc-500 font-semibold uppercase tracking-wider">Email Address</p>
                      <a href="mailto:mtalhamaths@gmail.com" className="text-xs font-semibold text-zinc-800 dark:text-zinc-300 hover:text-primary truncate block">mtalhamaths@gmail.com</a>
                    </div>
                  </div>
                  <button type="button" onClick={() => handleCopy("mtalhamaths@gmail.com", "email")} className="h-7 w-7 rounded-lg bg-zinc-250 dark:bg-zinc-900/50 flex items-center justify-center text-zinc-500 hover:text-primary transition-all">
                    {copiedText === "email" ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
                  </button>
                </div>
                {/* Phone */}
                <div className="group/item flex items-center justify-between p-2.5 rounded-xl bg-zinc-100/50 dark:bg-black/20 border border-zinc-200/50 dark:border-zinc-800/30 hover:border-primary/30 transition-all duration-200">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="h-8 w-8 rounded-lg bg-zinc-200/50 dark:bg-primary/5 flex items-center justify-center text-[#e49505] border border-zinc-300/50 dark:border-primary/10">
                      <Phone className="h-4 w-4" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-[9px] text-zinc-500 font-semibold uppercase tracking-wider">Direct Phone</p>
                      <a href="tel:+923185853847" className="text-xs font-semibold text-zinc-800 dark:text-zinc-300 hover:text-primary truncate block">+92-318-5853847</a>
                    </div>
                  </div>
                  <button type="button" onClick={() => handleCopy("+92-318-5853847", "phone")} className="h-7 w-7 rounded-lg bg-zinc-250 dark:bg-zinc-900/50 flex items-center justify-center text-zinc-500 hover:text-primary transition-all">
                    {copiedText === "phone" ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
                  </button>
                </div>
                {/* Website */}
                <div className="group/item flex items-center justify-between p-2.5 rounded-xl bg-zinc-100/50 dark:bg-black/20 border border-zinc-200/50 dark:border-zinc-800/30 hover:border-primary/30 transition-all duration-200">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="h-8 w-8 rounded-lg bg-zinc-200/50 dark:bg-primary/5 flex items-center justify-center text-[#e49505] border border-zinc-300/50 dark:border-primary/10">
                      <Globe className="h-4 w-4" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-[9px] text-zinc-500 font-semibold uppercase tracking-wider">Digital Domain</p>
                      <Link href="/" className="text-xs font-semibold text-zinc-800 dark:text-zinc-300 hover:text-primary truncate block">talhacodes.site</Link>
                    </div>
                  </div>
                  <Link href="/" className="h-7 w-7 rounded-lg bg-zinc-250 dark:bg-zinc-900/50 flex items-center justify-center text-zinc-500 hover:text-primary transition-all">
                    <ExternalLink className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Status & Availability Card */}
          <motion.div
            custom={2}
            initial="hidden"
            animate="visible"
            variants={cardVariants}
            className="bg-zinc-50 dark:bg-[#1a1a1c]/60 border border-zinc-200 dark:border-zinc-800/80 dark:backdrop-blur-xl rounded-2xl p-5 shadow-sm dark:shadow-2xl relative overflow-hidden transition-all duration-300 hover:border-primary/20"
          >
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-xl bg-primary/10 flex items-center justify-center text-primary border border-primary/20">
                  <Clock className="h-4 w-4" />
                </div>
                <h3 className="text-sm font-bold text-zinc-900 dark:text-white">Status</h3>
              </div>
              <hr className="border-zinc-200 dark:border-zinc-800/60" />
              <div className="space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-zinc-500">TimeZone:</span>
                  <span className="font-semibold text-zinc-800 dark:text-white">GMT +5 (PKT)</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-zinc-500">Employment Status:</span>
                  <span className="font-semibold text-[#e49505] bg-[#e49505]/10 px-2 py-0.5 rounded border border-[#e49505]/20 text-[10px] flex items-center gap-1">
                    <Briefcase className="h-2.5 w-2.5" />
                    <span>Open for Hire</span>
                  </span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* FAQs Card */}
          <motion.div
            custom={3}
            initial="hidden"
            animate="visible"
            variants={cardVariants}
            className="bg-zinc-50 dark:bg-[#1a1a1c]/60 border border-zinc-200 dark:border-zinc-800/80 dark:backdrop-blur-xl rounded-2xl p-6 shadow-sm dark:shadow-2xl relative overflow-hidden transition-all duration-300 hover:border-primary/20"
          >
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="h-9 w-9 rounded-xl bg-primary/10 flex items-center justify-center text-primary border border-primary/20">
                  <HelpCircle className="h-4.5 w-4.5" />
                </div>
                <h2 className="text-lg font-bold text-zinc-900 dark:text-zinc-100">FAQ</h2>
              </div>
              <hr className="border-zinc-200 dark:border-zinc-800/60" />
              <div className="space-y-2.5 max-h-[35vh] overflow-y-auto pr-2 custom-scrollbar">
                {faqs.map((faq, i) => (
                  <div key={i} className="border-b border-zinc-200 dark:border-zinc-800/60 pb-2 last:border-b-0">
                    <button type="button" onClick={() => toggleFaq(i)} className="flex justify-between items-center w-full text-left text-xs font-semibold text-zinc-800 dark:text-white hover:text-primary transition-colors py-1">
                      <span>{faq.question}</span>
                      <ChevronDown className={`h-3.5 w-3.5 text-zinc-400 transition-transform duration-300 ${openFaq === i ? "transform rotate-180 text-primary" : ""}`} />
                    </button>
                    {openFaq === i && (
                      <p className="text-xs text-zinc-500 leading-relaxed font-light pl-2 border-l border-primary/30 mt-1">
                        {faq.answer}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Map Card */}
          <motion.div
            custom={4}
            initial="hidden"
            animate="visible"
            variants={cardVariants}
            className="bg-zinc-50 dark:bg-[#1a1a1c]/60 border border-zinc-200 dark:border-zinc-800/80 dark:backdrop-blur-xl rounded-2xl p-3.5 shadow-sm dark:shadow-2xl relative overflow-hidden transition-all duration-300 hover:border-primary/20 group/map"
          >
            <div className="relative h-28 rounded-xl overflow-hidden bg-black/40">
              <div className="absolute inset-0 bg-[radial-gradient(#e49505_1px,transparent_1px)] [background-size:12px_12px] opacity-10" />
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center gap-1.5">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-primary"></span>
                </span>
                <span className="text-[9px] font-bold text-white bg-black/85 px-2.5 py-0.5 rounded-full border border-white/10 shadow-lg whitespace-nowrap">
                  Islamabad, Pakistan
                </span>
              </div>
            </div>
          </motion.div>

        </div>
      </div>
    </div>
  );
}