import { FastifyPluginAsync } from "fastify";
import "dotenv/config";
import { PrismaClient } from "../generated/prisma/client.js";
import { PrismaPg } from "@prisma/adapter-pg";
import fp from "fastify-plugin";

const prismaPlugin: FastifyPluginAsync = async (fastify) => {
  console.log("Initializing Prisma Client...");
  const prisma = new PrismaClient({
    adapter: new PrismaPg({ connectionString: fastify.config.DATABASE_URL }),
  });

  fastify.addHook("onClose", async (instance, done) => {
    await prisma.$disconnect();
    done();
  });

  fastify.decorate("prisma", prisma);
  console.log("Prisma Client initialized successfully.");
};

export default fp(prismaPlugin);
