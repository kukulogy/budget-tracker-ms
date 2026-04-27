import { GoalRepository } from "../repositories/goal.repository";
import { PrismaClient } from "@prisma/client";
import { toError } from "../utils/errors";
import { CreateGoalType } from "../types/goal/goal.create";

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

  async createGoal(data: CreateGoalType, user_id: number) {
    try {
      const goal = await this.goalRepository.createGoal({ ...data }, user_id);

      return goal;
    } catch (err) {
      throw toError(err);
    }
  }

  async getGoalPerUser(user_id: number) {
    try {
      const goals = await this.goalRepository.getGoalPerUser(user_id);
      console.log("GoalService.getGoalPerUser: ", goals);
      return goals;
    } catch (err) {
      throw toError(err);
    }
  }
}
