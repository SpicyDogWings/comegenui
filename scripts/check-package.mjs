#!/usr/bin/env node
// scripts/check-package.mjs — Gate del PAQUETE npm (superficie Vue).
//
// El baseline de contratos (`contract.mjs`) es de custom elements; este paso
// cubre lo que ese no mira: el empaquetado que produce `build:npm` en `dist-vue/`.
//
// Valida:
//   1. están los artefactos que viajan al tarball;
//   2. el package.json publicable trae lo que el consumidor necesita
//      (name, exports['.'], types, peerDependencies.vue, sideEffects);
//   3. el bundle importa y expone EXACTAMENTE los componentes declarados en
//      `src/index.ts` (más `default` y `initTokens`);
//   4. no se colaron fuentes (`.vue`/`.ts`) ni carpetas intermedias.
//
// Uso: node scripts/check-package.mjs
import { readFileSync, readdirSync, existsSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const OUT = resolve(root, "dist-vue");
const ENTRY = resolve(root, "src/index.ts");

const REQUIRED_FILES = ["index.js", "index.d.ts", "style.css", "package.json", "LICENSE"];
// Lo único que puede quedar en `dist-vue/` (además del tarball que genera `pnpm pack`).
const ALLOWED_ENTRIES = new Set([...REQUIRED_FILES, "README.md"]);

const problems = [];
const fail = (msg) => problems.push(msg);

if (!existsSync(OUT)) {
  console.error("✗ no existe dist-vue/ — corré `pnpm build:npm` primero");
  process.exit(1);
}

// 1. artefactos
for (const file of REQUIRED_FILES) {
  if (!existsSync(resolve(OUT, file))) fail(`falta dist-vue/${file}`);
}

// 4. nada de fuentes ni carpetas intermedias
for (const entry of readdirSync(OUT)) {
  if (entry.endsWith(".tgz")) continue; // `pnpm pack`
  if (!ALLOWED_ENTRIES.has(entry)) fail(`sobra dist-vue/${entry} (no debería viajar)`);
}

// 2. package.json publicable
let pkg = {};
if (existsSync(resolve(OUT, "package.json"))) {
  pkg = JSON.parse(readFileSync(resolve(OUT, "package.json"), "utf-8"));
  if (!pkg.name) fail("package.json: falta `name`");
  if (!pkg.version) fail("package.json: falta `version`");
  if (!pkg.exports?.["."]?.import) fail('package.json: falta `exports["."].import`');
  if (!pkg.exports?.["."]?.types) fail('package.json: falta `exports["."].types`');
  if (!pkg.types) fail("package.json: falta `types`");
  if (!pkg.peerDependencies?.vue) fail("package.json: falta `peerDependencies.vue`");
  if (!pkg.sideEffects) fail("package.json: falta `sideEffects`");
  if (pkg.dependencies?.vue) fail("package.json: `vue` no puede ser dependency (va como peer)");
  // Toda peer opcional (`peerDependenciesMeta`) tiene que existir como peer.
  for (const name of Object.keys(pkg.peerDependenciesMeta || {})) {
    if (!pkg.peerDependencies?.[name]) {
      fail(`package.json: \`peerDependenciesMeta.${name}\` sin \`peerDependencies.${name}\``);
    }
  }
  if (pkg.peerDependenciesMeta?.vue) fail("package.json: `vue` no puede ser una peer opcional");
}

// 3. exports reales vs. los declarados en src/index.ts
const src = readFileSync(ENTRY, "utf-8");
const declared = [...src.matchAll(/^export const (\w+)/gm)].map((m) => m[1]);
const declaresDefault = /^export default /m.test(src);

let actual = [];
try {
  const mod = await import(pathToFileURL(resolve(OUT, "index.js")).href);
  actual = Object.keys(mod);
} catch (error) {
  fail(`el bundle no importa: ${error.message}`);
}

if (actual.length) {
  const expected = new Set(declared);
  if (declaresDefault) expected.add("default");

  for (const name of expected) {
    if (!actual.includes(name)) fail(`el bundle no exporta \`${name}\``);
  }
  for (const name of actual) {
    if (!expected.has(name)) fail(`el bundle exporta \`${name}\`, que no está en src/index.ts`);
  }

  const plugin = actual.includes("default") ? (await import(pathToFileURL(resolve(OUT, "index.js")).href)).default : null;
  if (plugin && typeof plugin.install !== "function") fail("el export `default` no es un plugin (`install`)");
}

if (problems.length) {
  console.error(`✗ paquete npm: ${problems.length} problema(s)`);
  for (const p of problems) console.error(`   • ${p}`);
  process.exit(1);
}

const components = declared.filter((n) => n !== "initTokens");
console.log(`✓ paquete npm OK — ${components.length} componente(s): ${components.join(", ")}`);
