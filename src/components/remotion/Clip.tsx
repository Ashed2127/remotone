import React from 'react';
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from 'remotion';
import { z } from 'zod';

export const ClipSchema = z.object({
  id: z.string().uuid(),
  type: z.literal('clip'),
  startTime: z.number().nonnegative(),
  duration: z.number().positive(),
  assetId: z.string().uuid(),
  startX: z.number().optional(),
  startY: z.number().optional(),
  scale: z.number().positive().default(1),
  opacity: z.number().min(0).max(1).default(1),
  effects: z.array(z.string()).default([]),
});

interface ClipProps {
  id: string;
  type: 'clip';
  startTime: number;
  duration: number;
  assetId: string;
  startX?: number;
  startY?: number;
  scale?: number;
  opacity?: number;
  effects?: string[];
}

export const Clip: React.FC<ClipProps> = ({
  assetId,
  startX = 0,
  startY = 0,
  scale = 1,
  opacity = 1,
  effects = [],
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // In a real implementation, this would load the actual asset from S3/CDN
  // For now, we'll show a placeholder
  return (
    <AbsoluteFill
      style={{
        transform: `translate(${startX}px, ${startY}px) scale(${scale})`,
        opacity,
        backgroundColor: '#333',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <div
        style={{
          color: 'white',
          fontSize: 24,
          textAlign: 'center',
        }}
      >
        Clip: {assetId}
        <br />
        <span style={{ fontSize: 16, opacity: 0.7 }}>
          Frame: {frame} | Effects: {effects.join(', ') || 'none'}
        </span>
      </div>
    </AbsoluteFill>
  );
};
