import { relations, sql } from "drizzle-orm";
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

export const usersTable = pgTable(
  "users",
  {
    id: uuid("id").notNull(),
    username: varchar("username", {
      length: 32,
    })
      .notNull()
      .unique("users_username_unique"),
    passwordHash: varchar("password_hash", {
      length: 256,
    }).notNull(),
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
    companyName: varchar("company_name", { length: 256 }).default(sql`NULL`),
  },
  (table) => {
    return {
      primaryKey: primaryKey({
        name: "users_pkey",
        columns: [table.id],
      }),
    };
  },
);

export const usersRelations = relations(usersTable, ({ many }) => ({
  products: many(productsTable),
}));

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
