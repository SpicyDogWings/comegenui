import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import { fileURLToPath, URL } from "node:url";

export default defineConfig({
  plugins: [vue()],
  build: {
    outDir: "dist",
    emptyOutDir: true,
    lib: {
      entry: { index: fileURLToPath(new URL("src/index.ts", import.meta.url)) },
      formats: ["es"],
      fileName: (_format, entryName) => `${entryName}.js`,
      cssFileName: "style",
    },
    rollupOptions: {
      external: ["vue", "reka-ui"],
    },
  },
});
