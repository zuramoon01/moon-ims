import type { User } from "$lib/features/user";
import { writable } from "svelte/store";

export const user = writable<User | null>(null);
