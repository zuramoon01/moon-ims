<script lang="ts">
  import type { LayoutServerData } from "./$types";
  import { user } from "$lib/stores";

  import "../app.css";

  export let data: LayoutServerData;

  user.set(data.user);
</script>

<slot />

<style lang="postcss">
  :global(body) {
    background-color: theme("colors.primary");
  }
</style>
