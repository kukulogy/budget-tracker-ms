import { PrismaClient, User } from "@prisma/client";
import { UserRegistrationType } from "../types/user/user.registration";
import bcrypt from "bcrypt";
import { UserRepository } from "../repositories/user.repository";
import { ConflictError, UnauthorizedError, toError } from "../utils/errors";

type PublicUser = Omit<User, "password">;

type UserRepositoryPort = {
  findByEmail: (email: string) => Promise<User | null>;
  createUser: (data: UserRegistrationType) => Promise<User>;
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
    this.userRepository =
      deps?.userRepository ?? new UserRepository(this.prisma);
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
          throw new UnauthorizedError();
        }

        return this.toPublicUser(user);
      }

      console.log("UserService.login: User found: ", user);
      return user;
    } catch (err) {
      throw toError(err);
    }
  }

  async createUser(data: UserRegistrationType) {
    console.log("UserService.createUser: ");
    const { email, password, firstname, lastname } = data;
    try {
      const existingUser = await this.userRepository.findByEmail(email);

      if (existingUser) {
        throw new ConflictError("Email is already in use");
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

  private toPublicUser(user: User): PublicUser {
    return {
      id: user.id,
      email: user.email,
      firstname: user.firstname,
      lastname: user.lastname,
      created_at: user.created_at,
      updated_at: user.updated_at,
    };
  }
}
