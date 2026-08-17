import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, Sequence, Audio, staticFile } from 'remotion';
import { z } from 'zod';

// Schema for professional video editor demo with actual audio
export const professionalVideoEditorWithAudioSchema = z.object({
  productName: z.string().default('Remotone'),
  tagline: z.string().default('AI-Powered Motion Design Engine'),
  brandColor: z.string().default('#667eea'),
  secondaryColor: z.string().default('#764ba2'),
  accentColor: z.string().default('#00d4ff'),
});

type Props = z.infer<typeof professionalVideoEditorWithAudioSchema>;

const ProfessionalVideoEditorDemoWithAudio: React.FC<Props> = ({
  productName = 'Remotone',
  tagline = 'AI-Powered Motion Design Engine',
  brandColor = '#667eea',
  secondaryColor = '#764ba2',
  accentColor = '#00d4ff',
}) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const totalDuration = durationInFrames / fps; // 15 seconds

  // Professional step timings
  const step1Duration = 3; // Cinematic intro with music
  const step2Duration = 3; // Setup with sound effects
  const step3Duration = 3; // Integration with transition sounds
  const step4Duration = 3; // Generation with progress audio
  const step5Duration = 3; // Final result with climax music

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

  // Animation helpers
  const advancedFadeIn = (start: number, end: number) => 
    easeOutExpo(interpolate(frame, [start, end], [0, 1], { extrapolateRight: 'clamp', extrapolateLeft: 'clamp' }));
  
  const advancedFadeOut = (start: number, end: number) => 
    easeOutExpo(interpolate(frame, [start, end], [1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }));

  const advancedSlideUp = (start: number, end: number) => 
    easeOutBack(interpolate(frame, [start, end], [100, 0], { extrapolateRight: 'clamp', extrapolateLeft: 'clamp' }));

  const advancedScale = (start: number, end: number) => 
    easeInOutCubic(interpolate(frame, [start, end], [0.5, 1], { extrapolateRight: 'clamp', extrapolateLeft: 'clamp' }));

  // Particle system
  const particles = Array.from({ length: 25 }, (_, i) => ({
    x: Math.sin(frame / 25 + i * 0.5) * 250,
    y: Math.cos(frame / 20 + i * 0.3) * 180,
    size: 3 + Math.sin(frame / 12 + i) * 2,
    opacity: 0.4 + Math.sin(frame / 18 + i * 0.4) * 0.3,
    color: i % 3 === 0 ? brandColor : i % 3 === 1 ? accentColor : secondaryColor
  }));

  // Audio visualization (simulated for visual)
  const audioBars = Array.from({ length: 16 }, (_, i) => {
    const amplitude = Math.sin(frame / 10 + i * 0.5) * 0.5 + 0.5;
    return {
      height: 20 + amplitude * 40,
      opacity: 0.3 + amplitude * 0.4
    };
  });

  return (
    <AbsoluteFill style={{ background: '#0a0a1a' }}>
      {/* Dynamic background with animated gradient */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: `radial-gradient(ellipse at ${50 + Math.sin(frame / 50) * 25}% ${50 + Math.cos(frame / 40) * 20}%, ${brandColor}33 0%, transparent 50%),
                      radial-gradient(ellipse at ${50 + Math.cos(frame / 45) * 30}% ${50 + Math.sin(frame / 55) * 25}%, ${secondaryColor}33 0%, transparent 50%)`,
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
            background: particle.color,
            opacity: particle.opacity,
            transform: `translate(${particle.x}px, ${particle.y}px)`,
            filter: 'blur(1px)',
            boxShadow: `0 0 10px ${particle.color}`,
          }}
        />
      ))}

      {/* Audio visualization bars */}
      <div
        style={{
          position: 'absolute',
          bottom: 100,
          left: 40,
          right: 40,
          display: 'flex',
          justifyContent: 'center',
          gap: 4,
          opacity: advancedFadeIn(0, 30),
        }}
      >
        {audioBars.map((bar, i) => (
          <div
            key={i}
            style={{
              width: 8,
              height: bar.height,
              background: `linear-gradient(180deg, ${accentColor}, ${brandColor})`,
              borderRadius: 4,
              opacity: bar.opacity,
              transform: `scaleY(${1 + Math.sin(frame / 8 + i * 0.3) * 0.2})`,
              boxShadow: `0 0 10px ${accentColor}`,
            }}
          />
        ))}
      </div>

      {/* Background audio for the entire video */}
      <Audio
        src={staticFile('audio.wav')}
        startFrom={0}
        volume={0.3}
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
          {/* Audio indicator */}
          <div
            style={{
              position: 'absolute',
              top: 40,
              right: 40,
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              fontSize: 14,
              color: 'rgba(255,255,255,0.7)',
              fontFamily: 'monospace',
            }}
          >
            <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#00ff00', animation: 'pulse 1s infinite' }} />
            AUDIO ON
          </div>

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
            }}
          >
            {productName}
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
            {tagline}
          </p>

          {/* Audio wave indicator */}
          <div
            style={{
              marginTop: 40,
              display: 'flex',
              gap: 4,
              opacity: advancedFadeIn(60, 90),
            }}
          >
            {Array.from({ length: 5 }).map((_, i) => (
              <div
                key={i}
                style={{
                  width: 4,
                  height: 20 + Math.sin(frame / 5 + i) * 15,
                  background: accentColor,
                  borderRadius: 2,
                  transform: `scaleY(${1 + Math.sin(frame / 8 + i * 0.5) * 0.5})`,
                }}
              />
            ))}
          </div>
        </div>
      </Sequence>

      {/* Step 2: Professional video editor interface */}
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
          {/* Video editor interface */}
          <div
            style={{
              background: 'rgba(15, 15, 35, 0.95)',
              borderRadius: 20,
              padding: 50,
              maxWidth: 1100,
              width: '100%',
              border: `1px solid ${brandColor}44`,
              boxShadow: `0 25px 80px ${brandColor}33, inset 0 0 60px rgba(102, 126, 234, 0.1)`,
              transform: `perspective(1000px) rotateY(${Math.sin(frame / 60) * 2}deg)`,
              backdropFilter: 'blur(20px)',
            }}
          >
            {/* Editor toolbar */}
            <div
              style={{
                display: 'flex',
                gap: 12,
                marginBottom: 30,
                paddingBottom: 20,
                borderBottom: '1px solid rgba(255,255,255,0.1)',
              }}
            >
              {['Cut', 'Copy', 'Paste', 'Undo', 'Redo'].map((tool, i) => (
                <div
                  key={tool}
                  style={{
                    padding: '8px 16px',
                    background: 'rgba(255,255,255,0.05)',
                    borderRadius: 8,
                    color: 'rgba(255,255,255,0.8)',
                    fontSize: 14,
                    fontFamily: 'monospace',
                    border: `1px solid ${brandColor}22`,
                    transform: `translateY(${Math.sin(frame / 20 + i) * 3}px)`,
                  }}
                >
                  {tool}
                </div>
              ))}
            </div>

            {/* Timeline */}
            <div
              style={{
                background: 'rgba(0,0,0,0.3)',
                borderRadius: 12,
                padding: 20,
                marginBottom: 30,
              }}
            >
              <div
                style={{
                  fontSize: 12,
                  color: 'rgba(255,255,255,0.5)',
                  marginBottom: 15,
                  fontFamily: 'monospace',
                }}
              >
                TIMELINE
              </div>
              
              {/* Audio track */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                  marginBottom: 10,
                }}
              >
                <div style={{ width: 80, fontSize: 12, color: 'rgba(255,255,255,0.6)', fontFamily: 'monospace' }}>
                  AUDIO
                </div>
                <div
                  style={{
                    flex: 1,
                    height: 40,
                    background: `linear-gradient(90deg, ${accentColor}44 0%, ${accentColor}66 ${((frame - step1End) / (step2Duration * fps)) * 100}%)`,
                    borderRadius: 6,
                    border: `1px solid ${accentColor}44`,
                    position: 'relative',
                  }}
                >
                  <div
                    style={{
                      position: 'absolute',
                      inset: 0,
                      background: `repeating-linear-gradient(90deg, transparent, transparent 2px, ${accentColor}22 2px, ${accentColor}22 4px)`,
                      borderRadius: 6,
                    }}
                  />
                </div>
              </div>

              {/* Video track */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                }}
              >
                <div style={{ width: 80, fontSize: 12, color: 'rgba(255,255,255,0.6)', fontFamily: 'monospace' }}>
                  VIDEO
                </div>
                <div
                  style={{
                    flex: 1,
                    height: 40,
                    background: `linear-gradient(90deg, ${brandColor}44 0%, ${brandColor}66 ${((frame - step1End) / (step2Duration * fps)) * 100}%)`,
                    borderRadius: 6,
                    border: `1px solid ${brandColor}44`,
                  }}
                />
              </div>
            </div>

            {/* Editor window */}
            <div
              style={{
                background: 'rgba(0,0,0,0.5)',
                borderRadius: 12,
                padding: 30,
                fontFamily: 'monospace',
                color: '#a5d6ff',
                fontSize: 16,
                lineHeight: 1.6,
              }}
            >
              <div style={{ color: '#666', fontSize: 14, marginBottom: 15 }}>
                // Professional video editor
              </div>
              <pre style={{ margin: 0 }}>
{`const editor = new VideoEditor({
  audioEngine: 'professional',
  sampleRate: 48000,
  realtimeProcessing: true
});

// Add audio track
editor.addAudioTrack({
  type: 'music',
  mood: 'cinematic',
  duration: 30
});`}
              </pre>
            </div>

            {/* Audio level meters */}
            <div
              style={{
                display: 'flex',
                gap: 20,
                marginTop: 20,
                justifyContent: 'center',
              }}
            >
              {['L', 'R'].map((channel) => (
                <div key={channel} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.6)', fontFamily: 'monospace' }}>
                    {channel}
                  </div>
                  <div
                    style={{
                      width: 8,
                      height: 60,
                      background: 'rgba(255,255,255,0.1)',
                      borderRadius: 4,
                      position: 'relative',
                      overflow: 'hidden',
                    }}
                  >
                    <div
                      style={{
                        position: 'absolute',
                        bottom: 0,
                        left: 0,
                        right: 0,
                        height: `${30 + Math.sin(frame / 8) * 25}%`,
                        background: channel === 'L' ? brandColor : accentColor,
                        borderRadius: 4,
                      }}
                    />
                  </div>
                </div>
              ))}
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
              EDITOR
            </div>
          </div>
        </div>
      </Sequence>

      {/* Step 3: Audio integration */}
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
          {/* Audio processing interface */}
          <div
            style={{
              background: 'rgba(15, 15, 35, 0.95)',
              borderRadius: 20,
              padding: 50,
              maxWidth: 1100,
              width: '100%',
              border: `1px solid ${accentColor}44`,
              boxShadow: `0 25px 80px ${accentColor}33, inset 0 0 60px rgba(0, 212, 255, 0.1)`,
              transform: `perspective(1000px) rotateX(${Math.sin(frame / 50) * 2}deg)`,
              backdropFilter: 'blur(20px)',
            }}
          >
            {/* Audio effects rack */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(4, 1fr)',
                gap: 15,
                marginBottom: 30,
              }}
            >
              {[
                { name: 'REVERB', color: brandColor, active: true },
                { name: 'DELAY', color: accentColor, active: true },
                { name: 'EQ', color: secondaryColor, active: false },
                { name: 'COMP', color: brandColor, active: true },
              ].map((effect, i) => (
                <div
                  key={effect.name}
                  style={{
                    padding: 20,
                    background: effect.active ? `${effect.color}22` : 'rgba(255,255,255,0.05)',
                    borderRadius: 12,
                    border: `1px solid ${effect.color}44`,
                    textAlign: 'center',
                    transform: `translateY(${Math.sin(frame / 15 + i) * 5}px)`,
                  }}
                >
                  <div
                    style={{
                      fontSize: 12,
                      color: effect.active ? effect.color : 'rgba(255,255,255,0.5)',
                      fontFamily: 'monospace',
                      marginBottom: 8,
                    }}
                  >
                    {effect.name}
                  </div>
                  <div
                    style={{
                      width: '100%',
                      height: 4,
                      background: effect.active ? effect.color : 'rgba(255,255,255,0.2)',
                      borderRadius: 2,
                    }}
                  />
                </div>
              ))}
            </div>

            {/* DSP code */}
            <div
              style={{
                background: 'rgba(0,0,0,0.5)',
                borderRadius: 12,
                padding: 30,
                fontFamily: 'monospace',
                color: '#50fa7b',
                fontSize: 15,
                lineHeight: 1.6,
              }}
            >
              <div style={{ color: '#666', fontSize: 14, marginBottom: 15 }}>
                // FAUST DSP Processing
              </div>
              <pre style={{ margin: 0 }}>
{`reverb = faust.reverb(10, 0.5, 0.8);
compressor = faust.compressor(-24, 4, 0.003);
eq = faust.parametricEQ(100, 1000, 8000);

// Process audio chain
audio → reverb → compressor → eq → output`}
              </pre>
            </div>

            {/* Spectrum analyzer */}
            <div
              style={{
                marginTop: 30,
                height: 80,
                background: 'rgba(0,0,0,0.3)',
                borderRadius: 8,
                position: 'relative',
                overflow: 'hidden',
              }}
            >
              {Array.from({ length: 32 }).map((_, i) => {
                const height = 20 + Math.sin(frame / 8 + i * 0.3) * 25 + Math.random() * 15;
                return (
                  <div
                    key={i}
                    style={{
                      position: 'absolute',
                      bottom: 0,
                      left: `${(i / 32) * 100}%`,
                      width: '3%',
                      height: `${height}%`,
                      background: `linear-gradient(180deg, ${accentColor}, ${brandColor})`,
                      borderRadius: 2,
                      opacity: 0.8,
                    }}
                  />
                );
              })}
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
              AUDIO
            </div>
          </div>
        </div>
      </Sequence>

      {/* Step 4: Generation with audio */}
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
          {/* Rendering interface */}
          <div
            style={{
              background: 'rgba(15, 15, 35, 0.95)',
              borderRadius: 20,
              padding: 50,
              maxWidth: 1100,
              width: '100%',
              border: `1px solid ${secondaryColor}44`,
              boxShadow: `0 25px 80px ${secondaryColor}33, inset 0 0 60px rgba(118, 75, 162, 0.1)`,
              transform: `perspective(1000px) rotateY(${Math.cos(frame / 55) * 2}deg)`,
              backdropFilter: 'blur(20px)',
            }}
          >
            {/* Progress visualization */}
            <div
              style={{
                marginBottom: 30,
                textAlign: 'center',
              }}
            >
              <div
                style={{
                  fontSize: 48,
                  fontWeight: 900,
                  color: 'white',
                  margin: 0,
                  background: `linear-gradient(135deg, ${secondaryColor}, ${accentColor})`,
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}
              >
                {Math.floor(((frame - step3End) / (step4Duration * fps)) * 100)}%
              </div>
              <div
                style={{
                  fontSize: 14,
                  color: 'rgba(255,255,255,0.6)',
                  marginTop: 10,
                  fontFamily: 'monospace',
                  letterSpacing: 2,
                }}
              >
                RENDERING WITH AUDIO
              </div>
            </div>

            {/* Audio waveforms */}
            <div
              style={{
                display: 'flex',
                gap: 8,
                marginBottom: 30,
                justifyContent: 'center',
              }}
            >
              {Array.from({ length: 8 }).map((_, i) => (
                <div
                  key={i}
                  style={{
                    width: 30,
                    height: 60,
                    background: 'rgba(255,255,255,0.1)',
                    borderRadius: 4,
                    position: 'relative',
                    overflow: 'hidden',
                  }}
                >
                  {Array.from({ length: 20 }).map((_, j) => (
                    <div
                      key={j}
                      style={{
                        position: 'absolute',
                        bottom: 0,
                        left: `${j * 5}%`,
                        width: '4px',
                        height: `${10 + Math.sin(frame / 5 + i + j) * 20}%`,
                        background: `linear-gradient(180deg, ${secondaryColor}, ${accentColor})`,
                        borderRadius: 2,
                      }}
                    />
                  ))}
                </div>
              ))}
            </div>

            {/* Processing stages */}
            <div
              style={{
                display: 'flex',
                gap: 15,
                justifyContent: 'center',
              }}
            >
              {[
                { stage: 'VIDEO', progress: ((frame - step3End) / (step4Duration * fps)) * 100 },
                { stage: 'AUDIO', progress: ((frame - step3End) / (step4Duration * fps)) * 90 },
                { stage: 'EFFECTS', progress: ((frame - step3End) / (step4Duration * fps)) * 80 },
                { stage: 'EXPORT', progress: ((frame - step3End) / (step4Duration * fps)) * 70 },
              ].map((item, i) => (
                <div
                  key={item.stage}
                  style={{
                    padding: '15px 25px',
                    background: 'rgba(255,255,255,0.05)',
                    borderRadius: 8,
                    border: `1px solid ${secondaryColor}44`,
                    textAlign: 'center',
                  }}
                >
                  <div
                    style={{
                      fontSize: 12,
                      color: 'rgba(255,255,255,0.6)',
                      fontFamily: 'monospace',
                      marginBottom: 8,
                    }}
                  >
                    {item.stage}
                  </div>
                  <div
                    style={{
                      width: '100%',
                      height: 4,
                      background: 'rgba(255,255,255,0.1)',
                      borderRadius: 2,
                      overflow: 'hidden',
                    }}
                  >
                    <div
                      style={{
                        height: '100%',
                        width: `${Math.min(item.progress, 100)}%`,
                        background: `linear-gradient(90deg, ${secondaryColor}, ${accentColor})`,
                        borderRadius: 2,
                      }}
                    />
                  </div>
                </div>
              ))}
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
              RENDER
            </div>
          </div>
        </div>
      </Sequence>

      {/* Step 5: Final result with audio */}
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
          {/* Final video preview with audio */}
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
                inset: -30,
                background: `radial-gradient(circle, ${brandColor}44 0%, transparent 70%)`,
                borderRadius: 30,
                filter: 'blur(40px)',
                animation: 'pulse 2s ease-in-out infinite',
              }}
            />
            
            {/* Video preview card */}
            <div
              style={{
                width: 500,
                height: 320,
                background: `linear-gradient(135deg, ${brandColor} 0%, ${secondaryColor} 100%)`,
                borderRadius: 24,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                position: 'relative',
                overflow: 'hidden',
                boxShadow: `0 40px 100px ${brandColor}44`,
                transform: `perspective(1000px) rotateY(${Math.sin(frame / 40) * 5}deg) rotateX(${Math.cos(frame / 35) * 3}deg)`,
              }}
            >
              {/* Audio visualization overlay */}
              <div
                style={{
                  position: 'absolute',
                  bottom: 20,
                  left: 20,
                  right: 20,
                  display: 'flex',
                  gap: 3,
                  justifyContent: 'center',
                  opacity: 0.6,
                }}
              >
                {Array.from({ length: 20 }).map((_, i) => (
                  <div
                    key={i}
                    style={{
                      width: 4,
                      height: 30 + Math.sin(frame / 6 + i * 0.5) * 25,
                      background: 'rgba(255,255,255,0.8)',
                      borderRadius: 2,
                      transform: `scaleY(${1 + Math.sin(frame / 4 + i * 0.3) * 0.5})`,
                    }}
                  />
                ))}
              </div>

              {/* Play button */}
              <div
                style={{
                  width: 100,
                  height: 100,
                  borderRadius: '50%',
                  background: 'rgba(255,255,255,0.2)',
                  backdropFilter: 'blur(10px)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 40,
                  marginBottom: 20,
                  border: '3px solid rgba(255,255,255,0.4)',
                  boxShadow: '0 15px 50px rgba(0,0,0,0.3)',
                  cursor: 'pointer',
                }}
              >
                ▶
              </div>
              
              <div
                style={{
                  color: 'white',
                  fontSize: 28,
                  fontWeight: 700,
                  textShadow: '0 2px 20px rgba(0,0,0,0.3)',
                }}
              >
                Video Ready!
              </div>

              {/* Audio indicator */}
              <div
                style={{
                  marginTop: 15,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  fontSize: 14,
                  color: 'rgba(255,255,255,0.8)',
                }}
              >
                <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#00ff00' }} />
                AUDIO: 48kHz / 24-bit
              </div>

              {/* Animated shine effect */}
              <div
                style={{
                  position: 'absolute',
                  top: -50,
                  left: -50,
                  width: 100,
                  height: 200,
                  background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent)',
                  transform: `rotate(45deg) translateX(${(frame - step4End) * 8}px)`,
                }}
              />
            </div>
          </div>
          
          {/* Audio specs */}
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
            Professional Video Editor with SuperCollider-Quality Audio
          </p>
          
          {/* Audio badges */}
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
              { label: '48kHz', color: brandColor },
              { label: '24-bit', color: accentColor },
              { label: 'STEREO', color: secondaryColor },
              { label: 'PRO AUDIO', color: brandColor },
              { label: 'REAL-TIME', color: accentColor },
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
                  transform: `translateY(${Math.sin(frame / 15 + i) * 5}px)`,
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
            Professional Complete 🎵
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

export default ProfessionalVideoEditorDemoWithAudio;