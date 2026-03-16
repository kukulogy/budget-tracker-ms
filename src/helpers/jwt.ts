import jwt from "jsonwebtoken";

const generateJWT = async (payload: any): Promise<string> => {
  const JWT_SECRET = process.env.JWT_SECRET || null;
  if (!JWT_SECRET) {
    throw new Error("JWT_SECRET is not defined in environment variables");
  }

  return jwt.sign(payload, JWT_SECRET);
};

const verifyJWT = async (token: string): Promise<any> => {
  try {
    const JWT_SECRET = process.env.JWT_SECRET || null;

    if (!JWT_SECRET) {
      throw new Error("JWT_SECRET is not defined in environment variables");
    }

    return jwt.verify(token, JWT_SECRET);
  } catch (err) {
    throw new Error("Invalid token");
  }
};

export { generateJWT, verifyJWT };
