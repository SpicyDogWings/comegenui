#!/usr/bin/env node
// tools/migrate.mjs — Genera story + test L1 de un componente existente.
//
// Extrae de la página del playground: secciones, títulos, badges, snippets,
// VARIANTES (del markup de la demo) y CHECKS genéricos (raíz, variant, color,
// slot). Lista los tests viejos a mapear y las partes dinámicas que requieren
// revisión. Lo que quede con TODO lo completa el agente (08-...md).
//
// Uso: pnpm run stories:migrate <Componente> [--force]
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import fg from "fast-glob";

const ROOT = process.cwd();
const args = process.argv.slice(2);
const force = args.includes("--force");
const pageIndex = args.indexOf("--page");
const pageName = pageIndex >= 0 ? args[pageIndex + 1] : undefined;
const name = args.find((a) => !a.startsWith("--") && a !== pageName);

if (!name) {
  console.error("Uso: pnpm run stories:migrate <Componente> [--page <PaginaPlayground>] [--force]");
  process.exit(1);
}

const componentPath = fg.sync(`src/components/**/${name}.vue`, { ignore: ["**/customElements/**"] })[0];
if (!componentPath) {
  console.error(`❌ No se encontró src/components/**/${name}.vue`);
  process.exit(1);
}

const componentSource = readFileSync(resolve(ROOT, componentPath), "utf-8");
const category = componentPath.split("/")[2] === `${name}.vue` ? "" : componentPath.split("/")[2];
const storyDir = category ? `src/stories/${category}` : "src/stories";
const kebabName = name.replace(/([a-z0-9])([A-Z])/g, "$1-$2").toLowerCase();
const tag = `cu-${kebabName}`;
const storyPath = `${storyDir}/${name}.stories.ts`;
const testPath = `${storyDir}/${name}.l1.test.ts`;
const pagePath = `src/pages/playground/components/${pageName ?? name}.vue`;
const oldTestPath = fg.sync(`src/components/**/${name}.test.ts`)[0];

if (!force && (existsSync(resolve(ROOT, storyPath)) || existsSync(resolve(ROOT, testPath)))) {
  console.error(`❌ Ya existe ${storyPath} o ${testPath}. Usá --force para regenerar.`);
  process.exit(1);
}

// ── Detección en el componente ──────────────────────────────────────────────

const rootClass = componentSource.includes(`.${tag}`) ? tag : (componentSource.match(/\.(cu-[a-z0-9-]+)\b/)?.[1] ?? tag);
const declaredProps = new Set(
  [...componentSource.matchAll(/^\s{2}([a-zA-Z][\w-]*)\s*:\s*\{/gm)].map((m) => m[1]),
);
for (const match of componentSource.matchAll(/defineModel(?:<[^>]*>)?\(\s*(?:["'](\w+)["'])?/g)) {
  declaredProps.add(match[1] || "modelValue");
}
const colorToken = componentSource.match(/--([a-z0-9-]+)-bg\b/)?.[1];

// ── Parseo de la página ─────────────────────────────────────────────────────

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

function parseAttrs(str) {
  const attrs = [];
  const re = /([:@#\w.-]+)(?:\s*=\s*(?:"([^"]*)"|'([^']*)'))?/g;
  let match;
  while ((match = re.exec(str))) {
    attrs.push({ name: match[1], value: match[2] ?? match[3], dynamic: false });
  }
  return attrs;
}

function literal(value) {
  if (value === undefined) return true;
  if (/^(true|false)$/.test(value)) return value === "true";
  if (/^-?\d+(\.\d+)?$/.test(value)) return Number(value);
  if (/^'([^']*)'$/.test(value) || /^"([^"]*)"$/.test(value)) return value.slice(1, -1);
  return undefined;
}

function extractVariants(sectionBody) {
  const variants = [];
  const dynamicNotes = [];
  const re = new RegExp(`<${name}\\b([^>]*?)(?:\\/>|>([\\s\\S]*?)<\\/${name}>)`, "g");
  let match;
  let index = 0;
  while ((match = re.exec(sectionBody))) {
    const props = {};
    const attrs = {};
    const slots = {};
    const notes = [];

    for (const attr of parseAttrs(match[1])) {
      const raw = attr.name;
      if (/^(v-|@|#|ref$|key$)/.test(raw)) {
        if (/^v-model/.test(raw)) notes.push(raw);
        continue;
      }
      const propName = raw.replace(/^:/, "").replace(/-([a-z])/g, (_, c) => c.toUpperCase());
      const isDynamic = raw.startsWith(":");
      const value = isDynamic ? literal(attr.value) : attr.value === undefined ? true : attr.value;

      if (isDynamic && value === undefined) {
        notes.push(raw);
        continue;
      }
      if (propName === "style") attrs.style = String(value);
      else if (declaredProps.has(propName) || !isDynamic) props[propName] = value;
      else attrs[propName] = String(value);
    }

    const inner = match[2] ?? "";
    let text = inner.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
    text = text.replace(/\{\{\s*([\w.]+)\s*\}\}/g, (_, expr) => {
      const key = expr.split(".")[0];
      if (key in props && (typeof props[key] === "string" || typeof props[key] === "number")) {
        return String(props[key]);
      }
      notes.push(`slot dinámico {{ ${expr} }}`);
      return "";
    });
    if (text) slots.default = text;
    if (/\bv-for\b/.test(match[1])) notes.push("v-for: variantes incompletas");
    const namedSlots = [...inner.matchAll(/<template\s+#(\w+)/g)].map((m) => m[1]);
    if (namedSlots.length) notes.push(`slots nombrados: ${namedSlots.join(", ")}`);
    if (/<[^>]+>/.test(inner)) notes.push("slot con markup");

    const variantProp = typeof props.variant === "string" ? props.variant : undefined;
    const colorProp = typeof props.color === "string" ? props.color : undefined;
    const id = (variantProp || colorProp || `v${index + 1}`).toString();
    if (variants.some((v) => v.id === id)) {
      variants.push({ id: `${id}-${index + 1}`, props, attrs, slots, notes });
    } else {
      variants.push({ id, props, attrs, slots, notes });
    }
    dynamicNotes.push(...notes);
    index++;
  }
  return { variants, dynamicNotes };
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
    const { variants, dynamicNotes } = extractVariants(body);
    sections.push({
      id,
      title,
      badge,
      layout: body.includes("playground-col") ? "col" : "row",
      vueRef,
      vanillaRef,
      variants,
      dynamicNotes,
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
const sections = allSections.filter((s) => !PAGE_ONLY.has(s.id) && s.variants.length > 0);
const pageOnly = allSections.filter((s) => PAGE_ONLY.has(s.id));

if (sections.length === 0) {
  console.error(`⚠️  No se detectaron secciones de demo con <${name}> en ${pagePath}.`);
  process.exit(1);
}

// ── Emisión ─────────────────────────────────────────────────────────────────

const componentImport = `@/${componentPath.replace(/^src\//, "")}`;

function emitVariant(variant) {
  const parts = [`id: ${JSON.stringify(variant.id)}`];
  if (Object.keys(variant.props).length) parts.push(`props: ${JSON.stringify(variant.props)}`);
  if (Object.keys(variant.attrs).length) parts.push(`attrs: ${JSON.stringify(variant.attrs)}`);
  if (Object.keys(variant.slots).length) parts.push(`slots: ${JSON.stringify(variant.slots)}`);
  return `        { ${parts.join(", ")} },`;
}

function emitChecks(section) {
  const checks = [];
  checks.push(`          {
            name: "renderiza .${rootClass}",
            run({ wrapper, expect }) {
              expect(wrapper.find(".${rootClass}").exists()).toBe(true);
            },
          },`);

  const hasVariant = section.variants.some((v) => typeof v.props.variant === "string");
  const hasColor = section.variants.some((v) => typeof v.props.color === "string");
  const hasSlot = section.variants.some((v) => typeof v.slots.default === "string" && v.slots.default);

  if (hasVariant) {
    checks.push(`          {
            name: "aplica la clase ${rootClass}--{variant}",
            run({ wrapper, expect }, variant) {
              const value = variant.props?.variant as string | undefined;
              if (!value) return;
              expect(wrapper.find(".${rootClass}").classes()).toContain(\`${rootClass}--\${value}\`);
            },
          },`);
  }
  if (hasColor) {
    const token = colorToken ? `--${colorToken}-bg` : null;
    checks.push(`          {
            name: "resuelve el color como token CSS",
            run({ wrapper, expect }, variant) {
              const color = variant.props?.color as string | undefined;
              if (!color) return;
              const html = wrapper.html();
              ${
                token
                  ? `expect(html).toContain(\`var(--cu-color-\${color}\`);`
                  : `expect(html).toContain("var(--cu-color-");`
              }
            },
          },`);
  }
  if (hasSlot) {
    checks.push(`          {
            name: "renderiza el contenido del slot",
            run({ wrapper, expect }, variant) {
              const text = variant.slots?.default;
              if (typeof text !== "string" || !text) return;
              expect(wrapper.text()).toContain(text);
            },
          },`);
  }
  return checks.join("\n");
}

const storySections = sections
  .map((section) => {
    const lines = [];
    const notes = section.dynamicNotes.length
      ? `      // TODO: revisar demo (${[...new Set(section.dynamicNotes)].join("; ")})\n`
      : "";
    lines.push("    {");
    lines.push(`      id: ${JSON.stringify(section.id)},`);
    lines.push(`      title: ${JSON.stringify(section.title)},`);
    if (section.badge) lines.push(`      badge: ${JSON.stringify(section.badge)},`);
    if (section.layout === "col") lines.push(`      layout: "col",`);
    if (notes) lines.push(notes.trimEnd());
    lines.push(`      variants: [`);
    lines.push(...section.variants.map(emitVariant));
    lines.push(`      ],`);
    if (section.vueRef && snippets[section.vueRef]) lines.push(`      vue: ${tpl(snippets[section.vueRef])},`);
    else lines.push("      // TODO: snippet Vue");
    if (section.vanillaRef && snippets[section.vanillaRef]) lines.push(`      vanilla: ${tpl(snippets[section.vanillaRef])},`);
    else if (section.vanillaRef) lines.push("      // TODO: snippet Vanilla");
    lines.push("      checks: {");
    lines.push("        l1: [");
    lines.push(emitChecks(section));
    lines.push("          // TODO: checks específicos (eventos, exposes, casos del test viejo).");
    lines.push("        ],");
    lines.push("      },");
    lines.push("    },");
    return lines.join("\n");
  })
  .join("\n\n");

const testCount = sections.reduce((acc, s) => acc + s.variants.length, 0);
const header = [
  `// Generado por tools/migrate.mjs — revisar y completar los TODO.`,
  oldTests.length
    ? ["//", "// Tests viejos a mapear:"].concat(oldTests.map((t) => `//   - ${t}`)).join("\n")
    : "// (sin test viejo)",
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

export const cu${name}Stories: ComponentStory = {
  component: ${JSON.stringify(tag)},
  vue: ${name},
  sections: [
${storySections}
  ],
};
`;

const test = `import { cu${name}Stories } from "./${name}.stories";
import { runL1Story } from "@/stories/runner.l1";

runL1Story(cu${name}Stories);
`;

mkdirSync(resolve(ROOT, storyDir), { recursive: true });
writeFileSync(resolve(ROOT, storyPath), story);
writeFileSync(resolve(ROOT, testPath), test);

// ── Reporte ─────────────────────────────────────────────────────────────────

console.log(`✅ ${storyPath}`);
console.log(`✅ ${testPath}`);
console.log("");
console.log(`Secciones: ${sections.length} · variantes: ${testCount} · snippets: ${sections.filter((s) => s.vueRef && snippets[s.vueRef]).length} Vue / ${sections.filter((s) => s.vanillaRef && snippets[s.vanillaRef]).length} Vanilla`);
if (pageOnly.length) console.log(`Quedan en la página: ${pageOnly.map((s) => s.id).join(", ")}`);
if (oldTests.length) console.log(`Tests viejos a mapear: ${oldTests.length}`);
const dynamic = sections.filter((s) => s.dynamicNotes.length);
if (dynamic.length) console.log(`Con atributos dinámicos (revisar): ${dynamic.map((s) => s.id).join(", ")}`);
console.log("");
console.log("Próximos pasos (ver 08-migrar-al-sistema-de-stories.md):");
console.log("  1. Revisar variants y agregar checks específicos (eventos, exposes, casos del test viejo).");
console.log(`  2. Refactorizar ${pagePath} a StoryRenderer.`);
if (oldTestPath) console.log(`  3. git rm ${oldTestPath}`);
console.log(`  4. ./scripts/preflight.sh ${name}`);
