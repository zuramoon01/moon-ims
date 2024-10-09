import { verifyAccessToken } from "$lib/server/utils";
import type { Handle } from "@sveltejs/kit";

export const handle: Handle = async ({ event, resolve }) => {
  const { cookies, locals } = event;

  const accessToken = cookies.get("access_token");
  locals.user = accessToken ? verifyAccessToken(accessToken) : null;

  const response = await resolve(event);

  return response;
};
