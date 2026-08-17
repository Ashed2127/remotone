/**
 * Remotone Agent SDK
 * 
 * A simplified SDK for AI agents to integrate with the Remotone Motion Design Engine.
 * This SDK abstracts the complexity of video generation and provides a clean,
 * intuitive interface for AI agents.
 */

export interface RemotoneAgentConfig {
  baseUrl: string;
  apiKey?: string;
  timeout?: number;
  maxRetries?: number;
}

export interface VideoGenerationOptions {
  prompt: string;
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
  specifications?: {
    duration?: number;
    resolution?: '720p' | '1080p' | '4k';
    format?: 'mp4' | 'webm' | 'gif';
    style?: 'professional' | 'casual' | 'cinematic' | 'minimalist' | 'bold';
    pacing?: 'slow' | 'medium' | 'fast';
  };
  options?: {
    autoRender?: boolean;
    priority?: 'low' | 'normal' | 'high';
    webhookUrl?: string;
    existingTimelineId?: string;
  };
}

export interface VideoGenerationResult {
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

export interface RenderJobStatus {
  id: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  progress: number;
  videoUrl?: string;
  error?: string;
  createdAt: string;
  updatedAt: string;
}

export interface SystemCapabilities {
  version: string;
  supportedFormats: string[];
  supportedResolutions: string[];
  maxDuration: number;
  supportedStyles: string[];
  supportedEffects: string[];
  supportedTransitions: string[];
  features: Array<{
    name: string;
    description: string;
    enabled: boolean;
  }>;
  rateLimits?: {
    requestsPerMinute: number;
    requestsPerDay: number;
    concurrentJobs: number;
  };
}

/**
 * Main Remotone Agent SDK class
 */
export class RemotoneAgent {
  private config: Required<RemotoneAgentConfig>;
  private requestCount: number = 0;
  private lastRequestTime: number = 0;

  constructor(config: RemotoneAgentConfig) {
    this.config = {
      baseUrl: config.baseUrl,
      apiKey: config.apiKey || '',
      timeout: config.timeout || 30000,
      maxRetries: config.maxRetries || 3
    };
  }

  /**
   * Generate a video from a text prompt
   */
  async generateVideo(options: VideoGenerationOptions): Promise<VideoGenerationResult> {
    await this.checkRateLimit();

    try {
      const response = await this.makeRequest<VideoGenerationResult>(
        '/api/agent/generate',
        'POST',
        options
      );
      return response;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Get the status of a render job
   */
  async getRenderStatus(renderJobId: string): Promise<RenderJobStatus> {
    try {
      const response = await this.makeRequest<RenderJobStatus>(
        `/api/render?id=${renderJobId}`,
        'GET'
      );
      return response;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Wait for a render job to complete
   */
  async waitForRender(
    renderJobId: string,
    options: { 
      pollInterval?: number; 
      timeout?: number;
      onProgress?: (progress: number) => void 
    } = {}
  ): Promise<RenderJobStatus> {
    const { 
      pollInterval = 2000, 
      timeout = 300000,
      onProgress 
    } = options;

    const startTime = Date.now();

    while (Date.now() - startTime < timeout) {
      const status = await this.getRenderStatus(renderJobId);

      if (onProgress && status.progress !== undefined) {
        onProgress(status.progress);
      }

      if (status.status === 'completed') {
        return status;
      }

      if (status.status === 'failed') {
        throw new Error(`Render job failed: ${status.error || 'Unknown error'}`);
      }

      await this.sleep(pollInterval);
    }

    throw new Error('Render job timed out');
  }

  /**
   * Get system capabilities
   */
  async getCapabilities(): Promise<SystemCapabilities> {
    try {
      const response = await this.makeRequest<SystemCapabilities>(
        '/api/agent/capabilities',
        'GET'
      );
      return response;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Quick video generation with sensible defaults
   */
  async quickGenerate(
    prompt: string,
    options: Partial<VideoGenerationOptions> = {}
  ): Promise<VideoGenerationResult> {
    return this.generateVideo({
      prompt,
      specifications: {
        duration: 30,
        resolution: '1080p',
        format: 'mp4',
        style: 'professional',
        pacing: 'medium',
        ...options.specifications
      },
      options: {
        autoRender: true,
        priority: 'normal',
        ...options.options
      },
      ...options
    });
  }

  /**
   * Generate video for product promotion
   */
  async generateProductVideo(
    productName: string,
    description: string,
    options: {
      targetAudience?: string;
      brandColors?: string[];
      duration?: number;
    } = {}
  ): Promise<VideoGenerationResult> {
    const prompt = `Create a promotional video for ${productName}. ${description}`;
    
    return this.generateVideo({
      prompt,
      context: {
        product: productName,
        targetAudience: options.targetAudience,
        brandGuidelines: {
          colors: options.brandColors,
          tone: 'professional'
        }
      },
      specifications: {
        duration: options.duration || 30,
        style: 'professional',
        pacing: 'medium'
      },
      options: {
        autoRender: true
      }
    });
  }

  /**
   * Generate social media video
   */
  async generateSocialVideo(
    content: string,
    platform: 'instagram' | 'tiktok' | 'youtube' | 'linkedin' = 'instagram',
    options: { duration?: number } = {}
  ): Promise<VideoGenerationResult> {
    const platformConfigs = {
      instagram: { resolution: '1080p' as const, style: 'bold' as const, pacing: 'fast' as const },
      tiktok: { resolution: '1080p' as const, style: 'casual' as const, pacing: 'fast' as const },
      youtube: { resolution: '1080p' as const, style: 'professional' as const, pacing: 'medium' as const },
      linkedin: { resolution: '1080p' as const, style: 'professional' as const, pacing: 'slow' as const }
    };

    const config = platformConfigs[platform];

    return this.generateVideo({
      prompt: `Create a social media video for ${platform}: ${content}`,
      specifications: {
        duration: options.duration || (platform === 'tiktok' ? 15 : 30),
        resolution: config.resolution,
        style: config.style,
        pacing: config.pacing
      },
      options: {
        autoRender: true
      }
    });
  }

  /**
   * Generate tutorial video
   */
  async generateTutorialVideo(
    topic: string,
    steps: string[],
    options: { includeText?: boolean } = {}
  ): Promise<VideoGenerationResult> {
    const prompt = `Create a tutorial video about ${topic}. Steps: ${steps.join(', ')}. ${options.includeText ? 'Include step-by-step text overlays.' : ''}`;
    
    return this.generateVideo({
      prompt,
      specifications: {
        duration: Math.max(30, steps.length * 10),
        style: 'professional',
        pacing: 'slow'
      },
      options: {
        autoRender: true
      }
    });
  }

  /**
   * Generate audio for video
   */
  async generateAudio(options: {
    type: 'music' | 'sfx' | 'ambient' | 'voiceover' | 'custom';
    duration: number;
    mood?: 'energetic' | 'calm' | 'dramatic' | 'professional' | 'playful' | 'mysterious';
    style?: 'minimal' | 'rich' | 'experimental' | 'cinematic';
    engine?: 'professional' | 'faust' | 'tonejs' | 'hybrid';
    parameters?: Record<string, number>;
  }): Promise<{
    success: boolean;
    audioId?: string;
    audioData?: {
      sampleRate: number;
      channels: number;
      duration: number;
    };
    engine?: string;
    error?: string;
  }> {
    try {
      const response = await this.makeRequest(
        '/api/agent/audio',
        'POST',
        options
      );
      return response;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Get audio engine capabilities
   */
  async getAudioCapabilities(): Promise<{
    engines: string[];
    engineCapabilities: Record<string, any>;
    supportedTypes: string[];
    supportedMoods: string[];
    supportedStyles: string[];
    maxDuration: number;
    features: string[];
  }> {
    try {
      const response = await this.makeRequest(
        '/api/agent/audio',
        'GET'
      );
      return response;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Make HTTP request to Remotone API
   */
  private async makeRequest<T>(
    endpoint: string,
    method: 'GET' | 'POST',
    body?: any
  ): Promise<T> {
    const url = `${this.config.baseUrl}${endpoint}`;
    const headers: HeadersInit = {
      'Content-Type': 'application/json'
    };

    if (this.config.apiKey) {
      headers['Authorization'] = `Bearer ${this.config.apiKey}`;
    }

    const options: RequestInit = {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined
    };

    let lastError: Error | null = null;

    for (let attempt = 0; attempt < this.config.maxRetries; attempt++) {
      try {
        const response = await fetch(url, options);

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(
            `HTTP ${response.status}: ${errorData.message || response.statusText}`
          );
        }

        return await response.json();
      } catch (error) {
        lastError = error as Error;
        
        if (attempt < this.config.maxRetries - 1) {
          await this.sleep(Math.pow(2, attempt) * 1000); // Exponential backoff
        }
      }
    }

    throw lastError || new Error('Request failed');
  }

  /**
   * Check rate limits
   */
  private async checkRateLimit(): Promise<void> {
    const now = Date.now();
    const timeSinceLastRequest = now - this.lastRequestTime;

    if (timeSinceLastRequest < 1000) { // 1 second between requests
      await this.sleep(1000 - timeSinceLastRequest);
    }

    this.requestCount++;
    this.lastRequestTime = Date.now();
  }

  /**
   * Sleep utility
   */
  private sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * Handle errors
   */
  private handleError(error: unknown): Error {
    if (error instanceof Error) {
      return error;
    }
    return new Error('An unknown error occurred');
  }

  /**
   * Reset rate limit counter
   */
  resetRateLimit(): void {
    this.requestCount = 0;
    this.lastRequestTime = 0;
  }

  /**
   * Get request statistics
   */
  getStats() {
    return {
      requestCount: this.requestCount,
      lastRequestTime: this.lastRequestTime
    };
  }
}

/**
 * Convenience function to create a Remotone agent instance
 */
export function createRemotoneAgent(config: RemotoneAgentConfig): RemotoneAgent {
  return new RemotoneAgent(config);
}

/**
 * Quick start function for common use cases
 */
export async function quickStart(
  prompt: string,
  baseUrl: string = 'http://localhost:3000'
): Promise<VideoGenerationResult> {
  const agent = createRemotoneAgent({ baseUrl });
  return agent.quickGenerate(prompt);
}