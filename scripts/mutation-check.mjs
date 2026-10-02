#!/usr/bin/env node
// scripts/mutation-check.mjs — LA prueba de fuego contra falsos verdes.
//
// Un test que "da verde" no sirve si sigue verde cuando el componente está roto.
// Este script aplica mutaciones conocidas (una por una), corre los tests, y
// FALLA si alguna mutación no es detectada. Cada mutación declara en qué archivo
// y qué cambio rompe el comportamiento; si el cambio se aplica pero los tests
// siguen pasando, el test que "cubría" eso es un falso verde.
//
//   node scripts/mutation-check.mjs                 # todas
//   node scripts/mutation-check.mjs --solo alert    # las que matcheen
//   node scripts/mutation-check.mjs --list          # lista sin correr
//   node scripts/mutation-check.mjs --json
import { readFileSync, writeFileSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");

/**
 * Cada mutación: `find`/`replace` en `file`, y qué test debería caer.
 * `expect` es informativo (qué comportamiento cubre) para el reporte.
 */
const MUTATIONS = [
  {
    id: "alert-close-no-hide",
    file: "src/components/information/Alert.vue",
    expect: "cerrar la alerta la oculta (close())",
    find: `function close() {
  internalShow.value = false;
  emit("close");
}`,
    replace: `function close() {
  emit("close");
}`,
  },
  {
    id: "input-reset-no-clear",
    file: "src/components/form/Input.vue",
    expect: "reset() limpia el campo",
    find: `const reset = () => { value.value = ""; };`,
    replace: `const reset = () => { /* mutado */ };`,
  },
  {
    id: "modal-backdrop-ignores-persistent",
    file: "src/components/overlay/Modal.vue",
    expect: "un modal persistent no se cierra por click en el backdrop",
    find: `if (!props.persistent && event.target === event.currentTarget) {`,
    replace: `if (event.target === event.currentTarget) {`,
  },
  {
    id: "modal-close-emits-nothing",
    file: "src/components/overlay/Modal.vue",
    expect: "cerrar el modal emite close/closed",
    find: `watch(isOpen, (newVal) => {
  emit(newVal ? "opened" : "closed");
  if (!newVal) emit("close");
});`,
    replace: `watch(isOpen, (newVal) => {
  emit(newVal ? "opened" : "closed");
});`,
  },
];

const argv = process.argv.slice(2);
const only = argv.includes("--solo") ? argv[argv.indexOf("--solo") + 1] : null;
const asJson = argv.includes("--json");

const selected = MUTATIONS.filter((m) => !only || m.id.includes(only));

if (argv.includes("--list")) {
  for (const m of selected) console.log(`${m.id}\t${m.file}\t${m.expect}`);
  process.exit(0);
}

/** Corre los tests; devuelve true si pasan (no detectó nada). */
function testsPass() {
  const res = spawnSync("pnpm", ["exec", "vitest", "run", "--silent"], {
    cwd: ROOT,
    encoding: "utf-8",
  });
  return res.status === 0;
}

function applyMutation(m) {
  const path = resolve(ROOT, m.file);
  const original = readFileSync(path, "utf-8");
  if (!original.includes(m.find)) {
    return { ok: false, path, original };
  }
  writeFileSync(path, original.replace(m.find, m.replace));
  return { ok: true, path, original };
}

const results = [];
for (const m of selected) {
  const { ok, path, original } = applyMutation(m);
  if (!ok) {
    results.push({ id: m.id, status: "stale", expect: m.expect });
    continue;
  }
  let detected = false;
  try {
    detected = !testsPass();
  } finally {
    writeFileSync(path, original); // siempre restaurar
  }
  results.push({ id: m.id, status: detected ? "detected" : "survived", expect: m.expect });
}

if (asJson) {
  console.log(JSON.stringify(results, null, 2));
} else {
  console.log("\n🧬 Prueba de mutación (¿los tests detectan el bug?)\n");
  const icon = { detected: "✅", survived: "❌", stale: "⚠️" };
  for (const r of results) {
    console.log(`${icon[r.status]} ${r.id} — ${r.expect}`);
    if (r.status === "survived") console.log("      ❌ FALSO VERDE: el test no lo detectó");
    if (r.status === "stale") console.log("      ⚠️  la mutación ya no aplica (código cambió)");
  }
}

const survived = results.filter((r) => r.status === "survived").length;
const stale = results.filter((r) => r.status === "stale").length;
console.log(
  `\n${survived === 0 ? "✅" : "❌"} ${results.length - survived - stale}/${results.length} mutaciones detectadas` +
    (survived ? ` · ${survived} falso(s) verde(s)` : "") +
    (stale ? ` · ${stale} desactualizada(s)` : ""),
);
process.exit(survived > 0 || stale > 0 ? 1 : 0);
