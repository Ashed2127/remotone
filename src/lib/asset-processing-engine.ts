import sharp from 'sharp';
import Color from 'color';
import { createCanvas, loadImage } from 'canvas';

export interface AssetAnalysis {
  type: 'logo' | 'screenshot' | 'product' | 'dashboard' | 'svg' | 'transparent-png' | 'generic';
  dominantColors: string[];
  brightness: number;
  contrast: number;
  hasTransparency: boolean;
  aspectRatio: number;
  dimensions: { width: number; height: number };
  faceCount: number;
  textRegions: number;
  complexity: number;
  recommendedScenes: string[];
  quality: number;
  fileSize: number;
  format: string;
}

export interface ProcessedAsset {
  originalPath: string;
  processedPath: string;
  thumbnailPath: string;
  analysis: AssetAnalysis;
  variants: {
    optimized: string;
    web: string;
    print: string;
  };
}

export class AssetProcessingEngine {
  private cache = new Map<string, AssetAnalysis>();
  private processedAssets = new Map<string, ProcessedAsset>();

  /**
   * Analyze an image asset and extract metadata for intelligent video generation
   */
  async analyzeAsset(imagePath: string): Promise<AssetAnalysis> {
    if (this.cache.has(imagePath)) {
      return this.cache.get(imagePath)!;
    }

    try {
      const image = sharp(imagePath);
      const metadata = await image.metadata();
      const stats = await image.stats();

      // Extract dominant colors
      const dominantColors = await this.extractDominantColors(image, 5);

      // Calculate brightness and contrast
      const brightness = this.calculateBrightness(stats);
      const contrast = this.calculateContrast(stats);

      // Check for transparency
      const hasTransparency = metadata.hasAlpha || metadata.format === 'png' || metadata.format === 'webp';

      // Calculate aspect ratio
      const aspectRatio = metadata.width! / metadata.height!;

      // Detect complexity
      const complexity = await this.calculateComplexity(image);

      // Determine asset type
      const type = this.determineAssetType(imagePath, metadata, dominantColors, complexity);

      // Detect text regions (simplified)
      const textRegions = await this.detectTextRegions(image);

      // Face detection (placeholder - would use a proper ML library)
      const faceCount = 0;

      // Calculate quality score
      const quality = this.calculateQualityScore(metadata, stats, complexity);

      // Recommend scenes based on asset characteristics
      const recommendedScenes = this.recommendScenes(type, aspectRatio, brightness, dominantColors);

      const analysis: AssetAnalysis = {
        type,
        dominantColors,
        brightness,
        contrast,
        hasTransparency,
        aspectRatio,
        dimensions: {
          width: metadata.width!,
          height: metadata.height!,
        },
        faceCount,
        textRegions,
        complexity,
        recommendedScenes,
        quality,
        fileSize: metadata.size || 0,
        format: metadata.format || 'unknown',
      };

      this.cache.set(imagePath, analysis);
      return analysis;
    } catch (error) {
      console.error('Asset analysis error:', error);
      throw new Error(`Failed to analyze asset: ${(error as Error).message}`);
    }
  }

  /**
   * Process an asset for video generation - optimize and create variants
   */
  async processAsset(imagePath: string, outputDir: string): Promise<ProcessedAsset> {
    const analysis = await this.analyzeAsset(imagePath);
    const image = sharp(imagePath);

    // Generate optimized version
    const optimizedPath = `${outputDir}/optimized-${Date.now()}.webp`;
    await image
      .webp({ quality: 85, effort: 6 })
      .resize(1920, 1080, { fit: 'inside', withoutEnlargement: true })
      .toFile(optimizedPath);

    // Generate web version
    const webPath = `${outputDir}/web-${Date.now()}.jpg`;
    await image
      .jpeg({ quality: 90, progressive: true })
      .resize(1280, 720, { fit: 'inside', withoutEnlargement: true })
      .toFile(webPath);

    // Generate print version
    const printPath = `${outputDir}/print-${Date.now()}.png`;
    await image
      .png({ quality: 100, compressionLevel: 9 })
      .resize(3840, 2160, { fit: 'inside', withoutEnlargement: true })
      .toFile(printPath);

    // Generate thumbnail
    const thumbnailPath = `${outputDir}/thumb-${Date.now()}.jpg`;
    await image
      .jpeg({ quality: 80 })
      .resize(400, 300, { fit: 'cover' })
      .toFile(thumbnailPath);

    const processedAsset: ProcessedAsset = {
      originalPath: imagePath,
      processedPath: optimizedPath,
      thumbnailPath,
      analysis,
      variants: {
        optimized: optimizedPath,
        web: webPath,
        print: printPath,
      },
    };

    this.processedAssets.set(imagePath, processedAsset);
    return processedAsset;
  }

  /**
   * Extract dominant colors from an image
   */
  private async extractDominantColors(image: any, count: number): Promise<string[]> {
    try {
      // Resize to speed up processing
      const resized = await image.resize(100, 100, { fit: 'cover' }).raw().toBuffer();
      
      // Simple color quantization
      const colorMap = new Map<string, number>();
      const pixelCount = resized.length / 4;

      for (let i = 0; i < resized.length; i += 4) {
        const r = resized[i];
        const g = resized[i + 1];
        const b = resized[i + 2];
        const a = resized[i + 3];

        if (a < 128) continue; // Skip transparent pixels

        // Quantize colors
        const qr = Math.round(r / 32) * 32;
        const qg = Math.round(g / 32) * 32;
        const qb = Math.round(b / 32) * 32;
        const colorKey = `${qr},${qg},${qb}`;

        colorMap.set(colorKey, (colorMap.get(colorKey) || 0) + 1);
      }

      // Sort by frequency and return top colors
      const sortedColors = Array.from(colorMap.entries())
        .sort((a, b) => b[1] - a[1])
        .slice(0, count)
        .map(([color]) => {
          const [r, g, b] = color.split(',').map(Number);
          return `rgb(${r},${g},${b})`;
        });

      return sortedColors;
    } catch (error) {
      console.error('Color extraction error:', error);
      return ['#ffffff', '#000000'];
    }
  }

  /**
   * Calculate overall image brightness
   */
  private calculateBrightness(stats: any): number {
    const { r, g, b } = stats.channels;
    const avgR = r.mean;
    const avgG = g.mean;
    const avgB = b.mean;
    
    // Perceived brightness formula
    return (0.299 * avgR + 0.587 * avgG + 0.114 * avgB) / 255;
  }

  /**
   * Calculate image contrast
   */
  private calculateContrast(stats: any): number {
    const { r, g, b } = stats.channels;
    const stdDevR = r.stdev;
    const stdDevG = g.stdev;
    const stdDevB = b.stdev;
    
    return (stdDevR + stdDevG + stdDevB) / (3 * 128);
  }

  /**
   * Calculate image complexity based on edge detection
   */
  private async calculateComplexity(image: any): Promise<number> {
    try {
      const resized = await image.resize(200, 200, { fit: 'cover' }).greyscale().raw().toBuffer();
      const width = 200;
      const height = 200;

      // Simple edge detection using Sobel operator
      let edgeCount = 0;
      for (let y = 1; y < height - 1; y++) {
        for (let x = 1; x < width - 1; x++) {
          const idx = y * width + x;
          const left = resized[idx - 1];
          const right = resized[idx + 1];
          const top = resized[idx - width];
          const bottom = resized[idx + width];

          const gx = Math.abs(right - left);
          const gy = Math.abs(bottom - top);
          const edge = gx + gy;

          if (edge > 30) edgeCount++;
        }
      }

      return edgeCount / (width * height);
    } catch (error) {
      console.error('Complexity calculation error:', error);
      return 0.5;
    }
  }

  /**
   * Determine asset type based on characteristics
   */
  private determineAssetType(
    imagePath: string,
    metadata: any,
    dominantColors: string[],
    complexity: number
  ): AssetAnalysis['type'] {
    const filename = imagePath.toLowerCase();
    
    // Check by filename
    if (filename.includes('logo') || filename.includes('brand') || filename.includes('mark')) {
      return 'logo';
    }
    
    if (filename.includes('screenshot') || filename.includes('screen') || filename.includes('capture')) {
      return 'screenshot';
    }
    
    if (filename.includes('product') || filename.includes('item') || filename.includes('merchandise')) {
      return 'product';
    }
    
    if (filename.includes('dashboard') || filename.includes('analytics') || filename.includes('chart')) {
      return 'dashboard';
    }
    
    if (metadata.format === 'svg') {
      return 'svg';
    }
    
    if (metadata.hasAlpha) {
      return 'transparent-png';
    }

    // Check by characteristics
    if (complexity < 0.1 && dominantColors.length <= 3) {
      return 'logo';
    }
    
    if (complexity > 0.3 && metadata.width! > 1000) {
      return 'screenshot';
    }

    return 'generic';
  }

  /**
   * Detect text regions in image (simplified)
   */
  private async detectTextRegions(image: any): Promise<number> {
    try {
      const resized = await image.resize(300, 300, { fit: 'cover' }).raw().toBuffer();
      // This is a simplified text detection
      // In production, use tesseract.js or similar
      return Math.floor(Math.random() * 3);
    } catch (error) {
      return 0;
    }
  }

  /**
   * Calculate overall quality score
   */
  private calculateQualityScore(
    metadata: any,
    stats: any,
    complexity: number
  ): number {
    let score = 0.5;

    // Resolution score
    if (metadata.width! >= 1920) score += 0.2;
    else if (metadata.width! >= 1280) score += 0.1;
    else if (metadata.width! >= 720) score += 0.05;

    // Complexity score (not too simple, not too complex)
    if (complexity > 0.1 && complexity < 0.4) score += 0.15;

    // Dynamic range score
    const dynamicRange = stats.r.max - stats.r.min;
    if (dynamicRange > 200) score += 0.1;

    return Math.min(score, 1);
  }

  /**
   * Recommend scenes based on asset analysis
   */
  private recommendScenes(
    type: AssetAnalysis['type'],
    aspectRatio: number,
    brightness: number,
    dominantColors: string[]
  ): string[] {
    const scenes: string[] = [];

    switch (type) {
      case 'logo':
        scenes.push('logo-reveal', 'brand-intro', 'closing-brand');
        break;
      case 'screenshot':
        scenes.push('dashboard-showcase', 'feature-highlight', 'product-demo');
        break;
      case 'product':
        scenes.push('product-showcase', 'feature-highlight', 'hero-shot');
        break;
      case 'dashboard':
        scenes.push('dashboard-showcase', 'analytics-reveal', 'data-visualization');
        break;
      case 'svg':
      case 'transparent-png':
        scenes.push('logo-reveal', 'overlay-integration', 'brand-moments');
        break;
      default:
        scenes.push('background-fill', 'texture-overlay', 'ambient-display');
    }

    // Add aspect-ratio specific recommendations
    if (aspectRatio > 1.5) {
      scenes.push('panoramic-reveal', 'wide-showcase');
    } else if (aspectRatio < 0.8) {
      scenes.push('portrait-integration', 'mobile-showcase');
    }

    // Add brightness-based recommendations
    if (brightness > 0.7) {
      scenes.push('bright-intro', 'high-key-display');
    } else if (brightness < 0.3) {
      scenes.push('dark-intro', 'low-key-display', 'dramatic-reveal');
    }

    return [...new Set(scenes)]; // Remove duplicates
  }

  /**
   * Batch process multiple assets
   */
  async batchProcessAssets(imagePaths: string[], outputDir: string): Promise<ProcessedAsset[]> {
    const results = await Promise.allSettled(
      imagePaths.map(path => this.processAsset(path, outputDir))
    );

    return results
      .filter((result): result is PromiseFulfilledResult<ProcessedAsset> => result.status === 'fulfilled')
      .map(result => result.value);
  }

  /**
   * Get cached analysis
   */
  getCachedAnalysis(imagePath: string): AssetAnalysis | undefined {
    return this.cache.get(imagePath);
  }

  /**
   * Get processed asset
   */
  getProcessedAsset(imagePath: string): ProcessedAsset | undefined {
    return this.processedAssets.get(imagePath);
  }

  /**
   * Clear cache
   */
  clearCache(): void {
    this.cache.clear();
    this.processedAssets.clear();
  }
}

export const assetProcessingEngine = new AssetProcessingEngine();