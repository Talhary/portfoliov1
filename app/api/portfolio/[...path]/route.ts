import { NextRequest, NextResponse } from 'next/server';

const UPSTREAM_BASE_URL = process.env.PORTFOLIO_SERVICE_URL || 'https://services.ufone-claim.site';

async function handleProxy(req: NextRequest, { params }: { params: Promise<{ path: string[] }> }) {
  try {
    const { path } = await params;
    const subpath = path ? path.join('/') : '';
    const url = new URL(req.url);
    const targetUrl = `${UPSTREAM_BASE_URL}/api/portfolio/${subpath}${url.search}`;

    const apiKey = process.env.PORTFOLIO_API_KEY || '';
    const domain = process.env.PORTFOLIO_DOMAIN || 'talhacodes.site';

    // Prepare headers for upstream
    const forwardHeaders: Record<string, string> = {
      'X-Portfolio-Key': apiKey,
      'X-Portfolio-Domain': domain,
      'User-Agent': 'TalhaCodes-Portfolio-Gateway/1.0',
    };

    const clientContentType = req.headers.get('content-type');
    if (clientContentType) {
      forwardHeaders['Content-Type'] = clientContentType;
    }

    const clientAccept = req.headers.get('accept');
    if (clientAccept) {
      forwardHeaders['Accept'] = clientAccept;
    }

    const authHeader = req.headers.get('authorization');
    if (authHeader) {
      forwardHeaders['Authorization'] = authHeader;
    }

    // Set up request options
    const fetchOptions: RequestInit = {
      method: req.method,
      headers: forwardHeaders,
      cache: 'no-store',
    };

    // Forward body if applicable
    if (req.method !== 'GET' && req.method !== 'HEAD' && req.body) {
      const bodyBuffer = await req.arrayBuffer();
      fetchOptions.body = bodyBuffer;
    }

    const upstreamResponse = await fetch(targetUrl, fetchOptions);

    const contentType = upstreamResponse.headers.get('content-type') || '';

    // Handle Server-Sent Events (SSE) streaming (e.g. Google Places stream)
    if (contentType.includes('text/event-stream')) {
      return new Response(upstreamResponse.body, {
        status: upstreamResponse.status,
        headers: {
          'Content-Type': 'text/event-stream',
          'Cache-Control': 'no-cache, no-transform',
          'Connection': 'keep-alive',
          'X-Accel-Buffering': 'no',
        },
      });
    }

    // Handle PDF and Binary downloads (e.g. CV generation, media downloads)
    if (
      contentType.includes('application/pdf') ||
      contentType.includes('video/') ||
      contentType.includes('audio/') ||
      contentType.includes('application/octet-stream')
    ) {
      const responseHeaders = new Headers();
      responseHeaders.set('Content-Type', contentType);
      
      const contentDisposition = upstreamResponse.headers.get('content-disposition');
      if (contentDisposition) {
        responseHeaders.set('Content-Disposition', contentDisposition);
      }
      
      const contentLength = upstreamResponse.headers.get('content-length');
      if (contentLength) {
        responseHeaders.set('Content-Length', contentLength);
      }
      
      responseHeaders.set('Cache-Control', 'no-store, max-age=0');

      return new Response(upstreamResponse.body, {
        status: upstreamResponse.status,
        headers: responseHeaders,
      });
    }

    // Handle JSON or Text
    const textData = await upstreamResponse.text();
    let jsonData;
    try {
      jsonData = JSON.parse(textData);
      return NextResponse.json(jsonData, { status: upstreamResponse.status });
    } catch {
      return new Response(textData, {
        status: upstreamResponse.status,
        headers: {
          'Content-Type': contentType || 'text/plain',
        },
      });
    }
  } catch (error: any) {
    console.error('Portfolio proxy error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Failed to connect to portfolio backend service.',
      },
      { status: 502 }
    );
  }
}

export async function GET(req: NextRequest, context: { params: Promise<{ path: string[] }> }) {
  return handleProxy(req, context);
}

export async function POST(req: NextRequest, context: { params: Promise<{ path: string[] }> }) {
  return handleProxy(req, context);
}

export async function PUT(req: NextRequest, context: { params: Promise<{ path: string[] }> }) {
  return handleProxy(req, context);
}

export async function DELETE(req: NextRequest, context: { params: Promise<{ path: string[] }> }) {
  return handleProxy(req, context);
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Portfolio-Key',
    },
  });
}
