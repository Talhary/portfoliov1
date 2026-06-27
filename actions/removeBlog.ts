"use server";

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";

export const removeBlogById = async (id: string) => {
  try {
    await db.blogPost.delete({
      where: {
        id,
      },
    });

    revalidatePath("/blog");
    return { status: 200, success: true };
  } catch (error: any) {
    console.error("Error removing blog post:", error);
    return { status: 500, success: false, message: error.message };
  }
};
