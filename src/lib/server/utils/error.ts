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

export function errorHandler(error: unknown) {
  const responseData: {
    message: string;
    errorType: string;
  } = {
    message: "Error tidak diketahui. Mohon laporkan kepada Developer.",
    errorType: "UncatchError",
  };

  const responseInit: ResponseInit | undefined = {
    status: 400,
  };

  if (error instanceof DuplicateUserError || error instanceof InvalidDataError) {
    responseData.message = error.message;
    responseData.errorType = error.name;
  }

  console.log(error);

  return {
    responseData,
    responseInit,
  };
}
