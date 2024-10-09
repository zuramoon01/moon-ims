import { JWT_SECRET } from "$env/static/private";
import { passwordSchema, usernameSchema } from "$lib/features/user";
import { getUserByUsename } from "$lib/server/features/user";
import {
  createAccessToken,
  errorHandler,
  InvalidDataError,
  setCookieAccessToken,
} from "$lib/server/utils";
import { json } from "@sveltejs/kit";
import { argon2Verify } from "hash-wasm";
import * as v from "valibot";
import type { RequestHandler } from "./$types";

export const POST: RequestHandler = async ({ cookies, request }) => {
  try {
    const { output, issues } = v.safeParse(
      v.object({
        username: usernameSchema,
        password: passwordSchema,
      }),
      await request.json(),
    );

    if (issues) {
      throw new InvalidDataError("Nama atau kata sandi yang dimasukkan salah.");
    }

    const { username, password } = output;

    const [user] = await getUserByUsename(username);

    if (!user || !(await argon2Verify({ password, hash: user.passwordHash, secret: JWT_SECRET }))) {
      throw new InvalidDataError("Nama atau kata sandi yang dimasukkan salah.");
    }

    const userData = {
      id: user.id,
      username: user.username,
    };

    const accessToken = createAccessToken(userData);

    setCookieAccessToken(cookies, accessToken);

    return json({
      message: "Berhasil masuk.",
      data: userData,
    });
  } catch (error) {
    const { responseData, responseInit } = errorHandler(error);

    return json(responseData, responseInit);
  }
};
