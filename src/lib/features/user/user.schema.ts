import { maxLength, minLength, nullable, pipe, string, uuid } from "valibot";

export const UUIDSchema = pipe(string("Id harus dalam bentuk huruf."), uuid("Id tidak valid."));

export const UsernameSchema = pipe(
  string("Nama harus dalam bentuk angka."),
  minLength(3, "Nama minimal 3 karakter."),
  maxLength(25, "Nama maksimal 25 karakter."),
);

export const PasswordSchema = pipe(
  string("Kata sandi harus dalam bentuk angka."),
  minLength(8, "Kata sandi minimal 8 karakter."),
  maxLength(255, "Kata sandi maksimal 255 karakter."),
);

export const ConfirmPasswordSchema = pipe(
  string("Konfimasi kata sandi harus dalam bentuk angka."),
  minLength(8, "Konfimasi kata sandi minimal 8 karakter."),
  maxLength(255, "Konfimasi kata sandi maksimal 255 karakter."),
);

export const CompanyNameSchema = nullable(string("Nama perusahaan harus diisi."));
