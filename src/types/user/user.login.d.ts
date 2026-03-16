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
};

type UserLoginType = FromSchema<typeof UserLoginSchema>;

interface UserLoginRequest extends RouteGenericInterface {
  Body: UserLoginType;
  Reply: ResponseSchema;
}

export { UserLoginRequest, UserLoginSchema };
