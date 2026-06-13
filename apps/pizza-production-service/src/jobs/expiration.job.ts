import { expirationQueue } from '../queues/shipment.queue.js';

export async function scheduleExpirationJob() {
  await expirationQueue.add(
    'expiration-job',
    {},
    {
      repeat: {
        pattern: '0 0 * * *', 
      },
    }
  );
  console.log('[ExpirationJob] Scheduled to run daily at midnight');
}