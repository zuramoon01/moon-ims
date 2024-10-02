import type { RequestHandler } from "./$types";
import * as v from "valibot";
import { passwordSchema, usernameSchema } from "$lib/types";
import { getUserByUsename } from "$lib/server/database";
import {
  createAccessToken,
  errorHandler,
  InvalidDataError,
  setCookieAccessToken,
} from "$lib/server/utils";
import { json } from "@sveltejs/kit";
import { argon2Verify } from "hash-wasm";
import { JWT_SECRET } from "$env/static/private";

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

    const user = await getUserByUsename.execute({ username });

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
