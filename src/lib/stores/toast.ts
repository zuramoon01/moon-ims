import { generateId } from "$lib/utils";
import { derived, readonly, writable } from "svelte/store";

type ToastType = "info" | "success" | "warning" | "error";

interface ToastData {
  type: ToastType;
  title: string;
  description: string;
  closeDelay?: number;
}

interface ToastIds {
  toast: string;
  title: string;
  description: string;
}

interface ToastContent {
  type: ToastData["type"];
  title: ToastData["title"];
  description: ToastData["description"];
}

interface Toast {
  id: string;
  ids: ToastIds;
  content: ToastContent;
  closeDelay: number;
  timeout?: number;
  pausedAt?: number;
  createdAt: number;
}

const DEFAULT_DELAY = 3000;

function createToastStore() {
  const toastStore = writable<Map<Toast["id"], Toast>>(new Map());

  function generateToast(toastData: ToastData): Toast {
    const { type, title, description, closeDelay = DEFAULT_DELAY } = toastData;

    const id = generateId();

    const ids = {
      toast: generateId(),
      title: generateId(),
      description: generateId(),
    };

    const content = {
      type,
      title,
      description,
    };

    const timeout =
      closeDelay > 0
        ? window.setTimeout(() => {
            removeToast(id);
          }, closeDelay)
        : undefined;

    const createdAt = performance.now();

    return {
      id,
      ids,
      content,
      closeDelay,
      timeout,
      createdAt,
    };
  }

  function addToasts(toastData: ToastData | ToastData[]) {
    if (!Array.isArray(toastData)) {
      toastData = [toastData];
    }

    toastStore.update((currentStore) => {
      toastData.forEach((data) => {
        const toast = generateToast(data);

        currentStore.set(toast.id, toast);
      });

      return currentStore;
    });
  }

  function pauseToast(toastId: Toast["id"]) {
    toastStore.update((currentStore) => {
      const toast = currentStore.get(toastId);

      if (toast?.timeout) {
        window.clearTimeout(toast.timeout);

        toast.pausedAt = performance.now();

        currentStore.set(toast.id, toast);
      }

      return currentStore;
    });
  }

  function resumeToast(toastId: Toast["id"]) {
    toastStore.update((currentStore) => {
      const toast = currentStore.get(toastId);

      if (toast?.timeout) {
        toast.pausedAt ??= toast.createdAt;

        const elapsedTime = toast.pausedAt - toast.createdAt;
        const remainingTime = toast.closeDelay - elapsedTime;

        toast.timeout = window.setTimeout(() => {
          removeToast(toast.id);
        }, remainingTime);

        toast.pausedAt = undefined;

        currentStore.set(toast.id, toast);
      }

      return currentStore;
    });
  }

  function removeToast(toastId: Toast["id"]) {
    toastStore.update((currentStore) => {
      const toast = currentStore.get(toastId);

      if (toast?.timeout) {
        window.clearTimeout(toast.timeout);
      }

      currentStore.delete(toastId);

      return currentStore;
    });
  }

  const toasts = readonly(derived(toastStore, ($toastStore) => [...$toastStore.values()]));

  return {
    toasts,
    addToasts,
    pauseToast,
    resumeToast,
    removeToast,
  };
}

export const { addToasts, ...toastStore } = createToastStore();
