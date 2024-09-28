<script lang="ts">
  import { toastStore } from "$lib/stores";
  import { clsx } from "clsx";
  import { flip } from "svelte/animate";
  import { fly } from "svelte/transition";
  import { Button } from "../button";
  import X from "lucide-svelte/icons/x";

  let windowWidth: number;

  const { toasts, pauseToast, resumeToast, removeToast } = toastStore;

  // Move node element to body children
  function portal(node: HTMLElement) {
    document.body.appendChild(node);

    return {
      destroy() {},
    };
  }
</script>

<svelte:window bind:innerWidth={windowWidth} />

<div
  use:portal
  class={clsx(
    $toasts.length === 0 && "pointer-events-none",
    "fixed right-0 top-0 z-50 flex w-full min-w-80 max-w-[25rem] flex-col items-start gap-2 p-4",
    "md:bottom-0 md:top-auto",
  )}
>
  {#each $toasts as { id, ids, content: { title, description } } (id)}
    <!-- svelte-ignore a11y-no-noninteractive-tabindex -->
    <!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
    <div
      id={ids.alert}
      role="alert"
      tabindex="0"
      aria-labelledby={ids.title}
      aria-describedby={ids.description}
      animate:flip={{
        duration: 150,
      }}
      in:fly={{
        duration: 300,
        y: windowWidth > 600 ? "0.5rem" : "-0.5rem",
      }}
      out:fly={{
        duration: 300,
        x: "100%",
      }}
      on:pointerenter={(e) => {
        if (e.pointerType !== "touch") {
          pauseToast(id);
        }
      }}
      on:pointerleave={(e) => {
        if (e.pointerType !== "touch") {
          resumeToast(id);
        }
      }}
      on:keydown={(e) => {
        if (e.key === "Escape") {
          removeToast(id);
        }
      }}
      class={clsx(
        "relative z-50",
        "bg-secondary flex w-full flex-col items-start overflow-hidden rounded-lg px-4 py-2 text-black/80",
        'after:pointer-events-none after:absolute after:inset-0 after:content-[""]',
        title === "Success" && "after:bg-green/10",
        title === "Warning" && "after:bg-yellow/10",
        title === "Error" && "after:bg-red/10",
      )}
    >
      <div class="flex w-full items-center justify-between gap-1">
        <h3 id={ids.title}>
          {title}
        </h3>

        <Button
          Icon={X}
          variant="ghost"
          on:click={() => {
            removeToast(id);
          }}
        />
      </div>

      <p
        id={ids.description}
        class="text-sm"
      >
        {description}
      </p>
    </div>
  {/each}
</div>
