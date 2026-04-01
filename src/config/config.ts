import { FromSchema } from "json-schema-to-ts";

const config = {
  type: "object",
  required: ["PORT", "JWT_SECRET"],
  properties: {
    PORT: {
      type: "number",
      default: 3001,
    },
    DATABASE_URL: {
      type: "string",
    },
    JWT_SECRET: {
      type: "string",
    },
    REDIS_HOST: {
      type: "string",
    },
    REDIS_PORT: {
      type: "number",
    },
  },
} as const;

type Config = FromSchema<typeof config>;

export { Config, config };
