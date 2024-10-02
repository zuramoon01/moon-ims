import { foreignKey, integer, pgTable, primaryKey, timestamp } from "drizzle-orm/pg-core";
import { productsTable } from "./product";
import { relations } from "drizzle-orm";

export const pricesTable = pgTable(
  "prices",
  {
    id: integer("id").notNull().generatedAlwaysAsIdentity(),
    productId: integer("product_id").notNull(),
    buyPrice: integer("buy_price").notNull(),
    sellPrice: integer("sell_price").notNull(),
    validFrom: timestamp("valid_from", {
      withTimezone: true,
      mode: "date",
    })
      .notNull()
      .defaultNow(),
    validTo: timestamp("valid_to", {
      withTimezone: true,
      mode: "date",
    }),
    createdAt: timestamp("created_at", {
      withTimezone: true,
      mode: "date",
    })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", {
      withTimezone: true,
      mode: "date",
    })
      .notNull()
      .defaultNow(),
    deletedAt: timestamp("deleted_at", {
      withTimezone: true,
      mode: "date",
    }),
  },
  (table) => {
    return {
      primaryKey: primaryKey({
        name: "prices_pkey",
        columns: [table.id],
      }),
      productReference: foreignKey({
        name: "prices_product_id_fkey",
        columns: [table.productId],
        foreignColumns: [productsTable.id],
      }).onDelete("cascade"),
    };
  },
);

export const pricesRelations = relations(pricesTable, ({ one }) => {
  return {
    product: one(productsTable, {
      fields: [pricesTable.productId],
      references: [productsTable.id],
    }),
  };
});
