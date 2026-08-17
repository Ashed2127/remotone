/**
 * Agent-Friendly Error Handler
 * 
 * Provides comprehensive error handling and feedback specifically designed for AI agents.
 * Errors are structured to be easily parseable and actionable by AI systems.
 */

export interface AgentError {
  code: string;
  message: string;
  field?: string;
  suggestion?: string;
  context?: Record<string, any>;
  recoverable: boolean;
  retryStrategy?: 'immediate' | 'exponential' | 'manual' | 'none';
}

export class AgentErrorHandler {
  private errorPatterns: Map<string, (error: any) => AgentError> = new Map();

  constructor() {
    this.initializeErrorPatterns();
  }

  /**
   * Initialize error pattern matchers
   */
  private initializeErrorPatterns() {
    // Validation errors
    this.errorPatterns.set('validation', (error) => ({
      code: 'VALIDATION_ERROR',
      message: error.message || 'Input validation failed',
      field: error.field,
      suggestion: this.getSuggestionForField(error.field),
      recoverable: true,
      retryStrategy: 'immediate'
    }));

    // Rate limit errors
    this.errorPatterns.set('rate_limit', (error) => ({
      code: 'RATE_LIMIT_EXCEEDED',
      message: 'API rate limit exceeded',
      suggestion: 'Wait before making more requests or implement exponential backoff',
      context: {
        retryAfter: error.retryAfter || 60
      },
      recoverable: true,
      retryStrategy: 'exponential'
    }));

    // Authentication errors
    this.errorPatterns.set('auth', (error) => ({
      code: 'AUTHENTICATION_ERROR',
      message: 'Authentication failed',
      suggestion: 'Check your API key and ensure it is valid',
      recoverable: false,
      retryStrategy: 'manual'
    }));

    // Timeline generation errors
    this.errorPatterns.set('timeline_generation', (error) => ({
      code: 'TIMELINE_GENERATION_FAILED',
      message: 'Failed to generate video timeline',
      suggestion: 'Try rephrasing your prompt or providing more specific details',
      context: {
        originalPrompt: error.prompt,
        errorDetails: error.details
      },
      recoverable: true,
      retryStrategy: 'immediate'
    }));

    // Render job errors
    this.errorPatterns.set('render_job', (error) => ({
      code: 'RENDER_JOB_FAILED',
      message: 'Video rendering failed',
      suggestion: 'Check the timeline for complex elements that might cause rendering issues',
      context: {
        renderJobId: error.renderJobId,
        stage: error.stage
      },
      recoverable: true,
      retryStrategy: 'immediate'
    }));

    // Asset errors
    this.errorPatterns.set('asset', (error) => ({
      code: 'ASSET_ERROR',
      message: 'Asset processing failed',
      field: error.assetUrl ? 'assetUrl' : undefined,
      suggestion: 'Ensure the asset URL is accessible and the file format is supported',
      context: {
        assetType: error.assetType,
        assetUrl: error.assetUrl
      },
      recoverable: true,
      retryStrategy: 'manual'
    }));

    // Network errors
    this.errorPatterns.set('network', (error) => ({
      code: 'NETWORK_ERROR',
      message: 'Network connection failed',
      suggestion: 'Check your internet connection and try again',
      recoverable: true,
      retryStrategy: 'exponential'
    }));

    // Timeout errors
    this.errorPatterns.set('timeout', (error) => ({
      code: 'TIMEOUT_ERROR',
      message: 'Request timed out',
      suggestion: 'The operation took too long. Try with a shorter video or simpler content',
      context: {
        timeout: error.timeout
      },
      recoverable: true,
      retryStrategy: 'exponential'
    }));

    // Database errors
    this.errorPatterns.set('database', (error) => ({
      code: 'DATABASE_ERROR',
      message: 'Database operation failed',
      suggestion: 'Internal system error. Please try again later',
      recoverable: false,
      retryStrategy: 'none'
    }));

    // AI service errors
    this.errorPatterns.set('ai_service', (error) => ({
      code: 'AI_SERVICE_ERROR',
      message: 'AI service unavailable',
      suggestion: 'The AI service is temporarily unavailable. Please try again later',
      recoverable: true,
      retryStrategy: 'exponential'
    }));
  }

  /**
   * Handle an error and return agent-friendly error structure
   */
  handleError(error: unknown): AgentError {
    // If already an AgentError, return as-is
    if (this.isAgentError(error)) {
      return error;
    }

    // Determine error type
    const errorType = this.classifyError(error);
    const errorHandler = this.errorPatterns.get(errorType);

    if (errorHandler) {
      return errorHandler(error);
    }

    // Default error handler
    return this.createDefaultError(error);
  }

  /**
   * Classify error type
   */
  private classifyError(error: unknown): string {
    const errorMessage = error instanceof Error ? error.message.toLowerCase() : '';
    const errorObj = error as any;

    // Check for specific error indicators
    if (errorMessage.includes('validation') || errorObj.field) {
      return 'validation';
    }
    if (errorMessage.includes('rate limit') || errorMessage.includes('too many requests')) {
      return 'rate_limit';
    }
    if (errorMessage.includes('auth') || errorMessage.includes('unauthorized') || errorMessage.includes('api key')) {
      return 'auth';
    }
    if (errorMessage.includes('timeline') || errorMessage.includes('generation')) {
      return 'timeline_generation';
    }
    if (errorMessage.includes('render') || errorMessage.includes('encoding')) {
      return 'render_job';
    }
    if (errorMessage.includes('asset') || errorMessage.includes('image') || errorMessage.includes('video')) {
      return 'asset';
    }
    if (errorMessage.includes('network') || errorMessage.includes('fetch') || errorMessage.includes('connection')) {
      return 'network';
    }
    if (errorMessage.includes('timeout') || errorMessage.includes('timed out')) {
      return 'timeout';
    }
    if (errorMessage.includes('database') || errorMessage.includes('db')) {
      return 'database';
    }
    if (errorMessage.includes('ai') || errorMessage.includes('claude') || errorMessage.includes('anthropic')) {
      return 'ai_service';
    }

    return 'unknown';
  }

  /**
   * Create default error for unknown errors
   */
  private createDefaultError(error: unknown): AgentError {
    return {
      code: 'UNKNOWN_ERROR',
      message: error instanceof Error ? error.message : 'An unknown error occurred',
      suggestion: 'Please try again or contact support if the issue persists',
      recoverable: true,
      retryStrategy: 'immediate'
    };
  }

  /**
   * Get suggestion for specific field
   */
  private getSuggestionForField(field?: string): string {
    const suggestions: Record<string, string> = {
      'prompt': 'Provide a more detailed description (at least 10 characters)',
      'specifications.duration': 'Set duration between 1 and 300 seconds',
      'specifications.resolution': 'Use one of: 720p, 1080p, 4k',
      'specifications.format': 'Use one of: mp4, webm, gif',
      'context.product': 'Provide a clear product name',
      'context.targetAudience': 'Describe your target audience',
      'context.brandGuidelines.colors': 'Provide valid hex color codes (e.g., #FF0000)',
      'context.assets.url': 'Provide a valid, accessible URL for the asset',
      'options.webhookUrl': 'Provide a valid HTTPS URL for the webhook'
    };

    return suggestions[field || ''] || 'Check the field value and try again';
  }

  /**
   * Check if error is already an AgentError
   */
  private isAgentError(error: unknown): error is AgentError {
    return typeof error === 'object' && error !== null && 'code' in error && 'message' in error;
  }

  /**
   * Create multiple errors from validation results
   */
  createValidationErrors(errors: Array<{ field: string; message: string }>): AgentError[] {
    return errors.map(err => ({
      code: 'VALIDATION_ERROR',
      message: err.message,
      field: err.field,
      suggestion: this.getSuggestionForField(err.field),
      recoverable: true,
      retryStrategy: 'immediate'
    }));
  }

  /**
   * Format error for API response
   */
  formatForApiResponse(error: AgentError | AgentError[]): any {
    if (Array.isArray(error)) {
      return {
        success: false,
        errors: error.map(err => ({
          code: err.code,
          message: err.message,
          field: err.field,
          suggestion: err.suggestion
        }))
      };
    }

    return {
      success: false,
      error: {
        code: error.code,
        message: error.message,
        field: error.field,
        suggestion: error.suggestion,
        recoverable: error.recoverable,
        retryStrategy: error.retryStrategy
      }
    };
  }

  /**
   * Get retry delay based on retry strategy
   */
  getRetryDelay(error: AgentError, attempt: number): number {
    switch (error.retryStrategy) {
      case 'immediate':
        return 0;
      case 'exponential':
        return Math.min(1000 * Math.pow(2, attempt), 30000); // Max 30 seconds
      case 'manual':
        return -1; // Indicates manual intervention needed
      case 'none':
        return -1; // Do not retry
      default:
        return 1000;
    }
  }

  /**
   * Check if error is recoverable
   */
  isRecoverable(error: AgentError): boolean {
    return error.recoverable;
  }

  /**
   * Get human-readable error summary
   */
  getErrorSummary(error: AgentError): string {
    let summary = `[${error.code}] ${error.message}`;
    
    if (error.field) {
      summary += ` (Field: ${error.field})`;
    }
    
    if (error.suggestion) {
      summary += `\nSuggestion: ${error.suggestion}`;
    }
    
    return summary;
  }
}

// Export singleton instance
export const agentErrorHandler = new AgentErrorHandler();

// Export convenience functions
export function handleAgentError(error: unknown): AgentError {
  return agentErrorHandler.handleError(error);
}

export function formatAgentError(error: AgentError | AgentError[]): any {
  return agentErrorHandler.formatForApiResponse(error);
}

export function createValidationErrors(errors: Array<{ field: string; message: string }>): AgentError[] {
  return agentErrorHandler.createValidationErrors(errors);
}