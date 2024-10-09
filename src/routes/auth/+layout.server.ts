import { redirect } from "@sveltejs/kit";
import { HttpStatusCode } from "axios";
import type { LayoutServerLoad } from "./$types";

export const load: LayoutServerLoad = ({ locals }) => {
  if (locals.user) {
    redirect(HttpStatusCode.TemporaryRedirect, "/auth/signin");
  }
};
