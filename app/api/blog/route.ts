import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";

const slugify = (text: string) =>
  text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");

export async function POST(request: Request) {
  try {
    // 1. Authenticate the request
    const apiKey = request.headers.get("x-api-key");
    const systemApiKey = process.env.BLOG_API_KEY;

    if (!systemApiKey) {
      return NextResponse.json(
        { success: false, error: "API authentication is not configured on the server." },
        { status: 500 }
      );
    }

    if (!apiKey || apiKey !== systemApiKey) {
      return NextResponse.json(
        { success: false, error: "Unauthorized. Invalid or missing API key." },
        { status: 401 }
      );
    }

    // 2. Parse request body
    const body = await request.json();
    const { title, description, content, imageUrl, tags } = body;

    // 3. Validate required fields
    if (!title || !description || !content) {
      return NextResponse.json(
        { success: false, error: "Missing required fields: title, description, and content are required." },
        { status: 400 }
      );
    }

    if (!tags || !Array.isArray(tags) || tags.length === 0) {
      return NextResponse.json(
        { success: false, error: "Tags must be a non-empty array of strings." },
        { status: 400 }
      );
    }

    // 4. Generate unique SEO slug
    let slug = slugify(title);
    const existing = await db.blogPost.findUnique({
      where: { slug },
    });

    if (existing) {
      slug = `${slug}-${Math.random().toString(36).substring(2, 6)}`;
    }

    // 5. Insert into the database
    const post = await db.blogPost.create({
      data: {
        title,
        slug,
        description,
        content,
        imageUrl: imageUrl || null,
        tags: tags.map((tag: string) => tag.trim()),
        published: true,
      },
    });

    // 6. Revalidate cache
    revalidatePath("/blog");

    return NextResponse.json(
      {
        success: true,
        message: "Blog post published successfully!",
        data: {
          id: post.id,
          title: post.title,
          slug: post.slug,
          url: `https://talhatech.vercel.app/blog/${post.slug}`,
        },
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("API error creating blog post:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}
