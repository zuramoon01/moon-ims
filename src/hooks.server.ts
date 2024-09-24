import type { Handle } from "@sveltejs/kit";
import { verifyAccessToken } from "$lib/server/utils";

export const handle: Handle = async ({ event, resolve }) => {
  const { cookies, locals } = event;

  const accessToken = cookies.get("access_token");

  if (accessToken) {
    locals.user = verifyAccessToken(accessToken);
  }

  const response = await resolve(event);

  return response;
};
