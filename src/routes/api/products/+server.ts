import {
  addProduct,
  getProductFromForm,
  getProductsWithConfig,
} from "$lib/features/product/server";
import {
  getPaginationFromSearchParams,
  serverErrorHandler,
  UnauthorizedError,
} from "$lib/utils/server";
import { json } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";

export const GET: RequestHandler = async ({ locals, url: { searchParams } }) => {
  try {
    if (!locals.user) {
      throw new UnauthorizedError();
    }

    const pagination = getPaginationFromSearchParams(searchParams);

    const productsWithConfig = await getProductsWithConfig({
      userId: locals.user.id,
      ...pagination,
    });

    return json({
      message: "Berhasil mengambil produk",
      data: productsWithConfig,
    });
  } catch (error) {
    return serverErrorHandler(error);
  }
};

export const POST: RequestHandler = async ({ locals, request, url: { searchParams } }) => {
  try {
    if (!locals.user) {
      throw new UnauthorizedError();
    }

    const product = getProductFromForm(await request.json());

    await addProduct({ userId: locals.user.id, ...product });

    const pagination = getPaginationFromSearchParams(searchParams);

    const productsWithConfig = await getProductsWithConfig({
      userId: locals.user.id,
      ...pagination,
    });

    return json({
      message: "Berhasil menambah produk",
      data: productsWithConfig,
    });
  } catch (error) {
    return serverErrorHandler(error);
  }
};
