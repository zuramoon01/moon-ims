import { db, pricesTable, productsTable } from "$lib/database";
import type { OrderKey, PriceTable, ProductTable, SortKey, UserTable } from "$lib/types";
import { InvalidDataError } from "$lib/utils/server";
import { and, asc, count, desc, eq, inArray, isNull, sql } from "drizzle-orm";

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

export function getProducts(data: {
  userId: UserTable["id"];
  limit: number;
  offset: number;
  sort: SortKey;
  order: OrderKey;
}) {
  const { userId, limit, offset, sort, order } = data;
  const sortColumn = sql`${
    sort === "name"
      ? productsTable.name
      : sort === "quantity"
        ? productsTable.quantity
        : sort === "buy_price"
          ? pricesTable.buyPrice
          : sort === "sell_price"
            ? pricesTable.sellPrice
            : productsTable.createdAt
  }`;

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
    .orderBy(order === "asc" ? asc(sortColumn) : desc(sortColumn))
    .limit(limit)
    .offset(offset);
}

export async function getProductById(data: {
  id: ProductTable["id"];
  userId: UserTable["id"];
  priceId: PriceTable["id"];
}) {
  const { id, userId, priceId } = data;

  const [product] = await db
    .select({
      id: productsTable.id,
      name: productsTable.name,
      quantity: productsTable.quantity,
      priceId: pricesTable.id,
      buyPrice: pricesTable.buyPrice,
      sellPrice: pricesTable.sellPrice,
    })
    .from(productsTable)
    .innerJoin(pricesTable, eq(pricesTable.productId, productsTable.id))
    .where(
      and(
        eq(productsTable.id, id),
        eq(productsTable.userId, userId),
        isNull(productsTable.deletedAt),
        eq(pricesTable.id, priceId),
        isNull(pricesTable.validTo),
      ),
    )
    .limit(1);

  if (!product) {
    throw new InvalidDataError(`Product dengan id ${id} tidak ditemukan.`);
  }

  return product;
}

export function addProduct(data: {
  userId: UserTable["id"];
  name: ProductTable["name"];
  quantity: ProductTable["quantity"];
  buyPrice: PriceTable["buyPrice"];
  sellPrice: PriceTable["sellPrice"];
}) {
  const { userId, name, quantity, buyPrice, sellPrice } = data;

  return db.transaction(async (tx) => {
    const [newProduct] = await tx
      .insert(productsTable)
      .values({ userId, name, quantity })
      .returning({ id: productsTable.id });

    await tx.insert(pricesTable).values({ productId: newProduct.id, buyPrice, sellPrice });
  });
}

export function updateProduct(data: {
  id: ProductTable["id"];
  priceId: PriceTable["id"];
  name: ProductTable["name"];
  quantity: ProductTable["quantity"];
  buyPrice: PriceTable["buyPrice"];
  sellPrice: PriceTable["sellPrice"];
  isProductChange: boolean;
  isPriceChange: boolean;
}) {
  const { id, priceId, name, quantity, buyPrice, sellPrice, isProductChange, isPriceChange } = data;

  return db.transaction(async (tx) => {
    if (isProductChange) {
      await tx
        .update(productsTable)
        .set({ name, quantity, updatedAt: sql`current_timestamp` })
        .where(eq(productsTable.id, id));
    }

    if (isPriceChange) {
      await Promise.all([
        tx
          .update(pricesTable)
          .set({
            validTo: sql`current_timestamp`,
          })
          .where(eq(pricesTable.id, priceId)),

        tx
          .insert(pricesTable)
          .values({
            productId: id,
            buyPrice,
            sellPrice,
          })
          .onConflictDoNothing(),
      ]);
    }
  });
}

export function deleteProducts(ids: ProductTable["id"][]) {
  return db
    .update(productsTable)
    .set({ deletedAt: sql`current_timestamp` })
    .where(inArray(productsTable.id, ids));
}
