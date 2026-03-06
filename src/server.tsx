import Fastify from "fastify";
import fastifyEnv from "@fastify/env";
import config from "./config/config.json"
import fastifyPrintRoutes from 'fastify-print-routes'
import rootRoutes from "./routes/root.routes";
import userRoutes from "./routes/user.routes";

const app = Fastify({
  logger: true,
});

const options = {
  confKey: 'config', 
  schema: config
}

app.register(fastifyPrintRoutes);
app.register(rootRoutes);
app.register(userRoutes, { prefix: "/api/v1/users" });
await app.register(fastifyEnv, options).ready((err) => {
  if (err) console.error(err);

  console.log(app.config);
  console.log(app.getEnvs());
});

app.after(() => {
  app.listen({
    port: app.config.PORT
  }, (err, address) => {
    app.log.debug("Hello World", app.config);

    if(err) {
      console.log(app.config.PORT);
      app.log.error(err);
      process.exit(1);
    }
  })
})