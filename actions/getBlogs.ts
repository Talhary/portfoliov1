"use server";

import { db } from "@/lib/db";

interface GetBlogsParams {
  page?: number;
  limit?: number;
  search?: string;
  tag?: string;
}

export const GetBlogs = async ({
  page = 1,
  limit = 6,
  search = "",
  tag = "",
}: GetBlogsParams) => {
  try {
    const skip = (page - 1) * limit;

    // Build the query where clause
    const where: any = {
      published: true,
    };

    if (search) {
      where.OR = [
        {
          title: {
            contains: search,
            mode: "insensitive",
          },
        },
        {
          description: {
            contains: search,
            mode: "insensitive",
          },
        },
        {
          content: {
            contains: search,
            mode: "insensitive",
          },
        },
      ];
    }

    if (tag && tag.toLowerCase() !== "all") {
      where.tags = {
        has: tag,
      };
    }

    const [blogs, total] = await Promise.all([
      db.blogPost.findMany({
        where,
        orderBy: {
          createdAt: "desc",
        },
        skip,
        take: limit,
      }),
      db.blogPost.count({ where }),
    ]);

    // Also get all unique tags for the filtering interface
    const allPosts = await db.blogPost.findMany({
      where: { published: true },
      select: { tags: true },
    });
    const uniqueTagsSet = new Set<string>();
    allPosts.forEach((post) => {
      post.tags.forEach((t) => uniqueTagsSet.add(t));
    });
    const allTags = Array.from(uniqueTagsSet);

    return {
      success: true,
      data: blogs,
      total,
      totalPages: Math.ceil(total / limit),
      allTags,
    };
  } catch (error: any) {
    console.error("Error retrieving blog posts:", error);
    return {
      success: false,
      data: [],
      total: 0,
      totalPages: 0,
      allTags: [],
      message: error.message,
    };
  }
};
