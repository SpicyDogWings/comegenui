#!/usr/bin/env node
// tools/stories/migrate.mjs — Genera el esqueleto de story + test L1 para un
// componente existente, extrayendo lo mecánico de su página del playground
// (secciones, títulos, badges, snippets) y listando los tests viejos a mapear.
//
// Uso: pnpm run stories:migrate Badge
//
// NO sobreescribe archivos existentes. Lo que queda con TODO lo completa el
// agente siguiendo .opencode/skills/comegen-dev/08-migrar-al-sistema-de-stories.md.
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import fg from "fast-glob";

const ROOT = process.cwd();
const name = process.argv[2];

if (!name) {
  console.error("Uso: pnpm run stories:migrate <Componente>   (ej: Badge)");
  process.exit(1);
}

const componentPath = fg.sync(`src/components/**/${name}.vue`, { ignore: ["**/customElements/**"] })[0];
if (!componentPath) {
  console.error(`❌ No se encontró src/components/**/${name}.vue`);
  process.exit(1);
}

const category = componentPath.split("/")[2] === `${name}.vue` ? "" : componentPath.split("/")[2];
const storyDir = category ? `src/stories/${category}` : "src/stories";
const kebabName = name.replace(/([a-z0-9])([A-Z])/g, "$1-$2").toLowerCase();
const tag = `cu-${kebabName}`;
const storyPath = `${storyDir}/${name}.stories.ts`;
const testPath = `${storyDir}/${name}.l1.test.ts`;
const pagePath = `src/pages/playground/components/${name}.vue`;
const oldTestPath = fg.sync(`src/components/**/${name}.test.ts`)[0];

if (existsSync(resolve(ROOT, storyPath)) || existsSync(resolve(ROOT, testPath))) {
  console.error(`❌ Ya existe ${storyPath} o ${testPath}. Borralos para regenerar.`);
  process.exit(1);
}

// ── Parseo ──────────────────────────────────────────────────────────────────

function readTemplateLiteral(source, start) {
  if (source[start] !== "`") return null;
  let i = start + 1;
  while (i < source.length) {
    if (source[i] === "\\") {
      i += 2;
      continue;
    }
    if (source[i] === "`") return source.slice(start + 1, i);
    i++;
  }
  return null;
}

function extractSnippets(source) {
  const snippets = {};
  const re = /const\s+(\w+)\s*=\s*(?:vueSnippet\s*\()?\s*`/g;
  let match;
  while ((match = re.exec(source))) {
    const [, varName] = match;
    const literalStart = source.indexOf("`", match.index + match[0].length - 1);
    const value = readTemplateLiteral(source, literalStart);
    if (value !== null) {
      snippets[varName] = value;
      re.lastIndex = literalStart + value.length + 2;
    }
  }
  return snippets;
}

function extractSections(source) {
  const sections = [];
  const re = /<section\b[^>]*\bid="([^"]+)"[^>]*>([\s\S]*?)<\/section>/g;
  let match;
  while ((match = re.exec(source))) {
    const [, id, body] = match;
    const title = (/<h2[^>]*>([\s\S]*?)<\/h2>/.exec(body)?.[1] ?? id).trim();
    const heading = /<div\s+class="playground-heading">([\s\S]*?)<\/div>/.exec(body)?.[1] ?? "";
    const badge = /<Badge\b[^>]*>([\s\S]*?)<\/Badge>/.exec(heading)?.[1]?.trim();
    const demos = [...body.matchAll(/<SectionDemo\b([^>]*)>/g)].map((m) => m[1]);
    const firstDemo = demos[0] ?? "";
    const vueRef = /:vue-code="(\w+)"/.exec(firstDemo)?.[1] ?? /vue-code="([^"]*)"/.exec(firstDemo)?.[1];
    const vanillaRef = /:vanilla-code="(\w+)"/.exec(firstDemo)?.[1];
    sections.push({
      id,
      title,
      badge,
      layout: body.includes("playground-col") ? "col" : "row",
      vueRef,
      vanillaRef,
      hasDemo: demos.length > 0,
    });
  }
  return sections;
}

function extractTestNames(source) {
  if (!source) return [];
  return [...source.matchAll(/\bit\(\s*"([^"]+)"/g)].map((m) => m[1]);
}

function tpl(value) {
  return "`" + value.replace(/`/g, "\\`").replace(/\$\{/g, "\\${") + "`";
}

const page = readFileSync(resolve(ROOT, pagePath), "utf-8");
const snippets = extractSnippets(page);
const allSections = extractSections(page);
const oldTests = oldTestPath ? extractTestNames(readFileSync(resolve(ROOT, oldTestPath), "utf-8")) : [];

const PAGE_ONLY = new Set(["api", "style", "programmatic"]);
const sections = allSections.filter((s) => !PAGE_ONLY.has(s.id));
const pageOnly = allSections.filter((s) => PAGE_ONLY.has(s.id));

if (sections.length === 0) {
  console.error(`⚠️  No se detectaron secciones de demo en ${pagePath}. Escribí la story a mano.`);
  process.exit(1);
}

// ── Emisión ─────────────────────────────────────────────────────────────────

const componentImport = `@/${componentPath.replace(/^src\//, "")}`;

const storySections = sections
  .map((section) => {
    const lines = [];
    lines.push("    {");
    lines.push(`      id: ${JSON.stringify(section.id)},`);
    lines.push(`      title: ${JSON.stringify(section.title)},`);
    if (section.badge) lines.push(`      badge: ${JSON.stringify(section.badge)},`);
    if (section.layout === "col") lines.push(`      layout: "col",`);
    lines.push("      // TODO: completar variants (una fila por demo del playground).");
    lines.push("      variants: [],");
    if (section.vueRef && snippets[section.vueRef]) {
      lines.push(`      vue: ${tpl(snippets[section.vueRef])},`);
    } else {
      lines.push("      // TODO: snippet Vue");
    }
    if (section.vanillaRef && snippets[section.vanillaRef]) {
      lines.push(`      vanilla: ${tpl(snippets[section.vanillaRef])},`);
    } else if (section.vanillaRef) {
      lines.push("      // TODO: snippet Vanilla");
    }
    lines.push("      checks: {");
    lines.push("        l1: [");
    lines.push("          // TODO: mapear los tests viejos a checks (ver cabecera).");
    lines.push("        ],");
    lines.push("      },");
    lines.push("    },");
    return lines.join("\n");
  })
  .join("\n\n");

const header = [
  `// Generado por tools/stories/migrate.mjs — completar los TODO.`,
  oldTests.length
    ? ["//", "// Tests viejos a mapear:"].concat(oldTests.map((t) => `//   - ${t}`)).join("\n")
    : "// (sin test viejo: definir los checks desde las secciones)",
  pageOnly.length
    ? `//\n// Secciones que quedan en la página (no van a la story): ${pageOnly.map((s) => s.id).join(", ")}`
    : "",
  "",
]
  .filter(Boolean)
  .join("\n");

const story = `${header}
import ${name} from "${componentImport}";
import type { ComponentStory } from "@/stories/types";

export const ${`cu${name}`}Stories: ComponentStory = {
  component: ${JSON.stringify(tag)},
  vue: ${name},
  sections: [
${storySections}
  ],
};
`;

const test = `import { ${`cu${name}`}Stories } from "./${name}.stories";
import { runL1Story } from "@/stories/runner.l1";

runL1Story(${`cu${name}`}Stories);
`;

mkdirSync(resolve(ROOT, storyDir), { recursive: true });
writeFileSync(resolve(ROOT, storyPath), story);
writeFileSync(resolve(ROOT, testPath), test);

// ── Reporte ─────────────────────────────────────────────────────────────────

console.log(`✅ ${storyPath}`);
console.log(`✅ ${testPath}`);
console.log("");
console.log(`Secciones detectadas (${sections.length}): ${sections.map((s) => s.id).join(", ")}`);
if (pageOnly.length) console.log(`Quedan en la página: ${pageOnly.map((s) => s.id).join(", ")}`);
console.log(`Snippets copiados: ${sections.filter((s) => s.vueRef && snippets[s.vueRef]).length}/${sections.filter((s) => s.vueRef).length} Vue · ${sections.filter((s) => s.vanillaRef && snippets[s.vanillaRef]).length}/${sections.filter((s) => s.vanillaRef).length} Vanilla`);
if (oldTests.length) console.log(`Tests viejos a mapear: ${oldTests.length}`);
console.log("");
console.log("Próximos pasos:");
console.log("  1. Completar variants y checks en la story (ver 08-migrar-al-sistema-de-stories.md).");
console.log(`  2. Refactorizar ${pagePath} a StoryRenderer.`);
if (oldTestPath) console.log(`  3. git rm ${oldTestPath}`);
console.log("  4. ./scripts/preflight.sh");
