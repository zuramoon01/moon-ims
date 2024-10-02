<script lang="ts">
  import { clsx } from "clsx";
  import { navs } from "$lib/stores";
  import { page } from "$app/stores";

  export let navMobileHeight: number;
</script>

<nav
  bind:clientHeight={navMobileHeight}
  class={clsx(
    // Gap Calculation
    // 100% = Ukuran yang bisa dicakup element nav

    // 4rem = Ukuran element navigasi * 4 = jumlah navigasi

    // clamp(1rem_*_2,_100%,_8%) = Ukuran di sisi kiri dan kanan / Padding kiri dan kanan,
    // paling sikit 1rem di kiri dan di kanan ( * 2 )
    // Paling banyak 8% dari 100% ukuran yang tersedia

    // / 3 Spasi / Ruang kosong diantara navigasi
    "flex w-full items-center justify-center gap-[calc((100%_-_(4rem_*_4_+_clamp(1rem_*_2,_100%,_8%)))_/_3)] overflow-hidden rounded-lg border border-black/10 py-2",
    "md:hidden",
  )}
>
  {#each navs as { Icon, text, link }}
    <a
      href={link}
      class={clsx(
        "flex h-8 w-16 flex-col items-center justify-center ",
        link === $page.url.pathname
          ? "pointer-events-none text-black/80"
          : [
              "text-black/40",
              "hover:text-black/80",
              "focus:text-black/80",
              "focus-visible:text-black/80",
              "active:text-black/80",
            ],
      )}
    >
      <Icon class="size-[1.25rem]" />

      <p class="text-xs font-semibold leading-none">{text}</p>
    </a>
  {/each}
</nav>
