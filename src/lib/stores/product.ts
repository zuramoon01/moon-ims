import type {
  ColumnNamesProductTable,
  FormattedProduct,
  PaginationConfig,
  Product,
  ProductStore,
} from "$lib/types";
import { rupiahCurrency } from "$lib/utils";
import { derived, readonly, writable } from "svelte/store";

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
      order: {
        name: null,
        sort: "DESC",
      },
    },
  });

  function setProductStore(data: { products: Product[]; config: PaginationConfig }) {
    productStore.update((currentState) => {
      const { products, table } = currentState;

      products.clear();
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

      currentState.config = data.config;

      table.products.clear();
      table.state = "false";

      return currentState;
    });
  }

  function updateTable({
    type,
    productId,
    action,
  }:
    | {
        type: "single";
        productId: FormattedProduct["id"];
        action?: never;
      }
    | {
        type: "group";
        productId?: never;
        action?: "reset";
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
        if (action === "reset" || table.state === "true") {
          table.products.clear();
        } else {
          products.forEach((product) => {
            table.products.set(product.id, true);
          });
        }
      }

      if (products.size > 0 && table.products.size === products.size) {
        table.state = "true";
      } else if (table.products.size > 0) {
        table.state = "indeterminate";
      } else {
        table.state = "false";
      }

      return currentState;
    });
  }

  function updateTableOrder(name: ColumnNamesProductTable) {
    productStore.update((currentState) => {
      const {
        table: { order },
      } = currentState;

      if (name !== order.name) {
        order.name = name;
        order.sort = "DESC";
      } else if (order.sort === "ASC") {
        order.name = null;
        order.sort = "DESC";
      } else {
        order.sort = "ASC";
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
    updateTable,
    updateTableOrder,
  };
};

export const productStore = createProductStore();
