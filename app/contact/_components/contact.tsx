"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
// @ts-ignore
import { animate, stagger } from "animejs";
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

  const containerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [containerHeight, setContainerHeight] = useState<string>('100vh');

  useEffect(() => {
    const container = containerRef.current;
    const track = trackRef.current;
    if (!container || !track) return;

    const scrollMultiplier = 1.5; // Speed multiplier for snapper scroll experience

    const updateHeight = () => {
      const trackWidth = track.scrollWidth;
      const containerWidth = container.clientWidth;
      const viewportHeight = window.innerHeight;
      const maxTranslate = Math.max(0, trackWidth - containerWidth);
      const targetHeight = viewportHeight + (maxTranslate / scrollMultiplier);
      setContainerHeight(`${targetHeight}px`);
    };

    updateHeight();

    const handleScroll = () => {
      const rect = container.getBoundingClientRect();
      const viewHeight = window.innerHeight;
      const totalScrollable = rect.height - viewHeight;
      if (totalScrollable <= 0) return;

      const scrolled = -rect.top;
      const progress = Math.max(0, Math.min(1, scrolled / totalScrollable));

      const trackWidth = track.scrollWidth;
      const containerWidth = container.clientWidth;
      const maxTranslate = Math.max(0, trackWidth - containerWidth);
      const targetTranslate = -progress * maxTranslate;

      animate(track, {
        translateX: targetTranslate,
        duration: 200,
        ease: 'easeOutQuad'
      });

      const progressBar = document.querySelector('.contact-progress-bar');
      if (progressBar) {
        animate(progressBar, {
          width: `${progress * 100}%`,
          duration: 100,
          ease: 'linear'
        });
      }
    };

    window.addEventListener("scroll", handleScroll);
    window.addEventListener("resize", handleScroll);
    window.addEventListener("resize", updateHeight);
    handleScroll();

    // Trigger initial stagger animations on load for form and info elements
    animate('.animate-slide-in', {
      opacity: [0, 1],
      translateY: [40, 0],
      delay: stagger(100),
      duration: 1000,
      ease: 'easeOutElastic(1, .8)'
    });

    const timeout = setTimeout(updateHeight, 350);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
      window.removeEventListener("resize", updateHeight);
    };
  }, []);

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
    <div
      ref={containerRef}
      style={{ height: containerHeight }}
      className="relative">
      <div

        className="w-full sticky top-0">
        {/* Desktop Horizontal Scroll Layout */}
        <div

          className="hidden lg:block relative w-full bg-transparent max-w-full overflow-hidden"
        >
          {/* Sticky viewport container */}
          <div className="sticky top-0 h-screen w-full overflow-hidden flex flex-col justify-center">

            {/* Header Title inside viewport */}
            <div className="absolute top-16 left-12 z-20">
              <span className="text-xs font-bold uppercase tracking-widest text-[#e49505] bg-[#e49505]/10 px-3 py-1 rounded-full">Interactive Workspace</span>
              <h2 className="text-3xl font-extrabold text-zinc-900 dark:text-white mt-2">Let&apos;s Build Something Incredible</h2>
            </div>

            {/* Horizontal Track container */}
            <div
              ref={trackRef}
              className="flex flex-row items-stretch gap-8 px-12 w-max max-h-[70vh] relative z-10"
            >
              {/* Section 1: Contact Form Card */}
              <div className="animate-slide-in w-[45vw] min-w-[500px] bg-zinc-50 dark:bg-[#1a1a1c]/60 border border-zinc-200 dark:border-zinc-800/80 dark:backdrop-blur-xl rounded-2xl p-8 shadow-sm dark:shadow-2xl relative overflow-hidden transition-all duration-300 hover:border-primary/20 flex flex-col justify-between">
                <div className="absolute top-0 right-0 -mr-16 -mt-16 w-32 h-32 bg-primary/10 rounded-full blur-3xl pointer-events-none" />
                <div className="space-y-6 relative z-10">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary border border-primary/20">
                      <MessageSquare className="h-5 w-5" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">Get in Touch</h2>
                      <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">Have a project in mind? Drop a message!</p>
                    </div>
                  </div>
                  <hr className="border-zinc-200 dark:border-zinc-800/60 my-4" />
                  <ContactForm />
                </div>
              </div>

              {/* Section 2: Contact Info & Status */}
              <div className="animate-slide-in w-[35vw] min-w-[400px] flex flex-col gap-6">

                {/* Contact Details Card */}
                <div className="flex-1 bg-zinc-50 dark:bg-[#1a1a1c]/60 border border-zinc-200 dark:border-zinc-800/80 dark:backdrop-blur-xl rounded-2xl p-6 shadow-sm dark:shadow-2xl relative overflow-hidden transition-all duration-300 hover:border-primary/20">
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
                </div>

                {/* Status & Availability Card */}
                <div className="bg-zinc-50 dark:bg-[#1a1a1c]/60 border border-zinc-200 dark:border-zinc-800/80 dark:backdrop-blur-xl rounded-2xl p-5 shadow-sm dark:shadow-2xl relative overflow-hidden transition-all duration-300 hover:border-primary/20">
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
                </div>

              </div>

              {/* Section 3: FAQs & Geography */}
              <div className="animate-slide-in w-[45vw] min-w-[500px] flex flex-col gap-6">

                {/* FAQs Card */}
                <div className="flex-1 bg-zinc-50 dark:bg-[#1a1a1c]/60 border border-zinc-200 dark:border-zinc-800/80 dark:backdrop-blur-xl rounded-2xl p-6 shadow-sm dark:shadow-2xl relative overflow-hidden transition-all duration-300 hover:border-primary/20">
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
                </div>

                {/* Map Card */}
                <div className="bg-zinc-50 dark:bg-[#1a1a1c]/60 border border-zinc-200 dark:border-zinc-800/80 dark:backdrop-blur-xl rounded-2xl p-3.5 shadow-sm dark:shadow-2xl relative overflow-hidden transition-all duration-300 hover:border-primary/20 group/map">
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
                </div>

              </div>
            </div>

            {/* Progress Scroll Indicator */}
            <div className="absolute bottom-16 left-12 right-12 h-1 bg-zinc-200 dark:bg-zinc-800 rounded-full overflow-hidden">
              <div className="contact-progress-bar h-full bg-[#e49505] w-0" />
            </div>

          </div>
        </div>

        {/* Mobile Standard Stack Layout */}
        <div className="block lg:hidden w-full max-w-4xl mx-auto px-4 py-6 dark:text-gray-100 space-y-6">
          <div className="bg-zinc-50 dark:bg-[#1a1a1c]/60 border border-zinc-200 dark:border-zinc-800/80 rounded-2xl p-6 shadow-sm">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <MessageSquare className="h-5 w-5 text-primary" />
                <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-100">Get in Touch</h2>
              </div>
              <hr className="border-zinc-200 dark:border-zinc-800/60" />
              <ContactForm />
            </div>
          </div>

          <div className="bg-zinc-50 dark:bg-[#1a1a1c]/60 border border-zinc-200 dark:border-zinc-800/80 rounded-2xl p-6 shadow-sm space-y-4">
            <div className="flex items-center gap-3">
              <Phone className="h-5 w-5 text-primary" />
              <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-100">Contact Details</h2>
            </div>
            <hr className="border-zinc-200 dark:border-zinc-800/60" />
            <div className="space-y-3">
              {/* Email */}
              <div className="flex items-center justify-between p-3 rounded-xl bg-zinc-100/50 dark:bg-black/20 border border-zinc-200/50 dark:border-zinc-800/30">
                <div className="flex items-center gap-3">
                  <Mail className="h-4.5 w-4.5 text-[#e49505]" />
                  <div>
                    <p className="text-[10px] text-zinc-500 font-semibold uppercase">Email</p>
                    <a href="mailto:mtalhamaths@gmail.com" className="text-sm font-semibold text-zinc-800 dark:text-zinc-300">mtalhamaths@gmail.com</a>
                  </div>
                </div>
              </div>
              {/* Phone */}
              <div className="flex items-center justify-between p-3 rounded-xl bg-zinc-100/50 dark:bg-black/20 border border-zinc-200/50 dark:border-zinc-800/30">
                <div className="flex items-center gap-3">
                  <Phone className="h-4.5 w-4.5 text-[#e49505]" />
                  <div>
                    <p className="text-[10px] text-zinc-500 font-semibold uppercase">Phone</p>
                    <a href="tel:+923185853847" className="text-sm font-semibold text-zinc-800 dark:text-zinc-300">+92-318-5853847</a>
                  </div>
                </div>
              </div>
              {/* Location */}
              <div className="flex items-center p-3 rounded-xl bg-zinc-100/50 dark:bg-black/20 border border-zinc-200/50 dark:border-zinc-800/30">
                <div className="flex items-center gap-3">
                  <MapPin className="h-4.5 w-4.5 text-[#e49505]" />
                  <div>
                    <p className="text-[10px] text-zinc-500 font-semibold uppercase">Location</p>
                    <span className="text-sm font-semibold text-zinc-800 dark:text-zinc-300">Bhara Kahu, Islamabad, Pakistan</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}