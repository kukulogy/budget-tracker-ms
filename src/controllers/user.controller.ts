import { FastifyRequest, FastifyReply, FastifyInstance } from "fastify";
import { UserRegistrationRequest } from "../types/user/user.registration";
import { UserService } from "../services/user.service";
import { UserLoginRequest } from "../types/user/user.login";

export class UserClass {
  private userService: UserService;

  constructor(private readonly fastify: FastifyInstance) {
    this.userService = new UserService(this.fastify.prisma);
  }

  async login(
    req: FastifyRequest<UserLoginRequest>,
    res: FastifyReply<UserLoginRequest>,
  ) {
    try {
      const { email, password } = req.body;
      const user = await this.userService.login(email, password);

      if (!user) {
        throw new Error("Invalid email or password");
      }

      res.send({
        status: 200,
        code: "USER_LOGIN_SUCCESS",
        data: { ...user },
      });
    } catch (err) {
      res
        .status(500)
        .send({ status: 500, code: "USER_LOGIN_FAILED", data: { err } });
    }
  }

  async registration(
    req: FastifyRequest<UserRegistrationRequest>,
    res: FastifyReply<UserRegistrationRequest>,
  ) {
    try {
      await this.userService.createUser(req.body);
      res
        .status(200)
        .send({ status: 200, code: "USER_REGISTRATION_SUCCESS", data: {} });
    } catch (err) {
      console.log(err);
      res
        .status(500)
        .send({ status: 500, code: "USER_REGISTRATION_FAILED", data: { err } });
    }
  }
}
