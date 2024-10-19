import { limitSchema, pageSchema } from "$lib/validations";
import { object, parse } from "valibot";

export function getPaginationFromSearchParams(searchParams: URLSearchParams) {
  return parse(
    object({
      page: pageSchema,
      limit: limitSchema,
    }),
    Object.fromEntries(searchParams.entries()),
  );
}
