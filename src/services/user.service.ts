import { PrismaClient } from "@prisma/client";
import { UserRegistrationType } from "../types/user/user.registration";
import bcrypt from "bcrypt";
import { UserRepository } from "../repositories/user.repository";
import { toError } from "../utils/errors";

type UserRepositoryPort = {
  findByEmail: (email: string) => Promise<any | null>;
  createUser: (data: UserRegistrationType) => Promise<any>;
};

type PasswordHasherPort = {
  compare: (plain: string, hash: string) => Promise<boolean>;
};

export class UserService {
  private userRepository: UserRepositoryPort;
  private passwordHasher: PasswordHasherPort;

  constructor(
    private readonly prisma: PrismaClient,
    deps?: {
      userRepository?: UserRepositoryPort;
      passwordHasher?: PasswordHasherPort;
    },
  ) {
    this.prisma = prisma;
    this.userRepository = deps?.userRepository ?? new UserRepository(this.prisma);
    this.passwordHasher = deps?.passwordHasher ?? {
      compare: (plain, hash) => bcrypt.compare(plain, hash),
    };
  }

  async login(email: string, password: string) {
    console.log("UserService.login: ", email);

    try {
      const user = await this.userRepository.findByEmail(email);
      if (user) {
        const isPasswordValid = await this.passwordHasher.compare(
          password,
          user.password,
        );
        if (!isPasswordValid) {
          throw new Error("Invalid password for user: " + email);
        }

        delete user.password;
        return { ...user };
      }

      console.log("UserService.login: User found: ", user);
      return user;
    } catch (err) {
      throw toError(err);
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
      throw toError(err);
    }
  }
}
