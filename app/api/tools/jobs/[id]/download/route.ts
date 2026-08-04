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

    const STORAGE_DIR = path.resolve(
      process.env.JOB_STORAGE_PATH || path.join(process.cwd(), 'public', 'temp-jobs'),
    );

    // `outputFile` is currently server-generated, but resolving and confirming
    // containment means a future writer cannot turn this into arbitrary file read.
    const filePath = path.resolve(STORAGE_DIR, job.outputFile);
    if (filePath !== STORAGE_DIR && !filePath.startsWith(STORAGE_DIR + path.sep)) {
      return NextResponse.json({ error: 'File not available' }, { status: 404 });
    }

    if (!fs.existsSync(filePath) || !fs.statSync(filePath).isFile()) {
      return NextResponse.json({ error: 'File not found on disk' }, { status: 404 });
    }

    const fileBuffer = await fs.promises.readFile(filePath);

    // Quote and strip the filename so it cannot break out of the header.
    const safeName = path.basename(job.outputFile).replace(/["\r\n]/g, '');

    return new NextResponse(fileBuffer, {
      headers: {
        'Content-Type': 'application/octet-stream',
        'Content-Disposition': `attachment; filename="${safeName}"`,
        'X-Content-Type-Options': 'nosniff',
      },
    });
  } catch (error: any) {
    console.error('Job download error:', error);
    return NextResponse.json({ error: 'Download error' }, { status: 500 });
  }
}
