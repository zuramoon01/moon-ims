import type { RequestHandler } from "./$types";
import { json } from "@sveltejs/kit";
import { z, ZodError } from "zod";
import { accessTokens, db, users } from "$lib/server/db";
import { createAccessToken } from "$lib/server/jwt";
import { dev } from "$app/environment";
import { ValidationMessage } from "$lib/types";

export const POST: RequestHandler = async ({ cookies, request }) => {
  try {
    const { email, username, password, confirmPassword } = z
      .object({
        email: z
          .string({
            invalid_type_error: ValidationMessage.Type("Email", "string"),
            required_error: ValidationMessage.Require("Email"),
          })
          .email({
            message: ValidationMessage.Email("Email"),
          })
          .max(255, {
            message: ValidationMessage.Max("Email", 255),
          }),
        username: z
          .string({
            invalid_type_error: ValidationMessage.Type("Nama", "string"),
            required_error: ValidationMessage.Require("Nama"),
          })
          .min(3, {
            message: ValidationMessage.Max("Nama", 3),
          })
          .max(25, {
            message: ValidationMessage.Max("Nama", 25),
          }),
        password: z
          .string({
            invalid_type_error: ValidationMessage.Type("Kata sandi", "string"),
            required_error: ValidationMessage.Require("Kata sandi"),
          })
          .min(8, {
            message: ValidationMessage.Max("Kata sandi", 8),
          })
          .max(255, {
            message: ValidationMessage.Max("Kata sandi", 255),
          }),
        confirmPassword: z
          .string({
            invalid_type_error: ValidationMessage.Type(
              "Konfirmasi kata sandi",
              "string",
            ),
            required_error: ValidationMessage.Require("Konfirmasi kata sandi"),
          })
          .min(8, {
            message: ValidationMessage.Max("Konfirmasi kata sandi", 8),
          })
          .max(255, {
            message: ValidationMessage.Max("Konfirmasi kata sandi", 255),
          }),
      })
      .parse(await request.json());

    if (password !== confirmPassword) {
      return json(
        {
          message:
            "Kata sandi dan konfirmasi kata sandi tidak sama. Mohon untuk memasukkan kata sandi kembali.",
          errorType: "InvalidPassword",
        },
        {
          status: 400,
        },
      );
    }

    const passwordHash = await Bun.password.hash(password, {
      algorithm: "argon2id",
      memoryCost: 4,
      timeCost: 3,
    });

    const [user] = await db
      .insert(users)
      .values({
        email,
        username,
        passwordHash,
      })
      .onConflictDoNothing()
      .returning({
        id: users.id,
        email: users.email,
        username: users.username,
      });

    if (!user) {
      return json(
        {
          message: "Pengguna dengan email atau nama sudah digunakan.",
          errorType: "DuplicateEmailOrUsername",
        },
        {
          status: 400,
        },
      );
    }

    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 1);

    const [accessToken] = await db
      .insert(accessTokens)
      .values({
        token: createAccessToken(user),
        expiresAt,
      })
      .returning({
        token: accessTokens.token,
      });

    cookies.set("access_token", accessToken.token, {
      httpOnly: false,
      maxAge: 60 * 60 * 24, // 1 day
      path: "/",
      sameSite: "strict",
      secure: !dev,
    });

    return json({
      message: "Berhasil mendaftarkan akun.",
      data: user,
    });
  } catch (error) {
    if (error instanceof ZodError) {
      return json(
        {
          message: "Gagal mendaftarkan akun.",
          errors: error.format(),
          errorType: "InvalidData",
        },
        {
          status: 400,
        },
      );
    }

    return json(
      {
        message: "Uncatch Error.",
        errorType: "UncatchError",
      },
      {
        status: 400,
      },
    );
  }
};
