import React from 'react';
import { AbsoluteFill, useCurrentFrame } from 'remotion';
import { z } from 'zod';

export const TextSchema = z.object({
  id: z.string().uuid(),
  type: z.literal('text'),
  startTime: z.number().nonnegative(),
  duration: z.number().positive(),
  content: z.string(),
  fontFamily: z.string().default('Arial'),
  fontSize: z.number().positive().default(24),
  color: z.string().default('#ffffff'),
  position: z.object({
    x: z.number(),
    y: z.number(),
  }),
  backgroundColor: z.string().optional(),
  animation: z.enum(['none', 'fadeIn', 'slideUp', 'typewriter']).default('none'),
});

interface TextProps {
  id: string;
  type: 'text';
  startTime: number;
  duration: number;
  content: string;
  fontFamily?: string;
  fontSize?: number;
  color?: string;
  position: { x: number; y: number };
  backgroundColor?: string;
  animation?: 'none' | 'fadeIn' | 'slideUp' | 'typewriter';
}

export const TextOverlay: React.FC<TextProps> = ({
  content,
  fontFamily = 'Arial',
  fontSize = 24,
  color = '#ffffff',
  position,
  backgroundColor,
  animation = 'none',
}) => {
  const frame = useCurrentFrame();

  const getAnimationStyle = () => {
    switch (animation) {
      case 'fadeIn':
        return {
          opacity: Math.min(frame / 30, 1),
        };
      case 'slideUp':
        return {
          transform: `translateY(${Math.max(50 - frame * 2, 0)}px)`,
          opacity: Math.min(frame / 20, 1),
        };
      case 'typewriter':
        const charsToShow = Math.min(frame, content.length);
        return {
          overflow: 'hidden',
        };
      default:
        return {};
    }
  };

  const displayContent = animation === 'typewriter' 
    ? content.substring(0, Math.min(frame, content.length))
    : content;

  return (
    <AbsoluteFill
      style={{
        pointerEvents: 'none',
      }}
    >
      <div
        style={{
          position: 'absolute',
          left: position.x,
          top: position.y,
          fontFamily,
          fontSize,
          color,
          backgroundColor,
          padding: backgroundColor ? '8px 16px' : undefined,
          borderRadius: backgroundColor ? '4px' : undefined,
          ...getAnimationStyle(),
        }}
      >
        {displayContent}
      </div>
    </AbsoluteFill>
  );
};
