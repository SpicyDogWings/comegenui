import type { Theme } from "vitepress";
import DefaultTheme from "vitepress/theme";
import { createPinia } from "pinia";
import { nextTick, watch } from "vue";
import CuTokens, { loaded as cuLoaded, theme as cuTheme } from "@/plugins/cu-tokens";
// Generados por cu-tokens: tokens de ComegenUI + puente `--vp-*` → `--cu-*`.
import "./themes.gen.css";
import "./vitepress.gen.css";
// Helpers de layout para los demos en vivo de las fichas.
import "./demos.css";
import Layout from "./Layout.vue";
import ComegenDemo from "./ComegenDemo.vue";
import VanillaDemo from "./VanillaDemo.vue";

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
    // Demos reales de la doc vanilla: `<!-- demo:id -->` → <ComegenDemo>, que
    // carga los custom elements del build `esm-shared`.
    app.component("ComegenDemo", ComegenDemo);
    app.component("VanillaDemo", VanillaDemo);
    // El runtime de temas (ThemeBuilder) usa localStorage/document → solo cliente.
    if (typeof window !== "undefined") {
      app.use(CuTokens);
      watch([cuLoaded, cuTheme], () => nextTick(syncDarkClass), { immediate: true });
      window.addEventListener("load", () => nextTick(syncDarkClass));
    }
  },
} satisfies Theme;
