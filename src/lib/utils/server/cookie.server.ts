import type { Cookies } from "@sveltejs/kit";
import type { CookieSerializeOptions } from "cookie";

export const COOKIE_NAME_PREFIX = "moon_ims_";

export const Cookie = {
  AccessToken: {
    Name: "access_token",
    Options: {
      httpOnly: true,
      maxAge: 60, // 1 minute
      path: "/",
      sameSite: "strict",
      secure: true,
    },
  },
  RefreshToken: {
    Name: "refresh_token",
    Options: {
      httpOnly: true,
      maxAge: 60 * 60 * 24 * 7, // 7 day
      path: "/",
      sameSite: "strict",
      secure: true,
    },
  },
} satisfies Record<
  string,
  {
    Name: string;
    Options: CookieSerializeOptions & { path: string };
  }
>;

export function getCookie(cookies: Cookies, name: string) {
  return cookies.get(`${COOKIE_NAME_PREFIX}${name}`);
}

export function setCookie(
  cookies: Cookies,
  name: string,
  token: string,
  options: CookieSerializeOptions & { path: string },
) {
  cookies.set(`${COOKIE_NAME_PREFIX}${name}`, token, options);
}

export function deleteCookie(
  cookies: Cookies,
  name: string,
  options: CookieSerializeOptions & { path: string },
) {
  cookies.delete(`${COOKIE_NAME_PREFIX}${name}`, options);
}
