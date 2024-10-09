import { getProducts, getTotalProduct } from "$lib/server/features/product";
import { errorHandler, UnauthorizedError } from "$lib/server/utils";
import { limitSchema, pageSchema } from "$lib/validations";
import { json } from "@sveltejs/kit";
import * as v from "valibot";
import type { RequestHandler } from "./$types";

export const GET: RequestHandler = async ({ locals, url: { searchParams } }) => {
  try {
    if (!locals.user) {
      throw new UnauthorizedError();
    }

    let { page, limit } = v.parse(
      v.object({
        page: pageSchema,
        limit: limitSchema,
      }),
      Object.fromEntries(searchParams.entries()),
    );
    let offset = (page - 1) * limit;

    let [products, totalProduct] = await Promise.all([
      getProducts({ userId: locals.user.id, limit, offset }),
      getTotalProduct(locals.user.id),
    ]);

    console.log(products, totalProduct);

    const total = totalProduct.length === 1 ? Number(totalProduct[0]?.total) : 0;

    // Cari produk dengan mengurangi page selama total produk tidak sama dengan 0 dan produk tidak ditemukan
    if (total > 0 && products.length === 0) {
      while (offset >= total && offset !== 0) {
        page -= 1;
        offset = (page - 1) * limit;
      }

      products = await getProducts({ userId: locals.user.id, limit, offset });
    }

    return json({
      message: "Berhasil mengambil produk",
      data: {
        products,
        config: {
          currentPage: page,
          totalPage: Math.ceil(total / limit),
          from: offset + 1,
          to: Math.min(offset + limit, total),
          limit: limit,
          total,
        },
      },
    });
  } catch (error) {
    const { responseData, responseInit } = errorHandler(error);

    return json(responseData, responseInit);
  }
};
