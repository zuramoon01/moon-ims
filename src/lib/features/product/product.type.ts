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

export interface Product extends Pick<ProductTable, "id" | "name" | "quantity" | "availability"> {}

export interface ProductStore {
  products: Product[];
  config: PaginationConfig;
}
