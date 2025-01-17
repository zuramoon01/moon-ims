import { getUserByUsename, getUserFromSignInForm, setCookieUser } from "$lib/features/user/server";
import { argonVerify, InvalidDataError, serverErrorHandler } from "$lib/utils/server";
import { json } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";

export const POST: RequestHandler = async ({ cookies, request }) => {
  try {
    const { username, password } = getUserFromSignInForm(await request.json());

    const user = await getUserByUsename(username);

    if (!(await argonVerify(password, user.passwordHash))) {
      throw new InvalidDataError("Nama atau kata sandi yang dimasukkan salah.");
    }

    const userData = {
      id: user.id,
      username: user.username,
      companyName: user.companyName,
    };

    setCookieUser(cookies, userData);

    return json({
      message: "Berhasil masuk.",
      data: userData,
    });
  } catch (error) {
    return serverErrorHandler(error);
  }
};
