import type { PaginationConfig } from "$lib/types";

export interface ProductTable {
  id: number;
  userId: string;
  name: string;
  quantity: number;
  availability: "Tersedia" | "Sedikit" | "Tidak Tersedia";
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

export interface Product
  extends Pick<ProductTable, "id" | "name" | "quantity" | "availability">,
    Pick<PriceTable, "buyPrice" | "sellPrice"> {
  priceId: PriceTable["id"];
  totalBuyPrice: PriceTable["buyPrice"];
  totalSellPrice: PriceTable["sellPrice"];
}

export interface FormattedProduct
  extends Omit<Product, "buyPrice" | "totalBuyPrice" | "sellPrice" | "totalSellPrice"> {
  buyPrice: string;
  totalBuyPrice: string;
  sellPrice: string;
  totalSellPrice: string;
}

export interface ProductStore {
  products: FormattedProduct[];
  config: PaginationConfig;
}
