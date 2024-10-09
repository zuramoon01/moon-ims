import type { UserTable } from "$lib/features/user";
import { sql } from "$lib/server/database";

export function getTotalProduct(userId: UserTable["id"]) {
  return sql`
    SELECT
      COUNT(*) AS total
    FROM products
    WHERE
      user_id = ${userId}
      AND deleted_at IS NULL
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
  return sql`
    SELECT
      id,
      name,
      quantity,
      CASE
        WHEN quantity = 0 THEN 'Tidak Tersedia'
        WHEN quantity < 10 THEN 'Sedikit'
        ELSE 'Tersedia'
      END availability
    FROM products
    WHERE
      user_id = ${userId}
      AND deleted_at IS NULL
    ORDER BY
      created_at DESC
    LIMIT
      ${limit}
    OFFSET
      ${offset}
  `;
}
