import { getUserFromSignUpForm, insertUser, setCookieUserToken } from "$lib/server/features/user";
import { argonHash, serverErrorHandler } from "$lib/server/utils";
import { json } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";

export const POST: RequestHandler = async ({ cookies, request }) => {
  try {
    const { username, password } = getUserFromSignUpForm(await request.json());

    const passwordHash = await argonHash(password);

    const user = await insertUser({
      username,
      passwordHash,
    });

    setCookieUserToken(cookies, user);

    return json(
      {
        message: "Berhasil mendaftarkan akun.",
        data: user,
      },
      {
        status: 201,
      },
    );
  } catch (error) {
    return serverErrorHandler(error);
  }
};
