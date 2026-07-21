import { S3Client, PutObjectCommand, GetObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { v4 as uuidv4 } from 'uuid';

// S3 Client configuration
const s3Client = new S3Client({
  region: process.env.AWS_REGION || 'us-east-1',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
  },
  endpoint: process.env.S3_ENDPOINT, // For local development with MinIO
  forcePathStyle: process.env.S3_FORCE_PATH_STYLE === 'true',
});

const BUCKET_NAME = process.env.S3_BUCKET_NAME || 'remotone-assets';

export interface AssetMetadata {
  id: string;
  orgId: string;
  projectId?: string;
  uploadedBy: string;
  assetType: 'image' | 'video' | 'audio' | 'font';
  filename: string;
  originalFilename: string;
  mimeType: string;
  fileSize: number;
  storagePath: string;
  cdnUrl?: string;
  status: 'processing' | 'ready' | 'failed';
  metadata: Record<string, any>;
}

export class AssetManager {
  /**
   * Upload a file to S3
   */
  async uploadFile(
    file: Buffer | Uint8Array,
    metadata: Omit<AssetMetadata, 'id' | 'storagePath' | 'status'>
  ): Promise<AssetMetadata> {
    const assetId = uuidv4();
    const extension = this.getFileExtension(metadata.originalFilename);
    const storagePath = `${metadata.orgId}/${assetId}.${extension}`;

    try {
      // Upload to S3
      const command = new PutObjectCommand({
        Bucket: BUCKET_NAME,
        Key: storagePath,
        Body: file,
        ContentType: metadata.mimeType,
        Metadata: {
          orgId: metadata.orgId,
          assetId,
          assetType: metadata.assetType,
          uploadedBy: metadata.uploadedBy,
        },
      });

      await s3Client.send(command);

      // Generate CDN URL (in production, this would use CloudFront)
      const cdnUrl = this.generateCdnUrl(storagePath);

      const assetMetadata: AssetMetadata = {
        id: assetId,
        ...metadata,
        storagePath,
        cdnUrl,
        status: 'ready',
      };

      // Save metadata to database
      await this.saveMetadataToDb(assetMetadata);

      return assetMetadata;
    } catch (error) {
      console.error('File upload error:', error);
      throw new Error(`Failed to upload file: ${(error as Error).message}`);
    }
  }

  /**
   * Get a presigned URL for file upload (for direct client uploads)
   */
  async getUploadPresignedUrl(
    orgId: string,
    filename: string,
    contentType: string
  ): Promise<{ url: string; storagePath: string }> {
    const assetId = uuidv4();
    const extension = this.getFileExtension(filename);
    const storagePath = `${orgId}/${assetId}.${extension}`;

    const command = new PutObjectCommand({
      Bucket: BUCKET_NAME,
      Key: storagePath,
      ContentType: contentType,
    });

    const url = await getSignedUrl(s3Client, command, { expiresIn: 3600 });

    return { url, storagePath };
  }

  /**
   * Get a presigned URL for file download
   */
  async getDownloadPresignedUrl(storagePath: string): Promise<string> {
    const command = new GetObjectCommand({
      Bucket: BUCKET_NAME,
      Key: storagePath,
    });

    return await getSignedUrl(s3Client, command, { expiresIn: 3600 });
  }

  /**
   * Delete an asset from S3 and database
   */
  async deleteAsset(assetId: string, orgId: string): Promise<void> {
    try {
      // Get asset metadata from database
      const asset = await this.getMetadataFromDb(assetId, orgId);
      if (!asset) {
        throw new Error('Asset not found');
      }

      // Delete from S3
      const deleteCommand = new DeleteObjectCommand({
        Bucket: BUCKET_NAME,
        Key: asset.storagePath,
      });

      await s3Client.send(deleteCommand);

      // Delete from database
      await this.deleteMetadataFromDb(assetId, orgId);
    } catch (error) {
      console.error('Asset deletion error:', error);
      throw new Error(`Failed to delete asset: ${(error as Error).message}`);
    }
  }

  /**
   * Validate file before upload
   */
  validateFile(
    filename: string,
    mimeType: string,
    fileSize: number,
    assetType: string
  ): { valid: boolean; error?: string } {
    // Check file size (max 500MB)
    const MAX_FILE_SIZE = 500 * 1024 * 1024;
    if (fileSize > MAX_FILE_SIZE) {
      return { valid: false, error: 'File size exceeds 500MB limit' };
    }

    // Validate MIME type based on asset type
    const allowedMimeTypes: Record<string, string[]> = {
      image: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
      video: ['video/mp4', 'video/webm', 'video/quicktime'],
      audio: ['audio/mpeg', 'audio/wav', 'audio/ogg', 'audio/webm'],
      font: ['font/ttf', 'font/otf', 'font/woff', 'font/woff2'],
    };

    if (!allowedMimeTypes[assetType]?.includes(mimeType)) {
      return { valid: false, error: `Invalid MIME type for ${assetType}` };
    }

    return { valid: true };
  }

  /**
   * Transcode video to standard format (placeholder for FFmpeg integration)
   */
  async transcodeVideo(
    inputPath: string,
    outputPath: string
  ): Promise<void> {
    // In production, this would use FFmpeg to:
    // 1. Normalize codec (H.264)
    // 2. Normalize resolution
    // 3. Normalize frame rate
    // 4. Generate thumbnails
    
    console.log(`Video transcoding: ${inputPath} -> ${outputPath}`);
    // Placeholder for FFmpeg implementation
  }

  /**
   * Generate thumbnails for video assets
   */
  async generateThumbnails(
    videoPath: string,
    outputDir: string
  ): Promise<string[]> {
    // In production, this would use FFmpeg to generate thumbnails
    console.log(`Generating thumbnails for ${videoPath}`);
    return [];
  }

  /**
   * Helper: Get file extension
   */
  private getFileExtension(filename: string): string {
    return filename.split('.').pop() || 'bin';
  }

  /**
   * Helper: Generate CDN URL
   */
  private generateCdnUrl(storagePath: string): string {
    const cdnDomain = process.env.CDN_DOMAIN || 'localhost';
    return `https://${cdnDomain}/${storagePath}`;
  }

  /**
   * Helper: Save metadata to database
   */
  private async saveMetadataToDb(metadata: AssetMetadata): Promise<void> {
    const { pool } = await import('./db');
    
    await pool.query(
      `INSERT INTO assets (
        id, org_id, project_id, uploaded_by, asset_type, 
        filename, original_filename, mime_type, file_size, 
        storage_path, cdn_url, metadata, status
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)`,
      [
        metadata.id,
        metadata.orgId,
        metadata.projectId || null,
        metadata.uploadedBy,
        metadata.assetType,
        metadata.filename,
        metadata.originalFilename,
        metadata.mimeType,
        metadata.fileSize,
        metadata.storagePath,
        metadata.cdnUrl || null,
        JSON.stringify(metadata.metadata),
        metadata.status,
      ]
    );
  }

  /**
   * Helper: Get metadata from database
   */
  private async getMetadataFromDb(
    assetId: string,
    orgId: string
  ): Promise<AssetMetadata | null> {
    const { pool } = await import('./db');
    
    const result = await pool.query(
      'SELECT * FROM assets WHERE id = $1 AND org_id = $2',
      [assetId, orgId]
    );

    if (result.rows.length === 0) {
      return null;
    }

    const row = result.rows[0];
    return {
      id: row.id,
      orgId: row.org_id,
      projectId: row.project_id,
      uploadedBy: row.uploaded_by,
      assetType: row.asset_type,
      filename: row.filename,
      originalFilename: row.original_filename,
      mimeType: row.mime_type,
      fileSize: row.file_size,
      storagePath: row.storage_path,
      cdnUrl: row.cdn_url,
      status: row.status,
      metadata: row.metadata,
    };
  }

  /**
   * Helper: Delete metadata from database
   */
  private async deleteMetadataFromDb(assetId: string, orgId: string): Promise<void> {
    const { pool } = await import('./db');
    
    await pool.query(
      'DELETE FROM assets WHERE id = $1 AND org_id = $2',
      [assetId, orgId]
    );
  }
}

// Singleton instance
export const assetManager = new AssetManager();
