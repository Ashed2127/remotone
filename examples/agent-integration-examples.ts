/**
 * Remotone Agent Integration Examples
 * 
 * This file contains comprehensive examples of how AI agents can integrate
 * with the Remotone Motion Design Engine for various use cases.
 */

import { 
  RemotoneAgent, 
  createRemotoneAgent, 
  quickStart,
  VideoGenerationOptions 
} from '../sdk/agent-sdk';

// ============================================================================
// BASIC SETUP
// ============================================================================

/**
 * Example 1: Basic Agent Setup
 */
async function basicSetup() {
  // Initialize the agent with your Remotone instance
  const agent = createRemotoneAgent({
    baseUrl: 'http://localhost:3000', // Your Remotone instance URL
    apiKey: 'your-api-key-here',       // Optional: if authentication is enabled
    timeout: 30000,                     // 30 second timeout
    maxRetries: 3                       // Retry failed requests 3 times
  });

  // Check system capabilities
  const capabilities = await agent.getCapabilities();
  console.log('System capabilities:', capabilities);

  return agent;
}

// ============================================================================
// SIMPLE VIDEO GENERATION
// ============================================================================

/**
 * Example 2: Simple Video Generation
 */
async function simpleVideoGeneration() {
  const agent = await basicSetup();

  // Generate a video with a simple prompt
  const result = await agent.generateVideo({
    prompt: 'Create a 30-second promotional video for a new coffee brand with a professional style'
  });

  console.log('Video generation result:', result);

  if (result.success && result.renderJobId) {
    console.log('Render job started:', result.renderJobId);
    console.log('Estimated render time:', result.estimatedRenderTime, 'seconds');
  }
}

/**
 * Example 3: Quick Generate with Defaults
 */
async function quickGenerateExample() {
  const agent = await basicSetup();

  // Use quick generate with sensible defaults
  const result = await agent.quickGenerate(
    'Create a product video for a new smartphone'
  );

  console.log('Quick generate result:', result);
}

// ============================================================================
// PRODUCT PROMOTION VIDEOS
// ============================================================================

/**
 * Example 4: Product Promotion Video
 */
async function productPromotionVideo() {
  const agent = await basicSetup();

  const result = await agent.generateProductVideo(
    'EcoBottle Pro',
    'A sustainable water bottle made from recycled materials with temperature control',
    {
      targetAudience: 'Environmentally conscious consumers aged 25-40',
      brandColors: ['#2E7D32', '#81C784', '#1B5E20'],
      duration: 45
    }
  );

  console.log('Product video result:', result);
}

// ============================================================================
// SOCIAL MEDIA VIDEOS
// ============================================================================

/**
 * Example 5: Social Media Video Generation
 */
async function socialMediaVideo() {
  const agent = await basicSetup();

  // Generate Instagram video
  const instagramVideo = await agent.generateSocialVideo(
    'New summer collection launch with vibrant colors and beach vibes',
    'instagram',
    { duration: 30 }
  );

  console.log('Instagram video:', instagramVideo);

  // Generate TikTok video
  const tiktokVideo = await agent.generateSocialVideo(
    'Quick product showcase with energetic music',
    'tiktok',
    { duration: 15 }
  );

  console.log('TikTok video:', tiktokVideo);

  // Generate LinkedIn video
  const linkedinVideo = await agent.generateSocialVideo(
    'Professional B2B software demo with corporate messaging',
    'linkedin',
    { duration: 60 }
  );

  console.log('LinkedIn video:', linkedinVideo);
}

// ============================================================================
// TUTORIAL VIDEOS
// ============================================================================

/**
 * Example 6: Tutorial Video Generation
 */
async function tutorialVideo() {
  const agent = await basicSetup();

  const result = await agent.generateTutorialVideo(
    'How to use our mobile app',
    [
      'Download and install the app',
      'Create an account',
      'Navigate the dashboard',
      'Use key features',
      'Access help and support'
    ],
    { includeText: true }
  );

  console.log('Tutorial video result:', result);
}

// ============================================================================
// ADVANCED CONFIGURATION
// ============================================================================

/**
 * Example 7: Advanced Video Generation with Full Configuration
 */
async function advancedVideoGeneration() {
  const agent = await basicSetup();

  const options: VideoGenerationOptions = {
    prompt: 'Create a cinematic product launch video for our premium headphones',
    
    context: {
      product: 'SonicPro X1 Headphones',
      targetAudience: 'Audiophiles and music professionals',
      brandGuidelines: {
        colors: ['#1A1A1A', '#C0C0C0', '#FFD700'],
        fonts: ['Montserrat', 'Open Sans'],
        tone: 'premium'
      },
      assets: [
        {
          type: 'image',
          url: 'https://example.com/product-shot.jpg',
          description: 'Product hero shot'
        },
        {
          type: 'video',
          url: 'https://example.com/demo-footage.mp4',
          description: 'Product in use'
        }
      ]
    },
    
    specifications: {
      duration: 60,
      resolution: '4k',
      format: 'mp4',
      style: 'cinematic',
      pacing: 'slow'
    },
    
    options: {
      autoRender: true,
      priority: 'high',
      webhookUrl: 'https://your-server.com/webhook/render-complete'
    }
  };

  const result = await agent.generateVideo(options);
  console.log('Advanced video generation result:', result);
}

// ============================================================================
// RENDER JOB MANAGEMENT
// ============================================================================

/**
 * Example 8: Monitor Render Job Progress
 */
async function monitorRenderProgress() {
  const agent = await basicSetup();

  // Generate video
  const result = await agent.generateVideo({
    prompt: 'Create a product demo video',
    options: { autoRender: true }
  });

  if (result.success && result.renderJobId) {
    // Wait for render to complete with progress updates
    const finalStatus = await agent.waitForRender(result.renderJobId, {
      pollInterval: 2000,        // Check every 2 seconds
      timeout: 300000,          // 5 minute timeout
      onProgress: (progress) => {
        console.log(`Render progress: ${progress}%`);
      }
    });

    console.log('Render completed:', finalStatus);
    console.log('Video URL:', finalStatus.videoUrl);
  }
}

/**
 * Example 9: Manual Render Status Checking
 */
async function manualStatusCheck() {
  const agent = await basicSetup();

  const result = await agent.generateVideo({
    prompt: 'Create a promotional video',
    options: { autoRender: true }
  });

  if (result.success && result.renderJobId) {
    // Check status manually
    const status = await agent.getRenderStatus(result.renderJobId);
    console.log('Current status:', status);

    // Continue checking as needed
    if (status.status === 'processing') {
      console.log('Still processing, check again later');
    }
  }
}

// ============================================================================
// ERROR HANDLING
// ============================================================================

/**
 * Example 10: Robust Error Handling
 */
async function robustErrorHandling() {
  const agent = await basicSetup();

  try {
    const result = await agent.generateVideo({
      prompt: 'Create a video',
      specifications: {
        duration: 400 // This will exceed the max duration
      }
    });

    if (!result.success) {
      console.error('Generation failed:', result.errors);
      
      // Handle specific errors
      result.errors?.forEach(error => {
        if (error.field === 'specifications.duration') {
          console.log('Duration error:', error.message);
          console.log('Suggestion:', error.suggestion);
        }
      });
    }
  } catch (error) {
    console.error('Unexpected error:', error);
    
    // Implement retry logic or fallback
    if (error instanceof Error) {
      if (error.message.includes('timeout')) {
        console.log('Request timed out, retrying...');
        // Retry logic here
      }
    }
  }
}

// ============================================================================
// BATCH PROCESSING
// ============================================================================

/**
 * Example 11: Batch Video Generation
 */
async function batchVideoGeneration() {
  const agent = await basicSetup();

  const prompts = [
    'Create a video for product A',
    'Create a video for product B',
    'Create a video for product C'
  ];

  const results = [];

  for (const prompt of prompts) {
    try {
      const result = await agent.generateVideo({
        prompt,
        options: { autoRender: false } // Generate timelines first
      });
      results.push(result);
      
      // Small delay between requests to respect rate limits
      await new Promise(resolve => setTimeout(resolve, 1000));
    } catch (error) {
      console.error('Failed to generate video for:', prompt, error);
    }
  }

  console.log('Batch generation results:', results);

  // Now render all the timelines
  for (const result of results) {
    if (result.success && result.timelineId) {
      // Implement render logic here
      console.log('Would render timeline:', result.timelineId);
    }
  }
}

// ============================================================================
// AGENT INTEGRATION PATTERNS
// ============================================================================

/**
 * Example 12: AI Agent Integration Pattern
 * This shows how an AI agent (like ChatGPT, Claude, etc.) would integrate
 */
class ProductLaunchAgent {
  private remotone: RemotoneAgent;

  constructor() {
    this.remotone = createRemotoneAgent({
      baseUrl: process.env.REMOTONE_URL || 'http://localhost:3000'
    });
  }

  async launchProduct(productInfo: {
    name: string;
    description: string;
    features: string[];
    targetAudience: string;
  }) {
    console.log(`Launching product: ${productInfo.name}`);

    // Step 1: Generate promotional video
    const promoVideo = await this.remotone.generateProductVideo(
      productInfo.name,
      productInfo.description,
      {
        targetAudience: productInfo.targetAudience,
        duration: 45
      }
    );

    // Step 2: Generate tutorial video
    const tutorialVideo = await this.remotone.generateTutorialVideo(
      `How to use ${productInfo.name}`,
      productInfo.features,
      { includeText: true }
    );

    // Step 3: Generate social media videos
    const socialVideos = await Promise.all([
      this.remotone.generateSocialVideo(
        `${productInfo.name} launch announcement`,
        'instagram'
      ),
      this.remotone.generateSocialVideo(
        `Quick demo of ${productInfo.name}`,
        'tiktok',
        { duration: 15 }
      )
    ]);

    return {
      promoVideo,
      tutorialVideo,
      socialVideos
    };
  }
}

/**
 * Example 13: Content Management System Integration
 */
class CMSVideoGenerator {
  private remotone: RemotoneAgent;

  constructor() {
    this.remotone = createRemotoneAgent({
      baseUrl: process.env.REMOTONE_URL || 'http://localhost:3000'
    });
  }

  async generateVideoForContent(content: {
    title: string;
    body: string;
    contentType: 'blog' | 'product' | 'announcement';
    targetPlatform: 'youtube' | 'instagram' | 'linkedin';
  }) {
    // Create prompt based on content type
    let prompt = '';
    
    switch (content.contentType) {
      case 'blog':
        prompt = `Create a video summarizing this blog post: ${content.title}. ${content.body.substring(0, 200)}...`;
        break;
      case 'product':
        prompt = `Create a product video for: ${content.title}. ${content.body.substring(0, 200)}...`;
        break;
      case 'announcement':
        prompt = `Create an announcement video: ${content.title}. ${content.body.substring(0, 200)}...`;
        break;
    }

    // Generate video for the target platform
    const result = await this.remotone.generateSocialVideo(
      prompt,
      content.targetPlatform === 'youtube' ? 'youtube' : 
      content.targetPlatform === 'linkedin' ? 'linkedin' : 'instagram'
    );

    return result;
  }
}

// ============================================================================
// E-COMMERCE INTEGRATION
// ============================================================================

/**
 * Example 14: E-commerce Product Video Generator
 */
class EcommerceVideoGenerator {
  private remotone: RemotoneAgent;

  constructor() {
    this.remotone = createRemotoneAgent({
      baseUrl: process.env.REMOTONE_URL || 'http://localhost:3000'
    });
  }

  async generateProductVideos(product: {
    id: string;
    name: string;
    description: string;
    images: string[];
    price: number;
    category: string;
  }) {
    // Generate multiple video variations
    const videos = await Promise.all([
      // Main product video
      this.remotone.generateProductVideo(product.name, product.description, {
        duration: 30
      }),
      
      // Social media version
      this.remotone.generateSocialVideo(
        `Check out ${product.name} - only $${product.price}`,
        'instagram',
        { duration: 15 }
      ),
      
      // Feature highlight video
      this.remotone.generateVideo({
        prompt: `Create a video highlighting the key features of ${product.name}`,
        context: {
          assets: product.images.map(url => ({
            type: 'image' as const,
            url,
            description: `Product image for ${product.name}`
          }))
        },
        specifications: {
          duration: 20,
          style: 'professional'
        }
      })
    ]);

    return videos;
  }
}

// ============================================================================
// USAGE EXAMPLES
// ============================================================================

/**
 * Run all examples (for testing)
 */
async function runExamples() {
  console.log('=== Remotone Agent Integration Examples ===\n');

  try {
    console.log('1. Basic Setup:');
    await basicSetup();
    console.log('✓ Basic setup completed\n');

    console.log('2. Simple Video Generation:');
    await simpleVideoGeneration();
    console.log('✓ Simple generation completed\n');

    console.log('3. Product Promotion:');
    await productPromotionVideo();
    console.log('✓ Product promotion completed\n');

    console.log('4. Social Media Videos:');
    await socialMediaVideo();
    console.log('✓ Social media videos completed\n');

    console.log('5. Tutorial Video:');
    await tutorialVideo();
    console.log('✓ Tutorial video completed\n');

  } catch (error) {
    console.error('Example failed:', error);
  }
}

// Export for use in other files
export {
  basicSetup,
  simpleVideoGeneration,
  productPromotionVideo,
  socialMediaVideo,
  tutorialVideo,
  advancedVideoGeneration,
  monitorRenderProgress,
  ProductLaunchAgent,
  CMSVideoGenerator,
  EcommerceVideoGenerator
};