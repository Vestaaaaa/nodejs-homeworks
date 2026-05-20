import { request } from 'undici';
import { ordersContract } from '@repo/api-contracts';

export async function notifyOrderReady() {
  const response = await request(
    `http://localhost:3001${ordersContract.markOrderReady.path}`,
    {
      method: ordersContract.markOrderReady.method,
      body: JSON.stringify({
        pizzaType: 'pepperoni',
        amount: 5,
      }),
      headers: {
        'content-type': 'application/json',
      },
    },
  );

  console.log('Ordering service response:', response.statusCode);
}