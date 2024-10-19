import {
  companyNameSchema,
  confirmPasswordSchema,
  passwordSchema,
  usernameSchema,
  uuidSchema,
  type User,
} from "$lib/features/user";
import { getUserById } from "$lib/server/features/user";
import {
  CookieOptions,
  createToken,
  InvalidDataError,
  JWTOptions,
  setCookie,
} from "$lib/server/utils";
import type { Cookies } from "@sveltejs/kit";
import type { JwtPayload } from "jsonwebtoken";
import { object, safeParse } from "valibot";

export function getUserFromAccessToken(accessToken: JwtPayload | string | undefined): User | null {
  const { success, output: user } = safeParse(
    object({
      id: uuidSchema,
      username: usernameSchema,
      companyName: companyNameSchema,
    }),
    accessToken,
    {
      abortEarly: true,
      abortPipeEarly: true,
    },
  );

  return success ? user : null;
}

export async function getUserFromRefreshToken(
  refreshToken: JwtPayload | string | undefined,
): Promise<User | null> {
  try {
    const { success, output: user } = safeParse(
      object({
        id: uuidSchema,
      }),
      refreshToken,
      {
        abortEarly: true,
        abortPipeEarly: true,
      },
    );

    return success ? await getUserById(user.id) : null;
  } catch (error) {
    console.error(error);

    return null;
  }
}

export function getUserFromSignUpForm(data: any) {
  const { success, output: user } = safeParse(
    object({
      username: usernameSchema,
      password: passwordSchema,
      confirmPassword: confirmPasswordSchema,
    }),
    data,
  );

  if (!success) {
    throw new InvalidDataError(
      "Nama atau kata sandi atau konfirmasi kata sandi yang dimasukkan salah.",
    );
  }

  const { username, password, confirmPassword } = user;

  if (password !== confirmPassword) {
    throw new InvalidDataError(
      "Kata sandi dan konfirmasi kata sandi tidak sama. Mohon untuk memasukkan kata sandi kembali.",
      {
        username,
      },
    );
  }

  return user;
}

export function getUserFromSignInForm(data: any) {
  const { success, output: user } = safeParse(
    object({
      username: usernameSchema,
      password: passwordSchema,
    }),
    data,
  );

  if (!success) {
    throw new InvalidDataError("Nama atau kata sandi yang dimasukkan salah.");
  }

  return user;
}

export function setAccessToken(cookies: Cookies, user: User) {
  setCookie(
    cookies,
    "access_token",
    createToken(user, JWTOptions.AccessToken),
    CookieOptions.AccessToken,
  );
}

export function setRefreshToken(cookies: Cookies, user: User) {
  setCookie(
    cookies,
    "refresh_token",
    createToken({ id: user.id }, JWTOptions.RefreshToken),
    CookieOptions.RefreshToken,
  );
}

export function setCookieUserToken(cookies: Cookies, user: User) {
  setAccessToken(cookies, user);
  setRefreshToken(cookies, user);
}
