import { defineConfig } from "vite";
import { fileURLToPath, URL } from "node:url";
import { comegenTokens } from "./src/vite.ts";

export default defineConfig({
  plugins: [
    // Mismo plugin que usa el dev: en build emite `dist/tokens.css` como asset
    // (sin tocar HTML). Es la única fuente de generación de tokens.
    comegenTokens({ output: "tokens.css", inject: false }),
  ],
  build: {
    outDir: "dist",
    emptyOutDir: true,
    lib: {
      entry: {
        index: fileURLToPath(new URL("src/index.ts", import.meta.url)),
        vite: fileURLToPath(new URL("src/vite.ts", import.meta.url)),
        "gandalf.config": fileURLToPath(new URL("src/gandalf.config.ts", import.meta.url)),
      },
      formats: ["es"],
      fileName: (_format, entryName) => `${entryName}.js`,
    },
    rollupOptions: {
      external: ["vue", /^@spicydogwings\/gandalf-tokens/],
    },
  },
});
