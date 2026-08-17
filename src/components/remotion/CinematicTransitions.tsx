import React from 'react';
import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate } from 'remotion';

interface CinematicTransitionProps {
  type: 'particleMorph' | 'energyPulse' | 'motionBlur' | 'lightSweep' | 'depthWipe';
  progress: number;
  children?: React.ReactNode;
  toScene?: React.ReactNode;
  accentColor?: string;
}

export const CinematicTransition: React.FC<CinematicTransitionProps> = ({
  type,
  progress,
  children,
  toScene,
  accentColor = '#10a37f',
}) => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();

  const easedProgress = interpolate(progress, [0, 1], [0, 1], {
    easing: (t) => t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2,
  });

  const renderParticleMorph = () => {
    const particleCount = 100;
    const particles = Array.from({ length: particleCount }, (_, i) => {
      const angle = (i / particleCount) * Math.PI * 2;
      const startRadius = 400;
      const endRadius = 50;
      const currentRadius = interpolate(easedProgress, [0, 1], [startRadius, endRadius]);
      
      const x = Math.cos(angle) * currentRadius;
      const y = Math.sin(angle) * currentRadius;
      const opacity = interpolate(easedProgress, [0, 0.8, 1], [1, 0.8, 0]);
      const size = interpolate(easedProgress, [0, 1], [3, 1]);

      return { x, y, opacity, size };
    });

    return (
      <svg
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
        }}
      >
        {particles.map((particle, i) => (
          <circle
            key={i}
            cx="50%"
            cy="50%"
            r={particle.size}
            fill={accentColor}
            opacity={particle.opacity}
            style={{
              transform: `translate(${particle.x}px, ${particle.y}px)`,
              filter: `blur(${particle.size}px)`,
            }}
          />
        ))}
      </svg>
    );
  };

  const renderEnergyPulse = () => {
    const pulseCount = 5;
    const pulses = Array.from({ length: pulseCount }, (_, i) => {
      const delay = i * 0.15;
      const localProgress = Math.max(0, Math.min(1, (easedProgress - delay) / (1 - delay)));
      const scale = interpolate(localProgress, [0, 1], [0, 3]);
      const opacity = interpolate(localProgress, [0, 0.5, 1], [0.8, 0.4, 0]);

      return { scale, opacity };
    });

    return (
      <AbsoluteFill style={{ backgroundColor: '#000' }}>
        {pulses.map((pulse, i) => (
          <div
            key={i}
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%) scale(${pulse.scale})',
              width: '100px',
              height: '100px',
              borderRadius: '50%',
              border: `3px solid ${accentColor}`,
              opacity: pulse.opacity,
              boxShadow: `0 0 30px ${accentColor}, inset 0 0 30px ${accentColor}`,
            }}
          />
        ))}
      </AbsoluteFill>
    );
  };

  const renderMotionBlur = () => {
    const blurAmount = interpolate(easedProgress, [0, 0.5, 1], [0, 20, 0]);
    const opacity = interpolate(easedProgress, [0, 0.5, 1], [1, 0.5, 1]);

    return (
      <AbsoluteFill style={{ opacity }}>
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            filter: `blur(${blurAmount}px)`,
            transform: `scale(${1 + easedProgress * 0.1})`,
          }}
        >
          {children}
        </div>
        {toScene && (
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              filter: `blur(${blurAmount}px)`,
              transform: `scale(${1.1 - easedProgress * 0.1})`,
              opacity: easedProgress,
            }}
          >
            {toScene}
          </div>
        )}
      </AbsoluteFill>
    );
  };

  const renderLightSweep = () => {
    const sweepX = interpolate(easedProgress, [0, 1], [-width, width * 2]);
    const sweepWidth = 200;
    const opacity = interpolate(easedProgress, [0, 0.3, 0.7, 1], [0, 1, 1, 0]);

    return (
      <AbsoluteFill>
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: `linear-gradient(90deg, 
              transparent 0%, 
              ${accentColor}33 ${sweepX - sweepWidth}px, 
              ${accentColor}66 ${sweepX}px, 
              ${accentColor}33 ${sweepX + sweepWidth}px, 
              transparent 100%)`,
            opacity,
          }}
        />
        {children}
        {toScene && <div style={{ opacity: easedProgress }}>{toScene}</div>}
      </AbsoluteFill>
    );
  };

  const renderDepthWipe = () => {
    const depth = interpolate(easedProgress, [0, 1], [0, 1000]);
    const opacity = interpolate(easedProgress, [0, 0.5, 1], [1, 0.5, 0]);

    return (
      <AbsoluteFill style={{ perspective: '1000px' }}>
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            transform: `translateZ(${-depth}px)`,
            opacity,
          }}
        >
          {children}
        </div>
        {toScene && (
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              transform: `translateZ(${1000 - depth}px)`,
              opacity: easedProgress,
            }}
          >
            {toScene}
          </div>
        )}
      </AbsoluteFill>
    );
  };

  switch (type) {
    case 'particleMorph':
      return (
        <AbsoluteFill>
          <div style={{ opacity: 1 - easedProgress }}>{children}</div>
          {renderParticleMorph()}
          {toScene && <div style={{ opacity: easedProgress }}>{toScene}</div>}
        </AbsoluteFill>
      );
    case 'energyPulse':
      return (
        <AbsoluteFill>
          <div style={{ opacity: 1 - easedProgress }}>{children}</div>
          {renderEnergyPulse()}
          {toScene && <div style={{ opacity: easedProgress }}>{toScene}</div>}
        </AbsoluteFill>
      );
    case 'motionBlur':
      return renderMotionBlur();
    case 'lightSweep':
      return renderLightSweep();
    case 'depthWipe':
      return renderDepthWipe();
    default:
      return <AbsoluteFill>{children}</AbsoluteFill>;
  }
};