import type { RequestHandler } from "./$types";
import { revokeCookieAccessToken } from "$lib/server/utils";
import { json } from "@sveltejs/kit";

export const POST: RequestHandler = async ({ cookies }) => {
  revokeCookieAccessToken(cookies);

  return json({
    message: "Berhasil keluar.",
  });
};
