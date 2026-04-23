import { FastifyRequest, FastifyReply, FastifyInstance } from "fastify";
import { UserRegistrationRequest } from "../types/user/user.registration";
import { UserService } from "../services/user.service";
import { UserLoginRequest } from "../types/user/user.login";
import { HttpError, toHttpError, UnauthorizedError } from "../utils/errors";
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
      const error = toHttpError(err, "USER_LOGIN_FAILED");
      res.status(error.statusCode).send({
        status: error.statusCode,
        code: error.code,
        data: { message: error.message },
      });
    }
  };

  registration = async (
    req: FastifyRequest<UserRegistrationRequest>,
    res: FastifyReply<UserRegistrationRequest>,
  ) => {
    try {
      await this.userService.createUser(req.body);
      res
        .status(201)
        .send({ status: 201, code: "USER_REGISTRATION_SUCCESS", data: {} });
    } catch (err) {
      const error = toHttpError(err, "USER_REGISTRATION_FAILED");
      req.log.error({ err }, "User registration failed");
      res.status(error.statusCode).send({
        status: error.statusCode,
        code: error.code,
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
