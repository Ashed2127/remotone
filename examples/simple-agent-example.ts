/**
 * Simple AI Agent Integration Example
 * 
 * This is a minimal example showing how an AI agent can use Remotone
 * to generate a promotional video.
 */

import { createRemotoneAgent } from '../sdk/agent-sdk';

async function main() {
  console.log('=== Remotone AI Agent Example ===\n');

  // Initialize the agent
  const agent = createRemotoneAgent({
    baseUrl: 'http://localhost:3000',
    timeout: 30000,
    maxRetries: 3
  });

  try {
    // Check system capabilities
    console.log('1. Checking system capabilities...');
    const capabilities = await agent.getCapabilities();
    console.log('✓ System version:', capabilities.version);
    console.log('✓ Supported formats:', capabilities.supportedFormats.join(', '));
    console.log('✓ Max duration:', capabilities.maxDuration, 'seconds\n');

    // Generate a simple promotional video
    console.log('2. Generating promotional video...');
    const result = await agent.generateVideo({
      prompt: 'Create a 30-second promotional video for a new coffee brand called "BrewMaster" with a professional style',
      specifications: {
        duration: 30,
        resolution: '1080p',
        format: 'mp4',
        style: 'professional',
        pacing: 'medium'
      },
      options: {
        autoRender: false // Generate timeline first
      }
    });

    console.log('✓ Request ID:', result.requestId);
    console.log('✓ Status:', result.status);

    if (result.success) {
      console.log('✓ Timeline ID:', result.timelineId);
      console.log('✓ Timeline duration:', result.timeline?.duration, 'seconds');
      console.log('✓ Number of nodes:', result.timeline?.nodes?.length);
      console.log('✓ Message:', result.message);
    } else {
      console.log('✗ Generation failed');
      if (result.errors) {
        result.errors.forEach(error => {
          console.log('  -', error.field, ':', error.message);
          if (error.suggestion) {
            console.log('    Suggestion:', error.suggestion);
          }
        });
      }
    }

    // Generate a product video using the specialized method
    console.log('\n3. Generating product video...');
    const productResult = await agent.generateProductVideo(
      'EcoBottle Pro',
      'A sustainable water bottle made from recycled materials with temperature control',
      {
        targetAudience: 'Environmentally conscious consumers',
        brandColors: ['#2E7D32', '#81C784', '#1B5E20'],
        duration: 45
      }
    );

    console.log('✓ Product video request ID:', productResult.requestId);
    console.log('✓ Status:', productResult.status);

    // Generate a social media video
    console.log('\n4. Generating social media video...');
    const socialResult = await agent.generateSocialVideo(
      'New summer collection launch with vibrant colors',
      'instagram',
      { duration: 30 }
    );

    console.log('✓ Social video request ID:', socialResult.requestId);
    console.log('✓ Status:', socialResult.status);

    console.log('\n=== Example completed successfully ===');

  } catch (error) {
    console.error('Error:', error);
    console.log('\n=== Example failed ===');
  }
}

// Run the example
if (require.main === module) {
  main().catch(console.error);
}

export { main };