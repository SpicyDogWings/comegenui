import { fileURLToPath, URL } from "node:url";
import { defineConfig } from "vitest/config";
import vue from "@vitejs/plugin-vue";

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
  test: {
    environment: "jsdom",
    globals: true,
    include: ["src/**/*.test.ts"],
    // Limita los workers: sin esto vitest abre 1 fork por núcleo (12) y satura
    // la máquina en corridas largas (guard/mutation). Con 4 queda usable.
    // (minWorkers se quitó: en Vitest 4 ya no existe y rompía el type-check.)
    maxWorkers: 4,
  },
});
