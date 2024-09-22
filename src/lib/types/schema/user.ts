import * as v from "valibot";

export const uuidSchema = v.pipe(v.string(), v.uuid());

export const usernameSchema = v.pipe(
  v.string(),
  v.minLength(3),
  v.maxLength(25),
);

export const passwordSchema = v.pipe(
  v.string(),
  v.minLength(8),
  v.maxLength(255),
);
