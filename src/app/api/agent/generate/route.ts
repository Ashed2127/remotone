import { NextRequest, NextResponse } from 'next/server';
import { generateTimeline } from '@/lib/ai-planner';
import { pool } from '@/lib/db-mock';
import { v4 as uuidv4 } from 'uuid';
import { handleAgentError, createValidationErrors, formatAgentError } from '@/lib/agent-error-handler';

/**
 * AI Agent API for Motion Design Engine
 * 
 * This endpoint is designed to be easily consumed by AI agents for video generation.
 * It provides a simplified interface that abstracts the complexity of the underlying system.
 */

interface AgentGenerateRequest {
  // Core prompt - what the AI agent wants to create
  prompt: string;
  
  // Optional context for better generation
  context?: {
    product?: string;
    targetAudience?: string;
    brandGuidelines?: {
      colors?: string[];
      fonts?: string[];
      tone?: string;
    };
    assets?: Array<{
      type: 'image' | 'video' | 'audio';
      url: string;
      description?: string;
    }>;
  };
  
  // Video specifications
  specifications?: {
    duration?: number; // seconds
    resolution?: '720p' | '1080p' | '4k';
    format?: 'mp4' | 'webm' | 'gif';
    style?: 'professional' | 'casual' | 'cinematic' | 'minimalist' | 'bold';
    pacing?: 'slow' | 'medium' | 'fast';
  };
  
  // Advanced options
  options?: {
    autoRender?: boolean; // Automatically start rendering after timeline generation
    priority?: 'low' | 'normal' | 'high';
    webhookUrl?: string; // URL to call when rendering is complete
    existingTimelineId?: string; // For editing existing timelines
  };
}

interface AgentGenerateResponse {
  success: boolean;
  requestId: string;
  timeline?: any;
  timelineId?: string;
  renderJobId?: string;
  estimatedRenderTime?: number;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  message?: string;
  errors?: Array<{
    field: string;
    message: string;
    suggestion?: string;
  }>;
}

export async function POST(request: NextRequest) {
  const requestId = uuidv4();
  
  try {
    const body: AgentGenerateRequest = await request.json();
    
    // Validate required fields using agent error handler
    const validationErrors: Array<{ field: string; message: string }> = [];
    
    if (!body.prompt) {
      validationErrors.push({
        field: 'prompt',
        message: 'Prompt is required'
      });
    } else if (body.prompt.length < 10) {
      validationErrors.push({
        field: 'prompt',
        message: 'Prompt is too short (minimum 10 characters)'
      });
    }

    if (body.specifications) {
      if (body.specifications.duration && body.specifications.duration < 1) {
        validationErrors.push({
          field: 'specifications.duration',
          message: 'Duration must be at least 1 second'
        });
      }

      if (body.specifications.duration && body.specifications.duration > 300) {
        validationErrors.push({
          field: 'specifications.duration',
          message: 'Duration exceeds maximum limit (300 seconds)'
        });
      }
    }

    if (validationErrors.length > 0) {
      const agentErrors = createValidationErrors(validationErrors);
      return NextResponse.json(
        formatAgentError(agentErrors),
        { status: 400 }
      );
    }

    // Enhance prompt with context and specifications
    const enhancedPrompt = buildEnhancedPrompt(body);

    // Generate timeline
    const timelineResult = await generateTimeline({
      prompt: enhancedPrompt,
      existingTimeline: body.options?.existingTimelineId ? await getExistingTimeline(body.options.existingTimelineId) : undefined,
    });

    if (!timelineResult.success) {
      const agentError = handleAgentError({
        code: 'TIMELINE_GENERATION_FAILED',
        message: timelineResult.error || 'Failed to generate timeline',
        prompt: enhancedPrompt
      });
      return NextResponse.json(
        formatAgentError(agentError),
        { status: 500 }
      );
    }

    // Save timeline
    const user = { id: 'agent-user', orgId: 'agent-org' };
    const projectId = `agent-project-${requestId}`;
    const timelineId = await saveTimeline(user, projectId, timelineResult.timeline);

    // Auto-render if requested
    let renderJobId: string | undefined;
    let estimatedRenderTime: number | undefined;
    
    if (body.options?.autoRender) {
      const renderResult = await createRenderJob(
        user, 
        projectId, 
        timelineId, 
        body.specifications
      );
      
      if (renderResult.success) {
        renderJobId = renderResult.renderJobId;
        estimatedRenderTime = calculateEstimatedRenderTime(timelineResult.timeline, body.specifications);
      }
    }

    return NextResponse.json({
      success: true,
      requestId,
      timeline: timelineResult.timeline,
      timelineId,
      renderJobId,
      estimatedRenderTime,
      status: renderJobId ? 'processing' : 'pending',
      message: renderJobId 
        ? 'Timeline generated and rendering started' 
        : 'Timeline generated successfully. Use the timeline ID to start rendering.'
    });

  } catch (error) {
    console.error('Agent API error:', error);
    const agentError = handleAgentError(error);
    return NextResponse.json(
      formatAgentError(agentError),
      { status: 500 }
    );
  }
}

function buildEnhancedPrompt(request: AgentGenerateRequest): string {
  let prompt = request.prompt;
  
  // Add context
  if (request.context) {
    if (request.context.product) {
      prompt += `\nProduct: ${request.context.product}`;
    }
    if (request.context.targetAudience) {
      prompt += `\nTarget Audience: ${request.context.targetAudience}`;
    }
    if (request.context.brandGuidelines) {
      const guidelines = request.context.brandGuidelines;
      if (guidelines.colors?.length) {
        prompt += `\nBrand Colors: ${guidelines.colors.join(', ')}`;
      }
      if (guidelines.fonts?.length) {
        prompt += `\nBrand Fonts: ${guidelines.fonts.join(', ')}`;
      }
      if (guidelines.tone) {
        prompt += `\nBrand Tone: ${guidelines.tone}`;
      }
    }
    if (request.context.assets?.length) {
      prompt += `\nAvailable Assets: ${request.context.assets.map(a => a.type).join(', ')}`;
    }
  }
  
  // Add specifications
  if (request.specifications) {
    if (request.specifications.duration) {
      prompt += `\nDuration: ${request.specifications.duration} seconds`;
    }
    if (request.specifications.style) {
      prompt += `\nStyle: ${request.specifications.style}`;
    }
    if (request.specifications.pacing) {
      prompt += `\nPacing: ${request.specifications.pacing}`;
    }
  }
  
  return prompt;
}

async function getExistingTimeline(timelineId: string): Promise<any> {
  try {
    const result = await pool.query(
      'SELECT timeline_data FROM timelines WHERE id = $1',
      [timelineId]
    );
    return result.rows[0]?.timeline_data;
  } catch (error) {
    console.error('Error fetching existing timeline:', error);
    return undefined;
  }
}

async function saveTimeline(user: any, projectId: string, timeline: any): Promise<string> {
  const versionResult = await pool.query(
    `SELECT COALESCE(MAX(version), 0) + 1 as next_version 
     FROM timelines 
     WHERE project_id = $1`,
    [projectId]
  );

  const nextVersion = versionResult.rows[0].next_version;

  const result = await pool.query(
    `INSERT INTO timelines (project_id, org_id, version, timeline_data, created_by)
     VALUES ($1, $2, $3, $4, $5)
     RETURNING id`,
    [projectId, user.orgId, nextVersion, JSON.stringify(timeline), user.id]
  );

  return result.rows[0].id;
}

async function createRenderJob(
  user: any, 
  projectId: string, 
  timelineId: string, 
  specifications?: any
): Promise<{ success: boolean; renderJobId?: string }> {
  try {
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
        specifications?.format || 'mp4',
        specifications?.resolution || '1080p',
      ]
    );

    return { success: true, renderJobId };
  } catch (error) {
    console.error('Error creating render job:', error);
    return { success: false };
  }
}

function calculateEstimatedRenderTime(timeline: any, specifications?: any): number {
  // Base calculation: duration * complexity factor
  const duration = timeline.duration || 30;
  const nodeCount = timeline.nodes?.length || 0;
  
  // Complexity factors
  let complexityMultiplier = 1;
  if (specifications?.resolution === '4k') complexityMultiplier = 2.5;
  else if (specifications?.resolution === '1080p') complexityMultiplier = 1.5;
  
  if (specifications?.format === 'gif') complexityMultiplier *= 1.2;
  
  // More nodes = more complexity
  complexityMultiplier *= (1 + nodeCount * 0.1);
  
  return Math.ceil(duration * complexityMultiplier);
}