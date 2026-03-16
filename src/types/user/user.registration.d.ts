import { RouteGenericInterface } from "fastify";
import { FromSchema } from "json-schema-to-ts";
import { ResponseSchema } from "../response";

const userRegistrationSchema = {
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

type UserRegistrationType = FromSchema<typeof userRegistrationSchema>;

interface UserRegistrationRequest extends RouteGenericInterface {
  Body: UserRegistrationType;
  Reply: ResponseSchema;
}
export { UserRegistrationRequest, userRegistrationSchema };
