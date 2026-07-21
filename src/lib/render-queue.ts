import { Queue, Worker, Job } from 'bullmq';
import { redis } from './db-mock';

// Render job data interface
export interface RenderJobData {
  renderJobId: string;
  orgId: string;
  projectId: string;
  timelineId: string;
  userId: string;
  timeline: any; // Timeline JSON
  outputFormat: string;
  outputResolution: string;
}

// Render job result interface
export interface RenderJobResult {
  success: boolean;
  outputPath?: string;
  duration?: number;
  size?: number;
  error?: string;
}

// Queue configuration
const RENDER_QUEUE = 'render-jobs';
const CONCURRENCY = 2; // Number of parallel render workers

// Create render queue
export const renderQueue = new Queue<RenderJobData, RenderJobResult>(RENDER_QUEUE, {
  connection: redis,
  defaultJobOptions: {
    attempts: 3,
    backoff: {
      type: 'exponential',
      delay: 5000,
    },
    removeOnComplete: {
      count: 100, // Keep last 100 completed jobs
      age: 24 * 3600, // 24 hours
    },
    removeOnFail: {
      count: 500, // Keep last 500 failed jobs
      age: 7 * 24 * 3600, // 7 days
    },
  },
});

/**
 * Create a new render job
 */
export async function createRenderJob(data: RenderJobData): Promise<Job<RenderJobData, RenderJobResult>> {
  return await renderQueue.add('render', data, {
    jobId: data.renderJobId,
    priority: 5,
  });
}

/**
 * Get render job status
 */
export async function getRenderJobStatus(jobId: string): Promise<Job<RenderJobData, RenderJobResult> | undefined> {
  return await renderQueue.getJob(jobId);
}

/**
 * Update render job progress
 */
export async function updateRenderProgress(
  jobId: string,
  progress: number,
  message?: string
): Promise<void> {
  const job = await renderQueue.getJob(jobId);
  if (job) {
    await job.updateProgress(progress);
    if (message) {
      await job.log(message);
    }
  }
}

/**
 * Render worker implementation
 */
export function createRenderWorker(): Worker<RenderJobData, RenderJobResult> {
  const worker = new Worker<RenderJobData, RenderJobResult>(
    RENDER_QUEUE,
    async (job: Job<RenderJobData, RenderJobResult>) => {
      const { renderJobId, timeline, outputFormat, outputResolution } = job.data;

      try {
        // Update job status in database
        await updateRenderJobStatus(renderJobId, 'processing', 0);

        // Update initial progress
        await job.updateProgress(0);
        await job.log('Starting render job...');

        // Remotion server-side rendering
        // In a real implementation, this would:
        // 1. Load the Remotion composition
        // 2. Render using the timeline data
        // 3. Apply audio tracks
        // 4. Export to specified format

        const outputPath = `/tmp/renders/${renderJobId}.${outputFormat}`;

        // Placeholder for Remotion rendering
        // const result = await renderMedia({
        //   composition: 'Main',
        //   serveUrl: path.join(process.cwd(), 'src'),
        //   codec: 'h264',
        //   outputLocation: outputPath,
        //   inputProps: { timeline },
        //   onProgress: (progress) => {
        //     job.updateProgress(progress * 100);
        //   },
        // });

        // Simulate rendering progress
        for (let i = 0; i <= 100; i += 10) {
          await new Promise(resolve => setTimeout(resolve, 500));
          await job.updateProgress(i);
          await job.log(`Rendering progress: ${i}%`);
        }

        // Simulate successful render
        const duration = timeline.duration || 10;
        const size = Math.floor(duration * 1024 * 1024); // Approximate size

        await job.updateProgress(100);
        await job.log('Render completed successfully');

        // Update job status in database
        await updateRenderJobStatus(renderJobId, 'completed', 100, {
          outputPath,
          duration,
          size,
        });

        return {
          success: true,
          outputPath,
          duration,
          size,
        };
      } catch (error) {
        console.error('Render job error:', error);
        await job.log(`Render failed: ${(error as Error).message}`);

        // Update job status in database
        await updateRenderJobStatus(renderJobId, 'failed', 0, {
          error: (error as Error).message,
        });

        return {
          success: false,
          error: (error as Error).message,
        };
      }
    },
    {
      connection: redis,
      concurrency: CONCURRENCY,
    }
  );

  // Worker event handlers
  worker.on('completed', (job) => {
    console.log(`Render job ${job.id} completed`);
  });

  worker.on('failed', (job, error) => {
    console.error(`Render job ${job?.id} failed:`, error.message);
  });

  worker.on('progress', (job, progress) => {
    console.log(`Render job ${job.id} progress: ${progress}%`);
  });

  return worker;
}

/**
 * Update render job status in database
 */
async function updateRenderJobStatus(
  renderJobId: string,
  status: 'pending' | 'processing' | 'completed' | 'failed',
  progress: number,
  additionalData?: {
    outputPath?: string;
    duration?: number;
    size?: number;
    error?: string;
  }
): Promise<void> {
  const { pool } = await import('./db-mock');

  const query = `
    UPDATE render_jobs 
    SET status = $1, progress = $2, updated_at = CURRENT_TIMESTAMP
    ${additionalData?.outputPath ? ', output_path = $3' : ''}
    ${additionalData?.duration ? ', output_duration = $4' : ''}
    ${additionalData?.size ? ', output_size = $5' : ''}
    ${additionalData?.error ? ', error_message = $6' : ''}
    ${status === 'processing' ? ', started_at = CURRENT_TIMESTAMP' : ''}
    ${status === 'completed' ? ', completed_at = CURRENT_TIMESTAMP' : ''}
    WHERE id = $7
  `;

  const params: any[] = [status, progress];
  let paramIndex = 3;

  if (additionalData?.outputPath) {
    params.splice(paramIndex - 1, 0, additionalData.outputPath);
    paramIndex++;
  }
  if (additionalData?.duration) {
    params.splice(paramIndex - 1, 0, additionalData.duration);
    paramIndex++;
  }
  if (additionalData?.size) {
    params.splice(paramIndex - 1, 0, additionalData.size);
    paramIndex++;
  }
  if (additionalData?.error) {
    params.splice(paramIndex - 1, 0, additionalData.error);
    paramIndex++;
  }

  params.push(renderJobId);

  await pool.query(query, params);
}

/**
 * Cancel a render job
 */
export async function cancelRenderJob(jobId: string): Promise<void> {
  const job = await renderQueue.getJob(jobId);
  if (job) {
    await job.remove();
    await updateRenderJobStatus(jobId, 'failed', 0, {
      error: 'Job cancelled by user',
    });
  }
}

/**
 * Get queue statistics
 */
export async function getQueueStats(): Promise<{
  waiting: number;
  active: number;
  completed: number;
  failed: number;
}> {
  const [waiting, active, completed, failed] = await Promise.all([
    renderQueue.getWaitingCount(),
    renderQueue.getActiveCount(),
    renderQueue.getCompletedCount(),
    renderQueue.getFailedCount(),
  ]);

  return { waiting, active, completed, failed };
}
