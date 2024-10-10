import type { UserTable } from "$lib/features/user";
import { limitSchema, pageSchema } from "$lib/validations";
import { object, parse } from "valibot";
import { getProducts, getTotalProduct } from "./product.query";

export function getPagination(searchParams: URLSearchParams) {
  return parse(
    object({
      page: pageSchema,
      limit: limitSchema,
    }),
    Object.fromEntries(searchParams.entries()),
  );
}

export async function getProductsWithConfig({
  userId,
  page,
  limit,
}: {
  userId: UserTable["id"];
  page: number;
  limit: number;
}) {
  let offset = (page - 1) * limit;

  let [products, [{ total: totalProduct }]] = await Promise.all([
    getProducts({ userId, limit, offset }),
    getTotalProduct(userId),
  ]);

  // Cari produk dengan mengurangi page selama total produk tidak sama dengan 0 dan produk tidak ditemukan
  if (totalProduct > 0 && products.length === 0) {
    while (offset >= totalProduct && offset !== 0) {
      page -= 1;
      offset = (page - 1) * limit;
    }

    products = await getProducts({ userId, limit, offset });
  }

  return {
    products,
    config: {
      currentPage: page,
      totalPage: Math.ceil(totalProduct / limit),
      from: offset + 1,
      to: Math.min(offset + limit, totalProduct),
      limit: limit,
      total: totalProduct,
    },
  };
}
