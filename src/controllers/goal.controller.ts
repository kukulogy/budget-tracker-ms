import { FastifyInstance, FastifyRequest, FastifyReply } from "fastify";
import { GoalService } from "../services/goal.service";
import { CreateGoalRequest } from "../types/goal/goal.create";
import { toHttpError } from "../utils/errors";

export class GoalController {
  private goalService: GoalService;

  constructor(private readonly fastify: FastifyInstance) {
    this.goalService = new GoalService(this.fastify.prisma);
  }

  createGoal = async (
    req: FastifyRequest<CreateGoalRequest>,
    res: FastifyReply<CreateGoalRequest>,
  ) => {
    try {
      const goal = await this.goalService.createGoal(req.body, req.user.id);

      return res.send({
        status: 200,
        code: "GOAL_CREATION_SUCCESS",
        data: goal,
      });
    } catch (err) {
      console.log(err);
      const error = toHttpError(err, "GOAL_CREATION_FAILED");
      return res.status(400).send({
        status: error.statusCode,
        code: error.code,
        data: { message: error.message },
      });
    }
  };

  getGoals = async (req: FastifyRequest, res: FastifyReply) => {
    try {
      const user_id = req.user.id;
      const goals = await this.goalService.getGoalPerUser(user_id);

      return res.send({
        status: 200,
        code: "GOAL_FETCH_SUCCESS",
        data: goals,
      });
    } catch (err) {
      const error = toHttpError(err, "GOAL_FETCH_FAILED");
      return res.status(400).send({
        status: error.statusCode,
        code: error.code,
        data: { message: error.message },
      });
    }
  };
}
