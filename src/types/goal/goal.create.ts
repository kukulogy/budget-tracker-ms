import { FromSchema } from "json-schema-to-ts";
import { ResponseSchema } from "../response";
import { RouteGenericInterface } from "fastify";

const CreateGoalSchema = {
  type: "object",
  required: ["goal_name", "goal_amount"],
  properties: {
    goal_name: {
      type: "string",
    },
    goal_amount: {
      type: "number",
    },
  },
} as const;

type CreateGoalType = FromSchema<typeof CreateGoalSchema>;

interface CreateGoalRequest extends RouteGenericInterface {
  Body: CreateGoalType;
  Reply: ResponseSchema;
}

export { CreateGoalRequest, CreateGoalSchema, CreateGoalType };
