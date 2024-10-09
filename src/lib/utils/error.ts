import { addToast } from "$lib/ui";
import { AxiosError } from "axios";

export function errorHandler(error: unknown) {
  if (error instanceof AxiosError) {
    if (error.response) {
      const { data, status, headers } = error.response;

      addToast({
        title: "Error",
        description: data.message,
      });

      console.log({ data, status, headers });
    } else if (error.request) {
      console.log(error.request);
    } else {
      console.log("Error", error.message);
    }
  } else {
    console.log(error);
  }
}
