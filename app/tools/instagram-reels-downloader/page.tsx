import React from 'react';
import { Metadata } from 'next';
import { Heading } from '@/components/heading';
import DownloaderForm from './_components/downloader-form';
import { Shield, Zap, Video, HelpCircle, FileText, AlertCircle } from 'lucide-react';
import Link from 'next/link';

export const metadata: Metadata = {
  title: "Free Instagram Reels Downloader | HD Video Saver - Talha Codes",
  description: "Download Instagram Reels, videos, and photos online in high-quality HD for free. Fast, secure, anonymous, and no login required.",
  keywords: [
    "Instagram Reels Downloader",
    "Download Instagram Reels",
    "Save IG Reels",
    "Instagram Video Downloader",
    "Instagram Saver",
    "Free IG Downloader",
    "Talha Codes Tools"
  ],
  openGraph: {
    title: "Free Instagram Reels Downloader | HD Video Saver - Talha Codes",
    description: "Download Instagram Reels, videos, and photos online in high-quality HD for free. Fast, secure, anonymous, and no login required.",
    type: "website",
    url: "https://talhacodes.site/tools/instagram-reels-downloader",
  }
};

export default function InstagramDownloaderPage() {
  const faqs = [
    {
      question: "How do I download Instagram Reels using this tool?",
      answer: "Simply copy the URL of the Instagram Reel you want to download, paste it into the input field at the bottom of this page, and click 'Download Video'. The tool will process the video and start downloading it directly in your browser."
    },
    {
      question: "Is it free to download Instagram videos?",
      answer: "Yes, our downloader tool is 100% free to use. There are no limits on the number of videos or reels you can download."
    },
    {
      question: "Do I need to log in to my Instagram account?",
      answer: "No, you do not need to log in or register. We do not require any personal details or credentials to download public Instagram media."
    },
    {
      question: "Can I download private Instagram Reels or stories?",
      answer: "No, this downloader only supports public Instagram media. If an account is set to private, the reels and videos cannot be fetched due to security and privacy guidelines."
    },
    {
      question: "Where are the downloaded videos saved?",
      answer: "Videos are saved to your device's default download folder (e.g., the Downloads folder on Windows, macOS, Android, or iOS) unless you specify a different path in your browser settings."
    }
  ];

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-8 text-zinc-800 dark:text-gray-100 animate-fadeIn space-y-12">
      <div className="pr-16 md:pr-0 md:max-w-[55%] lg:max-w-[65%] xl:max-w-[70%]">
        <Heading title="Instagram Reels Downloader" />
        <p className="text-zinc-600 dark:text-zinc-400 font-light mt-2 leading-relaxed">
          Save your favorite Instagram Reels and videos directly to your device in high-definition (HD) quality. Fast, safe, and completely anonymous.
        </p>
      </div>

      {/* Downloader Section at the top */}
      <section className="space-y-4">
        <DownloaderForm />
      </section>

      {/* Ad slot placeholder for monetization */}
      <div className="w-full p-4 border border-dashed border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-black/10 rounded-2xl flex flex-col items-center justify-center text-center min-h-[100px] select-none">
        <span className="text-[10px] uppercase tracking-widest text-zinc-400 dark:text-zinc-600 font-bold mb-1">Advertisement</span>
        <div className="text-xs text-zinc-400/80 dark:text-zinc-500 font-light">
          Google AdSense responsive banner unit will be displayed here
        </div>
      </div>

      {/* Features Grid */}
      <section className="space-y-6">
        <h2 className="text-2xl font-bold text-zinc-900 dark:text-white flex items-center gap-2">
          <Zap className="text-primary h-6 w-6" /> Key Features
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-5 rounded-2xl bg-zinc-50 dark:bg-card-bg-3 border border-zinc-200 dark:border-white/5 hover:border-primary/20 dark:hover:border-primary/20 transition-all duration-300">
            <div className="h-10 w-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary mb-4">
              <Zap className="h-5 w-5" />
            </div>
            <h3 className="font-semibold text-lg mb-2">High-Speed Downloads</h3>
            <p className="text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed font-light">
              Fetch and download videos in a matter of seconds. High-speed backend pipeline processes media queries instantly.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-zinc-50 dark:bg-card-bg-3 border border-zinc-200 dark:border-white/5 hover:border-primary/20 dark:hover:border-primary/20 transition-all duration-300">
            <div className="h-10 w-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary mb-4">
              <Video className="h-5 w-5" />
            </div>
            <h3 className="font-semibold text-lg mb-2">HD Quality Preserved</h3>
            <p className="text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed font-light">
              Get raw MP4 videos directly from Instagram CDN matching the original resolution and bitrate.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-zinc-50 dark:bg-card-bg-3 border border-zinc-200 dark:border-white/5 hover:border-primary/20 dark:hover:border-primary/20 transition-all duration-300">
            <div className="h-10 w-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary mb-4">
              <Shield className="h-5 w-5" />
            </div>
            <h3 className="font-semibold text-lg mb-2">Private & Secure</h3>
            <p className="text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed font-light">
              We value your privacy. No registration, no login, and no logs stored. Downloading is completely anonymous.
            </p>
          </div>
        </div>
      </section>

      {/* Steps to Download */}
      <section className="space-y-6">
        <h2 className="text-2xl font-bold text-zinc-900 dark:text-white flex items-center gap-2">
          <HelpCircle className="text-primary h-6 w-6" /> How to Save Instagram Reels
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
          <div className="space-y-2">
            <div className="h-8 w-8 rounded-full bg-primary/10 border border-primary/20 text-primary mx-auto flex items-center justify-center font-bold text-sm">1</div>
            <h4 className="font-semibold">Copy Video URL</h4>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 font-light leading-relaxed">Open Instagram app or website, locate the reel, tap the share icon, and select "Copy Link".</p>
          </div>
          <div className="space-y-2">
            <div className="h-8 w-8 rounded-full bg-primary/10 border border-primary/20 text-primary mx-auto flex items-center justify-center font-bold text-sm">2</div>
            <h4 className="font-semibold">Paste into Form</h4>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 font-light leading-relaxed">Scroll to the downloader section, paste the copied link into the URL box, and click download.</p>
          </div>
          <div className="space-y-2">
            <div className="h-8 w-8 rounded-full bg-primary/10 border border-primary/20 text-primary mx-auto flex items-center justify-center font-bold text-sm">3</div>
            <h4 className="font-semibold">Save File</h4>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 font-light leading-relaxed">The video is streamed directly through our secure servers, saving the MP4 directly to your device.</p>
          </div>
        </div>
      </section>

      {/* Ad slot placeholder for monetization */}
      <div className="w-full p-4 border border-dashed border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-black/10 rounded-2xl flex flex-col items-center justify-center text-center min-h-[100px] select-none">
        <span className="text-[10px] uppercase tracking-widest text-zinc-400 dark:text-zinc-600 font-bold mb-1">Advertisement</span>
        <div className="text-xs text-zinc-400/80 dark:text-zinc-500 font-light">
          Google AdSense in-feed unit will be displayed here
        </div>
      </div>

      {/* Terms & Copyright Statement */}
      <section className="space-y-6 p-6 rounded-2xl border border-zinc-250 dark:border-zinc-800/80 bg-zinc-100/30 dark:bg-black/25">
        <h2 className="text-xl font-bold text-zinc-900 dark:text-white flex items-center gap-2">
          <FileText className="text-primary h-5 w-5" /> Terms of Service & Disclaimer
        </h2>
        <div className="space-y-4 text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 font-light leading-relaxed">
          <p>
            By using this website and the Instagram Reels Downloader tool, you agree to comply with our Terms of Service and acknowledge the terms of use.
          </p>
          <ul className="list-disc list-inside space-y-2 pl-2">
            <li><strong>Personal Use Only:</strong> This tool is designed purely for personal use to review, evaluate, or offline-view public social media content. You must not use it for commercial reuse or redistribution.</li>
            <li><strong>Intellectual Property & Copyrights:</strong> We respect all intellectual property rights. You are solely responsible for respecting the copyright of the content creators. Downloading copyrighted material without permission from the original authors may violate intellectual property laws in your jurisdiction.</li>
            <li><strong>Independent Tool:</strong> This tool is completely independent. It is not affiliated, sponsored, associated, or endorsed by Instagram, Meta Platforms, Inc., or any of their parent companies, subsidiaries, or affiliates.</li>
            <li><strong>Zero Storage Policy:</strong> We do not store, catalog, host, or cache any downloaded video contents or user links on our servers. All video downloads are processed directly by fetching raw streams from public sources and serving them in real-time.</li>
          </ul>
        </div>
      </section>

      {/* FAQ Accordion */}
      <section className="space-y-6">
        <h2 className="text-2xl font-bold text-zinc-900 dark:text-white flex items-center gap-2">
          <HelpCircle className="text-primary h-6 w-6" /> Frequently Asked Questions (FAQ)
        </h2>
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div 
              key={index} 
              className="p-5 rounded-2xl bg-zinc-50 dark:bg-card-bg-3 border border-zinc-200 dark:border-white/5 space-y-2"
            >
              <h3 className="font-semibold text-base sm:text-lg text-zinc-900 dark:text-white">{faq.question}</h3>
              <p className="text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed font-light">{faq.answer}</p>
            </div>
          ))}
        </div>
      </section>


      {/* Final Ad unit */}
      <div className="w-full p-4 border border-dashed border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-black/10 rounded-2xl flex flex-col items-center justify-center text-center min-h-[100px] select-none">
        <span className="text-[10px] uppercase tracking-widest text-zinc-400 dark:text-zinc-600 font-bold mb-1">Advertisement</span>
        <div className="text-xs text-zinc-400/80 dark:text-zinc-500 font-light">
          Google AdSense responsive link unit will be displayed here
        </div>
      </div>

      {/* SEO Schema Markup */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "mainEntity": faqs.map(faq => ({
              "@type": "Question",
              "name": faq.question,
              "acceptedAnswer": {
                "@type": "Answer",
                "text": faq.answer
              }
            }))
          })
        }}
      />
    </div>
  );
}
