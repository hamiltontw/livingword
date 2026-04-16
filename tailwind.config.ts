import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./content/**/*.{json,md,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        paper: {
          DEFAULT: "#faf7f1",
          deep: "#f2ecdf",
          warm: "#efe8d7",
        },
        ink: {
          DEFAULT: "#1a1614",
          soft: "#3c332c",
          muted: "#6b5f52",
          faint: "#9b8e7e",
        },
        accent: {
          DEFAULT: "#8a6d3b",
          deep: "#6b5326",
          soft: "#c9a66b",
        },
        rule: "#e6dcc7",
      },
      fontFamily: {
        serif: [
          "var(--font-serif)",
          "EB Garamond",
          "Crimson Pro",
          "Georgia",
          "serif",
        ],
        sans: [
          "var(--font-sans)",
          "Inter",
          "ui-sans-serif",
          "system-ui",
          "sans-serif",
        ],
        arabic: ["Amiri", "Scheherazade New", "Traditional Arabic", "serif"],
      },
      maxWidth: {
        prose: "38rem",
        reader: "44rem",
      },
      letterSpacing: {
        wide2: "0.08em",
      },
    },
  },
  plugins: [],
};

export default config;
