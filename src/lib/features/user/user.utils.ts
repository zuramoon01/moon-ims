import { companyNameSchema, usernameSchema, uuidSchema, type User } from "$lib/features/user";
import { object, safeParse, string } from "valibot";

export function getAuthResponseData(data: any): { message: string; data: User } | null {
  const { success, output: responseData } = safeParse(
    object({
      message: string(),
      data: object({
        id: uuidSchema,
        username: usernameSchema,
        companyName: companyNameSchema,
      }),
    }),
    data,
    {
      abortEarly: true,
      abortPipeEarly: true,
    },
  );

  return success ? responseData : null;
}
