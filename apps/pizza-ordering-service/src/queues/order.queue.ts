import { Queue, Worker } from 'bullmq';
import type { Job } from 'bullmq';

const connection = {
  host: process.env.REDIS_HOST || 'localhost',
  port: parseInt(process.env.REDIS_PORT || '6379'),
  maxRetriesPerRequest: null,
};

export const staleOrderQueue = new Queue('stale-orders', {
  connection,
  defaultJobOptions: {
    attempts: 3,
    backoff: {
      type: 'exponential',
      delay: 1000,
    },
    removeOnComplete: true,
    removeOnFail: false,
  },
});

interface StaleOrderJobData {
  orderId: string;
}

export const staleOrderWorker = new Worker(
  'stale-orders',
  async (job: Job<StaleOrderJobData>) => {
    const { orderId } = job.data;
    console.log(`[StaleOrderJob] Checking order ${orderId} at ${new Date().toISOString()}`);
    
    try {
      console.log(`[StaleOrderJob] Would check order ${orderId} for staleness`);
      return { success: true, orderId, status: 'checked' };
    } catch (error) {
      console.error(`[StaleOrderJob] Error processing order ${orderId}:`, error);
      throw error;
    }
  },
  {
    connection,
    concurrency: 5,
    limiter: {
      max: 10,
      duration: 1000,
    },
  }
);

staleOrderWorker.on('completed', (job: Job<StaleOrderJobData>) => {
  console.log(`[StaleOrderWorker] Job ${job.id} for order ${job.data.orderId} completed successfully`);
});

staleOrderWorker.on('failed', (job: Job<StaleOrderJobData> | undefined, err: Error) => {
  if (job) {
    console.error(`[StaleOrderWorker] Job ${job.id} for order ${job.data.orderId} failed:`, err);
  } else {
    console.error('[StaleOrderWorker] Job failed:', err);
  }
});

staleOrderWorker.on('error', (err: Error) => {
  console.error('[StaleOrderWorker] Worker error:', err);
});

export async function closeOrderQueue() {
  console.log('[OrderQueue] Closing queue and worker...');
  await staleOrderWorker.close();
  await staleOrderQueue.close();
  console.log('[OrderQueue] Queue and worker closed');
}

export async function getQueueStats() {
  const [waiting, active, completed, failed, delayed] = await Promise.all([
    staleOrderQueue.getWaitingCount(),
    staleOrderQueue.getActiveCount(),
    staleOrderQueue.getCompletedCount(),
    staleOrderQueue.getFailedCount(),
    staleOrderQueue.getDelayedCount(),
  ]);
  
  return {
    waiting,
    active,
    completed,
    failed,
    delayed,
    total: waiting + active + completed + failed + delayed,
  };
}

export async function cleanQueue() {
  await staleOrderQueue.obliterate({ force: true });
  console.log('[OrderQueue] Queue cleaned');
}

process.on('SIGTERM', async () => {
  console.log('[OrderQueue] SIGTERM received, closing...');
  await closeOrderQueue();
  process.exit(0);
});

process.on('SIGINT', async () => {
  console.log('[OrderQueue] SIGINT received, closing...');
  await closeOrderQueue();
  process.exit(0);
});