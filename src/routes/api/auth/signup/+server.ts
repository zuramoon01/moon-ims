import type { RequestHandler } from "./$types";
import * as v from "valibot";
import { passwordSchema, usernameSchema } from "$lib/types";
import { insertUser } from "$lib/server/database";
import {
  createAccessToken,
  DuplicateUserError,
  errorHandler,
  InvalidDataError,
  setCookieAccessToken,
} from "$lib/server/utils";
import { json } from "@sveltejs/kit";

export const POST: RequestHandler = async ({ cookies, request }) => {
  try {
    const { output, issues } = v.safeParse(
      v.object({
        username: usernameSchema,
        password: passwordSchema,
        confirmPassword: passwordSchema,
      }),
      await request.json(),
    );

    if (issues) {
      throw new InvalidDataError(
        "Nama atau kata sandi atau konfirmasi kata sandi yang dimasukkan salah.",
      );
    }

    const { username, password, confirmPassword } = output;

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
      username,
      passwordHash,
    });

    if (!user) {
      throw new DuplicateUserError(`Pengguna dengan nama ${username} sudah digunakan.`);
    }

    const accessToken = createAccessToken(user);

    setCookieAccessToken(cookies, accessToken);

    return json({
      message: "Berhasil mendaftarkan akun.",
      data: user,
    });
  } catch (error) {
    const { responseData, responseInit } = errorHandler(error);

    return json(responseData, responseInit);
  }
};
