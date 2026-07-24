import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  Sequence,
} from 'remotion';
import { z } from 'zod';
import LogoRevealScene from './scenes/LogoRevealScene';
import DashboardShowcaseScene from './scenes/DashboardShowcaseScene';
import FeatureHighlightScene from './scenes/FeatureHighlightScene';
import BrandClosingScene from './scenes/BrandClosingScene';
import { assetProcessingEngine } from '../lib/asset-processing-engine';
import { storyboardEngine } from '../lib/storyboard-engine';
import { scenePlanningEngine } from '../lib/scene-planning-engine';
import { motionEngine } from '../lib/motion-engine';
import { transitionEngine } from '../lib/transition-engine';
import { typographyEngine } from '../lib/typography-engine';
import { audioEngine } from '../lib/audio-engine';
import { intelligentAssetIntegration } from '../lib/intelligent-asset-integration';
import { renderingOptimizationLayer } from '../lib/rendering-optimization-layer';

// Schema for props
export const enhancedVideoSchema = z.object({
  assets: z.array(z.object({
    url: z.string(),
    type: z.enum(['logo', 'screenshot', 'product', 'dashboard', 'svg', 'transparent-png', 'generic']),
  })),
  brandName: z.string(),
  tagline: z.string().optional(),
  website: z.string().optional(),
  brandColors: z.array(z.string()).optional(),
  mood: z.enum(['energetic', 'calm', 'dramatic', 'professional', 'playful', 'mysterious']).default('professional'),
  style: z.enum(['smooth', 'snappy', 'cinematic', 'minimal', 'dynamic']).default('cinematic'),
  duration: z.number().default(20),
  features: z.array(z.object({
    name: z.string(),
    description: z.string(),
    imageUrl: z.string(),
    highlightPoints: z.array(z.string()).optional(),
  })).optional(),
  metrics: z.array(z.object({
    label: z.string(),
    value: z.string(),
    change: z.string(),
  })).optional(),
  socialLinks: z.array(z.object({
    platform: z.string(),
    url: z.string(),
  })).optional(),
});

type Props = z.infer<typeof enhancedVideoSchema>;

const EnhancedVideo: React.FC<Props> = ({
  assets,
  brandName,
  tagline = '',
  website = '',
  brandColors = ['#667eea', '#764ba2'],
  mood = 'professional',
  style = 'cinematic',
  duration = 20,
  features = [],
  metrics = [],
  socialLinks = [],
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const totalFrames = duration * fps;

  // Calculate scene timings
  const logoRevealDuration = 4;
  const featureShowcaseDuration = features.length > 0 ? 6 : 0;
  const dashboardShowcaseDuration = metrics && metrics.length > 0 ? 5 : 0;
  const brandClosingDuration = 4;
  const transitionDuration = 0.5;

  const logoRevealEnd = logoRevealDuration * fps;
  const featureShowcaseEnd = logoRevealEnd + featureShowcaseDuration * fps;
  const dashboardShowcaseEnd = featureShowcaseEnd + dashboardShowcaseDuration * fps;
  const brandClosingStart = dashboardShowcaseEnd + transitionDuration * fps;

  // Find specific assets
  const logoAsset = assets.find(a => a.type === 'logo') || assets[0];
  const dashboardAsset = assets.find(a => a.type === 'dashboard' || a.type === 'screenshot') || assets[1];
  const productAsset = assets.find(a => a.type === 'product') || assets[2];

  return (
    <AbsoluteFill>
      {/* Scene 1: Logo Reveal */}
      <Sequence from={0} durationInFrames={logoRevealEnd}>
        <LogoRevealScene
          logoUrl={logoAsset?.url || ''}
          brandName={brandName}
          tagline={tagline}
          brandColors={brandColors}
          duration={logoRevealDuration}
        />
      </Sequence>

      {/* Scene 2: Feature Highlight (if features provided) */}
      {features.length > 0 && (
        <Sequence from={logoRevealEnd} durationInFrames={featureShowcaseDuration * fps}>
          <FeatureHighlightScene
            productImageUrl={features[0].imageUrl || productAsset?.url || ''}
            featureName={features[0].name}
            featureDescription={features[0].description}
            highlightPoints={features[0].highlightPoints}
            accentColor={brandColors[0]}
            duration={featureShowcaseDuration}
          />
        </Sequence>
      )}

      {/* Scene 3: Dashboard Showcase (if metrics provided) */}
      {metrics && metrics.length > 0 && (
        <Sequence from={featureShowcaseEnd} durationInFrames={dashboardShowcaseDuration * fps}>
          <DashboardShowcaseScene
            screenshotUrl={dashboardAsset?.url || ''}
            title={`${brandName} Analytics`}
            description={`Real-time insights and performance metrics`}
            metrics={metrics}
            duration={dashboardShowcaseDuration}
          />
        </Sequence>
      )}

      {/* Scene 4: Brand Closing */}
      <Sequence from={brandClosingStart} durationInFrames={brandClosingDuration * fps}>
        <BrandClosingScene
          logoUrl={logoAsset?.url || ''}
          brandName={brandName}
          website={website}
          socialLinks={socialLinks}
          brandColors={brandColors}
          duration={brandClosingDuration}
        />
      </Sequence>

      {/* Transitions */}
      {features.length > 0 && (
        <Sequence from={logoRevealEnd - transitionDuration * fps} durationInFrames={transitionDuration * fps}>
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'rgba(0, 0, 0, 0.3)',
              opacity: interpolate(frame, [logoRevealEnd - transitionDuration * fps, logoRevealEnd], [0, 1]),
            }}
          />
        </Sequence>
      )}

      {metrics && metrics.length > 0 && (
        <Sequence from={featureShowcaseEnd - transitionDuration * fps} durationInFrames={transitionDuration * fps}>
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'rgba(0, 0, 0, 0.3)',
              opacity: interpolate(frame, [featureShowcaseEnd - transitionDuration * fps, featureShowcaseEnd], [0, 1]),
            }}
          />
        </Sequence>
      )}
    </AbsoluteFill>
  );
};

export default EnhancedVideo;