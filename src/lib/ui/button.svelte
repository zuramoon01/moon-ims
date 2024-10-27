<script lang="ts">
  import type { Class, Status } from "$lib/types";
  import { generateId } from "$lib/utils";
  import clsx from "clsx";
  import { LoaderCircle, type Icon, type IconProps } from "lucide-svelte";
  import type { HTMLAnchorAttributes, HTMLButtonAttributes } from "svelte/elements";
  import { twMerge } from "tailwind-merge";

  interface ButtonProps {
    element?: "button";
    attr?: HTMLButtonAttributes;
    status?: Status;
  }

  interface AnchorProps {
    element?: "a";
    attr?: HTMLAnchorAttributes;
    status?: never;
  }

  interface BaseProps {
    variant?: "filled" | "danger" | "outline" | "ghost" | null;
    text?: string;
    textClass?: Class;
    icon?: {
      Component: typeof Icon;
      attr?: IconProps;
    };
  }

  let {
    element = "button",
    attr,
    status = "idle",
    variant = "filled",
    text,
    textClass,
    icon,
  }: (ButtonProps | AnchorProps) & BaseProps = $props();

  const id = generateId();
</script>

{#if text || icon}
  <svelte:element
    this={element}
    {...attr}
    class={twMerge(
      clsx(
        // Base
        "flex items-center justify-center overflow-hidden",

        !!text && "h-10 w-full gap-2 rounded px-4 py-2",
        !text && !!icon && "size-10 rounded-full",

        "focus:outline-none",
        "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black",

        // Variants
        variant === "filled" && [
          "bg-black/10",
          "hover:bg-black/20",
          "focus:bg-black/20",
          "focus-visible:bg-black/20 ",
          "active:bg-black/20",
        ],
        variant === "danger" && [
          "bg-red/60 text-white/80",
          "hover:bg-red/80",
          "focus:bg-red/80",
          "focus-visible:bg-red/80 ",
          "active:bg-red/80",
        ],
        variant === "outline" && [
          !!text && "h-[calc(2.5rem_-_2px)]",
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

        attr?.class,
      ),
    )}
  >
    {#if status === "idle"}
      {#if icon}
        {@const { Component, attr } = icon}

        <Component
          aria-labelledby={id}
          {...attr}
          class={twMerge(clsx("size-5 shrink-0", attr?.class))}
        />
      {/if}
    {:else}
      <LoaderCircle
        aria-labelledby={id}
        {...icon?.attr}
        class={clsx("size-5 shrink-0 animate-spin", icon?.attr?.class)}
      />
    {/if}

    {#if text}
      <p
        {id}
        class={twMerge(clsx("text-nowrap font-medium leading-none", textClass))}
      >
        {status === "idle" ? text : "Loading"}
      </p>
    {/if}
  </svelte:element>
{/if}
