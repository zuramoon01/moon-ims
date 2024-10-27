import type { PaginationConfig, Product } from "$lib/types";
import { PayloadError } from "$lib/utils";
import { array, flatten, literal, number, object, safeParse, string, union } from "valibot";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function getProductResponseData(data: any): {
  message: string;
  data: { products: Product[]; config: PaginationConfig };
} {
  const {
    success,
    output: responseData,
    issues,
  } = safeParse(
    object({
      message: string(),
      data: object({
        products: array(
          object({
            id: number(),
            name: string(),
            quantity: number(),
            availability: union([
              literal("Tersedia"),
              literal("Sedikit"),
              literal("Tidak Tersedia"),
            ]),
            priceId: number(),
            buyPrice: number(),
            totalBuyPrice: number(),
            sellPrice: number(),
            totalSellPrice: number(),
          }),
        ),
        config: object({
          currentPage: number(),
          totalPage: number(),
          from: number(),
          to: number(),
          limit: number(),
          total: number(),
        }),
      }),
    }),
    data,
    {
      abortEarly: true,
      abortPipeEarly: true,
    },
  );

  if (!success) {
    console.error(flatten(issues));

    throw new PayloadError();
  }

  return responseData;
}
