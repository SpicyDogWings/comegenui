#!/usr/bin/env node
// scripts/docs-compose.mjs — Materializa la doc versionada para el sitio.
//
// La doc es la **fuente** y vive versionada en `docs/versiones/<id>/` (ver `docs/notes/13-doc-versionada.md`).
// El sitio no la genera: la **compone**. Esto resuelve el árbol de una versión (base + overlays:
// "gana el último archivo del mismo path") y lo deja en la disposición que esperan VitePress y los
// `@include` de las fichas:
//
//   versiones/<id>/componentes/**          → docs/componentes/**         (fichas; las páginas las incluyen)
//   versiones/<id>/partials/**             → docs/partials/**            (secciones de API compartidas)
//   versiones/<id>/paginas/componentes/**  → docs/site/componentes/**    (páginas del sitio)
//
// Los destinos están gitignoreados: se regeneran corriendo esto (lo hacen `pnpm dev` y `pnpm build`).
import { cpSync, existsSync, mkdirSync, readFileSync, rmSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const manifest = JSON.parse(readFileSync(resolve(root, "docs/versions.json"), "utf-8"));
const versions = (manifest.versions ?? []).filter((v) => v?.id);
if (versions.length === 0) {
  console.error("docs-compose: el manifiesto (docs/versions.json) no tiene versiones");
  process.exit(1);
}

/** `[carpeta dentro de la versión, destino compuesto]`. */
const DESTINOS = [
  ["componentes", "docs/componentes"],
  ["partials", "docs/partials"],
  ["paginas/componentes", "docs/site/componentes"],
  ["paginas/examples", "docs/site/examples"],
];

const origen = (id, sub) => resolve(root, "docs/versiones", id, sub);

// De la más vieja a la más nueva: la que gana es la última que escriba el mismo path.
const enOrden = [...versions].sort((a, b) => Number(!!a.latest) - Number(!!b.latest));

// El destino es generado: se limpia para que no queden archivos de una versión que ya no existe.
for (const [, destino] of DESTINOS) {
  rmSync(resolve(root, destino), { recursive: true, force: true });
}

let copiados = 0;
for (const version of enOrden) {
  for (const [sub, destino] of DESTINOS) {
    const from = origen(version.id, sub);
    if (!existsSync(from)) continue;
    const to = resolve(root, destino);
    mkdirSync(to, { recursive: true });
    cpSync(from, to, { recursive: true });
    copiados++;
  }
}

if (copiados === 0) {
  console.error("docs-compose: ninguna versión del manifiesto tiene `componentes|partials|paginas` en docs/versiones/");
  process.exit(1);
}

console.log(
  `docs-compose: ${copiados} carpeta(s) compuestas de ${enOrden.map((v) => v.id).join(" + ")} ` +
    `→ docs/{componentes,partials,site/componentes}`,
);
