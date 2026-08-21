/**
 * Functional Core for Render Operations
 * 
 * Pure functions for render business logic. These functions are:
 * - Deterministic (same input = same output)
 * - Side-effect free
 * - Easy to test
 * - Easy for AI agents to understand and reason about
 */

import { z } from 'zod';
import { Timeline } from '../types/timeline';

// ============================================================================
// RENDER CONFIGURATION
// ============================================================================

export const RenderConfigSchema = z.object({
  resolution: z.enum(['720p', '1080p', '4k']),
  format: z.enum(['mp4', 'webm', 'gif']),
  fps: z.number().positive(),
  quality: z.enum(['low', 'medium', 'high']).optional(),
  codec: z.string().optional(),
  bitrate: z.number().positive().optional()
});

export type RenderConfig = z.infer<typeof RenderConfigSchema>;

/**
 * Pure function to validate render configuration
 */
export function validateRenderConfig(config: unknown): { isValid: boolean; errors: string[] } {
  try {
    RenderConfigSchema.parse(config);
    return { isValid: true, errors: [] };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        isValid: false,
        errors: error.errors.map(e => `${e.path.join('.')}: ${e.message}`)
      };
    }
    return {
      isValid: false,
      errors: ['Unknown validation error']
    };
  }
}

/**
 * Pure function to get resolution dimensions
 */
export function getResolutionDimensions(resolution: '720p' | '1080p' | '4k'): { width: number; height: number } {
  const dimensions = {
    '720p': { width: 1280, height: 720 },
    '1080p': { width: 1920, height: 1080 },
    '4k': { width: 3840, height: 2160 }
  };
  
  return dimensions[resolution];
}

/**
 * Pure function to calculate total frames
 */
export function calculateTotalFrames(duration: number, fps: number): number {
  return Math.ceil(duration * fps);
}

/**
 * Pure function to estimate render time
 */
export function estimateRenderTime(
  timeline: Timeline,
  config: RenderConfig,
  complexity: number = 0.5
): { estimatedSeconds: number; estimatedMinutes: number; factors: Record<string, number> } {
  const dimensions = getResolutionDimensions(config.resolution);
  const totalPixels = dimensions.width * dimensions.height;
  const totalFrames = calculateTotalFrames(timeline.duration, config.fps);
  
  // Base render time factors
  const pixelFactor = totalPixels / (1920 * 1080); // Normalized to 1080p
  const frameFactor = totalFrames / 900; // Normalized to 30 seconds at 30fps
  const complexityFactor = 0.5 + complexity; // Complexity multiplier
  const qualityFactor = config.quality === 'high' ? 1.5 : config.quality === 'medium' ? 1.0 : 0.7;
  
  // Calculate base render time (in seconds)
  const baseRenderTime = 30; // 30 seconds base for simple 1080p render
  const estimatedSeconds = baseRenderTime * pixelFactor * frameFactor * complexityFactor * qualityFactor;
  
  return {
    estimatedSeconds: Math.round(estimatedSeconds),
    estimatedMinutes: Math.round(estimatedSeconds / 60),
    factors: {
      pixelFactor,
      frameFactor,
      complexityFactor,
      qualityFactor
    }
  };
}

/**
 * Pure function to calculate output file size
 */
export function estimateOutputFileSize(
  duration: number,
  resolution: '720p' | '1080p' | '4k',
  format: 'mp4' | 'webm' | 'gif',
  quality: 'low' | 'medium' | 'high' = 'medium'
): { estimatedBytes: number; estimatedMB: number } {
  const dimensions = getResolutionDimensions(resolution);
  const totalPixels = dimensions.width * dimensions.height;
  
  // Base bitrate estimates (in bits per second per pixel)
  const bitratePerPixel = {
    'low': 0.01,
    'medium': 0.02,
    'high': 0.04
  };
  
  const formatMultiplier = {
    'mp4': 1.0,
    'webm': 0.8,
    'gif': 2.0
  };
  
  const bitrate = totalPixels * bitratePerPixel[quality] * formatMultiplier[format];
  const totalBits = bitrate * duration;
  const estimatedBytes = totalBits / 8;
  
  return {
    estimatedBytes: Math.round(estimatedBytes),
    estimatedMB: Math.round(estimatedBytes / (1024 * 1024))
  };
}

// ============================================================================
// RENDER PROGRESS CALCULATIONS
// ============================================================================

export interface RenderProgress {
  currentFrame: number;
  totalFrames: number;
  currentStage: string;
  stageProgress: number;
  overallProgress: number;
  estimatedTimeRemaining: number;
}

/**
 * Pure function to calculate render progress
 */
export function calculateRenderProgress(
  currentFrame: number,
  totalFrames: number,
  currentStage: string,
  stageStartTime: number,
  estimatedStageDuration: number,
  totalEstimatedDuration: number
): RenderProgress {
  const stageProgress = Math.min((Date.now() - stageStartTime) / estimatedStageDuration, 1);
  const overallProgress = Math.min(currentFrame / totalFrames, 1);
  const elapsedTime = Date.now() - stageStartTime;
  const estimatedTimeRemaining = Math.max(totalEstimatedDuration - elapsedTime, 0);
  
  return {
    currentFrame,
    totalFrames,
    currentStage,
    stageProgress: Math.round(stageProgress * 100) / 100,
    overallProgress: Math.round(overallProgress * 100) / 100,
    estimatedTimeRemaining: Math.round(estimatedTimeRemaining / 1000) // Convert to seconds
  };
}

/**
 * Pure function to determine render stage
 */
export function getRenderStage(progress: number): string {
  if (progress < 0.1) return 'initializing';
  if (progress < 0.3) return 'processing_timeline';
  if (progress < 0.5) return 'rendering_frames';
  if (progress < 0.8) return 'encoding';
  if (progress < 0.95) return 'finalizing';
  return 'completed';
}

// ============================================================================
// RENDER OPTIMIZATION
// ============================================================================

/**
 * Pure function to suggest render optimizations
 */
export function suggestRenderOptimizations(
  timeline: Timeline,
  config: RenderConfig
): string[] {
  const suggestions: string[] = [];
  const dimensions = getResolutionDimensions(config.resolution);
  const totalFrames = calculateTotalFrames(timeline.duration, config.fps);
  
  // Check resolution
  if (config.resolution === '4k' && timeline.duration > 60) {
    suggestions.push('Consider rendering at 1080p for long videos to reduce render time.');
  }
  
  // Check frame rate
  if (config.fps > 30 && timeline.duration > 120) {
    suggestions.push('Consider reducing FPS to 30 for long videos to improve performance.');
  }
  
  // Check format
  if (config.format === 'gif' && timeline.duration > 30) {
    suggestions.push('GIF format is not recommended for videos longer than 30 seconds. Consider MP4.');
  }
  
  // Check complexity
  if (timeline.nodes.length > 100) {
    suggestions.push('Timeline has many nodes. Consider simplifying to reduce render time.');
  }
  
  // Check quality
  if (config.quality === 'high' && config.resolution === '4k') {
    suggestions.push('High quality 4K rendering may take significant time. Consider medium quality for faster renders.');
  }
  
  return suggestions;
}

/**
 * Pure function to optimize render configuration
 */
export function optimizeRenderConfig(
  timeline: Timeline,
  originalConfig: RenderConfig,
  priority: 'speed' | 'quality' | 'balanced'
): RenderConfig {
  const optimizedConfig = { ...originalConfig };
  
  if (priority === 'speed') {
    // Optimize for speed
    if (optimizedConfig.resolution === '4k') {
      optimizedConfig.resolution = '1080p';
    }
    if (optimizedConfig.fps > 30) {
      optimizedConfig.fps = 30;
    }
    optimizedConfig.quality = 'low';
  } else if (priority === 'quality') {
    // Optimize for quality
    optimizedConfig.quality = 'high';
    if (optimizedConfig.fps < 60) {
      optimizedConfig.fps = 60;
    }
  }
  // balanced uses original config
  
  return optimizedConfig;
}

// ============================================================================
// RENDER VALIDATION
// ============================================================================

/**
 * Pure function to validate timeline for rendering
 */
export function validateTimelineForRender(timeline: Timeline): { isValid: boolean; errors: string[]; warnings: string[] } {
  const errors: string[] = [];
  const warnings: string[] = [];
  
  // Check if timeline has nodes
  if (timeline.nodes.length === 0) {
    errors.push('Timeline has no nodes to render');
  }
  
  // Check if duration is valid
  if (timeline.duration <= 0) {
    errors.push('Timeline duration must be positive');
  }
  
  // Check if FPS is valid
  if (timeline.fps <= 0 || timeline.fps > 120) {
    errors.push('Timeline FPS must be between 1 and 120');
  }
  
  // Check resolution
  if (timeline.resolution.width <= 0 || timeline.resolution.height <= 0) {
    errors.push('Timeline resolution must be positive');
  }
  
  // Check for very long duration
  if (timeline.duration > 600) {
    warnings.push('Timeline duration exceeds 10 minutes. This may take a long time to render.');
  }
  
  // Check for very high resolution
  if (timeline.resolution.width > 4096 || timeline.resolution.height > 4096) {
    warnings.push('Timeline resolution exceeds 4K. This may require significant resources.');
  }
  
  return {
    isValid: errors.length === 0,
    errors,
    warnings
  };
}

/**
 * Pure function to check render compatibility
 */
export function checkRenderCompatibility(
  timeline: Timeline,
  config: RenderConfig
): { isCompatible: boolean; issues: string[] } {
  const issues: string[] = [];
  
  // Check if timeline FPS matches config FPS
  if (timeline.fps !== config.fps) {
    issues.push(`Timeline FPS (${timeline.fps}) differs from render config FPS (${config.fps})`);
  }
  
  // Check if resolution matches
  const timelineRes = `${timeline.resolution.width}x${timeline.resolution.height}`;
  const configRes = getResolutionDimensions(config.resolution);
  const configResStr = `${configRes.width}x${configRes.height}`;
  
  if (timelineRes !== configResStr) {
    issues.push(`Timeline resolution (${timelineRes}) differs from render config resolution (${configResStr})`);
  }
  
  return {
    isCompatible: issues.length === 0,
    issues
  };
}

// ============================================================================
// RENDER METADATA
// ============================================================================

/**
 * Pure function to generate render metadata
 */
export function generateRenderMetadata(
  timelineId: string,
  config: RenderConfig,
  timeline: Timeline
): Record<string, any> {
  const dimensions = getResolutionDimensions(config.resolution);
  const totalFrames = calculateTotalFrames(timeline.duration, config.fps);
  const sizeEstimate = estimateOutputFileSize(timeline.duration, config.resolution, config.format, config.quality);
  const timeEstimate = estimateRenderTime(timeline, config);
  
  return {
    timelineId,
    renderConfig: config,
    outputDimensions: dimensions,
    totalFrames,
    estimatedFileSize: sizeEstimate,
    estimatedRenderTime: timeEstimate,
    nodeCount: timeline.nodes.length,
    timelineDuration: timeline.duration,
    timestamp: new Date().toISOString()
  };
}

/**
 * Pure function to format render statistics
 */
export function formatRenderStatistics(metadata: Record<string, any>): string {
  const parts = [
    `Render Configuration:`,
    `  Resolution: ${metadata.outputDimensions.width}x${metadata.outputDimensions.height}`,
    `  Format: ${metadata.renderConfig.format}`,
    `  FPS: ${metadata.renderConfig.fps}`,
    `  Quality: ${metadata.renderConfig.quality || 'default'}`,
    ``,
    `Timeline Statistics:`,
    `  Duration: ${metadata.timelineDuration}s`,
    `  Total Frames: ${metadata.totalFrames}`,
    `  Node Count: ${metadata.nodeCount}`,
    ``,
    `Estimates:`,
    `  File Size: ~${metadata.estimatedFileSize.estimatedMB}MB`,
    `  Render Time: ~${metadata.estimatedRenderTime.estimatedMinutes}min`
  ];
  
  return parts.join('\n');
}