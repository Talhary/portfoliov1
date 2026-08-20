import { NextResponse } from 'next/server';

const MAX_DOWNLOAD_BYTES = 100 * 1024 * 1024; // 100 MB ceiling

export async function POST(req: Request) {
  try {
    const { url } = await req.json();

    if (!url || typeof url !== 'string') {
      return NextResponse.json({ error: "Instagram URL is required" }, { status: 400 });
    }

    // Only accept genuine Instagram links; this endpoint proxies whatever it is
    // handed, so an unconstrained value makes it an open relay.
    let parsed: URL;
    try {
      parsed = new URL(url);
    } catch {
      return NextResponse.json({ error: "Invalid URL" }, { status: 400 });
    }

    const host = parsed.hostname.toLowerCase().replace(/^www\./, '');
    const allowed = host === 'instagram.com' || host.endsWith('.instagram.com');
    if ((parsed.protocol !== 'https:' && parsed.protocol !== 'http:') || !allowed) {
      return NextResponse.json({ error: "Only Instagram URLs are supported" }, { status: 400 });
    }

    const apiUrl = process.env.MEDIA_DOWNLOAD_API_URL;
    if (!apiUrl) {
      return NextResponse.json({ error: "Media download API is not configured on the server." }, { status: 500 });
    }

    // Bound the upstream call so a hung remote cannot pin this route open.
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 30_000);

    let response: Response;
    try {
      response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ url: parsed.toString() }),
        signal: controller.signal,
      });
    } finally {
      clearTimeout(timer);
    }

    if (!response.ok) {
      const errorText = await response.text();
      return NextResponse.json({
        error: `External service error: ${errorText.slice(0, 200) || response.statusText}`
      }, { status: response.status });
    }

    const declared = Number(response.headers.get('content-length') ?? 0);
    if (declared > MAX_DOWNLOAD_BYTES) {
      return NextResponse.json({ error: "Media file is too large to proxy." }, { status: 413 });
    }

    // Stream the binary data directly back to the client in real-time
    const responseHeaders = new Headers();
    responseHeaders.set("Content-Type", response.headers.get("content-type") || "video/mp4");
    responseHeaders.set("Content-Disposition", `attachment; filename="instagram_reel_${Date.now()}.mp4"`);
    responseHeaders.set("Cache-Control", "no-store, max-age=0");
    responseHeaders.set("X-Content-Type-Options", "nosniff");

    const contentLength = response.headers.get("content-length");
    if (contentLength) {
      responseHeaders.set("Content-Length", contentLength);
    }

    return new Response(response.body, {
      status: 200,
      headers: responseHeaders,
    });

  } catch (error: any) {
    console.error("Instagram Reels download error:", error);
    if (error?.name === 'AbortError') {
      return NextResponse.json({ error: "The download request timed out." }, { status: 504 });
    }
    return NextResponse.json({
      error: "An error occurred while processing the download request."
    }, { status: 500 });
  }
}
