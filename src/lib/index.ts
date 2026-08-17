// Export all video generation engines
export { assetProcessingEngine, AssetProcessingEngine } from './asset-processing-engine';
export { storyboardEngine, StoryboardEngine } from './storyboard-engine';
export { scenePlanningEngine, ScenePlanningEngine } from './scene-planning-engine';
export { motionEngine, MotionEngine } from './motion-engine';
export { transitionEngine, TransitionEngine } from './transition-engine';
export { typographyEngine, TypographyEngine } from './typography-engine';
export { audioEngine, AudioEngine } from './audio-engine';
export { renderingOptimizationLayer, RenderingOptimizationLayer } from './rendering-optimization-layer';
export { intelligentAssetIntegration, IntelligentAssetIntegration } from './intelligent-asset-integration';

// Export professional audio engines
export { professionalAudioEngine, ProfessionalAudioEngine } from './professional-audio-engine';
export { faustIntegration, FaustIntegration } from './faust-integration';
export { audioIntegrationLayer, AudioIntegrationLayer } from './audio-integration-layer';

// Export Three.js motion components
export {
  useMotionAnimation,
  AnimatedMesh,
  AnimatedGroup,
  AnimatedCamera,
  AnimatedMaterial,
  AnimatedLight,
  AnimatedGeometry,
  createMotionPaths,
} from './three-motion-components';

// Export camera animation system
export {
  CameraAnimationSystem,
  useCameraAnimation,
  CameraPresets,
} from './camera-animation-system';

// Export 3D particle system
export {
  ParticleSystem3D,
  useParticleSystem3D,
  ParticlePresets,
} from './3d-particle-system';

// Export types
export type { AssetAnalysis, ProcessedAsset } from './asset-processing-engine';
export type { Storyboard, StoryboardScene } from './storyboard-engine';
export type { ScenePlan, Layer, CameraMovement, Effect, Filter } from './scene-planning-engine';
export type { MotionPath, MotionKeyframe, MotionState, PhysicsConfig } from './motion-engine';
export type { TransitionConfig, TransitionState, TransitionEffect } from './transition-engine';
export type { TypographyConfig, TextAnimation, TextLayout, TypographyStyle } from './typography-engine';
export type { AudioConfig, AudioTrack, AudioEvent, AudioMixer, AudioEffect } from './audio-engine';
export type { RenderConfig, OptimizationStrategy, RenderMetrics, RenderTarget } from './rendering-optimization-layer';
export type { AssetIntegrationConfig, IntegratedScene } from './intelligent-asset-integration';
export type { CameraWaypoint, CameraAnimationConfig } from './camera-animation-system';
export type { ParticleConfig, Particle } from './3d-particle-system';
export type { ProfessionalAudioConfig, SynthConfig, DSPConfig } from './professional-audio-engine';
export type { FaustConfig, FaustDSP } from './faust-integration';
export type { AudioGenerationRequest, AudioGenerationResponse } from './audio-integration-layer';