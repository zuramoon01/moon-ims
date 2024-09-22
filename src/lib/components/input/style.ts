import { clsx } from "clsx";

export const labelClass = clsx("text-sm text-black/80");

export function inputClass(classes?: string | null, hasError: boolean = false) {
  return clsx(
    "w-full h-10 rounded-lg border border-black/40 px-4 py-2 text-black/80 bg-white/80 outline-none",
    "placeholder:text-black/40",
    "placeholder-shown:border-black/20",
    "hover:border-blue/40",
    "focus:border-blue/40",
    "focus-visible:border-blue/40",
    "active:border-blue/40",
    "disabled:border-black/20 disabled:bg-black/10 disabled:text-black/20 disabled:cursor-not-allowed",
    "disabled:placeholder:text-black/20",
    classes,
    hasError && ["border-red/40", "placeholder-shown:border-red/40"],
  );
}

export const errorMessageClass = clsx();
