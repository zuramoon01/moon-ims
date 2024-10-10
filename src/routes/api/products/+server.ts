import { buyPriceSchema, nameSchema, quantitySchema, sellPriceSchema } from "$lib/features/product";
import { addProduct, getPagination, getProductsWithConfig } from "$lib/server/features/product";
import { errorHandler, InvalidDataError, UnauthorizedError } from "$lib/server/utils";
import { json } from "@sveltejs/kit";
import * as v from "valibot";
import type { RequestHandler } from "./$types";

export const GET: RequestHandler = async ({ locals, url: { searchParams } }) => {
  try {
    if (!locals.user) {
      throw new UnauthorizedError();
    }

    const pagination = getPagination(searchParams);

    const productsWithConfig = await getProductsWithConfig({
      userId: locals.user.id,
      ...pagination,
    });

    return json({
      message: "Berhasil mengambil produk",
      data: productsWithConfig,
    });
  } catch (error) {
    const { responseData, responseInit } = errorHandler(error);

    return json(responseData, responseInit);
  }
};

export const POST: RequestHandler = async ({ locals, request, url: { searchParams } }) => {
  try {
    if (!locals.user) {
      throw new UnauthorizedError();
    }

    const pagination = getPagination(searchParams);

    const { output: product, issues } = v.safeParse(
      v.object({
        name: nameSchema,
        quantity: quantitySchema,
        buyPrice: buyPriceSchema,
        sellPrice: sellPriceSchema,
      }),
      await request.json(),
    );

    if (issues) {
      throw new InvalidDataError(
        "Nama atau jumlah atau harga beli atau harga jual yang dimasukkan salah.",
      );
    }

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
    const { responseData, responseInit } = errorHandler(error);

    return json(responseData, responseInit);
  }
};
