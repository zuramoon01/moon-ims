import type { RequestHandler } from "./$types";
import { z } from "zod";
import {
  confirmPasswordSchema,
  emailSchema,
  passwordSchema,
  usernameSchema,
} from "$lib/types";
import { insertAccessToken, insertUser } from "$lib/server/db";
import {
  DuplicateUserError,
  errorHandler,
  InvalidDataError,
  setCookieAccessToken,
} from "$lib/utils";
import { json } from "@sveltejs/kit";

export const POST: RequestHandler = async ({ cookies, request }) => {
  try {
    const result = z
      .object({
        email: emailSchema,
        username: usernameSchema,
        password: passwordSchema,
        confirmPassword: confirmPasswordSchema,
      })
      .safeParse(await request.json());

    if (!result.success) {
      throw new InvalidDataError(
        "Email atau nama atau kata sandi atau konfirmasi kata sandi yang dimasukkan salah.",
        result.error.format(),
      );
    }

    const {
      data: { email, username, password, confirmPassword },
    } = result;

    if (password !== confirmPassword) {
      throw new InvalidDataError(
        "Kata sandi dan konfirmasi kata sandi tidak sama. Mohon untuk memasukkan kata sandi kembali.",
      );
    }

    const passwordHash = await Bun.password.hash(password, {
      algorithm: "argon2id",
      memoryCost: 4,
      timeCost: 3,
    });

    const [user] = await insertUser({
      email,
      username,
      passwordHash,
    });

    if (!user) {
      throw new DuplicateUserError(
        "Pengguna dengan email atau nama sudah digunakan.",
      );
    }

    const [accessToken] = await insertAccessToken(user);

    setCookieAccessToken(cookies, accessToken.token);

    return json({
      message: "Berhasil mendaftarkan akun.",
      data: user,
    });
  } catch (error) {
    const { responseData, responseInit } = errorHandler(error);

    return json(responseData, responseInit);
  }
};
