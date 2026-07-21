import { NextRequest, NextResponse } from 'next/server';
import { generateTimeline } from '@/lib/ai-planner-mock';
import { pool } from '@/lib/db-mock';

export async function POST(request: NextRequest) {
  try {
    // Skip auth for testing
    const user = { id: 'test-user', orgId: 'test-org' };

    const body = await request.json();
    const { prompt, projectId = 'test-project', existingTimeline, editScope } = body;

    if (!prompt) {
      return NextResponse.json({ error: 'Prompt is required' }, { status: 400 });
    }

    // Generate timeline using AI
    const result = await generateTimeline({
      prompt,
      existingTimeline,
      editScope,
    });

    if (!result.success) {
      return NextResponse.json(
        { error: result.error || 'Failed to generate timeline' },
        { status: 500 }
      );
    }

    // Save timeline to database
    const timelineId = await saveTimeline(user, projectId, result.timeline);

    return NextResponse.json({
      success: true,
      timeline: result.timeline,
      timelineId,
    });
  } catch (error) {
    console.error('Timeline generation error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

async function saveTimeline(
  user: any,
  projectId: string,
  timeline: any
): Promise<string> {
  // Get the latest version for this project
  const versionResult = await pool.query(
    `SELECT COALESCE(MAX(version), 0) + 1 as next_version 
     FROM timelines 
     WHERE project_id = $1`,
    [projectId]
  );

  const nextVersion = versionResult.rows[0].next_version;

  // Insert new timeline
  const result = await pool.query(
    `INSERT INTO timelines (project_id, org_id, version, timeline_data, created_by)
     VALUES ($1, $2, $3, $4, $5)
     RETURNING id`,
    [projectId, user.orgId, nextVersion, JSON.stringify(timeline), user.id]
  );

  return result.rows[0].id;
}
