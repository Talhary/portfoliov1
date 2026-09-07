import { NextResponse } from 'next/server';
import { ALL_TOOLS, TOOL_CATEGORIES } from '@/lib/tools/registry';
import { db } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET() {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://talhacodes.site';
  const siteLaunchDate = '2026-07-06T00:00:00.000Z';
  const toolsReleaseDate = '2026-08-20T00:00:00.000Z';

  const urls: Array<{ url: string; lastmod: string; changefreq: string; priority: string }> = [];

  // Fetch blogs first so we know the most recent update date for the blog index and homepage
  let blogs: Array<{ slug: string; updatedAt: Date }> = [];
  try {
    blogs = await db.blogPost.findMany({
      where: { published: true },
      orderBy: { updatedAt: 'desc' },
      select: { slug: true, updatedAt: true },
    });
  } catch (error) {
    console.error('Sitemap error fetching blogs:', error);
  }

  const latestBlogDate = blogs.length > 0 && blogs[0].updatedAt
    ? new Date(blogs[0].updatedAt).toISOString()
    : siteLaunchDate;

  // 1. Static core pages
  const staticPages = [
    { url: baseUrl, priority: '1.0', changefreq: 'daily', lastmod: latestBlogDate },
    { url: `${baseUrl}/tools`, priority: '1.0', changefreq: 'daily', lastmod: toolsReleaseDate },
    { url: `${baseUrl}/portfolio/all`, priority: '0.9', changefreq: 'weekly', lastmod: toolsReleaseDate },
    { url: `${baseUrl}/blog`, priority: '0.9', changefreq: 'daily', lastmod: latestBlogDate },
    { url: `${baseUrl}/about`, priority: '0.8', changefreq: 'monthly', lastmod: siteLaunchDate },
    { url: `${baseUrl}/resume`, priority: '0.8', changefreq: 'monthly', lastmod: siteLaunchDate },
    { url: `${baseUrl}/contact`, priority: '0.8', changefreq: 'monthly', lastmod: siteLaunchDate },
    { url: `${baseUrl}/tools/instagram-reels-downloader`, priority: '0.9', changefreq: 'weekly', lastmod: toolsReleaseDate },
  ];

  for (const p of staticPages) {
    urls.push({
      url: p.url,
      lastmod: p.lastmod,
      changefreq: p.changefreq,
      priority: p.priority,
    });
  }

  // 2. Tool Categories
  for (const cat of TOOL_CATEGORIES) {
    urls.push({
      url: `${baseUrl}/tools/${cat.slug}`,
      lastmod: toolsReleaseDate,
      changefreq: 'weekly',
      priority: '0.9',
    });
  }

  // 3. Individual Tools (140+ tools)
  for (const tool of ALL_TOOLS) {
    urls.push({
      url: `${baseUrl}/tools/${tool.category}/${tool.slug}`,
      lastmod: toolsReleaseDate,
      changefreq: 'weekly',
      priority: '0.8',
    });
  }

  // 4. Dynamic Database Records (Projects, Categories, Blogs) with robust safety try/catch blocks
  try {
    const projects = await db.projects.findMany({
      orderBy: { updatedAt: 'desc' },
      select: { id: true, updatedAt: true },
    });
    for (const project of projects) {
      urls.push({
        url: `${baseUrl}/portfolio/project/${project.id}`,
        lastmod: project.updatedAt ? new Date(project.updatedAt).toISOString() : siteLaunchDate,
        changefreq: 'weekly',
        priority: '0.8',
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
      urls.push({
        url: `${baseUrl}/portfolio/${cat.value}`,
        lastmod: siteLaunchDate,
        changefreq: 'weekly',
        priority: '0.7',
      });
    }
  } catch (error) {
    console.error('Sitemap error fetching categories:', error);
  }

  for (const blog of blogs) {
    urls.push({
      url: `${baseUrl}/blog/${blog.slug}`,
      lastmod: blog.updatedAt ? new Date(blog.updatedAt).toISOString() : siteLaunchDate,
      changefreq: 'weekly',
      priority: '0.8',
    });
  }

  // Build clean XML string
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
  .map(
    (item) => `  <url>
    <loc>${escapeXml(item.url)}</loc>
    <lastmod>${item.lastmod}</lastmod>
    <changefreq>${item.changefreq}</changefreq>
    <priority>${item.priority}</priority>
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
