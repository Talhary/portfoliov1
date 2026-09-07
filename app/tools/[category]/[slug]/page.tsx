import { Metadata } from 'next';
import { getToolBySlug } from '@/lib/tools/registry';
import { getToolSeoContent } from '@/lib/tools/seo-content';
import { ToolClientContainer } from '@/components/tools/ToolClientContainer';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import {
  FiArrowLeft,
  FiCpu,
  FiStar,
  FiShield,
  FiZap,
  FiLock,
  FiLayers,
  FiBriefcase,
  FiList,
  FiHelpCircle,
  FiArrowRight,
  FiInfo,
  FiCheckCircle,
  FiAlertCircle,
  FiBookOpen,
  FiSliders,
} from 'react-icons/fi';

interface Props {
  params: Promise<{ category: string; slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug, category } = await params;
  const tool = getToolBySlug(slug);

  if (!tool) {
    return {
      title: 'Tool Not Found | Talha Codes',
    };
  }

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://talhacodes.site';
  const pageUrl = `${baseUrl}/tools/${category}/${slug}`;

  return {
    title: `${tool.title} - Free Online Utility & Developer Tool`,
    description: `${tool.description} Fast, secure, and privacy-focused online tool with zero data logging, instant output, and full documentation.`,
    keywords: [...tool.tags, tool.category, 'developer tool', 'online utility', 'free tool', tool.title, 'how to use ' + tool.title],
    alternates: {
      canonical: pageUrl,
    },
    openGraph: {
      title: `${tool.title} - Online Developer Tool`,
      description: tool.description,
      url: pageUrl,
      type: 'website',
      siteName: 'Talha Codes Developer Tools',
    },
    twitter: {
      card: 'summary_large_image',
      title: tool.title,
      description: tool.description,
    },
  };
}

export default async function DynamicToolPage({ params }: Props) {
  const { slug } = await params;
  const tool = getToolBySlug(slug);

  if (!tool) {
    notFound();
  }

  const seo = getToolSeoContent(tool);

  return (
    <div className="w-full min-h-screen py-2 sm:py-10 px-0 sm:px-8 lg:px-16 max-w-[1400px] mx-auto space-y-6 sm:space-y-10">
      {/* JSON-LD Structured Data Schema Injections (WebApplication, FAQPage, HowTo) */}
      {seo.schemaMarkup.map((schema, idx) => (
        <script
          key={idx}
          type="application/ld+json"
          // Values are registry-derived, not request-derived. `<` is escaped so a
          // future string containing `</script>` cannot break out of the block.
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(schema).replace(/</g, '\\u003c'),
          }}
        />
      ))}

      {/* SSR Breadcrumb */}
      <nav aria-label="Breadcrumb" className="px-3 sm:px-0">
        <Link
          href="/tools"
          className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-stone-500 dark:text-zinc-400 hover:text-primary transition-colors"
        >
          <FiArrowLeft size={14} /> Back to All Tools
        </Link>
      </nav>

      {/* Main Interactive Tool Container */}
      <article className="bg-white dark:bg-zinc-900/60 border-y sm:border border-stone-200 dark:border-zinc-800 rounded-none sm:rounded-3xl p-3.5 sm:p-8 shadow-none sm:shadow-xl backdrop-blur-md">
        {/* SSR Header & Meta */}
        <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4 pb-4 border-b border-stone-100 dark:border-zinc-800">
          <div>
            <span className="text-xs uppercase font-bold text-primary tracking-wider px-2.5 py-0.5 rounded-full bg-primary/10 border border-primary/20">
              {tool.category.replace(/-/g, ' ')}
            </span>
            <h1 className="text-2xl sm:text-4xl font-black text-stone-900 dark:text-white tracking-tight mt-2">
              {tool.title}
            </h1>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            {tool.isNew && (
              <span className="inline-flex items-center gap-1 text-xs font-bold text-amber-500 bg-amber-500/10 border border-amber-500/20 px-3 py-1 rounded-full uppercase">
                <FiStar size={12} /> New
              </span>
            )}
            {tool.isAsync && (
              <span className="inline-flex items-center gap-1 text-xs font-bold text-blue-500 bg-blue-500/10 border border-blue-500/20 px-3 py-1 rounded-full uppercase">
                <FiCpu size={12} /> Job Engine
              </span>
            )}
          </div>
        </header>

        {/* SSR Description */}
        <section aria-label="Tool Overview" className="mb-6 sm:mb-8">
          <p className="text-stone-600 dark:text-zinc-300 text-sm sm:text-base leading-relaxed">
            {tool.description}
          </p>
        </section>

        {/* Interactive Tool Widget */}
        <section aria-label="Interactive Tool Widget" className="mt-4 sm:mt-6">
          <ToolClientContainer tool={tool} />
        </section>
      </article>

      {/* SEO Section 1: Detailed Technical Overview & Architecture */}
      <section className="bg-white dark:bg-zinc-900/40 border-y sm:border border-stone-200 dark:border-zinc-800/80 rounded-none sm:rounded-3xl p-4 sm:p-8 space-y-4">
        <h2 className="text-xl sm:text-2xl font-black text-stone-900 dark:text-white flex items-center gap-2.5">
          <FiInfo className="text-primary" /> Comprehensive Guide: {tool.title}
        </h2>
        <div className="space-y-3 text-stone-600 dark:text-zinc-300 text-sm leading-relaxed">
          {seo.longDescription.map((paragraph, idx) => (
            <p key={idx}>{paragraph}</p>
          ))}
        </div>

        <div className="pt-6 border-t border-stone-100 dark:border-zinc-800 space-y-3">
          <h3 className="text-base sm:text-lg font-bold text-stone-900 dark:text-white flex items-center gap-2">
            <FiLayers className="text-blue-500" /> Technical Execution & Underlying Architecture
          </h3>
          <div className="space-y-2.5 text-xs sm:text-sm text-stone-600 dark:text-zinc-400 leading-relaxed">
            {seo.technicalOverview.map((p, idx) => (
              <p key={idx}>{p}</p>
            ))}
          </div>
        </div>
      </section>

      {/* SEO Section 2: Core Features & Capabilities Matrix */}
      <section className="bg-white dark:bg-zinc-900/40 border-y sm:border border-stone-200 dark:border-zinc-800/80 rounded-none sm:rounded-3xl p-4 sm:p-8 space-y-6">
        <h2 className="text-xl sm:text-2xl font-black text-stone-900 dark:text-white flex items-center gap-2.5">
          <FiZap className="text-amber-500" /> Core Features & Technical Capabilities
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {seo.features.map((feature, idx) => (
            <div
              key={idx}
              className="p-4 bg-stone-50 dark:bg-zinc-950 border border-stone-100 dark:border-zinc-800 rounded-2xl space-y-2 flex flex-col justify-between"
            >
              <div>
                <span className="font-bold text-stone-900 dark:text-white text-sm flex items-center gap-2 mb-1">
                  <FiCheckCircle className="text-emerald-500 shrink-0" size={16} /> {feature.title}
                </span>
                <p className="text-xs text-stone-600 dark:text-zinc-400 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* SEO Section 3: Data Privacy, Security & Compliance */}
      <section className="bg-white dark:bg-zinc-900/40 border-y sm:border border-stone-200 dark:border-zinc-800/80 rounded-none sm:rounded-3xl p-4 sm:p-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-stone-100 dark:border-zinc-800 pb-4">
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-stone-900 dark:text-white flex items-center gap-2.5">
              <FiShield className="text-emerald-500" /> Data Security, Privacy & Compliance Policy
            </h2>
            <p className="text-xs sm:text-sm text-stone-500 dark:text-zinc-400 mt-1">
              Your data remains 100% confidential under our zero-retention, client-side encryption architecture.
            </p>
          </div>
          <span className="self-start sm:self-center px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs font-bold rounded-full font-mono uppercase">
            Zero Data Logs
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {seo.privacyPillars.map((pillar, idx) => (
            <div
              key={idx}
              className="p-4 bg-stone-50 dark:bg-zinc-950 border border-stone-100 dark:border-zinc-800 rounded-2xl space-y-2"
            >
              <div className="flex items-center justify-between">
                <span className="font-bold text-stone-900 dark:text-white text-sm flex items-center gap-2">
                  <FiLock className="text-emerald-500 shrink-0" size={16} /> {pillar.title}
                </span>
                <span className="text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded bg-stone-200 dark:bg-zinc-800 text-stone-700 dark:text-zinc-300">
                  {pillar.badge}
                </span>
              </div>
              <p className="text-xs text-stone-600 dark:text-zinc-400 leading-relaxed">
                {pillar.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* SEO Section 4: Practical Industry Use Cases */}
      <section className="bg-white dark:bg-zinc-900/40 border-y sm:border border-stone-200 dark:border-zinc-800/80 rounded-none sm:rounded-3xl p-4 sm:p-8 space-y-6">
        <h2 className="text-xl sm:text-2xl font-black text-stone-900 dark:text-white flex items-center gap-2.5">
          <FiBriefcase className="text-blue-500" /> Real-World Industry Use Cases & Workflows
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {seo.useCases.map((uc, idx) => (
            <div
              key={idx}
              className="p-4 bg-stone-50 dark:bg-zinc-950 border border-stone-100 dark:border-zinc-800 rounded-2xl space-y-2 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-bold text-stone-900 dark:text-white text-sm">
                    {uc.title}
                  </h3>
                  <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-primary/10 text-primary border border-primary/20 shrink-0">
                    {uc.badge}
                  </span>
                </div>
                <p className="text-xs text-stone-600 dark:text-zinc-400 leading-relaxed">
                  {uc.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* SEO Section 5: Step-by-Step Usage Guide */}
      <section className="bg-white dark:bg-zinc-900/40 border-y sm:border border-stone-200 dark:border-zinc-800/80 rounded-none sm:rounded-3xl p-4 sm:p-8 space-y-6">
        <h2 className="text-xl sm:text-2xl font-black text-stone-900 dark:text-white flex items-center gap-2.5">
          <FiList className="text-primary" /> Step-by-Step Walkthrough: How to Use {tool.title}
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {seo.steps.map((step, idx) => (
            <div
              key={idx}
              className="p-4 bg-stone-50 dark:bg-zinc-950 border border-stone-100 dark:border-zinc-800 rounded-2xl flex gap-3.5"
            >
              <div className="w-8 h-8 rounded-xl bg-primary text-white font-black text-sm flex items-center justify-center shrink-0">
                {idx + 1}
              </div>
              <div className="space-y-1">
                <h3 className="font-bold text-stone-900 dark:text-white text-sm">
                  {step.title}
                </h3>
                <p className="text-xs text-stone-600 dark:text-zinc-400 leading-relaxed">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* SEO Section 6: Best Practices & Industry Standards */}
      <section className="bg-white dark:bg-zinc-900/40 border-y sm:border border-stone-200 dark:border-zinc-800/80 rounded-none sm:rounded-3xl p-4 sm:p-8 space-y-6">
        <h2 className="text-xl sm:text-2xl font-black text-stone-900 dark:text-white flex items-center gap-2.5">
          <FiBookOpen className="text-amber-500" /> Best Practices & Optimization Checklist
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {seo.bestPractices.map((bp, idx) => (
            <div
              key={idx}
              className="p-4 bg-stone-50 dark:bg-zinc-950 border border-stone-100 dark:border-zinc-800 rounded-2xl space-y-1.5"
            >
              <h3 className="font-bold text-stone-900 dark:text-white text-sm flex items-center gap-2">
                <FiSliders className="text-amber-500 shrink-0" size={15} /> {bp.title}
              </h3>
              <p className="text-xs text-stone-600 dark:text-zinc-400 leading-relaxed">
                {bp.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* SEO Section 7: Troubleshooting & Common Pitfalls */}
      <section className="bg-white dark:bg-zinc-900/40 border-y sm:border border-stone-200 dark:border-zinc-800/80 rounded-none sm:rounded-3xl p-4 sm:p-8 space-y-6">
        <h2 className="text-xl sm:text-2xl font-black text-stone-900 dark:text-white flex items-center gap-2.5">
          <FiAlertCircle className="text-rose-500" /> Troubleshooting & Common Error Solutions
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {seo.troubleshooting.map((item, idx) => (
            <div
              key={idx}
              className="p-4 bg-stone-50 dark:bg-zinc-950 border border-stone-100 dark:border-zinc-800 rounded-2xl space-y-1.5"
            >
              <h3 className="font-bold text-rose-600 dark:text-rose-400 text-sm flex items-center gap-2">
                <FiAlertCircle size={15} /> {item.issue}
              </h3>
              <p className="text-xs text-stone-600 dark:text-zinc-400 leading-relaxed">
                <span className="font-bold text-stone-900 dark:text-white">Solution:</span> {item.solution}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* SEO Section 8: Extended Frequently Asked Questions (FAQ) */}
      <section className="bg-white dark:bg-zinc-900/40 border-y sm:border border-stone-200 dark:border-zinc-800/80 rounded-none sm:rounded-3xl p-4 sm:p-8 space-y-6">
        <h2 className="text-xl sm:text-2xl font-black text-stone-900 dark:text-white flex items-center gap-2.5">
          <FiHelpCircle className="text-primary" /> Frequently Asked Questions (FAQ)
        </h2>
        <div className="grid grid-cols-1 gap-4">
          {seo.faqs.map((faq, idx) => (
            <div
              key={idx}
              className="p-4 sm:p-5 bg-stone-50 dark:bg-zinc-950 border border-stone-100 dark:border-zinc-800 rounded-2xl space-y-2"
            >
              <h3 className="font-bold text-stone-900 dark:text-white text-sm sm:text-base flex items-start gap-2">
                <span className="text-primary font-mono font-bold text-sm">Q:</span> {faq.question}
              </h3>
              <p className="text-xs sm:text-sm text-stone-600 dark:text-zinc-400 leading-relaxed pl-6">
                {faq.answer}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* SEO Section 9: Related Tools in Category */}
      {seo.relatedTools.length > 0 && (
        <section className="bg-white dark:bg-zinc-900/40 border-y sm:border border-stone-200 dark:border-zinc-800/80 rounded-none sm:rounded-3xl p-4 sm:p-8 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl sm:text-2xl font-black text-stone-900 dark:text-white flex items-center gap-2.5">
              <FiZap className="text-amber-500" /> Explore Related {tool.category.replace(/-/g, ' ')}
            </h2>
            <Link
              href="/tools"
              className="text-xs font-bold text-primary hover:underline flex items-center gap-1"
            >
              View All Tools <FiArrowRight size={14} />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {seo.relatedTools.map((relTool) => (
              <Link
                key={relTool.id}
                href={`/tools/${relTool.category}/${relTool.slug}`}
                className="p-4 bg-stone-50 dark:bg-zinc-950 hover:bg-stone-100 dark:hover:bg-zinc-900 border border-stone-200 dark:border-zinc-800 rounded-2xl transition-all group flex flex-col justify-between"
              >
                <div>
                  <h3 className="font-bold text-stone-900 dark:text-white text-sm group-hover:text-primary transition-colors">
                    {relTool.title}
                  </h3>
                  <p className="text-xs text-stone-500 dark:text-zinc-400 mt-1.5 line-clamp-2">
                    {relTool.description}
                  </p>
                </div>
                <div className="mt-3 flex items-center justify-between pt-2 border-t border-stone-200/50 dark:border-zinc-800/50">
                  <span className="text-[10px] font-bold uppercase text-stone-400">
                    {relTool.category}
                  </span>
                  <FiArrowRight size={13} className="text-stone-400 group-hover:text-primary transition-colors" />
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
