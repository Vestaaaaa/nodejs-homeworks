import Fastify from 'fastify';
import { ordersContract } from '@repo/api-contracts';

const app = Fastify();

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
    });

    console.log('Ordering service running on port 3001');
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

start();