import jwt from "jsonwebtoken";
import { JWT_SECRET } from "$env/static/private";
import { type User } from "$lib/types";

export function createAccessToken(payload: User) {
  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: "1d",
  });
}

export function verifyAccessToken(token: string) {
  try {
    const { iss, sub, aud, exp, nbf, iat, jti, ...user } = jwt.verify(
      token,
      JWT_SECRET,
    ) as jwt.JwtPayload;

    return user as User;
    // eslint-disable-next-line
  } catch (_) {
    return null;
  }
}
