import type { productOrderList, productSortList } from "$lib/stores";
import type { CheckboxState, PaginationConfig, UserTable } from "$lib/types";

type ProductAvailability = "Tersedia" | "Sedikit" | "Tidak Tersedia";

export interface ProductTable {
  id: number;
  userId: UserTable["id"];
  name: string;
  quantity: number;
  availability: ProductAvailability;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date;
}

export interface PriceTable {
  id: number;
  productId: number;
  buyPrice: number;
  sellPrice: number;
  validFrom: Date;
  validTo: Date;
}

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
  buyPriceRaw: number;
  sellPriceRaw: number;
  buyPrice: string;
  totalBuyPrice: string;
  sellPrice: string;
  totalSellPrice: string;
};

export type SortKey = (typeof productSortList)[number]["key"];
export type OrderKey = (typeof productOrderList)[number]["key"];

export interface ProductConfig extends PaginationConfig {
  sort: SortKey;
  order: OrderKey;
}

export interface ProductStore {
  products: Map<FormattedProduct["id"], FormattedProduct>;
  config: ProductConfig;
  table: {
    state: CheckboxState;
    products: Map<FormattedProduct["id"], true>;
    selectedId: FormattedProduct["id"] | null;
  };
}
