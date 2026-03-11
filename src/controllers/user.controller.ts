import { FastifyRequest, FastifyReply } from "fastify";
import { UserRegistrationRequest } from "../types/user/user.registration";
export const login = async (req: FastifyRequest, res: FastifyReply) => {
  try {
    res.send("User.login: Not yet implemented yet.");
  } catch (err) {
    res.status(500).send(err);
  }
};

export const registration = async (
  req: FastifyRequest<UserRegistrationRequest>,
  res: FastifyReply<UserRegistrationRequest>,
) => {
  try {
    res
      .status(200)
      .send({ status: 200, code: "USER_REGISTRATION_SUCCESS", data: {} });
  } catch (err) {
    res
      .status(500)
      .send({ status: 500, code: "USER_REGISTRATION_FAILED", data: {} });
  }
};
