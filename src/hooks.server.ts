import type { Handle } from "@sveltejs/kit";
import { verifyAccessToken } from "$lib/utils";

export const handle: Handle = async ({ event, resolve }) => {
  const accessToken = event.cookies.get("access_token");

  if (accessToken) {
    event.locals.user = verifyAccessToken(accessToken);
  }

  const response = await resolve(event);

  return response;
};
