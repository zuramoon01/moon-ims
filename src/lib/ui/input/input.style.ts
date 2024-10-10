import type { Class } from "$lib/ui";
import clsx from "clsx";
import { twMerge } from "tailwind-merge";

export function inputClass(isError: boolean, isDisabled: boolean, classes: Class) {
  return twMerge(
    clsx(
      // Base
      "h-10 w-full rounded border bg-white px-4 py-2 outline-none",

      !isDisabled
        ? [
            // Error
            !isError ? ["border-black/60 text-black/60"] : ["border-red/40 text-red/60"],

            // Placeholder
            "placeholder:text-black/20",
            "placeholder-shown:border-black/20",

            !isError
              ? [
                  // Interaction When Valid
                  "hover:border-blue/40",
                  "focus:border-blue/40",
                  "focus-visible:border-blue/40",
                  "active:border-blue/40",
                ]
              : [
                  // Interaction When Invalid
                  "hover:border-red/40",
                  "focus:border-red/40",
                  "focus-visible:border-red/40",
                  "active:border-red/40",
                ],
          ]
        : [
            // Disabled
            "disabled:cursor-not-allowed disabled:border-black/10 disabled:bg-black/10 disabled:text-black/40",

            // Disabled Placeholder
            "disabled:placeholder:text-black/20",
            "disabled:placeholder-shown:border-black/10",
          ],

      classes,
    ),
  );
}
