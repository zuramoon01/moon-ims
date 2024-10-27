import { HttpStatusCode } from "$lib/types";
import { json } from "@sveltejs/kit";

export function serverErrorHandler(error: unknown) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const data: any = {
    message: "Error tidak diketahui. Mohon laporkan kepada Developer.",
  };
  const init: ResponseInit = {
    status: HttpStatusCode.BadRequest,
  };

  if (error instanceof Error) {
    data.message = error.message;

    if (error instanceof InvalidDataError && error.data) {
      data.data = error.data;
    }

    if (error instanceof UnauthorizedError) {
      init.status = HttpStatusCode.Unauthorized;
    }
  }

  console.error(error);

  return json(data, init);
}

export class DuplicateUserError extends Error {}

export class InvalidDataError extends Error {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data?: any;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  constructor(message: string, data?: any) {
    super(message);

    this.data = data;
  }
}

export class UnauthorizedError extends Error {
  constructor() {
    super("Unauthorized");
  }
}
