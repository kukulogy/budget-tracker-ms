import { FastifyRequest, FastifyReply } from "fastify";

export const login = async (req: FastifyRequest, res: FastifyReply) => {
  try {
    res.send("User.login: Not yet implemented yet.");
  } catch (err) {
    res.status(500).send(err);
  }
}

export const registration = async (req: FastifyRequest, res: FastifyReply ) => {
  try {
    res.send("User.Registration: Not yet implemented yet");
  } catch (err) {
    res.status(500).send(err);
  }
}