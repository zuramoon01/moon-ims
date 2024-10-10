<script lang="ts">
  import { goto } from "$app/navigation";
  import { page } from "$app/stores";
  import {
    AddProduct,
    productStore,
    productTableColumnBaseClass,
    productTableTitles,
  } from "$lib/features/product";
  import { Button, Checkbox, Header, NavMobile } from "$lib/ui";
  import { errorHandler } from "$lib/utils";
  import axios from "axios";
  import { clsx } from "clsx";
  import ChevronLeft from "lucide-svelte/icons/chevron-left";
  import ChevronRight from "lucide-svelte/icons/chevron-right";
  import Filter from "lucide-svelte/icons/filter";
  import { onMount, tick } from "svelte";

  $: ({ products, config, table, setProductStore, updateTableState } = productStore);
  $: ({ currentPage, totalPage, from, to, limit, total } = $config);

  let headerHeight = 0;
  let navMobileHeight = 0;

  let productTableTitleHeight = 0;
  let productTableInfoHeight = 0;

  let inputPageElement: HTMLInputElement;

  let inputLimit = 0;
  let inputPage = 0;

  async function updateSearchParamsUrl() {
    await goto(
      `/?${new URLSearchParams({ page: inputPage.toString(), limit: inputLimit.toString() }).toString()}`,
    );
  }

  function getSearchParamsUrl() {
    return $page.url.searchParams.toString();
  }

  async function getProducts() {
    try {
      const searchParamsUrl = getSearchParamsUrl();

      const { data } = await axios.get(`/api/products?${searchParamsUrl}`);

      setProductStore(data.data);

      await tick();

      inputLimit = limit;
      inputPage = currentPage;

      await updateSearchParamsUrl();
    } catch (error) {
      errorHandler(error);
    }
  }

  async function updateUrlAndProducts() {
    await updateSearchParamsUrl();
    await getProducts();
  }

  async function updateLimit() {
    if (isNaN(inputLimit) || inputLimit < 1) {
      inputLimit = 1;
    } else if (inputLimit > 15) {
      inputLimit = 15;
    }

    await updateUrlAndProducts();
  }

  async function updateCurrentPage(action: "previous" | "input" | "next") {
    if (action === "previous") {
      inputPage -= 1;

      if (inputPage < 1) {
        inputPage = 1;
      }
    } else if (action === "input") {
      if (isNaN(inputPage) || inputPage < 1) {
        inputPage = 1;
      } else if (inputPage > totalPage) {
        inputPage = totalPage;
      }
    } else {
      inputPage += 1;

      if (inputPage > totalPage) {
        inputPage = totalPage;
      }
    }

    await updateUrlAndProducts();
  }

  onMount(async () => {
    const { search } = $page.url;

    if (search === "") {
      inputLimit = 15;
      inputPage = 1;

      await updateSearchParamsUrl();
    }

    await getProducts();
  });
</script>

<div class="flex min-h-dvh w-full flex-col items-start gap-4 p-4">
  <Header bind:headerHeight={headerHeight} />

  <main
    class="flex w-full grow flex-col items-start justify-between overflow-hidden rounded-lg border border-black/10 p-4"
  >
    <div class="flex w-full flex-col items-start gap-4">
      <div
        bind:clientHeight={productTableTitleHeight}
        class="flex w-full flex-wrap items-center justify-between gap-x-4 gap-y-2"
      >
        <div class="flex items-center gap-2">
          <h2 class="text-2xl font-semibold leading-none">Produk</h2>

          {#if $products.length > 0}
            <div
              class="leadin-none rounded bg-black/10 px-2 py-1 text-xs font-semibold tabular-nums"
            >
              {total}
            </div>
          {/if}
        </div>

        <div class="flex items-center gap-4">
          <Button
            Icon={Filter}
            iconClass={clsx("size-[1.125rem]")}
            attr={{
              type: "button",
              class: clsx("rounded size-9"),
            }}
          />

          <AddProduct />
        </div>
      </div>

      {#if $products.length > 0}
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
            <div class={clsx(productTableColumnBaseClass, "w-9 justify-center")}>
              <Checkbox
                state={$table.state}
                onChange={() => {
                  updateTableState({ type: "group" });
                }}
              />
            </div>

            {#each productTableTitles as { name, classes }}
              <div class={clsx(productTableColumnBaseClass, classes)}>{name}</div>
            {/each}
          </div>

          {#each $products as { id, name, quantity, availability, buyPrice, totalBuyPrice, sellPrice, totalSellPrice } (id)}
            <div class="flex w-full gap-[1px] text-sm">
              <div class={clsx(productTableColumnBaseClass, "w-9 justify-center")}>
                <Checkbox
                  state={$table.products.has(id) ? "true" : "false"}
                  onChange={() => {
                    updateTableState({ type: "single", productId: id });
                  }}
                />
              </div>
              <div class={clsx(productTableColumnBaseClass, productTableTitles[0].classes)}>
                {name}
              </div>
              <div class={clsx(productTableColumnBaseClass, productTableTitles[1].classes)}>
                {quantity}
              </div>
              <div class={clsx(productTableColumnBaseClass, productTableTitles[2].classes)}>
                <div
                  class={clsx(
                    "flex items-center justify-center rounded px-4 py-1",
                    availability === "Tersedia" && "bg-green/60",
                    availability === "Sedikit" && "bg-yellow/60",
                    availability === "Tidak Tersedia" && "bg-red/60",
                  )}
                >
                  {availability}
                </div>
              </div>
              <div class={clsx(productTableColumnBaseClass, productTableTitles[3].classes)}>
                {buyPrice}
              </div>
              <div class={clsx(productTableColumnBaseClass, productTableTitles[4].classes)}>
                {totalBuyPrice}
              </div>
              <div class={clsx(productTableColumnBaseClass, productTableTitles[5].classes)}>
                {sellPrice}
              </div>
              <div class={clsx(productTableColumnBaseClass, productTableTitles[6].classes)}>
                {totalSellPrice}
              </div>
            </div>
          {/each}
        </div>
      {:else}
        <div class="flex w-full items-center justify-center">
          <p>Anda belum memiliki produk.</p>
        </div>
      {/if}
    </div>

    {#if $products.length > 0}
      <div
        bind:clientHeight={productTableInfoHeight}
        class="scrollbar-hide flex w-full shrink-0 flex-wrap items-center justify-between gap-x-4 gap-y-2 overflow-x-auto rounded border border-black/10 px-4 py-2"
      >
        <form
          on:submit|preventDefault={updateLimit}
          class="flex items-center gap-2"
        >
          <input
            type="number"
            value={inputLimit}
            on:input={(e) => {
              inputLimit = e.currentTarget.valueAsNumber;
            }}
            class={clsx(
              "h-8 w-12 rounded border border-black/60 bg-white px-2 text-center text-sm font-medium tabular-nums leading-none text-black/60 outline-none",

              "placeholder:text-black/20",
              "placeholder-shown:border-black/20",

              "hover:border-blue/40",
              "focus:border-blue/40",
              "focus-visible:border-blue/40",
              "active:border-blue/40",
            )}
          />

          <div
            class="flex flex-wrap items-center gap-1 text-nowrap text-sm font-medium leading-none"
          >
            <p>Produk Per Halaman</p>
            <p class="tabular-nums">[ {from} - {to} ]</p>
          </div>
        </form>

        <div class="flex items-center gap-4">
          <Button
            Icon={ChevronLeft}
            iconClass={clsx("size-6")}
            variant="outline"
            attr={{
              type: "button",
              class: clsx("shrink-0 rounded border h-8 w-12"),
            }}
            on:click={() => {
              updateCurrentPage("previous");
            }}
          />

          <!-- svelte-ignore a11y-click-events-have-key-events -->
          <!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
          <form
            on:submit|preventDefault={() => {
              updateCurrentPage("input");
            }}
            on:click={() => {
              inputPageElement.focus();
            }}
            class={clsx(
              "flex h-8 shrink-0 cursor-text items-center gap-1 rounded border border-black/60 bg-white px-2 text-sm font-medium tabular-nums leading-none text-black/60",

              "placeholder:text-black/20",
              "placeholder-shown:border-black/20",

              "hover:border-blue/40",
              "focus:border-blue/40",
              "focus-visible:border-blue/40",
              "active:border-blue/40",
            )}
          >
            <input
              bind:this={inputPageElement}
              type="number"
              value={inputPage}
              on:input={(e) => {
                inputPage = e.currentTarget.valueAsNumber;
              }}
              style:width={`${(!isNaN(inputPage) ? inputPage.toString().length : 1) * 0.5625}rem`}
              class="bg-transparent text-center outline-none"
            />

            <span>/</span>

            <p>{totalPage}</p>
          </form>

          <Button
            Icon={ChevronRight}
            iconClass={clsx("size-6")}
            variant="outline"
            attr={{
              type: "button",
              class: clsx("shrink-0 rounded border h-8 w-12"),
            }}
            on:click={() => {
              updateCurrentPage("next");
            }}
          />
        </div>
      </div>
    {/if}
  </main>

  <NavMobile bind:navMobileHeight={navMobileHeight} />
</div>

<style class="postcss">
  /*
    Height Calculation
    // 100dvh = Ukuran yang bisa dicakup browser
    // 2px adalah ukuran tambahan untuk border dan + 2px diakhir adalah border dari produk
    // 6rem / 7rem Jarak yang memisahkan tiap elemen header, product table title, product table info, dan nav mobile
  */
  .product-data {
    max-height: calc(
      100dvh -
        (
          var(--headerHeight) + 2px + var(--productTableTitleHeight) + var(--productTableInfoHeight) +
            2px + var(--navMobileHeight) + 2px + 7rem + 2px
        )
    );
  }

  @screen md {
    .product-data {
      max-height: calc(
        100dvh -
          (
            var(--headerHeight) + 2px + var(--productTableTitleHeight) +
              var(--productTableInfoHeight) + 2px + 6rem + 2px
          )
      );
    }
  }
</style>
