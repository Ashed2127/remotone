import { validateTimeline, Timeline } from '@/types/timeline';
import { v4 as uuidv4 } from 'uuid';

interface PlanningRequest {
  prompt: string;
  existingTimeline?: Timeline;
  editScope?: {
    nodeId: string;
    editType: 'duration' | 'position' | 'content' | 'effect';
    newValue: any;
  };
}

interface PlanningResponse {
  timeline: Timeline;
  success: boolean;
  error?: string;
}

export async function generateTimeline(request: PlanningRequest): Promise<PlanningResponse> {
  try {
    // Generate a mock timeline based on the prompt
    const timeline = createMockTimeline(request.prompt);
    
    // Validate against schema
    const validatedTimeline = validateTimeline(timeline);

    return {
      timeline: validatedTimeline,
      success: true,
    };
  } catch (error) {
    console.error('Timeline generation error:', error);
    return {
      timeline: {} as Timeline,
      success: false,
      error: `Failed to generate valid timeline: ${(error as Error).message}`,
    };
  }
}

function createMockTimeline(prompt: string): Timeline {
  // Parse duration from prompt or default to 30 seconds
  const durationMatch = prompt.match(/(\d+)\s*(second|sec|minute|min)/i);
  let duration = 30; // default 30 seconds
  
  if (durationMatch) {
    const value = parseInt(durationMatch[1]);
    const unit = durationMatch[2].toLowerCase();
    if (unit.startsWith('min')) {
      duration = value * 60;
    } else {
      duration = value;
    }
  }

  // Create mock nodes based on prompt keywords
  const nodes: any[] = [];
  let currentTime = 0;

  // Add intro clip
  nodes.push({
    id: uuidv4(),
    type: 'clip',
    startTime: currentTime,
    duration: Math.min(5, duration),
    assetId: uuidv4(),
    scale: 1,
    opacity: 1,
    effects: [],
  });
  currentTime += Math.min(5, duration);

  // Add text based on prompt content
  if (duration - currentTime > 3) {
    nodes.push({
      id: uuidv4(),
      type: 'text',
      startTime: currentTime,
      duration: Math.min(3, duration - currentTime),
      content: prompt.substring(0, 50) + (prompt.length > 50 ? '...' : ''),
      fontFamily: 'Arial',
      fontSize: 24,
      color: '#ffffff',
      position: { x: 100, y: 100 },
      animation: 'fadeIn',
    });
    currentTime += Math.min(3, duration - currentTime);
  }

  // Add transition if enough time
  if (duration - currentTime > 2) {
    nodes.push({
      id: uuidv4(),
      type: 'transition',
      startTime: currentTime,
      duration: Math.min(2, duration - currentTime),
      transitionType: 'fade',
      fromClipId: nodes[0].id,
      toClipId: uuidv4(),
    });
    currentTime += Math.min(2, duration - currentTime);
  }

  // Add main content clip
  if (duration - currentTime > 5) {
    nodes.push({
      id: uuidv4(),
      type: 'clip',
      startTime: currentTime,
      duration: Math.min(10, duration - currentTime),
      assetId: uuidv4(),
      scale: 1,
      opacity: 1,
      effects: [],
    });
    currentTime += Math.min(10, duration - currentTime);
  }

  // Add audio
  nodes.push({
    id: uuidv4(),
    type: 'audio',
    startTime: 0,
    duration: duration,
    assetId: uuidv4(),
    volume: 0.8,
    fadeIn: 1,
    fadeOut: 1,
    loop: false,
  });

  return {
    schemaVersion: '1.0.0',
    duration: duration,
    fps: 30,
    resolution: {
      width: 1920,
      height: 1080,
    },
    nodes: nodes,
    metadata: {
      title: prompt.substring(0, 30),
      description: prompt,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  };
}
