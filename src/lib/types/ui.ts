import type { ComponentType } from "svelte";
import type { Icon } from "lucide-svelte";

export type Class = string | null | undefined;
export type IconComponent = ComponentType<Icon>;
