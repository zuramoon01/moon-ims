import { minLength, minValue, number, optional, pipe, string } from "valibot";

export const PriceIdSchema = optional(number("Id Harga harus dalam bentuk angka."));

export const NameSchema = pipe(
  string("Nama produk harus dalam bentuk huruf."),
  minLength(1, "Nama harus diisi."),
);

export const QuantitySchema = pipe(
  number("Jumlah produk harus dalam bentuk angka."),
  minValue(0, "Jumlah produk harus diisi."),
);

export const BuyPriceSchema = pipe(
  number("Harga beli harus dalam bentuk angka."),
  minValue(0, "Harga beli harus diisi."),
);

export const SellPriceSchema = pipe(
  number("Harga jual harus dalam bentuk angka."),
  minValue(0, "Harga jual harus diisi."),
);
