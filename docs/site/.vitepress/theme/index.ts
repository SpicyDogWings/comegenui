import type { Theme } from "vitepress";
import DefaultTheme from "vitepress/theme";
import { createPinia } from "pinia";
import { nextTick, watch } from "vue";
import CuTokens, { loaded as cuLoaded, theme as cuTheme } from "@/plugins/cu-tokens";
// Generados por khadgar-docs: tokens de ComegenUI + puente `--vp-*` → `--cu-*`.
import "./themes.gen.css";
import "./vitepress.gen.css";
import Layout from "./Layout.vue";

// VitePress decide `--shiki-light` / `--shiki-dark` (y sus propias vars) por la
// clase `html.dark`, no por `data-theme`. Como `buildThemesCss` define
// `html.dark` como alias del tema CU `dark`, acá se mantiene esa equivalencia:
// `.dark` está activo sí y solo sí el tema activo es `dark`.
function syncDarkClass() {
  document.documentElement.classList.toggle("dark", cuTheme.value === "dark");
}

export default {
  extends: DefaultTheme,
  Layout,
  enhanceApp({ app }) {
    app.use(createPinia());
    // El runtime de temas (ThemeBuilder) usa localStorage/document → solo cliente.
    if (typeof window !== "undefined") {
      app.use(CuTokens);
      watch([cuLoaded, cuTheme], () => nextTick(syncDarkClass), { immediate: true });
      window.addEventListener("load", () => nextTick(syncDarkClass));
    }
  },
} satisfies Theme;
