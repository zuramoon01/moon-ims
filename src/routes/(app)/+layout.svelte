<script lang="ts">
  import { Header, NavMobile } from "$lib/components";
  import { user } from "$lib/stores";
  import { onMount, type Snippet } from "svelte";
  import type { LayoutData } from "./$types";

  let { children, data }: { children: Snippet; data: LayoutData } = $props();

  onMount(() => {
    user.set(data.user ?? null);
  });
</script>

<div class="flex min-h-dvh w-full flex-col items-start gap-4 p-4">
  <Header />

  {@render children()}

  <NavMobile />
</div>
