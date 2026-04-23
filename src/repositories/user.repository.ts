import { PrismaClient } from "@prisma/client";
import { hashPassword } from "../helpers/hash";
import { UserRegistrationType } from "../types/user/user.registration";
import { toError } from "../utils/errors";
export class UserRepository {
  constructor(private readonly prisma: PrismaClient) {
    this.prisma = prisma;
  }

  async findByEmail(email: string) {
    try {
      const user = await this.prisma.user.findUnique({
        where: {
          email,
        },
      });

      return user;
    } catch (err) {
      throw toError(err);
    }
  }

  async createUser(data: UserRegistrationType) {
    try {
      const { email, password, firstname, lastname } = data;
      const hashedPassword = await hashPassword(password);
      const user = await this.prisma.user.create({
        data: {
          email,
          password: hashedPassword,
          firstname,
          lastname,
        },
      });
      return user;
    } catch (err) {
      throw toError(err);
    }
  }
}
