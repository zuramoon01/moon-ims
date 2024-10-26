import { deleteCookieUser } from "$lib/features/user/server";
import { json } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";

export const POST: RequestHandler = async ({ cookies }) => {
  deleteCookieUser(cookies);

  return json({
    message: "Berhasil keluar.",
  });
};
