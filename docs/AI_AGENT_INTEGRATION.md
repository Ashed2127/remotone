# Remotone AI Agent Integration Guide

This guide explains how AI agents can integrate with the Remotone Motion Design Engine to generate promotional videos, product highlights, and other motion graphics content programmatically.

## Overview

Remotone provides a powerful, AI-friendly API that allows agents to:
- Generate video timelines from text descriptions
- Render high-quality videos programmatically
- Apply brand guidelines and style preferences
- Integrate custom assets (images, videos, audio)
- Monitor render job progress
- Handle errors gracefully with actionable feedback

## Quick Start

### 1. Basic Setup

```typescript
import { createRemotoneAgent } from './sdk/agent-sdk';

const agent = createRemotoneAgent({
  baseUrl: 'http://localhost:3000', // Your Remotone instance URL
  apiKey: 'your-api-key',           // Optional: if authentication is enabled
  timeout: 30000,                    // 30 second timeout
  maxRetries: 3                      // Retry failed requests 3 times
});
```

### 2. Generate Your First Video

```typescript
const result = await agent.generateVideo({
  prompt: 'Create a 30-second promotional video for a new coffee brand with a professional style'
});

console.log('Video generation result:', result);
```

### 3. Monitor Rendering Progress

```typescript
if (result.success && result.renderJobId) {
  const finalStatus = await agent.waitForRender(result.renderJobId, {
    onProgress: (progress) => console.log(`Progress: ${progress}%`)
  });
  
  console.log('Video ready:', finalStatus.videoUrl);
}
```

## API Reference

### Core Methods

#### `generateVideo(options)`

Generate a video from a text prompt with optional specifications.

**Parameters:**
- `prompt` (string, required): Description of the video to generate
- `context` (object, optional): Additional context for better generation
  - `product` (string): Product name
  - `targetAudience` (string): Target audience description
  - `brandGuidelines` (object): Brand styling preferences
    - `colors` (string[]): Hex color codes
    - `fonts` (string[]): Font family names
    - `tone` (string): Brand tone (professional, casual, etc.)
  - `assets` (array): Available assets to use
    - `type` (string): 'image', 'video', or 'audio'
    - `url` (string): Asset URL
    - `description` (string): Asset description

- `specifications` (object, optional): Video output specifications
  - `duration` (number): Duration in seconds (1-300)
  - `resolution` (string): '720p', '1080p', or '4k'
  - `format` (string): 'mp4', 'webm', or 'gif'
  - `style` (string): 'professional', 'casual', 'cinematic', 'minimalist', or 'bold'
  - `pacing` (string): 'slow', 'medium', or 'fast'

- `options` (object, optional): Advanced options
  - `autoRender` (boolean): Automatically start rendering (default: false)
  - `priority` (string): 'low', 'normal', or 'high'
  - `webhookUrl` (string): URL to call when rendering completes
  - `existingTimelineId` (string): Edit existing timeline instead of creating new

**Returns:** `VideoGenerationResult`

#### `quickGenerate(prompt, options)`

Quick video generation with sensible defaults.

**Parameters:**
- `prompt` (string): Video description
- `options` (object, optional): Override default specifications

**Returns:** `VideoGenerationResult`

#### `generateProductVideo(productName, description, options)`

Specialized method for product promotion videos.

**Parameters:**
- `productName` (string): Product name
- `description` (string): Product description
- `options` (object, optional):
  - `targetAudience` (string): Target audience
  - `brandColors` (string[]): Brand color hex codes
  - `duration` (number): Video duration

**Returns:** `VideoGenerationResult`

#### `generateSocialVideo(content, platform, options)`

Generate videos optimized for social media platforms.

**Parameters:**
- `content` (string): Video content description
- `platform` (string): 'instagram', 'tiktok', 'youtube', or 'linkedin'
- `options` (object, optional):
  - `duration` (number): Video duration

**Returns:** `VideoGenerationResult`

#### `generateTutorialVideo(topic, steps, options)`

Generate tutorial-style videos with step-by-step content.

**Parameters:**
- `topic` (string): Tutorial topic
- `steps` (string[]): Tutorial steps
- `options` (object, optional):
  - `includeText` (boolean): Include text overlays

**Returns:** `VideoGenerationResult`

#### `getRenderStatus(renderJobId)`

Check the status of a render job.

**Parameters:**
- `renderJobId` (string): Render job identifier

**Returns:** `RenderJobStatus`

#### `waitForRender(renderJobId, options)`

Wait for a render job to complete with progress updates.

**Parameters:**
- `renderJobId` (string): Render job identifier
- `options` (object, optional):
  - `pollInterval` (number): Polling interval in milliseconds (default: 2000)
  - `timeout` (number): Maximum wait time in milliseconds (default: 300000)
  - `onProgress` (function): Progress callback function

**Returns:** `RenderJobStatus`

#### `getCapabilities()`

Query system capabilities and limitations.

**Returns:** `SystemCapabilities`

## Data Structures

### VideoGenerationResult

```typescript
{
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
```

### RenderJobStatus

```typescript
{
  id: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  progress: number;
  videoUrl?: string;
  error?: string;
  createdAt: string;
  updatedAt: string;
}
```

### SystemCapabilities

```typescript
{
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
```

## Usage Patterns

### Product Launch Workflow

```typescript
class ProductLaunchAgent {
  private remotone: RemotoneAgent;

  async launchProduct(productInfo) {
    // Generate promotional video
    const promoVideo = await this.remotone.generateProductVideo(
      productInfo.name,
      productInfo.description,
      { targetAudience: productInfo.targetAudience }
    );

    // Generate tutorial video
    const tutorialVideo = await this.remotone.generateTutorialVideo(
      `How to use ${productInfo.name}`,
      productInfo.features
    );

    // Generate social media videos
    const socialVideos = await Promise.all([
      this.remotone.generateSocialVideo(
        `${productInfo.name} launch`,
        'instagram'
      ),
      this.remotone.generateSocialVideo(
        `Quick demo of ${productInfo.name}`,
        'tiktok',
        { duration: 15 }
      )
    ]);

    return { promoVideo, tutorialVideo, socialVideos };
  }
}
```

### Content Management Integration

```typescript
class CMSVideoGenerator {
  async generateVideoForContent(content) {
    let prompt = '';
    
    switch (content.contentType) {
      case 'blog':
        prompt = `Create a video summarizing: ${content.title}`;
        break;
      case 'product':
        prompt = `Create a product video for: ${content.title}`;
        break;
    }

    return await this.remotone.generateSocialVideo(
      prompt,
      content.targetPlatform
    );
  }
}
```

### E-commerce Product Videos

```typescript
class EcommerceVideoGenerator {
  async generateProductVideos(product) {
    return await Promise.all([
      this.remotone.generateProductVideo(product.name, product.description),
      this.remotone.generateSocialVideo(
        `Check out ${product.name}`,
        'instagram',
        { duration: 15 }
      )
    ]);
  }
}
```

## Error Handling

The SDK provides comprehensive error handling with actionable feedback:

```typescript
try {
  const result = await agent.generateVideo({
    prompt: 'Create a video',
    specifications: { duration: 400 } // Invalid: exceeds max duration
  });
} catch (error) {
  console.error('Error:', error.code);
  console.error('Message:', error.message);
  console.error('Suggestion:', error.suggestion);
  console.error('Recoverable:', error.recoverable);
  console.error('Retry strategy:', error.retryStrategy);
}
```

### Error Codes

- `VALIDATION_ERROR`: Input validation failed
- `RATE_LIMIT_EXCEEDED`: API rate limit exceeded
- `AUTHENTICATION_ERROR`: Authentication failed
- `TIMELINE_GENERATION_FAILED`: Failed to generate timeline
- `RENDER_JOB_FAILED`: Video rendering failed
- `ASSET_ERROR`: Asset processing failed
- `NETWORK_ERROR`: Network connection failed
- `TIMEOUT_ERROR`: Request timed out
- `DATABASE_ERROR`: Database operation failed
- `AI_SERVICE_ERROR`: AI service unavailable

## Best Practices

### Prompt Writing

1. **Be Specific**: Provide detailed descriptions of what you want to see
2. **Include Context**: Add target audience, brand guidelines, and product information
3. **Specify Duration**: Set appropriate duration for your use case
4. **Mention Assets**: Reference any specific assets that should be included
5. **Describe Style**: Specify the visual style and pacing you want

### Performance Optimization

1. **Use Appropriate Resolution**: 720p for web, 1080p for social, 4k for broadcast
2. **Keep Videos Short**: Under 2 minutes for best performance
3. **Use Webhooks**: For long-running render jobs
4. **Batch Similar Requests**: Process similar videos together
5. **Monitor Progress**: Use progress callbacks for long operations

### Quality Assurance

1. **Provide High-Quality Assets**: Use high-resolution images and videos
2. **Apply Brand Guidelines**: Maintain consistent branding
3. **Test Different Styles**: Experiment with different visual styles
4. **Review Before Render**: Check timeline before auto-rendering complex projects
5. **Handle Errors Gracefully**: Implement proper error handling and retry logic

## Rate Limiting

The API has the following rate limits (configurable):

- **60 requests per minute**
- **1000 requests per day**
- **5 concurrent render jobs**

The SDK automatically handles rate limiting with exponential backoff.

## Webhook Integration

For long-running render jobs, you can specify a webhook URL:

```typescript
const result = await agent.generateVideo({
  prompt: 'Create a complex video',
  options: {
    autoRender: true,
    webhookUrl: 'https://your-server.com/webhook/render-complete'
  }
});
```

The webhook will receive a POST request when rendering completes:

```json
{
  "renderJobId": "uuid",
  "status": "completed",
  "videoUrl": "https://...",
  "timestamp": "2024-01-01T00:00:00Z"
}
```

## Advanced Features

### Timeline Editing

You can edit existing timelines instead of regenerating:

```typescript
const result = await agent.generateVideo({
  prompt: 'Make the intro shorter',
  options: {
    existingTimelineId: 'existing-timeline-uuid'
  }
});
```

### Custom Asset Integration

Include your own assets in the generated video:

```typescript
const result = await agent.generateVideo({
  prompt: 'Create a product video',
  context: {
    assets: [
      {
        type: 'image',
        url: 'https://example.com/product.jpg',
        description: 'Product hero shot'
      },
      {
        type: 'video',
        url: 'https://example.com/demo.mp4',
        description: 'Product demonstration'
      }
    ]
  }
});
```

### Brand Integration

Apply consistent branding across videos:

```typescript
const result = await agent.generateVideo({
  prompt: 'Create a promotional video',
  context: {
    brandGuidelines: {
      colors: ['#FF0000', '#00FF00', '#0000FF'],
      fonts: ['Montserrat', 'Open Sans'],
      tone: 'professional'
    }
  }
});
```

## Troubleshooting

### Common Issues

**Issue**: Timeline generation fails
- **Solution**: Rephrase your prompt with more specific details

**Issue**: Render job takes too long
- **Solution**: Reduce video duration or complexity, use lower resolution

**Issue**: Quality is not as expected
- **Solution**: Provide high-quality assets, specify style preferences clearly

**Issue**: Rate limit errors
- **Solution**: Implement exponential backoff, batch requests

### Getting Help

- Check the API capabilities: `agent.getCapabilities()`
- Review error messages and suggestions
- Consult the example integrations
- Check system logs for detailed error information

## Examples

See the `examples/agent-integration-examples.ts` file for comprehensive examples including:

- Basic setup and configuration
- Simple and advanced video generation
- Product promotion videos
- Social media videos
- Tutorial videos
- Error handling patterns
- Batch processing
- Integration with existing systems

## API Endpoints

### POST `/api/agent/generate`
Generate a video timeline and optionally start rendering.

### GET `/api/agent/capabilities`
Get system capabilities and limitations.

### GET `/api/render?id={renderJobId}`
Get render job status.

### POST `/api/render`
Create a new render job.

## Version Information

- **API Version**: 1.0.0
- **SDK Version**: 1.0.0
- **Compatibility**: Remotone 1.0.0+

## Support

For issues, questions, or contributions, please refer to the main project documentation or contact the development team.