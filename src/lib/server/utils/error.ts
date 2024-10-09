import { HttpStatusCode } from "axios";

export class DuplicateUserError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "DuplicateUserError";
  }
}

export class InvalidDataError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "InvalidDataError";
  }
}

export class UnauthorizedError extends Error {
  constructor() {
    super();
    this.message = "Unauthorized";
    this.name = "UnauthorizedError";
  }
}

export function errorHandler(error: unknown) {
  const responseData: {
    message: string;
    errorType: string;
  } = {
    message: "Error tidak diketahui. Mohon laporkan kepada Developer.",
    errorType: "UncatchError",
  };

  const responseInit: ResponseInit | undefined = {
    status: HttpStatusCode.BadRequest,
  };

  if (
    error instanceof DuplicateUserError ||
    error instanceof InvalidDataError ||
    error instanceof UnauthorizedError
  ) {
    responseData.message = error.message;
    responseData.errorType = error.name;
  }

  if (error instanceof UnauthorizedError) {
    responseInit.status = HttpStatusCode.Unauthorized;
  }

  console.log(error);

  return {
    responseData,
    responseInit,
  };
}
