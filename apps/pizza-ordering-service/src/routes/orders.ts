import { FastifyInstance } from 'fastify';
import { scheduleStaleOrderJob } from '../jobs/stale-order.job.js';

let orders: any[] = [];
let nextId = 1;

export async function orderRoutes(app: FastifyInstance) {
  app.post('/orders', async (request, reply) => {
    const { pizzaType, amount } = request.body as { pizzaType: string; amount: number };
 
    const newOrder = {
      id: String(nextId++),
      pizzaType,
      amount,
      status: 'pending',
      createdAt: new Date(),
    };
    
    orders.push(newOrder);
    
    await scheduleStaleOrderJob(newOrder.id);
    console.log(`[OrderRoutes] Created order ${newOrder.id}, scheduled stale check in 2 hours`);
    
    return reply.status(201).send(newOrder);
  });

  app.get('/orders/:id', async (request, reply) => {
    const { id } = request.params as { id: string };
    const order = orders.find(o => o.id === id);
    
    if (!order) {
      return reply.status(404).send({ error: 'Order not found' });
    }
    
    return reply.send(order);
  });
  
  app.patch('/orders/:id/status', async (request, reply) => {
    const { id } = request.params as { id: string };
    const { status } = request.body as { status: string };
    
    const order = orders.find(o => o.id === id);
    if (!order) {
      return reply.status(404).send({ error: 'Order not found' });
    }
    
    order.status = status;
    return reply.send(order);
  });
}