import React from 'react';
import {
  AbsoluteFill,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
  Sequence,
  spring,
} from 'remotion';
import { z } from 'zod';
import { AdvancedParticleSystem } from '../components/remotion/AdvancedParticleSystem';

export const chatGPTCinematicLaunchSchema = z.object({
  // Add any configurable props here
});

type Props = z.infer<typeof chatGPTCinematicLaunchSchema>;

// Scene 1: Complete darkness to particle network (0-3s)
const Scene1Genesis: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Fade from complete darkness
  const darknessOpacity = interpolate(frame, [0, 30], [1, 0], {
    easing: (t) => t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2,
    extrapolateRight: 'clamp',
  });

  // Scene fade out for transition
  const sceneFadeOut = interpolate(frame, [60, 90], [1, 0], {
    easing: (t) => t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2,
    extrapolateRight: 'clamp',
  });

  // Central glow appears
  const glowOpacity = interpolate(frame, [15, 45], [0, 1], {
    easing: (t) => t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2,
    extrapolateRight: 'clamp',
  });

  const glowScale = interpolate(frame, [15, 90], [0, 1], {
    easing: (t) => t === 1 ? 1 : 1 - Math.pow(2, -10 * t),
    extrapolateRight: 'clamp',
  });

  // Text animation
  const textOpacity = interpolate(frame, [30, 60, 75], [0, 1, 0], {
    easing: (t) => t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2,
    extrapolateRight: 'clamp',
  });

  const textY = interpolate(frame, [30, 60], [30, 0], {
    easing: (t) => --t * t * t + 1,
    extrapolateRight: 'clamp',
  });

  // Camera push
  const cameraScale = interpolate(frame, [0, 90], [1, 1.15], {
    easing: (t) => t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2,
    extrapolateRight: 'clamp',
  });

  return (
    <AbsoluteFill
      style={{
        background: '#000000',
        transform: `scale(${cameraScale})`,
        opacity: sceneFadeOut,
      }}
    >
      {/* Complete darkness overlay */}
      <AbsoluteFill
        style={{
          backgroundColor: '#000000',
          opacity: darknessOpacity,
        }}
      />

      {/* Central glow */}
      <div
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '300px',
          height: '300px',
          background: 'radial-gradient(circle, rgba(16, 163, 127, 0.4) 0%, transparent 70%)',
          borderRadius: '50%',
          opacity: glowOpacity,
          scale: glowScale,
          filter: 'blur(40px)',
        }}
      />

      {/* Particle network */}
      <div style={{ opacity: glowOpacity }}>
        <AdvancedParticleSystem
          count={80}
          behavior="network"
          color="#10a37f"
          connections={true}
        />
      </div>

      {/* Text */}
      <div
        style={{
          position: 'absolute',
          bottom: '20%',
          left: '50%',
          transform: `translateX(-50%) translateY(${textY}px)`,
          textAlign: 'center',
          opacity: textOpacity,
        }}
      >
        <p
          style={{
            fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "SF Pro Display", sans-serif',
            fontSize: '48px',
            fontWeight: 300,
            color: '#ffffff',
            margin: 0,
            letterSpacing: '0.5px',
            lineHeight: 1.4,
            textShadow: '0 2px 20px rgba(0, 0, 0, 0.5)',
          }}
        >
          Every breakthrough begins
          <br />
          with a question.
        </p>
      </div>
    </AbsoluteFill>
  );
};

// Scene 2: Creation sequence (3-7s)
const Scene2Creation: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Scene fade in/out
  const sceneFadeIn = interpolate(frame, [0, 20], [0, 1], {
    easing: (t) => t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2,
    extrapolateRight: 'clamp',
  });

  const sceneFadeOut = interpolate(frame, [100, 120], [1, 0], {
    easing: (t) => t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2,
    extrapolateRight: 'clamp',
  });

  const sceneOpacity = sceneFadeIn * sceneFadeOut;

  // Creation elements
  const creationElements = [
    { label: 'software', delay: 0 },
    { label: 'research', delay: 15 },
    { label: 'ideas', delay: 30 },
    { label: 'knowledge', delay: 45 },
  ];

  // Text animations
  const text1Opacity = interpolate(frame, [20, 50, 65], [0, 1, 0], {
    easing: (t) => t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2,
    extrapolateRight: 'clamp',
  });

  const text2Opacity = interpolate(frame, [65, 95], [0, 1], {
    easing: (t) => t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2,
    extrapolateRight: 'clamp',
  });

  return (
    <AbsoluteFill
      style={{
        background: 'radial-gradient(circle at center, #0a1a0f 0%, #000000 80%)',
        opacity: sceneOpacity,
      }}
    >
      {/* Background particles */}
      <AdvancedParticleSystem count={60} behavior="flow" color="#10a37f" />

      {/* Creation elements */}
      <div
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '100%',
          height: '100%',
        }}
      >
        {creationElements.map((element, index) => {
          const elementFrame = frame - element.delay;
          const opacity = interpolate(
            elementFrame,
            [0, 20, 80, 100],
            [0, 1, 1, 0],
            {
              easing: (t) => t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2,
              extrapolateRight: 'clamp',
            }
          );

          const scale = interpolate(elementFrame, [0, 30], [0.5, 1], {
            easing: (t) => {
              const c1 = 1.70158;
              const c3 = c1 + 1;
              return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2);
            },
            extrapolateRight: 'clamp',
          });

          const angle = (index / creationElements.length) * Math.PI * 2;
          const radius = 200;
          const x = Math.cos(angle) * radius;
          const y = Math.sin(angle) * radius;

          return (
            <div
              key={index}
              style={{
                position: 'absolute',
                left: '50%',
                top: '50%',
                transform: `translate(${x}px, ${y}px) translate(-50%, -50%) scale(${scale})`,
                textAlign: 'center',
                opacity,
              }}
            >
              <div
                style={{
                  width: '100px',
                  height: '100px',
                  borderRadius: '20px',
                  background: 'rgba(16, 163, 127, 0.15)',
                  border: '1px solid rgba(16, 163, 127, 0.3)',
                  backdropFilter: 'blur(20px)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '16px',
                  boxShadow: '0 8px 32px rgba(16, 163, 127, 0.2)',
                }}
              >
                <span
                  style={{
                    fontFamily: 'Inter, sans-serif',
                    fontSize: '24px',
                    fontWeight: 600,
                    color: '#10a37f',
                  }}
                >
                  {element.label[0].toUpperCase()}
                </span>
              </div>
              <p
                style={{
                  fontFamily: 'Inter, sans-serif',
                  fontSize: '14px',
                  fontWeight: 500,
                  color: '#ffffff',
                  margin: 0,
                  textTransform: 'uppercase',
                  letterSpacing: '2px',
                }}
              >
                {element.label}
              </p>
            </div>
          );
        })}

        {/* Central AI core */}
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '80px',
            height: '80px',
            background: '#10a37f',
            borderRadius: '50%',
            boxShadow: '0 0 60px rgba(16, 163, 127, 0.6)',
          }}
        />
      </div>

      {/* Text */}
      <div
        style={{
          position: 'absolute',
          bottom: '20%',
          left: '50%',
          transform: 'translateX(-50%)',
          textAlign: 'center',
        }}
      >
        <p
          style={{
            fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "SF Pro Display", sans-serif',
            fontSize: '52px',
            fontWeight: 300,
            color: '#ffffff',
            margin: 0,
            letterSpacing: '0.5px',
            opacity: text1Opacity,
          }}
        >
          From curiosity...
        </p>
        <p
          style={{
            fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "SF Pro Display", sans-serif',
            fontSize: '52px',
            fontWeight: 300,
            color: '#ffffff',
            margin: '20px 0 0 0',
            letterSpacing: '0.5px',
            opacity: text2Opacity,
          }}
        >
          ...to creation.
        </p>
      </div>
    </AbsoluteFill>
  );
};

// Scene 3: Acceleration sequence (7-11s)
const Scene3Acceleration: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Scene fade in/out
  const sceneFadeIn = interpolate(frame, [0, 20], [0, 1], {
    easing: (t) => t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2,
    extrapolateRight: 'clamp',
  });

  const sceneFadeOut = interpolate(frame, [100, 120], [1, 0], {
    easing: (t) => t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2,
    extrapolateRight: 'clamp',
  });

  const sceneOpacity = sceneFadeIn * sceneFadeOut;

  // Acceleration elements
  const capabilities = [
    'coding',
    'writing',
    'learning',
    'building',
    'designing',
    'solving',
  ];

  // Camera movement
  const cameraRotate = interpolate(frame, [0, 130], [0, 5], {
    easing: (t) => t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2,
    extrapolateRight: 'clamp',
  });

  // Text animation
  const textOpacity = interpolate(frame, [30, 60], [0, 1], {
    easing: (t) => t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2,
    extrapolateRight: 'clamp',
  });

  return (
    <AbsoluteFill
      style={{
        background: 'radial-gradient(circle at center, #0d1a15 0%, #000000 75%)',
        opacity: sceneOpacity,
        perspective: '1000px',
      }}
    >
      {/* Dynamic background */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          transform: `rotateY(${cameraRotate}deg)`,
        }}
      >
        <AdvancedParticleSystem count={100} behavior="orbit" color="#10a37f" />
      </div>

      {/* Capability cards */}
      <div
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '100%',
          height: '100%',
        }}
      >
        {capabilities.map((capability, index) => {
          const delay = index * 12;
          const cardFrame = frame - delay;
          const opacity = interpolate(cardFrame, [0, 15, 45, 60], [0, 1, 1, 0], {
            easing: (t) => t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2,
            extrapolateRight: 'clamp',
          });

          const scale = interpolate(cardFrame, [0, 20], [0.8, 1], {
            easing: (t) => {
              const c1 = 1.70158;
              const c3 = c1 + 1;
              return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2);
            },
            extrapolateRight: 'clamp',
          });

          const row = Math.floor(index / 3);
          const col = index % 3;
          const x = (col - 1) * 180;
          const y = (row - 0.5) * 120;

          return (
            <div
              key={index}
              style={{
                position: 'absolute',
                left: '50%',
                top: '50%',
                transform: `translate(${x}px, ${y}px) translate(-50%, -50%) scale(${scale})`,
                width: '160px',
                height: '100px',
                borderRadius: '16px',
                background: 'rgba(16, 163, 127, 0.1)',
                border: '1px solid rgba(16, 163, 127, 0.25)',
                backdropFilter: 'blur(30px)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                opacity,
                boxShadow: '0 10px 40px rgba(16, 163, 127, 0.15)',
              }}
            >
              <span
                style={{
                  fontFamily: 'Inter, sans-serif',
                  fontSize: '18px',
                  fontWeight: 600,
                  color: '#ffffff',
                  textTransform: 'uppercase',
                  letterSpacing: '1px',
                }}
              >
                {capability}
              </span>
            </div>
          );
        })}
      </div>

      {/* Text */}
      <div
        style={{
          position: 'absolute',
          bottom: '15%',
          left: '50%',
          transform: 'translateX(-50%)',
          textAlign: 'center',
          opacity: textOpacity,
        }}
      >
        <p
          style={{
            fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "SF Pro Display", sans-serif',
            fontSize: '56px',
            fontWeight: 300,
            color: '#ffffff',
            margin: 0,
            letterSpacing: '0.5px',
          }}
        >
          Millions create with ChatGPT.
        </p>
      </div>
    </AbsoluteFill>
  );
};

// Scene 4: Logo formation (11-13s)
const Scene4LogoFormation: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Scene fade in/out
  const sceneFadeIn = interpolate(frame, [0, 20], [0, 1], {
    easing: (t) => t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2,
    extrapolateRight: 'clamp',
  });

  const sceneFadeOut = interpolate(frame, [40, 60], [1, 0], {
    easing: (t) => t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2,
    extrapolateRight: 'clamp',
  });

  const sceneOpacity = sceneFadeIn * sceneFadeOut;

  // Energy collapse
  const collapseProgress = interpolate(frame, [0, 45], [0, 1], {
    easing: (t) => t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2,
    extrapolateRight: 'clamp',
  });

  // Camera orbit
  const cameraAngle = interpolate(frame, [0, 60], [0, 30], {
    easing: (t) => t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2,
    extrapolateRight: 'clamp',
  });

  return (
    <AbsoluteFill
      style={{
        background: 'radial-gradient(circle at center, #0c1a12 0%, #000000 85%)',
        opacity: sceneOpacity,
        perspective: '1000px',
      }}
    >
      {/* Converging particles */}
      <div
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
        }}
      >
        <AdvancedParticleSystem
          count={120}
          behavior="converge"
          color="#10a37f"
        />
      </div>

      {/* Energy vortex */}
      <div
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: `translate(-50%, -50%) rotateY(${cameraAngle}deg)`,
        }}
      >
        {Array.from({ length: 8 }, (_, i) => {
          const ringScale = interpolate(frame, [i * 5, i * 5 + 30], [0, 2], {
            easing: (t) => t === 1 ? 1 : 1 - Math.pow(2, -10 * t),
            extrapolateRight: 'clamp',
          });
          const ringOpacity = interpolate(frame, [i * 5, i * 5 + 30], [0.6, 0], {
            easing: (t) => t === 1 ? 1 : 1 - Math.pow(2, -10 * t),
            extrapolateRight: 'clamp',
          });

          return (
            <div
              key={i}
              style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                width: '50px',
                height: '50px',
                border: '2px solid #10a37f',
                borderRadius: '50%',
                opacity: ringOpacity,
                scale: ringScale,
                boxShadow: '0 0 20px rgba(16, 163, 127, 0.5)',
              }}
            />
          );
        })}
      </div>

      {/* Forming logo outline */}
      <div
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '150px',
          height: '150px',
          border: '3px solid rgba(16, 163, 127, 0.5)',
          borderRadius: '30px',
          opacity: collapseProgress,
          boxShadow: '0 0 40px rgba(16, 163, 127, 0.4)',
        }}
      />
    </AbsoluteFill>
  );
};

// Scene 5: Hero reveal (13-15s)
const Scene5HeroReveal: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Scene fade
  const sceneOpacity = interpolate(frame, [0, 20], [0, 1], {
    easing: (t) => t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2,
    extrapolateRight: 'clamp',
  });

  // Logo reveal
  const logoScale = spring({
    frame,
    fps,
    config: {
      damping: 15,
      stiffness: 100,
    },
  });

  const logoOpacity = interpolate(frame, [15, 45], [0, 1], {
    easing: (t) => t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2,
    extrapolateRight: 'clamp',
  });

  // Glow effect
  const glowIntensity = interpolate(frame, [20, 50], [0, 1], {
    easing: (t) => t === 1 ? 1 : 1 - Math.pow(2, -10 * t),
    extrapolateRight: 'clamp',
  });

  // Text animations
  const brandTextOpacity = interpolate(frame, [30, 60], [0, 1], {
    easing: (t) => t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2,
    extrapolateRight: 'clamp',
  });

  const taglineOpacity = interpolate(frame, [60, 90], [0, 1], {
    easing: (t) => t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2,
    extrapolateRight: 'clamp',
  });

  const fadeToBlack = interpolate(frame, [120, 150], [0, 1], {
    easing: (t) => t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2,
    extrapolateRight: 'clamp',
  });

  return (
    <AbsoluteFill
      style={{
        background: 'radial-gradient(circle at center, #0a1a0f 0%, #000000 90%)',
        opacity: sceneOpacity,
      }}
    >
      {/* Background ambient glow */}
      <div
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '600px',
          height: '600px',
          background: 'radial-gradient(circle, rgba(16, 163, 127, 0.15) 0%, transparent 70%)',
          borderRadius: '50%',
          opacity: glowIntensity,
          filter: 'blur(60px)',
        }}
      />

      {/* ChatGPT Logo */}
      <div
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%) scale(${logoScale})',
          opacity: logoOpacity,
        }}
      >
        {/* Stylized logo representation */}
        <div
          style={{
            width: '180px',
            height: '180px',
            background: '#10a37f',
            borderRadius: '36px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: `0 0 ${60 * glowIntensity}px rgba(16, 163, 127, ${0.6 * glowIntensity})`,
          }}
        >
          <span
            style={{
              fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif',
              fontSize: '72px',
              fontWeight: 700,
              color: '#ffffff',
            }}
          >
            AI
          </span>
        </div>
      </div>

      {/* Brand text */}
      <div
        style={{
          position: 'absolute',
          top: '65%',
          left: '50%',
          transform: 'translateX(-50%)',
          textAlign: 'center',
          opacity: brandTextOpacity,
        }}
      >
        <p
          style={{
            fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "SF Pro Display", sans-serif',
            fontSize: '64px',
            fontWeight: 600,
            color: '#ffffff',
            margin: 0,
            letterSpacing: '1px',
          }}
        >
          ChatGPT
        </p>
      </div>

      {/* Tagline */}
      <div
        style={{
          position: 'absolute',
          bottom: '20%',
          left: '50%',
          transform: 'translateX(-50%)',
          textAlign: 'center',
          opacity: taglineOpacity,
        }}
      >
        <p
          style={{
            fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "SF Pro Display", sans-serif',
            fontSize: '32px',
            fontWeight: 300,
            color: '#ffffff',
            margin: 0,
            letterSpacing: '2px',
            opacity: 0.9,
          }}
        >
          Amplify Human Potential.
        </p>
      </div>

      {/* Fade to black */}
      <AbsoluteFill
        style={{
          backgroundColor: '#000000',
          opacity: fadeToBlack,
        }}
      />
    </AbsoluteFill>
  );
};

// Main component
export const ChatGPTCinematicLaunch: React.FC<Props> = () => {
  const { fps } = useVideoConfig();

  return (
    <AbsoluteFill style={{ background: '#000000' }}>
      {/* Scene 1: Genesis (0-3s) */}
      <Sequence from={0} durationInFrames={90}>
        <Scene1Genesis />
      </Sequence>

      {/* Scene 2: Creation (3-7s) */}
      <Sequence from={90} durationInFrames={120}>
        <Scene2Creation />
      </Sequence>

      {/* Scene 3: Acceleration (7-11s) */}
      <Sequence from={210} durationInFrames={120}>
        <Scene3Acceleration />
      </Sequence>

      {/* Scene 4: Logo Formation (11-13s) */}
      <Sequence from={330} durationInFrames={60}>
        <Scene4LogoFormation />
      </Sequence>

      {/* Scene 5: Hero Reveal (13-15s) */}
      <Sequence from={390} durationInFrames={60}>
        <Scene5HeroReveal />
      </Sequence>
    </AbsoluteFill>
  );
};