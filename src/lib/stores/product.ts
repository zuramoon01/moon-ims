import type {
  FormattedProduct,
  OrderKey,
  Product,
  ProductConfig,
  ProductStore,
  SortKey,
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
      sort: "created_at",
      order: "desc",
    },
    table: {
      state: "false",
      products: new Map(),
      selectedId: null,
    },
  });

  function setProductStore(data: { products: Product[]; config: ProductConfig }) {
    productStore.update((currentState) => {
      const { products, table } = currentState;

      products.clear();
      data.products.forEach(
        ({ buyPrice, totalBuyPrice, sellPrice, totalSellPrice, ...product }) => {
          products.set(product.id, {
            ...product,
            buyPriceRaw: buyPrice,
            sellPriceRaw: sellPrice,
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
      table.selectedId = null;

      return currentState;
    });
  }

  function updateSort(newSort: SortKey) {
    productStore.update((currentState) => {
      currentState.config.sort = newSort;

      return currentState;
    });
  }

  function updateOrder(newOrder: OrderKey) {
    productStore.update((currentState) => {
      currentState.config.order = newOrder;

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

  function updateSelectedId(id: FormattedProduct["id"] | null) {
    productStore.update((currentState) => {
      currentState.table.selectedId = id;

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
    updateSort,
    updateOrder,
    updateTable,
    // updateTableOrder,
    updateSelectedId,
  };
};

export const productStore = createProductStore();
