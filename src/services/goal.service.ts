import { GoalRepository } from "../repositories/goal.repository";
import { PrismaClient } from "@prisma/client";
import { toError } from "../utils/errors";

export class GoalService {
  private goalRepository: GoalRepository;

  constructor(
    private readonly prisma: PrismaClient,
    deps?: { goalRepository?: GoalRepository },
  ) {
    this.prisma = prisma;
    this.goalRepository =
      deps?.goalRepository ?? new GoalRepository(this.prisma);
  }

  async createGoal(user_id: number, goal_amount: number, goal_name: string) {
    try {
      const goal = await this.goalRepository.createGoal(
        user_id,
        goal_amount,
        goal_name,
      );

      return goal;
    } catch (err) {
      throw toError(err);
    }
  }

  async getGoalPerUser(user_id: number) {
    try {
      const goals = await this.goalRepository.getGoalPerUser(user_id);
      return goals;
    } catch (err) {
      throw toError(err);
    }
  }
}
