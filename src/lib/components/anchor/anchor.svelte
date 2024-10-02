<script lang="ts">
  import type { IconComponent } from "$lib/types";
  import type { HTMLAnchorAttributes } from "svelte/elements";
  import { buttonClass, buttonIconClass, buttonTextClass } from "../button";

  export let text: string | undefined = undefined;
  export let textClass: string | null | undefined = undefined;
  export let Icon: IconComponent | undefined = undefined;
  export let iconClass: string | null | undefined = undefined;
  export let variant: "default" | "outline" | "ghost" = "default";
  export let attr: HTMLAnchorAttributes | undefined = undefined;
</script>

{#if text || Icon}
  <a
    {...attr}
    href={attr?.href}
    class={buttonClass(text, Icon, variant, attr?.class)}
    >{#if Icon}
      <svelte:component
        this={Icon}
        class={buttonIconClass(iconClass)}
      />
    {/if}

    {#if text}
      <p class={buttonTextClass(textClass)}>
        {text}
      </p>
    {/if}</a
  >
{/if}
