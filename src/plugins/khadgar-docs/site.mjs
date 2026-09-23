// src/plugins/khadgar-docs/site.mjs — Sincroniza el sitio VitePress:
//   1. genera las fichas `.md` (canónicas + copia bajo el `srcDir` del sitio),
//   2. genera la config de VitePress (nav/sidebar),
//   3. genera el tema (tokens CU → VitePress).
//
// Se ejecuta con `tsx --tsconfig tsconfig.app.json` (importa módulos TS).
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { buildIndex } from "../khadgar/extract/index.mjs";
import { renderDoc } from "./render.mjs";
import { buildVitepressConfig } from "./vitepress.mjs";
import { buildThemesCss, buildVitePressBridgeCss } from "./theme.mjs";

const root = process.cwd();
const configPath = resolve(root, "khadgar.config.json");
const config = existsSync(configPath) ? JSON.parse(readFileSync(configPath, "utf-8")) : {};
const docs = config.docs ?? {};
const siteRoot = resolve(root, docs.site ?? "docs/site");
const vpDir = resolve(siteRoot, ".vitepress");
const themeDir = resolve(vpDir, "theme");

// 1. Fichas (fuente: el SFC que distribuye la lib).
const index = buildIndex({ root, config, source: "lib" });
const docsDir = resolve(root, config.docsDir ?? "docs/skills/use-comegen", "componentes");
const siteDocsDir = resolve(siteRoot, "componentes");
let written = 0;
for (const component of index.components) {
  if (!component.tag) continue;
  const markdown = renderDoc(component);
  mkdirSync(docsDir, { recursive: true });
  writeFileSync(resolve(docsDir, `${component.tag}.md`), markdown);
  mkdirSync(siteDocsDir, { recursive: true });
  writeFileSync(resolve(siteDocsDir, `${component.tag}.md`), markdown);
  written++;
}

// 2. Config de VitePress + data completa para el tema.
mkdirSync(vpDir, { recursive: true });
const vitepressConfig = buildVitepressConfig(index, docs);
writeFileSync(resolve(vpDir, "khadgar.gen.json"), `${JSON.stringify(vitepressConfig, null, 2)}\n`);
writeFileSync(resolve(vpDir, "khadgar.json"), `${JSON.stringify(index, null, 2)}\n`);

// 3. Tema (tokens CU → VitePress).
mkdirSync(themeDir, { recursive: true });
writeFileSync(resolve(themeDir, "themes.gen.css"), buildThemesCss());
writeFileSync(resolve(themeDir, "vitepress.gen.css"), buildVitePressBridgeCss());

console.log(
  `khadgar-docs: ${written} fichas + config/tema de VitePress en ${docs.site ?? "docs/site"}`,
);
