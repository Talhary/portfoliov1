import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { url } = await req.json();

    if (!url) {
      return NextResponse.json({ error: "Instagram URL is required" }, { status: 400 });
    }

    const apiUrl = process.env.MEDIA_DOWNLOAD_API_URL;
    if (!apiUrl) {
      return NextResponse.json({ error: "Media download API is not configured on the server." }, { status: 500 });
    }

    // Call the external API
    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ url }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      return NextResponse.json({ 
        error: `External service error: ${errorText || response.statusText}` 
      }, { status: response.status });
    }

    // Stream the binary data back to the client
    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Return the buffer as a video download stream
    return new Response(buffer, {
      status: 200,
      headers: {
        "Content-Type": "video/mp4",
        "Content-Disposition": `attachment; filename="instagram_reel_${Date.now()}.mp4"`,
        "Cache-Control": "no-store, max-age=0"
      }
    });

  } catch (error: any) {
    console.error("Instagram Reels download error:", error);
    return NextResponse.json({ 
      error: error.message || "An error occurred while processing the download request." 
    }, { status: 500 });
  }
}
