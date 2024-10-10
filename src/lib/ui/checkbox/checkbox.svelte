<script lang="ts">
  import clsx from "clsx";
  import Check from "lucide-svelte/icons/check";
  import Minus from "lucide-svelte/icons/minus";
  import type { CheckboxState } from "./checkbox.type";

  export let state: CheckboxState;
  export let onChange: Function | undefined = undefined;
</script>

<div
  role="checkbox"
  tabindex="0"
  aria-checked={state === "indeterminate" ? "mixed" : state}
  class={clsx(
    "flex size-4 shrink-0 cursor-pointer items-center justify-center rounded border bg-white",
    state === "false" ? "border-black/20" : "border-black/60",
  )}
  on:click={() => {
    onChange?.();
  }}
  on:keydown={(e) => {
    if (e.key === " ") {
      onChange?.();
    }
  }}
>
  {#if state === "indeterminate"}
    <Minus class="size-3" />
  {:else if state === "true"}
    <Check class="size-3" />
  {/if}
</div>
