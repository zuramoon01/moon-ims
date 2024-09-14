import { db, users } from "$lib/server/db";
import { eq } from "drizzle-orm";

export function getUserByEmail(email: string) {
  return db
    .select({
      id: users.id,
      email: users.email,
      username: users.username,
      passwordHash: users.passwordHash,
      isActive: users.isActive,
    })
    .from(users)
    .where(eq(users.email, email))
    .limit(1);
}

export function insertUser(data: {
  email: string;
  username: string;
  passwordHash: string;
}) {
  return db.insert(users).values(data).onConflictDoNothing().returning({
    id: users.id,
    email: users.email,
    username: users.username,
  });
}
