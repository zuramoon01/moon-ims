import type { Class, IconComponent } from "$lib/types";
import { twMerge } from "tailwind-merge";
import { clsx } from "clsx";

export function buttonIconClass(classes: Class) {
  return twMerge(clsx("shrink-0 size-5", classes));
}

export function buttonClass(
  text: string | undefined,
  Icon: IconComponent | undefined,
  variant: "default" | "outline" | "ghost",
  classes: Class,
) {
  return twMerge(
    clsx(
      // Base
      "flex items-center justify-center overflow-hidden",
      text && "gap-2 rounded-[0.25rem] py-2 h-10 w-full px-4",
      !text && Icon && "rounded-full size-10",

      // Variants
      variant === "default" && [
        "bg-black/10",
        "hover:bg-black/20",
        "focus:bg-black/20",
        "focus-visible:bg-black/20",
        "active:bg-black/20",
      ],
      variant === "outline" && [
        "border border-black/60 text-black/60",
        "hover:border-black/80 hover:text-black/80",
        "focus:border-black/80 focus:text-black/80",
        "focus-visible:border-black/80 focus-visible:text-black/80",
        "active:border-black/80 active:text-black/80",
      ],
      variant === "ghost" && [
        "text-black/60",
        "hover:bg-black/10 hover:text-black/80",
        "focus:bg-black/10 focus:text-black/80",
        "focus-visible:bg-black/10 focus-visible:text-black/80",
        "active:bg-black/10 active:text-black/80",
      ],

      classes,
    ),
  );
}

export function buttonTextClass(classes: Class) {
  return twMerge(clsx("text-base font-medium leading-none text-nowrap", classes));
}
