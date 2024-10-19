import {
  getUserFromAccessToken,
  getUserFromRefreshToken,
  setAccessToken,
} from "$lib/server/features/user";
import { getCookie, verifyToken } from "$lib/server/utils";
import { HttpStatusCode } from "$lib/types";
import { redirect, type Handle, type RequestEvent } from "@sveltejs/kit";

async function getUser(event: RequestEvent) {
  const { cookies, locals } = event;

  const accessToken = getCookie(cookies, "access_token");
  const refreshToken = getCookie(cookies, "refresh_token");
  if (accessToken) {
    const verifiedAccessToken = verifyToken(accessToken);

    locals.user = verifiedAccessToken ? getUserFromAccessToken(verifiedAccessToken) : null;
  } else if (refreshToken) {
    const verifiedRefreshToken = verifyToken(refreshToken);

    locals.user = verifiedRefreshToken ? await getUserFromRefreshToken(verifiedRefreshToken) : null;

    if (locals.user) {
      setAccessToken(cookies, locals.user);
    }
  }
}

function protectRoute(event: RequestEvent) {
  const {
    locals,
    url: { pathname },
  } = event;

  if (locals.user && ["/auth/signin", "/auth/signup"].includes(pathname)) {
    redirect(HttpStatusCode.TEMPORARY_REDIRECT, "/");
  }

  if (!locals.user && ["/"].includes(pathname)) {
    redirect(HttpStatusCode.TEMPORARY_REDIRECT, "/auth/signin");
  }
}

export const handle: Handle = async ({ event, resolve }) => {
  await getUser(event);

  protectRoute(event);

  const response = await resolve(event);

  return response;
};
