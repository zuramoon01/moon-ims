// import adapter from "@sveltejs/adapter-auto";
import adapter from "@sveltejs/adapter-vercel";
import { vitePreprocess } from "@sveltejs/vite-plugin-svelte";

/** @type {import('@sveltejs/kit').Config} */
const config = {
  // Consult https://svelte.dev/docs/kit/integrations#preprocessors
  // for more information about preprocessors
  preprocess: vitePreprocess(),
  kit: {
    // adapter-auto only supports some environments, see https://svelte.dev/docs/kit/adapter-auto for a list.
    // If your environment is not supported, or you settled on a specific environment, switch out the adapter.
    // See https://svelte.dev/docs/kit/adapters for more information about adapters.
    adapter: adapter({
      runtime: "nodejs20.x",
    }),
  },
  csp: {
    directives: {
      "default-src": ["self"],
      "font-src": ["https://fonts.googleapis.com/"],
    },
    reportOnly: {
      "script-src": ["self"],
      "report-uri": ["/"],
    },
  },
};

export default config;
