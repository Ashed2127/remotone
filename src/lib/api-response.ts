/**
 * Standardized API Response Format
 * 
 * This provides a consistent response structure across all API endpoints,
 * making it easier for AI agents to parse and understand responses.
 */

import { z } from 'zod';

/**
 * Standard error structure
 */
export const ApiErrorSchema = z.object({
  code: z.string().describe("Machine-readable error code"),
  message: z.string().describe("Human-readable error message"),
  suggestions: z.array(z.string()).optional().describe("Actionable suggestions to fix the error"),
  context: z.record(z.any()).optional().describe("Additional error context")
});

export type ApiError = z.infer<typeof ApiErrorSchema>;

/**
 * Standard metadata structure
 */
export const ApiMetadataSchema = z.object({
  requestId: z.string().uuid().describe("Unique request identifier"),
  timestamp: z.string().datetime().describe("ISO timestamp of the response"),
  processingTime: z.number().describe("Processing time in milliseconds"),
  version: z.string().describe("API version"),
  requestIdempotent: z.boolean().optional().describe("Whether this was an idempotent request")
});

export type ApiMetadata = z.infer<typeof ApiMetadataSchema>;

/**
 * Standard API response structure
 */
export const ApiResponseSchema = z.object({
  success: z.boolean().describe("Whether the operation was successful"),
  data: z.any().optional().describe("Response data if successful"),
  error: ApiErrorSchema.optional().describe("Error details if unsuccessful"),
  metadata: ApiMetadataSchema.describe("Request metadata")
});

export type ApiResponse<T = any> = z.infer<typeof ApiResponseSchema> & {
  data?: T;
};

/**
 * Helper function to create a successful response
 */
export function createSuccessResponse<T>(
  data: T,
  metadata: Partial<ApiMetadata> = {}
): ApiResponse<T> {
  return {
    success: true,
    data,
    metadata: {
      requestId: metadata.requestId || crypto.randomUUID(),
      timestamp: metadata.timestamp || new Date().toISOString(),
      processingTime: metadata.processingTime || 0,
      version: metadata.version || '1.0.0',
      requestIdempotent: metadata.requestIdempotent
    }
  };
}

/**
 * Helper function to create an error response
 */
export function createErrorResponse(
  error: Partial<ApiError>,
  metadata: Partial<ApiMetadata> = {}
): ApiResponse {
  return {
    success: false,
    error: {
      code: error.code || 'UNKNOWN_ERROR',
      message: error.message || 'An unknown error occurred',
      suggestions: error.suggestions || [],
      context: error.context
    },
    metadata: {
      requestId: metadata.requestId || crypto.randomUUID(),
      timestamp: metadata.timestamp || new Date().toISOString(),
      processingTime: metadata.processingTime || 0,
      version: metadata.version || '1.0.0',
      requestIdempotent: metadata.requestIdempotent
    }
  };
}

/**
 * Common error codes
 */
export const ErrorCodes = {
  // Validation errors
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  INVALID_INPUT: 'INVALID_INPUT',
  MISSING_REQUIRED_FIELD: 'MISSING_REQUIRED_FIELD',
  
  // Authentication/Authorization
  UNAUTHORIZED: 'UNAUTHORIZED',
  FORBIDDEN: 'FORBIDDEN',
  INVALID_API_KEY: 'INVALID_API_KEY',
  
  // Resource errors
  NOT_FOUND: 'NOT_FOUND',
  ALREADY_EXISTS: 'ALREADY_EXISTS',
  RESOURCE_CONFLICT: 'RESOURCE_CONFLICT',
  
  // Business logic errors
  INVALID_TIMELINE: 'INVALID_TIMELINE',
  RENDER_FAILED: 'RENDER_FAILED',
  ASSET_PROCESSING_FAILED: 'ASSET_PROCESSING_FAILED',
  AI_GENERATION_FAILED: 'AI_GENERATION_FAILED',
  
  // Rate limiting
  RATE_LIMIT_EXCEEDED: 'RATE_LIMIT_EXCEEDED',
  QUOTA_EXCEEDED: 'QUOTA_EXCEEDED',
  
  // System errors
  INTERNAL_ERROR: 'INTERNAL_ERROR',
  SERVICE_UNAVAILABLE: 'SERVICE_UNAVAILABLE',
  TIMEOUT: 'TIMEOUT',
  
  // External service errors
  EXTERNAL_SERVICE_ERROR: 'EXTERNAL_SERVICE_ERROR',
  AI_SERVICE_ERROR: 'AI_SERVICE_ERROR',
  STORAGE_ERROR: 'STORAGE_ERROR'
} as const;

/**
 * Pre-configured error responses
 */
export const ErrorResponses = {
  validationError: (field: string, message: string) => createErrorResponse({
    code: ErrorCodes.VALIDATION_ERROR,
    message: `Validation failed for field: ${field}`,
    suggestions: [`Check the ${field} parameter`, 'Refer to API documentation for valid formats']
  }),

  unauthorized: () => createErrorResponse({
    code: ErrorCodes.UNAUTHORIZED,
    message: 'Authentication required',
    suggestions: ['Provide a valid API key', 'Check your authentication credentials']
  }),

  notFound: (resource: string) => createErrorResponse({
    code: ErrorCodes.NOT_FOUND,
    message: `${resource} not found`,
    suggestions: ['Verify the resource ID', 'Check if the resource exists']
  }),

  rateLimitExceeded: () => createErrorResponse({
    code: ErrorCodes.RATE_LIMIT_EXCEEDED,
    message: 'Rate limit exceeded',
    suggestions: ['Wait before retrying', 'Consider upgrading your plan']
  }),

  renderFailed: (reason: string) => createErrorResponse({
    code: ErrorCodes.RENDER_FAILED,
    message: `Video rendering failed: ${reason}`,
    suggestions: ['Check the timeline configuration', 'Verify all assets are accessible', 'Try with simpler effects']
  }),

  aiGenerationFailed: (reason: string) => createErrorResponse({
    code: ErrorCodes.AI_GENERATION_FAILED,
    message: `AI generation failed: ${reason}`,
    suggestions: ['Try rephrasing your prompt', 'Check if the service is available', 'Contact support if issue persists']
  })
};

/**
 * Middleware helper to track processing time
 */
export function withProcessingTime<T>(
  operation: () => T,
  metadata: Partial<ApiMetadata> = {}
): { result: T; processingTime: number } {
  const startTime = Date.now();
  const result = operation();
  const processingTime = Date.now() - startTime;
  
  return { result, processingTime };
}

/**
 * Validation helper with standardized error response
 */
export function validateWithSchema<T>(
  schema: z.ZodType<T>,
  data: unknown
): { success: true; data: T } | { success: false; error: ApiResponse } {
  try {
    const validatedData = schema.parse(data);
    return { success: true, data: validatedData };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        success: false,
        error: createErrorResponse({
          code: ErrorCodes.VALIDATION_ERROR,
          message: 'Validation failed',
          suggestions: error.errors.map(e => `${e.path.join('.')}: ${e.message}`),
          context: { validationErrors: error.errors }
        })
      };
    }
    return {
      success: false,
      error: createErrorResponse({
        code: ErrorCodes.VALIDATION_ERROR,
        message: 'Unknown validation error'
      })
    };
  }
}