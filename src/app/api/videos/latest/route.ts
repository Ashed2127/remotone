import { NextResponse } from 'next/server';
import { readdir, stat } from 'fs/promises';
import { join } from 'path';

export async function GET() {
  try {
    const publicDir = join(process.cwd(), 'public');
    const files = await readdir(publicDir);
    
    // Filter for video files
    const videoFiles = files.filter(file => 
      file.endsWith('.mp4') || file.endsWith('.webm') || file.endsWith('.mov')
    );
    
    if (videoFiles.length === 0) {
      return NextResponse.json({ 
        error: 'No video files found',
        video: null 
      }, { status: 404 });
    }
    
    // Get file stats to find the latest one
    const fileStats = await Promise.all(
      videoFiles.map(async (file) => {
        const filePath = join(publicDir, file);
        const stats = await stat(filePath);
        return {
          name: file,
          path: `/${file}`,
          size: stats.size,
          modified: stats.mtime,
        };
      })
    );
    
    // Sort by modification time (newest first)
    const latestVideo = fileStats.sort((a, b) => 
      b.modified.getTime() - a.modified.getTime()
    )[0];
    
    return NextResponse.json({
      video: latestVideo,
      totalVideos: fileStats.length,
    });
    
  } catch (error) {
    console.error('Error fetching latest video:', error);
    return NextResponse.json({ 
      error: 'Failed to fetch latest video',
      video: null 
    }, { status: 500 });
  }
}