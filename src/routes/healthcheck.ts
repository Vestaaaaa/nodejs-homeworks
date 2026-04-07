import { FastifyInstance } from "fastify";

export async function healthcheckRoutes(app: FastifyInstance) {
  app.get("/health", async (_request, reply) => {
    reply.type("text/plain").send("OK");
  });
}
