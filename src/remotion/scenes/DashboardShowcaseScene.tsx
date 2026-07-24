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
export const dashboardShowcaseSceneSchema = z.object({
  screenshotUrl: z.string(),
  title: z.string(),
  description: z.string().optional(),
  metrics: z.array(z.object({
    label: z.string(),
    value: z.string(),
    change: z.string(),
  })).optional(),
  duration: z.number().default(6),
});

type Props = z.infer<typeof dashboardShowcaseSceneSchema>;

const DashboardShowcaseScene: React.FC<Props> = ({
  screenshotUrl,
  title,
  description = '',
  metrics = [],
  duration = 6,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const totalFrames = duration * fps;

  // Dashboard container animation
  const containerScale = spring({
    frame,
    fps,
    config: {
      damping: 200,
      stiffness: 80,
    },
  });

  const containerOpacity = spring({
    frame,
    fps,
    config: {
      damping: 200,
      stiffness: 100,
    },
  });

  const containerY = interpolate(frame, [0, totalFrames * 0.2], [100, 0], {
    extrapolateRight: 'clamp',
  });

  // Screenshot pan animation
  const panX = interpolate(frame, [0, totalFrames], [0, -100], {
    extrapolateRight: 'clamp',
  });

  // Text animation
  const textOpacity = spring({
    frame: frame - totalFrames * 0.15,
    fps,
    config: {
      damping: 200,
      stiffness: 100,
    },
  });

  // Metrics animation
  const metricsOpacity = spring({
    frame: frame - totalFrames * 0.3,
    fps,
    config: {
      damping: 200,
      stiffness: 100,
    },
  });

  // Highlight effect
  const highlightProgress = interpolate(frame, [totalFrames * 0.5, totalFrames * 0.8], [0, 1], {
    extrapolateRight: 'clamp',
  });

  return (
    <AbsoluteFill
      style={{
        background: 'linear-gradient(135deg, #0f0f1a 0%, #1a1a2e 100%)',
      }}
    >
      {/* Background grid */}
      <div
        style={{
          position: 'absolute',
          width: '100%',
          height: '100%',
          backgroundImage: `
            linear-gradient(rgba(100, 150, 255, 0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(100, 150, 255, 0.03) 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px',
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
        }}
      >
        {/* Dashboard container */}
        <div
          style={{
            position: 'relative',
            background: 'rgba(255, 255, 255, 0.05)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: '16px',
            padding: '32px',
            backdropFilter: 'blur(10px)',
            opacity: containerOpacity,
            transform: `translateY(${containerY}px) scale(${containerScale})`,
            overflow: 'hidden',
          }}
        >
          {/* Window header */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              marginBottom: '24px',
              paddingBottom: '16px',
              borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
            }}
          >
            <div style={{ display: 'flex', gap: '8px' }}>
              <div
                style={{
                  width: '12px',
                  height: '12px',
                  borderRadius: '50%',
                  background: '#ff5f57',
                }}
              />
              <div
                style={{
                  width: '12px',
                  height: '12px',
                  borderRadius: '50%',
                  background: '#febc2e',
                }}
              />
              <div
                style={{
                  width: '12px',
                  height: '12px',
                  borderRadius: '50%',
                  background: '#28c840',
                }}
              />
            </div>
            <div
              style={{
                marginLeft: '16px',
                fontFamily: 'monospace',
                fontSize: '14px',
                color: 'rgba(255, 255, 255, 0.6)',
              }}
            >
              {title}
            </div>
          </div>

          {/* Screenshot with pan effect */}
          <div
            style={{
              position: 'relative',
              height: '400px',
              borderRadius: '8px',
              overflow: 'hidden',
              marginBottom: '24px',
            }}
          >
            <img
              src={screenshotUrl}
              alt={title}
              style={{
                width: '120%',
                height: '100%',
                objectFit: 'cover',
                transform: `translateX(${panX}px)`,
              }}
            />
            
            {/* Highlight overlay */}
            <div
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: `linear-gradient(90deg, transparent 0%, rgba(100, 200, 255, ${0.2 * highlightProgress}) 50%, transparent 100%)`,
                pointerEvents: 'none',
              }}
            />
          </div>

          {/* Description */}
          {description && (
            <p
              style={{
                fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif',
                fontSize: '18px',
                color: 'rgba(255, 255, 255, 0.8)',
                margin: '0 0 24px 0',
                opacity: textOpacity,
              }}
            >
              {description}
            </p>
          )}

          {/* Metrics */}
          {metrics.length > 0 && (
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: `repeat(${metrics.length}, 1fr)`,
                gap: '16px',
                opacity: metricsOpacity,
              }}
            >
              {metrics.map((metric, index) => (
                <div
                  key={index}
                  style={{
                    background: 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: '8px',
                    padding: '16px',
                  }}
                >
                  <div
                    style={{
                      fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif',
                      fontSize: '14px',
                      color: 'rgba(255, 255, 255, 0.6)',
                      marginBottom: '8px',
                    }}
                  >
                    {metric.label}
                  </div>
                  <div
                    style={{
                      fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif',
                      fontSize: '24px',
                      fontWeight: 700,
                      color: '#ffffff',
                      marginBottom: '4px',
                    }}
                  >
                    {metric.value}
                  </div>
                  <div
                    style={{
                      fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif',
                      fontSize: '14px',
                      color: metric.change.startsWith('+') ? '#64ffda' : '#ff6b6b',
                    }}
                  >
                    {metric.change}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Floating elements */}
      {Array.from({ length: 5 }).map((_, i) => (
        <div
          key={i}
          style={{
            position: 'absolute',
            left: `${20 + i * 20}%`,
            top: `${30 + Math.sin(frame * 0.02 + i) * 10}%`,
            width: '4px',
            height: '4px',
            background: 'rgba(100, 200, 255, 0.5)',
            borderRadius: '50%',
            filter: 'blur(1px)',
          }}
        />
      ))}
    </AbsoluteFill>
  );
};

export default DashboardShowcaseScene;