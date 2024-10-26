import { LimitSchema, PageSchema } from "$lib/schemas";
import { object, parse } from "valibot";

export function getPaginationFromSearchParams(searchParams: URLSearchParams) {
  return parse(
    object({
      page: PageSchema,
      limit: LimitSchema,
    }),
    Object.fromEntries(searchParams.entries()),
  );
}
