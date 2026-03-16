import "fastify";
import { PrismaClient } from "@prisma/client";
import { Config } from "../config/config";

declare module "fastify" {
  interface FastifyInstance {
    config: Config;
    prisma: PrismaClient;
  }
}
