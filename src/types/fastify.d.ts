import "fastify";
import { Config } from "../config/config";

declare module 'fastify' {
  interface FastifyInstance {
    config: Config
  }
}