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
export const featureHighlightSceneSchema = z.object({
  productImageUrl: z.string(),
  featureName: z.string(),
  featureDescription: z.string(),
  highlightPoints: z.array(z.string()).optional(),
  accentColor: z.string().default('#667eea'),
  duration: z.number().default(5),
});

type Props = z.infer<typeof featureHighlightSceneSchema>;

const FeatureHighlightScene: React.FC<Props> = ({
  productImageUrl,
  featureName,
  featureDescription,
  highlightPoints = [],
  accentColor = '#667eea',
  duration = 5,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const totalFrames = duration * fps;

  // Product animation
  const productScale = spring({
    frame,
    fps,
    config: {
      damping: 200,
      stiffness: 60,
      mass: 1,
    },
  });

  const productRotation = interpolate(frame, [0, totalFrames * 0.3], [-15, 0], {
    extrapolateRight: 'clamp',
  });

  const productY = interpolate(frame, [0, totalFrames * 0.2], [100, 0], {
    extrapolateRight: 'clamp',
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

  const textX = interpolate(frame, [totalFrames * 0.2, totalFrames * 0.4], [-50, 0], {
    extrapolateRight: 'clamp',
  });

  // Highlight points animation
  const pointsOpacity = spring({
    frame: frame - totalFrames * 0.4,
    fps,
    config: {
      damping: 200,
      stiffness: 100,
    },
  });

  // Glow effect
  const glowIntensity = interpolate(frame, [0, totalFrames * 0.5], [0, 1], {
    extrapolateRight: 'clamp',
  });

  // Pulse animation for accent
  const pulseScale = 1 + Math.sin(frame * 0.1) * 0.05;

  return (
    <AbsoluteFill
      style={{
        background: `linear-gradient(135deg, #0a0a0f 0%, #1a1a2e 100%)`,
      }}
    >
      {/* Ambient background */}
      <div
        style={{
          position: 'absolute',
          width: '100%',
          height: '100%',
          background: `
            radial-gradient(circle at 30% 50%, ${accentColor}22 0%, transparent 50%),
            radial-gradient(circle at 70% 50%, ${accentColor}11 0%, transparent 50%)
          `,
        }}
      />

      {/* Main content */}
      <div
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '90%',
          height: '80%',
          display: 'flex',
          alignItems: 'center',
          gap: '60px',
        }}
      >
        {/* Product image */}
        <div
          style={{
            flex: 1,
            position: 'relative',
            transform: `translateY(${productY}px) rotate(${productRotation}deg) scale(${productScale})`,
          }}
        >
          <img
            src={productImageUrl}
            alt={featureName}
            style={{
              width: '100%',
              height: 'auto',
              maxHeight: '500px',
              objectFit: 'contain',
              filter: `drop-shadow(0 20px 60px ${accentColor}44)`,
            }}
          />
          
          {/* Glow effect */}
          <div
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: '80%',
              height: '80%',
              background: `radial-gradient(circle, ${accentColor}33 0%, transparent 70%)`,
              filter: 'blur(40px)',
              zIndex: -1,
              opacity: glowIntensity,
            }}
          />
        </div>

        {/* Feature details */}
        <div
          style={{
            flex: 1,
            opacity: textOpacity,
            transform: `translateX(${textX}px)`,
          }}
        >
          {/* Feature name */}
          <h2
            style={{
              fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif',
              fontSize: '48px',
              fontWeight: 700,
              color: '#ffffff',
              margin: '0 0 16px 0',
              letterSpacing: '-1px',
              textShadow: `0 0 40px ${accentColor}66`,
            }}
          >
            {featureName}
          </h2>

          {/* Feature description */}
          <p
            style={{
              fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif',
              fontSize: '20px',
              fontWeight: 300,
              color: 'rgba(255, 255, 255, 0.8)',
              margin: '0 0 32px 0',
              lineHeight: 1.6,
            }}
          >
            {featureDescription}
          </p>

          {/* Highlight points */}
          {highlightPoints.length > 0 && (
            <div
              style={{
                opacity: pointsOpacity,
              }}
            >
              {highlightPoints.map((point, index) => (
                <div
                  key={index}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    marginBottom: '16px',
                  }}
                >
                  <div
                    style={{
                      width: '8px',
                      height: '8px',
                      background: accentColor,
                      borderRadius: '50%',
                      marginRight: '16px',
                      transform: `scale(${pulseScale})`,
                    }}
                  />
                  <span
                    style={{
                      fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif',
                      fontSize: '16px',
                      color: 'rgba(255, 255, 255, 0.9)',
                    }}
                  >
                    {point}
                  </span>
                </div>
              ))}
            </div>
          )}

          {/* CTA button */}
          <div
            style={{
              marginTop: '32px',
              display: 'inline-block',
              padding: '16px 32px',
              background: accentColor,
              borderRadius: '8px',
              fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif',
              fontSize: '18px',
              fontWeight: 600,
              color: '#ffffff',
              opacity: pointsOpacity,
            }}
          >
            Learn More
          </div>
        </div>
      </div>

      {/* Floating particles */}
      {Array.from({ length: 20 }).map((_, i) => {
        const angle = (i / 20) * Math.PI * 2;
        const radius = 300 + Math.sin(frame * 0.03 + i * 0.5) * 50;
        const x = Math.cos(angle) * radius;
        const y = Math.sin(angle) * radius;
        const opacity = Math.sin(frame * 0.02 + i * 0.3) * 0.3 + 0.2;
        
        return (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: '50%',
              top: '50%',
              width: '3px',
              height: '3px',
              background: accentColor,
              borderRadius: '50%',
              transform: `translate(${x}px, ${y}px)`,
              opacity,
              filter: 'blur(1px)',
            }}
          />
        );
      })}

      {/* Accent line */}
      <div
        style={{
          position: 'absolute',
          bottom: '100px',
          left: '10%',
          width: `${80 * glowIntensity}%`,
          height: '2px',
          background: `linear-gradient(90deg, ${accentColor} 0%, transparent 100%)`,
        }}
      />
    </AbsoluteFill>
  );
};

export default FeatureHighlightScene;