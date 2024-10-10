<script lang="ts">
  import type { HTMLInputAttributes } from "svelte/elements";
  import { inputClass } from "./input.style";

  export let value: string | undefined = undefined;
  export let label: string | undefined = undefined;
  export let errorMessages: string[] = [];
  export let attr: HTMLInputAttributes;

  $: isError = errorMessages.length > 0;
</script>

<div class="flex w-full flex-col items-start gap-2">
  {#if label}
    <div class="w-full text-sm font-medium leading-none">
      <label
        for={attr.id}
        class="text-black/60">{label}</label
      >

      {#if attr.required}
        <span class="text-red/60">*</span>
      {/if}
    </div>
  {/if}

  <input
    {...attr}
    bind:value={value}
    on:input
    class={inputClass(isError, !!attr.disabled, attr.class)}
  />

  {#if isError}
    <div class="flex w-full flex-col items-start gap-1 text-sm leading-none text-red/60">
      {#each errorMessages as message}
        <p>
          - {message}
        </p>
      {/each}
    </div>
  {/if}
</div>
