import { RouteGenericInterface } from "fastify";
import { FromSchema } from "json-schema-to-ts";
import { ResponseSchema } from "../response";

const UserLoginSchema = {
  type: "object",
  required: ["email", "password"],
  properties: {
    email: {
      type: "string",
    },
    password: {
      type: "string",
    },
  },
} as const;

type UserLoginType = FromSchema<typeof UserLoginSchema>;

interface UserLoginRequest extends RouteGenericInterface {
  Body: UserLoginType;
  Reply: ResponseSchema;
}

export { UserLoginRequest, UserLoginSchema, UserLoginType };
