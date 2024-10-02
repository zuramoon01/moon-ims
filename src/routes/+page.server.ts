import { getProducts } from "$lib/server/database";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ parent }) => {
  const { user } = await parent();

  return {
    products: user ? await getProducts.execute({ userId: user.id }) : [],
  };
};
