import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import { comegenTokens } from "@comegenui/tokens/vite";
import { fileURLToPath, URL } from "node:url";

export default defineConfig({
  root: fileURLToPath(new URL(".", import.meta.url)),
  plugins: [
    // Tokens de @comegenui/tokens (gandalf preconfigurado). En dev sirve
    // `/tokens.css`; no escribe el archivo estático del paquete.
    comegenTokens({ output: "tokens.css" }),
    vue(),
  ],
});
