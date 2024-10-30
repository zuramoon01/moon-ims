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

const timestamps = {
  createdAt: timestamp({
    withTimezone: true,
    mode: "date",
  })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp({
    withTimezone: true,
    mode: "date",
  })
    .notNull()
    .defaultNow(),
};

const timestampsWithDeletedAt = {
  ...timestamps,
  deletedAt: timestamp({
    withTimezone: true,
    mode: "date",
  }),
};

export const usersTable = pgTable(
  "users",
  {
    id: uuid().notNull(),
    username: varchar({
      length: 32,
    })
      .notNull()
      .unique("users_username_unique"),
    passwordHash: varchar({
      length: 256,
    }).notNull(),
    ...timestamps,
    companyName: varchar({ length: 256 }).default(sql`NULL`),
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
    id: integer().notNull().generatedAlwaysAsIdentity(),
    userId: uuid().notNull(),
    name: varchar({ length: 256 }).notNull(),
    quantity: smallint().notNull(),
    ...timestampsWithDeletedAt,
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
    id: integer().notNull().generatedAlwaysAsIdentity(),
    productId: integer().notNull(),
    buyPrice: integer().notNull(),
    sellPrice: integer().notNull(),
    validFrom: timestamp({
      withTimezone: true,
      mode: "date",
    })
      .notNull()
      .defaultNow(),
    validTo: timestamp({
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
