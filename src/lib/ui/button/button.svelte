<script lang="ts">
  import type { State } from "$lib/types";
  import {
    buttonClass,
    buttonIconClass,
    buttonTextClass,
    type ButtonVariant,
    type Class,
    type IconComponent,
  } from "$lib/ui";
  import { LoaderCircle } from "lucide-svelte";
  import type { HTMLButtonAttributes } from "svelte/elements";

  export let state: State = "idle";
  export let text: string | undefined = undefined;
  export let textClass: Class = undefined;
  export let Icon: IconComponent | undefined = undefined;
  export let iconClass: Class = undefined;
  export let variant: ButtonVariant = "default";
  export let attr: HTMLButtonAttributes | undefined = undefined;
</script>

{#if text || Icon}
  <button
    {...attr}
    on:click
    class={buttonClass(text, Icon, variant, attr?.class)}
    >{#if state === "idle"}
      {#if Icon}
        <Icon class={buttonIconClass(iconClass)} />
      {/if}
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
