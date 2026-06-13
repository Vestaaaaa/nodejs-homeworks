import Fastify from 'fastify';
import { ordersContract } from '@repo/api-contracts';
import { orderRoutes } from './routes/orders.js';
import './queues/order.queue.js'; // Регистрация воркера

const app = Fastify();

app.register(orderRoutes);
app.post(
  ordersContract.markOrderReady.path,
  async () => {
    console.log('Order received from production service');
    return {
      success: true,
      message: 'Order marked as ready',
    };
  },
);

const start = async () => {
  try {
    await app.listen({
      port: 3001,
      host: '0.0.0.0',
    });
    console.log('Ordering service running on port 3001');
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

start();