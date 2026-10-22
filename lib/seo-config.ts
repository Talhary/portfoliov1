// Only pages listed here are put in the sitemap and left indexable.
// Add a blog slug only after the post is original, useful and edited by hand.
export const INDEXABLE_BLOG_SLUGS: string[] = [];

// Tool pages are noindex (see app/tools/layout.tsx) and kept out of the sitemap for now.
export const SITEMAP_TOOL_PATHS: string[] = [];

export const isBlogIndexable = (slug: string) => INDEXABLE_BLOG_SLUGS.includes(slug);
