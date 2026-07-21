import { NextRequest, NextResponse } from 'next/server';
import { readFile } from 'fs/promises';
import { existsSync } from 'fs';
import path from 'path';

const RENDERS_DIR = '/tmp/renders';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    // Find the video file (try common formats)
    const formats = ['mp4', 'webm', 'mov'];
    let videoPath: string | null = null;
    let contentType = 'video/mp4';
    
    for (const format of formats) {
      const candidatePath = path.join(RENDERS_DIR, `${id}.${format}`);
      if (existsSync(candidatePath)) {
        videoPath = candidatePath;
        contentType = format === 'mp4' ? 'video/mp4' : 
                     format === 'webm' ? 'video/webm' : 'video/quicktime';
        break;
      }
    }
    
    if (!videoPath) {
      return NextResponse.json(
        { error: 'Video not found' },
        { status: 404 }
      );
    }
    
    // Read the video file
    const videoBuffer = await readFile(videoPath);
    
    // Return the video with appropriate headers
    return new NextResponse(videoBuffer, {
      headers: {
        'Content-Type': contentType,
        'Content-Length': videoBuffer.length.toString(),
        'Content-Disposition': `inline; filename="${id}.mp4"`,
        'Accept-Ranges': 'bytes',
      },
    });
  } catch (error) {
    console.error('Error serving video:', error);
    return NextResponse.json(
      { error: 'Failed to serve video' },
      { status: 500 }
    );
  }
}