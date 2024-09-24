import jwt from "jsonwebtoken";
import { JWT_SECRET } from "$env/static/private";
import * as v from "valibot";
import { usernameSchema, uuidSchema, type User } from "$lib/types";

export function createAccessToken(payload: User) {
  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: "1d",
  });
}

export function verifyAccessToken(token: string) {
  try {
    return v.parse(
      v.object({
        id: uuidSchema,
        username: usernameSchema,
      }),
      jwt.verify(token, JWT_SECRET),
    );
  } catch (_) {
    return null;
  }
}
