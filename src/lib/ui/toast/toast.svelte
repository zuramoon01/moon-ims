<script lang="ts">
  import { Button } from "$lib/ui";
  import { clsx } from "clsx";
  import X from "lucide-svelte/icons/x";
  import { flip } from "svelte/animate";
  import { fly } from "svelte/transition";
  import {
    // addToasts,
    toastStore,
  } from "./toast.store";
  // import { onMount } from "svelte";

  let windowWidth: number;

  const { toasts, pauseToast, resumeToast, removeToast } = toastStore;

  // Move node element to body children
  function portal(node: HTMLElement) {
    document.body.appendChild(node);

    return {
      destroy() {},
    };
  }

  // onMount(() => {
  // addToasts([
  //   {
  //     title: "Success",
  //     description: "ok",
  //     closeDelay: 0,
  //   },
  //   {
  //     title: "Warning",
  //     description: "ok",
  //     closeDelay: 0,
  //   },
  //   {
  //     title: "Error",
  //     description: "ok",
  //     closeDelay: 0,
  //   },
  // ]);
  // });
</script>

<svelte:window bind:innerWidth={windowWidth} />

<div
  use:portal
  class={clsx(
    $toasts.length === 0 && "pointer-events-none",
    "fixed right-0 top-0 z-50 flex w-full max-w-[25rem] flex-col items-start gap-2 p-4",
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
        "relative flex w-full flex-col items-start overflow-hidden rounded-lg bg-white px-4 py-2 text-black/80",
        'after:pointer-events-none after:absolute after:inset-0 after:content-[""]',
        title === "Success" && "after:bg-green/10",
        title === "Warning" && "after:bg-yellow/10",
        title === "Error" && "after:bg-red/10",
      )}
    >
      <div class="flex w-full items-center justify-between gap-1">
        <h3
          id={ids.title}
          class="font-sm font-medium leading-none"
        >
          {title}
        </h3>

        <Button
          Icon={X}
          iconClass={clsx("size-[1.125rem]")}
          variant="ghost"
          attr={{
            type: "button",
            class: clsx("size-auto p-1"),
          }}
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
