import { NextResponse } from 'next/server';
import { INDEXABLE_BLOG_SLUGS, SITEMAP_TOOL_PATHS } from '@/lib/seo-config';
import { db } from '@/lib/db';

export const dynamic = 'force-dynamic';

type SitemapUrl = { url: string; lastmod?: string };

export async function GET() {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://talhacodes.site';

  const urls: SitemapUrl[] = [
    { url: `${baseUrl}/` },
    { url: `${baseUrl}/about` },
    { url: `${baseUrl}/resume` },
    { url: `${baseUrl}/contact` },
    { url: `${baseUrl}/portfolio/all` },
    ...SITEMAP_TOOL_PATHS.map((path) => ({ url: `${baseUrl}${path}` })),
  ];

  // Only real DB dates are used as lastmod; static pages omit it rather than fake one.
  try {
    const projects = await db.projects.findMany({
      orderBy: { updatedAt: 'desc' },
      select: { id: true, updatedAt: true },
    });
    for (const project of projects) {
      urls.push({
        url: `${baseUrl}/portfolio/project/${project.id}`,
        lastmod: project.updatedAt ? new Date(project.updatedAt).toISOString() : undefined,
      });
    }
  } catch (error) {
    console.error('Sitemap error fetching projects:', error);
  }

  try {
    const categories = await db.category.findMany({
      select: { value: true },
    });
    for (const cat of categories) {
      urls.push({ url: `${baseUrl}/portfolio/${cat.value}` });
    }
  } catch (error) {
    console.error('Sitemap error fetching categories:', error);
  }

  // Blog posts are noindex unless explicitly allowlisted, so only those are listed.
  if (INDEXABLE_BLOG_SLUGS.length > 0) {
    try {
      const blogs = await db.blogPost.findMany({
        where: { published: true, slug: { in: INDEXABLE_BLOG_SLUGS } },
        orderBy: { updatedAt: 'desc' },
        select: { slug: true, updatedAt: true },
      });
      if (blogs.length > 0) urls.push({ url: `${baseUrl}/blog` });
      for (const blog of blogs) {
        urls.push({
          url: `${baseUrl}/blog/${blog.slug}`,
          lastmod: blog.updatedAt ? new Date(blog.updatedAt).toISOString() : undefined,
        });
      }
    } catch (error) {
      console.error('Sitemap error fetching blogs:', error);
    }
  }

  // Build clean XML string
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
  .map(
    (item) => `  <url>
    <loc>${escapeXml(item.url)}</loc>${item.lastmod ? `
    <lastmod>${item.lastmod}</lastmod>` : ''}
  </url>`
  )
  .join('\n')}
</urlset>`;

  return new NextResponse(xml, {
    status: 200,
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, max-age=0, s-maxage=3600, stale-while-revalidate=86400',
    },
  });
}

function escapeXml(unsafe: string): string {
  return unsafe
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}
