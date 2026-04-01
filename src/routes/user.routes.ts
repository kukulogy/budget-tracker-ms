import { FastifyInstance } from "fastify";
import { UserClass } from "../controllers/user.controller";
import { userRegistrationSchema } from "../types/user/user.registration.d.ts";

const userRoutes = async (fastify: FastifyInstance, options) => {
  const userController = new UserClass(fastify);

  fastify.post("/login", userController.login);
  fastify.post(
    "/registration",
    { schema: { body: userRegistrationSchema } },
    userController.registration,
  );
  fastify.get(
    "/dashboard",
    { preHandler: [fastify.authenticate] },
    userController.dashboard,
  );
};

export default userRoutes;
