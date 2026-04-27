import { PrismaClient } from "@prisma/client";
import { toError } from "../utils/errors";
import { CreateGoalType } from "../types/goal/goal.create";

export class GoalRepository {
  constructor(private readonly prisma: PrismaClient) {
    this.prisma = prisma;
  }

  async createGoal(data: CreateGoalType, user_id: number) {
    try {
      const { goal_name, goal_amount, target_date, contribution_frequency } =
        data;
      const goal = await this.prisma.goal.create({
        data: {
          user_id,
          goal_name,
          goal_amount,
          goal_status: "ONGOING",
          goal_currency: "PHP",
          goal_type: "SAVINGS",
          target_date,
          contribution_frequency,
        },
      });
      return goal;
    } catch (err) {
      throw toError(err);
    }
  }

  async getGoalPerUser(user_id: number) {
    try {
      return this.prisma.goal.findMany({
        where: {
          user_id,
        },
      });
    } catch (err) {
      throw toError(err);
    }
  }
}
