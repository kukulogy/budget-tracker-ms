import Fastify from "fastify";
import fastifyEnv from "@fastify/env";
import { Config, config } from "./config/config";
import fastifyPrintRoutes from "fastify-print-routes";
import rootRoutes from "./routes/root.routes";
import userRoutes from "./routes/user.routes";
import prisma from "./plugins/prisma";

const app = Fastify({
  logger: true,
});

const options = {
  confKey: "config",
  schema: config,
  dotenv: true,
};

await app.register(fastifyEnv, options);
await app.register(prisma);

app.register(fastifyPrintRoutes);
app.register(rootRoutes);
app.register(userRoutes, { prefix: "/api/v1/users" });
await app.ready();

app.listen({ port: app.config.PORT }, (err, address) => {
  app.log.debug(`Listening to port ${address}:${app.config.PORT}`);
  console.log(`${JSON.stringify(app.config)}`);

  if (err) {
    app.log.error(err);
    process.exit(1);
  }
});
