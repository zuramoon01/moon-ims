<script lang="ts">
  import { page } from "$app/stores";
  import {
    BuyPriceSchema,
    getProductResponseData,
    NameSchema,
    QuantitySchema,
    SellPriceSchema,
  } from "$lib/features/product";
  import { addToasts, createDialogStore, createFormStore, productStore, Route } from "$lib/stores";
  import type { Status } from "$lib/types";
  import { Button, Input } from "$lib/ui";
  import { clientErrorHandler } from "$lib/utils";
  import axios from "axios";
  import clsx from "clsx";
  import { X } from "lucide-svelte";
  import { fade } from "svelte/transition";

  const { dialogState, dialogIds, openDialog, closeDialog, dialog, contentDialog } =
    createDialogStore();

  let { setProductStore } = $derived(productStore);

  let status: Status = $state("idle");

  let controller: AbortController;

  const { inputs, errors, validateInput, hasError, resetForm } = createFormStore({
    name: NameSchema,
    quantity: QuantitySchema,
    buyPrice: BuyPriceSchema,
    sellPrice: SellPriceSchema,
  });

  async function addProduct() {
    try {
      if (hasError()) {
        addToasts({
          type: "warning",
          title: "Penambahan Produk Gagal",
          description:
            "Silahkan isi data pada form tambah produk sesuai dengan ketentuan yang diberikan.",
        });

        return;
      }

      if (status === "loading" && controller) {
        controller.abort();
      }

      status = "loading";

      controller = new AbortController();

      const searchParamsUrl = $page.url.searchParams.toString();

      const response = await axios.post(`${Route.Api.Product}?${searchParamsUrl}`, $inputs, {
        signal: controller.signal,
      });

      const { message, data } = getProductResponseData(response.data);

      setProductStore(data);

      addToasts({
        type: "success",
        title: "Berhasil Menambahkan",
        description: message,
      });

      resetForm();

      closeDialog();
    } catch (error) {
      clientErrorHandler(error);
    }

    status = "idle";
  }
</script>

<Button
  text="Tambah Produk"
  textClass={clsx("text-sm font-semibold leading-none")}
  attr={{
    type: "button",
    class: clsx("w-auto h-9"),
    onclick: openDialog,
  }}
/>

{#if $dialogState === "open"}
  <div
    tabindex="-1"
    aria-hidden="true"
    class="fixed inset-0 z-50 cursor-pointer bg-black/20"
    onclick={closeDialog}
  ></div>

  <form
    use:dialog
    transition:fade={{
      duration: 300,
    }}
    id={dialogIds.dialog}
    role="dialog"
    aria-modal="true"
    aria-labelledby={dialogIds.title}
    class="fixed left-1/2 top-1/2 z-50 flex max-h-dvh w-[calc(100%_-_(1rem_*_2))] max-w-[40rem] -translate-x-1/2 -translate-y-1/2 flex-col items-start gap-4 overflow-auto rounded-lg bg-white px-4 py-6"
    onsubmit={(e) => {
      e.preventDefault();

      addProduct();
    }}
  >
    <div class="flex w-full items-center justify-between gap-1">
      <h3
        id={dialogIds.title}
        class="text-lg font-semibold leading-none"
      >
        Tambah Produk
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
      class="contents"
    >
      <Input
        bind:value={$inputs.name}
        label="Nama"
        errorMessages={$errors.name}
        attr={{
          type: "text",
          id: "name",
          name: "name",
          placeholder: "Nama",
          required: true,
          oninput: () => {
            validateInput("name");
          },
        }}
      />

      <div class={clsx("flex w-full items-start gap-x-4 gap-y-2", "max-sm:flex-col")}>
        <div class={clsx("w-full", "sm:w-[calc((100%_-_1rem)_/_2_*_0.4)] sm:shrink-0")}>
          <Input
            bind:value={$inputs.quantity}
            label="Jumlah"
            errorMessages={$errors.quantity}
            attr={{
              type: "number",
              min: 0,
              id: "quantity",
              name: "quantity",
              placeholder: "10",
              required: true,
              oninput: () => {
                validateInput("quantity");
              },
            }}
          />
        </div>

        <div class="contents">
          <Input
            bind:value={$inputs.buyPrice}
            label="Harga Beli"
            errorMessages={$errors.buyPrice}
            attr={{
              type: "number",
              min: 0,
              id: "buyPrice",
              name: "buyPrice",
              placeholder: "10000",
              required: true,
              oninput: () => {
                validateInput("buyPrice");
              },
            }}
          />

          <Input
            bind:value={$inputs.sellPrice}
            label="Harga Jual"
            errorMessages={$errors.sellPrice}
            attr={{
              type: "number",
              min: 0,
              id: "sellPrice",
              name: "sellPrice",
              placeholder: "15000",
              required: true,
              oninput: () => {
                validateInput("sellPrice");
              },
            }}
          />
        </div>
      </div>
    </div>

    <div class={clsx("flex w-full items-center justify-end gap-4", "max-sm:flex-col")}>
      <Button
        text="Batal"
        variant="outline"
        attr={{
          type: "button",
          class: clsx("sm:w-auto"),
          onclick: () => {
            closeDialog();
          },
        }}
      />

      <Button
        {status}
        text="Tambah"
        attr={{
          class: clsx("sm:w-auto"),
        }}
      />
    </div>
  </form>
{/if}
