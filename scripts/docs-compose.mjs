#!/usr/bin/env node
// scripts/docs-compose.mjs — Materializa la doc versionada para el sitio.
//
// La doc es la **fuente** y vive versionada en `docs/versiones/<id>/` (ver `docs/notes/13-doc-versionada.md`).
// El sitio no la genera: la **compone**. La resolución del overlay ("gana el último archivo del mismo
// path") la hace `doc-tree.mjs`; acá sólo se materializa el árbol resuelto en la disposición que
// esperan VitePress y los `@include` de las fichas:
//
//   versiones/<id>/componentes/**          → docs/componentes/**         (fichas; las páginas las incluyen)
//   versiones/<id>/partials/**             → docs/partials/**            (secciones de API compartidas)
//   versiones/<id>/paginas/componentes/**  → docs/site/componentes/**    (páginas del sitio)
//   versiones/<id>/paginas/examples/**     → docs/site/examples/**       (demos vanilla)
//
// Los destinos están gitignoreados: se regeneran corriendo esto (lo hacen `pnpm dev` y `pnpm build`).
//
// Uso: node scripts/docs-compose.mjs            # compone la versión `latest` del manifiesto
import { cpSync, mkdirSync, rmSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { ROOT, latestId, resolvedFilesFor, resolveInVersion, versionsInOrder } from "./doc-tree.mjs";

/** `[carpeta dentro de la versión, destino compuesto]`. */
export const DESTINOS = [
  ["componentes", "docs/componentes"],
  ["partials", "docs/partials"],
  ["paginas/componentes", "docs/site/componentes"],
  ["paginas/examples", "docs/site/examples"],
];

/**
 * Materializa el árbol **resuelto** de la versión `id` (por defecto, la `latest`) en los destinos
 * que espera VitePress. Devuelve cuántos archivos copió.
 *
 * Lo usa el propio CLI y `docs-versions.mjs` (que compone cada versión antes de buildearla).
 */
export function compose(id = latestId()) {
  let copiados = 0;
  for (const [sub, destino] of DESTINOS) {
    const to = resolve(ROOT, destino);
    // El destino es generado: se limpia para que no queden archivos de una versión que ya no existe.
    rmSync(to, { recursive: true, force: true });
    const files = resolvedFilesFor(id, sub);
    if (files.size === 0) continue;
    for (const relPath of files.keys()) {
      const from = resolveInVersion(id, relPath);
      const rest = relPath.slice(sub.length).replace(/^[/\\]/, "");
      const target = resolve(to, rest);
      mkdirSync(dirname(target), { recursive: true });
      cpSync(from, target);
      copiados++;
    }
  }
  return copiados;
}

// ── CLI ──────────────────────────────────────────────────────────────────────
const isMain = process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url);
if (isMain) {
  const versiones = versionsInOrder();
  if (versiones.length === 0) {
    console.error("docs-compose: el manifiesto (docs/versions.json) no tiene versiones");
    process.exit(1);
  }
  const copiados = compose();
  if (copiados === 0) {
    console.error(
      "docs-compose: ninguna versión del manifiesto tiene `componentes|partials|paginas` en docs/versiones/",
    );
    process.exit(1);
  }
  console.log(
    `docs-compose: ${copiados} archivo(s) compuestos de ${versiones.map((v) => v.id).join(" + ")} ` +
      `→ docs/{componentes,partials,site/componentes,site/examples}`,
  );
}
