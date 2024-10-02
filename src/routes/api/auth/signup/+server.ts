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
import { argon2id } from "hash-wasm";
import { JWT_SECRET } from "$env/static/private";

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

    const salt = new Uint8Array(16);
    crypto.getRandomValues(salt);

    const passwordHash = await argon2id({
      password,
      salt,
      parallelism: 1,
      iterations: 256,
      memorySize: 512,
      hashLength: 32,
      secret: JWT_SECRET,
      outputType: "encoded",
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

    return json(
      {
        message: "Berhasil mendaftarkan akun.",
        data: user,
      },
      {
        status: 201,
      },
    );
  } catch (error) {
    const { responseData, responseInit } = errorHandler(error);

    return json(responseData, responseInit);
  }
};
