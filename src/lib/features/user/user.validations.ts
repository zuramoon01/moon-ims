import { maxLength, minLength, nullable, pipe, string, uuid } from "valibot";

export const uuidSchema = pipe(string("Id harus diisi."), uuid("Id tidak valid."));

export const usernameSchema = pipe(
  string("Nama harus diisi."),
  minLength(3, "Nama minimal 3 karakter."),
  maxLength(25, "Nama maksimal 25 karakter."),
);

export const passwordSchema = pipe(
  string("Kata sandi harus diisi."),
  minLength(8, "Kata sandi minimal 8 karakter."),
  maxLength(255, "Kata sandi maksimal 255 karakter."),
);

export const confirmPasswordSchema = pipe(
  string("Konfimasi kata sandi harus diisi."),
  minLength(8, "Konfimasi kata sandi minimal 8 karakter."),
  maxLength(255, "Konfimasi kata sandi maksimal 255 karakter."),
);

export const companyNameSchema = nullable(string());
