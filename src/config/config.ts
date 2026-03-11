import { FromSchema } from "json-schema-to-ts";

const config = {
  type: "object",
  required: ["PORT"],
  properties: {
    PORT: {
      type: "number",
      default: 3001,
    },
    DATABASE_URL: {
      type: "string",
    },
  },
} as const;

type Config = FromSchema<typeof config>;

export { Config, config };
