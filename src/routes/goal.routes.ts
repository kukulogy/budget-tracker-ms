import { FastifyInstance } from "fastify";
import { CreateGoalSchema } from "../types/goal/goal.create";
import { GoalController } from "../controllers/goal.controller";

const goalRoutes = (fastify: FastifyInstance) => {
  const goalController = new GoalController(fastify);
  fastify.get(
    "/goals",
    { preHandler: [fastify.authenticate] },
    goalController.getGoals,
  );
  fastify.post(
    "/goals",
    {
      schema: { body: CreateGoalSchema },
      preHandler: [fastify.authenticate],
    },
    goalController.createGoal,
  );
};

export default goalRoutes;
