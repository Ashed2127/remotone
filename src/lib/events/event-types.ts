/**
 * Event Types for Event-Driven Architecture
 * 
 * Defines all events in the system for CQRS pattern and AI agent traceability.
 */

import { z } from 'zod';

/**
 * Base event structure
 */
export const BaseEventSchema = z.object({
  eventId: z.string().uuid(),
  eventType: z.string(),
  timestamp: z.string().datetime(),
  correlationId: z.string().uuid().optional().describe("ID to correlate related events"),
  causationId: z.string().uuid().optional().describe("ID of the event that caused this event"),
  userId: z.string().optional().describe("User who triggered the event"),
  metadata: z.record(z.any()).optional().describe("Additional event metadata")
});

export type BaseEvent = z.infer<typeof BaseEventSchema>;

// ============================================================================
// TIMELINE EVENTS
// ============================================================================

export const TimelineCreatedEventSchema = BaseEventSchema.extend({
  eventType: z.literal('TIMELINE_CREATED'),
  data: z.object({
    timelineId: z.string().uuid(),
    timeline: z.any(), // Timeline data
    projectId: z.string().uuid().optional(),
    generatedBy: z.string().optional().describe("AI agent or user who created it")
  })
});

export const TimelineUpdatedEventSchema = BaseEventSchema.extend({
  eventType: z.literal('TIMELINE_UPDATED'),
  data: z.object({
    timelineId: z.string().uuid(),
    changes: z.array(z.object({
      field: z.string(),
      oldValue: z.any(),
      newValue: z.any()
    })),
    updatedBy: z.string().optional()
  })
});

export const TimelineDeletedEventSchema = BaseEventSchema.extend({
  eventType: z.literal('TIMELINE_DELETED'),
  data: z.object({
    timelineId: z.string().uuid(),
    deletedBy: z.string().optional()
  })
});

export const TimelineValidatedEventSchema = BaseEventSchema.extend({
  eventType: z.literal('TIMELINE_VALIDATED'),
  data: z.object({
    timelineId: z.string().uuid(),
    isValid: z.boolean(),
    validationErrors: z.array(z.object({
      field: z.string(),
      message: z.string()
    })).optional()
  })
});

// ============================================================================
// RENDER EVENTS
// ============================================================================

export const RenderStartedEventSchema = BaseEventSchema.extend({
  eventType: z.literal('RENDER_STARTED'),
  data: z.object({
    renderJobId: z.string().uuid(),
    timelineId: z.string().uuid(),
    renderConfig: z.object({
      resolution: z.string(),
      format: z.string(),
      fps: z.number(),
      quality: z.string().optional()
    }),
    estimatedDuration: z.number().optional()
  })
});

export const RenderProgressEventSchema = BaseEventSchema.extend({
  eventType: z.literal('RENDER_PROGRESS'),
  data: z.object({
    renderJobId: z.string().uuid(),
    progress: z.number().min(0).max(1),
    currentFrame: z.number(),
    totalFrames: z.number(),
    currentStage: z.string(),
    estimatedTimeRemaining: z.number().optional()
  })
});

export const RenderCompletedEventSchema = BaseEventSchema.extend({
  eventType: z.literal('RENDER_COMPLETED'),
  data: z.object({
    renderJobId: z.string().uuid(),
    timelineId: z.string().uuid(),
    outputUrl: z.string().url(),
    duration: z.number(),
    fileSize: z.number(),
    metadata: z.record(z.any()).optional()
  })
});

export const RenderFailedEventSchema = BaseEventSchema.extend({
  eventType: z.literal('RENDER_FAILED'),
  data: z.object({
    renderJobId: z.string().uuid(),
    timelineId: z.string().uuid(),
    error: z.string(),
    errorCode: z.string(),
    stage: z.string().optional(),
    partialOutputUrl: z.string().url().optional()
  })
});

// ============================================================================
// ASSET EVENTS
// ============================================================================

export const AssetUploadedEventSchema = BaseEventSchema.extend({
  eventType: z.literal('ASSET_UPLOADED'),
  data: z.object({
    assetId: z.string().uuid(),
    assetType: z.enum(['image', 'video', 'audio', 'font']),
    originalFilename: z.string(),
    fileSize: z.number(),
    mimeType: z.string(),
    storageUrl: z.string().url(),
    uploadedBy: z.string().optional()
  })
});

export const AssetProcessedEventSchema = BaseEventSchema.extend({
  eventType: z.literal('ASSET_PROCESSED'),
  data: z.object({
    assetId: z.string().uuid(),
    processingStatus: z.enum(['completed', 'failed', 'partial']),
    processedUrls: z.array(z.object({
      type: z.string(),
      url: z.string().url()
    })).optional(),
    metadata: z.record(z.any()).optional(),
    error: z.string().optional()
  })
});

export const AssetDeletedEventSchema = BaseEventSchema.extend({
  eventType: z.literal('ASSET_DELETED'),
  data: z.object({
    assetId: z.string().uuid(),
    deletedBy: z.string().optional()
  })
});

// ============================================================================
// AI GENERATION EVENTS
// ============================================================================

export const AiGenerationStartedEventSchema = BaseEventSchema.extend({
  eventType: z.literal('AI_GENERATION_STARTED'),
  data: z.object({
    generationId: z.string().uuid(),
    prompt: z.string(),
    model: z.string(),
    parameters: z.record(z.any()).optional(),
    requestedBy: z.string().optional()
  })
});

export const AiGenerationProgressEventSchema = BaseEventSchema.extend({
  eventType: z.literal('AI_GENERATION_PROGRESS'),
  data: z.object({
    generationId: z.string().uuid(),
    stage: z.string(),
    progress: z.number().min(0).max(1),
    intermediateResults: z.any().optional()
  })
});

export const AiGenerationCompletedEventSchema = BaseEventSchema.extend({
  eventType: z.literal('AI_GENERATION_COMPLETED'),
  data: z.object({
    generationId: z.string().uuid(),
    result: z.any(),
    tokensUsed: z.number().optional(),
    processingTime: z.number()
  })
});

export const AiGenerationFailedEventSchema = BaseEventSchema.extend({
  eventType: z.literal('AI_GENERATION_FAILED'),
  data: z.object({
    generationId: z.string().uuid(),
    error: z.string(),
    errorCode: z.string(),
    retryAttempt: z.number().optional()
  })
});

// ============================================================================
// AUDIO EVENTS
// ============================================================================

export const AudioGeneratedEventSchema = BaseEventSchema.extend({
  eventType: z.literal('AUDIO_GENERATED'),
  data: z.object({
    audioId: z.string().uuid(),
    audioUrl: z.string().url(),
    duration: z.number(),
    parameters: z.record(z.any()),
    engine: z.string()
  })
});

export const AudioProcessingFailedEventSchema = BaseEventSchema.extend({
  eventType: z.literal('AUDIO_PROCESSING_FAILED'),
  data: z.object({
    audioId: z.string().uuid(),
    error: z.string(),
    engine: z.string()
  })
});

// ============================================================================
// USER EVENTS
// ============================================================================

export const UserCreatedEventSchema = BaseEventSchema.extend({
  eventType: z.literal('USER_CREATED'),
  data: z.object({
    userId: z.string().uuid(),
    email: z.string().email(),
    organizationId: z.string().uuid().optional()
  })
});

export const UserQuotaExceededEventSchema = BaseEventSchema.extend({
  eventType: z.literal('USER_QUOTA_EXCEEDED'),
  data: z.object({
    userId: z.string().uuid(),
    quotaType: z.string(),
    currentUsage: z.number(),
    limit: z.number()
  })
});

// ============================================================================
// SYSTEM EVENTS
// ============================================================================

export const SystemErrorEventSchema = BaseEventSchema.extend({
  eventType: z.literal('SYSTEM_ERROR'),
  data: z.object({
    error: z.string(),
    stackTrace: z.string().optional(),
    component: z.string(),
    severity: z.enum(['low', 'medium', 'high', 'critical'])
  })
});

export const ServiceDegradedEventSchema = BaseEventSchema.extend({
  eventType: z.literal('SERVICE_DEGRADED'),
  data: z.object({
    service: z.string(),
    degradationLevel: z.enum(['minor', 'major', 'outage']),
    estimatedRecoveryTime: z.number().optional(),
    affectedFeatures: z.array(z.string())
  })
});

// ============================================================================
// EVENT UNION
// ============================================================================

export const DomainEventSchema = z.discriminatedUnion('eventType', [
  TimelineCreatedEventSchema,
  TimelineUpdatedEventSchema,
  TimelineDeletedEventSchema,
  TimelineValidatedEventSchema,
  RenderStartedEventSchema,
  RenderProgressEventSchema,
  RenderCompletedEventSchema,
  RenderFailedEventSchema,
  AssetUploadedEventSchema,
  AssetProcessedEventSchema,
  AssetDeletedEventSchema,
  AiGenerationStartedEventSchema,
  AiGenerationProgressEventSchema,
  AiGenerationCompletedEventSchema,
  AiGenerationFailedEventSchema,
  AudioGeneratedEventSchema,
  AudioProcessingFailedEventSchema,
  UserCreatedEventSchema,
  UserQuotaExceededEventSchema,
  SystemErrorEventSchema,
  ServiceDegradedEventSchema
]);

export type DomainEvent = z.infer<typeof DomainEventSchema>;

// ============================================================================
// EVENT CATEGORIES FOR SUBSCRIPTION
// ============================================================================

export const EventCategories = {
  TIMELINE: ['TIMELINE_CREATED', 'TIMELINE_UPDATED', 'TIMELINE_DELETED', 'TIMELINE_VALIDATED'],
  RENDER: ['RENDER_STARTED', 'RENDER_PROGRESS', 'RENDER_COMPLETED', 'RENDER_FAILED'],
  ASSET: ['ASSET_UPLOADED', 'ASSET_PROCESSED', 'ASSET_DELETED'],
  AI_GENERATION: ['AI_GENERATION_STARTED', 'AI_GENERATION_PROGRESS', 'AI_GENERATION_COMPLETED', 'AI_GENERATION_FAILED'],
  AUDIO: ['AUDIO_GENERATED', 'AUDIO_PROCESSING_FAILED'],
  USER: ['USER_CREATED', 'USER_QUOTA_EXCEEDED'],
  SYSTEM: ['SYSTEM_ERROR', 'SERVICE_DEGRADED']
} as const;

export type EventCategory = keyof typeof EventCategories;