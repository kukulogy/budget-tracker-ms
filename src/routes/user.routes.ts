import { FastifyInstance } from "fastify";
import { login, registration } from "../controllers/user.controller";
import { userRegistrationSchema } from "../types/user/user.registration.d.ts";

const userRoutes = async (fastify: FastifyInstance, options) => {
  fastify.post("/login", login);
  fastify.post(
    "/registration",
    { schema: { body: userRegistrationSchema } },
    registration,
  );
};

export default userRoutes;
