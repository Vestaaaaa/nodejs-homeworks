import Fastify from "fastify";
import { stockRoutes } from "./routes/stock.js";
import { healthcheckRoutes } from "./routes/healthcheck.js";

export function buildApp() {
  const app = Fastify();

  app.register(healthcheckRoutes);
  app.register(stockRoutes);

  return app;
}