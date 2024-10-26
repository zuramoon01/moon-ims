import { BuyPriceSchema, NameSchema, QuantitySchema, SellPriceSchema } from "$lib/features/product";
import { getProducts, getTotalProduct } from "$lib/features/product/server";
import type { UserTable } from "$lib/types";
import { InvalidDataError } from "$lib/utils/server";
import { flatten, object, safeParse } from "valibot";

export function getProductFromForm(data: any) {
  console.log(data);

  const {
    success,
    output: product,
    issues,
  } = safeParse(
    object({
      name: NameSchema,
      quantity: QuantitySchema,
      buyPrice: BuyPriceSchema,
      sellPrice: SellPriceSchema,
    }),
    data,
  );

  if (!success) {
    console.error(flatten(issues));

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

  let [products, [{ count: totalProduct }]] = await Promise.all([
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
