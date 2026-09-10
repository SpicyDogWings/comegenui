#!/usr/bin/env node
// tools/stories/generate.mjs — Genera una story prop-driven desde el propio
// componente: las secciones salen de sus props y valores (enum/boolean/texto).
//
// Uso: pnpm run stories:generate Button [--force]
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import fg from "fast-glob";

const ROOT = process.cwd();
const args = process.argv.slice(2);
const force = args.includes("--force");
const metaOnly = args.includes("--meta-only");
const pageIndex = args.indexOf("--page");
const pageName = pageIndex >= 0 ? args[pageIndex + 1] : undefined;
const name = args.find((a) => !a.startsWith("--") && a !== pageName);

if (!name) {
  console.error("Uso: pnpm run stories:generate <Componente> [--force]");
  process.exit(1);
}

const componentPath = fg.sync(`src/components/**/${name}.vue`, { ignore: ["**/customElements/**"] })[0];
if (!componentPath) {
  console.error(`❌ No se encontró src/components/**/${name}.vue`);
  process.exit(1);
}

const source = readFileSync(resolve(ROOT, componentPath), "utf-8");
const category = componentPath.split("/")[2] === `${name}.vue` ? "" : componentPath.split("/")[2];
const storyDir = category ? `src/stories/${category}` : "src/stories";
const kebab = name.replace(/([a-z0-9])([A-Z])/g, "$1-$2").toLowerCase();
const tag = `cu-${kebab}`;
const storyPath = `${storyDir}/${name}.stories.ts`;
const testPath = `${storyDir}/${name}.l1.test.ts`;
const libEntry = fg.sync(`src/lib/**/${kebab}.ts`)[0];
const isPublic = Boolean(libEntry);

// ── Consideraciones por componente ──────────────────────────────────────────
// Archivo hermano de la story: src/stories/{cat}/{Name}.stories.config.json
// {
//   "include": ["color", "variant", "size", "loading"],
//   "exclude": ["target"],
//   "order": ["default", "color", "variant", "size", "links", "loading"],
//   "sections": {
//     "target": { "title": "Targets", "extraProps": { "to": "https://example.com" } },
//     "loading": { "preview": { "recipe": "async-click", "duration": 1500, "entries": [
//       { "idle": "Click to Load", "active": "Loading...", "props": { "color": "primary" } }
//     ]}}
//   },
//   "custom": [
//     { "id": "links", "title": "Links", "prop": "to", "values": [
//       { "value": "https://example.com", "label": "External", "extraProps": { "target": "_blank" } }
//     ]}
//   ]
// }
const configPath = resolve(ROOT, storyDir, `${name}.stories.config.json`);
let storyConfig = {};
if (existsSync(configPath)) {
  try {
    storyConfig = JSON.parse(readFileSync(configPath, "utf-8"));
  } catch (error) {
    console.error(`⚠️  ${name}.stories.config.json inválido: ${error.message}`);
  }
}

// ── Metadata de página (tokens, API) para el playground genérico ─────────────

const pagePath = `src/pages/playground/components/${pageName ?? name}.vue`;
const pageSource = existsSync(resolve(ROOT, pagePath))
  ? readFileSync(resolve(ROOT, pagePath), "utf-8")
  : "";

function skipQuoted(src, start, quote) {
  for (let i = start + 1; i < src.length; i++) {
    if (src[i] === "\\") {
      i++;
      continue;
    }
    if (src[i] === quote) return i;
  }
  return src.length;
}

function readBacktick(src, start) {
  for (let i = start + 1; i < src.length; i++) {
    if (src[i] === "\\") {
      i++;
      continue;
    }
    if (src[i] === "`") return src.slice(start, i + 1);
  }
  return null;
}

function readValue(src, start) {
  const first = src[start];
  if (first === "`") return readBacktick(src, start);
  const pairs = { "[": "]", "{": "}", "(": ")" };
  if (!pairs[first]) return null;
  const stack = [];
  for (let i = start; i < src.length; i++) {
    const char = src[i];
    if (char === "`") {
      i = skipQuoted(src, i, "`");
      continue;
    }
    if (char === '"' || char === "'") {
      i = skipQuoted(src, i, char);
      continue;
    }
    if (pairs[char]) stack.push(pairs[char]);
    else if (stack.length && char === stack[stack.length - 1]) {
      stack.pop();
      if (!stack.length) return src.slice(start, i + 1);
    }
  }
  return null;
}

function extractConst(src, constName) {
  const match = new RegExp(`const\\s+${constName}\\s*(?::[^=]+)?=`).exec(src);
  if (!match) return null;
  return readValue(src, match.index + match[0].length + src.slice(match.index + match[0].length).search(/\S/));
}

const pageConsts = {};
for (const constName of [
  "componentTokens",
  "styleSubComponents",
  "subComponents",
  "componentDeps",
  "propsData",
  "slotsData",
  "eventsData",
  "exposesData",
  "interfaceCode",
]) {
  const value = pageSource ? extractConst(pageSource, constName) : null;
  if (value) pageConsts[constName] = value;
}

// Extras por componente (Programmatic u otras secciones especiales) en un
// archivo hermano que el generador importa sin tocarlo:
//   src/stories/{cat}/{Name}.stories.extras.ts → `export const extras: StoryExtra[]`
const extrasPath = resolve(ROOT, storyDir, `${name}.stories.extras.ts`);
const hasExtras = existsSync(extrasPath);

function indentValue(value, extra) {
  if (!/^[[{]/.test(value)) return value;
  const pad = " ".repeat(extra);
  return value
    .split("\n")
    .map((line, index) => (index === 0 ? line : pad + line))
    .join("\n");
}

const metaLines = [];
if (pageConsts.componentTokens) {
  metaLines.push(`  tokens: ${indentValue(pageConsts.componentTokens, 2)},`);
}
const subComponents = pageConsts.styleSubComponents ?? pageConsts.subComponents;
if (subComponents) metaLines.push(`  subComponents: ${indentValue(subComponents, 2)},`);
const apiParts = [];
if (pageConsts.componentDeps) apiParts.push(`components: ${indentValue(pageConsts.componentDeps, 4)}`);
if (pageConsts.propsData) apiParts.push(`props: ${indentValue(pageConsts.propsData, 4)}`);
if (pageConsts.slotsData) apiParts.push(`slots: ${indentValue(pageConsts.slotsData, 4)}`);
if (pageConsts.eventsData) apiParts.push(`events: ${indentValue(pageConsts.eventsData, 4)}`);
if (pageConsts.exposesData) apiParts.push(`exposes: ${indentValue(pageConsts.exposesData, 4)}`);
if (pageConsts.interfaceCode) apiParts.push(`interfaceCode: ${pageConsts.interfaceCode}`);
if (apiParts.length) metaLines.push(`  api: {\n    ${apiParts.join(",\n    ")},\n  },`);

// ── Modo --meta-only: actualiza tokens/subComponents/api en una story existente
if (metaOnly) {
  if (!existsSync(resolve(ROOT, storyPath))) {
    console.error(`❌ No existe ${storyPath} para actualizar metadata.`);
    process.exit(1);
  }

  function removeField(source, field) {
    const match = new RegExp(`\\n  ${field}: `).exec(source);
    if (!match) return source;
    const start = match.index;
    const valueStart = match.index + match[0].length;
    const value = readValue(source, valueStart);
    if (!value) return source;
    let end = valueStart + value.length;
    if (source[end] === ",") end++;
    return source.slice(0, start) + source.slice(end);
  }

  let updated = readFileSync(resolve(ROOT, storyPath), "utf-8");
  for (const field of ["tokens", "subComponents", "api"]) {
    updated = removeField(updated, field);
  }

  const anchor = new RegExp(`(vue:\\s*${name},)`);
  if (anchor.test(updated)) {
    const block = metaLines.length ? "\n" + metaLines.join("\n") : "";
    updated = updated.replace(anchor, `$1${block}`);
    writeFileSync(resolve(ROOT, storyPath), updated);
    console.log(`✅ ${storyPath} (solo metadata: ${metaLines.length ? metaLines.map((l) => l.trim().split(":")[0]).join(", ") : "sin campos"})`);
  } else {
    console.error(`⚠️  No se encontró 'vue: ${name},' en ${storyPath}; no se insertó metadata.`);
  }
  process.exit(0);
}

if (!force && existsSync(resolve(ROOT, storyPath))) {
  console.error(`❌ Ya existe ${storyPath}. Usá --force para regenerar.`);
  process.exit(1);
}

// ── Parseo del componente ───────────────────────────────────────────────────

function splitTopLevel(block) {
  const parts = [];
  let depth = 0;
  let current = "";
  for (const char of block) {
    if ("{[(".includes(char)) depth++;
    else if ("}])".includes(char)) depth--;
    if (char === "," && depth === 0) {
      parts.push(current);
      current = "";
    } else {
      current += char;
    }
  }
  if (current.trim()) parts.push(current);
  return parts;
}

function findPropsBlock(src) {
  const idx = src.indexOf("defineProps");
  if (idx < 0) return "";
  const paren = src.indexOf("(", idx);
  const start = src.indexOf("{", paren);
  if (start < 0) return "";
  let depth = 0;
  for (let i = start; i < src.length; i++) {
    if (src[i] === "{") depth++;
    else if (src[i] === "}") {
      depth--;
      if (depth === 0) return src.slice(start + 1, i);
    }
  }
  return "";
}

function valuesOf(text) {
  return [...text.matchAll(/'([^']+)'|"([^"]+)"/g)].map((match) => match[1] ?? match[2]);
}

function parseProps(block) {
  const props = [];
  for (const entry of splitTopLevel(block)) {
    const match = entry.match(/^\s*([\w$]+)\s*:\s*([\s\S]+)$/);
    if (!match) continue;
    const [, propName, rest] = match;
    const prop = { name: propName, kind: "unknown" };

    const validator = rest.match(/validator:[\s\S]*?\[([^\]]*)\]/);
    const union = rest.match(/PropType<([^>]*)>/);
    const values = valuesOf(validator?.[1] ?? union?.[1] ?? "");
    if (values.length) {
      prop.kind = "enum";
      prop.values = values;
    } else if (/\bBoolean\b/.test(rest)) {
      prop.kind = "boolean";
    } else if (/\bNumber\b/.test(rest)) {
      prop.kind = "number";
    } else if (/\bString\b/.test(rest)) {
      prop.kind = "string";
    }

    if (/required:\s*true/.test(rest)) prop.required = true;
    const def = rest.match(/default:\s*("[^"]*"|'[^']*'|true|false|-?\d+(?:\.\d+)?)/);
    if (def) prop.default = def[1].replace(/^["']|["']$/g, "");
    props.push(prop);
  }
  return props;
}

function parseEmits(src) {
  const emits = new Set();
  for (const match of src.matchAll(/defineEmits(?:<[^>]*>)?\(\s*\[([^\]]*)\]/g)) {
    valuesOf(match[1]).forEach((event) => emits.add(event));
  }
  for (const match of src.matchAll(/\(e:\s*'([^']+)'\)/g)) emits.add(match[1]);
  return [...emits];
}

const props = parseProps(findPropsBlock(source));
const emits = parseEmits(source);
const rootClass = `cu-${kebab}`;
const colorToken = source.match(/--([a-z0-9-]+)-bg\b/)?.[1];

function capital(value) {
  return value.charAt(0).toUpperCase() + value.slice(1);
}

function hasClassPattern(prop) {
  return new RegExp(`--\\$\\{(?:props\\.)?${prop}\\}`).test(source) || source.includes(`--${prop}`);
}

function camelToKebab(value) {
  return value.replace(/([a-z0-9])([A-Z])/g, "$1-$2").toLowerCase();
}

// ── Secciones derivadas de las props ────────────────────────────────────────

const SECTION_TITLES = {
  color: "Colors",
  variant: "Variants",
  size: "Sizes",
  layout: "Layouts",
  position: "Positions",
  animation: "Animations",
  type: "Types",
  align: "Align",
};

const SLOT_SAMPLES = {
  Button: "Guardar",
  Alert: "Mensaje de alerta",
  Badge: "Nuevo",
  Label: "Etiqueta",
  Card: "Contenido de la tarjeta",
  Avatar: "AB",
  AuthorCard: "Ada Lovelace",
  Chip: "Chip",
  Tabs: "Contenido",
};

const sample = SLOT_SAMPLES[name] ?? name;

function attrString(propName, value, vanilla = false) {
  const kebabAttr = camelToKebab(propName);
  if (value === true) return ` ${kebabAttr}`;
  if (value === false || value === undefined || value === "") return "";
  if (typeof value === "number") return vanilla ? ` ${kebabAttr}="${value}"` : ` :${kebabAttr}="${value}"`;
  return ` ${kebabAttr}="${value}"`;
}

function snippetFor(variants, vanilla) {
  return variants
    .map((variant) => {
      const attrs = Object.entries(variant.props ?? {})
        .map(([key, value]) => attrString(key, value, vanilla))
        .join("");
      const slot = variant.slots?.default ?? "";
      if (vanilla) return `  <${tag}${attrs}>${slot}</${tag}>`;
      return `  <${name}${attrs}>${slot}</${name}>`;
    })
    .join("\n");
}

function tpl(value) {
  return "`" + value.replace(/`/g, "\\`").replace(/\$\{/g, "\\${") + "`";
}

function slug(value) {
  return String(value)
    .replace(/([a-z0-9])([A-Z])/g, "$1-$2")
    .replace(/[^a-zA-Z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .toLowerCase();
}

const sections = [];

// Default
sections.push({
  id: "default",
  title: "Default",
  variants: [{ id: "default", props: {}, slots: { default: sample } }],
  checks: ["root", "slot"],
});

for (const prop of props) {
  if (prop.kind === "enum" && prop.values?.length) {
    const id = camelToKebab(prop.name);
    const variants = prop.values.map((value) => ({
      id: camelToKebab(value),
      props: { [prop.name]: value },
      slots: {
        default:
          prop.name === "color" || prop.name === "variant" ? capital(value) : String(value),
      },
    }));
    sections.push({
      id,
      title: SECTION_TITLES[prop.name] ?? capital(prop.name),
      badge: prop.default !== undefined ? String(prop.default) : undefined,
      badgeTitle: prop.default !== undefined ? `Default: ${prop.default}` : undefined,
      variants,
      checks: ["root", "slot", prop.name],
    });
  } else if (prop.kind === "boolean") {
    const id = camelToKebab(prop.name);
    const variants = [
      { id: "false", props: { [prop.name]: false }, slots: { default: sample } },
      { id: "true", props: { [prop.name]: true }, slots: { default: sample } },
    ];
    sections.push({
      id,
      title: capital(prop.name),
      badge: prop.default !== undefined ? String(prop.default) : undefined,
      badgeTitle: prop.default !== undefined ? `Default: ${prop.default}` : undefined,
      variants,
      checks: ["root", "slot", prop.name],
    });
  } else if (prop.kind === "string" && ["label", "title", "placeholder", "text"].includes(prop.name)) {
    const id = camelToKebab(prop.name);
    sections.push({
      id,
      title: capital(prop.name),
      variants: [
        { id: "with-value", props: { [prop.name]: sample }, slots: { default: sample } },
        ...(prop.required ? [] : [{ id: "empty", props: {}, slots: { default: sample } }]),
      ],
      checks: ["root", "slot", prop.name],
    });
  }
}

// ── Consideraciones del config ──────────────────────────────────────────────

const include = storyConfig.include;
const exclude = new Set(storyConfig.exclude ?? []);
let finalSections = sections.filter(
  (section) => (!include || include.includes(section.id)) && !exclude.has(section.id),
);

for (const section of finalSections) {
  const overrides = storyConfig.sections?.[section.id];
  if (!overrides) continue;
  if (overrides.title) section.title = overrides.title;
  if (overrides.badge) section.badge = overrides.badge;
  if (overrides.layout) section.layout = overrides.layout;
  if (overrides.extraProps) {
    section.variants = section.variants.map((variant) => ({
      ...variant,
      props: { ...(variant.props ?? {}), ...overrides.extraProps },
    }));
    section.checks = [...new Set([...section.checks, ...Object.keys(overrides.extraProps)])];
  }
}

for (const custom of storyConfig.custom ?? []) {
  const values = custom.values ?? [];
  const variants = values.map((entry, index) => {
    const value = typeof entry === "string" ? entry : entry.value;
    const label = typeof entry === "string" ? entry : entry.label ?? String(entry.value);
    return {
      id: slug(label) || `v${index + 1}`,
      props: { ...(custom.prop ? { [custom.prop]: value } : {}), ...(entry.extraProps ?? {}) },
      slots: { default: label },
    };
  });
  finalSections.push({
    id: custom.id,
    title: custom.title ?? capital(custom.id),
    badge: custom.badge,
    badgeTitle: custom.badgeTitle,
    layout: custom.layout,
    variants,
    checks: [...new Set(["root", "slot", ...(custom.prop ? [custom.prop] : []), ...(custom.checks ?? [])])],
  });
}

if (storyConfig.order) {
  const order = storyConfig.order;
  const rank = (id) => {
    const index = order.indexOf(id);
    return index < 0 ? 999 : index;
  };
  finalSections = [...finalSections].sort((a, b) => rank(a.id) - rank(b.id));
}

sections.length = 0;
sections.push(...finalSections);

// ── Emisión ─────────────────────────────────────────────────────────────────

const KNOWN_CHECKS = {
  root: (section) => `          {
            name: "renderiza .${rootClass}",
            run({ wrapper, expect }) {
              expect(wrapper.find(".${rootClass}").exists()).toBe(true);
            },
          },`,
  slot: () => `          {
            name: "renderiza el contenido del slot",
            run({ wrapper, expect }, variant) {
              const text = variant.slots?.default;
              if (typeof text !== "string" || !text) return;
              expect(wrapper.text()).toContain(text);
            },
          },`,
};

function emitPropCheck(section, propName) {
  const prop = props.find((p) => p.name === propName);
  if (!prop) return null;

  if (prop.kind === "boolean") {
    if (propName === "disabled" && /:disabled=/.test(source)) {
      return `          {
            name: "disabled: refleja el atributo en el control",
            run({ wrapper, expect }, variant) {
              const control = wrapper.find("button, input, textarea, select");
              if (variant.props?.disabled) expect(control.attributes("disabled")).toBeDefined();
              else expect(control.attributes("disabled")).toBeUndefined();
            },
          },`;
    }
    if (propName === "loading" && source.includes(`${rootClass}-spinner`)) {
      return `          {
            name: "loading: muestra el spinner",
            run({ wrapper, expect }, variant) {
              if (variant.props?.loading) expect(wrapper.find(".${rootClass}-spinner").exists()).toBe(true);
              else expect(wrapper.find(".${rootClass}-spinner").exists()).toBe(false);
            },
          },`;
    }
    const kebabProp = camelToKebab(propName);
    if (source.includes(`${rootClass}--${kebabProp}`)) {
      return `          {
            name: ${JSON.stringify(`aplica ${rootClass}--${kebabProp} cuando ${propName}=true`)},
            run({ wrapper, expect }, variant) {
              const classes = wrapper.find(".${rootClass}").classes();
              if (variant.props?.${propName}) expect(classes).toContain("${rootClass}--${kebabProp}");
              else expect(classes).not.toContain("${rootClass}--${kebabProp}");
            },
          },`;
    }
    return null;
  }

  if (prop.kind === "enum" && propName === "color") {
    return `          {
            name: "resuelve el color como token CSS",
            run({ wrapper, expect }, variant) {
              const color = variant.props?.color as string | undefined;
              if (!color) return;
              expect(wrapper.html()).toContain(\`var(--cu-color-\${color}\`);
            },
          },`;
  }
  if ((propName === "to" || propName === "href") && /:href=/.test(source)) {
    return `          {
            name: "renderiza un <a> con href={${propName}}",
            run({ wrapper, expect }, variant) {
              const value = variant.props?.[${JSON.stringify(propName)}] as string | undefined;
              if (!value) return;
              const link = wrapper.find("a");
              expect(link.exists()).toBe(true);
              expect(link.attributes("href")).toBe(value);
            },
          },`;
  }
  if (hasClassPattern(propName)) {
    return `          {
            name: "aplica la clase ${rootClass}--{${propName}}",
            run({ wrapper, expect }, variant) {
              const value = variant.props?.[${JSON.stringify(propName)}] as string | undefined;
              if (!value) return;
              expect(wrapper.find(".${rootClass}").classes()).toContain(\`${rootClass}--\${value}\`);
            },
          },`;
  }
  return null;
}

const previews = [];

/**
 * Preview interactivo declarativo (config `sections.<id>.preview`).
 * Receta `async-click`: al hacer click activa la prop (default `loading`)
 * durante `duration` ms y vuelve sola. Una entrada por botón.
 *
 * `mode: "append"` (default) agrega el ejemplo interactivo DESPUÉS de los
 * variants estáticos de la sección (`extra`); `mode: "replace"` reemplaza
 * todo el preview (`preview`).
 */
function previewFor(section) {
  const preview = storyConfig.sections?.[section.id]?.preview;
  if (!preview || preview.recipe !== "async-click") return null;

  const append = preview.mode !== "replace";
  const componentName = `${name}${capital(section.id)}${append ? "Extra" : "Preview"}`;
  const prop = preview.prop ?? "loading";
  const duration = preview.duration ?? 1500;
  const entries = preview.entries?.length
    ? preview.entries
    : [{ idle: preview.idleLabel ?? sample, active: preview.activeLabel ?? "Cargando…", props: preview.props ?? {} }];

  previews.push(`const ${componentName} = defineComponent({
  name: ${JSON.stringify(componentName)},
  setup() {
    const entries: Array<{ idle: string; active: string; props?: Record<string, unknown> }> = ${JSON.stringify(entries)};
    const loading = ref(entries.map(() => false));
    const trigger = (index: number) => {
      loading.value[index] = true;
      setTimeout(() => {
        loading.value[index] = false;
      }, ${duration});
    };
    return () =>
      entries.map((entry, index) =>
        h(
          ${name},
          { ...(entry.props ?? {}), ${prop}: loading.value[index], onClick: () => trigger(index) },
          () => (loading.value[index] ? entry.active : entry.idle),
        ),
      );
  },
});`);
  return { componentName, append };
}

const sectionsSource = sections
  .map((section) => {
    const lines = [];
    lines.push("    {");
    lines.push(`      id: ${JSON.stringify(section.id)},`);
    lines.push(`      title: ${JSON.stringify(section.title)},`);
    if (section.badge) lines.push(`      badge: ${JSON.stringify(section.badge)},`);
    if (section.badgeTitle) lines.push(`      badgeTitle: ${JSON.stringify(section.badgeTitle)},`);
    if (section.layout === "col") lines.push(`      layout: "col",`);
    const previewInfo = previewFor(section);
    if (previewInfo) {
      lines.push(`      ${previewInfo.append ? "extra" : "preview"}: ${previewInfo.componentName},`);
    }
    lines.push(`      variants: [`);
    lines.push(
      ...section.variants.map((variant) => {
        const parts = [`id: ${JSON.stringify(variant.id)}`];
        if (Object.keys(variant.props ?? {}).length) parts.push(`props: ${JSON.stringify(variant.props)}`);
        if (Object.keys(variant.slots ?? {}).length) parts.push(`slots: ${JSON.stringify(variant.slots)}`);
        return `        { ${parts.join(", ")} },`;
      }),
    );
    lines.push(`      ],`);
    lines.push(`      vue: ${tpl(snippetFor(section.variants, false))},`);
    if (isPublic) {
      lines.push(`      vanilla: ${tpl(snippetFor(section.variants, true))},`);
    }
    lines.push(`      checks: {`);
    lines.push(`        l1: [`);
    const checks = section.checks
      .map((key) => (key === "root" || key === "slot" ? null : emitPropCheck(section, key)))
      .filter(Boolean);
    lines.push(KNOWN_CHECKS.root(section));
    const slotCheck = section.variants.some((v) => typeof v.slots?.default === "string" && v.slots.default);
    if (slotCheck) lines.push(KNOWN_CHECKS.slot());
    lines.push(...checks);
    lines.push(`          // TODO: checks específicos (eventos, exposes)${emits.length ? ` — emite: ${emits.join(", ")}` : ""}.`);
    lines.push(`        ],`);
    lines.push(`      },`);
    lines.push("    },");
    return lines.join("\n");
  })
  .join("\n\n");

const header = [
  `// Generado por tools/stories/generate.mjs a partir de las props de ${name}.vue.`,
  emits.length ? `// Eventos detectados: ${emits.join(", ")}` : "// (sin eventos declarados)",
  "",
].join("\n");

const story = `${header}
${previews.length ? 'import { defineComponent, h, ref } from "vue";\n' : ""}import ${name} from "${`@/${componentPath.replace(/^src\//, "")}`}";
import type { ComponentStory } from "@/stories/types";
${hasExtras ? `import { extras } from "./${name}.stories.extras";\n` : ""}
${previews.join("\n\n")}${previews.length ? "\n\n" : ""}export const ${`cu${name}Stories`}: ComponentStory = {
  component: ${JSON.stringify(tag)},
  vue: ${name},
${metaLines.length ? metaLines.join("\n") + "\n" : ""}${hasExtras ? "  extras,\n" : ""}  sections: [
${sectionsSource}
  ],
};
`;

const test = `import { ${`cu${name}Stories`} } from "./${name}.stories";
import { runL1Story } from "@/stories/runner.l1";

runL1Story(${`cu${name}Stories`});
`;

mkdirSync(resolve(ROOT, storyDir), { recursive: true });
writeFileSync(resolve(ROOT, storyPath), story);
writeFileSync(resolve(ROOT, testPath), test);

// ── Reporte ─────────────────────────────────────────────────────────────────

console.log(`✅ ${storyPath}`);
console.log(`✅ ${testPath}`);
console.log("");
console.log(`Props detectadas (${props.length}):`);
for (const prop of props) {
  const detail = prop.kind === "enum" ? `[${prop.values.join(", ")}]` : prop.kind;
  console.log(`  - ${prop.name}: ${detail}${prop.default !== undefined ? ` (default: ${prop.default})` : ""}`);
}
console.log("");
console.log(`Secciones generadas (${sections.length}): ${sections.map((s) => `${s.title} (${s.variants.length})`).join(", ")}`);
if (emits.length) console.log(`Eventos: ${emits.join(", ")} (checks TODO)`);
