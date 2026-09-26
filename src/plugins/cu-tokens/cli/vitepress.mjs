// src/plugins/cu-tokens/cli/vitepress.mjs — Genera el tema de VitePress a partir
// de los tokens de ComegenUI (fuente de verdad: `comegen.config.json`):
//   - `themes.gen.css` (los temas CU con los selectores que VitePress entiende),
//   - `vitepress.gen.css` (puente `--vp-*` → `--cu-*`),
//   - `shiki.gen.mjs` (tema de syntax highlighting),
//   - `public/comegen.config.json` (lo que el runtime de `cu-tokens` fetchea),
//   - los assets estáticos del consumidor (imágenes, favicons) → `public/`.
//
// Uso:
//   tsx --tsconfig tsconfig.app.json src/plugins/cu-tokens/cli/vitepress.mjs [--site docs/site]
import { cpSync, existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { buildThemesCss, buildVitePressBridgeCss, buildShikiThemes } from "../vitepress.ts";

const argv = process.argv.slice(2);
let site = "docs/site";
for (let i = 0; i < argv.length; i++) {
  const arg = argv[i];
  if (arg === "--site") site = argv[++i];
  else if (arg === "--help" || arg === "-h") {
    console.log("cu-tokens vitepress [--site <dir>]");
    process.exit(0);
  }
}

const root = process.cwd();
const siteRoot = resolve(root, site);
const themeDir = resolve(siteRoot, ".vitepress", "theme");
const publicDir = resolve(siteRoot, "public");

const cuConfigPath = resolve(root, "comegen.config.json");
const cuConfig = existsSync(cuConfigPath) ? JSON.parse(readFileSync(cuConfigPath, "utf-8")) : {};

mkdirSync(themeDir, { recursive: true });
writeFileSync(resolve(themeDir, "themes.gen.css"), buildThemesCss(cuConfig));
writeFileSync(resolve(themeDir, "vitepress.gen.css"), buildVitePressBridgeCss());
writeFileSync(
  resolve(themeDir, "shiki.gen.mjs"),
  `// Generado por cu-tokens desde comegen.config.json. No editar.\nexport default ${JSON.stringify(buildShikiThemes(cuConfig), null, 2)}\n`,
);

// El runtime de `cu-tokens` (ThemeBuilder) lee `/comegen.config.json`.
mkdirSync(publicDir, { recursive: true });
writeFileSync(resolve(publicDir, "comegen.config.json"), `${JSON.stringify(cuConfig, null, 2)}\n`);

// Assets estáticos del consumidor (imágenes, favicons) → public del sitio.
const repoPublic = resolve(root, "public");
for (const asset of ["img", "comegen.ico", "favicon.ico"]) {
  const from = resolve(repoPublic, asset);
  if (existsSync(from)) cpSync(from, resolve(publicDir, asset), { recursive: true });
}

console.log(`cu-tokens: tema + assets de VitePress en ${site}`);
