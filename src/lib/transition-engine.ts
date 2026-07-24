import { z } from 'zod';

export interface TransitionConfig {
  type: 'fade' | 'slide' | 'zoom' | 'wipe' | 'dissolve' | 'morph' | 'glitch' | 'particle' | 'mask' | '3d-flip' | 'cube-rotate';
  duration: number;
  easing: 'linear' | 'ease-in' | 'ease-out' | 'ease-in-out' | 'bounce' | 'elastic';
  direction?: 'up' | 'down' | 'left' | 'right' | 'in' | 'out' | 'random';
  parameters?: Record<string, any>;
}

export interface TransitionState {
  progress: number; // 0-1
  isActive: boolean;
  fromScene: any;
  toScene: any;
  config: TransitionConfig;
}

export interface TransitionEffect {
  id: string;
  name: string;
  config: TransitionConfig;
  render: (progress: number, from: any, to: any) => any;
}

export class TransitionEngine {
  private transitions = new Map<string, TransitionEffect>();
  private activeTransition: TransitionState | null = null;

  constructor() {
    this.registerBuiltInTransitions();
  }

  /**
   * Register built-in transition effects
   */
  private registerBuiltInTransitions(): void {
    // Fade transition
    this.registerTransition({
      id: 'fade',
      name: 'Fade',
      config: { type: 'fade', duration: 0.5, easing: 'ease-in-out' },
      render: (progress, from, to) => ({
        fromOpacity: 1 - progress,
        toOpacity: progress,
        blend: 'normal',
      }),
    });

    // Slide transition
    this.registerTransition({
      id: 'slide',
      name: 'Slide',
      config: { type: 'slide', duration: 0.6, easing: 'ease-in-out', direction: 'left' },
      render: (progress, from, to) => {
        const direction = -1; // Default left
        return {
          fromTransform: `translateX(${progress * 100 * direction}%)`,
          toTransform: `translateX(${(1 - progress) * -100 * direction}%)`,
          blend: 'normal',
        };
      },
    });

    // Zoom transition
    this.registerTransition({
      id: 'zoom',
      name: 'Zoom',
      config: { type: 'zoom', duration: 0.5, easing: 'ease-in-out', direction: 'in' },
      render: (progress, from, to) => ({
        fromScale: 1 + progress * 0.5,
        toScale: 0.5 + progress * 0.5,
        fromOpacity: 1 - progress,
        toOpacity: progress,
        blend: 'normal',
      }),
    });

    // Wipe transition
    this.registerTransition({
      id: 'wipe',
      name: 'Wipe',
      config: { type: 'wipe', duration: 0.7, easing: 'ease-in-out', direction: 'left' },
      render: (progress, from, to) => ({
        fromClip: `inset(0 ${(1 - progress) * 100}% 0 0)`,
        toClip: `inset(0 0 0 ${progress * 100}%)`,
        blend: 'normal',
      }),
    });

    // Dissolve transition
    this.registerTransition({
      id: 'dissolve',
      name: 'Dissolve',
      config: { type: 'dissolve', duration: 0.8, easing: 'ease-in-out' },
      render: (progress, from, to) => ({
        fromOpacity: 1 - progress,
        toOpacity: progress,
        blend: 'screen',
        noise: progress,
      }),
    });

    // Morph transition
    this.registerTransition({
      id: 'morph',
      name: 'Morph',
      config: { type: 'morph', duration: 1.0, easing: 'ease-in-out' },
      render: (progress, from, to) => ({
        fromMorph: this.calculateMorphProgress(progress, 0),
        toMorph: this.calculateMorphProgress(progress, 1),
        blend: 'normal',
      }),
    });

    // Glitch transition
    this.registerTransition({
      id: 'glitch',
      name: 'Glitch',
      config: { type: 'glitch', duration: 0.4, easing: 'linear' },
      render: (progress, from, to) => ({
        fromGlitch: this.calculateGlitch(progress, 0),
        toGlitch: this.calculateGlitch(progress, 1),
        blend: 'screen',
      }),
    });

    // Particle transition
    this.registerTransition({
      id: 'particle',
      name: 'Particle',
      config: { type: 'particle', duration: 1.2, easing: 'ease-out' },
      render: (progress, from, to) => ({
        particleCount: Math.floor(progress * 100),
        particleOpacity: progress,
        blend: 'screen',
      }),
    });

    // Mask transition
    this.registerTransition({
      id: 'mask',
      name: 'Mask',
      config: { type: 'mask', duration: 0.8, easing: 'ease-in-out', direction: 'circle' },
      render: (progress, from, to) => ({
        fromMask: `radial-gradient(circle at 50% 50%, transparent ${progress * 50}%, black ${progress * 50 + 1}%)`,
        toMask: `radial-gradient(circle at 50% 50%, black ${(1 - progress) * 50}%, transparent ${(1 - progress) * 50 + 1}%)`,
        blend: 'normal',
      }),
    });

    // 3D Flip transition
    this.registerTransition({
      id: '3d-flip',
      name: '3D Flip',
      config: { type: '3d-flip', duration: 0.8, easing: 'ease-in-out' },
      render: (progress, from, to) => ({
        fromRotation: `rotateY(${progress * 180}deg)`,
        toRotation: `rotateY(${(progress - 1) * 180}deg)`,
        fromOpacity: progress < 0.5 ? 1 : 0,
        toOpacity: progress >= 0.5 ? 1 : 0,
        blend: 'normal',
      }),
    });

    // Cube Rotate transition
    this.registerTransition({
      id: 'cube-rotate',
      name: 'Cube Rotate',
      config: { type: 'cube-rotate', duration: 1.0, easing: 'ease-in-out', direction: 'left' },
      render: (progress, from, to) => {
        const angle = progress * 90;
        return {
          fromRotation: `rotateY(${angle}deg) translateZ(-50%)`,
          toRotation: `rotateY(${angle - 90}deg) translateZ(-50%)`,
          blend: 'normal',
        };
      },
    });
  }

  /**
   * Register a custom transition
   */
  registerTransition(effect: TransitionEffect): void {
    this.transitions.set(effect.id, effect);
  }

  /**
   * Start a transition between scenes
   */
  startTransition(fromScene: any, toScene: any, config: TransitionConfig): TransitionState {
    const transitionState: TransitionState = {
      progress: 0,
      isActive: true,
      fromScene,
      toScene,
      config,
    };

    this.activeTransition = transitionState;
    return transitionState;
  }

  /**
   * Update transition progress
   */
  updateTransition(deltaTime: number): void {
    if (!this.activeTransition) return;

    const increment = deltaTime / this.activeTransition.config.duration;
    this.activeTransition.progress = Math.min(1, this.activeTransition.progress + increment);

    if (this.activeTransition.progress >= 1) {
      this.activeTransition.isActive = false;
    }
  }

  /**
   * Render current transition frame
   */
  renderTransition(): any {
    if (!this.activeTransition) return null;

    const effect = this.transitions.get(this.activeTransition.config.type);
    if (!effect) return null;

    const easedProgress = this.applyEasing(
      this.activeTransition.progress,
      this.activeTransition.config.easing
    );

    return effect.render(
      easedProgress,
      this.activeTransition.fromScene,
      this.activeTransition.toScene
    );
  }

  /**
   * Apply easing to progress
   */
  private applyEasing(progress: number, easing: TransitionConfig['easing']): number {
    switch (easing) {
      case 'linear':
        return progress;
      case 'ease-in':
        return progress * progress;
      case 'ease-out':
        return progress * (2 - progress);
      case 'ease-in-out':
        return progress < 0.5
          ? 2 * progress * progress
          : 1 - Math.pow(-2 * progress + 2, 2) / 2;
      case 'bounce':
        return this.bounceEasing(progress);
      case 'elastic':
        return this.elasticEasing(progress);
      default:
        return progress;
    }
  }

  /**
   * Bounce easing function
   */
  private bounceEasing(progress: number): number {
    const n1 = 7.5625;
    const d1 = 2.75;

    if (progress < 1 / d1) {
      return n1 * progress * progress;
    } else if (progress < 2 / d1) {
      return n1 * (progress -= 1.5 / d1) * progress + 0.75;
    } else if (progress < 2.5 / d1) {
      return n1 * (progress -= 2.25 / d1) * progress + 0.9375;
    } else {
      return n1 * (progress -= 2.625 / d1) * progress + 0.984375;
    }
  }

  /**
   * Elastic easing function
   */
  private elasticEasing(progress: number): number {
    const c4 = (2 * Math.PI) / 3;
    
    return progress === 0
      ? 0
      : progress === 1
      ? 1
      : -Math.pow(2, 10 * progress - 10) * Math.sin((progress * 10 - 10.75) * c4);
  }

  /**
   * Calculate morph progress for shape morphing
   */
  private calculateMorphProgress(progress: number, target: number): number {
    // Smooth step function for morphing
    const t = progress;
    const smoothT = t * t * (3 - 2 * t);
    return target === 0 ? 1 - smoothT : smoothT;
  }

  /**
   * Calculate glitch effect parameters
   */
  private calculateGlitch(progress: number, target: number): {
    offset: number;
    slices: number;
    intensity: number;
  } {
    const intensity = target === 0 ? (1 - progress) * 10 : progress * 10;
    const slices = Math.floor(intensity * 2);
    const offset = Math.sin(progress * Math.PI * 4) * intensity;

    return { offset, slices, intensity };
  }

  /**
   * Get transition by ID
   */
  getTransition(id: string): TransitionEffect | undefined {
    return this.transitions.get(id);
  }

  /**
   * Get all available transitions
   */
  getAllTransitions(): TransitionEffect[] {
    return Array.from(this.transitions.values());
  }

  /**
   * Create custom transition configuration
   */
  createTransitionConfig(
    type: TransitionConfig['type'],
    options: Partial<TransitionConfig> = {}
  ): TransitionConfig {
    return {
      type,
      duration: options.duration || 0.5,
      easing: options.easing || 'ease-in-out',
      direction: options.direction || 'left',
      parameters: options.parameters || {},
    };
  }

  /**
   * Suggest optimal transition based on scene types
   */
  suggestTransition(fromSceneType: string, toSceneType: string): TransitionConfig {
    const scenePairs: Record<string, TransitionConfig['type']> = {
      'intro-content': 'fade',
      'content-highlight': 'zoom',
      'highlight-showcase': 'slide',
      'showcase-outro': 'fade',
      'dashboard-dashboard': 'wipe',
      'logo-brand': 'morph',
    };

    const pairKey = `${fromSceneType}-${toSceneType}`;
    const suggestedType = scenePairs[pairKey] || 'fade';

    return this.createTransitionConfig(suggestedType);
  }

  /**
   * Create transition sequence for storyboard
   */
  createTransitionSequence(sceneTypes: string[]): TransitionConfig[] {
    const sequence: TransitionConfig[] = [];

    for (let i = 0; i < sceneTypes.length - 1; i++) {
      const from = sceneTypes[i];
      const to = sceneTypes[i + 1];
      sequence.push(this.suggestTransition(from, to));
    }

    return sequence;
  }

  /**
   * Stop active transition
   */
  stopTransition(): void {
    this.activeTransition = null;
  }

  /**
   * Check if transition is active
   */
  isTransitionActive(): boolean {
    return this.activeTransition?.isActive || false;
  }

  /**
   * Get active transition state
   */
  getActiveTransition(): TransitionState | null {
    return this.activeTransition;
  }
}

export const transitionEngine = new TransitionEngine();