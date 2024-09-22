<script lang="ts">
  import clsx from "clsx";
  import type { HTMLButtonAttributes } from "svelte/elements";

  interface Props extends HTMLButtonAttributes {
    text: string;
  }

  export let props: Props;

  const { text, class: classes, ...attr } = props;
</script>

<button
  {...attr}
  class={clsx(
    "flex h-10 w-full items-center justify-center rounded-lg bg-black/80 px-4 py-2 text-white/80",
    "hover:bg-black/90",
    "focus:bg-black/90",
    "focus-visible:bg-black/90",
    "active:bg-black/90",
    classes,
  )}>{text}</button
>
