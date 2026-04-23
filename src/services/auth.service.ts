import { FastifyInstance } from "fastify";
import { UserService } from "./user.service";
import { RedisHelper } from "../helpers/redis";
import { UnauthorizedError, toError } from "../utils/errors";

export class AuthService {
  private userService: UserService;
  private redis: RedisHelper;

  constructor(private readonly fastify: FastifyInstance) {
    this.redis = new RedisHelper(fastify);
    this.userService = new UserService(fastify.prisma);
  }

  async login(email: string, password: string) {
    try {
      console.log("AuthService.login: ", email);

      const user = await this.userService.login(email, password);
      if (!user) {
        throw new UnauthorizedError();
      }

      await this.redis.getOrSet(user.email, async () => {
        return JSON.stringify(user);
      });

      const token = this.fastify.jwt.sign({
        id: user.id,
        email: user.email,
        firstname: user.firstname,
        lastname: user.lastname,
        created_at: user.created_at,
        updated_at: user.updated_at,
      });

      return { user, token };
    } catch (err) {
      throw toError(err);
    }
  }
}
