import * as v from "valibot";

export const nameSchema = v.string("Nama produk harus diisi.");

export const quantitySchema = v.pipe(
  v.string(),
  v.minLength(1, "Jumlah produk harus diisi dengan angka."),
  v.transform(Number),
  v.number("Jumlah produk harus diisi."),
  v.minValue(0, "Jumlah produk harus diisi."),
);

export const buyPriceSchema = v.pipe(
  v.string(),
  v.minLength(1, "Harga beli harus diisi dengan angka."),
  v.transform(Number),
  v.number("Harga beli harus diisi."),
  v.minValue(0, "Harga beli harus diisi."),
);

export const sellPriceSchema = v.pipe(
  v.string(),
  v.minLength(1, "Harga jual harus diisi dengan angka."),
  v.transform(Number),
  v.number("Harga jual harus diisi."),
  v.minValue(0, "Harga jual harus diisi."),
);

export const companyNameSchema = v.nullable(v.string());
