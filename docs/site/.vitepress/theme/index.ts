import type { Theme } from "vitepress";
import DefaultTheme from "vitepress/theme";
// Generados por khadgar-docs: tokens de ComegenUI + puente `--vp-*` → `--cu-*`.
import "./themes.gen.css";
import "./vitepress.gen.css";
import Layout from "./Layout.vue";

export default {
  extends: DefaultTheme,
  Layout,
} satisfies Theme;
