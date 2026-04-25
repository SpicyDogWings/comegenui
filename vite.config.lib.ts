import { fileURLToPath } from "node:url";
import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import UnoCSS from "unocss/vite";

export default defineConfig({
  define: {
    "process.env.NODE_ENV": JSON.stringify("production"),
  },
  plugins: [
    UnoCSS({
      mode: "shadow-dom",
    }),
    vue({
      features: {
        customElement: true,
      },
    }),
  ],
  build: {
    minify: false,
    lib: {
      entry: fileURLToPath(
        new URL("./src/components/Button.ts", import.meta.url),
      ),
      name: "comengenButton",
      fileName: "cuButton",
      formats: ["umd", "es", "iife"],
    },
    rollupOptions: {
      output: {},
    },
  },
});
