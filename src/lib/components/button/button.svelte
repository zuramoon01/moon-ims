<script lang="ts">
  import type { IconComponent } from "$lib/types";
  import type { HTMLButtonAttributes } from "svelte/elements";
  import { buttonClass, buttonIconClass, buttonTextClass } from "./style";
  import LoaderCircle from "lucide-svelte/icons/loader-circle";

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
    >{#if state === "idle" && Icon}
      <Icon class={buttonIconClass(iconClass)} />
    {:else}
      <LoaderCircle class={buttonIconClass(`animate-spin ${iconClass}`)} />
    {/if}

    {#if text}
      <p class={buttonTextClass(textClass)}>
        {state === "idle" ? text : "Loading"}
      </p>
    {/if}</button
  >
{/if}
