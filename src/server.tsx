import Fastify from "fastify";
import fastifyPrintRoutes from 'fastify-print-routes'
import rootRoutes from "./routes/root.routes";
import userRoutes from "./routes/user.routes";

const app = Fastify({
  logger: true,
});

app.register(fastifyPrintRoutes);
app.register(rootRoutes);
app.register(userRoutes, { prefix: "/api/v1/users" });

app.listen({
  port: 3000
}, (err, address) => {
  app.log.debug("Hello World");

  if(err) {
    app.log.error(err);
    process.exit(1);
  }
})