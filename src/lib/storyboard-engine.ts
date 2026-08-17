import { z } from 'zod';
import { AssetAnalysis } from './asset-processing-engine';

export interface StoryboardScene {
  id: string;
  type: 'intro' | 'content' | 'transition' | 'outro' | 'highlight' | 'showcase';
  title: string;
  description: string;
  duration: number;
  startTime: number;
  endTime: number;
  assets: string[];
  camera: {
    movement: 'static' | 'pan' | 'zoom' | 'tracking' | 'orbit' | 'dolly';
    start: { x: number; y: number; z: number };
    end: { x: number; y: number; z: number };
    easing: 'linear' | 'ease-in' | 'ease-out' | 'ease-in-out' | 'bounce';
  };
  lighting: {
    intensity: number;
    color: string;
    ambiance: 'studio' | 'natural' | 'dramatic' | 'soft' | 'harsh';
  };
  audio: {
    type: 'music' | 'sfx' | 'voiceover' | 'ambient';
    volume: number;
    fade: boolean;
  };
  transitions: {
    in: 'fade' | 'slide' | 'zoom' | 'wipe' | 'dissolve' | 'none';
    out: 'fade' | 'slide' | 'zoom' | 'wipe' | 'dissolve' | 'none';
    duration: number;
  };
  text: {
    content?: string;
    style?: 'minimal' | 'bold' | 'elegant' | 'tech' | 'playful';
    animation?: 'fade' | 'slide' | 'typewriter' | 'glitch' | 'reveal';
  };
  mood: 'energetic' | 'calm' | 'dramatic' | 'professional' | 'playful' | 'mysterious';
  complexity: 'simple' | 'moderate' | 'complex';
}

export interface Storyboard {
  id: string;
  title: string;
  description: string;
  totalDuration: number;
  scenes: StoryboardScene[];
  style: {
    colorPalette: string[];
    typography: string;
    animationStyle: 'smooth' | 'snappy' | 'cinematic' | 'minimal' | 'dynamic';
    visualStyle: 'clean' | 'gritty' | 'minimal' | 'bold' | 'elegant';
  };
  metadata: {
    targetAudience: string;
    platform: 'web' | 'mobile' | 'social' | 'presentation' | 'broadcast';
    aspectRatio: string;
    createdAt: string;
  };
}

export class StoryboardEngine {
  private templates = new Map<string, Storyboard>();

  /**
   * Generate an intelligent storyboard based on assets and goals
   */
  async generateStoryboard(
    assets: AssetAnalysis[],
    goals: {
      duration?: number;
      mood?: StoryboardScene['mood'];
      style?: Storyboard['style']['animationStyle'];
      targetAudience?: string;
      platform?: Storyboard['metadata']['platform'];
    }
  ): Promise<Storyboard> {
    const assetCount = assets.length;
    const totalDuration = goals.duration || this.calculateOptimalDuration(assetCount, goals.mood);
    
    // Determine scene types based on assets
    const sceneTypes = this.determineSceneSequence(assets, goals.mood);
    
    // Calculate timing for each scene
    const scenes = this.createScenesFromAssets(assets, sceneTypes, totalDuration, goals);
    
    // Determine visual style
    const style = this.determineStyle(assets, goals);
    
    // Generate metadata
    const metadata = this.generateMetadata(goals, assets);

    const storyboard: Storyboard = {
      id: `storyboard-${Date.now()}`,
      title: this.generateTitle(assets, goals),
      description: this.generateDescription(assets, goals),
      totalDuration,
      scenes,
      style,
      metadata,
    };

    this.templates.set(storyboard.id, storyboard);
    return storyboard;
  }

  /**
   * Calculate optimal duration based on content
   */
  private calculateOptimalDuration(assetCount: number, mood?: StoryboardScene['mood']): number {
    const baseDuration = assetCount * 3; // 3 seconds per asset minimum
    
    switch (mood) {
      case 'energetic':
        return Math.max(baseDuration * 0.8, 15); // Faster pace
      case 'calm':
        return Math.max(baseDuration * 1.5, 30); // Slower pace
      case 'dramatic':
        return Math.max(baseDuration * 1.2, 20); // Moderate with emphasis
      case 'professional':
        return Math.max(baseDuration * 1.0, 20); // Standard pace
      case 'playful':
        return Math.max(baseDuration * 0.9, 15); // Snappy
      case 'mysterious':
        return Math.max(baseDuration * 1.3, 25); // Slower build
      default:
        return Math.max(baseDuration, 20);
    }
  }

  /**
   * Determine optimal scene sequence based on assets
   */
  private determineSceneSequence(assets: AssetAnalysis[], mood?: StoryboardScene['mood']): StoryboardScene['type'][] {
    const hasLogo = assets.some(a => a.type === 'logo');
    const hasDashboard = assets.some(a => a.type === 'dashboard');
    const hasProduct = assets.some(a => a.type === 'product');
    const hasScreenshot = assets.some(a => a.type === 'screenshot');

    const sequence: StoryboardScene['type'][] = [];

    // Always start with intro if we have a logo
    if (hasLogo) {
      sequence.push('intro');
    }

    // Add content scenes based on asset types
    if (hasDashboard) {
      sequence.push('showcase');
    }

    if (hasProduct) {
      sequence.push('highlight');
    }

    if (hasScreenshot) {
      sequence.push('showcase');
    }

    // Add transition scenes for variety
    if (sequence.length > 2) {
      sequence.splice(Math.floor(sequence.length / 2), 0, 'transition');
    }

    // Add outro if we have content
    if (sequence.length > 1) {
      sequence.push('outro');
    }

    // Adjust based on mood
    if (mood === 'energetic' && sequence.length > 3) {
      // Add more transitions for dynamic feel
      sequence.splice(1, 0, 'transition');
    }

    return sequence.length > 0 ? sequence : ['intro', 'content', 'outro'];
  }

  /**
   * Create scenes from assets with timing and properties
   */
  private createScenesFromAssets(
    assets: AssetAnalysis[],
    sceneTypes: StoryboardScene['type'][],
    totalDuration: number,
    goals: any
  ): StoryboardScene[] {
    const scenes: StoryboardScene[] = [];
    const sceneDuration = totalDuration / sceneTypes.length;
    let currentTime = 0;
    let assetIndex = 0;

    sceneTypes.forEach((type, index) => {
      const sceneAssets = this.assignAssetsToScene(type, assets, assetIndex);
      assetIndex += sceneAssets.length;

      const scene: StoryboardScene = {
        id: `scene-${index}`,
        type,
        title: this.generateSceneTitle(type, index),
        description: this.generateSceneDescription(type, sceneAssets),
        duration: sceneDuration,
        startTime: currentTime,
        endTime: currentTime + sceneDuration,
        assets: sceneAssets.map(a => a.dimensions.toString()), // Simplified asset reference
        camera: this.determineCameraMovement(type, index, sceneTypes.length),
        lighting: this.determineLighting(type, goals.mood),
        audio: this.determineAudio(type, index, sceneTypes.length),
        transitions: this.determineTransitions(type, index, sceneTypes.length),
        text: this.determineText(type, sceneAssets),
        mood: goals.mood || 'professional',
        complexity: this.determineComplexity(type, sceneAssets),
      };

      scenes.push(scene);
      currentTime += sceneDuration;
    });

    return scenes;
  }

  /**
   * Assign appropriate assets to each scene
   */
  private assignAssetsToScene(type: StoryboardScene['type'], assets: AssetAnalysis[], startIndex: number): AssetAnalysis[] {
    const relevantAssets: AssetAnalysis[] = [];

    switch (type) {
      case 'intro':
        relevantAssets.push(...assets.filter(a => a.type === 'logo' || a.type === 'svg'));
        break;
      case 'outro':
        relevantAssets.push(...assets.filter(a => a.type === 'logo' || a.type === 'svg'));
        break;
      case 'showcase':
        relevantAssets.push(...assets.filter(a => a.type === 'dashboard' || a.type === 'screenshot'));
        break;
      case 'highlight':
        relevantAssets.push(...assets.filter(a => a.type === 'product' || a.type === 'screenshot'));
        break;
      default:
        relevantAssets.push(...assets.slice(startIndex, startIndex + 2));
    }

    // Fallback if no specific assets found
    if (relevantAssets.length === 0 && assets.length > 0) {
      relevantAssets.push(assets[startIndex % assets.length]);
    }

    return relevantAssets;
  }

  /**
   * Determine camera movement for scene
   */
  private determineCameraMovement(
    type: StoryboardScene['type'],
    index: number,
    totalScenes: number
  ): StoryboardScene['camera'] {
    const movements: StoryboardScene['camera']['movement'][] = ['static', 'pan', 'zoom', 'tracking', 'orbit', 'dolly'];
    
    switch (type) {
      case 'intro':
        return {
          movement: 'zoom',
          start: { x: 0, y: 0, z: -100 },
          end: { x: 0, y: 0, z: 0 },
          easing: 'ease-out',
        };
      case 'outro':
        return {
          movement: 'zoom',
          start: { x: 0, y: 0, z: 0 },
          end: { x: 0, y: 0, z: -100 },
          easing: 'ease-in',
        };
      case 'showcase':
        return {
          movement: 'pan',
          start: { x: -50, y: 0, z: 0 },
          end: { x: 50, y: 0, z: 0 },
          easing: 'ease-in-out',
        };
      case 'highlight':
        return {
          movement: 'tracking',
          start: { x: 0, y: 0, z: 0 },
          end: { x: 0, y: 20, z: 0 },
          easing: 'ease-in-out',
        };
      default:
        return {
          movement: movements[index % movements.length],
          start: { x: 0, y: 0, z: 0 },
          end: { x: 0, y: 0, z: 0 },
          easing: 'linear',
        };
    }
  }

  /**
   * Determine lighting for scene
   */
  private determineLighting(type: StoryboardScene['type'], mood?: StoryboardScene['mood']): StoryboardScene['lighting'] {
    const ambianceMap: Record<StoryboardScene['mood'], StoryboardScene['lighting']['ambiance']> = {
      energetic: 'studio',
      calm: 'soft',
      dramatic: 'dramatic',
      professional: 'studio',
      playful: 'natural',
      mysterious: 'dramatic',
    };

    return {
      intensity: mood === 'dramatic' ? 0.7 : 1.0,
      color: mood === 'mysterious' ? '#4a5568' : '#ffffff',
      ambiance: ambianceMap[mood || 'professional'] || 'studio',
    };
  }

  /**
   * Determine audio for scene
   */
  private determineAudio(
    type: StoryboardScene['type'],
    index: number,
    totalScenes: number
  ): StoryboardScene['audio'] {
    switch (type) {
      case 'intro':
        return { type: 'music', volume: 0.6, fade: true };
      case 'outro':
        return { type: 'music', volume: 0.4, fade: true };
      case 'highlight':
        return { type: 'sfx', volume: 0.5, fade: false };
      default:
        return { type: 'ambient', volume: 0.3, fade: true };
    }
  }

  /**
   * Determine transitions for scene
   */
  private determineTransitions(
    type: StoryboardScene['type'],
    index: number,
    totalScenes: number
  ): StoryboardScene['transitions'] {
    if (index === 0) {
      return { in: 'fade', out: 'slide', duration: 0.5 };
    }
    
    if (index === totalScenes - 1) {
      return { in: 'slide', out: 'fade', duration: 0.5 };
    }

    return { in: 'slide', out: 'slide', duration: 0.3 };
  }

  /**
   * Determine text content for scene
   */
  private determineText(type: StoryboardScene['type'], assets: AssetAnalysis[]): StoryboardScene['text'] {
    switch (type) {
      case 'intro':
        return {
          content: 'Welcome',
          style: 'bold',
          animation: 'fade',
        };
      case 'outro':
        return {
          content: 'Thank You',
          style: 'elegant',
          animation: 'reveal',
        };
      case 'highlight':
        return {
          content: 'Key Feature',
          style: 'tech',
          animation: 'glitch',
        };
      default:
        return {
          style: 'minimal',
          animation: 'fade',
        };
    }
  }

  /**
   * Determine scene complexity
   */
  private determineComplexity(type: StoryboardScene['type'], assets: AssetAnalysis[]): StoryboardScene['complexity'] {
    const avgComplexity = assets.reduce((sum, a) => sum + a.complexity, 0) / assets.length;
    
    if (avgComplexity > 0.3) return 'complex';
    if (avgComplexity > 0.15) return 'moderate';
    return 'simple';
  }

  /**
   * Determine overall style
   */
  private determineStyle(assets: AssetAnalysis[], goals: any): Storyboard['style'] {
    const dominantColors = this.extractDominantColors(assets);
    
    return {
      colorPalette: dominantColors,
      typography: goals.typography || 'Inter, sans-serif',
      animationStyle: goals.style || 'cinematic',
      visualStyle: goals.visualStyle || 'clean',
    };
  }

  /**
   * Extract dominant colors from assets
   */
  private extractDominantColors(assets: AssetAnalysis[]): string[] {
    const colorMap = new Map<string, number>();
    
    assets.forEach(asset => {
      asset.dominantColors.forEach(color => {
        colorMap.set(color, (colorMap.get(color) || 0) + 1);
      });
    });

    return Array.from(colorMap.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([color]) => color);
  }

  /**
   * Generate storyboard metadata
   */
  private generateMetadata(goals: any, assets: AssetAnalysis[]): Storyboard['metadata'] {
    return {
      targetAudience: goals.targetAudience || 'general',
      platform: goals.platform || 'web',
      aspectRatio: goals.aspectRatio || '16:9',
      createdAt: new Date().toISOString(),
    };
  }

  /**
   * Generate storyboard title
   */
  private generateTitle(assets: AssetAnalysis[], goals: any): string {
    const types = assets.map(a => a.type);
    if (types.includes('logo')) return 'Brand Story';
    if (types.includes('product')) return 'Product Showcase';
    if (types.includes('dashboard')) return 'Analytics Overview';
    return 'Video Storyboard';
  }

  /**
   * Generate storyboard description
   */
  private generateDescription(assets: AssetAnalysis[], goals: any): string {
    return `A ${goals.mood || 'professional'} video featuring ${assets.length} assets with ${goals.style || 'cinematic'} animation style.`;
  }

  /**
   * Generate scene title
   */
  private generateSceneTitle(type: StoryboardScene['type'], index: number): string {
    const titles: Record<StoryboardScene['type'], string> = {
      intro: 'Opening Scene',
      content: 'Content Scene',
      transition: 'Transition Scene',
      outro: 'Closing Scene',
      highlight: 'Feature Highlight',
      showcase: 'Asset Showcase',
    };
    return `${titles[type]} ${index + 1}`;
  }

  /**
   * Generate scene description
   */
  private generateSceneDescription(type: StoryboardScene['type'], assets: AssetAnalysis[]): string {
    const assetTypes = assets.map(a => a.type).join(', ');
    return `${type} scene featuring ${assetTypes || 'various assets'}`;
  }

  /**
   * Get storyboard by ID
   */
  getStoryboard(id: string): Storyboard | undefined {
    return this.templates.get(id);
  }

  /**
   * Get all storyboards
   */
  getAllStoryboards(): Storyboard[] {
    return Array.from(this.templates.values());
  }

  /**
   * Delete storyboard
   */
  deleteStoryboard(id: string): boolean {
    return this.templates.delete(id);
  }
}

export const storyboardEngine = new StoryboardEngine();