import React from 'react';
import { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft, Calendar, Tag, BookOpen, Clock, ArrowRight } from 'lucide-react';
import { GetBlogBySlug, GetRelatedBlogs } from '@/actions/getBlogBySlug';
import { parseMarkdown } from '@/lib/markdown';

interface BlogPostPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateMetadata({
  params,
}: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const result = await GetBlogBySlug(slug);

  if (!result.success || !result.data) {
    return {
      title: "Blog Post Not Found | Talha Codes",
      description: "The requested blog article could not be found.",
    };
  }

  const title = `${result.data.title} | Talha Codes Blog`;
  const description = result.data.description.substring(0, 160);

  return {
    title,
    description,
    alternates: {
      canonical: `/blog/${slug}`,
    },
    keywords: [
      result.data.title,
      "Tech Blog",
      "Web Development",
      ...result.data.tags,
    ],
    openGraph: {
      title,
      description,
      type: "article",
      url: `https://talhacodes.site/blog/${slug}`,
      images: result.data.imageUrl ? [{ url: result.data.imageUrl }] : [],
    },
  };
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const result = await GetBlogBySlug(slug);

  if (!result.success || !result.data) {
    return (
      <div className="w-full max-w-4xl mx-auto px-4 py-20 text-center space-y-6 dark:text-gray-150 animate-fadeIn">
        <BookOpen className="h-16 w-16 text-red-500 mx-auto" />
        <h1 className="text-3xl font-extrabold text-white">Article Not Found</h1>
        <p className="text-zinc-400">
          The technical article you are looking for does not exist or has been removed.
        </p>
        <Link
          href="/blog"
          className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:underline"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Blog list</span>
        </Link>
      </div>
    );
  }

  const post = result.data;
  const relatedPosts = await GetRelatedBlogs(slug, post.tags, 3);

  const formattedDate = post.createdAt
    ? new Date(post.createdAt).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
    : 'Recent';

  // Basic read time calculation helper
  const wordCount = post.content.split(/\s+/).length;
  const readTimeMinutes = Math.max(1, Math.ceil(wordCount / 200));

  const siteUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://talhacodes.site';
  const postUrl = `${siteUrl}/blog/${slug}`;

  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.description,
    url: postUrl,
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': postUrl,
    },
    image: post.imageUrl ? [post.imageUrl] : undefined,
    datePublished: post.createdAt ? new Date(post.createdAt).toISOString() : undefined,
    dateModified: post.updatedAt ? new Date(post.updatedAt).toISOString() : post.createdAt ? new Date(post.createdAt).toISOString() : undefined,
    author: {
      '@type': 'Person',
      name: 'Talha',
      url: siteUrl,
    },
    publisher: {
      '@type': 'Organization',
      name: 'Talha Codes',
      url: siteUrl,
      logo: {
        '@type': 'ImageObject',
        url: `${siteUrl}/favicon.ico`,
      },
    },
    keywords: post.tags.join(', '),
  };

  return (
    <div className="w-full  mx-auto px-2 sm:px-4 py-6 text-zinc-900 dark:text-zinc-100 animate-fadeIn">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
      {/* Back Button */}
      <div className="mb-8">
        <Link
          href="/blog"
          className="inline-flex items-center gap-2 text-sm font-semibold text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-200 transition-colors duration-200 group"
        >
          <ArrowLeft className="w-4 h-4 transition-transform duration-200 group-hover:-translate-x-1" />
          <span>Back to Blog</span>
        </Link>
      </div>

      {/* Main Card Container */}
      <article className="bg-zinc-50 dark:bg-zinc-900/40 dark:backdrop-blur-xl border border-zinc-200 dark:border-zinc-800 p-6 sm:p-10 rounded-2xl shadow-sm dark:shadow-2xl relative overflow-hidden group">
        {/* Ambient gold glow decorative element */}
        <div className="absolute -top-12 -right-12 w-32 h-32 bg-primary/10 rounded-full blur-3xl pointer-events-none transition-opacity duration-500 group-hover:bg-primary/15" />

        {/* Blog Header Image */}
        {post.imageUrl && (
          <div className="w-full aspect-[2/1] relative overflow-hidden rounded-xl border border-zinc-200 dark:border-white/5 mb-8 bg-zinc-100 dark:bg-zinc-900 shadow-md">
            <img
              alt={post.title}
              src={post.imageUrl}
              className="w-full h-full object-cover"
            />
          </div>
        )}

        {/* Metadata section */}
        <div className="flex flex-wrap items-center gap-4 text-xs text-zinc-400 font-medium mb-4">
          <div className="flex items-center gap-1">
            <Calendar className="h-4 w-4 text-primary" />
            <span>{formattedDate}</span>
          </div>
          <span>•</span>
          <div className="flex items-center gap-1">
            <Clock className="h-4 w-4 text-primary" />
            <span>{readTimeMinutes} min read</span>
          </div>
        </div>

        {/* Post Title */}
        <h1 className="text-3xl sm:text-5xl font-extrabold text-zinc-900 dark:text-zinc-100 tracking-tight leading-tight mb-6">
          {post.title}
        </h1>

        {/* Tags Row */}
        <div className="flex flex-wrap gap-2 mb-8">
          {post.tags.map((tag) => (
            <span
              key={tag}
              className="flex items-center gap-1 text-xs font-semibold px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary uppercase tracking-wider transition-colors hover:bg-primary/20 cursor-default"
            >
              <Tag className="h-3 w-3" />
              <span>{tag}</span>
            </span>
          ))}
        </div>

        {/* Thin Premium Separator */}
        <div className="h-[1px] w-full bg-gradient-to-r from-white/10 via-white/5 to-transparent dark:from-zinc-800 dark:via-zinc-800/50 mb-8" />

        {/* Article Body (Rendered as Visual Markdown via Tailwind Typography) */}
        <div
          className="prose dark:prose-invert prose-headings:text-zinc-900 dark:prose-headings:text-white prose-a:text-primary prose-strong:text-zinc-900 dark:prose-strong:text-white prose-code:text-primary max-w-none text-zinc-800 dark:text-zinc-300 text-base leading-relaxed font-normal"
          dangerouslySetInnerHTML={{ __html: parseMarkdown(post.content || '') }}
        />
      </article>

      {/* Related Articles Section for Deep Crawling and Link Equity Distribution */}
      {relatedPosts.length > 0 && (
        <section className="mt-12">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-zinc-900 dark:text-white tracking-tight">
                Related Articles
              </h2>
              <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 mt-0.5">
                Continue reading more technical tutorials and architecture guides
              </p>
            </div>
            <Link
              href="/blog"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:underline group/back shrink-0"
            >
              <span>All articles</span>
              <ArrowRight className="h-3.5 w-3.5 transition-transform duration-200 group-hover/back:translate-x-1" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {relatedPosts.map((related) => (
              <Link
                key={related.id}
                href={`/blog/${related.slug}`}
                className="group/card flex flex-col bg-zinc-50 dark:bg-card-bg-3/60 border border-zinc-200 dark:border-zinc-800/80 dark:backdrop-blur-xl rounded-2xl overflow-hidden hover:border-primary/30 transition-all duration-300 hover:-translate-y-1 shadow-sm"
              >
                {related.imageUrl && (
                  <div className="w-full aspect-[16/9] relative overflow-hidden bg-zinc-100 dark:bg-zinc-900">
                    <img
                      src={related.imageUrl}
                      alt={related.title}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover/card:scale-105"
                    />
                  </div>
                )}
                <div className="p-4 flex flex-col flex-1">
                  <div className="flex items-center gap-1.5 mb-2">
                    {related.tags.slice(0, 2).map((t) => (
                      <span
                        key={t}
                        className="text-[10px] font-semibold uppercase tracking-wider text-primary bg-primary/10 px-2 py-0.5 rounded-md"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                  <h3 className="font-bold text-sm sm:text-base text-zinc-900 dark:text-white line-clamp-2 mb-2 group-hover/card:text-primary transition-colors">
                    {related.title}
                  </h3>
                  <p className="text-xs text-zinc-600 dark:text-zinc-400 line-clamp-2 font-light mb-3 flex-1">
                    {related.description}
                  </p>
                  <div className="flex items-center justify-between text-[11px] text-zinc-500 dark:text-zinc-400 pt-2.5 border-t border-zinc-200/50 dark:border-zinc-800/60 mt-auto">
                    <span>
                      {new Date(related.createdAt).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </span>
                    <span className="text-primary font-medium flex items-center gap-1 group-hover/card:underline">
                      Read <ArrowRight className="h-3 w-3" />
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
