<script lang="ts">
  import type { HTMLInputAttributes } from "svelte/elements";
  import { inputClass } from "./style";

  export let value: string = "";
  export let label: string = "Label text";
  export let errorMessages: string[] = [];
  export let attr: Omit<HTMLInputAttributes, "value">;

  $: hasError = errorMessages.length > 0;
</script>

<div class="flex w-full flex-col items-start gap-1">
  <div class="flex w-full items-center gap-1">
    <label
      for={attr.id}
      class="text-sm font-medium text-black/60">{label}</label
    >

    {#if attr.required}
      <p class="text-red/60">*</p>
    {/if}
  </div>

  <input
    {...attr}
    bind:value={value}
    on:input
    class={inputClass(hasError, attr.class)}
  />

  {#if hasError}
    <div class="flex w-full flex-col items-start text-sm text-red/60">
      {#each errorMessages as message}
        <p>
          - {message}
        </p>
      {/each}
    </div>
  {/if}
</div>
