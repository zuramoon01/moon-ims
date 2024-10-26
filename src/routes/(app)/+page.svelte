<script lang="ts">
  import { goto } from "$app/navigation";
  import { page } from "$app/stores";
  import { getProductResponseData } from "$lib/features/product";
  import { AddProduct } from "$lib/features/product/components";
  import {
    headerHeight,
    navMobileHeight,
    productStore,
    productTableColumnBaseClass,
    productTableTitles,
    Route,
  } from "$lib/stores";
  import { Button, Checkbox, Input } from "$lib/ui";
  import { clientErrorHandler } from "$lib/utils";
  import axios from "axios";
  import clsx from "clsx";
  import { ChevronLeft, ChevronRight, Filter } from "lucide-svelte";
  import { onMount } from "svelte";

  let { products, config, table, setProductStore, updateTableState } = $derived(productStore);
  let { currentPage, totalPage, from, to, limit, total } = $derived($config);

  let productTableTitleHeight = $state(0);
  let productTableInfoHeight = $state(0);

  let inputPageElement: HTMLInputElement | undefined = $state(undefined);

  let inputs = $state({
    limit: 0,
    page: 0,
  });

  function updateSearchParamsUrl() {
    return goto(
      `${Route.Dashboard}?${new URLSearchParams({ page: inputs.page.toString(), limit: inputs.limit.toString() }).toString()}`,
    );
  }

  async function getProducts() {
    try {
      const searchParamsUrl = $page.url.searchParams.toString();

      const response = await axios.get(`${Route.Api.Product}?${searchParamsUrl}`);

      const { data } = getProductResponseData(response.data);

      setProductStore(data);

      inputs = {
        limit: limit,
        page: currentPage,
      };

      await updateSearchParamsUrl();
    } catch (error) {
      clientErrorHandler(error);
    }
  }

  async function updateUrlAndProducts() {
    await updateSearchParamsUrl();
    await getProducts();
  }

  async function updateLimit() {
    if (isNaN(inputs.limit) || inputs.limit < 1) {
      inputs.limit = 1;
    } else if (inputs.limit > 15) {
      inputs.limit = 15;
    }

    await updateUrlAndProducts();
  }

  async function updatePage(action: "previous" | "input" | "next") {
    switch (action) {
      case "previous":
        if (inputs.page > 1) {
          inputs.page -= 1;
        }
        break;
      case "next":
        if (inputs.page < totalPage) {
          inputs.page += 1;
        }
        break;
      default:
        if (!inputs.page || isNaN(inputs.page) || inputs.page < 1) {
          inputs.page = 1;
        } else if (inputs.page > totalPage) {
          inputs.page = totalPage;
        }
        break;
    }

    await updateUrlAndProducts();
  }

  onMount(async () => {
    if ($page.url.search === "") {
      inputs = {
        limit: 15,
        page: 1,
      };

      await updateSearchParamsUrl();
    }

    await getProducts();
  });
</script>

<svelte:head>
  <title>Moon IMS | Dashboard</title>
</svelte:head>

<main
  class="flex w-full grow flex-col items-start justify-between overflow-hidden rounded-lg border border-black/10 p-4"
>
  <div class="flex w-full flex-col items-start gap-4">
    <div
      bind:offsetHeight={productTableTitleHeight}
      class="flex w-full flex-wrap items-center justify-between gap-x-4 gap-y-2"
    >
      <div class="flex items-center gap-2">
        <h2 class="text-2xl font-semibold leading-none">Produk</h2>

        {#if $products.length > 0}
          <div class="leadin-none rounded bg-black/10 px-2 py-1 text-xs font-semibold tabular-nums">
            {total}
          </div>
        {/if}
      </div>

      <div class="flex items-center gap-4">
        <Button
          icon={{
            Component: Filter,
            attr: { "aria-label": "Filter", class: clsx("size-[1.125rem]") },
          }}
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
        class="scrollbar-hide flex w-full flex-col gap-[1px] overflow-auto bg-black/10 p-[1px]"
        style="max-height: calc(100dvh - ({$headerHeight +
          productTableTitleHeight +
          productTableInfoHeight +
          $navMobileHeight}px + 2px + {$navMobileHeight === 0 ? '6rem' : '7rem'}));"
      >
        <div class="flex min-h-9 w-full gap-[1px] text-nowrap text-sm font-medium leading-none">
          <div class={clsx(productTableColumnBaseClass, "w-9 justify-center")}>
            <Checkbox
              state={$table.state}
              onchange={() => {
                updateTableState({ type: "group" });
              }}
            />
          </div>

          {#each productTableTitles as { name, classes }}
            <div class={clsx(productTableColumnBaseClass, classes)}>{name}</div>
          {/each}
        </div>

        {#each $products as { id, name, quantity, availability, buyPrice, totalBuyPrice, sellPrice, totalSellPrice }}
          <div class="flex w-full gap-[1px] text-sm">
            <div class={clsx(productTableColumnBaseClass, "w-9 justify-center")}>
              <Checkbox
                state={$table.products.has(id) ? "true" : "false"}
                onchange={() => {
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
      bind:offsetHeight={productTableInfoHeight}
      class="scrollbar-hide flex w-full shrink-0 flex-wrap items-center justify-between gap-x-4 gap-y-2 overflow-x-auto rounded border border-black/10 px-4 py-2"
    >
      <form
        onsubmit={(e) => {
          e.preventDefault();

          updateLimit();
        }}
        class="flex items-center gap-2"
      >
        <Input
          bind:value={inputs.limit}
          containerClass={clsx("w-12")}
          attr={{
            type: "number",
            class: clsx("h-8 w-12 px-2 text-center text-sm font-medium tabular-nums leading-none"),
          }}
        />

        <div class="flex flex-wrap items-center gap-1 text-nowrap text-sm font-medium leading-none">
          <p>Produk Per Halaman</p>
          <p class="tabular-nums">[ {from} - {to} ]</p>
        </div>
      </form>

      <div class="flex items-center gap-4">
        <Button
          attr={{
            type: "button",
            class: clsx("shrink-0 rounded border h-8 w-12"),
            onclick: () => {
              updatePage("previous");
            },
          }}
          variant="outline"
          icon={{
            Component: ChevronLeft,
            attr: {
              "aria-label": "Halaman Sebelumnya",
              class: clsx("size-6"),
            },
          }}
        />

        <!-- svelte-ignore a11y_click_events_have_key_events -->
        <!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
        <!-- svelte-ignore a11y_no_noninteractive_tabindex -->
        <form
          tabindex="0"
          onsubmit={(e) => {
            e.preventDefault();

            updatePage("input");
          }}
          onclick={() => {
            inputPageElement?.focus();
          }}
          class={clsx(
            "flex h-8 shrink-0 cursor-text items-center gap-1 rounded border border-black/60 bg-white px-2 text-sm font-medium tabular-nums leading-none text-black/60 outline-none",

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
            tabindex="-1"
            type="number"
            min={1}
            max={totalPage}
            bind:value={inputs.page}
            style="width: {(inputs.page && !isNaN(inputs.page)
              ? inputs.page.toString().length
              : 1) * 0.5625}rem;"
            class="bg-transparent text-center outline-none"
          />

          <span>/</span>

          <p>{totalPage}</p>
        </form>

        <Button
          attr={{
            type: "button",
            class: clsx("shrink-0 rounded border h-8 w-12"),
            onclick: () => {
              updatePage("next");
            },
          }}
          variant="outline"
          icon={{
            Component: ChevronRight,
            attr: {
              "aria-label": "Halaman Berikutnya",
              class: clsx("size-6"),
            },
          }}
        />
      </div>
    </div>
  {/if}
</main>
