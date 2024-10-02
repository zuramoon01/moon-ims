import type { UserTable } from "$lib/types";
import { db, usersTable } from "$lib/server/database";
import { eq, sql } from "drizzle-orm";
import { v7 as uuidv7 } from "uuid";

export const getUserByUsename = db.query.usersTable
  .findFirst({
    columns: {
      id: true,
      username: true,
      passwordHash: true,
    },
    where: eq(usersTable.username, sql.placeholder("username")),
  })
  .prepare("getUserByUsename");

export function insertUser(data: Pick<UserTable, "username" | "passwordHash">) {
  return db
    .insert(usersTable)
    .values({
      id: uuidv7(),
      ...data,
    })
    .onConflictDoNothing()
    .returning({
      id: usersTable.id,
      username: usersTable.username,
    });
}
