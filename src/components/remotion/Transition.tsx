import React from 'react';
import { AbsoluteFill, useCurrentFrame, interpolate } from 'remotion';
import { z } from 'zod';

export const TransitionSchema = z.object({
  id: z.string().uuid(),
  type: z.literal('transition'),
  startTime: z.number().nonnegative(),
  duration: z.number().positive(),
  transitionType: z.enum(['fade', 'slide', 'zoom', 'wipe']),
  fromClipId: z.string().uuid(),
  toClipId: z.string().uuid(),
});

interface TransitionProps {
  id: string;
  type: 'transition';
  startTime: number;
  duration: number;
  transitionType: 'fade' | 'slide' | 'zoom' | 'wipe';
  fromClipId: string;
  toClipId: string;
}

export const Transition: React.FC<TransitionProps> = ({
  transitionType,
  fromClipId,
  toClipId,
  duration,
}) => {
  const frame = useCurrentFrame();
  const progress = frame / duration;

  const getTransitionStyle = () => {
    switch (transitionType) {
      case 'fade':
        return {
          opacity: interpolate(progress, [0, 1], [0, 1]),
        };
      case 'slide':
        return {
          transform: `translateX(${interpolate(progress, [0, 1], [-100, 0])}%)`,
        };
      case 'zoom':
        return {
          transform: `scale(${interpolate(progress, [0, 1], [0.5, 1])})`,
        };
      case 'wipe':
        return {
          clipPath: `inset(0 ${interpolate(progress, [0, 1], [100, 0])}% 0 0)`,
        };
      default:
        return {};
    }
  };

  return (
    <AbsoluteFill
      style={{
        ...getTransitionStyle(),
        backgroundColor: '#222',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <div style={{ color: 'white', textAlign: 'center' }}>
        <h2>Transition: {transitionType}</h2>
        <p>{fromClipId} → {toClipId}</p>
      </div>
    </AbsoluteFill>
  );
};
