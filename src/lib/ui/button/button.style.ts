import type { Class, IconComponent } from "$lib/ui";
import clsx from "clsx";
import { twMerge } from "tailwind-merge";

export function buttonIconClass(classes: Class) {
  return twMerge(clsx("size-5 shrink-0", classes));
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
      text && "h-10 w-full gap-2 rounded px-4 py-2",
      !text && Icon && "size-10 rounded-full",
      "focus:outline-none",

      // Variants
      variant === "default" && [
        "bg-black/10",
        "hover:bg-black/20",
        "focus:bg-black/20",
        "focus-visible:bg-black/20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black",
        "active:bg-black/20",
      ],
      variant === "outline" && [
        text && "h-[calc(2.5rem_-_2px)]",
        "border border-black/60 text-black/60",
        "hover:border-black/80 hover:text-black/80",
        "focus:border-black/80 focus:text-black/80",
        "focus-visible:border-black/80 focus-visible:text-black/80 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black",
        "active:border-black/80 active:text-black/80",
      ],
      variant === "ghost" && [
        "text-black/60",
        "hover:bg-black/10 hover:text-black/80",
        "focus:bg-black/10 focus:text-black/80",
        "focus-visible:bg-black/10 focus-visible:text-black/80 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black",
        "active:bg-black/10 active:text-black/80",
      ],

      classes,
    ),
  );
}

export function buttonTextClass(classes: Class) {
  return twMerge(clsx("text-nowrap text-base font-medium leading-none", classes));
}
