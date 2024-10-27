<script lang="ts">
  import { portal } from "$lib/actions";
  import { addToasts, toastStore } from "$lib/stores";
  import { Button } from "$lib/ui";
  import clsx from "clsx";
  import { X } from "lucide-svelte";
  import { flip } from "svelte/animate";
  import { fly } from "svelte/transition";

  const { toasts, resumeToast, pauseToast, removeToast } = toastStore;

  let windowInnerWidth: number = $state(0);

  // $effect(() => {
  //   addToasts([
  //     {
  //       type: "info",
  //       title: "Info",
  //       description:
  //         "Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptatum eaque quas, rem nemo ducimus tempore ad. Explicabo ea repudiandae perferendis!",
  //       closeDelay: 0,
  //     },
  //     {
  //       type: "success",
  //       title: "Success",
  //       description:
  //         "Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptatum eaque quas, rem nemo ducimus tempore ad. Explicabo ea repudiandae perferendis!",
  //       closeDelay: 0,
  //     },
  //     {
  //       type: "warning",
  //       title: "Warning",
  //       description:
  //         "Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptatum eaque quas, rem nemo ducimus tempore ad. Explicabo ea repudiandae perferendis!",
  //       closeDelay: 0,
  //     },
  //     {
  //       type: "error",
  //       title: "Error",
  //       description:
  //         "Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptatum eaque quas, rem nemo ducimus tempore ad. Explicabo ea repudiandae perferendis!",
  //       closeDelay: 0,
  //     },
  //   ]);
  // });
</script>

<svelte:window bind:innerWidth={windowInnerWidth} />

<div
  use:portal
  aria-live="polite"
  class={clsx(
    $toasts.length === 0 && "pointer-events-none",

    "fixed right-0 top-0 z-50 flex w-full flex-col items-start gap-2 p-4",

    "md:bottom-0 md:top-auto md:max-w-[25rem]",
  )}
>
  {#each $toasts as { id, ids, content: { type, title, description } } (id)}
    <!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
    <div
      id={ids.toast}
      role="alert"
      aria-labelledby={ids.title}
      aria-describedby={ids.description}
      class={clsx("relative flex w-full overflow-hidden rounded bg-white")}
      animate:flip={{
        duration: 150,
      }}
      in:fly={{
        duration: 300,
        y: windowInnerWidth > 600 ? "0.5rem" : "-0.5rem",
      }}
      out:fly={{
        duration: 300,
        x: "100%",
      }}
      onpointerenter={(e) => {
        if (e.pointerType !== "touch") {
          pauseToast(id);
        }
      }}
      onpointerleave={(e) => {
        if (e.pointerType !== "touch") {
          resumeToast(id);
        }
      }}
      onkeydown={(e) => {
        if (e.key === "Escape") {
          removeToast(id);
        }
      }}
    >
      <div
        aria-hidden="true"
        class={clsx(
          "w-1 shrink-0",

          type === "info" && "bg-blue",
          type === "success" && "bg-green",
          type === "warning" && "bg-yellow",
          type === "error" && "bg-red",
        )}
      ></div>

      <div
        class={clsx(
          "flex w-full flex-col items-start gap-2 p-4",

          type === "info" && "bg-blue/10",
          type === "success" && "bg-green/10",
          type === "warning" && "bg-yellow/10",
          type === "error" && "bg-red/10",
        )}
      >
        <h3
          id={ids.title}
          class={clsx("font-bold leading-none", "w-[calc(100%_-_(1.25rem_+_1rem))]")}
        >
          {title}
        </h3>

        <p
          id={ids.description}
          class="w-full break-words text-sm leading-snug"
        >
          {description}
        </p>
      </div>

      <Button
        attr={{
          "aria-label": "Hapus Toast",
          type: "button",
          class: clsx("absolute right-2 top-2 size-auto p-2"),
          onclick: () => {
            removeToast(id);
          },
        }}
        variant="ghost"
        icon={{
          Component: X,
          attr: {
            absoluteStrokeWidth: true,
          },
        }}
      />
    </div>
  {/each}
</div>
