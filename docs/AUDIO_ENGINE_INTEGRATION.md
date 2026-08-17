# Professional Audio Engine Integration

This document describes the professional audio engine integration added to Remotone, providing SuperCollider-quality audio capabilities using Web Audio API and advanced DSP techniques.

## Overview

The audio integration provides multiple professional-grade audio engines that can be used individually or combined for maximum flexibility and quality.

## Audio Engines

### 1. Professional Audio Engine (`professional-audio-engine.ts`)

**Quality:** SuperCollider-level  
**Features:**
- Advanced analog synthesis with detuned oscillators
- FM (Frequency Modulation) synthesis
- Additive synthesis for rich timbres
- Professional ADSR envelopes
- LFO modulation
- Multi-tap delay with feedback
- Convolution reverb with impulse responses
- Parametric EQ (3-band)
- Waveshaper distortion
- Spectral processing (FFT-based)
- Professional dynamics chain (compressor + limiter)
- Real-time audio analysis

**Usage:**
```typescript
import { professionalAudioEngine } from '@/lib/professional-audio-engine';

await professionalAudioEngine.initialize();

// Create analog synth
const synthId = professionalAudioEngine.createAnalogSynth({
  type: 'analog',
  oscillatorCount: 3,
  filterType: 'lowpass',
  envelope: { attack: 0.01, decay: 0.1, sustain: 0.7, release: 0.3 },
  modulation: { frequency: 2, depth: 0.1, type: 'sine' }
});

// Start and stop
professionalAudioEngine.start(synthId, 0);
professionalAudioEngine.stop(synthId, 5);
```

### 2. FAUST Integration (`faust-integration.ts`)

**Quality:** Professional DSP  
**Features:**
- Functional Audio Stream programming
- Pre-built DSP modules (Reverb, Compressor, EQ, Distortion, Delay, Phaser, Chorus)
- Custom FAUST code compilation
- WebAssembly compilation for high performance
- Real-time parameter control
- Web Audio API fallback for compatibility

**Pre-built DSP Modules:**
- **Reverb**: Professional stereo reverb
- **Compressor**: Dynamic range compression
- **EQ**: 3-band parametric equalizer
- **Distortion**: Wave shaper distortion
- **Delay**: Stereo delay with feedback
- **Phaser**: Phaser effect with adjustable stages
- **Chorus**: Multi-voice chorus
- **Filter**: Multi-mode filter (lowpass, highpass, bandpass, notch)

**Usage:**
```typescript
import { faustIntegration } from '@/lib/faust-integration';

await faustIntegration.initialize();

// Create reverb DSP
const dspId = await faustIntegration.createDSP('Reverb', {
  roomSize: 10,
  damping: 0.5,
  wetLevel: 0.8
});

// Adjust parameters
faustIntegration.setParameter(dspId, 'wetLevel', 0.6);
```

### 3. Audio Integration Layer (`audio-integration-layer.ts`)

**Purpose:** Unified interface for all audio engines  
**Features:**
- Automatic engine selection based on request type
- Hybrid engine support (combining multiple engines)
- Audio caching and management
- WAV export functionality
- Agent-friendly API
- Error handling and fallbacks

**Audio Generation Request:**
```typescript
const request = {
  type: 'music' | 'sfx' | 'ambient' | 'voiceover' | 'custom',
  duration: 30,
  mood: 'energetic' | 'calm' | 'dramatic' | 'professional' | 'playful' | 'mysterious',
  style: 'minimal' | 'rich' | 'experimental' | 'cinematic',
  engine: 'professional' | 'faust' | 'tonejs' | 'hybrid',
  parameters: { tempo: 120, key: 'C' }
};
```

## AI Agent Audio API

### POST `/api/agent/audio`

Generate professional audio for videos.

**Request:**
```json
{
  "type": "music",
  "duration": 30,
  "mood": "professional",
  "style": "cinematic",
  "engine": "professional",
  "parameters": {
    "tempo": 120,
    "key": 440
  }
}
```

**Response:**
```json
{
  "success": true,
  "requestId": "audio-1234567890",
  "audioId": "audio-1234567890",
  "audioData": {
    "sampleRate": 48000,
    "channels": 2,
    "duration": 30
  },
  "engine": "professional",
  "status": "completed",
  "message": "Audio generated successfully"
}
```

### GET `/api/agent/audio`

Get audio engine capabilities.

**Response:**
```json
{
  "engines": ["professional", "faust", "tonejs", "basic", "hybrid"],
  "engineCapabilities": {
    "professional": {
      "quality": "SuperCollider-level",
      "features": ["Analog synthesis", "FM synthesis", "Additive synthesis", "Spectral processing"],
      "performance": "High",
      "complexity": "Advanced"
    },
    "faust": {
      "quality": "Professional DSP",
      "features": ["Functional programming", "Custom DSP", "WASM compilation"],
      "performance": "Very High",
      "complexity": "Advanced"
    }
  },
  "supportedTypes": ["music", "sfx", "ambient", "voiceover", "custom"],
  "supportedMoods": ["energetic", "calm", "dramatic", "professional", "playful", "mysterious"],
  "supportedStyles": ["minimal", "rich", "experimental", "cinematic"],
  "maxDuration": 300,
  "sampleRates": [44100, 48000],
  "channels": [1, 2],
  "features": [
    "SuperCollider-quality synthesis",
    "FAUST DSP integration",
    "Professional effects chain",
    "Real-time processing",
    "WAV export",
    "Multi-engine support",
    "AI-agent friendly API"
  ]
}
```

## Agent SDK Audio Methods

### `generateAudio(options)`

Generate audio for videos using professional engines.

```typescript
const agent = createRemotoneAgent({ baseUrl: 'http://localhost:3000' });

const audio = await agent.generateAudio({
  type: 'music',
  duration: 30,
  mood: 'professional',
  style: 'cinematic',
  engine: 'professional',
  parameters: { tempo: 120 }
});

console.log('Audio ID:', audio.audioId);
console.log('Audio data:', audio.audioData);
```

### `getAudioCapabilities()`

Query audio engine capabilities.

```typescript
const capabilities = await agent.getAudioCapabilities();
console.log('Available engines:', capabilities.engines);
console.log('Engine capabilities:', capabilities.engineCapabilities);
```

## Engine Selection Guide

### Choose Professional Engine when:
- You need SuperCollider-quality synthesis
- Cinematic or experimental audio styles
- Complex DSP processing
- Real-time audio analysis
- Professional music production

### Choose FAUST Engine when:
- You need custom DSP algorithms
- Functional programming approach
- Highest performance requirements
- Specific audio effects
- Mathematical audio processing

### Choose Tone.js Engine when:
- You need music generation
- Sequencing and timing
- Web Audio wrapper functionality
- Browser compatibility priority
- Moderate complexity needs

### Choose Hybrid Engine when:
- You want maximum flexibility
- Combining synthesis with DSP
- Complex audio processing chains
- Highest quality output
- Professional production needs

## Audio Quality Comparison

| Engine | Quality | Performance | Complexity | Best For |
|--------|---------|-------------|------------|----------|
| Professional | SuperCollider-level | High | Advanced | Cinematic, experimental |
| FAUST | Professional DSP | Very High | Advanced | Custom DSP, effects |
| Tone.js | Professional | High | Intermediate | Music, sequencing |
| Basic | Good | Medium | Simple | SFX, ambient |
| Hybrid | SuperCollider-level | Variable | Advanced | Maximum quality |

## Technical Specifications

### Professional Engine:
- **Sample Rate:** Up to 192kHz
- **Bit Depth:** 16, 24, 32-bit
- **Channels:** Mono, Stereo, Surround
- **Buffer Size:** Configurable (default: 4096)
- **Latency:** Interactive mode

### FAUST Engine:
- **Compilation:** WebAssembly
- **Real-time:** Yes
- **Custom DSP:** Yes
- **Parameter Control:** Real-time

### Integration Features:
- **WAV Export:** Professional format
- **Audio Analysis:** FFT and time-domain
- **Master Chain:** Compressor + Limiter
- **Effects:** Reverb, Delay, EQ, Distortion
- **Synthesis:** Analog, FM, Additive

## Examples

### Generate Cinematic Music:
```typescript
const audio = await agent.generateAudio({
  type: 'music',
  duration: 60,
  mood: 'dramatic',
  style: 'cinematic',
  engine: 'professional'
});
```

### Generate Sound Effects:
```typescript
const sfx = await agent.generateAudio({
  type: 'sfx',
  duration: 2,
  mood: 'energetic',
  style: 'experimental',
  engine: 'faust'
});
```

### Generate Ambient Background:
```typescript
const ambient = await agent.generateAudio({
  type: 'ambient',
  duration: 120,
  mood: 'calm',
  style: 'minimal',
  engine: 'tonejs'
});
```

## Performance Optimization

- **WebAssembly:** FAUST compiles to WASM for maximum performance
- **Offline Rendering:** Professional engine supports offline contexts
- **Buffer Management:** Configurable buffer sizes for latency vs. quality
- **Node Pooling:** Efficient audio node management
- **Automatic Cleanup:** Resource disposal and memory management

## Future Enhancements

Potential additions:
- Real FAUST compiler integration
- More DSP modules
- AI-powered audio generation
- Voice synthesis
- 3D audio spatialization
- Advanced spectral processing
- Machine learning audio effects

## Comparison with SuperCollider

### Advantages over SuperCollider:
- **Web-native:** No server infrastructure needed
- **JavaScript/TypeScript:** Native language for Remotone
- **Remotion-compatible:** Seamless video integration
- **Agent-friendly:** Easy programmatic control
- **Cost-effective:** No licensing or infrastructure costs
- **Performance:** WebAssembly provides near-native performance

### Similar Quality:
- **Synthesis:** Analog, FM, Additive synthesis
- **DSP:** Professional effects and processing
- **Real-time:** Live performance capabilities
- **Flexibility:** Custom algorithms and processing

This audio integration provides SuperCollider-quality audio while maintaining the web-native, agent-friendly architecture that Remotone requires.