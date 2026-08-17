import { z } from 'zod';
import { AssetAnalysis } from './asset-processing-engine';
import { Storyboard, StoryboardScene } from './storyboard-engine';

export interface ScenePlan {
  id: string;
  storyboardId: string;
  sceneId: string;
  timeline: {
    totalFrames: number;
    fps: number;
    keyframes: Keyframe[];
  };
  composition: {
    layers: Layer[];
    zOrder: string[];
  };
  camera: {
    position: { x: number; y: number; z: number };
    rotation: { x: number; y: number; z: number };
    zoom: number;
    movement: CameraMovement[];
  };
  lighting: {
    ambient: { intensity: number; color: string };
    directional: { intensity: number; color: string; position: { x: number; y: number; z: number } };
    pointLights: PointLight[];
  };
  effects: Effect[];
  optimization: {
    renderQuality: 'low' | 'medium' | 'high' | 'ultra';
    antialiasing: 'none' | 'fxaa' | 'msaa' | 'smaa';
    motionBlur: boolean;
    depthOfField: boolean;
    bloom: boolean;
  };
}

export interface Keyframe {
  frame: number;
  properties: Record<string, any>;
  easing: 'linear' | 'ease-in' | 'ease-out' | 'ease-in-out' | 'bounce' | 'elastic';
}

export interface Layer {
  id: string;
  type: 'image' | 'video' | 'text' | 'shape' | 'particle' | '3d-model' | 'gradient';
  content: any;
  transform: {
    position: { x: number; y: number; z: number };
    rotation: { x: number; y: number; z: number };
    scale: { x: number; y: number; z: number };
    opacity: number;
  };
  blendMode: 'normal' | 'multiply' | 'screen' | 'overlay' | 'soft-light' | 'hard-light';
  mask?: {
    type: 'rectangle' | 'ellipse' | 'path' | 'image';
    data: any;
  };
  filters: Filter[];
}

export interface CameraMovement {
  startFrame: number;
  endFrame: number;
  from: { x: number; y: number; z: number };
  to: { x: number; y: number; z: number };
  easing: string;
}

export interface PointLight {
  id: string;
  position: { x: number; y: number; z: number };
  intensity: number;
  color: string;
  decay: number;
  distance: number;
}

export interface Effect {
  type: 'blur' | 'glow' | 'shadow' | 'distortion' | 'color-grading' | 'film-grain' | 'vignette';
  properties: Record<string, any>;
  enabled: boolean;
}

export interface Filter {
  type: 'brightness' | 'contrast' | 'saturation' | 'hue-rotate' | 'blur' | 'sepia' | 'grayscale';
  value: number;
}

export class ScenePlanningEngine {
  private scenePlans = new Map<string, ScenePlan>();

  /**
   * Generate detailed scene plan from storyboard scene
   */
  async generateScenePlan(
    storyboard: Storyboard,
    scene: StoryboardScene,
    assets: AssetAnalysis[]
  ): Promise<ScenePlan> {
    const fps = 30;
    const totalFrames = Math.floor(scene.duration * fps);
    
    // Generate timeline with keyframes
    const timeline = this.generateTimeline(scene, totalFrames, fps);
    
    // Create composition layers
    const composition = this.generateComposition(scene, assets);
    
    // Plan camera movements
    const camera = this.planCamera(scene, totalFrames);
    
    // Plan lighting
    const lighting = this.planLighting(scene, assets);
    
    // Add effects
    const effects = this.planEffects(scene, assets);
    
    // Determine optimization settings
    const optimization = this.determineOptimization(scene, assets);

    const scenePlan: ScenePlan = {
      id: `scene-plan-${scene.id}-${Date.now()}`,
      storyboardId: storyboard.id,
      sceneId: scene.id,
      timeline,
      composition,
      camera,
      lighting,
      effects,
      optimization,
    };

    this.scenePlans.set(scenePlan.id, scenePlan);
    return scenePlan;
  }

  /**
   * Generate timeline with keyframes
   */
  private generateTimeline(scene: StoryboardScene, totalFrames: number, fps: number): ScenePlan['timeline'] {
    const keyframes: Keyframe[] = [];
    
    // Initial state
    keyframes.push({
      frame: 0,
      properties: {
        opacity: 0,
        scale: 0.9,
      },
      easing: 'ease-out',
    });

    // Fade in
    keyframes.push({
      frame: Math.floor(totalFrames * 0.1),
      properties: {
        opacity: 1,
        scale: 1,
      },
      easing: 'ease-out',
    });

    // Mid-scene dynamic
    keyframes.push({
      frame: Math.floor(totalFrames * 0.5),
      properties: {
        scale: 1.05,
      },
      easing: 'ease-in-out',
    });

    // Return to normal
    keyframes.push({
      frame: Math.floor(totalFrames * 0.9),
      properties: {
        scale: 1,
      },
      easing: 'ease-in-out',
    });

    // Fade out
    keyframes.push({
      frame: totalFrames,
      properties: {
        opacity: 0,
      },
      easing: 'ease-in',
    });

    return {
      totalFrames,
      fps,
      keyframes,
    };
  }

  /**
   * Generate composition layers
   */
  private generateComposition(scene: StoryboardScene, assets: AssetAnalysis[]): ScenePlan['composition'] {
    const layers: Layer[] = [];
    const zOrder: string[] = [];

    // Background layer
    const backgroundLayer: Layer = {
      id: 'background',
      type: 'gradient',
      content: {
        colors: this.generateGradientColors(scene),
        direction: 'diagonal',
      },
      transform: {
        position: { x: 0, y: 0, z: -100 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 1, y: 1, z: 1 },
        opacity: 1,
      },
      blendMode: 'normal',
      filters: [],
    };
    layers.push(backgroundLayer);
    zOrder.push('background');

    // Asset layers
    assets.forEach((asset, index) => {
      const assetLayer: Layer = {
        id: `asset-${index}`,
        type: 'image',
        content: {
          assetId: asset.dimensions.toString(), // Simplified reference
          fit: 'contain',
        },
        transform: this.calculateAssetTransform(asset, index, assets.length),
        blendMode: asset.hasTransparency ? 'normal' : 'screen',
        filters: this.calculateAssetFilters(asset),
      };
      layers.push(assetLayer);
      zOrder.push(`asset-${index}`);
    });

    // Text layer
    if (scene.text.content) {
      const textLayer: Layer = {
        id: 'text',
        type: 'text',
        content: {
          text: scene.text.content,
          style: scene.text.style,
          animation: scene.text.animation,
        },
        transform: {
          position: { x: 0, y: 200, z: 10 },
          rotation: { x: 0, y: 0, z: 0 },
          scale: { x: 1, y: 1, z: 1 },
          opacity: 1,
        },
        blendMode: 'normal',
        filters: [],
      };
      layers.push(textLayer);
      zOrder.push('text');
    }

    // Particle layer for dynamic scenes
    if (scene.complexity === 'complex' || scene.mood === 'energetic') {
      const particleLayer: Layer = {
        id: 'particles',
        type: 'particle',
        content: {
          count: 50,
          size: 2,
          color: '#ffffff',
        },
        transform: {
          position: { x: 0, y: 0, z: 5 },
          rotation: { x: 0, y: 0, z: 0 },
          scale: { x: 1, y: 1, z: 1 },
          opacity: 0.5,
        },
        blendMode: 'screen',
        filters: [],
      };
      layers.push(particleLayer);
      zOrder.push('particles');
    }

    return { layers, zOrder };
  }

  /**
   * Calculate asset transform based on analysis
   */
  private calculateAssetTransform(asset: AssetAnalysis, index: number, totalAssets: number): Layer['transform'] {
    const xOffset = (index - (totalAssets - 1) / 2) * 200;
    const yOffset = Math.sin(index * 0.5) * 50;
    
    return {
      position: { x: xOffset, y: yOffset, z: index * 10 },
      rotation: { x: 0, y: 0, z: 0 },
      scale: { 
        x: Math.min(1, 1920 / asset.dimensions.width),
        y: Math.min(1, 1080 / asset.dimensions.height),
        z: 1 
      },
      opacity: 1,
    };
  }

  /**
   * Calculate filters for asset
   */
  private calculateAssetFilters(asset: AssetAnalysis): Filter[] {
    const filters: Filter[] = [];
    
    // Brightness adjustment
    if (asset.brightness < 0.3) {
      filters.push({ type: 'brightness', value: 1.3 });
    } else if (asset.brightness > 0.7) {
      filters.push({ type: 'brightness', value: 0.9 });
    }
    
    // Contrast adjustment
    if (asset.contrast < 0.5) {
      filters.push({ type: 'contrast', value: 1.2 });
    }
    
    return filters;
  }

  /**
   * Generate gradient colors based on scene
   */
  private generateGradientColors(scene: StoryboardScene): string[] {
    const colorMap: Record<StoryboardScene['mood'], string[]> = {
      energetic: ['#667eea', '#764ba2'],
      calm: ['#a8edea', '#fed6e3'],
      dramatic: ['#232526', '#414345'],
      professional: ['#667eea', '#764ba2'],
      playful: ['#f093fb', '#f5576c'],
      mysterious: ['#0f0c29', '#302b63'],
    };
    
    return colorMap[scene.mood] || ['#667eea', '#764ba2'];
  }

  /**
   * Plan camera movements
   */
  private planCamera(scene: StoryboardScene, totalFrames: number): ScenePlan['camera'] {
    const movements: CameraMovement[] = [];
    
    // Main camera movement based on scene type
    switch (scene.camera.movement) {
      case 'zoom':
        movements.push({
          startFrame: 0,
          endFrame: totalFrames,
          from: scene.camera.start,
          to: scene.camera.end,
          easing: scene.camera.easing,
        });
        break;
      case 'pan':
        movements.push({
          startFrame: 0,
          endFrame: totalFrames,
          from: scene.camera.start,
          to: scene.camera.end,
          easing: scene.camera.easing,
        });
        break;
      case 'tracking':
        movements.push({
          startFrame: Math.floor(totalFrames * 0.2),
          endFrame: Math.floor(totalFrames * 0.8),
          from: scene.camera.start,
          to: scene.camera.end,
          easing: scene.camera.easing,
        });
        break;
      default:
        movements.push({
          startFrame: 0,
          endFrame: totalFrames,
          from: { x: 0, y: 0, z: 0 },
          to: { x: 0, y: 0, z: 0 },
          easing: 'linear',
        });
    }

    return {
      position: { x: 0, y: 0, z: 0 },
      rotation: { x: 0, y: 0, z: 0 },
      zoom: 1,
      movement: movements,
    };
  }

  /**
   * Plan lighting
   */
  private planLighting(scene: StoryboardScene, assets: AssetAnalysis[]): ScenePlan['lighting'] {
    const pointLights: PointLight[] = [];
    
    // Add accent lights based on asset colors
    assets.slice(0, 3).forEach((asset, index) => {
      if (asset.dominantColors.length > 0) {
        pointLights.push({
          id: `light-${index}`,
          position: { 
            x: (index - 1) * 300, 
            y: 100, 
            z: 200 
          },
          intensity: 0.5,
          color: asset.dominantColors[0],
          decay: 2,
          distance: 500,
        });
      }
    });

    return {
      ambient: {
        intensity: scene.lighting.intensity * 0.4,
        color: scene.lighting.color,
      },
      directional: {
        intensity: scene.lighting.intensity * 0.6,
        color: '#ffffff',
        position: { x: 0, y: 500, z: 300 },
      },
      pointLights,
    };
  }

  /**
   * Plan effects
   */
  private planEffects(scene: StoryboardScene, assets: AssetAnalysis[]): Effect[] {
    const effects: Effect[] = [];

    // Add vignette for dramatic scenes
    if (scene.mood === 'dramatic' || scene.mood === 'mysterious') {
      effects.push({
        type: 'vignette',
        properties: { intensity: 0.5, radius: 0.8 },
        enabled: true,
      });
    }

    // Add glow for highlights
    if (scene.type === 'highlight' || scene.type === 'intro') {
      effects.push({
        type: 'glow',
        properties: { intensity: 0.3, radius: 20, threshold: 0.8 },
        enabled: true,
      });
    }

    // Add subtle motion blur for energetic scenes
    if (scene.mood === 'energetic') {
      effects.push({
        type: 'blur',
        properties: { intensity: 0.3, direction: 'motion' },
        enabled: true,
      });
    }

    // Add color grading based on mood
    effects.push({
      type: 'color-grading',
      properties: this.getColorGradingPreset(scene.mood),
      enabled: true,
    });

    return effects;
  }

  /**
   * Get color grading preset based on mood
   */
  private getColorGradingPreset(mood: StoryboardScene['mood']): Record<string, any> {
    const presets: Record<StoryboardScene['mood'], Record<string, any>> = {
      energetic: {
        saturation: 1.2,
        contrast: 1.1,
        temperature: 0.1,
        tint: 0,
      },
      calm: {
        saturation: 0.9,
        contrast: 0.95,
        temperature: -0.1,
        tint: 0.05,
      },
      dramatic: {
        saturation: 0.8,
        contrast: 1.3,
        temperature: -0.2,
        tint: 0.1,
      },
      professional: {
        saturation: 1.0,
        contrast: 1.05,
        temperature: 0,
        tint: 0,
      },
      playful: {
        saturation: 1.3,
        contrast: 1.1,
        temperature: 0.15,
        tint: -0.05,
      },
      mysterious: {
        saturation: 0.7,
        contrast: 1.2,
        temperature: -0.15,
        tint: 0.15,
      },
    };
    
    return presets[mood] || presets.professional;
  }

  /**
   * Determine optimization settings
   */
  private determineOptimization(scene: StoryboardScene, assets: AssetAnalysis[]): ScenePlan['optimization'] {
    const assetQuality = assets.reduce((sum, a) => sum + a.quality, 0) / assets.length;
    
    let renderQuality: ScenePlan['optimization']['renderQuality'] = 'medium';
    if (assetQuality > 0.8) renderQuality = 'high';
    if (assetQuality > 0.9) renderQuality = 'ultra';
    if (assetQuality < 0.5) renderQuality = 'low';

    return {
      renderQuality,
      antialiasing: renderQuality === 'ultra' ? 'msaa' : 'fxaa',
      motionBlur: scene.mood === 'energetic' || scene.camera.movement !== 'static',
      depthOfField: scene.type === 'highlight' || scene.type === 'intro',
      bloom: scene.type === 'intro' || scene.type === 'outro',
    };
  }

  /**
   * Batch generate scene plans for entire storyboard
   */
  async generateStoryboardPlans(
    storyboard: Storyboard,
    assets: AssetAnalysis[]
  ): Promise<ScenePlan[]> {
    const plans: ScenePlan[] = [];
    
    for (const scene of storyboard.scenes) {
      const sceneAssets = this.filterAssetsForScene(scene, assets);
      const plan = await this.generateScenePlan(storyboard, scene, sceneAssets);
      plans.push(plan);
    }
    
    return plans;
  }

  /**
   * Filter assets relevant to specific scene
   */
  private filterAssetsForScene(scene: StoryboardScene, assets: AssetAnalysis[]): AssetAnalysis[] {
    // Simple filtering - in production would be more sophisticated
    return assets.slice(0, 3);
  }

  /**
   * Get scene plan by ID
   */
  getScenePlan(id: string): ScenePlan | undefined {
    return this.scenePlans.get(id);
  }

  /**
   * Get all scene plans
   */
  getAllScenePlans(): ScenePlan[] {
    return Array.from(this.scenePlans.values());
  }

  /**
   * Delete scene plan
   */
  deleteScenePlan(id: string): boolean {
    return this.scenePlans.delete(id);
  }
}

export const scenePlanningEngine = new ScenePlanningEngine();