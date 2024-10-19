import type { User, UserTable } from "$lib/features/user";
import { sql } from "$lib/server/database";
import { DuplicateUserError, InvalidDataError } from "$lib/server/utils";
import { v7 as uuidv7 } from "uuid";

export async function getUserById(id: UserTable["id"]) {
  const [user] = await sql<[User?]>`
    SELECT
      users.id
      , users.username
      , users.company_name AS "companyName"
    FROM users
    WHERE users.id = ${id}
  `;

  if (!user) {
    throw new InvalidDataError(`Pengguna dengan id ${id} tidak ditemukan.`);
  }

  return user;
}

export async function getUserByUsename(username: UserTable["username"]) {
  const [user] = await sql<[Pick<UserTable, "id" | "username" | "passwordHash" | "companyName">?]>`
    SELECT
      users.id
      , users.username
      , users.password_hash AS "passwordHash"
      , users.company_name AS "companyName"
    FROM users
    WHERE users.username = ${username}
  `;

  if (!user) {
    throw new InvalidDataError(`Pengguna dengan nama ${username} tidak ditemukan.`);
  }

  return user;
}

export async function insertUser({
  username,
  passwordHash,
}: Pick<UserTable, "username" | "passwordHash">) {
  const [user] = await sql<[User?]>`
    INSERT INTO users (id, username, password_hash)
    VALUES (${uuidv7()}, ${username}, ${passwordHash})
    RETURNING
      users.id
      , users.username
      , users.company_name AS "companyName"
  `;

  if (!user) {
    throw new DuplicateUserError(`Pengguna dengan nama ${username} sudah digunakan.`);
  }

  return user;
}
