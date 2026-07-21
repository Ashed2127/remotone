import { NextRequest, NextResponse } from 'next/server';
import { pool } from '@/lib/db-mock';
import { v4 as uuidv4 } from 'uuid';

export async function POST(request: NextRequest) {
  try {
    // Skip auth for testing
    const user = { id: 'test-user', orgId: 'test-org' };

    const body = await request.json();
    const { projectId = 'test-project', timelineId, outputFormat, outputResolution } = body;

    if (!timelineId) {
      return NextResponse.json(
        { error: 'Timeline ID is required' },
        { status: 400 }
      );
    }

    // Get timeline data
    const timelineResult = await pool.query(
      'SELECT timeline_data FROM timelines WHERE id = $1',
      [timelineId]
    );

    if (timelineResult.rows.length === 0) {
      console.log('Timeline not found:', timelineId);
      return NextResponse.json({ error: 'Timeline not found' }, { status: 404 });
    }

    const timeline = timelineResult.rows[0].timeline_data;
    console.log('Timeline found:', timelineId);

    // Create render job in database
    const renderJobId = uuidv4();
    await pool.query(
      `INSERT INTO render_jobs (id, org_id, project_id, timeline_id, user_id, output_format, output_resolution)
       VALUES ($1, $2, $3, $4, $5, $6, $7)`,
      [
        renderJobId,
        user.orgId,
        projectId,
        timelineId,
        user.id,
        outputFormat || 'mp4',
        outputResolution || '1080p',
      ]
    );

    // Simulate render queue (mock)
    console.log('Render job created:', renderJobId);

    return NextResponse.json({
      success: true,
      renderJobId,
      status: 'pending',
    });
  } catch (error) {
    console.error('Render job creation error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    // Skip auth for testing
    const user = { id: 'test-user', orgId: 'test-org' };

    const { searchParams } = new URL(request.url);
    const renderJobId = searchParams.get('id');

    if (renderJobId) {
      // Get specific render job
      const result = await pool.query(
        'SELECT * FROM render_jobs WHERE id = $1 AND org_id = $2',
        [renderJobId, user.orgId]
      );

      if (result.rows.length === 0) {
        return NextResponse.json({ error: 'Render job not found' }, { status: 404 });
      }

      const job = result.rows[0];
      // Add video URL if job is completed
      if (job.status === 'completed' && job.output_path) {
        job.video_url = `/api/videos/${job.id}`;
      }
      return NextResponse.json(job);
    } else {
      // Get all render jobs for user's org
      const result = await pool.query(
        'SELECT * FROM render_jobs WHERE org_id = $1 ORDER BY created_at DESC',
        [user.orgId]
      );

      // Add video URLs to completed jobs
      const jobsWithUrls = result.rows.map(job => {
        if (job.status === 'completed' && job.output_path) {
          return { ...job, video_url: `/api/videos/${job.id}` };
        }
        return job;
      });
      
      return NextResponse.json(jobsWithUrls);
    }
  } catch (error) {
    console.error('Render job fetch error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
