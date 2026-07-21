import { NextRequest, NextResponse } from 'next/server';
import { pool } from '@/lib/db-mock';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { status, progress, outputPath, duration, size } = body;

    // Update the job in the mock database
    const { getStorage } = await import('@/lib/db-mock');
    const storage = getStorage();
    const job = storage.renderJobs.get(id);

    if (!job) {
      return NextResponse.json({ error: 'Job not found' }, { status: 404 });
    }

    // Update job fields
    if (status) job.status = status;
    if (progress !== undefined) job.progress = progress;
    if (outputPath) job.output_path = outputPath;
    if (duration) job.output_duration = duration;
    if (size) job.output_size = size;

    storage.renderJobs.set(id, job);

    return NextResponse.json({ success: true, job });
  } catch (error) {
    console.error('Error updating job status:', error);
    return NextResponse.json(
      { error: 'Failed to update job status' },
      { status: 500 }
    );
  }
}