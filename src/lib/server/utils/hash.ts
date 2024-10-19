import { JWT_SECRET } from "$env/static/private";
import { argon2id, argon2Verify } from "hash-wasm";
import type { IDataType } from "hash-wasm/dist/lib/util";

const salt = new Uint8Array(16);
crypto.getRandomValues(salt);

export function argonHash(password: IDataType) {
  return argon2id({
    password,
    salt,
    parallelism: 1,
    iterations: 256,
    memorySize: 512,
    hashLength: 32,
    secret: JWT_SECRET,
    outputType: "encoded",
  });
}

export function argonVerify(password: IDataType, hash: string) {
  return argon2Verify({
    password,
    secret: JWT_SECRET,
    hash,
  });
}
