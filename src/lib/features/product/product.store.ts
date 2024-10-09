import type { ProductStore } from "$lib/features/product";
import { writable } from "svelte/store";

export const productTableColumnBaseClass = "flex min-h-9 shrink-0 items-center bg-white px-4 py-2";

export const productTableTitles = [
  {
    name: "",
    classes: "w-9 justify-center",
  },
  {
    name: "Nama",
    // Column Width Calculation
    // 100% = Ukuran yang bisa dicakup kolom nama

    // 2.25rem Kolom ceklis / 6rem Kolom Jumlah ... 10rem Kolom Total Harga Jual

    // 7px Gap antara kolom nama - kolom total harga jual
    classes:
      "w-[calc(100%_-_(2.25rem_+_6rem_+_12rem_+_12rem_+_10rem_+_12rem_+_10rem_+_7px))] min-w-60 justify-start",
  },
  {
    name: "Jumlah",
    classes: "w-[6rem] justify-start",
  },
  {
    name: "Ketersediaan",
    classes: "w-[12rem] justify-start",
  },
  {
    name: "Harga Beli Per Satuan",
    classes: "w-[12rem] justify-start",
  },
  {
    name: "Total Harga Beli",
    classes: "w-[10rem] justify-start",
  },
  {
    name: "Harga Jual Per Satuan",
    classes: "w-[12rem] justify-start",
  },
  {
    name: "Total Harga Jual",
    classes: "w-[10rem] justify-start",
  },
] as const;

const createProductStore = () => {
  const { subscribe, set } = writable<ProductStore>({
    products: [],
    config: {
      currentPage: 0,
      totalPage: 0,
      from: 0,
      to: 0,
      limit: 0,
      total: 0,
    },
  });

  function setProductStore(data: ProductStore) {
    set(data);
  }

  return {
    subscribe,
    setProductStore,
  };
};

export const productStore = createProductStore();
