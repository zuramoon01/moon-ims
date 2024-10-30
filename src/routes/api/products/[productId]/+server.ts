import {
  getProductById,
  getProductFromForm,
  getProductsWithConfig,
  updateProduct,
} from "$lib/features/product/server";
import { HttpStatusCode } from "$lib/types";
import {
  getPaginationFromSearchParams,
  InvalidDataError,
  serverErrorHandler,
  UnauthorizedError,
} from "$lib/utils/server";
import { error, json } from "@sveltejs/kit";
import { object, pipe, safeParse, string, transform } from "valibot";
import type { RequestHandler } from "./$types";

export const PUT: RequestHandler = async ({ params, locals, request, url: { searchParams } }) => {
  try {
    if (!locals.user) {
      throw new UnauthorizedError();
    }

    const { success, output } = safeParse(
      object({
        productId: pipe(string(), transform(Number)),
      }),
      params,
    );

    if (!success) {
      error(HttpStatusCode.NotFound);
    }

    const { productId } = output;

    const productData = getProductFromForm(await request.json());

    if (!productData.priceId) {
      throw new InvalidDataError(`Product dengan id ${productId} tidak ditemukan.`);
    }

    const product = await getProductById({
      id: productId,
      userId: locals.user.id,
      priceId: productData.priceId,
    });

    const pagination = getPaginationFromSearchParams(searchParams);

    const isProductChange =
      product.name !== productData.name || product.quantity !== productData.quantity;

    const isPriceChange =
      product.priceId !== productData.priceId ||
      product.buyPrice !== productData.buyPrice ||
      product.sellPrice !== productData.sellPrice;

    if (!isProductChange && !isPriceChange) {
      throw new InvalidDataError("Tidak ada perubahan pada data produk yang diberikan.");
    }

    await updateProduct({
      id: productId,
      ...productData,
      priceId: productData.priceId,
      isProductChange,
      isPriceChange,
    });

    const productsWithConfig = await getProductsWithConfig({
      userId: locals.user.id,
      ...pagination,
    });

    return json({
      message: "Berhasil mengubah produk",
      data: productsWithConfig,
    });
  } catch (error) {
    return serverErrorHandler(error);
  }
};
