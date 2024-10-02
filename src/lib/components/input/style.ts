import type { Class } from "$lib/types";
import { twMerge } from "tailwind-merge";
import { clsx } from "clsx";

export function inputClass(isError: boolean, isDisabled: boolean, classes: Class) {
  return twMerge(
    clsx(
      // Base
      "w-full h-10 rounded-[0.25rem] border px-4 py-2 bg-white outline-none",

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
            "disabled:border-black/10 disabled:bg-black/10 disabled:text-black/40 disabled:cursor-not-allowed",

            // Disabled Placeholder
            "disabled:placeholder:text-black/20",
            "disabled:placeholder-shown:border-black/10",
          ],

      classes,
    ),
  );
}
