import type { Config } from "tailwindcss";

export default {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        highlight: "#E6FF27",
      },
      maskImage: {
        "fade-bottom": "linear-gradient(to bottom, black, transparent)",
      },
    },
  },
  plugins: [],
} satisfies Config;
