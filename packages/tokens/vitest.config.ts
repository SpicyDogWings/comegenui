import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "jsdom",
    include: ["src/**/*.test.ts"],
    // El paquete solo re-exporta el composable de gandalf y el preset de Vite;
    // su comportamiento se prueba upstream (gandalf).
    passWithNoTests: true,
  },
});
