<script lang="ts">
  import type { Class } from "$lib/types";
  import clsx from "clsx";
  import type { HTMLInputAttributes } from "svelte/elements";
  import { twMerge } from "tailwind-merge";

  interface Props {
    value: string | number;
    containerClass?: Class;
    label?: string;
    errorMessages?: string[];
    attr: HTMLInputAttributes;
  }

  let {
    value = $bindable(""),
    containerClass,
    label = undefined,
    errorMessages = [],
    attr,
  }: Props = $props();

  const hasError = $derived(value === "" ? false : errorMessages.length > 0);
  const isDisabled = attr.disabled ?? false;
</script>

<div class={twMerge(clsx("flex w-full flex-col items-start gap-2", containerClass))}>
  {#if label}
    <div class="w-full">
      <label
        for={attr.id}
        class="text-sm font-bold leading-none text-black/60"
      >
        {label}

        {#if attr.required}
          <span class="text-red/60">*</span>
        {/if}
      </label>
    </div>
  {/if}

  <input
    {...attr}
    bind:value
    class={twMerge(
      clsx(
        // Base
        "h-10 w-full rounded border bg-white px-4 py-2 outline-none",

        // Placeholder
        "placeholder:text-black/20",
        "placeholder-shown:border-black/20",

        isDisabled
          ? [
              // Disabled
              "disabled:cursor-not-allowed disabled:border-black/10 disabled:bg-black/10 disabled:text-black/40",
            ]
          : [
              hasError
                ? [
                    // Base
                    "border-red/40 text-red/60",

                    // Interaction When Invalid
                    "hover:border-red/40",
                    "focus:border-red/40",
                    "focus-visible:border-red/40",
                    "active:border-red/40",
                  ]
                : [
                    // Base
                    "border-black/60 text-black/60",

                    // Interaction When Valid
                    "hover:border-blue/40",
                    "focus:border-blue/40",
                    "focus-visible:border-blue/40",
                    "active:border-blue/40",
                  ],
            ],
        attr.class,
      ),
    )}
  />

  {#if hasError}
    <div class="flex w-full flex-col items-start gap-1 text-sm leading-none text-red/60">
      {#each errorMessages as message}
        <p>- {message}</p>
      {/each}
    </div>
  {/if}
</div>
