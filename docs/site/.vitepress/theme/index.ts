import type { Theme } from "vitepress";
import DefaultTheme from "vitepress/theme";
import { initTokens } from "@/plugins/cu-tokens/css";
import Layout from "./Layout.vue";

export default {
  extends: DefaultTheme,
  Layout,
  enhanceApp() {
    // Inyecta los tokens CSS del tema activo (los componentes los consumen).
    // Solo en el cliente: usa `getComputedStyle`/`document`.
    if (typeof window !== "undefined") initTokens();
  },
} satisfies Theme;
