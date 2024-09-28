import { twMerge } from "tailwind-merge";
import { clsx } from "clsx";

export function inputClass(hasError: boolean, classes: string | null | undefined) {
  return twMerge(
    clsx(
      "w-full h-10 rounded-[0.25rem] border px-4 py-2 bg-white outline-none",
      hasError ? ["border-red/60 text-red/60"] : ["border-black/60 text-black/60"],

      "placeholder:text-black/20",
      "placeholder-shown:border-black/20",

      hasError
        ? [
            "hover:border-red/60",
            "focus:border-red/60",
            "focus-visible:border-red/60",
            "active:border-red/60",
          ]
        : [
            "hover:border-blue/60",
            "focus:border-blue/60",
            "focus-visible:border-blue/60",
            "active:border-blue/60",
          ],

      "disabled:border-black/10 disabled:bg-black/20 disabled:text-black/20 disabled:cursor-not-allowed",

      classes,
    ),
  );
}
