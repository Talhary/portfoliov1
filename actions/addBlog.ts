"use server";

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";

export interface BlogInput {
  title: string;
  description: string;
  content: string;
  imageUrl?: string;
  tags: string[];
}

const slugify = (text: string) =>
  text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");

export const AddBlog = async (values: BlogInput) => {
  try {
    let slug = slugify(values.title);

    // Ensure slug uniqueness
    const existing = await db.blogPost.findUnique({
      where: { slug },
    });

    if (existing) {
      slug = `${slug}-${Math.random().toString(36).substring(2, 6)}`;
    }

    const res = await db.blogPost.create({
      data: {
        title: values.title,
        slug,
        description: values.description,
        content: values.content,
        imageUrl: values.imageUrl || null,
        tags: values.tags,
        published: true,
      },
    });

    revalidatePath("/blog");
    return { status: 201, success: true, data: res };
  } catch (error: any) {
    console.error("Error creating blog post:", error);
    return { status: 500, success: false, message: error.message };
  }
};
