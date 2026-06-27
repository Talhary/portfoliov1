import React from 'react';
import { Metadata } from 'next';
import { Heading } from '@/components/heading';
import { GetBlogs } from '@/actions/getBlogs';
import { BlogClient } from '@/components/blog-client';

export const metadata: Metadata = {
  title: "Tech Blog & Web Development Insights | Talha Riaz",
  description: "Read technical articles on Next.js, React, Node.js, TypeScript, PostgreSQL, and modern software engineering practices. Written by Talha Riaz.",
  keywords: [
    "Tech Blog",
    "Talha Riaz Blog",
    "Web Development Articles",
    "Next.js Tutorials",
    "React Performance",
    "TypeScript Backend",
    "Prisma PostgreSQL",
    "Software Engineering Insights"
  ],
  openGraph: {
    title: "Tech Blog & Web Development Insights | Talha Riaz",
    description: "Read technical articles on Next.js, React, Node.js, TypeScript, PostgreSQL, and modern software engineering practices.",
    type: "website",
    url: "https://talhatech.vercel.app/blog",
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

  return (
    <div className="w-full max-w-6xl mx-auto px-4 py-4 dark:text-gray-100 animate-fadeIn">
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
