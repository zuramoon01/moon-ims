import { CookieOptions, deleteCookie } from "$lib/server/utils";
import { json } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";

export const POST: RequestHandler = async ({ cookies }) => {
  deleteCookie(cookies, "access_token", CookieOptions.AccessToken);

  return json({
    message: "Berhasil keluar.",
  });
};
