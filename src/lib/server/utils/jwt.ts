import { JWT_SECRET } from "$env/static/private";
import jwt, { type SignOptions, type VerifyOptions } from "jsonwebtoken";

export const JWTOptions = {
  AccessToken: {
    expiresIn: "1m",
  },
  RefreshToken: {
    expiresIn: "7d",
  },
} satisfies { [key: string]: SignOptions };

export function createToken(payload: string | Buffer | object, options?: SignOptions) {
  return jwt.sign(payload, JWT_SECRET, options);
}

export function verifyToken(token: string, options?: VerifyOptions) {
  try {
    return jwt.verify(token, JWT_SECRET, options);
  } catch (error) {
    console.error(error);

    return undefined;
  }
}
