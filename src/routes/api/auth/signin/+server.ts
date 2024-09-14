import type { RequestHandler } from "./$types";
import { z } from "zod";
import { emailSchema, passwordSchema } from "$lib/types";
import { getUserByEmail, insertAccessToken } from "$lib/server/db";
import {
  errorHandler,
  InactiveUserError,
  InvalidDataError,
  setCookieAccessToken,
} from "$lib/utils";
import { json } from "@sveltejs/kit";

export const POST: RequestHandler = async ({ cookies, request }) => {
  try {
    const result = z
      .object({
        email: emailSchema,
        password: passwordSchema,
      })
      .safeParse(await request.json());

    if (!result.success) {
      throw new InvalidDataError(
        "Email atau kata sandi yang dimasukkan salah.",
        result.error.format(),
      );
    }

    const {
      data: { email, password },
    } = result;

    const [user] = await getUserByEmail(email);

    if (!user) {
      throw new InvalidDataError(
        "Email atau kata sandi yang dimasukkan salah.",
      );
    }

    if (!user.isActive) {
      throw new InactiveUserError("Akun pengguna sudah tidak aktif.");
    }

    if (!(await Bun.password.verify(password, user.passwordHash))) {
      throw new InvalidDataError(
        "Email atau kata sandi yang dimasukkan salah.",
      );
    }

    const userData = {
      id: user.id,
      email: user.email,
      username: user.username,
    };

    const [accessToken] = await insertAccessToken(userData);

    setCookieAccessToken(cookies, accessToken.token);

    return json({
      message: "Berhasil masuk.",
      data: userData,
    });
  } catch (error) {
    const { responseData, responseInit } = errorHandler(error);

    return json(responseData, responseInit);
  }
};
