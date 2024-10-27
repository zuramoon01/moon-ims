import { db, pricesTable, productsTable } from "$lib/database";
import type { PriceTable, ProductTable, UserTable } from "$lib/types";
import { InvalidDataError } from "$lib/utils/server";
import { and, count, desc, eq, inArray, isNull, sql } from "drizzle-orm";

export async function validateProductsById(data: {
  ids: ProductTable["id"][];
  userId: ProductTable["userId"];
}) {
  const { ids, userId } = data;

  const [{ count: totalProduct }] = await db
    .select({ count: count() })
    .from(productsTable)
    .innerJoin(pricesTable, eq(pricesTable.productId, productsTable.id))
    .where(
      and(
        inArray(productsTable.id, ids),
        eq(productsTable.userId, userId),
        isNull(productsTable.deletedAt),
        isNull(pricesTable.validTo),
      ),
    );

  if (totalProduct !== ids.length) {
    throw new InvalidDataError("Data produk tidak valid. Silahkan coba kembali.");
  }
}

export function getTotalProduct(userId: UserTable["id"]) {
  return db
    .select({ count: count() })
    .from(productsTable)
    .innerJoin(pricesTable, eq(pricesTable.productId, productsTable.id))
    .where(
      and(
        eq(productsTable.userId, userId),
        isNull(productsTable.deletedAt),
        isNull(pricesTable.validTo),
      ),
    );
}

export function getProducts(data: { userId: UserTable["id"]; limit: number; offset: number }) {
  const { userId, limit, offset } = data;

  return db
    .select({
      id: productsTable.id,
      name: productsTable.name,
      quantity: productsTable.quantity,
      availability: sql<ProductTable["availability"]>`
            CASE
                WHEN ${productsTable.quantity} = 0 THEN 'Tidak Tersedia'
                WHEN ${productsTable.quantity} < 10 THEN 'Sedikit'
                ELSE 'Tersedia'
            END
         `.as("availability"),
      priceId: pricesTable.id,
      buyPrice: pricesTable.buyPrice,
      totalBuyPrice: sql`${productsTable.quantity} * ${pricesTable.buyPrice}`.as("totalBuyPrice"),
      sellPrice: pricesTable.sellPrice,
      totalSellPrice: sql`${productsTable.quantity} * ${pricesTable.sellPrice}`.as(
        "totalSellPrice",
      ),
    })
    .from(productsTable)
    .innerJoin(pricesTable, eq(pricesTable.productId, productsTable.id))
    .where(
      and(
        eq(productsTable.userId, userId),
        isNull(productsTable.deletedAt),
        isNull(pricesTable.validTo),
      ),
    )
    .orderBy(desc(productsTable.createdAt))
    .limit(limit)
    .offset(offset);
}

export function addProduct({
  userId,
  name,
  quantity,
  buyPrice,
  sellPrice,
}: {
  userId: UserTable["id"];
  name: ProductTable["name"];
  quantity: ProductTable["quantity"];
  buyPrice: PriceTable["buyPrice"];
  sellPrice: PriceTable["sellPrice"];
}) {
  return db.transaction(async (tx) => {
    const [newProduct] = await tx
      .insert(productsTable)
      .values({ userId, name, quantity })
      .returning({ id: productsTable.id });

    await tx.insert(pricesTable).values({ productId: newProduct.id, buyPrice, sellPrice });
  });
}

export function deleteProducts(ids: ProductTable["id"][]) {
  return db
    .update(productsTable)
    .set({ deletedAt: sql`now()` })
    .where(inArray(productsTable.id, ids));
}
