import type { Timeline } from '@/types/timeline';
import * as Tone from 'tone';

// Note: Tone.js is primarily a browser library. For server-side rendering,
// we'll need to implement a fallback or use a Web Audio polyfill.
// This implementation provides the structure for both scenarios.

interface AudioSchedule {
  nodeId: string;
  assetId: string;
  startTime: number;
  duration: number;
  volume: number;
  fadeIn: number;
  fadeOut: number;
  loop: boolean;
  soundType?: 'synth' | 'noise' | 'ambient' | 'percussion';
  note?: string;
  melody?: string[];
}

export class AudioGenerator {
  private toneInitialized: boolean = false;
  private scheduledNodes: Map<string, any> = new Map();
  private activeSynths: Map<string, any> = new Map();
  private masterVolume: Tone.Volume | null = null;
  private reverb: Tone.Reverb | null = null;
  private delay: Tone.FeedbackDelay | null = null;

  constructor() {
    // Initialize Tone.js for browser-based preview
    if (typeof window !== 'undefined') {
      this.initializeTone();
    }
  }

  private async initializeTone(): Promise<void> {
    try {
      await Tone.start();
      this.toneInitialized = true;
      
      // Create master effects chain
      this.masterVolume = new Tone.Volume(-6).toDestination();
      this.reverb = new Tone.Reverb({ decay: 2, wet: 0.3 }).connect(this.masterVolume);
      this.delay = new Tone.FeedbackDelay({ delayTime: '8n', feedback: 0.3, wet: 0.2 }).connect(this.reverb);
      
      console.log('Tone.js initialized successfully');
    } catch (error) {
      console.error('Failed to initialize Tone.js:', error);
    }
  }

  /**
   * Parse timeline and extract audio cues
   */
  extractAudioSchedules(timeline: Timeline): AudioSchedule[] {
    const schedules: AudioSchedule[] = [];

    for (const node of timeline.nodes) {
      if (node.type === 'audio') {
        schedules.push({
          nodeId: node.id,
          assetId: node.assetId,
          startTime: node.startTime,
          duration: node.duration,
          volume: node.volume,
          fadeIn: node.fadeIn,
          fadeOut: node.fadeOut,
          loop: node.loop,
          soundType: (node as any).soundType || 'synth',
          note: (node as any).note,
          melody: (node as any).melody,
        });
      }
    }

    return schedules.sort((a, b) => a.startTime - b.startTime);
  }

  /**
   * Schedule audio for playback (browser-based preview)
   */
  async scheduleAudio(schedules: AudioSchedule[]): Promise<void> {
    if (!this.toneInitialized) {
      console.warn('Tone.js not initialized - audio scheduling skipped');
      return;
    }

    // Clear existing schedules
    this.clearAllSchedules();

    for (const schedule of schedules) {
      await this.scheduleSingleAudio(schedule);
    }
  }

  /**
   * Schedule a single audio cue using Tone.js
   */
  private async scheduleSingleAudio(schedule: AudioSchedule): Promise<void> {
    if (!this.toneInitialized || !this.delay) return;

    try {
      const startTime = schedule.startTime;
      const duration = schedule.duration;
      const soundType = schedule.soundType || 'synth';

      // Create appropriate synth based on sound type
      let synth: any;
      
      switch (soundType) {
        case 'synth':
          synth = new Tone.PolySynth(Tone.Synth, {
            oscillator: { type: 'fmsine' },
            envelope: { attack: 0.01, decay: 0.1, sustain: 0.5, release: 1 }
          }).connect(this.delay);
          break;
        
        case 'ambient':
          synth = new Tone.PolySynth(Tone.AMSynth, {
            harmonicity: 1,
            detune: 0,
            oscillator: { type: 'sine' },
            envelope: { attack: 0.5, decay: 0.1, sustain: 1, release: 1 }
          }).connect(this.delay);
          break;
        
        case 'percussion':
          synth = new Tone.MembraneSynth({
            pitchDecay: 0.05,
            octaves: 10,
            oscillator: { type: 'sine' },
            envelope: { attack: 0.001, decay: 0.4, sustain: 0.01, release: 1.4 }
          }).connect(this.delay);
          break;
        
        case 'noise':
          synth = new Tone.NoiseSynth({
            noise: { type: 'white' },
            envelope: { attack: 0.005, decay: 0.1, sustain: 0 }
          }).connect(this.delay);
          break;
        
        default:
          synth = new Tone.PolySynth(Tone.Synth).connect(this.delay);
      }

      // Store synth for cleanup
      this.activeSynths.set(schedule.nodeId, synth);

      // Apply volume and fade effects
      const volumeDb = Tone.gainToDb(schedule.volume);
      synth.volume.value = volumeDb;

      // Schedule the audio with Tone.js transport
      if (schedule.melody && schedule.melody.length > 0) {
        // Play a melody sequence
        const sequence = new Tone.Sequence((time, note) => {
          synth.triggerAttackRelease(note, '8n', time);
        }, schedule.melody, '8n');
        
        sequence.start(startTime);
        sequence.stop(startTime + duration);
        this.scheduledNodes.set(schedule.nodeId, { synth, sequence });
      } else if (schedule.note) {
        // Play single note
        synth.triggerAttackRelease(schedule.note, duration, startTime);
        this.scheduledNodes.set(schedule.nodeId, { synth });
      } else {
        // Generate a pleasant chord progression
        const chords = ['C4', 'E4', 'G4', 'B4'];
        const randomChord = chords[Math.floor(Math.random() * chords.length)];
        synth.triggerAttackRelease(randomChord, duration, startTime);
        this.scheduledNodes.set(schedule.nodeId, { synth });
      }

      // Apply fade in/out using Tone.js envelope automation
      if (schedule.fadeIn > 0) {
        synth.volume.setValueAtTime(-Infinity, startTime);
        synth.volume.linearRampToValueAtTime(volumeDb, startTime + schedule.fadeIn);
      }

      if (schedule.fadeOut > 0) {
        synth.volume.setValueAtTime(volumeDb, startTime + duration - schedule.fadeOut);
        synth.volume.linearRampToValueAtTime(-Infinity, startTime + duration);
      }

      console.log(`Scheduled ${soundType} audio ${schedule.nodeId} at ${startTime}s`);
    } catch (error) {
      console.error(`Failed to schedule audio ${schedule.nodeId}:`, error);
    }
  }

  /**
   * Clear all scheduled audio
   */
  clearAllSchedules(): void {
    // Stop all sequences
    for (const [nodeId, nodes] of this.scheduledNodes) {
      try {
        if (nodes.sequence) {
          nodes.sequence.stop();
          nodes.sequence.dispose();
        }
      } catch (error) {
        console.error(`Error clearing sequence ${nodeId}:`, error);
      }
    }
    this.scheduledNodes.clear();

    // Dispose all synths
    for (const [nodeId, synth] of this.activeSynths) {
      try {
        synth.dispose();
      } catch (error) {
        console.error(`Error disposing synth ${nodeId}:`, error);
      }
    }
    this.activeSynths.clear();
  }

  /**
   * Stop audio playback
   */
  stop(): void {
    if (this.toneInitialized) {
      Tone.Transport.stop();
    }
    this.clearAllSchedules();
  }

  /**
   * Start audio playback
   */
  async start(): Promise<void> {
    if (!this.toneInitialized) {
      await this.initializeTone();
    }
    if (this.toneInitialized) {
      await Tone.Transport.start();
    }
  }

  /**
   * Generate a pleasant melody for background music
   */
  generateMelody(seed: string = 'default'): string[] {
    const scales = {
      'major': ['C4', 'D4', 'E4', 'F4', 'G4', 'A4', 'B4', 'C5'],
      'minor': ['A3', 'B3', 'C4', 'D4', 'E4', 'F4', 'G4', 'A4'],
      'pentatonic': ['C4', 'D4', 'E4', 'G4', 'A4', 'C5'],
      'ambient': ['C3', 'E3', 'G3', 'B3', 'C4', 'E4', 'G4', 'B4']
    };
    
    const selectedScale = scales.ambient;
    const melody: string[] = [];
    
    // Generate a simple 8-note melody
    for (let i = 0; i < 8; i++) {
      const noteIndex = Math.floor(Math.random() * selectedScale.length);
      melody.push(selectedScale[noteIndex]);
    }
    
    return melody;
  }

  /**
   * Create a chord progression
   */
  generateChordProgression(): string[] {
    const progressions = [
      ['C4', 'E4', 'G4'],      // C major
      ['F4', 'A4', 'C5'],      // F major
      ['G4', 'B4', 'D5'],      // G major
      ['C4', 'E4', 'G4'],      // C major
    ];
    
    return progressions[Math.floor(Math.random() * progressions.length)];
  }

  /**
   * Server-side audio rendering for final export
   * This would use a separate server-side audio renderer
   */
  async renderAudioForExport(
    schedules: AudioSchedule[],
    outputPath: string
  ): Promise<void> {
    // For server-side rendering, we would use a different approach:
    // 1. FFmpeg to combine audio tracks
    // 2. Or a Web Audio API polyfill for server-side
    // 3. Or a dedicated audio processing library
    
    console.log('Server-side audio rendering not yet implemented');
    console.log(`Would render ${schedules.length} audio cues to ${outputPath}`);
    
    // Placeholder for server-side implementation
    // In production, this would:
    // 1. Download audio assets from S3
    // 2. Use FFmpeg or similar to mix and schedule audio
    // 3. Apply fade in/out effects
    // 4. Export to final audio file
  }

  /**
   * Get available sound types
   */
  getAvailableSoundTypes(): string[] {
    return ['synth', 'ambient', 'percussion', 'noise'];
  }

  /**
   * Preview a sound type immediately
   */
  async previewSoundType(soundType: string, duration: number = 2): Promise<void> {
    if (!this.toneInitialized) {
      await this.initializeTone();
    }

    const schedule: AudioSchedule = {
      nodeId: 'preview',
      assetId: 'preview',
      startTime: 0,
      duration,
      volume: 0.5,
      fadeIn: 0.1,
      fadeOut: 0.1,
      loop: false,
      soundType: soundType as any,
    };

    await this.scheduleSingleAudio(schedule);
  }
}

// Singleton instance
export const audioGenerator = new AudioGenerator();
