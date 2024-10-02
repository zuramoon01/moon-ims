<script lang="ts">
  import type { PageServerData } from "./$types";
  import { productTableColumnBaseClass, productTableTitles } from "$lib/stores";
  import { clsx } from "clsx";
  import { Button, Header, NavMobile } from "$lib/components";
  import Filter from "lucide-svelte/icons/filter";
  import ChevronLeft from "lucide-svelte/icons/chevron-left";
  import ChevronRight from "lucide-svelte/icons/chevron-right";

  export let data: PageServerData;

  $: ({ products } = data);

  let headerHeight = 0;
  let navMobileHeight = 0;

  let productTableTitleHeight = 0;
  let productTableInfoHeight = 0;

  let productLimit = 5;

  let inputPage: HTMLInputElement;
  let productPage = 5;
  let productMaxPage = 10;
</script>

<div class="flex min-h-dvh w-full flex-col items-start gap-4 p-4">
  <Header bind:headerHeight={headerHeight} />

  <main
    class="flex w-full grow flex-col items-start overflow-hidden rounded-lg border border-black/10 p-4"
  >
    <div
      bind:clientHeight={productTableTitleHeight}
      class="flex w-full flex-wrap items-center justify-between gap-x-4 gap-y-2 pb-4"
    >
      <div class="flex items-center gap-2">
        <h2 class="text-2xl font-semibold leading-none">Produk</h2>

        <div
          class="leadin-none rounded-[0.25rem] bg-black/10 px-2 py-1 text-xs font-semibold tabular-nums"
        >
          {products.length}
        </div>
      </div>

      <div class="flex items-center gap-4">
        <Button
          Icon={Filter}
          iconClass={clsx("size-[1.125rem]")}
          attr={{
            type: "button",
            class: clsx("rounded-[0.25rem] size-9"),
          }}
        />

        <Button
          text="Tambah Produk"
          textClass={clsx("text-sm font-semibold leading-none")}
          attr={{
            type: "button",
            class: clsx("w-auto h-9"),
          }}
        />
      </div>
    </div>

    <div
      class="product-data scrollbar-hide flex w-full flex-col gap-[1px] overflow-auto bg-black/10 p-[1px]"
      style={`
        --headerHeight: ${headerHeight}px;
        --productTableTitleHeight: ${productTableTitleHeight}px;
        --productTableInfoHeight: ${productTableInfoHeight}px;
        --navMobileHeight: ${navMobileHeight}px;
      `}
    >
      <div class="flex w-full gap-[1px] text-nowrap text-sm font-medium leading-none">
        {#each productTableTitles as { name, classes }}
          <div class={clsx(productTableColumnBaseClass, classes)}>{name}</div>
        {/each}
      </div>

      {#each products as { id, name, quantity, availability } (id)}
        <div class="flex w-full gap-[1px] text-sm">
          <div class={clsx(productTableColumnBaseClass, productTableTitles[0].classes)}></div>
          <div class={clsx(productTableColumnBaseClass, productTableTitles[1].classes)}>
            {name}
          </div>
          <div class={clsx(productTableColumnBaseClass, productTableTitles[2].classes)}>
            {quantity}
          </div>
          <div class={clsx(productTableColumnBaseClass, productTableTitles[3].classes)}>
            <div
              class={clsx(
                "flex items-center justify-center rounded-[0.25rem] px-4 py-1",
                availability === "Tersedia" && "bg-green/60",
                availability === "Sedikit" && "bg-yellow/60",
                availability === "Tidak Tersedia" && "bg-red/60",
              )}
            >
              {availability}
            </div>
          </div>
          <div class={clsx(productTableColumnBaseClass, productTableTitles[4].classes)}>
            Rp 8.500,00
          </div>
          <div class={clsx(productTableColumnBaseClass, productTableTitles[5].classes)}>
            Rp 93.500,00
          </div>
          <div class={clsx(productTableColumnBaseClass, productTableTitles[6].classes)}>
            Rp 15.000,00
          </div>
          <div class={clsx(productTableColumnBaseClass, productTableTitles[7].classes)}>
            Rp 165.000,00
          </div>
        </div>
      {/each}
    </div>

    <div class="flex-1"></div>

    <div
      bind:clientHeight={productTableInfoHeight}
      class="flex w-full shrink-0 flex-wrap items-center justify-between gap-x-4 gap-y-2 overflow-hidden rounded-[0.25rem] border border-black/10 px-4 py-2"
    >
      <div class="flex items-center gap-2">
        <input
          type="number"
          value={productLimit}
          on:input={(e) => {
            productLimit = e.currentTarget.valueAsNumber;

            if (isNaN(productLimit) || productLimit < 1) {
              productLimit = 1;
            } else if (productLimit > 15) {
              productLimit = 15;
            }
          }}
          class={clsx(
            "h-8 w-12 rounded-[0.25rem] border border-black/60 bg-white px-2 text-center text-sm font-medium tabular-nums leading-none text-black/60 outline-none",

            "placeholder:text-black/20",
            "placeholder-shown:border-black/20",

            "hover:border-blue/40",
            "focus:border-blue/40",
            "focus-visible:border-blue/40",
            "active:border-blue/40",
          )}
        />

        <p class="text-nowrap text-sm font-medium leading-none">Produk Per Halaman</p>
      </div>

      <div class="flex items-center gap-4">
        <Button
          Icon={ChevronLeft}
          iconClass={clsx("size-6")}
          variant="outline"
          attr={{
            type: "button",
            class: clsx("rounded-[0.25rem] border h-8 w-12"),
          }}
        />

        <!-- svelte-ignore a11y-no-static-element-interactions -->
        <!-- svelte-ignore a11y-click-events-have-key-events -->
        <div
          class={clsx(
            "flex h-8 shrink-0 cursor-text items-center gap-1 rounded-[0.25rem] border border-black/60 bg-white px-2 text-black/60",

            "placeholder:text-black/20",
            "placeholder-shown:border-black/20",

            "hover:border-blue/40",
            "focus:border-blue/40",
            "focus-visible:border-blue/40",
            "active:border-blue/40",
          )}
          on:click={() => {
            inputPage.focus();
          }}
        >
          <input
            bind:this={inputPage}
            type="number"
            value={productPage}
            on:input={(e) => {
              productPage = e.currentTarget.valueAsNumber;

              if (isNaN(productPage) || productPage < 1) {
                productPage = 1;
              } else if (productPage > productMaxPage) {
                productPage = productMaxPage;
              }
            }}
            style:width={`${productPage.toString().length * 0.5625}rem`}
            class="bg-transparent text-center text-sm font-medium tabular-nums leading-none outline-none"
          />

          <p class="text-sm font-medium tabular-nums leading-none">
            / {productMaxPage}
          </p>
        </div>

        <Button
          Icon={ChevronRight}
          iconClass={clsx("size-6")}
          variant="outline"
          attr={{
            type: "button",
            class: clsx("rounded-[0.25rem] border h-8 w-12"),
          }}
        />
      </div>
    </div>
  </main>

  <NavMobile bind:navMobileHeight={navMobileHeight} />
</div>

<style class="postcss">
  /*
    Height Calculation
    // 100dvh = Ukuran yang bisa dicakup browser
    // 5.5rem / 6.5rem Jarak yang memisahkan tiap elemen header, product table title, product table info, dan nav mobile
  */
  .product-data {
    max-height: calc(
      100dvh -
        (
          var(--headerHeight) + var(--productTableTitleHeight) + var(--productTableInfoHeight) +
            var(--navMobileHeight) + 6.5rem
        )
    );
  }

  @screen md {
    .product-data {
      max-height: calc(
        100dvh -
          (
            var(--headerHeight) + var(--productTableTitleHeight) + var(--productTableInfoHeight) +
              5.5rem
          )
      );
    }
  }
</style>
