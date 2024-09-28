<script lang="ts">
  import type { IconComponent } from "$lib/types";
  import type { HTMLButtonAttributes } from "svelte/elements";
  import LoaderCircle from "lucide-svelte/icons/loader-circle";
  import { buttonClass } from "./style";
  import { twMerge } from "tailwind-merge";
  import { clsx } from "clsx";

  export let state: "idle" | "loading" = "idle";
  export let text: string | undefined = undefined;
  export let textClass: string | null | undefined = undefined;
  export let Icon: IconComponent | undefined = undefined;
  export let iconClass: string | null | undefined = undefined;
  export let variant: "default" | "outline" | "ghost" = "default";
  export let attr: HTMLButtonAttributes | undefined = undefined;
</script>

{#if text || Icon}
  <button
    {...attr}
    on:click
    class={buttonClass(text, Icon, variant, attr?.class)}
    >{#if state === "idle"}
      {#if Icon}
        <svelte:component
          this={Icon}
          class={twMerge(clsx("size-5", iconClass))}
        />
      {/if}
    {:else}
      <LoaderCircle class={twMerge(clsx("size-5 animate-spin", iconClass))} />
    {/if}

    {#if text}
      <p class={twMerge(clsx("text-base/[100%]", textClass))}>
        {#if state === "idle"}
          {text}
        {:else}
          Loading
        {/if}
      </p>
    {/if}</button
  >
{/if}
