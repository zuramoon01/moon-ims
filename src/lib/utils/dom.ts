import { FOCUSABLE_ELEMENTS_SELECTOR } from "$lib/stores";

export function getFocusableElements(node: HTMLElement): HTMLElement[] {
  return Array.from(node.querySelectorAll(FOCUSABLE_ELEMENTS_SELECTOR));
}
