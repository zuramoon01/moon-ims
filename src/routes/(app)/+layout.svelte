<script>
  import { Header, NavMobile } from "$lib/components";
  import { headerHeight, navMobileHeight } from "$lib/stores";

  let { children } = $props();
</script>

<div class="flex min-h-dvh w-full flex-col items-start gap-4 p-4">
  <Header bind:headerHeight={$headerHeight} />

  {@render children()}

  <NavMobile bind:navMobileHeight={$navMobileHeight} />
</div>
