import { AssetAnalysis, assetProcessingEngine } from './asset-processing-engine';
import { Storyboard, storyboardEngine } from './storyboard-engine';
import { ScenePlan, scenePlanningEngine } from './scene-planning-engine';
import { motionEngine } from './motion-engine';
import { transitionEngine } from './transition-engine';
import { typographyEngine } from './typography-engine';
import { audioEngine } from './audio-engine';

export interface AssetIntegrationConfig {
  autoPlacement: boolean;
  smartSizing: boolean;
  colorMatching: boolean;
  motionSynchronization: boolean;
  audioReactivity: boolean;
  brandConsistency: boolean;
}

export interface IntegratedScene {
  sceneId: string;
  assets: Array<{
    asset: AssetAnalysis;
    placement: {
      x: number;
      y: number;
      z: number;
      scale: number;
      rotation: number;
    };
    animation: string;
    timing: {
      start: number;
      end: number;
    };
    effects: string[];
  }>;
  typography: any;
  audio: any;
  transitions: any;
}

export class IntelligentAssetIntegration {
  private config: AssetIntegrationConfig;
  private assetLibrary = new Map<string, AssetAnalysis>();
  private integrationHistory = new Map<string, IntegratedScene[]>();

  constructor() {
    this.config = {
      autoPlacement: true,
      smartSizing: true,
      colorMatching: true,
      motionSynchronization: true,
      audioReactivity: true,
      brandConsistency: true,
    };
  }

  /**
   * Analyze and integrate assets into video project
   */
  async integrateAssets(
    assetPaths: string[],
    projectGoals: {
      mood?: string;
      style?: string;
      duration?: number;
      brandColors?: string[];
    }
  ): Promise<{
    storyboard: Storyboard;
    scenePlans: ScenePlan[];
    integratedScenes: IntegratedScene[];
  }> {
    // Analyze all assets
    const assetAnalyses = await Promise.all(
      assetPaths.map(path => assetProcessingEngine.analyzeAsset(path))
    );

    // Store in library
    assetAnalyses.forEach(analysis => {
      this.assetLibrary.set(analysis.dimensions.toString(), analysis);
    });

    // Generate storyboard
    const storyboard = await storyboardEngine.generateStoryboard(assetAnalyses, {
      ...projectGoals,
      mood: (projectGoals.mood as any) || 'professional',
      style: (projectGoals.style as any) || 'cinematic',
    });

    // Generate scene plans
    const scenePlans = await scenePlanningEngine.generateStoryboardPlans(storyboard, assetAnalyses);

    // Integrate assets into scenes
    const integratedScenes = await this.integrateAssetsIntoScenes(
      storyboard,
      scenePlans,
      assetAnalyses,
      projectGoals
    );

    return {
      storyboard,
      scenePlans,
      integratedScenes,
    };
  }

  /**
   * Integrate assets into individual scenes
   */
  private async integrateAssetsIntoScenes(
    storyboard: Storyboard,
    scenePlans: ScenePlan[],
    assets: AssetAnalysis[],
    projectGoals: any
  ): Promise<IntegratedScene[]> {
    const integratedScenes: IntegratedScene[] = [];

    for (let i = 0; i < storyboard.scenes.length; i++) {
      const scene = storyboard.scenes[i];
      const scenePlan = scenePlans[i];
      const sceneAssets = this.selectAssetsForScene(scene, assets);

      const integratedScene: IntegratedScene = {
        sceneId: scene.id,
        assets: [],
        typography: null,
        audio: null,
        transitions: null,
      };

      // Place assets in scene
      for (const asset of sceneAssets) {
        const placement = this.calculateAssetPlacement(asset, scene, scenePlan);
        const animation = this.selectAssetAnimation(asset, scene);
        const timing = this.calculateAssetTiming(asset, scene);
        const effects = this.selectAssetEffects(asset, scene);

        integratedScene.assets.push({
          asset,
          placement,
          animation,
          timing,
          effects,
        });
      }

      // Generate typography
      integratedScene.typography = this.generateSceneTypography(scene, projectGoals);

      // Generate audio
      integratedScene.audio = await this.generateSceneAudio(scene, projectGoals);

      // Generate transitions
      integratedScene.transitions = this.generateSceneTransitions(scene, storyboard);

      integratedScenes.push(integratedScene);
    }

    this.integrationHistory.set(storyboard.id, integratedScenes);
    return integratedScenes;
  }

  /**
   * Select best assets for a specific scene
   */
  private selectAssetsForScene(scene: any, assets: AssetAnalysis[]): AssetAnalysis[] {
    const sceneType = scene.type;
    const relevantAssets: AssetAnalysis[] = [];

    assets.forEach(asset => {
      // Check if asset is recommended for this scene type
      if (asset.recommendedScenes.includes(sceneType)) {
        relevantAssets.push(asset);
      }
    });

    // If no specific recommendations, use assets with high quality
    if (relevantAssets.length === 0) {
      const sortedByQuality = [...assets].sort((a, b) => b.quality - a.quality);
      relevantAssets.push(...sortedByQuality.slice(0, 2));
    }

    return relevantAssets.slice(0, 3); // Max 3 assets per scene
  }

  /**
   * Calculate optimal asset placement in scene
   */
  private calculateAssetPlacement(
    asset: AssetAnalysis,
    scene: any,
    scenePlan: ScenePlan
  ): { x: number; y: number; z: number; scale: number; rotation: number } {
    if (this.config.autoPlacement) {
      return this.autoPlaceAsset(asset, scene, scenePlan);
    }

    return {
      x: 0,
      y: 0,
      z: 0,
      scale: 1,
      rotation: 0,
    };
  }

  /**
   * Auto-place asset using rule-based positioning
   */
  private autoPlaceAsset(
    asset: AssetAnalysis,
    scene: any,
    scenePlan: ScenePlan
  ): { x: number; y: number; z: number; scale: number; rotation: number } {
    const sceneType = scene.type;
    const assetType = asset.type;

    let x = 0, y = 0, z = 0, scale = 1, rotation = 0;

    // Position based on asset type and scene type
    switch (sceneType) {
      case 'intro':
        if (assetType === 'logo') {
          x = 0;
          y = 0;
          z = 10;
          scale = this.calculateOptimalScale(asset);
          rotation = 0;
        }
        break;

      case 'showcase':
        if (assetType === 'dashboard' || assetType === 'screenshot') {
          x = 0;
          y = -50;
          z = 5;
          scale = this.calculateOptimalScale(asset);
          rotation = 0;
        }
        break;

      case 'highlight':
        if (assetType === 'product') {
          x = 100;
          y = 0;
          z = 8;
          scale = this.calculateOptimalScale(asset) * 1.2;
          rotation = 5;
        }
        break;

      case 'outro':
        if (assetType === 'logo') {
          x = 0;
          y = 0;
          z = 10;
          scale = this.calculateOptimalScale(asset) * 0.8;
          rotation = 0;
        }
        break;
    }

    // Apply color matching if enabled
    if (this.config.colorMatching) {
      this.adjustPositionForColorHarmony(asset, scene, { x, y, z, scale, rotation });
    }

    return { x, y, z, scale, rotation };
  }

  /**
   * Calculate optimal scale for asset
   */
  private calculateOptimalScale(asset: AssetAnalysis): number {
    if (!this.config.smartSizing) return 1;

    const targetWidth = 800;
    const targetHeight = 600;

    const scaleX = targetWidth / asset.dimensions.width;
    const scaleY = targetHeight / asset.dimensions.height;

    return Math.min(scaleX, scaleY, 1); // Don't upscale, max 1x
  }

  /**
   * Adjust position for color harmony
   */
  private adjustPositionForColorHarmony(
    asset: AssetAnalysis,
    scene: any,
    placement: { x: number; y: number; z: number; scale: number; rotation: number }
  ): void {
    // Simplified color harmony adjustment
    // In production, would use color theory algorithms
    const brightness = asset.brightness;
    
    if (brightness > 0.7) {
      placement.y -= 50; // Move bright assets up
    } else if (brightness < 0.3) {
      placement.y += 50; // Move dark assets down
    }
  }

  /**
   * Select appropriate animation for asset
   */
  private selectAssetAnimation(asset: AssetAnalysis, scene: any): string {
    const assetType = asset.type;
    const sceneType = scene.type;
    const mood = scene.mood;

    // Motion-based animation selection
    if (this.config.motionSynchronization) {
      if (assetType === 'logo' && sceneType === 'intro') {
        return 'logo-reveal';
      }
      if (assetType === 'dashboard' && sceneType === 'showcase') {
        return 'dashboard-pan';
      }
      if (assetType === 'product' && sceneType === 'highlight') {
        return mood === 'energetic' ? 'product-spin' : 'product-float';
      }
    }

    return 'fade-in';
  }

  /**
   * Calculate asset timing within scene
   */
  private calculateAssetTiming(asset: AssetAnalysis, scene: any): { start: number; end: number } {
    const sceneDuration = scene.duration;
    const assetComplexity = asset.complexity;

    // More complex assets need more screen time
    const visibilityDuration = Math.min(
      sceneDuration * 0.8,
      2 + assetComplexity * 3
    );

    const startDelay = Math.random() * (sceneDuration - visibilityDuration) * 0.5;

    return {
      start: startDelay,
      end: startDelay + visibilityDuration,
    };
  }

  /**
   * Select effects for asset
   */
  private selectAssetEffects(asset: AssetAnalysis, scene: any): string[] {
    const effects: string[] = [];
    const mood = scene.mood;

    // Add shadow for depth
    if (asset.hasTransparency) {
      effects.push('drop-shadow');
    }

    // Add glow for highlights
    if (scene.type === 'highlight' || scene.type === 'intro') {
      effects.push('glow');
    }

    // Add blur for background elements
    if (asset.complexity > 0.4) {
      effects.push('background-blur');
    }

    // Mood-based effects
    if (mood === 'dramatic') {
      effects.push('vignette');
    }
    if (mood === 'mysterious') {
      effects.push('desaturate');
    }

    return effects;
  }

  /**
   * Generate typography for scene
   */
  private generateSceneTypography(scene: any, projectGoals: any): any {
    const textContent = this.generateSceneText(scene);
    const typographyStyle = typographyEngine.suggestTypography(textContent, {
      mood: scene.mood,
      sceneType: scene.type,
      duration: scene.duration,
    });

    return typographyEngine.applyStyle(textContent, typographyStyle.name);
  }

  /**
   * Generate text content for scene
   */
  private generateSceneText(scene: any): string {
    const textTemplates: Record<string, string> = {
      intro: 'Welcome',
      content: 'Discover',
      showcase: 'Explore',
      highlight: 'Experience',
      outro: 'Thank You',
      transition: '',
    };

    return textTemplates[scene.type] || '';
  }

  /**
   * Generate audio for scene
   */
  private async generateSceneAudio(scene: any, projectGoals: any): Promise<any> {
    const audioTrack = await audioEngine.generateMusic({
      mood: scene.mood,
      duration: scene.duration,
      tempo: scene.mood === 'energetic' ? 140 : 80,
    });

    return audioTrack;
  }

  /**
   * Generate transitions for scene
   */
  private generateSceneTransitions(scene: any, storyboard: Storyboard): any {
    const sceneIndex = storyboard.scenes.findIndex(s => s.id === scene.id);
    const nextScene = storyboard.scenes[sceneIndex + 1];

    if (!nextScene) {
      return null;
    }

    const transitionConfig = transitionEngine.suggestTransition(scene.type, nextScene.type);
    return transitionEngine.createTransitionConfig(transitionConfig.type, transitionConfig);
  }

  /**
   * Update integration configuration
   */
  updateConfig(config: Partial<AssetIntegrationConfig>): void {
    this.config = { ...this.config, ...config };
  }

  /**
   * Get integration configuration
   */
  getConfig(): AssetIntegrationConfig {
    return this.config;
  }

  /**
   * Get asset from library
   */
  getAsset(key: string): AssetAnalysis | undefined {
    return this.assetLibrary.get(key);
  }

  /**
   * Get all assets in library
   */
  getAllAssets(): AssetAnalysis[] {
    return Array.from(this.assetLibrary.values());
  }

  /**
   * Get integration history
   */
  getIntegrationHistory(storyboardId: string): IntegratedScene[] | undefined {
    return this.integrationHistory.get(storyboardId);
  }

  /**
   * Analyze asset usage patterns
   */
  analyzeUsagePatterns(): {
    mostUsedAssets: Array<{ asset: AssetAnalysis; usageCount: number }>;
    preferredPlacements: Record<string, { x: number; y: number }>;
    effectiveCombinations: Array<{ asset1: string; asset2: string; score: number }>;
  } {
    const usageCounts = new Map<string, number>();
    const placements = new Map<string, { x: number; y: number }[]>();
    const combinations = new Map<string, number>();

    this.integrationHistory.forEach(scenes => {
      scenes.forEach(scene => {
        scene.assets.forEach(({ asset, placement }) => {
          const key = asset.dimensions.toString();
          usageCounts.set(key, (usageCounts.get(key) || 0) + 1);

          if (!placements.has(key)) {
            placements.set(key, []);
          }
          placements.get(key)!.push({ x: placement.x, y: placement.y });
        });

        // Track asset combinations
        for (let i = 0; i < scene.assets.length; i++) {
          for (let j = i + 1; j < scene.assets.length; j++) {
            const comboKey = [scene.assets[i].asset.dimensions.toString(), scene.assets[j].asset.dimensions.toString()].sort().join('-');
            combinations.set(comboKey, (combinations.get(comboKey) || 0) + 1);
          }
        }
      });
    });

    const mostUsedAssets = Array.from(usageCounts.entries())
      .map(([key, count]) => ({
        asset: this.assetLibrary.get(key)!,
        usageCount: count,
      }))
      .sort((a, b) => b.usageCount - a.usageCount)
      .slice(0, 5);

    const preferredPlacements: Record<string, { x: number; y: number }> = {};
    placements.forEach((positionList, key) => {
      const avgX = positionList.reduce((sum, p) => sum + p.x, 0) / positionList.length;
      const avgY = positionList.reduce((sum, p) => sum + p.y, 0) / positionList.length;
      preferredPlacements[key] = { x: avgX, y: avgY };
    });

    const effectiveCombinations = Array.from(combinations.entries())
      .map(([combo, count]) => {
        const [asset1, asset2] = combo.split('-');
        return { asset1, asset2, score: count };
      })
      .sort((a, b) => b.score - a.score)
      .slice(0, 5);

    return {
      mostUsedAssets,
      preferredPlacements,
      effectiveCombinations,
    };
  }

  /**
   * Optimize asset placement based on historical data
   */
  optimizePlacementWithHistory(asset: AssetAnalysis, scene: any): { x: number; y: number; z: number; scale: number; rotation: number } {
    const patterns = this.analyzeUsagePatterns();
    const assetKey = asset.dimensions.toString();
    const preferredPlacement = patterns.preferredPlacements[assetKey];

    if (preferredPlacement && this.config.autoPlacement) {
      return {
        x: preferredPlacement.x,
        y: preferredPlacement.y,
        z: 0,
        scale: this.calculateOptimalScale(asset),
        rotation: 0,
      };
    }

    return this.autoPlaceAsset(asset, scene, {
      id: `scene-${Date.now()}`,
      storyboardId: `storyboard-${Date.now()}`,
      sceneId: `scene-${Date.now()}`,
      timeline: { totalFrames: 30, fps: 30, keyframes: [] },
      composition: { layers: [], zOrder: [] },
      camera: { position: { x: 0, y: 0, z: 0 }, rotation: { x: 0, y: 0, z: 0 }, zoom: 1, movement: [] },
      lighting: { ambient: { intensity: 1, color: '#ffffff' }, directional: { intensity: 1, color: '#ffffff', position: { x: 0, y: 0, z: 0 } }, pointLights: [] },
      effects: [],
      optimization: { renderQuality: 'medium', antialiasing: 'fxaa', motionBlur: false, depthOfField: false, bloom: false },
    });
  }

  /**
   * Clear asset library
   */
  clearAssetLibrary(): void {
    this.assetLibrary.clear();
  }

  /**
   * Clear integration history
   */
  clearHistory(): void {
    this.integrationHistory.clear();
  }

  /**
   * Reset all data
   */
  reset(): void {
    this.clearAssetLibrary();
    this.clearHistory();
  }
}

export const intelligentAssetIntegration = new IntelligentAssetIntegration();