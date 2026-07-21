import React, { useEffect, useRef } from 'react';
import { useCurrentFrame, useAudioData } from 'remotion';
import { z } from 'zod';
import { audioGenerator } from '@/lib/audio-generator';

export const AudioSchema = z.object({
  id: z.string().uuid(),
  type: z.literal('audio'),
  startTime: z.number().nonnegative(),
  duration: z.number().positive(),
  assetId: z.string().uuid(),
  volume: z.number().min(0).max(1).default(1),
  fadeIn: z.number().nonnegative().default(0),
  fadeOut: z.number().nonnegative().default(0),
  loop: z.boolean().default(false),
  soundType: z.enum(['synth', 'ambient', 'percussion', 'noise']).default('synth'),
  note: z.string().optional(),
  melody: z.array(z.string()).optional(),
});

interface AudioProps {
  id: string;
  type: 'audio';
  startTime: number;
  duration: number;
  assetId: string;
  volume?: number;
  fadeIn?: number;
  fadeOut?: number;
  loop?: boolean;
  soundType?: 'synth' | 'ambient' | 'percussion' | 'noise';
  note?: string;
  melody?: string[];
}

export const AudioCue: React.FC<AudioProps> = ({
  assetId,
  volume = 1,
  fadeIn = 0,
  fadeOut = 0,
  loop = false,
  soundType = 'synth',
  note,
  melody,
}) => {
  const frame = useCurrentFrame();
  const audioInitialized = useRef(false);

  // Initialize audio on mount
  useEffect(() => {
    if (!audioInitialized.current && typeof window !== 'undefined') {
      audioGenerator.start().then(() => {
        audioInitialized.current = true;
        console.log('Audio generator initialized');
      });
    }
  }, []);

  // Schedule audio when component mounts or props change
  useEffect(() => {
    if (audioInitialized.current) {
      const schedule = {
        nodeId: assetId,
        assetId,
        startTime: 0, // Remotion handles timing via frames
        duration: 5, // Placeholder duration
        volume,
        fadeIn,
        fadeOut,
        loop,
        soundType,
        note,
        melody,
      };

      audioGenerator.scheduleAudio([schedule]).catch(console.error);
    }
  }, [assetId, volume, fadeIn, fadeOut, loop, soundType, note, melody]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      // Don't stop the entire audio generator, just clear this node's audio
      // This allows other audio cues to continue playing
      if (audioInitialized.current) {
        // Individual cleanup would be handled by the audio generator
        console.log(`Cleaning up audio cue ${assetId}`);
      }
    };
  }, [assetId]);

  return (
    <div
      style={{
        position: 'absolute',
        bottom: 10,
        right: 10,
        background: 'rgba(0,0,0,0.7)',
        color: 'white',
        padding: '4px 8px',
        borderRadius: '4px',
        fontSize: 12,
      }}
    >
      🎵 {assetId} ({soundType}) vol: {volume.toFixed(2)}
    </div>
  );
};
