<script lang="ts">
  import { page } from "$app/stores";
  import { addToasts, createDialogStore, productStore, Route } from "$lib/stores";
  import type { Status } from "$lib/types";
  import { Button } from "$lib/ui";
  import { clientErrorHandler } from "$lib/utils";
  import axios from "axios";
  import clsx from "clsx";
  import { X } from "lucide-svelte";
  import { fade } from "svelte/transition";
  import { getProductResponseData } from "../product.util";

  const { dialogState, dialogIds, openDialog, closeDialog, dialog, contentDialog } =
    createDialogStore();

  let { table, setProductStore, updateTable } = $derived(productStore);
  let totalProduct = $derived($table.products.size);

  let status: Status = $state("idle");

  let controller: AbortController;

  async function deleteProducts() {
    try {
      if (status === "loading" && controller) {
        controller.abort();
      }

      status = "loading";

      controller = new AbortController();

      const searchParamsUrl = $page.url.searchParams.toString();

      const response = await axios.delete(`${Route.Api.Product}?${searchParamsUrl}`, {
        data: {
          ids: [...$table.products.keys()],
        },
      });

      const { message, data } = getProductResponseData(response.data);

      setProductStore(data);
      updateTable({
        type: "group",
        action: "reset",
      });

      addToasts({
        type: "success",
        title: "Berhasil",
        description: message,
      });

      closeDialog();
    } catch (error) {
      if (axios.isCancel(error)) {
        return;
      }

      clientErrorHandler(error);
    }

    status = "idle";
  }
</script>

<Button
  attr={{
    type: "button",
    class: clsx("w-auto h-9"),
    onclick: openDialog,
  }}
  variant="danger"
  text={`Hapus Produk (${totalProduct})`}
  textClass={clsx("text-sm font-semibold leading-none")}
/>

{#if $dialogState === "open"}
  <div
    tabindex="-1"
    aria-hidden="true"
    class="fixed inset-0 z-50 cursor-pointer bg-black/20"
    onclick={closeDialog}
  ></div>

  <!--  a11y_no_noninteractive_element_interactions -->
  <form
    use:dialog
    transition:fade={{
      duration: 300,
    }}
    id={dialogIds.dialog}
    role="dialog"
    aria-modal="true"
    aria-labelledby={dialogIds.title}
    aria-describedby={dialogIds.description}
    class="fixed left-1/2 top-1/2 z-50 flex max-h-dvh w-[calc(100%_-_(1rem_*_2))] max-w-[40rem] -translate-x-1/2 -translate-y-1/2 flex-col items-start gap-4 overflow-auto rounded-lg bg-white px-4 py-6"
    onsubmit={(e) => {
      e.preventDefault();

      deleteProducts();
    }}
  >
    <div class="flex w-full items-center justify-between gap-1">
      <h3
        id={dialogIds.title}
        class="text-lg font-semibold leading-none"
      >
        Hapus Produk ({totalProduct})
      </h3>

      <Button
        variant="ghost"
        attr={{
          type: "button",
          class: clsx("size-auto p-1 shrink-0"),
          onclick: closeDialog,
        }}
        icon={{
          Component: X,
          attr: {
            class: clsx("size-[1.125rem]"),
          },
        }}
      />
    </div>

    <div
      use:contentDialog
      class="flex w-full items-start"
    >
      <p
        id={dialogIds.description}
        class="text-base"
      >
        <span class="block">Yakin ingin menghapus produk yang terpilih?</span>
        <span class="block text-red/60">* Produk yang dihapus tidak dapat dikembalikan lagi!</span>
      </p>
    </div>

    <div class={clsx("flex w-full items-center justify-end gap-4", "max-sm:flex-col")}>
      <Button
        attr={{
          type: "button",
          class: clsx("sm:w-auto"),
          onclick: () => {
            closeDialog();
          },
        }}
        variant="outline"
        text="Batal"
      />

      <Button
        attr={{
          class: clsx("sm:w-auto"),
        }}
        {status}
        variant="danger"
        text={`Hapus (${totalProduct})`}
      />
    </div>
  </form>
{/if}
