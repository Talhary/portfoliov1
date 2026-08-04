import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { processJobAsync } from '@/lib/tools/job-runner';
import { getToolById } from '@/lib/tools/registry';

/**
 * Best-effort in-process rate limit.
 *
 * This bounds abuse from a single origin on a single instance. It is not a
 * substitute for an edge/shared-store limiter in a multi-instance deployment.
 */
const RATE_LIMIT_MAX = 10;
const RATE_LIMIT_WINDOW_MS = 60_000;
const hits = new Map<string, { count: number; resetAt: number }>();

function isRateLimited(key: string): boolean {
  const now = Date.now();
  const entry = hits.get(key);

  if (!entry || now > entry.resetAt) {
    hits.set(key, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
    if (hits.size > 10_000) {
      for (const [k, v] of hits) if (now > v.resetAt) hits.delete(k);
    }
    return false;
  }

  entry.count += 1;
  return entry.count > RATE_LIMIT_MAX;
}

export async function POST(req: NextRequest) {
  try {
    const ip =
      req.headers.get('x-forwarded-for')?.split(',')[0].trim() ||
      req.headers.get('x-real-ip') ||
      'unknown';

    if (isRateLimited(ip)) {
      return NextResponse.json(
        { error: 'Too many requests. Please try again shortly.' },
        { status: 429, headers: { 'Retry-After': '60' } },
      );
    }

    const body = await req.json();
    const { toolId, params } = body;

    if (!toolId || typeof toolId !== 'string') {
      return NextResponse.json({ error: 'Missing toolId' }, { status: 400 });
    }

    // Only registered tools may be queued; otherwise arbitrary strings create
    // rows that fall through to the runner's permissive default branch.
    if (!getToolById(toolId)) {
      return NextResponse.json({ error: 'Unknown toolId' }, { status: 400 });
    }

    if (params !== undefined && (typeof params !== 'object' || params === null || Array.isArray(params))) {
      return NextResponse.json({ error: 'Invalid params' }, { status: 400 });
    }

    const job = await db.toolJob.create({
      data: {
        toolId,
        inputParams: params || {},
        status: 'PENDING',
        progress: 0,
      },
    });

    // Run async worker in background without awaiting to return immediately
    processJobAsync(job.id).catch((err) => {
      console.error('Job processing background error:', err);
    });

    return NextResponse.json({
      jobId: job.id,
      status: job.status,
      message: 'Job submitted successfully',
    });
  } catch (error: any) {
    console.error('Job creation error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
