<script lang="ts">
  import { goto } from "$app/navigation";
  import { addToasts, navs, Route, user } from "$lib/stores";
  import type { Status } from "$lib/types";
  import { Button } from "$lib/ui";
  import { clientErrorHandler } from "$lib/utils";
  import axios from "axios";
  import clsx from "clsx";
  import { LogOut } from "lucide-svelte";

  let {
    headerHeight = $bindable(),
  }: {
    headerHeight: number;
  } = $props();

  let status: Status = $state("idle");

  let controller: AbortController;

  async function signOut() {
    try {
      if (status === "loading" && controller) {
        controller.abort();
      }

      status = "loading";

      controller = new AbortController();

      const { data } = await axios.post(Route.Api.Auth.SignOut, {
        signal: controller.signal,
      });

      user.set(null);

      addToasts({
        type: "success",
        title: "Berhasil",
        description: data.message,
      });

      goto(Route.Auth.SignIn);
    } catch (error) {
      if (axios.isCancel(error)) {
        return;
      }

      clientErrorHandler(error);
    }

    status = "idle";
  }
</script>

<header
  bind:offsetHeight={headerHeight}
  class="flex w-full items-center justify-between overflow-hidden rounded-lg border border-black/10 p-4"
>
  <div class={clsx("flex items-center", "lg:w-full lg:max-w-80")}>
    <a
      href={Route.Dashboard}
      class="flex flex-col items-start justify-center"
    >
      <h1 class="text-nowrap text-xl font-semibold leading-none">Moon IMS</h1>
      {#if $user?.companyName}
        <p class="text-sm leading-none text-black/60">{$user.companyName}</p>
      {/if}</a
    >
  </div>

  <nav class={clsx("flex grow items-center gap-4 px-4", "max-md:hidden", "lg:justify-center")}>
    {#each navs as { Icon, text }}
      <Button
        element="a"
        attr={{
          href: "#",
          class: clsx("w-auto p-2 gap-1 h-9"),
        }}
        variant="outline"
        {text}
        textClass={clsx("text-sm font-semibold leading-none")}
        icon={{
          Component: Icon,
        }}
      />
    {/each}
  </nav>

  <div class={clsx("flex items-center justify-end", "lg:w-full lg:max-w-80")}>
    <Button
      attr={{
        type: "button",
        class: clsx("w-auto p-2 gap-1 h-9"),
        onclick: signOut,
      }}
      {status}
      text="Keluar"
      textClass={clsx("text-sm font-semibold leading-none")}
      icon={{ Component: LogOut }}
    />
  </div>
</header>
