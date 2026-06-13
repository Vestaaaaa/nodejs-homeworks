import { staleOrderQueue } from '../queues/order.queue.js';

export async function scheduleStaleOrderJob(orderId: string) {
  await staleOrderQueue.add(
    `stale-check-${orderId}`,
    { orderId },
    {
      delay: 2 * 60 * 60 * 1000, 
      jobId: `stale-${orderId}`, 
    }
  );
  console.log(`[StaleOrderJob] Scheduled for order ${orderId} in 2 hours`);
}