import { createRenderWorker } from '../src/lib/render-queue';

console.log('Starting render worker...');

const worker = createRenderWorker();

console.log('Render worker is running. Press Ctrl+C to stop.');

// Graceful shutdown
process.on('SIGINT', async () => {
  console.log('Shutting down render worker...');
  await worker.close();
  process.exit(0);
});
