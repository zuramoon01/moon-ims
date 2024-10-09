<script lang="ts">
  import { user } from "$lib/features/user";
  import { Toast } from "$lib/ui";
  import type { LayoutServerData } from "./$types";

  import "../app.css";

  export let data: LayoutServerData;

  user.set(data.user);
</script>

<slot />

<Toast />
