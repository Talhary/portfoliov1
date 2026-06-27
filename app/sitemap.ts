import { MetadataRoute } from "next";
import { db } from "@/lib/db";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://talhatech.vercel.app";

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

  // Fetch dynamic projects
  let projectPaths: MetadataRoute.Sitemap = [];
  try {
    const projects = await db.projects.findMany({
      orderBy: {
        updatedAt: "desc",
      },
    });

    projectPaths = projects.map((project) => ({
      url: `${baseUrl}/portfolio/project/${project.id}`,
      lastModified: new Date(project.updatedAt),
      changeFrequency: "weekly" as const,
      priority: 0.8,
    }));
  } catch (error) {
    console.error("Sitemap generation error for projects:", error);
  }

  // Fetch dynamic categories
  let categoryPaths: MetadataRoute.Sitemap = [];
  try {
    const categories = await db.category.findMany();
    categoryPaths = categories.map((category) => ({
      url: `${baseUrl}/portfolio/${category.value}`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.7,
    }));
  } catch (error) {
    console.error("Sitemap generation error for categories:", error);
  }

  // Fetch dynamic blog posts
  let blogPaths: MetadataRoute.Sitemap = [];
  try {
    const blogs = await db.blogPost.findMany({
      where: { published: true },
      orderBy: {
        updatedAt: "desc",
      },
    });

    blogPaths = blogs.map((blog) => ({
      url: `${baseUrl}/blog/${blog.slug}`,
      lastModified: new Date(blog.updatedAt),
      changeFrequency: "weekly" as const,
      priority: 0.8,
    }));
  } catch (error) {
    console.error("Sitemap generation error for blogs:", error);
  }

  return [...staticPaths, ...projectPaths, ...categoryPaths, ...blogPaths];
}
