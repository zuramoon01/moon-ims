import type { Cookies } from "@sveltejs/kit";
import { dev } from "$app/environment";

export function setCookieAccessToken(cookies: Cookies, token: string) {
  cookies.set("access_token", token, {
    httpOnly: true,
    maxAge: 60 * 60 * 24, // 1 day
    path: "/",
    sameSite: "strict",
    secure: !dev,
  });
}

export function revokeCookieAccessToken(cookies: Cookies) {
  cookies.delete("access_token", {
    path: "/",
  });
}
