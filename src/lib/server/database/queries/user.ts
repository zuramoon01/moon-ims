import { db, usersTable } from "$lib/server/database";
import type { UserTable } from "$lib/types";
import { eq } from "drizzle-orm";

export function getUserByUsename(username: UserTable["username"]) {
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

export function insertUser(data: Pick<UserTable, "username" | "passwordHash">) {
  return db.insert(usersTable).values(data).onConflictDoNothing().returning({
    id: usersTable.id,
    username: usersTable.username,
  });
}
