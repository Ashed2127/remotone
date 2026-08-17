import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, Sequence } from 'remotion';
import { z } from 'zod';

// Schema for the professional tutorial video
export const professionalTutorialSchema = z.object({
  productName: z.string().default('EcoBottle Pro'),
  productDescription: z.string().default('A sustainable water bottle made from recycled materials'),
  brandColor: z.string().default('#667eea'),
  secondaryColor: z.string().default('#764ba2'),
  accentColor: z.string().default('#00d4ff'),
});

type Props = z.infer<typeof professionalTutorialSchema>;

const ProfessionalIntegrationTutorial: React.FC<Props> = ({
  productName = 'EcoBottle Pro',
  productDescription = 'A sustainable water bottle made from recycled materials',
  brandColor = '#667eea',
  secondaryColor = '#764ba2',
  accentColor = '#00d4ff',
}) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const totalDuration = durationInFrames / fps; // 15 seconds

  // Professional step timings
  const step1Duration = 3; // Cinematic intro
  const step2Duration = 3; // Setup with motion
  const step3Duration = 3; // Integration with effects
  const step4Duration = 3; // Generation with particles
  const step5Duration = 3; // Grand finale

  const step1End = step1Duration * fps;
  const step2End = step1End + step2Duration * fps;
  const step3End = step2End + step3Duration * fps;
  const step4End = step3End + step4Duration * fps;
  const step5End = step4End + step5Duration * fps;

  // Advanced easing functions
  const easeOutExpo = (t: number) => t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
  const easeInOutCubic = (t: number) => t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
  const easeOutBack = (t: number) => {
    const c1 = 1.70158;
    const c3 = c1 + 1;
    return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2);
  };

  // Advanced animation helpers
  const advancedFadeIn = (start: number, end: number) => 
    easeOutExpo(interpolate(frame, [start, end], [0, 1], { extrapolateRight: 'clamp', extrapolateLeft: 'clamp' }));
  
  const advancedFadeOut = (start: number, end: number) => 
    easeOutExpo(interpolate(frame, [start, end], [1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }));

  const advancedSlideUp = (start: number, end: number) => 
    easeOutBack(interpolate(frame, [start, end], [100, 0], { extrapolateRight: 'clamp', extrapolateLeft: 'clamp' }));

  const advancedScale = (start: number, end: number) => 
    easeInOutCubic(interpolate(frame, [start, end], [0.5, 1], { extrapolateRight: 'clamp', extrapolateLeft: 'clamp' }));

  const rotate3D = (start: number, end: number) => 
    easeInOutCubic(interpolate(frame, [start, end], [180, 0], { extrapolateRight: 'clamp', extrapolateLeft: 'clamp' }));

  // Particle system simulation
  const particles = Array.from({ length: 20 }, (_, i) => ({
    x: Math.sin(frame / 30 + i) * 200,
    y: Math.cos(frame / 20 + i) * 150,
    size: 2 + Math.sin(frame / 10 + i) * 2,
    opacity: 0.3 + Math.sin(frame / 15 + i) * 0.2,
  }));

  // Glitch effect
  const glitchOffset = () => {
    if (Math.random() > 0.95) {
      return (Math.random() - 0.5) * 10;
    }
    return 0;
  };

  return (
    <AbsoluteFill style={{ background: '#0a0a1a' }}>
      {/* Dynamic background with animated gradient */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: `radial-gradient(ellipse at ${50 + Math.sin(frame / 60) * 20}% ${50 + Math.cos(frame / 45) * 20}%, ${brandColor}22 0%, transparent 50%),
                      radial-gradient(ellipse at ${50 + Math.cos(frame / 50) * 25}% ${50 + Math.sin(frame / 55) * 25}%, ${secondaryColor}22 0%, transparent 50%)`,
          animation: 'pulse 4s ease-in-out infinite',
        }}
      />

      {/* Animated particles */}
      {particles.map((particle, i) => (
        <div
          key={i}
          style={{
            position: 'absolute',
            left: '50%',
            top: '50%',
            width: particle.size,
            height: particle.size,
            borderRadius: '50%',
            background: accentColor,
            opacity: particle.opacity,
            transform: `translate(${particle.x}px, ${particle.y}px)`,
            filter: 'blur(1px)',
          }}
        />
      ))}

      {/* Animated grid lines */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: `
            linear-gradient(rgba(102, 126, 234, 0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(102, 126, 234, 0.03) 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px',
          transform: `perspective(1000px) rotateX(${Math.sin(frame / 120) * 5}deg)`,
          opacity: 0.5,
        }}
      />

      {/* Cinematic intro */}
      <Sequence from={0} durationInFrames={step1End}>
        <div
          style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            opacity: advancedFadeOut(step1End - 45, step1End),
            transform: `scale(${advancedScale(0, 45)})`,
          }}
        >
          {/* Dramatic text reveal */}
          <h1
            style={{
              fontSize: 96,
              fontWeight: 900,
              color: 'white',
              margin: 0,
              textAlign: 'center',
              letterSpacing: -4,
              textTransform: 'uppercase',
              background: `linear-gradient(135deg, ${brandColor}, ${accentColor}, ${secondaryColor})`,
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              filter: 'drop-shadow(0 0 30px rgba(102, 126, 234, 0.5))',
              transform: `translateX(${glitchOffset()}px)`,
            }}
          >
            Remotone
          </h1>
          
          <div
            style={{
              height: 4,
              width: 200,
              background: `linear-gradient(90deg, ${brandColor}, ${accentColor})`,
              margin: '30px auto',
              borderRadius: 2,
              transform: `scaleX(${advancedFadeIn(30, 60)})`,
              boxShadow: `0 0 20px ${brandColor}`,
            }}
          />

          <p
            style={{
              fontSize: 32,
              color: 'rgba(255,255,255,0.9)',
              marginTop: 20,
              textAlign: 'center',
              fontWeight: 300,
              letterSpacing: 2,
              textTransform: 'uppercase',
              opacity: advancedFadeIn(45, 75),
            }}
          >
            AI Motion Design Engine
          </p>

          {/* Floating code elements */}
          <div
            style={{
              position: 'absolute',
              top: '20%',
              left: '10%',
              fontSize: 14,
              color: 'rgba(255,255,255,0.3)',
              fontFamily: 'monospace',
              opacity: advancedFadeIn(60, 90),
              transform: `translateY(${Math.sin(frame / 30) * 10}px)`,
            }}
          >
            {'import { createRemotoneAgent }'}
          </div>
          <div
            style={{
              position: 'absolute',
              bottom: '25%',
              right: '15%',
              fontSize: 14,
              color: 'rgba(255,255,255,0.3)',
              fontFamily: 'monospace',
              opacity: advancedFadeIn(75, 105),
              transform: `translateY(${Math.cos(frame / 25) * 10}px)`,
            }}
          >
            {'.generateProductVideo()'}
          </div>
        </div>
      </Sequence>

      {/* Step 2: Setup with dynamic motion */}
      <Sequence from={step1End} durationInFrames={step2Duration * fps}>
        <div
          style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            padding: 80,
            opacity: advancedFadeOut(step2End - 45, step2End),
            transform: `translateY(${advancedSlideUp(step1End, step1End + 30)}px)`,
          }}
        >
          {/* Floating code window */}
          <div
            style={{
              background: 'rgba(15, 15, 35, 0.95)',
              borderRadius: 20,
              padding: 50,
              maxWidth: 1000,
              width: '100%',
              border: `1px solid ${brandColor}44`,
              boxShadow: `0 25px 80px ${brandColor}33, inset 0 0 60px rgba(102, 126, 234, 0.1)`,
              transform: `perspective(1000px) rotateY(${Math.sin(frame / 60) * 3}deg)`,
              backdropFilter: 'blur(20px)',
            }}
          >
            {/* Window controls */}
            <div
              style={{
                display: 'flex',
                gap: 8,
                marginBottom: 30,
              }}
            >
              <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#ff5f57' }} />
              <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#ffbd2e' }} />
              <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#28c940' }} />
            </div>

            <div
              style={{
                color: '#666',
                fontSize: 14,
                marginBottom: 15,
                fontFamily: 'monospace',
                opacity: 0.7,
              }}
            >
              // Installation
            </div>
            <pre
              style={{
                color: '#ff79c6',
                fontSize: 22,
                margin: '0 0 30px 0',
                fontFamily: 'monospace',
                whiteSpace: 'pre-wrap',
                textShadow: '0 0 10px rgba(255, 121, 198, 0.3)',
              }}
            >
              {`$ npm install remotone-agent-sdk`}
            </pre>

            <div
              style={{
                color: '#666',
                fontSize: 14,
                marginBottom: 15,
                fontFamily: 'monospace',
                opacity: 0.7,
              }}
            >
              // Initialize
            </div>
            <pre
              style={{
                color: '#8be9fd',
                fontSize: 18,
                margin: 0,
                fontFamily: 'monospace',
                whiteSpace: 'pre-wrap',
                lineHeight: 1.6,
              }}
            >
              {`const agent = createRemotoneAgent({
  baseUrl: 'http://localhost:3000',
  timeout: 30000,
  maxRetries: 3
});`}
            </pre>
          </div>

          {/* Step indicator */}
          <div
            style={{
              marginTop: 40,
              display: 'flex',
              alignItems: 'center',
              gap: 15,
            }}
          >
            <div
              style={{
                width: 40,
                height: 40,
                borderRadius: '50%',
                background: `linear-gradient(135deg, ${brandColor}, ${secondaryColor})`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 20,
                fontWeight: 'bold',
                color: 'white',
                boxShadow: `0 0 20px ${brandColor}`,
              }}
            >
              2
            </div>
            <div
              style={{
                fontSize: 24,
                color: 'white',
                fontWeight: 600,
                letterSpacing: 1,
              }}
            >
              SETUP
            </div>
          </div>
        </div>
      </Sequence>

      {/* Step 3: Integration with effects */}
      <Sequence from={step2End} durationInFrames={step3Duration * fps}>
        <div
          style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            padding: 80,
            opacity: advancedFadeOut(step3End - 45, step3End),
            transform: `translateY(${advancedSlideUp(step2End, step2End + 30)}px)`,
          }}
        >
          {/* Advanced code window */}
          <div
            style={{
              background: 'rgba(15, 15, 35, 0.95)',
              borderRadius: 20,
              padding: 50,
              maxWidth: 1000,
              width: '100%',
              border: `1px solid ${accentColor}44`,
              boxShadow: `0 25px 80px ${accentColor}33, inset 0 0 60px rgba(0, 212, 255, 0.1)`,
              transform: `perspective(1000px) rotateX(${Math.sin(frame / 50) * 2}deg)`,
              backdropFilter: 'blur(20px)',
            }}
          >
            <div
              style={{
                color: '#666',
                fontSize: 14,
                marginBottom: 15,
                fontFamily: 'monospace',
                opacity: 0.7,
              }}
            >
              // Generate product video
            </div>
            <pre
              style={{
                color: '#50fa7b',
                fontSize: 17,
                margin: 0,
                fontFamily: 'monospace',
                whiteSpace: 'pre-wrap',
                lineHeight: 1.6,
              }}
            >
              {`const result = await agent.generateProductVideo(
  '${productName}',
  '${productDescription}',
  {
    targetAudience: 'Eco-conscious consumers',
    brandColors: ['#2E7D32', '#81C784'],
    duration: 30,
    style: 'professional'
  }
);`}
            </pre>

            {/* Syntax highlighting decorations */}
            <div
              style={{
                position: 'absolute',
                top: 20,
                right: 20,
                width: 60,
                height: 60,
                border: `2px solid ${accentColor}`,
                borderRadius: '50%',
                opacity: 0.3,
                transform: `rotate(${frame}deg)`,
              }}
            />
          </div>

          {/* Step indicator */}
          <div
            style={{
              marginTop: 40,
              display: 'flex',
              alignItems: 'center',
              gap: 15,
            }}
          >
            <div
              style={{
                width: 40,
                height: 40,
                borderRadius: '50%',
                background: `linear-gradient(135deg, ${accentColor}, ${brandColor})`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 20,
                fontWeight: 'bold',
                color: 'white',
                boxShadow: `0 0 20px ${accentColor}`,
              }}
            >
              3
            </div>
            <div
              style={{
                fontSize: 24,
                color: 'white',
                fontWeight: 600,
                letterSpacing: 1,
              }}
            >
              INTEGRATE
            </div>
          </div>
        </div>
      </Sequence>

      {/* Step 4: Generation with particles */}
      <Sequence from={step3End} durationInFrames={step4Duration * fps}>
        <div
          style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            padding: 80,
            opacity: advancedFadeOut(step4End - 45, step4End),
            transform: `translateY(${advancedSlideUp(step3End, step3End + 30)}px)`,
          }}
        >
          {/* Enhanced code window */}
          <div
            style={{
              background: 'rgba(15, 15, 35, 0.95)',
              borderRadius: 20,
              padding: 50,
              maxWidth: 1000,
              width: '100%',
              border: `1px solid ${secondaryColor}44`,
              boxShadow: `0 25px 80px ${secondaryColor}33, inset 0 0 60px rgba(118, 75, 162, 0.1)`,
              transform: `perspective(1000px) rotateY(${Math.cos(frame / 55) * 2}deg)`,
              backdropFilter: 'blur(20px)',
            }}
            >
            <div
              style={{
                color: '#666',
                fontSize: 14,
                marginBottom: 15,
                fontFamily: 'monospace',
                opacity: 0.7,
              }}
            >
              // Monitor progress
            </div>
            <pre
              style={{
                color: '#ffb86c',
                fontSize: 17,
                margin: 0,
                fontFamily: 'monospace',
                whiteSpace: 'pre-wrap',
                lineHeight: 1.6,
              }}
            >
              {`const status = await agent.waitForRender(
  result.renderJobId,
  {
    onProgress: (progress) => 
      console.log(\`Progress: \${progress}%\`)
  }
);

console.log('Video ready:', status.videoUrl);`}
            </pre>

            {/* Animated progress bar simulation */}
            <div
              style={{
                marginTop: 30,
                height: 6,
                background: 'rgba(255,255,255,0.1)',
                borderRadius: 3,
                overflow: 'hidden',
              }}
            >
              <div
                style={{
                  height: '100%',
                  width: `${((frame - step3End) / (step4Duration * fps)) * 100}%`,
                  background: `linear-gradient(90deg, ${brandColor}, ${accentColor})`,
                  borderRadius: 3,
                  boxShadow: `0 0 20px ${accentColor}`,
                }}
              />
            </div>
          </div>

          {/* Step indicator */}
          <div
            style={{
              marginTop: 40,
              display: 'flex',
              alignItems: 'center',
              gap: 15,
            }}
          >
            <div
              style={{
                width: 40,
                height: 40,
                borderRadius: '50%',
                background: `linear-gradient(135deg, ${secondaryColor}, ${accentColor})`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 20,
                fontWeight: 'bold',
                color: 'white',
                boxShadow: `0 0 20px ${secondaryColor}`,
              }}
            >
              4
            </div>
            <div
              style={{
                fontSize: 24,
                color: 'white',
                fontWeight: 600,
                letterSpacing: 1,
              }}
            >
              GENERATE
            </div>
          </div>
        </div>
      </Sequence>

      {/* Step 5: Grand finale */}
      <Sequence from={step4End} durationInFrames={step5Duration * fps}>
        <div
          style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            opacity: advancedFadeIn(step4End, step4End + 30),
            transform: `scale(${advancedScale(step4End, step4End + 30)})`,
          }}
        >
          {/* Dramatic product reveal */}
          <div
            style={{
              position: 'relative',
              marginBottom: 40,
            }}
          >
            {/* Glowing background */}
            <div
              style={{
                position: 'absolute',
                inset: -20,
                background: `radial-gradient(circle, ${brandColor}44 0%, transparent 70%)`,
                borderRadius: 30,
                filter: 'blur(40px)',
                animation: 'pulse 2s ease-in-out infinite',
              }}
            />
            
            {/* Video preview card */}
            <div
              style={{
                width: 400,
                height: 280,
                background: `linear-gradient(135deg, ${brandColor} 0%, ${secondaryColor} 100%)`,
                borderRadius: 20,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                position: 'relative',
                overflow: 'hidden',
                boxShadow: `0 30px 90px ${brandColor}44`,
                transform: `perspective(1000px) rotateY(${Math.sin(frame / 40) * 5}deg) rotateX(${Math.cos(frame / 35) * 3}deg)`,
              }}
            >
              {/* Play button */}
              <div
                style={{
                  width: 80,
                  height: 80,
                  borderRadius: '50%',
                  background: 'rgba(255,255,255,0.2)',
                  backdropFilter: 'blur(10px)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 32,
                  marginBottom: 20,
                  border: '2px solid rgba(255,255,255,0.3)',
                  boxShadow: '0 10px 40px rgba(0,0,0,0.3)',
                }}
              >
                ▶
              </div>
              
              <div
                style={{
                  color: 'white',
                  fontSize: 24,
                  fontWeight: 700,
                  textShadow: '0 2px 20px rgba(0,0,0,0.3)',
                }}
              >
                Video Ready!
              </div>

              {/* Animated shine effect */}
              <div
                style={{
                  position: 'absolute',
                  top: -50,
                  left: -50,
                  width: 100,
                  height: 200,
                  background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)',
                  transform: `rotate(45deg) translateX(${(frame - step4End) * 5}px)`,
                }}
              />
            </div>
          </div>
          
          {/* Product info */}
          <h2
            style={{
              fontSize: 56,
              fontWeight: 900,
              color: 'white',
              margin: '0 0 15px 0',
              textAlign: 'center',
              letterSpacing: -2,
              textTransform: 'uppercase',
              background: `linear-gradient(135deg, ${brandColor}, ${accentColor})`,
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            {productName}
          </h2>
          <p
            style={{
              fontSize: 20,
              color: 'rgba(255,255,255,0.7)',
              marginTop: 10,
              textAlign: 'center',
              maxWidth: 500,
              lineHeight: 1.5,
            }}
          >
            {productDescription}
          </p>
          
          {/* Feature badges */}
          <div
            style={{
              marginTop: 40,
              display: 'flex',
              gap: 15,
              flexWrap: 'wrap',
              justifyContent: 'center',
            }}
          >
            {[
              { label: '30s', color: brandColor },
              { label: '1080p', color: accentColor },
              { label: 'AI-POWERED', color: secondaryColor },
              { label: 'INSTANT', color: brandColor },
            ].map((badge, i) => (
              <div
                key={i}
                style={{
                  padding: '12px 24px',
                  background: `${badge.color}22`,
                  border: `1px solid ${badge.color}44`,
                  borderRadius: 25,
                  color: 'white',
                  fontSize: 14,
                  fontWeight: 600,
                  letterSpacing: 1,
                  backdropFilter: 'blur(10px)',
                  transform: `translateY(${Math.sin(frame / 20 + i) * 5}px)`,
                }}
              >
                {badge.label}
              </div>
            ))}
          </div>

          {/* Success message */}
          <div
            style={{
              marginTop: 50,
              fontSize: 28,
              color: 'white',
              fontWeight: 700,
              letterSpacing: 3,
              textTransform: 'uppercase',
              opacity: advancedFadeIn(step4End + 60, step4End + 90),
            }}
          >
            Integration Complete 🎉
          </div>
        </div>
      </Sequence>

      {/* Cinematic progress bar */}
      <div
        style={{
          position: 'absolute',
          bottom: 40,
          left: 40,
          right: 40,
          height: 3,
          background: 'rgba(255,255,255,0.1)',
          borderRadius: 2,
        }}
      >
        <div
          style={{
            height: '100%',
            width: `${(frame / durationInFrames) * 100}%`,
            background: `linear-gradient(90deg, ${brandColor}, ${accentColor}, ${secondaryColor})`,
            borderRadius: 2,
            boxShadow: `0 0 20px ${accentColor}`,
          }}
        />
      </div>

      {/* Professional time display */}
      <div
        style={{
          position: 'absolute',
          bottom: 60,
          right: 40,
          fontSize: 14,
          color: 'rgba(255,255,255,0.5)',
          fontFamily: 'monospace',
          letterSpacing: 2,
        }}
      >
        {String(Math.floor(frame / fps)).padStart(2, '0')}:{String(Math.floor((frame % fps) / fps * 60)).padStart(2, '0')} / {String(Math.floor(totalDuration)).padStart(2, '0')}:00
      </div>

      {/* Corner accents */}
      {[
        { top: 30, left: 30, width: 80, height: 80 },
        { top: 30, right: 30, width: 80, height: 80 },
        { bottom: 30, left: 30, width: 80, height: 80 },
        { bottom: 30, right: 30, width: 80, height: 80 },
      ].map((corner, i) => (
        <div
          key={i}
          style={{
            position: 'absolute',
            ...corner,
            border: `2px solid ${brandColor}33`,
            borderRadius: i % 2 === 0 ? '20px 0 0 0' : '0 20px 0 0',
            opacity: 0.5,
          }}
        />
      ))}
    </AbsoluteFill>
  );
};

export default ProfessionalIntegrationTutorial;