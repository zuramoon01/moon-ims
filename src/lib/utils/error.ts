export class DuplicateUserError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "DuplicateUserError";
  }
}

export class InvalidDataError extends Error {
  // eslint-disable-next-line
  errors?: any;

  // eslint-disable-next-line
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
    // eslint-disable-next-line
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
