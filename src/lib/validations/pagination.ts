import * as v from "valibot";

export const pageSchema = v.pipe(v.optional(v.string(), "1"), v.transform(Number), v.minValue(1));
export const limitSchema = v.fallback(
  v.pipe(v.optional(v.string(), "15"), v.transform(Number), v.minValue(1), v.maxValue(15)),
  15,
);
