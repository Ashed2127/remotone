import { NextResponse } from 'next/server';

/**
 * AI Agent Capabilities Endpoint
 * 
 * This endpoint provides AI agents with information about what the motion design engine
 * can do, allowing them to understand available features, limitations, and best practices.
 */

export async function GET() {
  const capabilities = {
    version: '1.0.0',
    supportedFormats: ['mp4', 'webm', 'gif'],
    supportedResolutions: ['720p', '1080p', '4k'],
    maxDuration: 300, // 5 minutes
    supportedStyles: ['professional', 'casual', 'cinematic', 'minimalist', 'bold'],
    supportedEffects: [
      'fade-in', 'fade-out', 'slide-up', 'slide-down', 'slide-left', 'slide-right',
      'zoom-in', 'zoom-out', 'rotate', 'bounce', 'elastic', 'blur', 'sharpen',
      'color-shift', 'grayscale', 'sepia', 'glitch', 'particle-effect'
    ],
    supportedTransitions: ['fade', 'slide', 'zoom', 'wipe', 'dissolve'],
    supportedAnimations: [
      'fadeIn', 'fadeOut', 'slideUp', 'slideDown', 'slideLeft', 'slideRight',
      'zoomIn', 'zoomOut', 'rotate', 'bounce', 'elastic', 'typewriter', 'none'
    ],
    features: [
      {
        name: 'ai-timeline-generation',
        description: 'Generate video timelines from text prompts using AI',
        enabled: true
      },
      {
        name: 'auto-rendering',
        description: 'Automatically render videos after timeline generation',
        enabled: true
      },
      {
        name: 'brand-integration',
        description: 'Apply brand guidelines (colors, fonts, tone) to videos',
        enabled: true
      },
      {
        name: 'asset-integration',
        description: 'Integrate custom assets (images, videos, audio) into videos',
        enabled: true
      },
      {
        name: 'multi-resolution',
        description: 'Generate videos in multiple resolutions',
        enabled: true
      },
      {
        name: 'webhook-notifications',
        description: 'Receive notifications when rendering is complete',
        enabled: true
      },
      {
        name: 'timeline-editing',
        description: 'Edit existing timelines instead of regenerating',
        enabled: true
      },
      {
        name: 'preset-templates',
        description: 'Use pre-built video templates for common use cases',
        enabled: true
      }
    ],
    rateLimits: {
      requestsPerMinute: 60,
      requestsPerDay: 1000,
      concurrentJobs: 5
    },
    bestPractices: {
      promptWriting: [
        'Be specific about the content you want to see',
        'Include target audience and brand context when available',
        'Specify desired duration and style for better results',
        'Mention any specific assets that should be included',
        'Describe the pacing and mood you want to achieve'
      ],
      performance: [
        'Use appropriate resolution for your use case (720p for web, 1080p for social, 4k for broadcast)',
        'Keep videos under 2 minutes for best performance',
        'Use webhooks for long-running render jobs',
        'Batch similar requests for efficiency'
      ],
      quality: [
        'Provide high-quality assets for best results',
        'Use brand guidelines for consistent branding',
        'Test different styles to find what works best',
        'Review timeline before auto-rendering for complex projects'
      ]
    },
    examples: {
      simplePrompt: 'Create a 30-second promotional video for a new smartphone with a professional style',
      complexPrompt: 'Generate a 60-second product video for our eco-friendly water bottle. Target audience: environmentally conscious millennials. Style: minimalist. Include our brand colors (#2E7D32, #81C784) and use slow pacing.',
      withAssets: 'Create a 45-second tutorial video using the provided product images and demo footage. Style: casual. Include step-by-step text overlays.',
      brandIntegration: 'Generate a promotional video for our SaaS platform. Use our brand fonts (Inter, Roboto) and professional tone. Target: business decision makers.'
    }
  };

  return NextResponse.json(capabilities);
}