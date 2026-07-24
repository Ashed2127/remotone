import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
  Sequence,
} from 'remotion';
import { z } from 'zod';

// Schema for props
export const logoRevealSceneSchema = z.object({
  logoUrl: z.string(),
  brandName: z.string(),
  tagline: z.string().optional(),
  brandColors: z.array(z.string()).optional(),
  duration: z.number().default(5),
});

type Props = z.infer<typeof logoRevealSceneSchema>;

const LogoRevealScene: React.FC<Props> = ({
  logoUrl,
  brandName,
  tagline = '',
  brandColors = ['#667eea', '#764ba2'],
  duration = 5,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const totalFrames = duration * fps;

  // Logo animation
  const logoScale = spring({
    frame,
    fps,
    config: {
      damping: 200,
      stiffness: 80,
      mass: 1,
    },
  });

  const logoOpacity = spring({
    frame,
    fps,
    config: {
      damping: 200,
      stiffness: 100,
    },
  });

  const logoRotation = interpolate(frame, [0, totalFrames * 0.3], [180, 0], {
    extrapolateRight: 'clamp',
  });

  // Text animation
  const textOpacity = spring({
    frame: frame - totalFrames * 0.3,
    fps,
    config: {
      damping: 200,
      stiffness: 100,
    },
  });

  const textY = interpolate(frame, [totalFrames * 0.3, totalFrames * 0.5], [50, 0], {
    extrapolateRight: 'clamp',
  });

  // Glow effect
  const glowIntensity = interpolate(frame, [0, totalFrames * 0.5], [0, 1], {
    extrapolateRight: 'clamp',
  });

  // Particle effect
  const particleCount = 30;
  const particles = Array.from({ length: particleCount }, (_, i) => {
    const angle = (i / particleCount) * Math.PI * 2;
    const radius = 200 + Math.sin(frame * 0.05 + i) * 50;
    const x = Math.cos(angle) * radius;
    const y = Math.sin(angle) * radius;
    const opacity = Math.sin(frame * 0.03 + i * 0.5) * 0.5 + 0.5;
    
    return { x, y, opacity, angle };
  });

  return (
    <AbsoluteFill
      style={{
        background: `linear-gradient(135deg, ${brandColors[0]} 0%, ${brandColors[1] || brandColors[0]} 100%)`,
      }}
    >
      {/* Particle effects */}
      {particles.map((particle, i) => (
        <div
          key={i}
          style={{
            position: 'absolute',
            left: '50%',
            top: '50%',
            width: '4px',
            height: '4px',
            background: 'rgba(255, 255, 255, 0.8)',
            borderRadius: '50%',
            transform: `translate(${particle.x}px, ${particle.y}px)`,
            opacity: particle.opacity,
            filter: 'blur(1px)',
          }}
        />
      ))}

      {/* Main content */}
      <div
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          textAlign: 'center',
        }}
      >
        {/* Logo */}
        <div
          style={{
            position: 'relative',
            marginBottom: '40px',
            opacity: logoOpacity,
            transform: `scale(${logoScale}) rotate(${logoRotation}deg)`,
          }}
        >
          <img
            src={logoUrl}
            alt={brandName}
            style={{
              width: '200px',
              height: '200px',
              objectFit: 'contain',
              filter: `drop-shadow(0 0 ${40 * glowIntensity}px rgba(255, 255, 255, ${0.5 * glowIntensity}))`,
            }}
          />
          
          {/* Glow effect */}
          <div
            style={{
              position: 'absolute',
              top: '-20px',
              left: '-20px',
              right: '-20px',
              bottom: '-20px',
              background: `radial-gradient(circle, rgba(255, 255, 255, ${0.3 * glowIntensity}) 0%, transparent 70%)`,
              borderRadius: '50%',
              filter: 'blur(20px)',
              zIndex: -1,
            }}
          />
        </div>

        {/* Brand name */}
        <h1
          style={{
            fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif',
            fontSize: '64px',
            fontWeight: 700,
            color: '#ffffff',
            margin: '0 0 16px 0',
            letterSpacing: '-1px',
            textShadow: '0 0 40px rgba(255, 255, 255, 0.3)',
            opacity: textOpacity,
            transform: `translateY(${textY}px)`,
          }}
        >
          {brandName}
        </h1>

        {/* Tagline */}
        {tagline && (
          <p
            style={{
              fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif',
              fontSize: '28px',
              fontWeight: 300,
              color: 'rgba(255, 255, 255, 0.9)',
              margin: '0',
              letterSpacing: '1px',
              opacity: textOpacity,
              transform: `translateY(${textY}px)`,
            }}
          >
            {tagline}
          </p>
        )}
      </div>

      {/* Cinematic bars */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '60px',
          background: 'rgba(0, 0, 0, 0.8)',
        }}
      />
      <div
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: '60px',
          background: 'rgba(0, 0, 0, 0.8)',
        }}
      />
    </AbsoluteFill>
  );
};

export default LogoRevealScene;