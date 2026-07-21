import Anthropic from '@anthropic-ai/sdk';
import { validateTimeline, Timeline } from '@/types/timeline';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

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
    const systemPrompt = `You are an expert video timeline planner. Generate structured Timeline JSON documents based on user prompts.

The timeline schema includes:
- schemaVersion: string (default "1.0.0")
- duration: number (total duration in seconds)
- fps: number (default 30)
- resolution: { width, height } (default 1920x1080)
- nodes: array of timeline nodes
  - clip: video/image clips with positioning and effects
  - transition: transitions between clips (fade, slide, zoom, wipe)
  - text: text overlays with styling and animations
  - audio: audio cues with volume and fade controls

All nodes must have:
- id: UUID string
- type: one of the node types
- startTime: number (seconds)
- duration: number (seconds)

Generate realistic, well-structured timelines that match the user's intent. Keep timing logical and coherent.`;

    let userPrompt = `Generate a timeline for: ${request.prompt}`;

    if (request.existingTimeline) {
      userPrompt += `\n\nExisting timeline (for context):\n${JSON.stringify(request.existingTimeline, null, 2)}`;
    }

    if (request.editScope) {
      userPrompt += `\n\nEdit scope - modify node ${request.editScope.nodeId}:\n`;
      userPrompt += `Edit type: ${request.editScope.editType}\n`;
      userPrompt += `New value: ${JSON.stringify(request.editScope.newValue)}\n`;
      userPrompt += `Only modify the specified node, keep everything else unchanged.`;
    }

    const message = await anthropic.messages.create({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 4096,
      system: systemPrompt,
      messages: [
        {
          role: 'user',
          content: userPrompt,
        },
      ],
    });

    // Extract JSON from the response
    const content = message.content[0];
    if (content.type !== 'text') {
      throw new Error('Unexpected response type from Claude');
    }

    // Parse JSON from the text response
    const jsonMatch = content.text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('No JSON found in Claude response');
    }

    const timelineData = JSON.parse(jsonMatch[0]);

    // Validate against schema
    const validatedTimeline = validateTimeline(timelineData);

    return {
      timeline: validatedTimeline,
      success: true,
    };
  } catch (error) {
    console.error('Timeline generation error:', error);

    // Try one repair retry
    try {
      return await repairTimeline(request, error as Error);
    } catch (repairError) {
      return {
        timeline: {} as Timeline,
        success: false,
        error: `Failed to generate valid timeline: ${(error as Error).message}`,
      };
    }
  }
}

async function repairTimeline(
  request: PlanningRequest,
  originalError: Error
): Promise<PlanningResponse> {
  const repairPrompt = `The previous timeline generation failed validation. Error: ${originalError.message}

Original request: ${request.prompt}

Please fix the timeline to comply with the schema and try again. Ensure all required fields are present and types are correct.`;

  const message = await anthropic.messages.create({
    model: 'claude-3-5-sonnet-20241022',
    max_tokens: 4096,
    system: 'You are an expert video timeline planner. Fix schema validation errors in timeline JSON.',
    messages: [
      {
        role: 'user',
        content: repairPrompt,
      },
    ],
  });

  const content = message.content[0];
  if (content.type !== 'text') {
    throw new Error('Unexpected response type from Claude during repair');
  }

  const jsonMatch = content.text.match(/\{[\s\S]*\}/);
  if (!jsonMatch) {
    throw new Error('No JSON found in Claude repair response');
  }

  const timelineData = JSON.parse(jsonMatch[0]);
  const validatedTimeline = validateTimeline(timelineData);

  return {
    timeline: validatedTimeline,
    success: true,
  };
}
