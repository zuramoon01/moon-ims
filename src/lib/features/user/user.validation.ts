import * as v from "valibot";

export const uuidSchema = v.pipe(v.string(), v.uuid());

export const usernameSchema = v.pipe(
  v.string("Nama harus diisi."),
  v.minLength(3, "Nama minimal 3 karakter."),
  v.maxLength(25, "Nama maksimal 25 karakter."),
);

export const passwordSchema = v.pipe(
  v.string("Kata sandi harus diisi."),
  v.minLength(8, "Kata sandi minimal 8 karakter."),
  v.maxLength(255, "Kata sandi maksimal 255 karakter."),
);

export const confirmPasswordSchema = v.pipe(
  v.string("Konfimasi kata sandi harus diisi."),
  v.minLength(8, "Konfimasi kata sandi minimal 8 karakter."),
  v.maxLength(255, "Konfimasi kata sandi maksimal 255 karakter."),
);
