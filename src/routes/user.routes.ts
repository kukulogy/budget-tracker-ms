import { FastifyInstance } from "fastify";
import { UserClass } from "../controllers/user.controller";
import { UserRegistrationSchema } from "../types/user/user.registration";
import { UserLoginSchema } from "../types/user/user.login";

const userRoutes = async (fastify: FastifyInstance, options) => {
  const userController = new UserClass(fastify);

  fastify.post(
    "/login",
    { schema: { body: UserLoginSchema } },
    userController.login,
  );
  fastify.post(
    "/registration",
    { schema: { body: UserRegistrationSchema } },
    userController.registration,
  );
  fastify.get(
    "/dashboard",
    { preHandler: [fastify.authenticate] },
    userController.dashboard,
  );
};

export default userRoutes;
