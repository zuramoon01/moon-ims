import {
  deleteCookieAccessToken,
  deleteCookieRefreshToken,
  deleteCookieUser,
  getUserFromAccessToken,
  getUserFromRefreshToken,
  setCookieAccessToken,
} from "$lib/features/user/server";
import { Route } from "$lib/stores";
import { HttpStatusCode } from "$lib/types";
import { Cookie, getCookie, verifyToken } from "$lib/utils/server";
import { redirect, type Handle, type RequestEvent } from "@sveltejs/kit";

export const handle: Handle = async ({ event, resolve }) => {
  await authenticateUser(event);

  protectRoute(event);

  const response = await resolve(event);

  return response;
};

async function authenticateUser(event: RequestEvent) {
  const { locals } = event;

  locals.user = authenticateUserFromAccessToken(event);

  if (locals.user === null) {
    locals.user = await authenticateUserFromRefreshToken(event);
  }
}

function authenticateUserFromAccessToken(event: RequestEvent) {
  const { cookies } = event;

  const accessToken = getCookie(cookies, Cookie.AccessToken.Name);

  if (!accessToken) {
    return null;
  }

  const verifiedAccessToken = verifyToken(accessToken);

  if (verifiedAccessToken === undefined) {
    deleteCookieUser(cookies);

    return null;
  }

  if (verifiedAccessToken === null) {
    deleteCookieAccessToken(cookies);

    return null;
  }

  const user = getUserFromAccessToken(verifiedAccessToken);

  if (!user) {
    deleteCookieUser(cookies);

    return null;
  }

  return user;
}

async function authenticateUserFromRefreshToken(event: RequestEvent) {
  const { cookies } = event;

  const refreshToken = getCookie(cookies, Cookie.RefreshToken.Name);

  if (!refreshToken) {
    return null;
  }

  const verifiedRefreshToken = verifyToken(refreshToken);

  if (verifiedRefreshToken === undefined) {
    deleteCookieRefreshToken(cookies);

    return null;
  }

  if (verifiedRefreshToken === null) {
    deleteCookieRefreshToken(cookies);

    return null;
  }

  const user = await getUserFromRefreshToken(verifiedRefreshToken);

  if (!user) {
    deleteCookieRefreshToken(cookies);

    return null;
  }

  setCookieAccessToken(cookies, user);

  return user;
}

function protectRoute(event: RequestEvent) {
  const {
    locals: { user },
    url: { pathname },
  } = event;

  const { Dashboard, Auth } = Route;

  if (user && ([Auth.SignIn, Auth.SignUp] as string[]).includes(pathname)) {
    redirect(HttpStatusCode.TemporaryRedirect, Dashboard);
  }

  if (!user && pathname === Dashboard) {
    redirect(HttpStatusCode.TemporaryRedirect, Auth.SignIn);
  }
}
