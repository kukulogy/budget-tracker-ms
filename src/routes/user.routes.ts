import { FastifyInstance } from "fastify";
import { login, registration } from "../controllers/user.controller";

const userRoutes = async (fastify: FastifyInstance, options) => {
  fastify.post("/login", login);
  fastify.post("/registration", registration);
};

export default userRoutes;
