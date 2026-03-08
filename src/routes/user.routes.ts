import { FastifyInstance } from "fastify";
import { login } from "../controllers/user.controller";

const userRoutes = async (fastify: FastifyInstance, options) => {
  fastify.post("/login", login);
};

export default userRoutes;
