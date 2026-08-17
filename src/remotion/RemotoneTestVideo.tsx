import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate } from 'remotion';
import { z } from 'zod';

// Simple schema for test video
export const remotoneTestVideoSchema = z.object({
  title: z.string().default('Remotone Test Video'),
  subtitle: z.string().default('AI-Powered Motion Design Engine'),
  brandColor: z.string().default('#667eea'),
  secondaryColor: z.string().default('#764ba2'),
});

type Props = z.infer<typeof remotoneTestVideoSchema>;

const RemotoneTestVideo: React.FC<Props> = ({
  title = 'Remotone Test Video',
  subtitle = 'AI-Powered Motion Design Engine',
  brandColor = '#667eea',
  secondaryColor = '#764ba2',
}) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const totalDuration = durationInFrames / fps; // 15 seconds

  // Animation timings
  const fadeInEnd = 1 * fps; // 1 second
  const textAnimationEnd = 4 * fps; // 4 seconds
  const middleSectionEnd = 11 * fps; // 11 seconds
  const fadeOutStart = 13 * fps; // 13 seconds

  // Calculate animation values
  const opacity = interpolate(
    frame,
    [0, fadeInEnd, fadeOutStart, durationInFrames],
    [0, 1, 1, 0]
  );

  const scale = interpolate(
    frame,
    [0, textAnimationEnd],
    [0.8, 1],
    { extrapolateRight: 'clamp' }
  );

  const slideUp = interpolate(
    frame,
    [0, textAnimationEnd],
    [100, 0],
    { extrapolateRight: 'clamp' }
  );

  const pulseScale = 1 + Math.sin(frame / 30) * 0.05;

  const rotation = interpolate(frame, [0, durationInFrames], [0, 360]);

  return (
    <AbsoluteFill
      style={{
        background: `linear-gradient(135deg, ${brandColor} 0%, ${secondaryColor} 100%)`,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        opacity,
      }}
    >
      {/* Animated background circles */}
      <div
        style={{
          position: 'absolute',
          width: 400,
          height: 400,
          borderRadius: '50%',
          background: 'rgba(255, 255, 255, 0.1)',
          transform: `scale(${pulseScale}) rotate(${rotation}deg)`,
          animation: 'pulse 2s ease-in-out infinite',
        }}
      />
      <div
        style={{
          position: 'absolute',
          width: 300,
          height: 300,
          borderRadius: '50%',
          background: 'rgba(255, 255, 255, 0.05)',
          transform: `scale(${pulseScale * 0.8}) rotate(${-rotation}deg)`,
        }}
      />

      {/* Main content */}
      <div
        style={{
          textAlign: 'center',
          transform: `translateY(${slideUp}px) scale(${scale})`,
          zIndex: 10,
        }}
      >
        <h1
          style={{
            fontSize: 80,
            fontWeight: 'bold',
            color: 'white',
            margin: 0,
            textShadow: '0 4px 20px rgba(0,0,0,0.3)',
            letterSpacing: -2,
          }}
        >
          {title}
        </h1>
        
        <div
          style={{
            height: 2,
            width: '60%',
            background: 'white',
            margin: '30px auto',
            opacity: 0.8,
          }}
        />

        <p
          style={{
            fontSize: 32,
            color: 'rgba(255, 255, 255, 0.9)',
            margin: 0,
            fontWeight: 300,
          }}
        >
          {subtitle}
        </p>

        {/* Animated progress bar */}
        <div
          style={{
            marginTop: 60,
            width: 200,
            height: 4,
            background: 'rgba(255, 255, 255, 0.3)',
            borderRadius: 2,
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              height: '100%',
              width: `${(frame / durationInFrames) * 100}%`,
              background: 'white',
              borderRadius: 2,
            }}
          />
        </div>

        {/* Time display */}
        <p
          style={{
            marginTop: 20,
            fontSize: 16,
            color: 'rgba(255, 255, 255, 0.7)',
            fontFamily: 'monospace',
          }}
        >
          {Math.floor(frame / fps)}s / {totalDuration}s
        </p>
      </div>

      {/* Corner decorations */}
      <div
        style={{
          position: 'absolute',
          top: 40,
          left: 40,
          width: 60,
          height: 60,
          borderTop: `3px solid rgba(255,255,255,0.5)`,
          borderLeft: `3px solid rgba(255,255,255,0.5)`,
        }}
      />
      <div
        style={{
          position: 'absolute',
          top: 40,
          right: 40,
          width: 60,
          height: 60,
          borderTop: `3px solid rgba(255,255,255,0.5)`,
          borderRight: `3px solid rgba(255,255,255,0.5)`,
        }}
      />
      <div
        style={{
          position: 'absolute',
          bottom: 40,
          left: 40,
          width: 60,
          height: 60,
          borderBottom: `3px solid rgba(255,255,255,0.5)`,
          borderLeft: `3px solid rgba(255,255,255,0.5)`,
        }}
      />
      <div
        style={{
          position: 'absolute',
          bottom: 40,
          right: 40,
          width: 60,
          height: 60,
          borderBottom: `3px solid rgba(255,255,255,0.5)`,
          borderRight: `3px solid rgba(255,255,255,0.5)`,
        }}
      />
    </AbsoluteFill>
  );
};

export default RemotoneTestVideo;