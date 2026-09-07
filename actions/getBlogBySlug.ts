"use server";

import { db } from "@/lib/db";

export const GetBlogBySlug = async (slug: string) => {
  try {
    const post = await db.blogPost.findUnique({
      where: {
        slug,
      },
    });

    if (!post) {
      return { success: false, data: null, message: "Blog post not found." };
    }

    return { success: true, data: post };
  } catch (error: any) {
    console.error("Error retrieving blog post by slug:", error);
    return { success: false, data: null, message: error.message };
  }
};

export const GetRelatedBlogs = async (
  currentSlug: string,
  tags: string[] = [],
  limit = 3
) => {
  try {
    let related = await db.blogPost.findMany({
      where: {
        published: true,
        slug: { not: currentSlug },
        tags: { hasSome: tags },
      },
      take: limit,
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        title: true,
        slug: true,
        description: true,
        imageUrl: true,
        createdAt: true,
        tags: true,
      },
    });

    if (related.length < limit) {
      const excludeSlugs = [currentSlug, ...related.map((r) => r.slug)];
      const fallback = await db.blogPost.findMany({
        where: {
          published: true,
          slug: { notIn: excludeSlugs },
        },
        take: limit - related.length,
        orderBy: { createdAt: "desc" },
        select: {
          id: true,
          title: true,
          slug: true,
          description: true,
          imageUrl: true,
          createdAt: true,
          tags: true,
        },
      });
      related = [...related, ...fallback];
    }

    return related;
  } catch (error) {
    console.error("Error retrieving related blogs:", error);
    return [];
  }
};
