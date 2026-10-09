import React from 'react';
import { Metadata } from 'next';
import { Heading } from '@/components/heading';
import { GetBlogs } from '@/actions/getBlogs';
import { BlogClient } from '@/components/blog-client';

export const metadata: Metadata = {
  title: "Tech Blog & Systems Engineering Insights | talhatechs",
  description: "Read technical articles on Next.js, Rust, Tauri, Node.js, TypeScript, PostgreSQL, and modern software systems from talhatechs (Founded by Muhammad Talha).",
  alternates: {
    canonical: "/blog",
  },
  keywords: [
    "Tech Blog",
    "talhatechs Blog",
    "Systems Engineering",
    "Noyare Windows",
    "Rust Tauri Desktop",
    "Next.js Tutorials",
    "React Performance",
    "TypeScript Backend",
    "Prisma PostgreSQL",
    "Software Engineering Insights"
  ],
  openGraph: {
    title: "Tech Blog & Systems Engineering Insights | talhatechs",
    description: "Read technical articles on Next.js, Rust, Tauri, Node.js, TypeScript, PostgreSQL, and modern software engineering from talhatechs.",
    type: "website",
    url: "https://talhacodes.site/blog",
  }
};

interface PageProps {
  searchParams: Promise<{
    search?: string;
    tag?: string;
    page?: string;
  }>;
}

export default async function BlogPage({ searchParams }: PageProps) {
  const resolvedParams = await searchParams;
  const currentSearch = resolvedParams.search || '';
  const currentTag = resolvedParams.tag || 'all';
  const currentPage = Number(resolvedParams.page) || 1;

  const result = await GetBlogs({
    page: currentPage,
    limit: 6,
    search: currentSearch,
    tag: currentTag,
  });

  const siteUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://talhacodes.site';
  const blogSchema = {
    '@context': 'https://schema.org',
    '@type': 'Blog',
    name: 'Tech Blog & Systems Engineering Insights | talhatechs',
    description: 'Read technical articles on Next.js, Rust, Tauri, Node.js, TypeScript, PostgreSQL, and modern software systems.',
    url: `${siteUrl}/blog`,
    author: {
      '@type': 'Person',
      name: 'Muhammad Talha (talhatechs)',
      url: siteUrl,
    },
  };

  return (
    <div className="w-full  mx-auto px-4 py-4 dark:text-gray-100 animate-fadeIn">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(blogSchema) }}
      />
      <Heading title="Blog" />
      <BlogClient
        initialBlogs={result.data || []}
        totalPages={result.totalPages || 1}
        currentPage={currentPage}
        allTags={result.allTags || []}
        currentSearch={currentSearch}
        currentTag={currentTag}
      />
    </div>
  );
}
