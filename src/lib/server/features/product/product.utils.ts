import { buyPriceSchema, nameSchema, quantitySchema, sellPriceSchema } from "$lib/features/product";
import type { UserTable } from "$lib/features/user";
import { getProducts, getTotalProduct } from "$lib/server/features/product";
import { InvalidDataError } from "$lib/server/utils";
import { object, safeParse } from "valibot";

export function getProductFromForm(data: any) {
  const { success, output: product } = safeParse(
    object({
      name: nameSchema,
      quantity: quantitySchema,
      buyPrice: buyPriceSchema,
      sellPrice: sellPriceSchema,
    }),
    data,
  );

  if (!success) {
    throw new InvalidDataError(
      "Nama atau jumlah atau harga beli atau harga jual yang dimasukkan salah.",
    );
  }

  return product;
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
