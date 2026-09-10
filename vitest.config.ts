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
    reporters: ["default", "./tools/reporters/playground-reporter.ts"],
    projects: [
      {
        extends: true,
        test: {
          name: "l1",
          environment: "jsdom",
          globals: true,
          include: ["src/**/*.test.ts"],
        },
      },
    ],
  },
});
