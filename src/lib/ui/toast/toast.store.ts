import { generateId } from "$lib/utils";
import { derived, readonly, writable } from "svelte/store";

type Toast = {
  title: "Success" | "Warning" | "Error";
  description: string;
  closeDelay?: number;
};

type ToastData = {
  id: string;
  ids: {
    alert: string;
    title: string;
    description: string;
  };
  content: {
    title: Toast["title"];
    description: Toast["description"];
  };
  closeDelay: number;
  timeout?: number;
  pausedAt?: number;
  createdAt: number;
};

function createToastStore() {
  const toastStore = writable<Map<string, ToastData>>(new Map());

  function generateToastData({ title, description, closeDelay = 3000 }: Toast): ToastData {
    const toastId = generateId();

    return {
      id: toastId,
      ids: {
        alert: generateId(),
        title: generateId(),
        description: generateId(),
      },
      content: {
        title,
        description,
      },
      closeDelay,
      timeout:
        closeDelay === 0
          ? undefined
          : window.setTimeout(() => {
              removeToast(toastId);
            }, closeDelay),
      createdAt: performance.now(),
    };
  }

  function addToast(toast: Toast) {
    toastStore.update((currentState) => {
      const toastData = generateToastData(toast);

      currentState.set(toastData.id, toastData);

      return currentState;
    });
  }

  function addToasts(toasts: Toast[]) {
    toastStore.update((currentState) => {
      currentState.clear();

      toasts.forEach((toast) => {
        const toastData = generateToastData(toast);

        currentState.set(toastData.id, toastData);
      });

      return currentState;
    });
  }

  function pauseToast(toastId: ToastData["id"]) {
    toastStore.update((currentState) => {
      const toast = currentState.get(toastId);

      if (!toast || !toast.timeout) {
        return currentState;
      }

      toast.pausedAt = performance.now();

      window.clearTimeout(toast.timeout);

      currentState.set(toastId, toast);

      return currentState;
    });
  }

  function resumeToast(toastId: ToastData["id"]) {
    toastStore.update((currentState) => {
      const toast = currentState.get(toastId);

      if (!toast || !toast.timeout) {
        return currentState;
      }

      toast.pausedAt ??= toast.createdAt;
      const elapsedTime = toast.pausedAt - toast.createdAt;
      const remainingTime = toast.closeDelay - elapsedTime;

      toast.timeout = window.setTimeout(() => {
        removeToast(toastId);
      }, remainingTime);

      toast.pausedAt = undefined;

      currentState.set(toastId, toast);

      return currentState;
    });
  }

  function removeToast(toastId: ToastData["id"]) {
    toastStore.update((currentState) => {
      // Gak perlu clearTimeout
      // Garbage collection bakal menghapus timeoutnya sendiri

      currentState.delete(toastId);

      return currentState;
    });
  }

  const toasts = readonly(
    derived(toastStore, ($toastStore) => {
      return Array.from($toastStore.values());
    }),
  );

  return {
    toasts,
    addToast,
    addToasts,
    pauseToast,
    resumeToast,
    removeToast,
  };
}

export const { addToast, addToasts, ...toastStore } = createToastStore();
