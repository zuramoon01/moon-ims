import type { OrderKey, SortKey } from "$lib/types";
import {
  fallback,
  literal,
  maxValue,
  minValue,
  optional,
  pipe,
  string,
  transform,
  union,
} from "valibot";

export const PageSchema = fallback(
  pipe(optional(string(), "1"), transform(Number), minValue(1)),
  1,
);

export const LimitSchema = fallback(
  pipe(optional(string(), "15"), transform(Number), minValue(1), maxValue(15)),
  15,
);

export const SortSchema = fallback(
  union([
    literal("created_at"),
    literal("name"),
    literal("quantity"),
    literal("buy_price"),
    literal("sell_price"),
  ]),
  "created_at" as SortKey,
);

export const OrderSchema = fallback(union([literal("desc"), literal("asc")]), "desc" as OrderKey);
