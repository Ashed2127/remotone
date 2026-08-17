import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, Sequence } from 'remotion';
import { z } from 'zod';

// Schema for the tutorial video
export const integrationTutorialSchema = z.object({
  productName: z.string().default('EcoBottle Pro'),
  productDescription: z.string().default('A sustainable water bottle made from recycled materials'),
  developerName: z.string().default('Developer'),
  brandColor: z.string().default('#667eea'),
  secondaryColor: z.string().default('#764ba2'),
  codeColor: z.string().default('#1e1e1e'),
  textColor: z.string().default('#ffffff'),
});

type Props = z.infer<typeof integrationTutorialSchema>;

const IntegrationTutorialVideo: React.FC<Props> = ({
  productName = 'EcoBottle Pro',
  productDescription = 'A sustainable water bottle made from recycled materials',
  developerName = 'Developer',
  brandColor = '#667eea',
  secondaryColor = '#764ba2',
  codeColor = '#1e1e1e',
  textColor = '#ffffff',
}) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const totalDuration = durationInFrames / fps; // 15 seconds

  // Step timings (15 seconds total)
  const step1Duration = 3; // Introduction
  const step2Duration = 3; // Setup
  const step3Duration = 3; // Integration
  const step4Duration = 3; // Generate Video
  const step5Duration = 3; // Final Result

  const step1End = step1Duration * fps;
  const step2End = step1End + step2Duration * fps;
  const step3End = step2End + step3Duration * fps;
  const step4End = step3End + step4Duration * fps;
  const step5End = step4End + step5Duration * fps;

  // Current step calculation
  let currentStep = 1;
  if (frame >= step1End) currentStep = 2;
  if (frame >= step2End) currentStep = 3;
  if (frame >= step3End) currentStep = 4;
  if (frame >= step4End) currentStep = 5;

  // Animation helpers
  const fadeIn = (start: number, end: number) => 
    interpolate(frame, [start, end], [0, 1], { extrapolateRight: 'clamp', extrapolateLeft: 'clamp' });
  
  const fadeOut = (start: number, end: number) => 
    interpolate(frame, [start, end], [1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

  const slideUp = (start: number, end: number) => 
    interpolate(frame, [start, end], [50, 0], { extrapolateRight: 'clamp', extrapolateLeft: 'clamp' });

  const scaleIn = (start: number, end: number) => 
    interpolate(frame, [start, end], [0.8, 1], { extrapolateRight: 'clamp', extrapolateLeft: 'clamp' });

  return (
    <AbsoluteFill style={{ background: '#0f0f23' }}>
      {/* Background gradient */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: `linear-gradient(135deg, ${brandColor}11 0%, ${secondaryColor}11 100%)`,
        }}
      />

      {/* Step indicator */}
      <div
        style={{
          position: 'absolute',
          top: 40,
          left: 40,
          display: 'flex',
          gap: 12,
          opacity: fadeIn(0, 30),
        }}
      >
        {[1, 2, 3, 4, 5].map((step) => (
          <div
            key={step}
            style={{
              width: step === currentStep ? 32 : 12,
              height: 12,
              borderRadius: 6,
              background: step === currentStep ? brandColor : 'rgba(255,255,255,0.3)',
              transition: 'all 0.3s ease',
            }}
          />
        ))}
      </div>

      {/* Step 1: Introduction */}
      <Sequence from={0} durationInFrames={step1End}>
        <div
          style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            opacity: fadeOut(step1End - 30, step1End),
            transform: `scale(${scaleIn(0, 30)})`,
          }}
        >
          <h1
            style={{
              fontSize: 72,
              fontWeight: 'bold',
              color: textColor,
              margin: 0,
              textAlign: 'center',
              textShadow: `0 4px 20px ${brandColor}44`,
            }}
          >
            Remotone Integration
          </h1>
          <p
            style={{
              fontSize: 28,
              color: 'rgba(255,255,255,0.8)',
              marginTop: 20,
              textAlign: 'center',
            }}
          >
            AI-Powered Motion Design Engine
          </p>
          <div
            style={{
              marginTop: 40,
              padding: '16px 32px',
              background: brandColor,
              borderRadius: 8,
              fontSize: 20,
              color: 'white',
              fontWeight: 600,
            }}
          >
            Step 1: Getting Started
          </div>
        </div>
      </Sequence>

      {/* Step 2: Setup */}
      <Sequence from={step1End} durationInFrames={step2Duration * fps}>
        <div
          style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            padding: 60,
            opacity: fadeOut(step2End - 30, step2End),
            transform: `translateY(${slideUp(step1End, step1End + 30)}px)`,
          }}
        >
          <div
            style={{
              background: codeColor,
              borderRadius: 16,
              padding: 40,
              maxWidth: 900,
              width: '100%',
              border: `2px solid ${brandColor}`,
              boxShadow: `0 20px 60px ${brandColor}33`,
            }}
          >
            <div
              style={{
                color: '#888',
                fontSize: 14,
                marginBottom: 20,
                fontFamily: 'monospace',
              }}
            >
              // Install the SDK
            </div>
            <pre
              style={{
                color: '#a5d6ff',
                fontSize: 20,
                margin: 0,
                fontFamily: 'monospace',
                whiteSpace: 'pre-wrap',
              }}
            >
              {`npm install remotone-agent-sdk`}
            </pre>
            <div
              style={{
                color: '#888',
                fontSize: 14,
                marginTop: 20,
                marginBottom: 20,
                fontFamily: 'monospace',
              }}
            >
              // Initialize the agent
            </div>
            <pre
              style={{
                color: '#a5d6ff',
                fontSize: 20,
                margin: 0,
                fontFamily: 'monospace',
                whiteSpace: 'pre-wrap',
              }}
            >
              {`import { createRemotoneAgent } from 'remotone-agent-sdk';

const agent = createRemotoneAgent({
  baseUrl: 'http://localhost:3000'
});`}
            </pre>
          </div>
          <div
            style={{
              marginTop: 30,
              fontSize: 24,
              color: textColor,
              fontWeight: 600,
            }}
          >
            Step 2: Easy Setup
          </div>
        </div>
      </Sequence>

      {/* Step 3: Integration */}
      <Sequence from={step2End} durationInFrames={step3Duration * fps}>
        <div
          style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            padding: 60,
            opacity: fadeOut(step3End - 30, step3End),
            transform: `translateY(${slideUp(step2End, step2End + 30)}px)`,
          }}
        >
          <div
            style={{
              background: codeColor,
              borderRadius: 16,
              padding: 40,
              maxWidth: 900,
              width: '100%',
              border: `2px solid ${secondaryColor}`,
              boxShadow: `0 20px 60px ${secondaryColor}33`,
            }}
          >
            <div
              style={{
                color: '#888',
                fontSize: 14,
                marginBottom: 20,
                fontFamily: 'monospace',
              }}
            >
              // Generate product video
            </div>
            <pre
              style={{
                color: '#a5d6ff',
                fontSize: 18,
                margin: 0,
                fontFamily: 'monospace',
                whiteSpace: 'pre-wrap',
              }}
            >
              {`const result = await agent.generateProductVideo(
  '${productName}',
  '${productDescription}',
  {
    targetAudience: 'Eco-conscious consumers',
    brandColors: ['#2E7D32', '#81C784'],
    duration: 30
  }
);`}
            </pre>
          </div>
          <div
            style={{
              marginTop: 30,
              fontSize: 24,
              color: textColor,
              fontWeight: 600,
            }}
          >
            Step 3: Simple Integration
          </div>
        </div>
      </Sequence>

      {/* Step 4: Generate Video */}
      <Sequence from={step3End} durationInFrames={step4Duration * fps}>
        <div
          style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            padding: 60,
            opacity: fadeOut(step4End - 30, step4End),
            transform: `translateY(${slideUp(step3End, step3End + 30)}px)`,
          }}
        >
          <div
            style={{
              background: codeColor,
              borderRadius: 16,
              padding: 40,
              maxWidth: 900,
              width: '100%',
              border: `2px solid ${brandColor}`,
              boxShadow: `0 20px 60px ${brandColor}33`,
            }}
          >
            <div
              style={{
                color: '#888',
                fontSize: 14,
                marginBottom: 20,
                fontFamily: 'monospace',
              }}
            >
              // Monitor rendering progress
            </div>
            <pre
              style={{
                color: '#a5d6ff',
                fontSize: 18,
                margin: 0,
                fontFamily: 'monospace',
                whiteSpace: 'pre-wrap',
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
          </div>
          <div
            style={{
              marginTop: 30,
              fontSize: 24,
              color: textColor,
              fontWeight: 600,
            }}
          >
            Step 4: Auto-Rendering
          </div>
        </div>
      </Sequence>

      {/* Step 5: Final Result */}
      <Sequence from={step4End} durationInFrames={step5Duration * fps}>
        <div
          style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            opacity: fadeIn(step4End, step4End + 30),
            transform: `scale(${scaleIn(step4End, step4End + 30)})`,
          }}
        >
          <div
            style={{
              width: 300,
              height: 200,
              background: `linear-gradient(135deg, ${brandColor} 0%, ${secondaryColor} 100%)`,
              borderRadius: 16,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              marginBottom: 30,
              boxShadow: `0 20px 60px ${brandColor}44`,
              animation: 'pulse 2s ease-in-out infinite',
            }}
          >
            <div
              style={{
                fontSize: 48,
                marginBottom: 10,
              }}
            >
              🎬
            </div>
            <div
              style={{
                color: 'white',
                fontSize: 20,
                fontWeight: 600,
              }}
            >
              Video Ready!
            </div>
          </div>
          
          <h2
            style={{
              fontSize: 48,
              fontWeight: 'bold',
              color: textColor,
              margin: 0,
              textAlign: 'center',
            }}
          >
            {productName}
          </h2>
          <p
            style={{
              fontSize: 24,
              color: 'rgba(255,255,255,0.8)',
              marginTop: 10,
              textAlign: 'center',
              maxWidth: 600,
            }}
          >
            {productDescription}
          </p>
          
          <div
            style={{
              marginTop: 40,
              display: 'flex',
              gap: 20,
            }}
          >
            <div
              style={{
                padding: '12px 24px',
                background: brandColor,
                borderRadius: 8,
                color: 'white',
                fontSize: 16,
                fontWeight: 600,
              }}
            >
              ✓ 30 seconds
            </div>
            <div
              style={{
                padding: '12px 24px',
                background: secondaryColor,
                borderRadius: 8,
                color: 'white',
                fontSize: 16,
                fontWeight: 600,
              }}
            >
              ✓ 1080p HD
            </div>
            <div
              style={{
                padding: '12px 24px',
                background: brandColor,
                borderRadius: 8,
                color: 'white',
                fontSize: 16,
                fontWeight: 600,
              }}
            >
              ✓ Professional
            </div>
          </div>

          <div
            style={{
              marginTop: 40,
              fontSize: 20,
              color: 'rgba(255,255,255,0.6)',
            }}
          >
            Step 5: Complete! 🎉
          </div>
        </div>
      </Sequence>

      {/* Progress bar */}
      <div
        style={{
          position: 'absolute',
          bottom: 40,
          left: 40,
          right: 40,
          height: 4,
          background: 'rgba(255,255,255,0.2)',
          borderRadius: 2,
        }}
      >
        <div
          style={{
            height: '100%',
            width: `${(frame / durationInFrames) * 100}%`,
            background: `linear-gradient(90deg, ${brandColor}, ${secondaryColor})`,
            borderRadius: 2,
          }}
        />
      </div>

      {/* Time display */}
      <div
        style={{
          position: 'absolute',
          bottom: 60,
          right: 40,
          fontSize: 16,
          color: 'rgba(255,255,255,0.6)',
          fontFamily: 'monospace',
        }}
      >
        {Math.floor(frame / fps)}s / {totalDuration}s
      </div>
    </AbsoluteFill>
  );
};

export default IntegrationTutorialVideo;