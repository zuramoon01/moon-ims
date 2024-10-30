import { Box, ChartNoAxesCombined, Gauge, type Icon, ReceiptText } from "lucide-svelte";
import { writable } from "svelte/store";

export const headerHeight = writable(0);
export const navMobileHeight = writable(0);

export const Route = {
  Dashboard: "/",
  Auth: {
    SignIn: "/auth/signin",
    SignUp: "/auth/signup",
  },
  Api: {
    Auth: {
      SignIn: "/api/auth/signin",
      SignUp: "/api/auth/signup",
      SignOut: "/api/auth/signout",
    },
    Product: "/api/products",
  },
} as const;

interface Nav {
  Icon: typeof Icon;
  text: string;
  link: (typeof Route)[keyof typeof Route] | string;
}

export const navs = [
  {
    Icon: Gauge,
    text: "Dashboard",
    link: Route.Dashboard,
  },
  {
    Icon: Box,
    text: "Produk",
    link: "/produk",
  },
  {
    Icon: ReceiptText,
    text: "Transaksi",
    link: "/transaksi",
  },
  {
    Icon: ChartNoAxesCombined,
    text: "Laporan",
    link: "/laporan",
  },
] satisfies Nav[];

export const productTableColumnBaseClass = "flex shrink-0 items-center bg-white px-4 py-2";

export const productTableTitles = [
  {
    name: "Nama",
    // Kalkulasi Lebar Kolom
    // 100% = Ukuran yang bisa dicakup kolom nama

    // 2.25rem Kolom ceklis / 8rem Kolom Jumlah ... 10rem Kolom Total Harga Jual

    // 7px Gap antara kolom nama - kolom total harga jual
    classes:
      "w-[calc(100%_-_(2.25rem_+_8rem_+_12rem_+_14rem_+_10rem_+_14rem_+_10rem_+_7px))] min-w-60",
  },
  {
    name: "Jumlah",
    classes: "w-[8rem]",
  },
  {
    name: "Ketersediaan",
    classes: "w-[12rem]",
  },
  {
    name: "Harga Beli Per Satuan",
    classes: "w-[14rem]",
  },
  {
    name: "Total Harga Beli",
    classes: "w-[10rem]",
  },
  {
    name: "Harga Jual Per Satuan",
    classes: "w-[14rem]",
  },
  {
    name: "Total Harga Jual",
    classes: "w-[10rem]",
  },
] satisfies {
  name: string;
  classes: string;
}[];
