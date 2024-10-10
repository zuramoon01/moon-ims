<script lang="ts">
  import {
    buttonClass,
    buttonIconClass,
    buttonTextClass,
    type ButtonVariant,
    type Class,
    type IconComponent,
  } from "$lib/ui";
  import type { HTMLAnchorAttributes } from "svelte/elements";

  export let text: string | undefined = undefined;
  export let textClass: Class = undefined;
  export let Icon: IconComponent | undefined = undefined;
  export let iconClass: Class = undefined;
  export let variant: ButtonVariant = "default";
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
