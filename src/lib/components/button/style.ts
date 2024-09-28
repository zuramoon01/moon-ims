import type { IconComponent } from "$lib/types";
import { twMerge } from "tailwind-merge";
import { clsx } from "clsx";

export function buttonClass(
  text: string | undefined,
  Icon: IconComponent | undefined,
  variant: "default" | "outline" | "ghost",
  classes: string | null | undefined,
) {
  return twMerge(
    clsx(
      "flex items-center justify-center gap-2",
      text && [
        "h-10 w-full rounded-[0.25rem] px-4 py-2",
        variant === "default" && [
          "bg-black/60 text-white",
          "hover:bg-black/80",
          "focus:bg-black/80",
          "focus-visible:bg-black/80",
          "active:bg-black/80",
        ],
        variant === "outline" && [
          "border border-black/60 bg-transparent text-black/60",
          "hover:border-black/80 hover:text-black/80",
          "focus:border-black/80 focus:text-black/80",
          "focus-visible:border-black/80 focus-visible:text-black/80",
          "active:border-black/80 active:text-black/80",
        ],
        variant === "ghost" && [
          "bg-transparent text-black/60",
          "hover:bg-black/10 hover:text-black/80",
          "focus:bg-black/10 focus:text-black/80",
          "focus-visible:bg-black/10 focus-visible:text-black/80",
          "active:bg-black/10 active:text-black/80",
        ],
      ],
      !text &&
        Icon && [
          "rounded-full p-1",
          variant === "default" && [
            "bg-black/80 text-white/80",
            "hover:bg-black/90",
            "focus:bg-black/90",
            "focus-visible:bg-black/90",
            "active:bg-black/90",
          ],
          variant === "outline" && [
            "border border-black/40 bg-transparent text-black/80",
            "hover:border-black/80",
            "focus:border-black/80",
            "focus-visible:border-black/80",
            "active:border-black/80",
          ],
          variant === "ghost" && [
            "bg-transparent text-black/80",
            "hover:bg-black/10",
            "focus:bg-black/10",
            "focus-visible:bg-black/10",
            "active:bg-black/10",
          ],
        ],
      classes,
    ),
  );
}
