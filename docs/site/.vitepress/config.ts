import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { defineConfig } from "vitepress";
import { buildSidebar } from "./sidebar";
import shikiThemes from "./theme/shiki.gen.mjs";

const here = dirname(fileURLToPath(import.meta.url));
const repoRoot = resolve(here, "../../..");

const ROUTE_BASE = "/componentes";
// El nav/sidebar sale del frontmatter de `docs/site/componentes/*.md`.
const sidebar = buildSidebar(ROUTE_BASE);

export default defineConfig({
  title: "ComegenUI",
  description: "Componentes web de ComegenUI.",
  cleanUrls: true,
  // Syntax highlighting con la paleta CU (generado por cu-tokens).
  markdown: {
    theme: (shikiThemes as { vitepress: { light: unknown; dark: unknown } }).vitepress as never,
  },
  // Las fichas de la skill se incluyen tal cual en las páginas: sus links al
  // `SKILL.md` y al playground no existen como rutas del sitio.
  ignoreDeadLinks: [/SKILL/, /playground/],
  themeConfig: {
    nav: [
      { text: "Componentes", link: sidebar[0]?.items[0]?.link ?? ROUTE_BASE },
      { text: "Theme Builder", link: "/theme-builder" },
    ],
    sidebar,
  },
  vite: {
    resolve: {
      alias: {
        "@": resolve(repoRoot, "src"),
      },
    },
    server: { fs: { allow: [repoRoot] } },
  },
});
