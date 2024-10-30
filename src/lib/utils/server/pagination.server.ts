import { LimitSchema, OrderSchema, PageSchema, SortSchema } from "$lib/schemas";
import { object, parse } from "valibot";

export function getPaginationFromSearchParams(searchParams: URLSearchParams) {
  return parse(
    object({
      page: PageSchema,
      limit: LimitSchema,
      sort: SortSchema,
      order: OrderSchema,
    }),
    Object.fromEntries(searchParams.entries()),
  );
}
