// Simple mock worker that processes render jobs without Redis/BullMQ
const { getStorage } = require('../src/lib/db-mock');
const fs = require('fs');
const path = require('path');

console.log('Starting simple render worker...');

// Create renders directory
const rendersDir = '/tmp/renders';
if (!fs.existsSync(rendersDir)) {
  fs.mkdirSync(rendersDir, { recursive: true });
  console.log('Created renders directory:', rendersDir);
}

// Process jobs periodically
setInterval(async () => {
  const storage = getStorage();
  const jobs = Array.from(storage.renderJobs.values());
  
  // Find pending jobs
  const pendingJobs = jobs.filter(job => job.status === 'pending');
  
  if (pendingJobs.length > 0) {
    console.log(`Found ${pendingJobs.length} pending jobs`);
    
    for (const job of pendingJobs) {
      console.log(`Processing job: ${job.id}`);
      
      // Update status to processing
      job.status = 'processing';
      job.progress = 0;
      storage.renderJobs.set(job.id, job);
      
      // Simulate rendering progress
      for (let i = 0; i <= 100; i += 10) {
        await new Promise(resolve => setTimeout(resolve, 500));
        job.progress = i;
        storage.renderJobs.set(job.id, job);
        console.log(`Job ${job.id} progress: ${i}%`);
      }
      
      // Create output path
      const outputPath = path.join(rendersDir, `${job.id}.${job.output_format}`);
      
      // Create a dummy video file
      const dummyContent = `Dummy video content for job ${job.id}`;
      fs.writeFileSync(outputPath, dummyContent);
      
      // Update job as completed
      job.status = 'completed';
      job.progress = 100;
      job.output_path = outputPath;
      job.output_duration = 10;
      job.output_size = dummyContent.length;
      storage.renderJobs.set(job.id, job);
      
      console.log(`Job ${job.id} completed. Output: ${outputPath}`);
    }
  }
}, 2000);

console.log('Simple render worker is running. Press Ctrl+C to stop.');