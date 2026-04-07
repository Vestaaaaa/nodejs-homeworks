import Fastify from "fastify";
import { stockRoutes } from "./routes/stock";
import { healthcheckRoutes } from "./routes/healthcheck";

export function buildApp() {
  const app = Fastify();

  app.register(healthcheckRoutes);
  app.register(stockRoutes);

  return app;
}
