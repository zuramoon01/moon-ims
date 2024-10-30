<script lang="ts">
  import { goto } from "$app/navigation";
  import { page } from "$app/stores";
  import { productOrderList, productSortList, productStore, Route } from "$lib/stores";
  import type { Status } from "$lib/types";
  import { Button } from "$lib/ui";
  import { clientErrorHandler } from "$lib/utils";
  import axios from "axios";
  import clsx from "clsx";
  import { ChevronDown } from "lucide-svelte";
  import { fade } from "svelte/transition";
  import { getProductResponseData } from "../product.util";

  let { config, setProductStore, updateSort, updateOrder } = $derived(productStore);
  let { sort, order } = $derived($config);

  let open = $state(false);
  let openSort = $state(false);
  let openOrder = $state(false);

  function select(node: HTMLElement) {
    const handleOutsideClick = (e: MouseEvent) => {
      if (e.target instanceof Node && !node.contains(e.target) && open && !openSort && !openOrder) {
        e.stopPropagation();

        open = false;
      }
    };

    document.addEventListener("click", handleOutsideClick);

    $effect(() => {
      return () => {
        document.removeEventListener("click", handleOutsideClick);
      };
    });
  }

  function selectSort(node: HTMLElement) {
    const handleOutsideClick = (e: MouseEvent) => {
      if (e.target instanceof Node && !node.contains(e.target) && openSort) {
        e.stopPropagation();

        openSort = false;
      }
    };

    document.addEventListener("click", handleOutsideClick);

    $effect(() => {
      return () => {
        document.removeEventListener("click", handleOutsideClick);
      };
    });
  }

  function selectOrder(node: HTMLElement) {
    const handleOutsideClick = (e: MouseEvent) => {
      if (e.target instanceof Node && !node.contains(e.target) && openOrder) {
        e.stopPropagation();

        openOrder = false;
      }
    };

    document.addEventListener("click", handleOutsideClick);

    $effect(() => {
      return () => {
        document.removeEventListener("click", handleOutsideClick);
      };
    });
  }

  function updateSearchParamsUrl() {
    const searchParamsUrl = $page.url.searchParams;
    searchParamsUrl.set("sort", sort);
    searchParamsUrl.set("order", order);

    return goto(`${Route.Dashboard}?${searchParamsUrl.toString()}`);
  }

  let status: Status = $state("loading");

  let controller: AbortController;

  async function getProducts() {
    try {
      if (status === "loading" && controller) {
        controller.abort();
      }

      status = "loading";

      controller = new AbortController();

      const searchParamsUrl = $page.url.searchParams.toString();

      const response = await axios.get(`${Route.Api.Product}?${searchParamsUrl}`, {
        signal: controller.signal,
      });

      const { data } = getProductResponseData(response.data);

      setProductStore(data);

      await updateSearchParamsUrl();
    } catch (error) {
      if (axios.isCancel(error)) {
        return;
      }

      clientErrorHandler(error);
    }

    status = "idle";
  }

  async function updateUrlAndProducts() {
    await updateSearchParamsUrl();
    await getProducts();
  }
</script>

<div
  use:select
  class="relative"
>
  <Button
    attr={{
      type: "button",
      class: clsx("w-auto h-9"),
      onclick: () => {
        open = !open;
      },
    }}
    text="Urut"
    textClass={clsx("text-sm font-semibold")}
    icon={{
      Component: ChevronDown,
      side: "right",
    }}
  />

  {#if open}
    <div
      class="absolute left-0 top-[calc(100%_+_0.5rem)] flex gap-2 rounded border border-black/10 bg-white p-2 text-sm font-semibold"
      transition:fade={{ duration: 150 }}
    >
      <div
        use:selectSort
        class="relative"
      >
        <Button
          attr={{
            type: "button",
            class: clsx("w-auto h-9"),
            onclick: () => {
              openSort = !openSort;
            },
          }}
          text={productSortList.find(({ key }) => key === sort)!.name}
          textClass={clsx("w-16 text-left truncate text-sm font-semibold")}
          icon={{
            Component: ChevronDown,
            side: "right",
          }}
        />

        {#if openSort}
          <div
            class="absolute left-0 top-[calc(100%_+_0.5rem)] flex w-60 flex-col overflow-auto rounded border border-black/10 bg-white p-1 text-sm font-semibold"
            transition:fade={{ duration: 150 }}
          >
            {#each productSortList as { key, name }}
              <!-- svelte-ignore a11y_click_events_have_key_events -->
              <!-- svelte-ignore a11y_no_static_element_interactions -->
              <div
                onclick={() => {
                  updateSort(key);
                  updateUrlAndProducts();
                }}
                class={clsx("w-full cursor-pointer rounded px-4 py-1", "hover:bg-black/10")}
              >
                {name}
              </div>
            {/each}
          </div>
        {/if}
      </div>

      <div
        use:selectOrder
        class="relative"
      >
        <Button
          attr={{
            type: "button",
            class: clsx("w-auto h-9"),
            onclick: () => {
              openOrder = !openOrder;
            },
          }}
          text={productOrderList.find(({ key }) => key === order)!.name}
          textClass={clsx("w-16 text-left truncate text-sm font-semibold")}
          icon={{
            Component: ChevronDown,
            side: "right",
          }}
        />

        {#if openOrder}
          <div
            class="absolute left-0 top-[calc(100%_+_0.5rem)] flex w-60 flex-col overflow-auto rounded border border-black/10 bg-white p-1 text-sm font-semibold"
            transition:fade={{ duration: 150 }}
          >
            {#each productOrderList as { key, name }}
              <!-- svelte-ignore a11y_click_events_have_key_events -->
              <!-- svelte-ignore a11y_no_static_element_interactions -->
              <div
                class={clsx("w-full cursor-pointer rounded px-4 py-1", "hover:bg-black/10")}
                onclick={() => {
                  updateOrder(key);
                  updateUrlAndProducts();
                }}
              >
                {name}
              </div>
            {/each}
          </div>
        {/if}
      </div>
    </div>
  {/if}
</div>
