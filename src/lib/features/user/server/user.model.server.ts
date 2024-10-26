import { db, usersTable } from "$lib/database";
import type { User, UserTable } from "$lib/types";
import { DuplicateUserError, InvalidDataError } from "$lib/utils/server";
import { eq } from "drizzle-orm";
import { v7 as uuidv7 } from "uuid";

export async function getUserById(userId: UserTable["id"]): Promise<User> {
  const [user] = await db
    .select({
      id: usersTable.id,
      username: usersTable.username,
      companyName: usersTable.companyName,
    })
    .from(usersTable)
    .where(eq(usersTable.id, userId));

  if (!user) {
    throw new InvalidDataError(`Pengguna dengan id ${userId} tidak ditemukan.`);
  }

  return user;
}

export async function getUserByUsename(username: UserTable["username"]): Promise<User> {
  const [user] = await db
    .select({
      id: usersTable.id,
      username: usersTable.username,
      passwordHash: usersTable.passwordHash,
      companyName: usersTable.companyName,
    })
    .from(usersTable)
    .where(eq(usersTable.username, username));

  if (!user) {
    throw new InvalidDataError(`Pengguna dengan nama ${username} tidak ditemukan.`);
  }

  return user;
}

export async function insertUser(
  userData: Pick<UserTable, "username" | "passwordHash">,
): Promise<User> {
  const [user] = await db
    .insert(usersTable)
    .values({ id: uuidv7(), ...userData })
    .returning({
      id: usersTable.id,
      username: usersTable.username,
      companyName: usersTable.companyName,
    });

  if (!user) {
    throw new DuplicateUserError(`Pengguna dengan nama ${userData.username} sudah digunakan.`);
  }

  return user;
}
