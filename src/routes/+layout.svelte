<script lang="ts">
  import type { LayoutServerData } from "./$types";
  import { user } from "$lib/stores";
  import { Toast } from "$lib/components";

  import "../app.css";

  export let data: LayoutServerData;

  user.set(data.user);
</script>

<slot />

<Toast />
