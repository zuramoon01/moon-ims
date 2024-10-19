import type { Product } from "$lib/features/product";
import type { PaginationConfig } from "$lib/types";
import { array, literal, number, object, safeParse, string, union } from "valibot";

export function getProductResponseData(
  data: any,
): { message: string; data: { products: Product[]; config: PaginationConfig } } | null {
  const { success, output: responseData } = safeParse(
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

  return success ? responseData : null;
}
