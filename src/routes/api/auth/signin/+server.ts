import type { RequestHandler } from "./$types";
import * as v from "valibot";
import { passwordSchema, usernameSchema } from "$lib/types";
import { getUserByUsename } from "$lib/server/database";
import {
  createAccessToken,
  errorHandler,
  InvalidDataError,
  setCookieAccessToken,
} from "$lib/utils";
import { json } from "@sveltejs/kit";

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
      throw new InvalidDataError(
        "Nama atau kata sandi yang dimasukkan salah.",
        v.flatten(issues),
      );
    }

    const { username, password } = output;

    const [user] = await getUserByUsename(username);

    if (!user || !(await Bun.password.verify(password, user.passwordHash))) {
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
