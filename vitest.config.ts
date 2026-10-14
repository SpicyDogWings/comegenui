import { fileURLToPath, URL } from "node:url";
import { defineConfig } from "vitest/config";
import vue from "@vitejs/plugin-vue";

// Vapor Mode (Vue 3.6+): mismo switch que `build-lib.ts`. `COMEGEN_VAPOR=1`
// compila los SFC en Vapor para poder probar componentes/experimentos en ese
// modo. Apagado por defecto (VDOM). Ver `docs/notes/10-vapor-mode.md`.
const VAPOR = process.env.COMEGEN_VAPOR === "1";

export default defineConfig({
  plugins: [vue({ features: { vapor: VAPOR } })],
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
