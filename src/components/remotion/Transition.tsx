import React from 'react';
import { AbsoluteFill, useCurrentFrame, interpolate, useVideoConfig } from 'remotion';
import { z } from 'zod';

export const TransitionSchema = z.object({
  id: z.string().uuid(),
  type: z.literal('transition'),
  startTime: z.number().nonnegative(),
  duration: z.number().positive(),
  transitionType: z.enum(['fade', 'slide', 'zoom', 'wipe', 'crossfade', 'blur', 'scale', 'rotate']),
  fromClipId: z.string().uuid(),
  toClipId: z.string().uuid(),
});

interface TransitionProps {
  id?: string;
  type?: 'transition';
  startTime?: number;
  duration: number;
  transitionType: 'fade' | 'slide' | 'zoom' | 'wipe' | 'crossfade' | 'blur' | 'scale' | 'rotate';
  fromClipId?: string;
  toClipId?: string;
  children?: React.ReactNode;
  toScene?: React.ReactNode;
}

// Easing functions for smooth transitions
const easingFunctions = {
  easeInOutCubic: (t: number) => t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2,
  easeOutExpo: (t: number) => t === 1 ? 1 : 1 - Math.pow(2, -10 * t),
  easeInOutQuart: (t: number) => t < 0.5 ? 8 * t * t * t * t : 1 - Math.pow(-2 * t + 2, 4) / 2,
};

export const Transition: React.FC<TransitionProps> = ({
  transitionType,
  fromClipId,
  toClipId,
  duration,
  children,
  toScene,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const progress = Math.min(frame / duration, 1);
  
  // Apply smooth easing
  const easedProgress = easingFunctions.easeInOutCubic(progress);

  const getTransitionStyle = () => {
    switch (transitionType) {
      case 'fade':
        return {
          opacity: interpolate(easedProgress, [0, 1], [1, 0]),
        };
      case 'crossfade':
        return {
          opacity: interpolate(easedProgress, [0, 1], [1, 0]),
        };
      case 'slide':
        return {
          transform: `translateX(${interpolate(easedProgress, [0, 1], [0, -100])}%)`,
        };
      case 'zoom':
        return {
          transform: `scale(${interpolate(easedProgress, [0, 1], [1, 1.2])})`,
          opacity: interpolate(easedProgress, [0, 1], [1, 0]),
        };
      case 'wipe':
        return {
          clipPath: `inset(0 ${interpolate(easedProgress, [0, 1], [0, 100])}% 0 0)`,
        };
      case 'blur':
        return {
          filter: `blur(${interpolate(easedProgress, [0, 1], [0, 20])}px)`,
          opacity: interpolate(easedProgress, [0, 1], [1, 0]),
        };
      case 'scale':
        return {
          transform: `scale(${interpolate(easedProgress, [0, 1], [1, 0.8])})`,
          opacity: interpolate(easedProgress, [0, 1], [1, 0]),
        };
      case 'rotate':
        return {
          transform: `rotate(${interpolate(easedProgress, [0, 1], [0, 5])}deg) scale(${interpolate(easedProgress, [0, 1], [1, 0.9])})`,
          opacity: interpolate(easedProgress, [0, 1], [1, 0]),
        };
      default:
        return {};
    }
  };

  const getIncomingStyle = () => {
    switch (transitionType) {
      case 'fade':
        return {
          opacity: interpolate(easedProgress, [0, 1], [0, 1]),
        };
      case 'crossfade':
        return {
          opacity: interpolate(easedProgress, [0, 1], [0, 1]),
        };
      case 'slide':
        return {
          transform: `translateX(${interpolate(easedProgress, [0, 1], [100, 0])}%)`,
        };
      case 'zoom':
        return {
          transform: `scale(${interpolate(easedProgress, [0, 1], [0.8, 1])})`,
          opacity: interpolate(easedProgress, [0, 1], [0, 1]),
        };
      case 'wipe':
        return {
          clipPath: `inset(0 ${interpolate(easedProgress, [0, 1], [100, 0])}% 0 0)`,
        };
      case 'blur':
        return {
          filter: `blur(${interpolate(easedProgress, [0, 1], [20, 0])}px)`,
          opacity: interpolate(easedProgress, [0, 1], [0, 1]),
        };
      case 'scale':
        return {
          transform: `scale(${interpolate(easedProgress, [0, 1], [1.2, 1])})`,
          opacity: interpolate(easedProgress, [0, 1], [0, 1]),
        };
      case 'rotate':
        return {
          transform: `rotate(${interpolate(easedProgress, [0, 1], [-5, 0])}deg) scale(${interpolate(easedProgress, [0, 1], [1.1, 1])})`,
          opacity: interpolate(easedProgress, [0, 1], [0, 1]),
        };
      default:
        return {};
    }
  };

  return (
    <AbsoluteFill style={{ backgroundColor: '#000' }}>
      {/* Outgoing scene */}
      <AbsoluteFill style={getTransitionStyle()}>
        {children}
      </AbsoluteFill>
      
      {/* Incoming scene */}
      {toScene && (
        <AbsoluteFill style={getIncomingStyle()}>
          {toScene}
        </AbsoluteFill>
      )}
    </AbsoluteFill>
  );
};
