import { MetadataRoute } from "next";
import { db } from "@/lib/db";

export const revalidate = 86400; // Cache sitemap for 24 hours

// Helper to prevent database calls from hanging sitemap generation indefinitely
function withTimeout<T>(promise: Promise<T>, timeoutMs: number, fallback: T): Promise<T> {
  let timeoutId: any;
  const timeoutPromise = new Promise<T>((resolve) => {
    timeoutId = setTimeout(() => {
      console.warn(`Sitemap query timed out after ${timeoutMs}ms. Using fallback.`);
      resolve(fallback);
    }, timeoutMs);
  });
  return Promise.race([
    promise.then((res) => {
      clearTimeout(timeoutId);
      return res;
    }),
    timeoutPromise
  ]);
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://talhacodes.site";

  // Base static paths
  const staticPaths = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 1.0,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/resume`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/portfolio/all`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.9,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.8,
    },
  ];

  // Fetch dynamic sections in parallel with a strict 4-second timeout limit
  const [projectPaths, categoryPaths, blogPaths] = await Promise.all([
    withTimeout(
      db.projects.findMany({
        orderBy: {
          updatedAt: "desc",
        },
      })
      .then((projects) =>
        projects.map((project) => ({
          url: `${baseUrl}/portfolio/project/${project.id}`,
          lastModified: new Date(project.updatedAt),
          changeFrequency: "weekly" as const,
          priority: 0.8,
        }))
      )
      .catch((error) => {
        console.error("Sitemap generation error for projects:", error);
        return [];
      }),
      4000,
      []
    ),
    withTimeout(
      db.category.findMany()
      .then((categories) =>
        categories.map((category) => ({
          url: `${baseUrl}/portfolio/${category.value}`,
          lastModified: new Date(),
          changeFrequency: "weekly" as const,
          priority: 0.7,
        }))
      )
      .catch((error) => {
        console.error("Sitemap generation error for categories:", error);
        return [];
      }),
      4000,
      []
    ),
    withTimeout(
      db.blogPost.findMany({
        where: { published: true },
        orderBy: {
          updatedAt: "desc",
        },
      })
      .then((blogs) =>
        blogs.map((blog) => ({
          url: `${baseUrl}/blog/${blog.slug}`,
          lastModified: new Date(blog.updatedAt),
          changeFrequency: "weekly" as const,
          priority: 0.8,
        }))
      )
      .catch((error) => {
        console.error("Sitemap generation error for blogs:", error);
        return [];
      }),
      4000,
      []
    ),
  ]);

  return [...staticPaths, ...projectPaths, ...categoryPaths, ...blogPaths];
}
