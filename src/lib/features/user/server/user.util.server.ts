import {
  CompanyNameSchema,
  ConfirmPasswordSchema,
  PasswordSchema,
  UsernameSchema,
  UUIDSchema,
} from "$lib/features/user";
import { getUserById } from "$lib/features/user/server";
import type { User } from "$lib/types";
import {
  Cookie,
  createToken,
  deleteCookie,
  InvalidDataError,
  JWTOptions,
  setCookie,
} from "$lib/utils/server";
import type { Cookies } from "@sveltejs/kit";
import type { Jwt, JwtPayload } from "jsonwebtoken";
import { flatten, object, safeParse } from "valibot";

export function getUserFromAccessToken(accessToken: string | Jwt | JwtPayload): User | undefined {
  const { success, output: user } = safeParse(
    object({
      id: UUIDSchema,
      username: UsernameSchema,
      companyName: CompanyNameSchema,
    }),
    accessToken,
    {
      abortEarly: true,
      abortPipeEarly: true,
    },
  );

  return success ? user : undefined;
}

export async function getUserFromRefreshToken(
  refreshToken: string | Jwt | JwtPayload,
): Promise<User | undefined> {
  try {
    const { success, output: user } = safeParse(
      object({
        id: UUIDSchema,
      }),
      refreshToken,
      {
        abortEarly: true,
        abortPipeEarly: true,
      },
    );

    return success ? await getUserById(user.id) : undefined;
  } catch (error) {
    console.error(error);

    return undefined;
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function getUserFromSignUpForm(data: any) {
  const {
    success,
    output: user,
    issues,
  } = safeParse(
    object({
      username: UsernameSchema,
      password: PasswordSchema,
      confirmPassword: ConfirmPasswordSchema,
    }),
    data,
  );

  if (!success) {
    console.error(flatten(issues));

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

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function getUserFromSignInForm(data: any) {
  const {
    success,
    output: user,
    issues,
  } = safeParse(
    object({
      username: UsernameSchema,
      password: PasswordSchema,
    }),
    data,
  );

  if (!success) {
    console.error(flatten(issues));

    throw new InvalidDataError("Nama atau kata sandi yang dimasukkan salah.");
  }

  return user;
}

const { AccessToken, RefreshToken } = Cookie;

export function setCookieUser(cookies: Cookies, user: User) {
  setCookieAccessToken(cookies, user);
  setCookieRefreshToken(cookies, user);
}

export function setCookieAccessToken(cookies: Cookies, user: User) {
  setCookie(
    cookies,
    "access_token",
    createToken(user, JWTOptions.AccessToken),
    AccessToken.Options,
  );
}

export function setCookieRefreshToken(cookies: Cookies, user: User) {
  setCookie(
    cookies,
    "refresh_token",
    createToken({ id: user.id }, JWTOptions.RefreshToken),
    RefreshToken.Options,
  );
}

export function deleteCookieUser(cookies: Cookies) {
  deleteCookieAccessToken(cookies);
  deleteCookieRefreshToken(cookies);
}

export function deleteCookieAccessToken(cookies: Cookies) {
  deleteCookie(cookies, AccessToken.Name, AccessToken.Options);
}

export function deleteCookieRefreshToken(cookies: Cookies) {
  deleteCookie(cookies, RefreshToken.Name, RefreshToken.Options);
}
