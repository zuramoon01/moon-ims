import { CompanyNameSchema, UsernameSchema, UUIDSchema } from "$lib/features/user";
import type { User } from "$lib/types";
import { PayloadError } from "$lib/utils";
import { object, safeParse, string } from "valibot";

export function getAuthResponseData(data: any): { message: string; data: User } {
  const { success, output: responseData } = safeParse(
    object({
      message: string(),
      data: object({
        id: UUIDSchema,
        username: UsernameSchema,
        companyName: CompanyNameSchema,
      }),
    }),
    data,
    {
      abortEarly: true,
      abortPipeEarly: true,
    },
  );

  if (!success) {
    throw new PayloadError();
  }

  return responseData;
}
