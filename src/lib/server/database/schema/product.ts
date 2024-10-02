import {
  foreignKey,
  index,
  integer,
  pgTable,
  primaryKey,
  smallint,
  timestamp,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";
import { usersTable } from "./user";
import { pricesTable } from "./price";
import { relations } from "drizzle-orm";

export const productsTable = pgTable(
  "products",
  {
    id: integer("id").notNull().generatedAlwaysAsIdentity(),
    userId: uuid("user_id").notNull(),
    name: varchar("name", { length: 256 }).notNull(),
    quantity: smallint("quantity").notNull(),
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
        name: "products_pkey",
        columns: [table.id],
      }),
      userReference: foreignKey({
        name: "products_user_id_fkey",
        columns: [table.userId],
        foreignColumns: [usersTable.id],
      }).onDelete("cascade"),
      nameIdx: index("products_name_idx").on(table.name),
    };
  },
);

export const productsRelations = relations(productsTable, ({ one, many }) => {
  return {
    user: one(usersTable, {
      fields: [productsTable.userId],
      references: [usersTable.id],
    }),
    prices: many(pricesTable),
  };
});
