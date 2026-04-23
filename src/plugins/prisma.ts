import { FastifyPluginAsync } from "fastify";
import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import fp from "fastify-plugin";

const prismaPlugin: FastifyPluginAsync = async (fastify) => {
  console.log("Initializing Prisma Client...");

  const adapter = new PrismaPg({
    connectionString: fastify.config.DATABASE_URL,
  });
  const prisma = new PrismaClient({ adapter });

  fastify.addHook("onClose", async () => {
    await prisma.$disconnect();
  });

  fastify.decorate("prisma", prisma);
  console.log("Prisma Client initialized successfully.");
};

export default fp(prismaPlugin);
