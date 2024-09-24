<script lang="ts">
  import type { HTMLInputAttributes } from "svelte/elements";
  import { inputClass } from "./style";

  export let value: string = "";
  export let label: string = "Label text";
  export let errorMessages: string[] = [];
  export let attr: Omit<HTMLInputAttributes, "value">;
</script>

<div class="flex w-full flex-col items-start gap-1">
  <div class="flex w-full items-center gap-1 px-1">
    <label
      for={attr.id}
      class="text-sm text-black/80">{label}</label
    >

    {#if attr.required}
      <p class="text-red/80">*</p>
    {/if}
  </div>

  <input
    {...attr}
    bind:value={value}
    on:input
    data-error={errorMessages.length > 0}
    class={inputClass(attr.class)}
  />

  {#if errorMessages.length > 0}
    <div class="flex w-full flex-col items-start text-sm text-red/40">
      {#each errorMessages as message}
        <p>
          - {message}
        </p>
      {/each}
    </div>
  {/if}
</div>
