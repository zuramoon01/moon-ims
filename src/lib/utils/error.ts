import { addToasts } from "$lib/stores";
import { AxiosError } from "axios";

export function clientErrorHandler(error: unknown) {
  if (error instanceof AxiosError) {
    handleAxiosError(error);
  } else if (error instanceof PayloadError) {
    handlePayloadError(error);
  }
}

export class PayloadError extends Error {
  constructor() {
    super();
    this.message = "Payload yang diterima tidak sesuai.";
    this.name = "PayloadError";
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function handleAxiosError(error: AxiosError<any, any>) {
  const { response, request, message } = error;

  if (response) {
    const { data, status, headers } = response;

    addToasts({
      type: "error",
      title: "Gagal",
      description: data.message || "An unexpected error occurred.",
    });

    console.error({ data, status, headers });
  } else if (request) {
    console.error("Request error:", request);
  } else {
    console.error("Error:", message);
  }
}

function handlePayloadError(error: PayloadError) {
  addToasts({
    type: "error",
    title: error.name,
    description: error.message,
  });

  console.error("Unhandled error:", error);
}
