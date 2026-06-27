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
