import type { FormattedProduct, Product, ProductStore } from "$lib/features/product";
import type { PaginationConfig } from "$lib/types";
import { rupiahCurrency } from "$lib/utils";
import { derived, readonly, writable } from "svelte/store";

export const productTableColumnBaseClass = "flex min-h-9 shrink-0 items-center bg-white px-4 py-2";

export const productTableTitles = [
  {
    name: "Nama",
    // Column Width Calculation
    // 100% = Ukuran yang bisa dicakup kolom nama

    // 2.25rem Kolom ceklis / 6rem Kolom Jumlah ... 10rem Kolom Total Harga Jual

    // 7px Gap antara kolom nama - kolom total harga jual
    classes:
      "w-[calc(100%_-_(2.25rem_+_6rem_+_12rem_+_12rem_+_10rem_+_12rem_+_10rem_+_7px))] min-w-60",
  },
  {
    name: "Jumlah",
    classes: "w-[6rem]",
  },
  {
    name: "Ketersediaan",
    classes: "w-[12rem]",
  },
  {
    name: "Harga Beli Per Satuan",
    classes: "w-[12rem]",
  },
  {
    name: "Total Harga Beli",
    classes: "w-[10rem]",
  },
  {
    name: "Harga Jual Per Satuan",
    classes: "w-[12rem]",
  },
  {
    name: "Total Harga Jual",
    classes: "w-[10rem]",
  },
] as const;

const createProductStore = () => {
  const productStore = writable<ProductStore>({
    products: new Map(),
    config: {
      currentPage: 0,
      totalPage: 0,
      from: 0,
      to: 0,
      limit: 0,
      total: 0,
    },
    table: {
      state: "false",
      products: new Map(),
    },
  });

  function setProductStore(data: { products: Product[]; config: PaginationConfig }) {
    productStore.update((currentState) => {
      const { products, table } = currentState;

      products.clear();
      table.products.clear();
      table.state = "false";
      currentState.config = data.config;

      data.products.forEach(
        ({ buyPrice, totalBuyPrice, sellPrice, totalSellPrice, ...product }) => {
          products.set(product.id, {
            ...product,
            buyPrice: rupiahCurrency.format(buyPrice),
            totalBuyPrice: rupiahCurrency.format(totalBuyPrice),
            sellPrice: rupiahCurrency.format(sellPrice),
            totalSellPrice: rupiahCurrency.format(totalSellPrice),
          });
        },
      );

      return currentState;
    });
  }

  function updateTableState({
    type,
    productId,
  }:
    | {
        type: "single";
        productId: FormattedProduct["id"];
      }
    | {
        type: "group";
        productId?: never;
      }) {
    productStore.update((currentState) => {
      const { products, table } = currentState;

      if (type === "single") {
        if (table.products.has(productId)) {
          table.products.delete(productId);
        } else {
          table.products.set(productId, true);
        }
      } else {
        if (table.state === "true") {
          table.products.clear();
        } else {
          products.forEach((product) => {
            table.products.set(product.id, true);
          });
        }
      }

      if (table.products.size === products.size) {
        table.state = "true";
      } else if (table.products.size > 0) {
        table.state = "indeterminate";
      } else {
        table.state = "false";
      }

      return currentState;
    });
  }

  const products = readonly(
    derived(productStore, ($productStore) => {
      return Array.from($productStore.products.values());
    }),
  );

  const config = readonly(
    derived(productStore, ($productStore) => {
      return $productStore.config;
    }),
  );

  const table = readonly(
    derived(productStore, ($productStore) => {
      return $productStore.table;
    }),
  );

  return {
    products,
    config,
    table,
    setProductStore,
    updateTableState,
  };
};

export const productStore = createProductStore();
