import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { processJobAsync } from '@/lib/tools/job-runner';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { toolId, params } = body;

    if (!toolId) {
      return NextResponse.json({ error: 'Missing toolId' }, { status: 400 });
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
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
