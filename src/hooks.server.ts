import type { Handle } from "@sveltejs/kit";
import { verifyAccessToken } from "$lib/server/jwt";

export const handle: Handle = async ({ event, resolve }) => {
  const token = event.cookies.get("access_token");

  if (token) {
    event.locals.user = verifyAccessToken(token);
  }

  const response = await resolve(event);

  return response;
};
