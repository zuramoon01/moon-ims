import type { DialogState } from "$lib/types";
import { generateId, getFocusableElements } from "$lib/utils";
import { writable } from "svelte/store";

export function createDialogStore() {
  const dialogState = writable<DialogState>("close");

  function openDialog() {
    dialogState.set("open");
  }

  function closeDialog() {
    dialogState.set("close");
  }

  const dialogIds = {
    dialog: generateId(),
    title: generateId(),
    description: generateId(),
  };

  const focusHandler: {
    defaultIndex: number;
    elements: HTMLElement[];
  } = {
    defaultIndex: 0,
    elements: [],
  };

  function dialog(node: HTMLElement) {
    focusHandler.elements = getFocusableElements(node);

    const handleKeyDown = (e: KeyboardEvent) => {
      e.stopPropagation();

      if (e.shiftKey || e.key === "Tab" || e.key === "Escape") {
        const { defaultIndex, elements } = focusHandler;

        if (e.shiftKey && e.key === "Tab") {
          e.preventDefault();

          const activeElementIndex = elements.findIndex((el) => el === document.activeElement);
          const nextIndex =
            activeElementIndex === -1
              ? 0
              : activeElementIndex <= 0
                ? elements.length - 1
                : activeElementIndex - 1;

          elements[nextIndex].focus();
        } else if (e.key === "Tab") {
          e.preventDefault();

          const activeElementIndex = elements.findIndex((el) => el === document.activeElement);

          const nextIndex =
            activeElementIndex === -1
              ? defaultIndex
              : activeElementIndex < elements.length - 1
                ? activeElementIndex + 1
                : 0;

          elements[nextIndex].focus();
        } else if (e.key === "Escape") {
          e.preventDefault();

          closeDialog();
        }
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    $effect(() => {
      return () => {
        document.removeEventListener("keydown", handleKeyDown);
      };
    });
  }

  function contentDialog(node: HTMLElement) {
    const elements = getFocusableElements(node);

    $effect(() => {
      if (elements.length > 0) {
        elements[0].focus();

        focusHandler.defaultIndex = focusHandler.elements.findIndex(
          (el) => el === document.activeElement,
        );
      }
    });
  }

  return {
    dialogState,
    dialogIds,
    openDialog,
    closeDialog,
    dialog,
    contentDialog,
  };
}
