import { PrismaClient } from "@prisma/client";
import { toError } from "../utils/errors";

export class GoalRepository {
  constructor(private readonly prisma: PrismaClient) {
    this.prisma = prisma;
  }

  async createGoal(user_id: number, goal_amount: number, goal_name: string) {
    try {
      const goal = await this.prisma.goal.create({
        data: {
          user_id,
          goal_name,
          goal_status: "ONGOING",
          goal_amount,
          goal_currency: "PHP",
          goal_type: "SAVINGS",
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
