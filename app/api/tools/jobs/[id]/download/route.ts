import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import fs from 'fs';
import path from 'path';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const job = await db.toolJob.findUnique({
      where: { id },
    });

    if (!job || !job.outputFile) {
      return NextResponse.json({ error: 'File not available' }, { status: 404 });
    }

    const STORAGE_DIR = process.env.JOB_STORAGE_PATH || path.join(process.cwd(), 'public', 'temp-jobs');
    const filePath = path.join(STORAGE_DIR, job.outputFile);

    if (!fs.existsSync(filePath)) {
      return NextResponse.json({ error: 'File not found on disk' }, { status: 404 });
    }

    const fileBuffer = fs.readFileSync(filePath);

    return new NextResponse(fileBuffer, {
      headers: {
        'Content-Type': 'application/octet-stream',
        'Content-Disposition': `attachment; filename="${job.outputFile}"`,
      },
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Download error' }, { status: 500 });
  }
}
