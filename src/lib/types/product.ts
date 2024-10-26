import type { CheckboxState, PaginationConfig } from "$lib/types";

type ProductAvailability = "Tersedia" | "Sedikit" | "Tidak Tersedia";

export type ProductTable = {
  id: number;
  userId: string;
  name: string;
  quantity: number;
  availability: ProductAvailability;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date;
};

export type PriceTable = {
  id: number;
  productId: number;
  buyPrice: number;
  sellPrice: number;
  validFrom: Date;
  validTo: Date;
};

export type Product = Pick<ProductTable, "id" | "name" | "quantity" | "availability"> &
  Pick<PriceTable, "buyPrice" | "sellPrice"> & {
    priceId: PriceTable["id"];
    totalBuyPrice: PriceTable["buyPrice"];
    totalSellPrice: PriceTable["sellPrice"];
  };

export type FormattedProduct = Omit<
  Product,
  "buyPrice" | "totalBuyPrice" | "sellPrice" | "totalSellPrice"
> & {
  buyPrice: string;
  totalBuyPrice: string;
  sellPrice: string;
  totalSellPrice: string;
};

export interface ProductStore {
  products: Map<FormattedProduct["id"], FormattedProduct>;
  config: PaginationConfig;
  table: {
    state: CheckboxState;
    products: Map<FormattedProduct["id"], true>;
  };
}
