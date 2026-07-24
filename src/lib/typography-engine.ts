import { z } from 'zod';

export interface TypographyConfig {
  fontFamily: string;
  fontSize: number;
  fontWeight: number;
  lineHeight: number;
  letterSpacing: number;
  color: string;
  textAlign: 'left' | 'center' | 'right' | 'justify';
  textTransform: 'none' | 'uppercase' | 'lowercase' | 'capitalize';
  textDecoration: 'none' | 'underline' | 'line-through';
  textShadow?: {
    color: string;
    blur: number;
    offsetX: number;
    offsetY: number;
  };
}

export interface TextAnimation {
  type: 'fade' | 'slide' | 'typewriter' | 'glitch' | 'reveal' | 'bounce' | 'wave' | 'gradient' | 'blur';
  duration: number;
  delay: number;
  easing: 'linear' | 'ease-in' | 'ease-out' | 'ease-in-out' | 'bounce' | 'elastic';
  parameters?: Record<string, any>;
}

export interface TextLayout {
  position: { x: number; y: number };
  width: number;
  height: number;
  padding: { top: number; right: number; bottom: number; left: number };
  margin: { top: number; right: number; bottom: number; left: number };
  alignment: 'start' | 'center' | 'end';
  verticalAlignment: 'top' | 'middle' | 'bottom';
}

export interface TypographyStyle {
  name: string;
  config: TypographyConfig;
  layout: TextLayout;
  animation?: TextAnimation;
  presets: TypographyConfig[];
}

export class TypographyEngine {
  private styles = new Map<string, TypographyStyle>();
  private fonts = new Map<string, any>();
  private textCache = new Map<string, any>();

  constructor() {
    this.registerBuiltInStyles();
  }

  /**
   * Register built-in typography styles
   */
  private registerBuiltInStyles(): void {
    // Minimal style
    this.registerStyle({
      name: 'minimal',
      config: {
        fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif',
        fontSize: 24,
        fontWeight: 400,
        lineHeight: 1.5,
        letterSpacing: 0,
        color: '#ffffff',
        textAlign: 'center',
        textTransform: 'none',
        textDecoration: 'none',
      },
      layout: {
        position: { x: 0, y: 0 },
        width: 1920,
        height: 1080,
        padding: { top: 0, right: 0, bottom: 0, left: 0 },
        margin: { top: 0, right: 0, bottom: 0, left: 0 },
        alignment: 'center',
        verticalAlignment: 'middle',
      },
      animation: {
        type: 'fade',
        duration: 0.5,
        delay: 0,
        easing: 'ease-out',
      },
      presets: [],
    });

    // Bold style
    this.registerStyle({
      name: 'bold',
      config: {
        fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif',
        fontSize: 48,
        fontWeight: 700,
        lineHeight: 1.2,
        letterSpacing: -0.02,
        color: '#ffffff',
        textAlign: 'center',
        textTransform: 'uppercase',
        textDecoration: 'none',
        textShadow: {
          color: 'rgba(0, 0, 0, 0.3)',
          blur: 10,
          offsetX: 0,
          offsetY: 4,
        },
      },
      layout: {
        position: { x: 0, y: 0 },
        width: 1920,
        height: 1080,
        padding: { top: 0, right: 0, bottom: 0, left: 0 },
        margin: { top: 0, right: 0, bottom: 0, left: 0 },
        alignment: 'center',
        verticalAlignment: 'middle',
      },
      animation: {
        type: 'slide',
        duration: 0.6,
        delay: 0,
        easing: 'ease-out',
      },
      presets: [],
    });

    // Elegant style
    this.registerStyle({
      name: 'elegant',
      config: {
        fontFamily: 'Georgia, serif',
        fontSize: 36,
        fontWeight: 300,
        lineHeight: 1.4,
        letterSpacing: 0.05,
        color: '#f0f0f0',
        textAlign: 'center',
        textTransform: 'none',
        textDecoration: 'none',
        textShadow: {
          color: 'rgba(255, 255, 255, 0.2)',
          blur: 8,
          offsetX: 0,
          offsetY: 2,
        },
      },
      layout: {
        position: { x: 0, y: 0 },
        width: 1920,
        height: 1080,
        padding: { top: 40, right: 40, bottom: 40, left: 40 },
        margin: { top: 0, right: 0, bottom: 0, left: 0 },
        alignment: 'center',
        verticalAlignment: 'middle',
      },
      animation: {
        type: 'reveal',
        duration: 0.8,
        delay: 0.1,
        easing: 'ease-in-out',
      },
      presets: [],
    });

    // Tech style
    this.registerStyle({
      name: 'tech',
      config: {
        fontFamily: 'Monaco, Consolas, monospace',
        fontSize: 32,
        fontWeight: 500,
        lineHeight: 1.3,
        letterSpacing: 0,
        color: '#00ff88',
        textAlign: 'left',
        textTransform: 'none',
        textDecoration: 'none',
        textShadow: {
          color: 'rgba(0, 255, 136, 0.5)',
          blur: 6,
          offsetX: 0,
          offsetY: 0,
        },
      },
      layout: {
        position: { x: 100, y: 100 },
        width: 1720,
        height: 880,
        padding: { top: 20, right: 20, bottom: 20, left: 20 },
        margin: { top: 0, right: 0, bottom: 0, left: 0 },
        alignment: 'start',
        verticalAlignment: 'top',
      },
      animation: {
        type: 'typewriter',
        duration: 1.5,
        delay: 0,
        easing: 'linear',
      },
      presets: [],
    });

    // Playful style
    this.registerStyle({
      name: 'playful',
      config: {
        fontFamily: 'Comic Sans MS, cursive',
        fontSize: 42,
        fontWeight: 600,
        lineHeight: 1.3,
        letterSpacing: 0.02,
        color: '#ff6b6b',
        textAlign: 'center',
        textTransform: 'none',
        textDecoration: 'none',
      },
      layout: {
        position: { x: 0, y: 0 },
        width: 1920,
        height: 1080,
        padding: { top: 0, right: 0, bottom: 0, left: 0 },
        margin: { top: 0, right: 0, bottom: 0, left: 0 },
        alignment: 'center',
        verticalAlignment: 'middle',
      },
      animation: {
        type: 'bounce',
        duration: 0.8,
        delay: 0,
        easing: 'bounce',
      },
      presets: [],
    });
  }

  /**
   * Register a custom typography style
   */
  registerStyle(style: TypographyStyle): void {
    this.styles.set(style.name, style);
  }

  /**
   * Get style by name
   */
  getStyle(name: string): TypographyStyle | undefined {
    return this.styles.get(name);
  }

  /**
   * Get all available styles
   */
  getAllStyles(): TypographyStyle[] {
    return Array.from(this.styles.values());
  }

  /**
   * Calculate text metrics for layout
   */
  calculateTextMetrics(text: string, config: TypographyConfig): {
    width: number;
    height: number;
    lines: string[];
  } {
    const lines = this.wrapText(text, config);
    const lineHeight = config.fontSize * config.lineHeight;
    const maxLineWidth = Math.max(...lines.map(line => this.measureText(line, config)));
    
    return {
      width: maxLineWidth,
      height: lines.length * lineHeight,
      lines,
    };
  }

  /**
   * Wrap text to fit within width
   */
  private wrapText(text: string, config: TypographyConfig, maxWidth: number = 1920): string[] {
    const words = text.split(' ');
    const lines: string[] = [];
    let currentLine = '';

    words.forEach(word => {
      const testLine = currentLine ? `${currentLine} ${word}` : word;
      const lineWidth = this.measureText(testLine, config);

      if (lineWidth <= maxWidth) {
        currentLine = testLine;
      } else {
        if (currentLine) {
          lines.push(currentLine);
        }
        currentLine = word;
      }
    });

    if (currentLine) {
      lines.push(currentLine);
    }

    return lines;
  }

  /**
   * Measure text width (simplified)
   */
  private measureText(text: string, config: TypographyConfig): number {
    // In production, use canvas or text measurement library
    const avgCharWidth = config.fontSize * 0.6;
    return text.length * avgCharWidth * (1 + config.letterSpacing);
  }

  /**
   * Generate text animation keyframes
   */
  generateAnimationKeyframes(
    text: string,
    animation: TextAnimation
  ): Array<{ time: number; value: any }> {
    const keyframes: Array<{ time: number; value: any }> = [];

    switch (animation.type) {
      case 'fade':
        keyframes.push(
          { time: 0, value: { opacity: 0 } },
          { time: 1, value: { opacity: 1 } }
        );
        break;

      case 'slide':
        keyframes.push(
          { time: 0, value: { transform: 'translateY(50px)', opacity: 0 } },
          { time: 1, value: { transform: 'translateY(0)', opacity: 1 } }
        );
        break;

      case 'typewriter':
        const chars = text.length;
        for (let i = 0; i <= chars; i++) {
          keyframes.push({
            time: i / chars,
            value: { text: text.substring(0, i), cursor: i < chars },
          });
        }
        break;

      case 'glitch':
        for (let i = 0; i <= 10; i++) {
          keyframes.push({
            time: i / 10,
            value: {
              transform: `translate(${Math.random() * 10 - 5}px, ${Math.random() * 10 - 5}px)`,
              opacity: i % 2 === 0 ? 1 : 0.8,
            },
          });
        }
        break;

      case 'reveal':
        keyframes.push(
          { time: 0, value: { clipPath: 'inset(0 100% 0 0)' } },
          { time: 1, value: { clipPath: 'inset(0 0 0 0)' } }
        );
        break;

      case 'bounce':
        keyframes.push(
          { time: 0, value: { transform: 'translateY(0)', opacity: 0 } },
          { time: 0.2, value: { transform: 'translateY(-20px)', opacity: 1 } },
          { time: 0.4, value: { transform: 'translateY(0)', opacity: 1 } },
          { time: 0.6, value: { transform: 'translateY(-10px)', opacity: 1 } },
          { time: 0.8, value: { transform: 'translateY(0)', opacity: 1 } },
          { time: 1, value: { transform: 'translateY(0)', opacity: 1 } }
        );
        break;

      case 'wave':
        const charsWave = text.length;
        for (let i = 0; i <= charsWave; i++) {
          keyframes.push({
            time: i / charsWave,
            value: {
              waveOffset: Math.sin(i * 0.5) * 10,
              charIndex: i,
            },
          });
        }
        break;

      case 'gradient':
        keyframes.push(
          { time: 0, value: { backgroundPosition: '0% 50%' } },
          { time: 1, value: { backgroundPosition: '100% 50%' } }
        );
        break;

      case 'blur':
        keyframes.push(
          { time: 0, value: { filter: 'blur(10px)', opacity: 0 } },
          { time: 1, value: { filter: 'blur(0px)', opacity: 1 } }
        );
        break;
    }

    return keyframes;
  }

  /**
   * Apply typography style to text
   */
  applyStyle(text: string, styleName: string): any {
    const style = this.styles.get(styleName);
    if (!style) {
      console.warn(`Style ${styleName} not found, using minimal`);
      return this.applyStyle(text, 'minimal');
    }

    const metrics = this.calculateTextMetrics(text, style.config);
    const animationKeyframes = style.animation
      ? this.generateAnimationKeyframes(text, style.animation)
      : [];

    return {
      text,
      config: style.config,
      layout: style.layout,
      metrics,
      animation: style.animation,
      keyframes: animationKeyframes,
    };
  }

  /**
   * Create responsive typography config
   */
  createResponsiveConfig(baseConfig: TypographyConfig, viewport: { width: number; height: number }): TypographyConfig {
    const scaleFactor = Math.min(viewport.width / 1920, viewport.height / 1080);
    
    return {
      ...baseConfig,
      fontSize: Math.round(baseConfig.fontSize * scaleFactor),
      lineHeight: baseConfig.lineHeight,
      letterSpacing: baseConfig.letterSpacing * scaleFactor,
    };
  }

  /**
   * Suggest optimal typography for content
   */
  suggestTypography(content: string, context: {
    mood: 'energetic' | 'calm' | 'dramatic' | 'professional' | 'playful' | 'mysterious';
    sceneType: 'intro' | 'content' | 'highlight' | 'outro';
    duration: number;
  }): TypographyStyle {
    const moodStyles: Record<string, string> = {
      energetic: 'bold',
      calm: 'elegant',
      dramatic: 'bold',
      professional: 'minimal',
      playful: 'playful',
      mysterious: 'elegant',
    };

    const sceneAdjustments: Record<string, Partial<TypographyConfig>> = {
      intro: { fontSize: 48, fontWeight: 700 },
      content: { fontSize: 24, fontWeight: 400 },
      highlight: { fontSize: 36, fontWeight: 600 },
      outro: { fontSize: 32, fontWeight: 500 },
    };

    const baseStyle = this.getStyle(moodStyles[context.mood] || 'minimal');
    if (!baseStyle) return this.getStyle('minimal')!;

    const adjustment = sceneAdjustments[context.sceneType] || {};
    const adjustedConfig = { ...baseStyle.config, ...adjustment };

    return {
      ...baseStyle,
      config: adjustedConfig,
    };
  }

  /**
   * Register custom font
   */
  registerFont(name: string, fontData: any): void {
    this.fonts.set(name, fontData);
  }

  /**
   * Get font by name
   */
  getFont(name: string): any {
    return this.fonts.get(name);
  }

  /**
   * Create text hierarchy for video
   */
  createTextHierarchy(content: {
    title?: string;
    subtitle?: string;
    body?: string;
    callToAction?: string;
  }, baseStyle: string = 'minimal'): any {
    const hierarchy: any = {};

    if (content.title) {
      const titleStyle = this.suggestTypography(content.title, {
        mood: 'professional',
        sceneType: 'intro',
        duration: 3,
      });
      hierarchy.title = this.applyStyle(content.title, titleStyle.name);
    }

    if (content.subtitle) {
      const subtitleStyle = this.suggestTypography(content.subtitle, {
        mood: 'professional',
        sceneType: 'content',
        duration: 2,
      });
      hierarchy.subtitle = this.applyStyle(content.subtitle, subtitleStyle.name);
    }

    if (content.body) {
      const bodyStyle = this.getStyle('minimal');
      hierarchy.body = this.applyStyle(content.body, bodyStyle?.name || 'minimal');
    }

    if (content.callToAction) {
      const ctaStyle = this.suggestTypography(content.callToAction, {
        mood: 'energetic',
        sceneType: 'highlight',
        duration: 2,
      });
      hierarchy.callToAction = this.applyStyle(content.callToAction, ctaStyle.name);
    }

    return hierarchy;
  }

  /**
   * Clear text cache
   */
  clearCache(): void {
    this.textCache.clear();
  }

  /**
   * Generate typography CSS
   */
  generateCSS(config: TypographyConfig): string {
    const css = `
      font-family: ${config.fontFamily};
      font-size: ${config.fontSize}px;
      font-weight: ${config.fontWeight};
      line-height: ${config.lineHeight};
      letter-spacing: ${config.letterSpacing}em;
      color: ${config.color};
      text-align: ${config.textAlign};
      text-transform: ${config.textTransform};
      text-decoration: ${config.textDecoration};
      ${config.textShadow ? `
        text-shadow: ${config.textShadow.offsetX}px ${config.textShadow.offsetY}px ${config.textShadow.blur}px ${config.textShadow.color};
      ` : ''}
    `;
    return css;
  }
}

export const typographyEngine = new TypographyEngine();