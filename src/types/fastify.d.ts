import "fastify";
import "@fastify/jwt";
import { FastifyReply, FastifyRequest } from "fastify";
import { PrismaClient } from "@prisma/client";
import { Config } from "../config/config";

declare module "fastify" {
  interface FastifyInstance {
    config: Config;
    prisma: PrismaClient;
    authenticate: (
      request: FastifyRequest,
      reply: FastifyReply,
    ) => Promise<void>;
  }
}

declare module "@fastify/jwt" {
  interface FastifyJWT {
    payload: {
      id: number;
      email: string;
      firstname: string;
      lastname: string;
      created_at: Date;
      updated_at: Date | null;
    };
    user: {
      id: number;
      email: string;
      firstname: string;
      lastname: string;
      created_at: Date;
      updated_at: Date | null;
    };
  }
}
