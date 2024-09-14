export class DuplicateUserError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "DuplicateUserError";
  }
}

export class InactiveUserError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "InactiveUserError";
  }
}

export class InvalidDataError extends Error {
  errors?: any;

  constructor(message: string, errors?: any) {
    super(message);
    this.name = "InvalidDataError";
    this.errors = errors;

    Object.setPrototypeOf(this, InvalidDataError.prototype);
  }
}

export function errorHandler(error: unknown) {
  const responseData: {
    message: string;
    errors?: any;
    errorType: string;
  } = {
    message: "Error tidak diketahui. Mohon laporkan kepada Developer.",
    errorType: "UncatchError",
  };

  const responseInit: ResponseInit | undefined = {
    status: 400,
  };

  if (error instanceof InvalidDataError) {
    if (error.errors) {
      responseData.errors = error.errors;
    }
  }

  if (error instanceof Error) {
    responseData.message = error.message;
    responseData.errorType = error.name;
  }

  return {
    responseData,
    responseInit,
  };
}
