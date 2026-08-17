import { NextRequest, NextResponse } from 'next/server';
import { audioIntegrationLayer } from '@/lib/audio-integration-layer';
import { handleAgentError, formatAgentError } from '@/lib/agent-error-handler';

/**
 * AI Agent Audio API
 * 
 * This endpoint allows AI agents to generate professional audio
 * for their videos using SuperCollider-quality audio engines.
 */

interface AgentAudioRequest {
  type: 'music' | 'sfx' | 'ambient' | 'voiceover' | 'custom';
  duration: number;
  mood?: 'energetic' | 'calm' | 'dramatic' | 'professional' | 'playful' | 'mysterious';
  style?: 'minimal' | 'rich' | 'experimental' | 'cinematic';
  engine?: 'professional' | 'faust' | 'tonejs' | 'hybrid';
  parameters?: Record<string, number>;
  customDSP?: string;
}

interface AgentAudioResponse {
  success: boolean;
  requestId: string;
  audioId?: string;
  audioData?: {
    sampleRate: number;
    channels: number;
    duration: number;
  };
  engine?: string;
  status: string;
  message?: string;
  errors?: Array<{
    field: string;
    message: string;
    suggestion?: string;
  }>;
}

export async function POST(request: NextRequest) {
  const requestId = `audio-${Date.now()}`;
  
  try {
    // Initialize audio layer if needed
    await audioIntegrationLayer.initialize();

    const body: AgentAudioRequest = await request.json();
    
    // Validate required fields
    const validationErrors: Array<{ field: string; message: string }> = [];
    
    if (!body.type) {
      validationErrors.push({ field: 'type', message: 'Audio type is required' });
    }
    
    if (!body.duration) {
      validationErrors.push({ field: 'duration', message: 'Duration is required' });
    } else if (body.duration < 0.1) {
      validationErrors.push({ field: 'duration', message: 'Duration must be at least 0.1 seconds' });
    } else if (body.duration > 300) {
      validationErrors.push({ field: 'duration', message: 'Duration exceeds maximum limit (300 seconds)' });
    }

    if (validationErrors.length > 0) {
      const agentErrors = handleAgentError({
        code: 'VALIDATION_ERROR',
        message: 'Audio request validation failed',
      });
      
      return NextResponse.json(
        formatAgentError({
          success: false,
          requestId,
          status: 'failed',
          errors: validationErrors.map(err => ({
            field: err.field,
            message: err.message,
            suggestion: 'Check and correct the field value'
          }))
        }),
        { status: 400 }
      );
    }

    // Generate audio
    const result = await audioIntegrationLayer.generateAudio({
      type: body.type,
      duration: body.duration,
      mood: body.mood,
      style: body.style,
      engine: body.engine,
      parameters: body.parameters,
      customDSP: body.customDSP,
    });

    if (!result.success) {
      const agentError = handleAgentError({
        code: 'AUDIO_GENERATION_FAILED',
        message: result.error || 'Failed to generate audio',
      });
      
      return NextResponse.json(
        formatAgentError({
          success: false,
          requestId,
          status: 'failed',
          error: agentError
        }),
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      requestId,
      audioId: result.audioId,
      audioData: {
        sampleRate: result.sampleRate || 48000,
        channels: result.channels || 2,
        duration: result.duration || body.duration,
      },
      engine: body.engine || 'auto-selected',
      status: 'completed',
      message: 'Audio generated successfully',
    });

  } catch (error) {
    console.error('Agent audio API error:', error);
    const agentError = handleAgentError(error);
    return NextResponse.json(
      formatAgentError({
        success: false,
        requestId,
        status: 'failed',
        error: agentError
      }),
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    // Return audio engine capabilities
    const capabilities = {
      engines: audioIntegrationLayer.getAvailableEngines(),
      engineCapabilities: audioIntegrationLayer.getEngineCapabilities(),
      supportedTypes: ['music', 'sfx', 'ambient', 'voiceover', 'custom'],
      supportedMoods: ['energetic', 'calm', 'dramatic', 'professional', 'playful', 'mysterious'],
      supportedStyles: ['minimal', 'rich', 'experimental', 'cinematic'],
      maxDuration: 300,
      sampleRates: [44100, 48000],
      channels: [1, 2],
      features: [
        'SuperCollider-quality synthesis',
        'FAUST DSP integration',
        'Professional effects chain',
        'Real-time processing',
        'WAV export',
        'Multi-engine support',
        'AI-agent friendly API'
      ]
    };

    return NextResponse.json(capabilities);
  } catch (error) {
    console.error('Audio capabilities error:', error);
    return NextResponse.json(
      { error: 'Failed to get audio capabilities' },
      { status: 500 }
    );
  }
}