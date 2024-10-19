import type { Cookies } from "@sveltejs/kit";
import type { CookieSerializeOptions } from "cookie";

export const CookieOptions = {
  AccessToken: {
    httpOnly: true,
    maxAge: 60, // 1 minute
    path: "/",
    sameSite: "strict",
    secure: true,
  },
  RefreshToken: {
    httpOnly: true,
    maxAge: 60 * 60 * 24 * 7, // 7 day
    path: "/",
    sameSite: "strict",
    secure: true,
  },
} satisfies { [key: string]: CookieSerializeOptions & { path: string } };

export function getCookie(cookies: Cookies, name: string) {
  return cookies.get(`moon_ims_${name}`);
}

export function setCookie(
  cookies: Cookies,
  name: string,
  token: string,
  options: CookieSerializeOptions & { path: string },
) {
  cookies.set(`moon_ims_${name}`, token, options);
}

export function deleteCookie(
  cookies: Cookies,
  name: string,
  options: CookieSerializeOptions & { path: string },
) {
  cookies.delete(`moon_ims_${name}`, options);
}
