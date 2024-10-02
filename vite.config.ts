import type { UserConfig } from "vitest/config";
import { sveltekit } from "@sveltejs/kit/vite";

export default {
  plugins: [sveltekit()],
  test: {
    include: ["src/**/*.{test,spec}.{js,ts}"],
  },
} satisfies UserConfig;
