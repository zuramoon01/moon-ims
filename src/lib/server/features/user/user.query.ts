import type { User, UserTable } from "$lib/features/user";
import { sql } from "$lib/server/database";
import { v7 as uuidv7 } from "uuid";

export function getUserByUsename(username: UserTable["username"]) {
  return sql<Pick<UserTable, "id" | "username" | "passwordHash">[]>`
    SELECT
      users.id
      , users.username
      , users.password_hash AS "passwordHash"
    FROM users
    WHERE users.username = ${username}
  `;
}

export function insertUser({
  username,
  passwordHash,
}: Pick<UserTable, "username" | "passwordHash">) {
  return sql<User[]>`
    INSERT INTO users (id, username, password_hash)
    VALUES (${uuidv7()}, ${username}, ${passwordHash})
    RETURNING
      users.id
      , users.username
  `;
}
