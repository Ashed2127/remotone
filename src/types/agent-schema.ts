import { z } from 'zod';

/**
 * AI Agent Schema for Remotone Motion Design Engine
 * 
 * This schema is designed to be simple, intuitive, and well-documented for AI agents
 * to understand and use for video generation.
 */

// ============================================================================
// CORE REQUEST SCHEMAS
// ============================================================================

/**
 * Simple video generation request for AI agents
 */
export const AgentVideoRequestSchema = z.object({
  // Required: What the agent wants to create
  prompt: z.string()
    .min(10, "Prompt must be at least 10 characters")
    .max(2000, "Prompt must be less than 2000 characters")
    .describe("A clear description of the video content to generate"),
  
  // Optional: Context to improve generation quality
  context: z.object({
    product: z.string().optional().describe("Name of the product being promoted"),
    targetAudience: z.string().optional().describe("Target audience for the video"),
    brandGuidelines: z.object({
      colors: z.array(z.string()).optional().describe("Brand color hex codes"),
      fonts: z.array(z.string()).optional().describe("Preferred font families"),
      tone: z.string().optional().describe("Brand tone (e.g., professional, casual, playful)")
    }).optional(),
    assets: z.array(z.object({
      type: z.enum(['image', 'video', 'audio']).describe("Asset type"),
      url: z.string().url().describe("Asset URL"),
      description: z.string().optional().describe("Description of the asset content")
    })).optional().describe("Available assets to use in the video")
  }).optional().describe("Additional context for better video generation"),
  
  // Optional: Video specifications
  specifications: z.object({
    duration: z.number()
      .min(1, "Duration must be at least 1 second")
      .max(300, "Duration must be less than 300 seconds")
      .optional()
      .describe("Video duration in seconds"),
    resolution: z.enum(['720p', '1080p', '4k'])
      .optional()
      .describe("Video resolution"),
    format: z.enum(['mp4', 'webm', 'gif'])
      .optional()
      .describe("Output video format"),
    style: z.enum(['professional', 'casual', 'cinematic', 'minimalist', 'bold'])
      .optional()
      .describe("Visual style of the video"),
    pacing: z.enum(['slow', 'medium', 'fast'])
      .optional()
      .describe("Animation pacing speed")
  }).optional().describe("Video output specifications"),
  
  // Optional: Advanced options
  options: z.object({
    autoRender: z.boolean()
      .optional()
      .describe("Automatically start rendering after timeline generation"),
    priority: z.enum(['low', 'normal', 'high'])
      .optional()
      .describe("Render job priority"),
    webhookUrl: z.string().url()
      .optional()
      .describe("URL to call when rendering is complete"),
    existingTimelineId: z.string()
      .optional()
      .describe("ID of existing timeline to edit")
  }).optional().describe("Advanced generation options")
});

/**
 * Response schema for video generation
 */
export const AgentVideoResponseSchema = z.object({
  success: z.boolean().describe("Whether the request was successful"),
  requestId: z.string().uuid().describe("Unique request identifier"),
  timeline: z.any().optional().describe("Generated timeline data"),
  timelineId: z.string().optional().describe("Timeline ID for further operations"),
  renderJobId: z.string().optional().describe("Render job ID if auto-rendering"),
  estimatedRenderTime: z.number().optional().describe("Estimated render time in seconds"),
  status: z.enum(['pending', 'processing', 'completed', 'failed'])
    .describe("Current status of the request"),
  message: z.string().optional().describe("Human-readable status message"),
  errors: z.array(z.object({
    field: z.string().describe("Field that caused the error"),
    message: z.string().describe("Error message"),
    suggestion: z.string().optional().describe("Suggested fix for the error")
  })).optional().describe("Validation or processing errors")
});

// ============================================================================
// SIMPLIFIED TIMELINE SCHEMA FOR AGENTS
// ============================================================================

/**
 * Simplified timeline node types that agents can easily understand
 */
export const SimpleTimelineNodeSchema = z.discriminatedUnion('type', [
  // Video/image clip
  z.object({
    type: z.literal('clip'),
    id: z.string().uuid(),
    startTime: z.number().min(0),
    duration: z.number().positive(),
    content: z.string().describe("Description of visual content"),
    assetId: z.string().uuid().optional(),
    position: z.object({
      x: z.number().default(0),
      y: z.number().default(0)
    }).optional(),
    scale: z.number().positive().default(1),
    effects: z.array(z.string()).optional()
  }),
  
  // Text overlay
  z.object({
    type: z.literal('text'),
    id: z.string().uuid(),
    startTime: z.number().min(0),
    duration: z.number().positive(),
    content: z.string().describe("Text to display"),
    style: z.object({
      fontSize: z.number().positive().default(24),
      color: z.string().default('#ffffff'),
      fontFamily: z.string().default('Arial'),
      fontWeight: z.string().default('normal')
    }).optional(),
    position: z.object({
      x: z.number(),
      y: z.number()
    }).optional(),
    animation: z.enum(['none', 'fadeIn', 'slideUp', 'typewriter', 'bounce']).default('none')
  }),
  
  // Audio
  z.object({
    type: z.literal('audio'),
    id: z.string().uuid(),
    startTime: z.number().min(0),
    duration: z.number().positive(),
    content: z.string().describe("Description of audio content"),
    assetId: z.string().uuid().optional(),
    volume: z.number().min(0).max(1).default(1),
    fadeIn: z.number().min(0).default(0),
    fadeOut: z.number().min(0).default(0)
  }),
  
  // Transition
  z.object({
    type: z.literal('transition'),
    id: z.string().uuid(),
    startTime: z.number().min(0),
    duration: z.number().positive().default(1),
    transitionType: z.enum(['fade', 'slide', 'zoom', 'wipe', 'dissolve']),
    fromClipId: z.string().uuid(),
    toClipId: z.string().uuid()
  })
]);

/**
 * Simplified timeline structure
 */
export const SimpleTimelineSchema = z.object({
  id: z.string().uuid().optional(),
  schemaVersion: z.string().default('2.0.0'),
  title: z.string().optional().describe("Timeline title"),
  description: z.string().optional().describe("Timeline description"),
  duration: z.number().positive().describe("Total duration in seconds"),
  fps: z.number().positive().default(30).describe("Frames per second"),
  resolution: z.object({
    width: z.number().positive().default(1920),
    height: z.number().positive().default(1080)
  }).optional().describe("Video resolution"),
  nodes: z.array(SimpleTimelineNodeSchema).describe("Timeline nodes"),
  metadata: z.object({
    createdAt: z.string().datetime().optional(),
    updatedAt: z.string().datetime().optional(),
    generatedBy: z.string().optional().describe("AI agent or system that generated this")
  }).optional()
});

// ============================================================================
// PRESET TEMPLATES FOR AGENTS
// ============================================================================

/**
 * Video preset templates that agents can use
 */
export const VideoPresetSchema = z.object({
  id: z.string().describe("Preset identifier"),
  name: z.string().describe("Human-readable preset name"),
  description: z.string().describe("What this preset is best for"),
  category: z.enum(['product', 'promotion', 'tutorial', 'social', 'corporate', 'cinematic'])
    .describe("Preset category"),
  defaultDuration: z.number().describe("Default duration in seconds"),
  defaultResolution: z.enum(['720p', '1080p', '4k']).describe("Default resolution"),
  style: z.enum(['professional', 'casual', 'cinematic', 'minimalist', 'bold'])
    .describe("Visual style"),
  structure: z.array(z.object({
    type: z.enum(['intro', 'content', 'highlight', 'call-to-action', 'outro']),
    duration: z.number().describe("Section duration"),
    description: z.string().describe("What this section should contain")
  })).describe("Video structure"),
  recommendedAssets: z.array(z.object({
    type: z.enum(['image', 'video', 'audio']),
    description: z.string().describe("What kind of asset is recommended")
  })).optional().describe("Recommended asset types")
});

// ============================================================================
// AGENT CAPABILITIES SCHEMA
// ============================================================================

/**
 * System capabilities that agents can query
 */
export const AgentCapabilitiesSchema = z.object({
  version: z.string().describe("API version"),
  supportedFormats: z.array(z.enum(['mp4', 'webm', 'gif'])).describe("Supported output formats"),
  supportedResolutions: z.array(z.enum(['720p', '1080p', '4k'])).describe("Supported resolutions"),
  maxDuration: z.number().describe("Maximum video duration in seconds"),
  supportedStyles: z.array(z.enum(['professional', 'casual', 'cinematic', 'minimalist', 'bold']))
    .describe("Supported visual styles"),
  supportedEffects: z.array(z.string()).describe("Supported visual effects"),
  supportedTransitions: z.array(z.enum(['fade', 'slide', 'zoom', 'wipe', 'dissolve']))
    .describe("Supported transition types"),
  features: z.array(z.object({
    name: z.string().describe("Feature name"),
    description: z.string().describe("Feature description"),
    enabled: z.boolean().describe("Whether feature is available")
  })).describe("Available features"),
  rateLimits: z.object({
    requestsPerMinute: z.number().describe("Rate limit per minute"),
    requestsPerDay: z.number().describe("Rate limit per day"),
    concurrentJobs: z.number().describe("Maximum concurrent render jobs")
  }).optional().describe("Rate limiting information")
});

// ============================================================================
// TYPE EXPORTS
// ============================================================================

export type AgentVideoRequest = z.infer<typeof AgentVideoRequestSchema>;
export type AgentVideoResponse = z.infer<typeof AgentVideoResponseSchema>;
export type SimpleTimelineNode = z.infer<typeof SimpleTimelineNodeSchema>;
export type SimpleTimeline = z.infer<typeof SimpleTimelineSchema>;
export type VideoPreset = z.infer<typeof VideoPresetSchema>;
export type AgentCapabilities = z.infer<typeof AgentCapabilitiesSchema>;

// ============================================================================
// VALIDATION HELPERS
// ============================================================================

/**
 * Validate agent video request
 */
export function validateAgentRequest(data: unknown): AgentVideoRequest {
  return AgentVideoRequestSchema.parse(data);
}

/**
 * Validate agent video response
 */
export function validateAgentResponse(data: unknown): AgentVideoResponse {
  return AgentVideoResponseSchema.parse(data);
}

/**
 * Validate simplified timeline
 */
export function validateSimpleTimeline(data: unknown): SimpleTimeline {
  return SimpleTimelineSchema.parse(data);
}

/**
 * Get JSON schema for agent requests (useful for documentation)
 */
export function getAgentRequestJsonSchema() {
  return AgentVideoRequestSchema;
}

/**
 * Get JSON schema for agent responses
 */
export function getAgentResponseJsonSchema() {
  return AgentVideoResponseSchema;
}