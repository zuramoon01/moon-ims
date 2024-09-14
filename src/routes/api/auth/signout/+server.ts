import { json } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";

export const POST: RequestHandler = async ({ cookies }) => {
  cookies.delete("access_token", {
    path: "/",
  });

  return json({
    message: "Berhasil keluar.",
  });
};
