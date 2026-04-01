import { FastifyRequest, FastifyReply, FastifyInstance } from "fastify";
import { FastifyRedis } from "@fastify/redis";
import { UserRegistrationRequest } from "../types/user/user.registration";
import { UserService } from "../services/user.service";
import { UserLoginRequest } from "../types/user/user.login";
import jwt from "../plugins/jwt";
import { RedisHelper } from "../helpers/redis";

export class UserClass {
  private userService: UserService;
  private redis: RedisHelper;

  constructor(private readonly fastify: FastifyInstance) {
    this.redis = new RedisHelper(this.fastify);
    this.userService = new UserService(this.fastify.prisma);
  }

  login = async (
    req: FastifyRequest<UserLoginRequest>,
    res: FastifyReply<UserLoginRequest>,
  ) => {
    try {
      const { email, password } = req.body;
      const user = await this.userService.login(email, password);
      if (!user) {
        throw new Error("Invalid email or password");
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

      res.send({
        status: 200,
        code: "USER_LOGIN_SUCCESS",
        data: { ...user, token },
      });
    } catch (err) {
      res.status(400).send({
        status: 400,
        code: "USER_LOGIN_FAILED",
        data: { message: err.message },
      });
    }
  };

  registration = async (
    req: FastifyRequest<UserRegistrationRequest>,
    res: FastifyReply<UserRegistrationRequest>,
  ) => {
    try {
      const user = await this.userService.createUser(req.body);
      res
        .status(200)
        .send({ status: 200, code: "USER_REGISTRATION_SUCCESS", data: {} });
    } catch (err) {
      console.log(err);
      res.status(500).send({
        status: 500,
        code: "USER_REGISTRATION_FAILED",
        data: { message: err.message },
      });
    }
  };

  dashboard = async (req: FastifyRequest, res: FastifyReply) => {
    const user = await this.redis.getOrSet(req.user.email, async () => {
      return JSON.stringify(req.user);
    });

    console.log("User.dashboard: ", req.user, user);

    if (!user) {
      res.send({
        status: 500,
        code: "USER_DASHBOARD_FAILED",
        data: { message: "User not found in cache" },
      });
      return;
    }

    res.send({
      status: 200,
      code: "USER_DASHBOARD_SUCCESS",
      data: { user: JSON.parse(user) },
    });
  };
}
