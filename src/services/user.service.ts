import { Prisma, PrismaClient } from "@prisma/client";
import { UserRegistrationRequest } from "../types/user/user.registration";
import bcrypt from "bcrypt";
import fastify from "fastify";
import { generateJWT } from "../helpers/jwt";
import { UserRepository } from "../repositories/user.repository";

export class UserService {
  private userRepository: UserRepository;

  constructor(private readonly prisma: PrismaClient) {
    this.prisma = prisma;
    this.userRepository = new UserRepository(this.prisma);
  }

  async login(email: string, password: string) {
    console.log("UserService.login: ", email);

    try {
      const user = await this.userRepository.findByEmail(email);

      if (user) {
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
          throw new Error("Invalid password for user: " + email);
        }

        delete user.password;

        return { ...user };
      }

      console.log("UserService.login: User found: ", user);
      return user;
    } catch (err) {
      throw err.message;
    }
  }

  async createUser(data: UserRegistrationType) {
    console.log("UserService.createUser: ", data);
    const { email, password, firstname, lastname } = data;
    try {
      const existingUser = await this.userRepository.findByEmail(email);

      if (existingUser) {
        throw new Error("Email is already in use");
      }

      const user = await this.userRepository.createUser({
        email,
        password,
        firstname,
        lastname,
      });

      console.log("UserService.createUser: User created successfully: ", user);
      return user;
    } catch (err) {
      throw err.message;
    }
  }
}
