<script>
  import { headerHeight, navMobileHeight } from "$lib/stores";
  import { Header, NavMobile } from "$lib/ui";
</script>

<div class="flex min-h-dvh w-full flex-col items-start gap-4 p-4">
  <Header bind:headerHeight={$headerHeight} />

  <slot />

  <NavMobile bind:navMobileHeight={$navMobileHeight} />
</div>
