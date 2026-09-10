#!/usr/bin/env node
// tools/stories/status.mjs — Inventario de componentes vs sistema de stories/tests.
//
// Uso: pnpm run stories:status
import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import fg from "fast-glob";

const ROOT = process.cwd();

function rel(path) {
  return resolve(ROOT, path);
}

function kebab(name) {
  return name
    .replace(/([a-z0-9])([A-Z])/g, "$1-$2")
    .toLowerCase();
}

function findComponent(name) {
  const hits = fg.sync(`src/components/**/${name}.vue`, {
    ignore: ["**/customElements/**"],
  });
  return hits[0];
}

function findStory(name) {
  return fg.sync(`src/stories/**/${name}.stories.ts`)[0];
}

function findOldTest(name) {
  return fg.sync(`src/components/**/${name}.test.ts`)[0];
}

function findPlayground(name) {
  return fg.sync(`src/pages/playground/components/${name}.vue`)[0];
}

function isPublic(componentPath) {
  const category = componentPath.split("/")[2];
  const file = kebab(componentPath.split("/").pop().replace(/\.vue$/, ""));
  return existsSync(rel(`src/lib/${category}/${file}.ts`));
}

function loadBadges() {
  const path = rel("public/test-results.json");
  if (!existsSync(path)) return null;
  try {
    return JSON.parse(readFileSync(path, "utf-8"));
  } catch {
    return null;
  }
}

function badgeSummary(results, tag) {
  const component = results?.components?.[tag];
  if (!component) return "—";
  const sections = Object.values(component.sections);
  const passed = sections.filter((s) => s.status === "passed").length;
  const failed = sections.filter((s) => s.status === "failed").length;
  return failed > 0 ? `❌ ${passed}✓/${failed}✗` : `✅ ${passed}✓`;
}

const names = fg
  .sync("src/components/**/*.vue", { ignore: ["**/customElements/**"] })
  .filter((p) => !p.includes("/icons/") && !p.includes("/lab/") && !p.includes("/legacy/") && !p.includes("/archived/") && !p.includes("/pages/"))
  .map((p) => p.split("/").pop().replace(/\.vue$/, ""))
  .filter((name) => !name.includes(".test"))
  .sort();

const results = loadBadges();

console.log("Componente               Público  Página  Story  Test viejo  L1");
console.log("─".repeat(78));

let pending = 0;
for (const name of names) {
  const component = findComponent(name);
  const story = findStory(name);
  const oldTest = findOldTest(name);
  const playground = findPlayground(name);
  const publicApi = isPublic(component);
  const tag = `cu-${kebab(name)}`;

  if (!story) pending++;

  const row = [
    name.padEnd(24),
    (publicApi ? "sí" : "—").padEnd(8),
    (playground ? "sí" : "—").padEnd(7),
    (story ? "sí" : "—").padEnd(6),
    (oldTest ? "sí" : "—").padEnd(11),
    story ? badgeSummary(results, tag) : "—",
  ];
  console.log(row.join(" "));
}

console.log("");
console.log(`${names.length} componentes · ${pending} sin story (pendientes de migrar)`);
if (!results) console.log("Sin public/test-results.json: corré pnpm run test:l1 para ver los badges.");
