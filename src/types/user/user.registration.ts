import { RouteGenericInterface } from "fastify";
import { FromSchema } from "json-schema-to-ts";
import { ResponseSchema } from "../response";

const UserRegistrationSchema = {
  type: "object",
  required: ["email", "password", "firstname", "lastname"],
  properties: {
    email: {
      type: "string",
    },
    password: {
      type: "string",
    },
    firstname: {
      type: "string",
    },
    lastname: {
      type: "string",
    },
  },
} as const;

type UserRegistrationType = FromSchema<typeof UserRegistrationSchema>;

interface UserRegistrationRequest extends RouteGenericInterface {
  Body: UserRegistrationType;
  Reply: ResponseSchema;
}
export {
  UserRegistrationRequest,
  UserRegistrationSchema,
  UserRegistrationType,
};
