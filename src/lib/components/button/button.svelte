<script lang="ts">
  import type { IconComponent } from "$lib/types";
  import { clsx } from "clsx/lite";
  import type { IconProps } from "lucide-svelte";
  import type { HTMLButtonAttributes } from "svelte/elements";
  import LoaderCircle from "lucide-svelte/icons/loader-circle";

  export let state: "idle" | "loading" = "idle";
  export let text: string | undefined = undefined;
  export let Icon: IconComponent | undefined = undefined;
  export let iconAttr: IconProps | undefined = undefined;
  export let variant: "default" | "outline" | "ghost" = "default";
  export let attr: HTMLButtonAttributes | undefined = undefined;
</script>

{#if text || Icon}
  <button
    {...attr}
    on:click
    class={clsx(
      "flex items-center justify-center",
      text && [
        text && Icon && "gap-2",
        "h-10 w-full rounded-lg px-4 py-2",
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
      attr && attr.class,
    )}
    >{#if state === "idle"}
      {text}

      {#if Icon}
        <Icon
          size={20}
          {...iconAttr}
        />
      {/if}
    {:else}
      <LoaderCircle class="animate-spin" />
    {/if}</button
  >
{/if}
