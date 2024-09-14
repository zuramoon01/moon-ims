<script lang="ts">
  import type { LayoutServerData } from "./$types";
  import { user } from "$lib/store";

  import "../app.css";

  export let data: LayoutServerData;

  user.set(data.user);
</script>

<slot />
