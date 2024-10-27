import {
  addProduct,
  deleteProducts,
  getIdsFromForm,
  getProductFromForm,
  getProductsWithConfig,
  validateProductsById,
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

    const pagination = getPaginationFromSearchParams(searchParams);

    await addProduct({ userId: locals.user.id, ...product });

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

export const DELETE: RequestHandler = async ({ locals, request, url: { searchParams } }) => {
  try {
    if (!locals.user) {
      throw new UnauthorizedError();
    }

    const { ids } = getIdsFromForm(await request.json());

    await validateProductsById({
      ids,
      userId: locals.user.id,
    });

    const pagination = getPaginationFromSearchParams(searchParams);

    await deleteProducts(ids);

    const productsWithConfig = await getProductsWithConfig({
      userId: locals.user.id,
      ...pagination,
    });

    return json({
      message: "Berhasil menghapus produk",
      data: productsWithConfig,
    });
  } catch (error) {
    return serverErrorHandler(error);
  }
};
