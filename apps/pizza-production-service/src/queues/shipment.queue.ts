import { Queue, Worker } from 'bullmq';
import { ShipmentRepository } from '../repositories/shipment.repository.js';

const connection = {
  host: process.env.REDIS_HOST || 'localhost',
  port: parseInt(process.env.REDIS_PORT || '6379'),
};

export const expirationQueue = new Queue('expiration', { connection });

const shipmentRepository = new ShipmentRepository();

export const expirationWorker = new Worker(
  'expiration',
  async (job) => {
    console.log(`[ExpirationWorker] Running at ${new Date().toISOString()}`);
    
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    
    const allShipments = await shipmentRepository.getAllShipments();
    const oldShipments = allShipments.filter(
      shipment => new Date(shipment.createdAt) < oneWeekAgo
    );
    
    console.log(`[ExpirationWorker] Found ${oldShipments.length} old shipments`);
    
    for (const shipment of oldShipments) {
      await shipmentRepository.deleteShipment(shipment.id);
      console.log(`[ExpirationWorker] Deleted shipment ${shipment.id}`);
    }
    
    return { deletedCount: oldShipments.length };
  },
  { connection }
);

expirationWorker.on('completed', (job) => {
  console.log(`[ExpirationWorker] Job ${job.id} completed, deleted ${job.returnvalue?.deletedCount} shipments`);
});

expirationWorker.on('failed', (job, err) => {
  console.error(`[ExpirationWorker] Job ${job?.id} failed:`, err.message);
});