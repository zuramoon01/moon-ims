import Box from "lucide-svelte/icons/box";
import ChartNoAxesCombined from "lucide-svelte/icons/chart-no-axes-combined";
import Gauge from "lucide-svelte/icons/gauge";
import ReceiptText from "lucide-svelte/icons/receipt-text";

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
