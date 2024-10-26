<script lang="ts">
  import type { Snippet } from "svelte";

  interface Props {
    title: string;
    children: Snippet;
    footer: Snippet;
  }

  let { title, children, footer }: Props = $props();
</script>

<div class="flex min-h-dvh w-full items-center justify-center p-2">
  <div
    class="flex w-full max-w-[25rem] flex-col items-start gap-4 overflow-hidden rounded-lg border border-black/10 bg-white px-4 py-6"
  >
    <div class="w-full">
      <h1 class="text-2xl leading-none">{title}</h1>
    </div>

    {@render children()}

    <div class="flex w-full items-center justify-center">
      {@render footer()}
    </div>
  </div>
</div>
