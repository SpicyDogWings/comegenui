import { existsSync, readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { defineConfig } from "vitepress";
import shikiThemes from "./theme/shiki.gen.mjs";

// La config del sitio (nav/sidebar/componentes) la genera khadgar-docs en
// `khadgar.gen.json`. Este archivo solo la consume.
const here = dirname(fileURLToPath(import.meta.url));
const repoRoot = resolve(here, "../../..");
const genPath = resolve(here, "khadgar.gen.json");

interface Generated {
  title: string;
  description: string;
  routeBase: string;
  nav: unknown[];
  sidebar: unknown[];
  components: { tag: string; name: string; group: string }[];
}

const generated: Generated = existsSync(genPath)
  ? JSON.parse(readFileSync(genPath, "utf-8"))
  : {
      title: "ComegenUI",
      description: "",
      routeBase: "/componentes",
      nav: [],
      sidebar: [],
      components: [],
    };

if (!existsSync(genPath)) {
  console.warn(
    "[khadgar] Falta docs/site/.vitepress/khadgar.gen.json (nav/sidebar vacíos). " +
      "Corré `pnpm site:sync` o `pnpm dev`.",
  );
}

export default defineConfig({
  title: generated.title,
  description: generated.description,
  cleanUrls: true,
  // Syntax highlighting con la paleta CU (generado por cu-tokens).
  markdown: {
    theme: (shikiThemes as { vitepress: { light: unknown; dark: unknown } }).vitepress as never,
  },
  // Las fichas son compartidas con la skill: `../SKILL.md` y links al playground
  // no existen como páginas del sitio (todavía).
  ignoreDeadLinks: [/SKILL/, /playground/],
  themeConfig: {
    nav: generated.nav,
    sidebar: generated.sidebar,
  },
  vite: {
    resolve: {
      alias: {
        "@": resolve(repoRoot, "src"),
        "#khadgar-data": resolve(here, "khadgar.json"),
      },
    },
    server: { fs: { allow: [repoRoot] } },
  },
  transformPageData(pageData) {
    const match = /componentes\/(cu-[\w-]+)\.md$/.exec(pageData.relativePath);
    if (!match) return;
    const component = generated.components.find((item) => item.tag === match[1]);
    if (!component) return;
    return { frontmatter: { ...pageData.frontmatter, demo: component.name } };
  },
});
