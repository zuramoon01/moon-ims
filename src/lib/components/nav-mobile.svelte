<script lang="ts">
  import { page } from "$app/stores";
  import { navMobileHeight, navs } from "$lib/stores";
  import { Button } from "$lib/ui";
  import clsx from "clsx";

  const totalNav = navs.length;
</script>

<nav
  bind:offsetHeight={$navMobileHeight}
  class={clsx(
    // Kalkulasi Gap calc((100% - (4rem * 4 + clamp(2rem, 100%, 8%))) / 3)
    // calc(( [100%]  - ( [4rem * 4] + [clamp(2rem, 100%, 8%)] )) / [3] )
    // [] = Menandakan apa yang akan dijelaskan

    // 100% = Ukuran yang bisa dicakup element nav

    // 4rem * n = 4rem Ukuran element navigasi * n (jumlah navigasi)

    // clamp(1rem * 2, 100%, 8%) = Ukuran Padding (kiri + kanan),

    // n - 1 = n (jumlah navigasi) Spasi / Ruang kosong diantara navigasi
    "flex w-full items-center justify-center overflow-hidden rounded-lg border border-black/10 py-2",

    "md:hidden",
  )}
  style="gap: calc((100% - (4rem * {totalNav} + clamp(2rem, 100%, 8%))) / {totalNav - 1});"
>
  {#each navs as { Icon, text, link }}
    <Button
      element="a"
      attr={{
        href: link,
        class: clsx(
          "h-8 w-16 flex-col overflow-visible rounded-none p-0 gap-0",
          link === $page.url.pathname
            ? "pointer-events-none"
            : [
                "text-black/40",
                "hover:text-black/80",
                "focus:text-black/80",
                "focus-visible:text-black/80",
                "active:text-black/80",
              ],
        ),
      }}
      variant={null}
      {text}
      textClass={clsx("text-xs font-semibold leading-none")}
      icon={{
        Component: Icon,
      }}
    />
  {/each}
</nav>
