import { FromSchema } from "json-schema-to-ts";

const config = {
  type: "object",
  required: ["PORT"],
  properties: {
    PORT: {
      type: "number",
      default: 3000
    }
  }
} as const;

type Config = FromSchema<typeof config>;

export { Config, config };