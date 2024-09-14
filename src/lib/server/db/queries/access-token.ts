import { type User } from "$lib/types";
import { db, accessTokens } from "$lib/server/db";
import { createAccessToken } from "$lib/utils";

export function insertAccessToken(data: User) {
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + 1);

  return db
    .insert(accessTokens)
    .values({
      token: createAccessToken(data),
      expiresAt,
    })
    .returning({
      token: accessTokens.token,
    });
}
