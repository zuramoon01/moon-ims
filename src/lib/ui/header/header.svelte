<script lang="ts">
  import { goto } from "$app/navigation";
  import { user } from "$lib/features/user";
  import { navs } from "$lib/stores";
  import { addToast, Anchor, Button } from "$lib/ui";
  import { errorHandler } from "$lib/utils";
  import axios from "axios";
  import clsx from "clsx";
  import LogOut from "lucide-svelte/icons/log-out";

  export let headerHeight: number;

  let state: "idle" | "loading" = "idle";

  let controller: AbortController;

  async function signOut() {
    try {
      if (state === "loading") {
        controller.abort();
      }

      state = "loading";

      controller = new AbortController();

      const { data } = await axios.post("/api/auth/signout", undefined, {
        signal: controller.signal,
      });

      addToast({
        title: "Success",
        description: data.message,
      });

      user.set(null);

      goto("/auth/signin");

      state = "idle";
    } catch (error) {
      errorHandler(error);

      if (!axios.isCancel(error)) {
        state = "idle";
      }
    }
  }
</script>

<header
  bind:clientHeight={headerHeight}
  class="flex w-full items-center overflow-hidden rounded-lg border border-black/10 p-4"
>
  <div class={clsx("flex flex-col items-start justify-center", "lg:w-full lg:max-w-80")}>
    <a
      href="/"
      class="contents"
    >
      <h1 class="text-nowrap text-xl font-semibold leading-none">Moon IMS</h1>
      <p class="text-sm leading-none text-black/60">Toko Bangunan Dayat</p></a
    >
  </div>

  <div class={clsx("flex-1", "max-lg:hidden")}></div>

  <nav class={clsx("flex items-center justify-center gap-4 px-4", "max-md:hidden")}>
    {#each navs as { Icon, text }}
      <Anchor
        variant="outline"
        text={text}
        textClass={clsx("text-sm font-semibold leading-none")}
        Icon={Icon}
        iconClass={clsx("size-[1.25rem]")}
        attr={{
          href: "#",
          class: clsx("w-auto p-2 gap-1 h-9"),
        }}
      />
    {/each}
  </nav>

  <div class="flex-1"></div>

  <div class={clsx("flex items-center justify-end", "lg:w-full lg:max-w-80")}>
    <Button
      state={state}
      text="Keluar"
      textClass={clsx("text-sm font-semibold leading-none")}
      Icon={LogOut}
      iconClass={clsx("size-[1.25rem]")}
      attr={{
        type: "button",
        class: clsx("w-auto p-2 gap-1 h-9"),
      }}
      on:click={signOut}
    />
  </div>
</header>
