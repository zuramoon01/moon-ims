import { revokeCookieAccessToken } from "$lib/server/utils";
import { json } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";

export const POST: RequestHandler = async ({ cookies }) => {
  revokeCookieAccessToken(cookies);

  return json({
    message: "Berhasil keluar.",
  });
};
