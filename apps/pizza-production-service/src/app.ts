import Fastify from "fastify";
import { stockRoutes } from "./routes/stock.js";
import { healthcheckRoutes } from "./routes/healthcheck.js";
import { scheduleExpirationJob } from './jobs/expiration.job.js';

export function buildApp() {
  const app = Fastify();

  app.register(healthcheckRoutes);
  app.register(stockRoutes);

  return app;
}

export async function startBackgroundJobs() {
  await scheduleExpirationJob();
  console.log('Background jobs started');
}