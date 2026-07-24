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
export const brandClosingSceneSchema = z.object({
  logoUrl: z.string(),
  brandName: z.string(),
  website: z.string().optional(),
  socialLinks: z.array(z.object({
    platform: z.string(),
    url: z.string(),
  })).optional(),
  brandColors: z.array(z.string()).optional(),
  duration: z.number().default(4),
});

type Props = z.infer<typeof brandClosingSceneSchema>;

const BrandClosingScene: React.FC<Props> = ({
  logoUrl,
  brandName,
  website = '',
  socialLinks = [],
  brandColors = ['#667eea', '#764ba2'],
  duration = 4,
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
      mass: 0.8,
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

  // Text animation
  const textOpacity = spring({
    frame: frame - totalFrames * 0.2,
    fps,
    config: {
      damping: 200,
      stiffness: 100,
    },
  });

  const textY = interpolate(frame, [totalFrames * 0.2, totalFrames * 0.4], [30, 0], {
    extrapolateRight: 'clamp',
  });

  // Links animation
  const linksOpacity = spring({
    frame: frame - totalFrames * 0.4,
    fps,
    config: {
      damping: 200,
      stiffness: 100,
    },
  });

  // Background animation
  const bgOpacity = interpolate(frame, [0, totalFrames * 0.3], [0, 1], {
    extrapolateRight: 'clamp',
  });

  // Particle effect
  const particleCount = 40;
  const particles = Array.from({ length: particleCount }, (_, i) => {
    const angle = (i / particleCount) * Math.PI * 2;
    const radius = 250 + Math.sin(frame * 0.04 + i * 0.5) * 30;
    const x = Math.cos(angle) * radius;
    const y = Math.sin(angle) * radius;
    const opacity = Math.sin(frame * 0.02 + i * 0.3) * 0.4 + 0.3;
    
    return { x, y, opacity, angle };
  });

  return (
    <AbsoluteFill
      style={{
        background: `linear-gradient(135deg, ${brandColors[0]} 0%, ${brandColors[1] || brandColors[0]} 100%)`,
      }}
    >
      {/* Animated background */}
      <div
        style={{
          position: 'absolute',
          width: '100%',
          height: '100%',
          background: `
            radial-gradient(circle at 30% 50%, rgba(255, 255, 255, ${0.1 * bgOpacity}) 0%, transparent 50%),
            radial-gradient(circle at 70% 50%, rgba(255, 255, 255, ${0.05 * bgOpacity}) 0%, transparent 50%)
          `,
        }}
      />

      {/* Particle effects */}
      {particles.map((particle, i) => (
        <div
          key={i}
          style={{
            position: 'absolute',
            left: '50%',
            top: '50%',
            width: '3px',
            height: '3px',
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
            marginBottom: '32px',
            opacity: logoOpacity,
            transform: `scale(${logoScale})`,
          }}
        >
          <img
            src={logoUrl}
            alt={brandName}
            style={{
              width: '120px',
              height: '120px',
              objectFit: 'contain',
              filter: 'drop-shadow(0 10px 30px rgba(0, 0, 0, 0.2))',
            }}
          />
        </div>

        {/* Brand name */}
        <h1
          style={{
            fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif',
            fontSize: '48px',
            fontWeight: 700,
            color: '#ffffff',
            margin: '0 0 16px 0',
            letterSpacing: '-0.5px',
            textShadow: '0 0 30px rgba(255, 255, 255, 0.3)',
            opacity: textOpacity,
            transform: `translateY(${textY}px)`,
          }}
        >
          {brandName}
        </h1>

        {/* Website */}
        {website && (
          <p
            style={{
              fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif',
              fontSize: '20px',
              fontWeight: 400,
              color: 'rgba(255, 255, 255, 0.9)',
              margin: '0 0 32px 0',
              opacity: textOpacity,
              transform: `translateY(${textY}px)`,
            }}
          >
            {website}
          </p>
        )}

        {/* Social links */}
        {socialLinks.length > 0 && (
          <div
            style={{
              display: 'flex',
              gap: '24px',
              justifyContent: 'center',
              opacity: linksOpacity,
            }}
          >
            {socialLinks.map((link, index) => (
              <div
                key={index}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '12px 24px',
                  background: 'rgba(255, 255, 255, 0.1)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  borderRadius: '24px',
                  backdropFilter: 'blur(10px)',
                }}
              >
                <span
                  style={{
                    fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif',
                    fontSize: '16px',
                    fontWeight: 500,
                    color: '#ffffff',
                  }}
                >
                  {link.platform}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Thank you message */}
      <div
        style={{
          position: 'absolute',
          bottom: '120px',
          left: '50%',
          transform: 'translateX(-50%)',
          opacity: linksOpacity,
        }}
      >
        <p
          style={{
            fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif',
            fontSize: '18px',
            fontWeight: 300,
            color: 'rgba(255, 255, 255, 0.8)',
            margin: '0',
            letterSpacing: '2px',
            textTransform: 'uppercase',
          }}
        >
          Thank You
        </p>
      </div>

      {/* Cinematic bars */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '60px',
          background: 'rgba(0, 0, 0, 0.6)',
        }}
      />
      <div
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: '60px',
          background: 'rgba(0, 0, 0, 0.6)',
        }}
      />

      {/* Decorative elements */}
      <div
        style={{
          position: 'absolute',
          top: '50%',
          left: '10%',
          width: '2px',
          height: '100px',
          background: 'rgba(255, 255, 255, 0.2)',
          transform: 'translateY(-50%)',
        }}
      />
      <div
        style={{
          position: 'absolute',
          top: '50%',
          right: '10%',
          width: '2px',
          height: '100px',
          background: 'rgba(255, 255, 255, 0.2)',
          transform: 'translateY(-50%)',
        }}
      />
    </AbsoluteFill>
  );
};

export default BrandClosingScene;