import { db, usersTable } from "$lib/server/database";
import { eq } from "drizzle-orm";

export function getUserByUsename(username: string) {
  return db
    .select({
      id: usersTable.id,
      username: usersTable.username,
      passwordHash: usersTable.passwordHash,
    })
    .from(usersTable)
    .where(eq(usersTable.username, username))
    .limit(1);
}

export function insertUser(data: { username: string; passwordHash: string }) {
  return db.insert(usersTable).values(data).onConflictDoNothing().returning({
    id: usersTable.id,
    username: usersTable.username,
  });
}
