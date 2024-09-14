import type { RequestHandler } from "./$types";
import { json } from "@sveltejs/kit";
import { z, ZodError } from "zod";
import { accessTokens, db, users } from "$lib/server/db";
import { eq } from "drizzle-orm";
import { createAccessToken } from "$lib/server/jwt";
import { dev } from "$app/environment";
import { ValidationMessage } from "$lib/types";

export const POST: RequestHandler = async ({ cookies, request }) => {
  try {
    const { email, password } = z
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
      })
      .parse(await request.json());

    const [user] = await db
      .select({
        id: users.id,
        email: users.email,
        username: users.username,
        passwordHash: users.passwordHash,
        isActive: users.isActive,
      })
      .from(users)
      .where(eq(users.email, email))
      .limit(1);

    if (!user) {
      return json(
        {
          message: "Email atau kata sandi yang dimasukkan salah.",
          errorType: "NoUser",
        },
        {
          status: 400,
        },
      );
    }

    if (!user.isActive) {
      return json(
        {
          message: "Akun pengguna sudah tidak aktif.",
          errorType: "InactiveUser",
        },
        {
          status: 400,
        },
      );
    }

    if (!(await Bun.password.verify(password, user.passwordHash))) {
      return json(
        {
          message: "Email atau kata sandi yang dimasukkan salah.",
          errorType: "InvalidPassword",
        },
        {
          status: 400,
        },
      );
    }

    const userData = {
      id: user.id,
      email: user.email,
      username: user.username,
    };

    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 1);

    const [accessToken] = await db
      .insert(accessTokens)
      .values({
        token: createAccessToken(userData),
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
      message: "Berhasil masuk.",
      data: userData,
    });
  } catch (error) {
    if (error instanceof ZodError) {
      return json(
        {
          message: "Gagal masuk.",
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
