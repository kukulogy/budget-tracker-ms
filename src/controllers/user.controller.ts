import { FastifyRequest, FastifyReply, FastifyInstance } from "fastify";
import { UserRegistrationRequest } from "../types/user/user.registration";
import { UserService } from "../services/user.service";
import { UserLoginRequest } from "../types/user/user.login";
import { toError } from "../utils/errors";
import { AuthService } from "../services/auth.service";

export class UserClass {
  private userService: UserService;
  private authService: AuthService;

  constructor(private readonly fastify: FastifyInstance) {
    this.userService = new UserService(this.fastify.prisma);
    this.authService = new AuthService(this.fastify);
  }

  login = async (
    req: FastifyRequest<UserLoginRequest>,
    res: FastifyReply<UserLoginRequest>,
  ) => {
    try {
      const { email, password } = req.body;
      const { user, token } = await this.authService.login(email, password);

      res.send({
        status: 200,
        code: "USER_LOGIN_SUCCESS",
        data: { ...user, token },
      });
    } catch (err) {
      const error = toError(err);
      res.status(400).send({
        status: 400,
        code: "USER_LOGIN_FAILED",
        data: { message: error.message },
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
      const error = toError(err);
      console.log(err);
      res.status(500).send({
        status: 500,
        code: "USER_REGISTRATION_FAILED",
        data: { message: error.message },
      });
    }
  };

  dashboard = async (req: FastifyRequest, res: FastifyReply) => {
    res.send({
      status: 200,
      code: "USER_DASHBOARD_SUCCESS",
      data: { user: req.user },
    });
  };
}
