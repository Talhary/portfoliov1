import { Metadata } from 'next';
import { getToolBySlug } from '@/lib/tools/registry';
import { ToolClientContainer } from '@/components/tools/ToolClientContainer';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { FiArrowLeft, FiCpu, FiStar, FiCheckCircle, FiHelpCircle, FiShield, FiZap } from 'react-icons/fi';

interface Props {
  params: Promise<{ category: string; slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug, category } = await params;
  const tool = getToolBySlug(slug);

  if (!tool) {
    return {
      title: 'Tool Not Found | WebVix',
    };
  }

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://talhacodes.site';
  const pageUrl = `${baseUrl}/tools/${category}/${slug}`;

  return {
    title: `${tool.title} | Free Online Developer Tool`,
    description: `${tool.description}. Free, fast, and secure developer utility available online with instant results.`,
    alternates: {
      canonical: pageUrl,
    },
    openGraph: {
      title: `${tool.title} - Online Developer Tool`,
      description: tool.description,
      url: pageUrl,
      type: 'website',
      siteName: 'WebVix Developer Tools',
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

  return (
    <div className="w-full min-h-screen py-2 sm:py-10 px-0 sm:px-8 lg:px-16 max-w-[1400px] mx-auto">
      {/* SSR Breadcrumb */}
      <nav aria-label="Breadcrumb" className="mb-3 sm:mb-6 px-3 sm:px-0">
        <Link
          href="/tools"
          className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-stone-500 dark:text-zinc-400 hover:text-primary transition-colors"
        >
          <FiArrowLeft size={14} /> Back to All Tools
        </Link>
      </nav>

      {/* Main SSR Tool Container */}
      <article className="bg-white dark:bg-zinc-900/60 border-y sm:border border-stone-200 dark:border-zinc-800 rounded-none sm:rounded-3xl p-3.5 sm:p-8 shadow-none sm:shadow-xl backdrop-blur-md mb-4 sm:mb-8">
        {/* SSR Header & Meta */}
        <header className="flex items-center justify-between gap-4 mb-4 pb-4 border-b border-stone-100 dark:border-zinc-800">
          <div>
            <span className="text-xs uppercase font-bold text-primary tracking-wider px-2.5 py-0.5 rounded-full bg-primary/10 border border-primary/20">
              {tool.category.replace('-', ' ')}
            </span>
            <h1 className="text-2xl sm:text-4xl font-black text-stone-900 dark:text-white tracking-tight mt-2">
              {tool.title}
            </h1>
          </div>
          <div className="flex items-center gap-2">
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
          <p className="text-stone-600 dark:text-zinc-300 text-sm sm:text-lg leading-relaxed">
            {tool.description}
          </p>
        </section>

        {/* Interactive Tool Widget (Client Hydrated Component) */}
        <section aria-label="Interactive Tool Widget" className="mt-4 sm:mt-6 mb-6 sm:mb-8">
          <ToolClientContainer tool={tool} />
        </section>
      </article>

      {/* SSR SEO Rich Content Sections */}
      <div className="space-y-4 sm:space-y-8">
        {/* Features Grid */}
        <section className="bg-white dark:bg-zinc-900/40 border-y sm:border border-stone-200 dark:border-zinc-800/80 rounded-none sm:rounded-3xl p-3.5 sm:p-8">
          <h2 className="text-lg sm:text-xl font-bold text-stone-900 dark:text-white mb-4 flex items-center gap-2">
            <FiZap className="text-primary" /> Key Features of {tool.title}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 text-sm">
            <div className="p-3.5 sm:p-4 bg-stone-50 dark:bg-zinc-950 border border-stone-100 dark:border-zinc-800 rounded-xl sm:rounded-2xl">
              <div className="font-bold text-stone-900 dark:text-white flex items-center gap-2 mb-1">
                <FiCheckCircle className="text-emerald-500" /> High Performance Execution
              </div>
              <p className="text-xs text-stone-500 dark:text-zinc-400">
                Optimized for instant client-side evaluation or fast Docker VPS worker background processing.
              </p>
            </div>

            <div className="p-3.5 sm:p-4 bg-stone-50 dark:bg-zinc-950 border border-stone-100 dark:border-zinc-800 rounded-xl sm:rounded-2xl">
              <div className="font-bold text-stone-900 dark:text-white flex items-center gap-2 mb-1">
                <FiShield className="text-blue-500" /> 100% Secure & Private
              </div>
              <p className="text-xs text-stone-500 dark:text-zinc-400">
                Your data is processed safely. No unauthorized tracking or data retention.
              </p>
            </div>
          </div>
        </section>

        {/* How to Use Section */}
        <section className="bg-white dark:bg-zinc-900/40 border-y sm:border border-stone-200 dark:border-zinc-800/80 rounded-none sm:rounded-3xl p-3.5 sm:p-8">
          <h2 className="text-lg sm:text-xl font-bold text-stone-900 dark:text-white mb-4">
            How to Use {tool.title}
          </h2>
          <ol className="space-y-2.5 sm:space-y-3 text-xs sm:text-sm text-stone-600 dark:text-zinc-300 list-decimal list-inside">
            <li>Enter your input parameters or upload your source file into the widget container above.</li>
            <li>Adjust any custom options or quality settings if applicable.</li>
            <li>Click the action button to process or trigger the asynchronous background job.</li>
            <li>View your formatted results instantly or stream the generated downloadable output file.</li>
          </ol>
        </section>

        {/* Frequently Asked Questions */}
        <section className="bg-white dark:bg-zinc-900/40 border-y sm:border border-stone-200 dark:border-zinc-800/80 rounded-none sm:rounded-3xl p-3.5 sm:p-8">
          <h2 className="text-lg sm:text-xl font-bold text-stone-900 dark:text-white mb-4 flex items-center gap-2">
            <FiHelpCircle className="text-primary" /> Frequently Asked Questions
          </h2>
          <div className="space-y-3 sm:space-y-4 text-xs sm:text-sm">
            <div>
              <h3 className="font-bold text-stone-900 dark:text-white">Is {tool.title} free to use?</h3>
              <p className="text-stone-500 dark:text-zinc-400 mt-1">
                Yes, {tool.title} is completely free to use online without requiring any account registration or subscription.
              </p>
            </div>
            <div>
              <h3 className="font-bold text-stone-900 dark:text-white">How does server-side processing work?</h3>
              <p className="text-stone-500 dark:text-zinc-400 mt-1">
                For heavy tasks, jobs are processed securely using Docker microservices on dedicated VPS infrastructure with automated temp file cleanup.
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
