// src/plugins/khadgar-docs/site.mjs — Sincroniza el sitio VitePress:
//   1. genera las fichas `.md` (canónicas + copia bajo el `srcDir` del sitio),
//   2. genera la config de VitePress (nav/sidebar),
//   3. genera el tema (tokens CU → VitePress).
//
// Se ejecuta con `tsx --tsconfig tsconfig.app.json` (importa módulos TS).
import { cpSync, existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { buildIndex } from "../khadgar/extract/index.mjs";
import { renderDoc } from "./render.mjs";
import { buildVitepressConfig } from "./vitepress.mjs";
import { buildThemesCss, buildVitePressBridgeCss, buildShikiThemes } from "./theme.mjs";
import { buildVanillaDocs } from "../khadgar-docs-vanilla/index.mjs";

const root = process.cwd();
const configPath = resolve(root, "khadgar.config.json");
const config = existsSync(configPath) ? JSON.parse(readFileSync(configPath, "utf-8")) : {};
const docs = config.docs ?? {};
const siteRoot = resolve(root, docs.site ?? "docs/site");
const vpDir = resolve(siteRoot, ".vitepress");
const themeDir = resolve(vpDir, "theme");

// 1. Fichas. Vue (fuente: el `.vue` real) → `cu-<tag>.md`; vanilla (custom
// element) → `cu-<tag>-vanilla.md`. Canónicas bajo `docsDir`, copia para el sitio.
const index = buildIndex({ root, config });
const docsDir = resolve(root, config.docsDir ?? "docs/skills/use-comegen", "componentes");
const siteDocsDir = resolve(siteRoot, "componentes");
mkdirSync(docsDir, { recursive: true });
mkdirSync(siteDocsDir, { recursive: true });

// `canonical` = ficha de la skill (vanilla/UMD). La ficha Vue siempre es copia
// del sitio.
function writeDoc(fileName, markdown, { canonical = false } = {}) {
  if (canonical) writeFileSync(resolve(docsDir, fileName), markdown);
  writeFileSync(resolve(siteDocsDir, fileName), markdown);
}

let written = 0;
for (const component of index.components) {
  if (!component.tag) continue;
  writeDoc(`${component.tag}.md`, renderDoc(component, { mode: "vue", backlink: null }));
  written++;
}
// La skill (canónica) documenta el uso vanilla/UMD: solo los `vanilla: true`.
// La canónica es `docsDir/cu-<tag>.md`; en el sitio va como `cu-<tag>-vanilla.md`
// para no chocar con la ficha Vue (`cu-<tag>.md`).
const vanillaDocs = buildVanillaDocs(root, config);
for (const doc of vanillaDocs) {
  writeFileSync(resolve(docsDir, `${doc.tag}.md`), doc.markdown);
  writeFileSync(resolve(siteDocsDir, `${doc.tag}-vanilla.md`), doc.markdown);
}

// 2. Config de VitePress + data completa para el tema.
mkdirSync(vpDir, { recursive: true });
const vitepressConfig = buildVitepressConfig(index, docs);
writeFileSync(resolve(vpDir, "khadgar.gen.json"), `${JSON.stringify(vitepressConfig, null, 2)}\n`);
writeFileSync(resolve(vpDir, "khadgar.json"), `${JSON.stringify(index, null, 2)}\n`);

// 3. Tema (tokens CU → VitePress). La fuente de verdad es `comegen.config.json`.
const cuConfigPath = resolve(root, "comegen.config.json");
const cuConfig = existsSync(cuConfigPath)
  ? JSON.parse(readFileSync(cuConfigPath, "utf-8"))
  : {};
mkdirSync(themeDir, { recursive: true });
writeFileSync(resolve(themeDir, "themes.gen.css"), buildThemesCss(cuConfig));
writeFileSync(resolve(themeDir, "vitepress.gen.css"), buildVitePressBridgeCss());

// Tema de syntax highlighting (Shiki) generado por `cu-tokens`. El `.mjs` lleva
// los temas resueltos (no re-ejecuta el plugin en el config de VitePress).
writeFileSync(
  resolve(themeDir, "shiki.gen.mjs"),
  `// Generado por khadgar-docs desde comegen.config.json. No editar.\nexport default ${JSON.stringify(buildShikiThemes(cuConfig), null, 2)}\n`,
);

// El runtime de `cu-tokens` (ThemeBuilder) lee `/comegen.config.json`.
const publicDir = resolve(siteRoot, "public");
mkdirSync(publicDir, { recursive: true });
writeFileSync(resolve(publicDir, "comegen.config.json"), `${JSON.stringify(cuConfig, null, 2)}\n`);

// Assets estáticos del consumidor (imágenes, favicons) → public del sitio.
const repoPublic = resolve(root, "public");
for (const asset of ["img", "comegen.ico", "favicon.ico"]) {
  const from = resolve(repoPublic, asset);
  if (existsSync(from)) cpSync(from, resolve(publicDir, asset), { recursive: true });
}

console.log(
  `khadgar-docs: ${written} fichas + config/tema de VitePress en ${docs.site ?? "docs/site"}`,
);
