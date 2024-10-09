<script lang="ts">
  import { buttonClass, buttonIconClass, buttonTextClass, type IconComponent } from "$lib/ui";
  import LoaderCircle from "lucide-svelte/icons/loader-circle";
  import type { HTMLButtonAttributes } from "svelte/elements";

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
