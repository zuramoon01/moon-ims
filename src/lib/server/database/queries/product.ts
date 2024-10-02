import type { ProductTable } from "$lib/types";
import { db, productsTable } from "$lib/server/database";
import { and, desc, eq, isNull, sql } from "drizzle-orm";

export const getProducts = db.query.productsTable
  .findMany({
    columns: {
      id: true,
      name: true,
      quantity: true,
    },
    extras: {
      availability: sql<ProductTable["availability"]>`
            CASE
                WHEN ${productsTable.quantity} = 0 THEN 'Tidak Tersedia'
                WHEN ${productsTable.quantity} < 10 THEN 'Sedikit'
                ELSE 'Tersedia'
            END
         `.as("availability"),
    },
    where: and(
      eq(productsTable.userId, sql.placeholder("userId")),
      isNull(productsTable.deletedAt),
    ),
    orderBy: desc(productsTable.createdAt),
  })
  .prepare("getProducts");
