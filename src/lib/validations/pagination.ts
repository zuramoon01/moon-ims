import { fallback, maxValue, minValue, optional, pipe, string, transform } from "valibot";

export const pageSchema = fallback(
  pipe(optional(string(), "1"), transform(Number), minValue(1)),
  1,
);

export const limitSchema = fallback(
  pipe(optional(string(), "15"), transform(Number), minValue(1), maxValue(15)),
  15,
);
