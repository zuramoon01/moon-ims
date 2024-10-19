import { Box, ChartNoAxesCombined, Gauge, ReceiptText } from "lucide-svelte";
import { writable } from "svelte/store";

export const navs = [
  {
    Icon: Gauge,
    text: "Dashboard",
    link: "/",
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
];

export const headerHeight = writable(0);
export const navMobileHeight = writable(0);
