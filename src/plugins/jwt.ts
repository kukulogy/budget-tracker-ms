import { FastifyPluginAsync } from "fastify";
import fp from "fastify-plugin";
import fastifyJwt from "@fastify/jwt";

const jwtPlugin: FastifyPluginAsync = async (fastify) => {
  if (!fastify.config.JWT_SECRET) {
    throw new Error("JWT_SECRET is not configured");
  }

  await fastify.register(fastifyJwt, {
    secret: fastify.config.JWT_SECRET,
  });

  fastify.decorate("authenticate", async (request, reply) => {
    try {
      await request.jwtVerify({ maxAge: "1h" });
    } catch (err) {
      reply.status(401).send({ status: 401, code: "UNAUTHORIZED" });
    }
  });
};

export default fp(jwtPlugin);
