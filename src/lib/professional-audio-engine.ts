/**
 * Professional Audio Engine with SuperCollider-Quality DSP
 * 
 * This engine provides professional-grade audio synthesis and processing
 * capabilities using Web Audio API with advanced DSP techniques.
 */

export interface ProfessionalAudioConfig {
  sampleRate: number;
  bufferSize: number;
  channels: number;
  bitDepth: 16 | 24 | 32;
}

export interface SynthConfig {
  type: 'analog' | 'fm' | 'additive' | 'wavetable' | 'granular' | 'physical';
  oscillatorCount: number;
  filterType: 'lowpass' | 'highpass' | 'bandpass' | 'notch' | 'allpass';
  envelope: {
    attack: number;
    decay: number;
    sustain: number;
    release: number;
  };
  modulation: {
    frequency: number;
    depth: number;
    type: 'sine' | 'square' | 'sawtooth' | 'triangle';
  };
}

export interface DSPConfig {
  fftSize: number;
  overlap: number;
  windowType: 'hann' | 'hamming' | 'blackman' | 'flat-top';
  smoothing: number;
}

export interface AudioNode {
  id: string;
  type: 'oscillator' | 'filter' | 'envelope' | 'lfo' | 'delay' | 'reverb' | 'compressor' | 'limiter' | 'eq' | 'distortion' | 'spectral';
  parameters: Record<string, number>;
  connections: string[];
}

export class ProfessionalAudioEngine {
  private audioContext: AudioContext | null = null;
  private config: ProfessionalAudioConfig;
  private audioNodes: Map<string, AudioNode> = new Map();
  private webAudioNodes: Map<string, AudioNode> = new Map();
  private masterGain: GainNode | null = null;
  private compressor: DynamicsCompressorNode | null = null;
  private limiter: DynamicsCompressorNode | null = null;
  private analyser: AnalyserNode | null = null;

  constructor(config: Partial<ProfessionalAudioConfig> = {}) {
    this.config = {
      sampleRate: config.sampleRate || 48000,
      bufferSize: config.bufferSize || 4096,
      channels: config.channels || 2,
      bitDepth: config.bitDepth || 24,
    };
  }

  /**
   * Initialize the professional audio engine
   */
  async initialize(): Promise<void> {
    if (this.audioContext) return;

    try {
      // Create high-performance audio context
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      this.audioContext = new AudioContextClass({
        sampleRate: this.config.sampleRate,
        latencyHint: 'interactive',
      });

      // Create master chain
      this.masterGain = this.audioContext.createGain();
      this.compressor = this.audioContext.createDynamicsCompressor();
      this.limiter = this.audioContext.createDynamicsCompressor();
      this.analyser = this.audioContext.createAnalyser();

      // Configure professional dynamics processing
      this.compressor.threshold.value = -24;
      this.compressor.knee.value = 30;
      this.compressor.ratio.value = 12;
      this.compressor.attack.value = 0.003;
      this.compressor.release.value = 0.25;

      // Configure limiter (brickwall limiting)
      this.limiter.threshold.value = -1;
      this.limiter.knee.value = 0;
      this.limiter.ratio.value = 20;
      this.limiter.attack.value = 0.001;
      this.limiter.release.value = 0.1;

      // Configure analyser for visualization
      this.analyser.fftSize = 2048;
      this.analyser.smoothingTimeConstant = 0.8;

      // Connect master chain
      this.masterGain.connect(this.compressor);
      this.compressor.connect(this.limiter);
      this.limiter.connect(this.analyser);
      this.analyser.connect(this.audioContext.destination);

      // Set initial master volume
      this.masterGain.gain.value = 0.8;

      console.log('Professional Audio Engine initialized');
    } catch (error) {
      console.error('Failed to initialize audio engine:', error);
      throw error;
    }
  }

  /**
   * Create professional analog synthesizer
   */
  createAnalogSynth(config: SynthConfig): string {
    if (!this.audioContext) throw new Error('Audio engine not initialized');

    const nodeId = `synth-${Date.now()}`;
    const nodes: any[] = [];

    // Create oscillators with professional detuning
    for (let i = 0; i < config.oscillatorCount; i++) {
      const osc = this.audioContext.createOscillator();
      const detune = (Math.random() - 0.5) * 10; // Subtle detuning for richness
      osc.detune.value = detune;
      osc.type = 'sawtooth'; // Rich harmonic content
      nodes.push(osc);
    }

    // Create professional filter
    const filter = this.audioContext.createBiquadFilter();
    filter.type = config.filterType;
    filter.frequency.value = 2000;
    filter.Q.value = 2; // Resonance
    nodes.push(filter);

    // Create ADSR envelope
    const envelope = this.createEnvelope(config.envelope);
    nodes.push(envelope);

    // Create LFO for modulation
    const lfo = this.audioContext.createOscillator();
    const lfoGain = this.audioContext.createGain();
    lfo.frequency.value = config.modulation.frequency;
    lfo.type = config.modulation.type;
    lfoGain.gain.value = config.modulation.depth;
    lfo.connect(lfoGain);
    nodes.push(lfo, lfoGain);

    // Connect audio graph
    nodes.forEach((node, index) => {
      if (node instanceof OscillatorNode) {
        node.connect(filter);
      }
    });

    filter.connect(envelope.gainNode);
    envelope.gainNode.connect(this.masterGain!);

    // Store nodes
    this.webAudioNodes.set(nodeId, {
      id: nodeId,
      type: 'oscillator',
      parameters: config as any,
      connections: [],
    });

    // Store actual Web Audio nodes for cleanup
    (this.webAudioNodes.get(nodeId) as any).audioNodes = nodes;

    return nodeId;
  }

  /**
   * Create FM synthesizer (frequency modulation)
   */
  createFMSynth(carrierFreq: number, modulatorFreq: number, modulationIndex: number): string {
    if (!this.audioContext) throw new Error('Audio engine not initialized');

    const nodeId = `fm-synth-${Date.now()}`;

    // Carrier oscillator
    const carrier = this.audioContext.createOscillator();
    carrier.frequency.value = carrierFreq;
    carrier.type = 'sine';

    // Modulator oscillator
    const modulator = this.audioContext.createOscillator();
    modulator.frequency.value = modulatorFreq;
    modulator.type = 'sine';

    // Modulation gain (index)
    const modGain = this.audioContext.createGain();
    modGain.gain.value = modulationIndex * modulatorFreq;

    // Connect FM chain
    modulator.connect(modGain);
    modGain.connect(carrier.frequency);
    carrier.connect(this.masterGain!);

    // Store nodes
    this.webAudioNodes.set(nodeId, {
      id: nodeId,
      type: 'oscillator',
      parameters: { carrierFreq, modulatorFreq, modulationIndex },
      connections: [],
      audioNodes: [carrier, modulator, modGain],
    });

    return nodeId;
  }

  /**
   * Create additive synthesizer (multiple oscillators for rich timbres)
   */
  createAdditiveSynth(frequencies: number[], amplitudes: number[]): string {
    if (!this.audioContext) throw new Error('Audio engine not initialized');

    const nodeId = `additive-synth-${Date.now()}`;
    const oscillators: OscillatorNode[] = [];
    const gainNode = this.audioContext.createGain();

    frequencies.forEach((freq, index) => {
      const osc = this.audioContext.createOscillator();
      osc.frequency.value = freq;
      osc.type = 'sine';
      osc.connect(gainNode);
      oscillators.push(osc);
    });

    // Set relative amplitudes
    const totalGain = amplitudes.reduce((sum, amp) => sum + amp, 0);
    gainNode.gain.value = 0.5 / totalGain;

    gainNode.connect(this.masterGain!);

    this.webAudioNodes.set(nodeId, {
      id: nodeId,
      type: 'oscillator',
      parameters: { frequencies, amplitudes },
      connections: [],
      audioNodes: [...oscillators, gainNode],
    });

    return nodeId;
  }

  /**
   * Create professional envelope (ADSR)
   */
  private createEnvelope(config: SynthConfig['envelope']): {
    gainNode: GainNode;
    attack: number;
    decay: number;
    sustain: number;
    release: number;
  } {
    if (!this.audioContext) throw new Error('Audio engine not initialized');

    const gainNode = this.audioContext.createGain();
    gainNode.gain.value = 0;

    return {
      gainNode,
      attack: config.attack,
      decay: config.decay,
      sustain: config.sustain,
      release: config.release,
    };
  }

  /**
   * Trigger envelope (note on/off)
   */
  triggerEnvelope(nodeId: string, startTime: number, duration: number): void {
    const nodeData = this.webAudioNodes.get(nodeId);
    if (!nodeData || !this.audioContext) return;

    const audioNodes = (nodeData as any).audioNodes;
    const envelope = audioNodes.find((n: any) => n instanceof GainNode && n.gain);
    
    if (envelope) {
      const now = this.audioContext.currentTime + startTime;
      const config = nodeData.parameters;
      
      // ADSR envelope
      envelope.gain.setValueAtTime(0, now);
      envelope.gain.linearRampToValueAtTime(1, now + config.attack);
      envelope.gain.linearRampToValueAtTime(config.sustain, now + config.attack + config.decay);
      envelope.gain.setValueAtTime(config.sustain, now + duration - config.release);
      envelope.gain.linearRampToValueAtTime(0, now + duration);
    }
  }

  /**
   * Create spectral processor (FFT-based processing)
   */
  createSpectralProcessor(config: DSPConfig): string {
    if (!this.audioContext) throw new Error('Audio engine not initialized');

    const nodeId = `spectral-${Date.now()}`;

    // Create analyser for spectral processing
    const analyser = this.audioContext.createAnalyser();
    analyser.fftSize = config.fftSize;
    analyser.smoothingTimeConstant = config.smoothing;

    // Create script processor for custom DSP
    const bufferSize = config.fftSize * 2;
    const scriptProcessor = this.audioContext.createScriptProcessor(
      bufferSize,
      this.config.channels,
      this.config.channels
    );

    // Store for spectral processing
    this.webAudioNodes.set(nodeId, {
      id: nodeId,
      type: 'spectral',
      parameters: config,
      connections: [],
      audioNodes: [analyser, scriptProcessor],
    });

    return nodeId;
  }

  /**
   * Create professional reverb using convolution
   */
  createConvolutionReverb(impulseResponse: AudioBuffer): string {
    if (!this.audioContext) throw new Error('Audio engine not initialized');

    const nodeId = `reverb-${Date.now()}`;

    const convolver = this.audioContext.createConvolver();
    convolver.buffer = impulseResponse;

    const wetGain = this.audioContext.createGain();
    const dryGain = this.audioContext.createGain();
    
    wetGain.gain.value = 0.3;
    dryGain.gain.value = 0.7;

    this.webAudioNodes.set(nodeId, {
      id: nodeId,
      type: 'reverb',
      parameters: { wet: 0.3, dry: 0.7 },
      connections: [],
      audioNodes: [convolver, wetGain, dryGain],
    });

    return nodeId;
  }

  /**
   * Create multi-tap delay
   */
  createMultiTapDelay(tapTimes: number[], feedback: number): string {
    if (!this.audioContext) throw new Error('Audio engine not initialized');

    const nodeId = `delay-${Date.now()}`;
    const nodes: any[] = [];

    const inputGain = this.audioContext.createGain();
    const outputGain = this.audioContext.createGain();
    const feedbackGain = this.audioContext.createGain();
    
    feedbackGain.gain.value = feedback;
    outputGain.gain.value = 0.5;

    nodes.push(inputGain, outputGain, feedbackGain);

    // Create delay lines for each tap
    tapTimes.forEach((tapTime) => {
      const delay = this.audioContext.createDelay(5);
      delay.delayTime.value = tapTime;
      const tapGain = this.audioContext.createGain();
      tapGain.gain.value = 1 / tapTimes.length; // Equal power distribution
      
      inputGain.connect(delay);
      delay.connect(tapGain);
      tapGain.connect(outputGain);
      delay.connect(feedbackGain);
      
      nodes.push(delay, tapGain);
    });

    feedbackGain.connect(inputGain);

    this.webAudioNodes.set(nodeId, {
      id: nodeId,
      type: 'delay',
      parameters: { tapTimes, feedback },
      connections: [],
      audioNodes: nodes,
    });

    return nodeId;
  }

  /**
   * Create parametric EQ
   */
  createParametricEQ(bands: Array<{
    frequency: number;
    gain: number;
    Q: number;
    type: BiquadFilterType;
  }>): string {
    if (!this.audioContext) throw new Error('Audio engine not initialized');

    const nodeId = `eq-${Date.now()}`;
    const filters: BiquadFilterNode[] = [];

    bands.forEach((band) => {
      const filter = this.audioContext.createBiquadFilter();
      filter.type = band.type;
      filter.frequency.value = band.frequency;
      filter.gain.value = band.gain;
      filter.Q.value = band.Q;
      filters.push(filter);
    });

    // Connect filters in series
    for (let i = 0; i < filters.length - 1; i++) {
      filters[i].connect(filters[i + 1]);
    }

    this.webAudioNodes.set(nodeId, {
      id: nodeId,
      type: 'eq',
      parameters: { bands },
      connections: [],
      audioNodes: filters,
    });

    return nodeId;
  }

  /**
   * Create waveshaper distortion
   */
  createWaveshaperDistortion(amount: number, curve: 'sine' | 'cubic' | 'custom' = 'sine'): string {
    if (!this.audioContext) throw new Error('Audio engine not initialized');

    const nodeId = `distortion-${Date.now()}`;

    const waveshaper = this.audioContext.createWaveShaper();
    const curveLength = 44100;
    const curve = new Float32Array(curveLength);

    // Generate distortion curve
    for (let i = 0; i < curveLength; i++) {
      const x = (i / curveLength) * 2 - 1; // -1 to 1
      
      switch (curve) {
        case 'sine':
          curve[i] = Math.sin(Math.PI * x * amount);
          break;
        case 'cubic':
          curve[i] = Math.pow(x, 3) * amount;
          break;
        default:
          curve[i] = x;
      }
    }

    waveshaper.curve = curve;
    waveshaper.oversample = '4x'; // Anti-aliasing

    this.webAudioNodes.set(nodeId, {
      id: nodeId,
      type: 'distortion',
      parameters: { amount, curve },
      connections: [],
      audioNodes: [waveshaper],
    });

    return nodeId;
  }

  /**
   * Connect audio nodes
   */
  connect(sourceId: string, destinationId: string): void {
    const source = this.webAudioNodes.get(sourceId);
    const destination = this.webAudioNodes.get(destinationId);

    if (!source || !destination) return;

    const sourceNodes = (source as any).audioNodes;
    const destNodes = (destination as any).audioNodes;

    // Connect last node of source to first node of destination
    if (sourceNodes.length > 0 && destNodes.length > 0) {
      const lastSource = sourceNodes[sourceNodes.length - 1];
      const firstDest = destNodes[0];
      lastSource.connect(firstDest);
    }

    source.connections.push(destinationId);
  }

  /**
   * Start audio node
   */
  start(nodeId: string, time?: number): void {
    const nodeData = this.webAudioNodes.get(nodeId);
    if (!nodeData) return;

    const audioNodes = (nodeData as any).audioNodes;
    const startTime = time !== undefined ? this.audioContext!.currentTime + time : this.audioContext!.currentTime;

    audioNodes.forEach((node: any) => {
      if (node instanceof OscillatorNode) {
        node.start(startTime);
      }
    });
  }

  /**
   * Stop audio node
   */
  stop(nodeId: string, time?: number): void {
    const nodeData = this.webAudioNodes.get(nodeId);
    if (!nodeData) return;

    const audioNodes = (nodeData as any).audioNodes;
    const stopTime = time !== undefined ? this.audioContext!.currentTime + time : this.audioContext!.currentTime;

    audioNodes.forEach((node: any) => {
      if (node instanceof OscillatorNode) {
        node.stop(stopTime);
      }
    });
  }

  /**
   * Get audio analysis data
   */
  getAnalysisData(): {
    frequencyData: Uint8Array;
    timeDomainData: Uint8Array;
  } {
    if (!this.analyser) {
      return {
        frequencyData: new Uint8Array(0),
        timeDomainData: new Uint8Array(0),
      };
    }

    const frequencyData = new Uint8Array(this.analyser.frequencyBinCount);
    const timeDomainData = new Uint8Array(this.analyser.frequencyBinCount);

    this.analyser.getByteFrequencyData(frequencyData);
    this.analyser.getByteTimeDomainData(timeDomainData);

    return { frequencyData, timeDomainData };
  }

  /**
   * Set master volume
   */
  setMasterVolume(volume: number): void {
    if (this.masterGain) {
      this.masterGain.gain.value = Math.max(0, Math.min(1, volume));
    }
  }

  /**
   * Get master volume
   */
  getMasterVolume(): number {
    return this.masterGain ? this.masterGain.gain.value : 0;
  }

  /**
   * Dispose audio node
   */
  dispose(nodeId: string): void {
    const nodeData = this.webAudioNodes.get(nodeId);
    if (!nodeData) return;

    const audioNodes = (nodeData as any).audioNodes;
    audioNodes.forEach((node: any) => {
      try {
        node.disconnect();
        if (node.stop) node.stop();
      } catch (error) {
        // Ignore errors during disposal
      }
    });

    this.webAudioNodes.delete(nodeId);
  }

  /**
   * Dispose all nodes
   */
  disposeAll(): void {
    for (const nodeId of this.webAudioNodes.keys()) {
      this.dispose(nodeId);
    }

    if (this.audioContext) {
      this.audioContext.close();
      this.audioContext = null;
    }
  }

  /**
   * Generate professional impulse response for reverb
   */
  static generateImpulseResponse(
    duration: number,
    decay: number,
    reverse: boolean = false
  ): AudioBuffer {
    const sampleRate = 48000;
    const length = sampleRate * duration;
    const impulse = new AudioBuffer(2, length, sampleRate);
    const left = impulse.getChannelData(0);
    const right = impulse.getChannelData(1);

    for (let i = 0; i < length; i++) {
      const n = reverse ? length - i : i;
      const amplitude = (1 - n / length) * Math.pow(1 - n / length, decay);
      
      // White noise with exponential decay
      left[i] = (Math.random() * 2 - 1) * amplitude;
      right[i] = (Math.random() * 2 - 1) * amplitude;
    }

    return impulse;
  }

  /**
   * Export audio to WAV format
   */
  async exportToWAV(duration: number): Promise<ArrayBuffer> {
    if (!this.audioContext) throw new Error('Audio engine not initialized');

    // Create offline context for rendering
    const offlineContext = new OfflineAudioContext(
      this.config.channels,
      duration * this.config.sampleRate,
      this.config.sampleRate
    );

    // Render audio (would need to duplicate the audio graph to offline context)
    // This is a simplified version - full implementation would recreate the graph
    
    const renderedBuffer = await offlineContext.startRendering();
    return this.audioBufferToWAV(renderedBuffer);
  }

  /**
   * Convert AudioBuffer to WAV format
   */
  private audioBufferToWAV(buffer: AudioBuffer): ArrayBuffer {
    const numChannels = buffer.numberOfChannels;
    const sampleRate = buffer.sampleRate;
    const bitDepth = this.config.bitDepth;
    const bytesPerSample = bitDepth / 8;
    const blockAlign = numChannels * bytesPerSample;

    const dataLength = buffer.length * blockAlign;
    const bufferLength = 44 + dataLength;
    const arrayBuffer = new ArrayBuffer(bufferLength);
    const view = new DataView(arrayBuffer);

    // WAV header
    this.writeString(view, 0, 'RIFF');
    view.setUint32(4, 36 + dataLength, true);
    this.writeString(view, 8, 'WAVE');
    this.writeString(view, 12, 'fmt ');
    view.setUint32(16, 16, true);
    view.setUint16(20, 1, true); // PCM
    view.setUint16(22, numChannels, true);
    view.setUint32(24, sampleRate, true);
    view.setUint32(28, sampleRate * blockAlign, true);
    view.setUint16(32, blockAlign, true);
    view.setUint16(34, bitDepth, true);
    this.writeString(view, 36, 'data');
    view.setUint32(40, dataLength, true);

    // Write audio data
    const channels: Float32Array[] = [];
    for (let i = 0; i < numChannels; i++) {
      channels.push(buffer.getChannelData(i));
    }

    let offset = 44;
    for (let i = 0; i < buffer.length; i++) {
      for (let channel = 0; channel < numChannels; channel++) {
        const sample = channels[channel][i];
        const intSample = sample < 0 ? sample * 0x8000 : sample * 0x7FFF;
        view.setInt16(offset, intSample, true);
        offset += 2;
      }
    }

    return arrayBuffer;
  }

  private writeString(view: DataView, offset: number, string: string): void {
    for (let i = 0; i < string.length; i++) {
      view.setUint8(offset + i, string.charCodeAt(i));
    }
  }
}

// Singleton instance
export const professionalAudioEngine = new ProfessionalAudioEngine();