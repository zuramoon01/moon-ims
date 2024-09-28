<script lang="ts">
  import axios, { AxiosError } from "axios";
  import { goto } from "$app/navigation";
  import { addToast, user } from "$lib/stores";
  import { clsx } from "clsx";
  import Gauge from "lucide-svelte/icons/gauge";
  import Box from "lucide-svelte/icons/box";
  import ChartNoAxesCombined from "lucide-svelte/icons/chart-no-axes-combined";
  import ReceiptText from "lucide-svelte/icons/receipt-text";
  import LogOut from "lucide-svelte/icons/log-out";
  import { Anchor, Button } from "$lib/components";

  const navs = [
    {
      Icon: Gauge,
      text: "Dashboard",
    },
    {
      Icon: Box,
      text: "Produk",
    },
    {
      Icon: ReceiptText,
      text: "Transaksi",
    },
    {
      Icon: ChartNoAxesCombined,
      text: "Laporan",
    },
  ];

  let state: "idle" | "loading" = "idle";

  let controller = new AbortController();

  async function signOut() {
    try {
      if (state === "loading") {
        controller.abort();
        controller = new AbortController();
      }

      if (state === "idle") {
        state = "loading";
      }

      const { data } = await axios.post("/api/auth/signout", undefined, {
        signal: controller.signal,
      });

      addToast({
        title: "Success",
        description: data.message,
      });

      user.set(null);

      goto("/auth/signin");
    } catch (error) {
      if (error instanceof AxiosError) {
        if (error.response) {
          const { data, status, headers } = error.response;

          addToast({
            title: "Error",
            description: data.message,
          });

          console.log({ data, status, headers });
        } else if (error.request) {
          console.log(error.request);
        } else {
          console.log("Error", error.message);
        }
      }
    }

    state = "idle";
  }
</script>

<div class="flex min-h-dvh w-full flex-col items-start">
  <header class="w-full p-2">
    <div
      class="flex w-full items-center justify-between gap-4 overflow-hidden rounded-lg bg-black/20 px-4 py-2"
    >
      <div
        class={clsx("flex max-w-80 flex-col items-start justify-center", "xl:w-full xl:max-w-80")}
      >
        <a
          href="#"
          class="contents"
        >
          <h1 class="w-full max-w-80 text-xl font-semibold leading-[100%]">Moon IMS</h1>
          <p class="text-sm/[100%] text-black/60">Toko Bangunan Dayat</p></a
        >
      </div>

      <nav class={clsx("flex items-center justify-center gap-4", "max-md:hidden")}>
        {#each navs as { Icon, text }}
          <Anchor
            variant="outline"
            text={text}
            textClass={clsx("text-sm font-semibold")}
            Icon={Icon}
            iconClass={clsx("size-[1.125rem]")}
            attr={{
              href: "#",
              class: clsx("px-2 h-auto w-auto"),
            }}
          />
        {/each}
      </nav>

      <div class={clsx("flex max-w-80 items-center justify-end", "xl:w-full xl:max-w-80")}>
        <Button
          text="Keluar"
          textClass={clsx("text-sm font-semibold")}
          Icon={LogOut}
          iconClass={clsx("size-[1.125rem]")}
          attr={{
            class: clsx("px-2 h-auto w-auto"),
          }}
          state={state}
          on:click={signOut}
        />
      </div>
    </div>
  </header>

  <nav class={clsx("w-full p-2", "md:hidden")}>
    <div
      class="flex w-full items-center justify-center gap-[calc(100%_/_6)] overflow-hidden rounded-lg bg-black/20 px-8 py-2"
    >
      {#each navs as { Icon, text }}
        <a
          href="#"
          class={clsx(
            "group flex size-10 flex-col items-center justify-center text-black/60",
            "hover:text-black/80",
            "focus:text-black/80",
            "focus-visible:text-black/80",
            "active:text-black/80",
          )}
        >
          <Icon class="size-[1.125rem]" />

          <p class="text-sm font-semibold">{text}</p>
        </a>
      {/each}
    </div>
  </nav>
</div>
