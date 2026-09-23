import type { Theme } from "vitepress";
import DefaultTheme from "vitepress/theme";
import { createPinia } from "pinia";
import CuTokens from "@/plugins/cu-tokens";
// Generados por khadgar-docs: tokens de ComegenUI + puente `--vp-*` → `--cu-*`.
import "./themes.gen.css";
import "./vitepress.gen.css";
import Layout from "./Layout.vue";

export default {
  extends: DefaultTheme,
  Layout,
  enhanceApp({ app }) {
    app.use(createPinia());
    // El runtime de temas (ThemeBuilder) usa localStorage/document → solo cliente.
    if (typeof window !== "undefined") app.use(CuTokens);
  },
} satisfies Theme;
