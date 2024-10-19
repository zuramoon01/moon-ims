import type { Config } from "tailwindcss";
import defaultTheme from "tailwindcss/defaultTheme";

export default {
  content: ["./src/**/*.{html,js,svelte,ts}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", ...defaultTheme.fontFamily.sans],
      },
      colors: {
        black: "#0A0A0A",
        white: "#F5F5F5",
        red: "#F50A0A",
        yellow: "#F5F50A",
        green: "#0AF50A",
        blue: "#0A0AF5",
      },
    },
  },
} satisfies Config;
