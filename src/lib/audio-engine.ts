import { z } from 'zod';

export interface AudioConfig {
  type: 'music' | 'sfx' | 'voiceover' | 'ambient' | 'speech';
  volume: number;
  fadeIn: number;
  fadeOut: number;
  loop: boolean;
  startTime: number;
  duration: number;
}

export interface AudioTrack {
  id: string;
  config: AudioConfig;
  audioData: Float32Array;
  sampleRate: number;
  channels: number;
}

export interface AudioEvent {
  time: number;
  type: 'note' | 'chord' | 'percussion' | 'sfx' | 'silence';
  frequency?: number;
  duration?: number;
  velocity?: number;
  data?: any;
}

export interface AudioMixer {
  tracks: Map<string, AudioTrack>;
  masterVolume: number;
  effects: AudioEffect[];
}

export interface AudioEffect {
  type: 'reverb' | 'delay' | 'compressor' | 'equalizer' | 'filter' | 'distortion';
  parameters: Record<string, number>;
  enabled: boolean;
}

export class AudioEngine {
  private mixer: AudioMixer;
  private audioContext: AudioContext | null = null;
  private audioCache = new Map<string, AudioBuffer>();

  constructor() {
    this.mixer = {
      tracks: new Map(),
      masterVolume: 1.0,
      effects: [],
    };
  }

  /**
   * Initialize audio context
   */
  async initAudioContext(): Promise<void> {
    if (!this.audioContext) {
      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    
    if (this.audioContext.state === 'suspended') {
      await this.audioContext.resume();
    }
  }

  /**
   * Generate procedural music based on mood and parameters
   */
  async generateMusic(parameters: {
    mood: 'energetic' | 'calm' | 'dramatic' | 'professional' | 'playful' | 'mysterious';
    duration: number;
    tempo?: number;
    key?: string;
    scale?: string;
  }): Promise<AudioTrack> {
    await this.initAudioContext();
    
    const events = this.generateMusicEvents(parameters);
    const audioData = this.synthesizeAudio(events, parameters);
    
    const track: AudioTrack = {
      id: `music-${Date.now()}`,
      config: {
        type: 'music',
        volume: 0.7,
        fadeIn: 0.5,
        fadeOut: 0.5,
        loop: false,
        startTime: 0,
        duration: parameters.duration,
      },
      audioData,
      sampleRate: 44100,
      channels: 2,
    };

    this.mixer.tracks.set(track.id, track);
    return track;
  }

  /**
   * Generate music events based on mood
   */
  private generateMusicEvents(parameters: {
    mood: string;
    duration: number;
    tempo?: number;
    key?: string;
    scale?: string;
  }): AudioEvent[] {
    const events: AudioEvent[] = [];
    const tempo = parameters.tempo || this.getTempoForMood(parameters.mood);
    const key = parameters.key || 'C';
    const scale = parameters.scale || this.getScaleForMood(parameters.mood);
    
    const beatDuration = 60 / tempo;
    const totalBeats = Math.floor(parameters.duration / beatDuration);
    
    const scaleNotes = this.getScaleNotes(key, scale);
    
    for (let beat = 0; beat < totalBeats; beat++) {
      const time = beat * beatDuration;
      
      // Generate melody
      if (beat % 2 === 0) {
        const note = scaleNotes[Math.floor(Math.random() * scaleNotes.length)];
        events.push({
          time,
          type: 'note',
          frequency: this.noteToFrequency(note),
          duration: beatDuration * 0.8,
          velocity: 0.7,
        });
      }
      
      // Generate harmony
      if (beat % 4 === 0) {
        const chordNotes = this.getChordNotes(scaleNotes, beat % 8);
        chordNotes.forEach(note => {
          events.push({
            time,
            type: 'chord',
            frequency: this.noteToFrequency(note),
            duration: beatDuration * 1.5,
            velocity: 0.5,
          });
        });
      }
      
      // Generate percussion
      if (parameters.mood === 'energetic' || parameters.mood === 'playful') {
        events.push({
          time: time + beatDuration * 0.5,
          type: 'percussion',
          velocity: 0.6,
        });
      }
    }

    return events;
  }

  /**
   * Get tempo based on mood
   */
  private getTempoForMood(mood: string): number {
    const tempos: Record<string, number> = {
      energetic: 140,
      calm: 80,
      dramatic: 100,
      professional: 120,
      playful: 130,
      mysterious: 70,
    };
    return tempos[mood] || 120;
  }

  /**
   * Get musical scale based on mood
   */
  private getScaleForMood(mood: string): string {
    const scales: Record<string, string> = {
      energetic: 'major',
      calm: 'pentatonic',
      dramatic: 'harmonic-minor',
      professional: 'major',
      playful: 'mixolydian',
      mysterious: 'dorian',
    };
    return scales[mood] || 'major';
  }

  /**
   * Get scale notes
   */
  private getScaleNotes(key: string, scale: string): string[] {
    const notes = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
    const keyIndex = notes.indexOf(key);
    
    const scalePatterns: Record<string, number[]> = {
      major: [0, 2, 4, 5, 7, 9, 11],
      minor: [0, 2, 3, 5, 7, 8, 10],
      pentatonic: [0, 2, 4, 7, 9],
      harmonicMinor: [0, 2, 3, 5, 7, 8, 11],
      mixolydian: [0, 2, 4, 5, 7, 9, 10],
      dorian: [0, 2, 3, 5, 7, 9, 10],
    };

    const pattern = scalePatterns[scale] || scalePatterns.major;
    return pattern.map(interval => notes[(keyIndex + interval) % 12]);
  }

  /**
   * Get chord notes for harmony
   */
  private getChordNotes(scale: string[], beatIndex: number): string[] {
    const chordProgressions = [
      [0, 2, 4], // I chord
      [1, 3, 5], // ii chord
      [2, 4, 6], // iii chord
      [3, 5, 0], // IV chord
      [4, 6, 1], // V chord
      [5, 0, 2], // vi chord
    ];
    
    const progression = chordProgressions[beatIndex % chordProgressions.length];
    return progression.map(index => scale[index % scale.length]);
  }

  /**
   * Convert note name to frequency
   */
  private noteToFrequency(note: string): number {
    const notes = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
    const noteIndex = notes.indexOf(note);
    const a4Frequency = 440;
    const a4Index = notes.indexOf('A');
    
    const semitones = noteIndex - a4Index;
    return a4Frequency * Math.pow(2, semitones / 12);
  }

  /**
   * Synthesize audio from events
   */
  private synthesizeAudio(events: AudioEvent[], parameters: any): Float32Array {
    const sampleRate = 44100;
    const duration = parameters.duration;
    const totalSamples = Math.floor(duration * sampleRate);
    const audioData = new Float32Array(totalSamples);

    events.forEach(event => {
      const startSample = Math.floor(event.time * sampleRate);
      const durationSamples = event.duration ? Math.floor(event.duration * sampleRate) : sampleRate;
      
      for (let i = 0; i < durationSamples && startSample + i < totalSamples; i++) {
        const sample = this.synthesizeSample(event, i, sampleRate);
        audioData[startSample + i] += sample * (event.velocity || 0.5);
      }
    });

    // Normalize audio
    this.normalizeAudio(audioData);
    
    return audioData;
  }

  /**
   * Synthesize individual sample
   */
  private synthesizeSample(event: AudioEvent, sampleIndex: number, sampleRate: number): number {
    switch (event.type) {
      case 'note':
      case 'chord':
        if (event.frequency) {
          const t = sampleIndex / sampleRate;
          return Math.sin(2 * Math.PI * event.frequency * t) * Math.exp(-t * 3);
        }
        return 0;
      case 'percussion':
        const noise = (Math.random() - 0.5) * 2;
        const envelope = Math.exp(-sampleIndex / 1000);
        return noise * envelope;
      default:
        return 0;
    }
  }

  /**
   * Normalize audio data
   */
  private normalizeAudio(audioData: Float32Array): void {
    let maxAmplitude = 0;
    for (let i = 0; i < audioData.length; i++) {
      maxAmplitude = Math.max(maxAmplitude, Math.abs(audioData[i]));
    }
    
    if (maxAmplitude > 0) {
      for (let i = 0; i < audioData.length; i++) {
        audioData[i] /= maxAmplitude;
      }
    }
  }

  /**
   * Generate sound effect
   */
  async generateSFX(type: 'whoosh' | 'impact' | 'click' | 'pop' | 'hover'): Promise<AudioTrack> {
    await this.initAudioContext();
    
    const duration = 0.5;
    const sampleRate = 44100;
    const totalSamples = Math.floor(duration * sampleRate);
    const audioData = new Float32Array(totalSamples);

    for (let i = 0; i < totalSamples; i++) {
      const t = i / sampleRate;
      let sample = 0;

      switch (type) {
        case 'whoosh':
          sample = this.generateWhoosh(t);
          break;
        case 'impact':
          sample = this.generateImpact(t);
          break;
        case 'click':
          sample = this.generateClick(t);
          break;
        case 'pop':
          sample = this.generatePop(t);
          break;
        case 'hover':
          sample = this.generateHover(t);
          break;
      }

      audioData[i] = sample;
    }

    this.normalizeAudio(audioData);

    const track: AudioTrack = {
      id: `sfx-${type}-${Date.now()}`,
      config: {
        type: 'sfx',
        volume: 0.5,
        fadeIn: 0.05,
        fadeOut: 0.1,
        loop: false,
        startTime: 0,
        duration,
      },
      audioData,
      sampleRate,
      channels: 1,
    };

    this.mixer.tracks.set(track.id, track);
    return track;
  }

  /**
   * Generate whoosh sound
   */
  private generateWhoosh(t: number): number {
    const noise = (Math.random() - 0.5) * 2;
    const envelope = Math.exp(-t * 5);
    const filter = Math.sin(t * 20) * 0.5 + 0.5;
    return noise * envelope * filter;
  }

  /**
   * Generate impact sound
   */
  private generateImpact(t: number): number {
    const noise = (Math.random() - 0.5) * 2;
    const envelope = Math.exp(-t * 20);
    const lowFreq = Math.sin(t * 100) * 0.5;
    return (noise + lowFreq) * envelope;
  }

  /**
   * Generate click sound
   */
  private generateClick(t: number): number {
    const frequency = 2000 * Math.exp(-t * 10);
    const envelope = Math.exp(-t * 50);
    return Math.sin(2 * Math.PI * frequency * t) * envelope;
  }

  /**
   * Generate pop sound
   */
  private generatePop(t: number): number {
    const frequency = 800 * Math.exp(-t * 5);
    const envelope = Math.exp(-t * 15);
    return Math.sin(2 * Math.PI * frequency * t) * envelope;
  }

  /**
   * Generate hover sound
   */
  private generateHover(t: number): number {
    const frequency = 400 + t * 200;
    const envelope = Math.exp(-t * 8);
    return Math.sin(2 * Math.PI * frequency * t) * envelope;
  }

  /**
   * Generate ambient soundscape
   */
  async generateAmbient(parameters: {
    type: 'drone' | 'wind' | 'rain' | 'forest' | 'urban';
    duration: number;
  }): Promise<AudioTrack> {
    await this.initAudioContext();
    
    const sampleRate = 44100;
    const totalSamples = Math.floor(parameters.duration * sampleRate);
    const audioData = new Float32Array(totalSamples);

    for (let i = 0; i < totalSamples; i++) {
      const t = i / sampleRate;
      let sample = 0;

      switch (parameters.type) {
        case 'drone':
          sample = this.generateDrone(t);
          break;
        case 'wind':
          sample = this.generateWind(t);
          break;
        case 'rain':
          sample = this.generateRain(t);
          break;
        case 'forest':
          sample = this.generateForest(t);
          break;
        case 'urban':
          sample = this.generateUrban(t);
          break;
      }

      audioData[i] = sample;
    }

    this.normalizeAudio(audioData);

    const track: AudioTrack = {
      id: `ambient-${parameters.type}-${Date.now()}`,
      config: {
        type: 'ambient',
        volume: 0.3,
        fadeIn: 1.0,
        fadeOut: 1.0,
        loop: true,
        startTime: 0,
        duration: parameters.duration,
      },
      audioData,
      sampleRate,
      channels: 2,
    };

    this.mixer.tracks.set(track.id, track);
    return track;
  }

  /**
   * Generate drone sound
   */
  private generateDrone(t: number): number {
    const freq1 = 55; // A1
    const freq2 = 82.5; // E2
    const modulation = Math.sin(t * 0.5) * 5;
    return (
      Math.sin(2 * Math.PI * (freq1 + modulation) * t) * 0.3 +
      Math.sin(2 * Math.PI * (freq2 + modulation) * t) * 0.2
    );
  }

  /**
   * Generate wind sound
   */
  private generateWind(t: number): number {
    const noise = (Math.random() - 0.5) * 2;
    const filter = Math.sin(t * 2) * 0.5 + 0.5;
    const envelope = 0.5 + Math.sin(t * 0.3) * 0.3;
    return noise * filter * envelope;
  }

  /**
   * Generate rain sound
   */
  private generateRain(t: number): number {
    const noise = (Math.random() - 0.5) * 2;
    const envelope = Math.exp(-Math.random() * 0.1);
    return noise * envelope * 0.3;
  }

  /**
   * Generate forest sound
   */
  private generateForest(t: number): number {
    const noise = (Math.random() - 0.5) * 2;
    const birds = Math.sin(t * 5) * Math.sin(t * 7) * 0.1;
    return noise * 0.2 + birds;
  }

  /**
   * Generate urban sound
   */
  private generateUrban(t: number): number {
    const noise = (Math.random() - 0.5) * 2;
    const traffic = Math.sin(t * 2) * 0.1;
    return noise * 0.15 + traffic;
  }

  /**
   * Mix audio tracks
   */
  mixTracks(trackIds: string[]): Float32Array {
    const tracks = trackIds.map(id => this.mixer.tracks.get(id)).filter(Boolean) as AudioTrack[];
    
    if (tracks.length === 0) {
      return new Float32Array(0);
    }

    const maxDuration = Math.max(...tracks.map(t => t.config.duration));
    const sampleRate = 44100;
    const totalSamples = Math.floor(maxDuration * sampleRate);
    const mixedAudio = new Float32Array(totalSamples);

    tracks.forEach(track => {
      const trackSamples = Math.floor(track.config.duration * sampleRate);
      for (let i = 0; i < Math.min(trackSamples, totalSamples); i++) {
        mixedAudio[i] += track.audioData[i] * track.config.volume * this.mixer.masterVolume;
      }
    });

    // Normalize mixed audio
    this.normalizeAudio(mixedAudio);

    return mixedAudio;
  }

  /**
   * Apply audio effect
   */
  applyEffect(audioData: Float32Array, effect: AudioEffect): Float32Array {
    const processed = new Float32Array(audioData.length);

    switch (effect.type) {
      case 'reverb':
        return this.applyReverb(audioData, effect.parameters);
      case 'delay':
        return this.applyDelay(audioData, effect.parameters);
      case 'compressor':
        return this.applyCompressor(audioData, effect.parameters);
      case 'equalizer':
        return this.applyEqualizer(audioData, effect.parameters);
      case 'filter':
        return this.applyFilter(audioData, effect.parameters);
      case 'distortion':
        return this.applyDistortion(audioData, effect.parameters);
      default:
        return audioData;
    }
  }

  /**
   * Apply reverb effect
   */
  private applyReverb(audioData: Float32Array, params: Record<string, number>): Float32Array {
    const decay = params.decay || 0.5;
    const mix = params.mix || 0.3;
    const processed = new Float32Array(audioData.length);
    
    for (let i = 0; i < audioData.length; i++) {
      processed[i] = audioData[i] * (1 - mix);
      
      // Simple reverb simulation
      for (let d = 1; d < 5; d++) {
        const delay = Math.floor(d * 0.1 * 44100);
        if (i - delay >= 0) {
          processed[i] += audioData[i - delay] * Math.pow(decay, d) * mix;
        }
      }
    }
    
    return processed;
  }

  /**
   * Apply delay effect
   */
  private applyDelay(audioData: Float32Array, params: Record<string, number>): Float32Array {
    const delayTime = params.time || 0.3;
    const feedback = params.feedback || 0.4;
    const mix = params.mix || 0.5;
    const delaySamples = Math.floor(delayTime * 44100);
    const processed = new Float32Array(audioData.length);
    
    for (let i = 0; i < audioData.length; i++) {
      processed[i] = audioData[i] * (1 - mix);
      
      if (i - delaySamples >= 0) {
        processed[i] += processed[i - delaySamples] * feedback * mix;
      }
    }
    
    return processed;
  }

  /**
   * Apply compressor effect
   */
  private applyCompressor(audioData: Float32Array, params: Record<string, number>): Float32Array {
    const threshold = params.threshold || 0.5;
    const ratio = params.ratio || 4;
    const processed = new Float32Array(audioData.length);
    
    for (let i = 0; i < audioData.length; i++) {
      const input = audioData[i];
      let output = input;
      
      if (Math.abs(input) > threshold) {
        const excess = Math.abs(input) - threshold;
        output = Math.sign(input) * (threshold + excess / ratio);
      }
      
      processed[i] = output;
    }
    
    return processed;
  }

  /**
   * Apply equalizer effect
   */
  private applyEqualizer(audioData: Float32Array, params: Record<string, number>): Float32Array {
    const low = params.low || 1;
    const mid = params.mid || 1;
    const high = params.high || 1;
    const processed = new Float32Array(audioData.length);
    
    // Simple 3-band EQ
    for (let i = 0; i < audioData.length; i++) {
      processed[i] = audioData[i]; // Placeholder for actual EQ implementation
    }
    
    return processed;
  }

  /**
   * Apply filter effect
   */
  private applyFilter(audioData: Float32Array, params: Record<string, number>): Float32Array {
    const frequency = params.frequency || 1000;
    const type = params.type || 'lowpass';
    const processed = new Float32Array(audioData.length);
    
    // Simple filter implementation
    const rc = 1.0 / (frequency * 2 * Math.PI);
    const dt = 1.0 / 44100;
    const alpha = dt / (rc + dt);
    
    let prevSample = 0;
    for (let i = 0; i < audioData.length; i++) {
      processed[i] = prevSample + alpha * (audioData[i] - prevSample);
      prevSample = processed[i];
    }
    
    return processed;
  }

  /**
   * Apply distortion effect
   */
  private applyDistortion(audioData: Float32Array, params: Record<string, number>): Float32Array {
    const amount = params.amount || 0.5;
    const processed = new Float32Array(audioData.length);
    
    for (let i = 0; i < audioData.length; i++) {
      const input = audioData[i];
      processed[i] = Math.tanh(input * (1 + amount * 10));
    }
    
    return processed;
  }

  /**
   * Add audio effect to mixer
   */
  addEffect(effect: AudioEffect): void {
    this.mixer.effects.push(effect);
  }

  /**
   * Set master volume
   */
  setMasterVolume(volume: number): void {
    this.mixer.masterVolume = Math.max(0, Math.min(1, volume));
  }

  /**
   * Get track by ID
   */
  getTrack(id: string): AudioTrack | undefined {
    return this.mixer.tracks.get(id);
  }

  /**
   * Remove track
   */
  removeTrack(id: string): boolean {
    return this.mixer.tracks.delete(id);
  }

  /**
   * Clear all tracks
   */
  clearTracks(): void {
    this.mixer.tracks.clear();
  }

  /**
   * Export audio as WAV format
   */
  exportToWAV(audioData: Float32Array, sampleRate: number = 44100): ArrayBuffer {
    const numChannels = 1;
    const bitsPerSample = 16;
    const bytesPerSample = bitsPerSample / 8;
    const blockAlign = numChannels * bytesPerSample;
    const byteRate = sampleRate * blockAlign;
    const dataSize = audioData.length * blockAlign;
    const buffer = new ArrayBuffer(44 + dataSize);
    const view = new DataView(buffer);

    // WAV header
    this.writeString(view, 0, 'RIFF');
    view.setUint32(4, 36 + dataSize, true);
    this.writeString(view, 8, 'WAVE');
    this.writeString(view, 12, 'fmt ');
    view.setUint32(16, 16, true);
    view.setUint16(20, 1, true);
    view.setUint16(22, numChannels, true);
    view.setUint32(24, sampleRate, true);
    view.setUint32(28, byteRate, true);
    view.setUint16(32, blockAlign, true);
    view.setUint16(34, bitsPerSample, true);
    this.writeString(view, 36, 'data');
    view.setUint32(40, dataSize, true);

    // Write audio data
    for (let i = 0; i < audioData.length; i++) {
      const sample = Math.max(-1, Math.min(1, audioData[i]));
      const intSample = sample < 0 ? sample * 0x8000 : sample * 0x7FFF;
      view.setInt16(44 + i * 2, intSample, true);
    }

    return buffer;
  }

  /**
   * Write string to DataView
   */
  private writeString(view: DataView, offset: number, string: string): void {
    for (let i = 0; i < string.length; i++) {
      view.setUint8(offset + i, string.charCodeAt(i));
    }
  }
}

export const audioEngine = new AudioEngine();