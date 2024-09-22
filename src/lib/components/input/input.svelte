<script lang="ts">
  import type { HTMLInputAttributes } from "svelte/elements";
  import { errorMessageClass, inputClass, labelClass } from "./style";

  interface Props extends Omit<HTMLInputAttributes, "value"> {
    label: string;
    errorMessages?: string[];
  }

  export let value: string = "";
  export let props: Props;

  const { label, errorMessages, class: classes, ...attr } = props;
</script>

<div class="flex w-full flex-col items-start gap-1">
  <div class="flex w-full items-center px-1">
    <label
      for={attr.id}
      class={labelClass}>{label}</label
    >
  </div>

  <input
    {...attr}
    bind:value={value}
    class={inputClass(classes, !!errorMessages)}
  />

  {#if errorMessages}
    <div class="text-red/40 flex w-full flex-col items-start text-sm">
      {#each errorMessages as message}
        <p class={errorMessageClass}>
          - {message}
        </p>
      {/each}
    </div>
  {/if}
</div>
