import { HttpStatusCode } from "$lib/types";
import { json } from "@sveltejs/kit";

export class DuplicateUserError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "DuplicateUserError";
  }
}

export class InvalidDataError extends Error {
  data?: any;

  constructor(message: string, data?: any) {
    super(message);

    this.name = "InvalidDataError";
    this.data = data;
  }
}

export class UnauthorizedError extends Error {
  constructor() {
    super();
    this.message = "Unauthorized";
    this.name = "UnauthorizedError";
  }
}

export function serverErrorHandler(error: unknown) {
  const data: any = {
    message: "Error tidak diketahui. Mohon laporkan kepada Developer.",
  };
  const init: ResponseInit | undefined = {
    status: HttpStatusCode.BAD_REQUEST,
  };

  if (
    error instanceof DuplicateUserError ||
    error instanceof InvalidDataError ||
    error instanceof UnauthorizedError
  ) {
    data.message = error.message;
  }

  if (error instanceof InvalidDataError) {
    if (error.data) {
      data.data = error.data;
    }
  }

  if (error instanceof UnauthorizedError) {
    init.status = HttpStatusCode.UNAUTHORIZED;
  }

  console.error(error);

  return json(data, init);
}
