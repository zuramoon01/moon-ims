<script lang="ts">
  import { page } from "$app/stores";
  import {
    buyPriceSchema,
    getProductResponseData,
    nameSchema,
    productStore,
    quantitySchema,
    sellPriceSchema,
  } from "$lib/features/product";
  import type { DialogState, State } from "$lib/types";
  import { addToast, Button, Input } from "$lib/ui";
  import { clientErrorHandler, generateId, rupiahCurrency } from "$lib/utils";
  import axios from "axios";
  import clsx from "clsx";
  import { X } from "lucide-svelte";
  import { fade } from "svelte/transition";
  import { flatten, safeParse } from "valibot";

  let state: DialogState = "close";
  function openDialog() {
    state = "open";
  }
  function closeDialog() {
    state = "close";
  }

  const ids = {
    dialog: generateId(),
    title: generateId(),
  };

  let currentFocusIndexElement = 0;
  let listFocusableElement: HTMLElement[] = [];
  function productDialog(node: HTMLElement) {
    listFocusableElement = Array.from(
      node.querySelectorAll(
        'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"]):not([disabled]), details:not([disabled]), summary:not(:disabled)',
      ),
    );
  }
  function handleKeydownDialog(
    e: KeyboardEvent & {
      currentTarget: EventTarget & HTMLFormElement;
    },
  ) {
    if (e.key === "Tab" || e.key === "Escape") {
      e.preventDefault();

      if (e.shiftKey && e.key === "Tab") {
        currentFocusIndexElement =
          currentFocusIndexElement <= 0
            ? listFocusableElement.length - 1
            : currentFocusIndexElement - 1;

        listFocusableElement[currentFocusIndexElement].focus();
      } else if (e.key === "Tab") {
        currentFocusIndexElement =
          currentFocusIndexElement < listFocusableElement.length - 1
            ? currentFocusIndexElement + 1
            : 0;

        listFocusableElement[currentFocusIndexElement].focus();
      } else if (e.key === "Escape") {
        closeDialog();
      }
    }
  }

  $: ({ setProductStore } = productStore);

  let submitState: State = "idle";
  let submitController: AbortController;

  const inputs = {
    name: "",
    quantity: "",
    buyPrice: "",
    sellPrice: "",
  };
  const validations = {
    name: nameSchema,
    quantity: quantitySchema,
    buyPrice: buyPriceSchema,
    sellPrice: sellPriceSchema,
  } as const;
  const errors: {
    name: string[];
    quantity: string[];
    buyPrice: string[];
    sellPrice: string[];
  } = {
    name: [],
    quantity: [],
    buyPrice: [],
    sellPrice: [],
  };

  function validateInput(id: keyof typeof inputs) {
    const { issues } = safeParse(validations[id], inputs[id]);

    errors[id] = issues ? flatten(issues).root || [] : [];
  }

  async function addProduct() {
    try {
      if (
        errors.name.length > 0 ||
        errors.quantity.length > 0 ||
        errors.buyPrice.length > 0 ||
        errors.sellPrice.length > 0
      ) {
        addToast({
          title: "Warning",
          description: "Silahkan isi form tambah produk sesuai dengan ketentuan yang diberikan.",
        });

        return;
      }

      if (submitState === "loading" && submitController) {
        submitController.abort();
      }

      submitState = "loading";

      submitController = new AbortController();

      const searchParamsUrl = $page.url.searchParams.toString();

      const response = await axios.post(`/api/products?${searchParamsUrl}`, inputs, {
        signal: submitController.signal,
      });

      const data = getProductResponseData(response.data);

      if (!data) {
        return addToast({
          title: "Warning",
          description: "Payload tidak sesuai.",
        });
      }

      setProductStore(data.data);

      addToast({
        title: "Success",
        description: data.message,
      });

      inputs.name = "";
      inputs.quantity = "";
      inputs.buyPrice = "";
      inputs.sellPrice = "";

      submitState = "idle";

      closeDialog();
    } catch (error) {
      clientErrorHandler(error);

      if (!axios.isCancel(error)) {
        submitState = "idle";
      }
    }
  }
</script>

<Button
  text="Tambah Produk"
  textClass={clsx("text-sm font-semibold leading-none")}
  attr={{
    type: "button",
    class: clsx("w-auto h-9"),
  }}
  on:click={openDialog}
/>

{#if state === "open"}
  <div
    tabindex="-1"
    aria-hidden="true"
    class="fixed inset-0 z-50 cursor-pointer bg-black/20"
    on:click={() => {
      closeDialog();
    }}
  ></div>

  <!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
  <form
    use:productDialog
    transition:fade={{
      duration: 300,
    }}
    id={ids.dialog}
    role="dialog"
    aria-modal="true"
    aria-labelledby={ids.title}
    class={clsx(
      "fixed left-1/2 top-1/2 z-50 flex max-h-dvh w-[calc(100%_-_(1rem_*_2))] max-w-[40rem] -translate-x-1/2 -translate-y-1/2 flex-col items-start gap-4 overflow-auto rounded-lg bg-white px-4 py-6",
    )}
    on:submit|preventDefault={addProduct}
    on:keydown={handleKeydownDialog}
  >
    <div class="flex w-full items-center justify-between gap-1">
      <h3
        id={ids.title}
        class="text-lg font-semibold leading-none"
      >
        Tambah Produk
      </h3>

      <Button
        Icon={X}
        iconClass={clsx("size-[1.125rem]")}
        variant="ghost"
        attr={{
          type: "button",
          class: clsx("size-auto p-1 shrink-0"),
        }}
        on:click={() => {
          closeDialog();
        }}
      />
    </div>

    <div class="contents">
      <Input
        bind:value={inputs.name}
        on:input={() => {
          validateInput("name");
        }}
        label="Nama"
        errorMessages={errors.name}
        attr={{
          type: "text",
          id: "name",
          name: "name",
          placeholder: "Nama",
          required: true,
        }}
      />

      <div class={clsx("flex w-full items-start gap-x-4 gap-y-2", "max-sm:flex-col")}>
        <div class={clsx("w-full", "sm:w-[calc((100%_-_1rem)_/_2_*_0.4)] sm:shrink-0")}>
          <Input
            bind:value={inputs.quantity}
            on:input={() => {
              validateInput("quantity");
            }}
            label="Jumlah"
            errorMessages={errors.quantity}
            attr={{
              type: "number",
              id: "quantity",
              name: "quantity",
              placeholder: "10",
              required: true,
            }}
          />
        </div>

        <div class="contents">
          <Input
            bind:value={inputs.buyPrice}
            on:input={() => {
              validateInput("buyPrice");
            }}
            label="Harga Beli"
            errorMessages={errors.buyPrice}
            attr={{
              type: "number",
              id: "buyPrice",
              name: "buyPrice",
              placeholder: rupiahCurrency.format(10000),
              required: true,
            }}
          />

          <Input
            bind:value={inputs.sellPrice}
            on:input={() => {
              validateInput("sellPrice");
            }}
            label="Harga Jual"
            errorMessages={errors.sellPrice}
            attr={{
              type: "number",
              id: "sellPrice",
              name: "sellPrice",
              placeholder: rupiahCurrency.format(15000),
              required: true,
            }}
          />
        </div>
      </div>
    </div>

    <div class={clsx("flex w-full items-center justify-end gap-4", "max-sm:flex-col")}>
      <Button
        text="Batalkan"
        variant="outline"
        attr={{
          type: "button",
          class: clsx("sm:w-auto"),
        }}
        on:click={() => {
          closeDialog();
        }}
      />

      <Button
        state={submitState}
        text="Tambah"
        attr={{
          class: clsx("sm:w-auto"),
        }}
      />
    </div>
  </form>
{/if}
