import type { Product } from "$lib/features/product";
import type { UserTable } from "$lib/features/user";
import { sql } from "$lib/server/database";

export function getTotalProduct(userId: UserTable["id"]) {
  return sql<[{ total: string }]>`
    SELECT
      COUNT(*) AS total 
    FROM products
      INNER JOIN prices ON prices.product_id = products.id
    WHERE
      1 = 1
      AND products.user_id = ${userId}
      AND products.deleted_at IS NULL
      AND prices.valid_to IS NULL
  `;
}

export function getProducts({
  userId,
  limit,
  offset,
}: {
  userId: UserTable["id"];
  limit: number;
  offset: number;
}) {
  return sql<Product[]>`
    SELECT
      products.id
      , products.name
      , products.quantity
      , CASE
          WHEN products.quantity = 0 THEN 'Tidak Tersedia'
          WHEN products.quantity < 10 THEN 'Sedikit'
          ELSE 'Tersedia'
        END availability
      , prices.id AS "priceId"
      , prices.buy_price AS "buyPrice"
      , products.quantity * prices.buy_price AS "totalBuyPrice"
      , prices.sell_price AS "sellPrice"
      , products.quantity * prices.sell_price AS "totalSellPrice"
    FROM products
      INNER JOIN prices ON prices.product_id = products.id
    WHERE
      1 = 1
      AND products.user_id = ${userId}
      AND products.deleted_at IS NULL
      AND prices.valid_to IS NULL
    ORDER BY created_at DESC
    LIMIT ${limit}
    OFFSET ${offset}
  `;
}
