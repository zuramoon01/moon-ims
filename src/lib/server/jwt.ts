import { JWT_SECRET } from "$env/static/private";
import jwt from "jsonwebtoken";
import type { User } from "$lib/types";

export function createAccessToken(payload: User) {
  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: "1d",
  });
}

export function verifyAccessToken(token: string) {
  try {
    return jwt.verify(token, JWT_SECRET) as User;
    // eslint-disable-next-line
  } catch (error) {
    return null;
  }
}
