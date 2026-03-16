import { Prisma, PrismaClient } from "@prisma/client";
import { UserRegistrationRequest } from "../types/user/user.registration";
import bcrypt from "bcrypt";
import { generateJWT } from "../helpers/jwt";

export class UserService {
  constructor(private readonly prisma: PrismaClient) {
    this.prisma = prisma;
  }

  async login(email: string, password: string) {
    console.log("UserService.login: ", email);

    try {
      const user = await this.prisma.user.findUnique({
        where: {
          email,
        },
      });

      if (user) {
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
          throw new Error("Invalid password for user: " + email);
        }

        delete user.password;

        const token = await generateJWT(user);
        return { ...user, token };
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
      const hashedPassword = await this.hashPassword(password);
      const existingUser = await this.prisma.user.findUnique({
        where: { email },
      });

      if (existingUser) {
        throw new Error("Email is already in use");
      }

      const user = await this.prisma.user.create({
        data: {
          email,
          password: hashedPassword,
          firstname,
          lastname,
        },
      });
      console.log("UserService.createUser: User created successfully: ", user);
      return user;
    } catch (err) {
      throw err.message;
    }
  }

  private async hashPassword(password: string) {
    const hash = await bcrypt.hash(password, 10);
    return hash;
  }
}
