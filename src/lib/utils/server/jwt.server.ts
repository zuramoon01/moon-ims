import { JWT_SECRET } from "$env/static/private";
import jwt from "jsonwebtoken";

export const JWTOptions = {
  AccessToken: {
    expiresIn: "1m",
  },
  RefreshToken: {
    expiresIn: "7d",
  },
} satisfies Record<string, jwt.SignOptions>;

export function createToken(payload: string | Buffer | object, options?: jwt.SignOptions) {
  return jwt.sign(payload, JWT_SECRET, options);
}

export function verifyToken(token: string, options?: jwt.VerifyOptions) {
  try {
    return jwt.verify(token, JWT_SECRET, options);
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      return null;
    }

    console.error(error);

    return undefined;
  }
}
