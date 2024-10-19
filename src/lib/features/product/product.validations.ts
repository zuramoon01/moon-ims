import { minLength, minValue, number, pipe, string, transform } from "valibot";

export const nameSchema = string("Nama produk harus diisi.");

export const quantitySchema = pipe(
  string(),
  minLength(1, "Jumlah produk harus diisi dengan angka."),
  transform(Number),
  number("Jumlah produk harus diisi."),
  minValue(0, "Jumlah produk harus diisi."),
);

export const buyPriceSchema = pipe(
  string(),
  minLength(1, "Harga beli harus diisi dengan angka."),
  transform(Number),
  number("Harga beli harus diisi."),
  minValue(0, "Harga beli harus diisi."),
);

export const sellPriceSchema = pipe(
  string(),
  minLength(1, "Harga jual harus diisi dengan angka."),
  transform(Number),
  number("Harga jual harus diisi."),
  minValue(0, "Harga jual harus diisi."),
);
