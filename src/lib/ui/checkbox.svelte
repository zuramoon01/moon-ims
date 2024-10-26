<script lang="ts">
  import type { CheckboxState } from "$lib/types";
  import clsx from "clsx";
  import { Check, Minus } from "lucide-svelte";

  interface Props {
    state: CheckboxState;
    onchange?: Function | undefined;
  }

  let { state, onchange = undefined }: Props = $props();
</script>

<div
  role="checkbox"
  tabindex="0"
  aria-checked={state === "indeterminate" ? "mixed" : state}
  class={clsx(
    "flex size-4 shrink-0 cursor-pointer items-center justify-center rounded border bg-white",
    state === "false" ? "border-black/20" : "border-black/60",
  )}
  onclick={() => {
    onchange?.();
  }}
  onkeydown={(e) => {
    if (e.key === " ") {
      onchange?.();
    }
  }}
>
  {#if state === "indeterminate"}
    <Minus class="size-3" />
  {:else if state === "true"}
    <Check class="size-3" />
  {/if}
</div>
