import { sveltekit } from "@sveltejs/kit/vite";
import type { UserConfig } from "vitest/config";

export default {
  plugins: [sveltekit()],
  test: {
    include: ["src/**/*.{test,spec}.{js,ts}"],
  },
} satisfies UserConfig;
