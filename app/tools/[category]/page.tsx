import { Metadata } from 'next';
import { getCategoryBySlug, getToolsByCategory } from '@/lib/tools/registry';
import { ToolCard } from '@/components/tools/ToolCard';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { FiArrowLeft } from 'react-icons/fi';

interface Props {
  params: Promise<{ category: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { category: categorySlug } = await params;
  const category = getCategoryBySlug(categorySlug);

  if (!category) {
    return { title: 'Category Not Found | WebVix' };
  }

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://talhacodes.site';
  const pageUrl = `${baseUrl}/tools/${categorySlug}`;

  return {
    title: `${category.name} Developer Tools - Free Online Utilities`,
    description: `${category.description} Free, fast online developer tools in the ${category.name} catalog.`,
    alternates: { canonical: pageUrl },
    openGraph: {
      title: `${category.name} Tools`,
      description: category.description,
      url: pageUrl,
    },
  };
}

export default async function ToolCategoryPage({ params }: Props) {
  const { category: categorySlug } = await params;
  const category = getCategoryBySlug(categorySlug);

  if (!category) {
    notFound();
  }

  const tools = getToolsByCategory(category.id);

  return (
    <div className="w-full min-h-screen py-4 sm:py-10 px-0 sm:px-8 lg:px-16 max-w-[1600px] mx-auto">
      {/* Top Header Section with Internal px-4 Alignment */}
      <div className="px-4 sm:px-0 mb-6 sm:mb-10">
        <Link
          href="/tools"
          className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-stone-500 dark:text-zinc-400 hover:text-primary transition-colors mb-4"
        >
          <FiArrowLeft size={14} /> Back to All Tools
        </Link>

        <div>
          <h1 className="text-3xl sm:text-4xl font-black text-stone-900 dark:text-white mb-2 tracking-tight">
            {category.name}
          </h1>
          <p className="text-stone-600 dark:text-zinc-400 text-sm sm:text-base leading-relaxed">
            {category.description}
          </p>
        </div>
      </div>

      {/* Edge-to-Edge Full Width Card Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3.5 sm:gap-5 w-full px-0 mx-0">
        {tools.map((tool) => (
          <ToolCard key={tool.id} tool={tool} />
        ))}
      </div>
    </div>
  );
}
