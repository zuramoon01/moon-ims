<script lang="ts">
  import { Toast } from "$lib/ui";
  import "../app.css";

  let { children } = $props();
</script>

{@render children()}

<Toast />
