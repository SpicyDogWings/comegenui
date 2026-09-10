#!/usr/bin/env node
// src/plugins/cu-playground/cli/generate.mjs — Genera/actualiza la story de un
// componente leyendo su contrato directo del `.vue` (props, emits, exposes,
// slots, tokens y sub-componentes) vía `vue/compiler-sfc`.
//
// Uso:
//   pnpm cu-playground:generate Button            # story + test desde props
//   pnpm cu-playground:generate Button --meta-only # solo tokens/api
//   pnpm cu-playground:generate --all             # todos los componentes
//   pnpm cu-playground:generate Button --pages     # + página física editable
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import fg from "fast-glob";
import { parseComponent } from "./parse-sfc.mjs";

const ROOT = process.cwd();
const args = process.argv.slice(2);
const force = args.includes("--force");
const metaOnly = args.includes("--meta-only");
const all = args.includes("--all");
const withPages = args.includes("--pages");
const noPages = args.includes("--no-pages");
const pageIndex = args.indexOf("--page");
const pageName = pageIndex >= 0 ? args[pageIndex + 1] : undefined;
const name = args.find((a) => !a.startsWith("--") && a !== pageName);

// ── Configuración (cu-playground.config.json) ───────────────────────────────
const globalConfigPath = resolve(ROOT, "cu-playground.config.json");
let userConfig = {};
if (existsSync(globalConfigPath)) {
  try {
    userConfig = JSON.parse(readFileSync(globalConfigPath, "utf-8"));
  } catch (error) {
    console.error(`⚠️  cu-playground.config.json inválido: ${error.message}`);
  }
}
const componentsDir = (userConfig.componentsDir ?? "src/components").replace(/\/+$/, "");
const storiesDirBase = (userConfig.storiesDir ?? "src/stories").replace(/\/+$/, "");
const playgroundDir = (userConfig.playgroundDir ?? "src/playground").replace(/\/+$/, "");
const base = (userConfig.base ?? "/playground/components").replace(/\/+$/, "");
const configExclude = new Set(userConfig.exclude ?? []);
const generatePages = withPages || (!noPages && userConfig.pages === true);

// ── Helpers de texto ────────────────────────────────────────────────────────
function capital(value) {
  return value.charAt(0).toUpperCase() + value.slice(1);
}
function camelToKebab(value) {
  return value.replace(/([a-z0-9])([A-Z])/g, "$1-$2").toLowerCase();
}
function slug(value) {
  return String(value)
    .replace(/([a-z0-9])([A-Z])/g, "$1-$2")
    .replace(/[^a-zA-Z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .toLowerCase();
}
function tpl(value) {
  return "`" + value.replace(/`/g, "\\`").replace(/\$\{/g, "\\${") + "`";
}

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
  FloatingButton: "+",
};

/** Serializa una constante a un campo indentado de la story. */
function field(name, value, level = 1) {
  const pad = "  ".repeat(level);
  const lines = JSON.stringify(value, null, 2).split("\n");
  return (
    lines
      .map((line, index) => (index === 0 ? `${pad}${name}: ${line}` : `${pad}${line}`))
      .join("\n") + ","
  );
}

/** Lee un valor balanceado (`[...]`, `{...}`, `(...)` o backtick) desde `start`. */
function readValue(src, start) {
  const first = src[start];
  if (first === "`") {
    for (let i = start + 1; i < src.length; i++) if (src[i] === "`") return src.slice(start, i + 1);
    return null;
  }
  const pairs = { "[": "]", "{": "}", "(": ")" };
  if (!pairs[first]) return null;
  const stack = [];
  for (let i = start; i < src.length; i++) {
    const char = src[i];
    if (char === '"' || char === "'" || char === "`") {
      const q = char;
      for (i++; i < src.length; i++) {
        if (src[i] === "\\") i++;
        else if (src[i] === q) break;
      }
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

/**
 * Descripciones existentes por sub-array de `api` (para no pisarlas al
 * regenerar). Devuelve `{ props, slots, events, exposes }` → Map(name → desc).
 */
function existingApiRows(src) {
  const result = { props: new Map(), slots: new Map(), events: new Map(), exposes: new Map() };
  for (const key of Object.keys(result)) {
    const match = new RegExp(`(?:^|[\\s{,])["']?${key}["']?\\s*:\\s*\\[`).exec(src);
    if (!match) continue;
    const start = src.indexOf("[", match.index);
    const block = readValue(src, start);
    if (!block) continue;
    for (const entry of block.matchAll(/name:\s*['"]([^'"]+)['"]([^}]*?)description:\s*['"]([^'"]*)['"]/g)) {
      result[key].set(entry[1], entry[3]);
    }
  }
  return result;
}

/** Extrae un array `{ label, path }` (components/subComponents) de una story. */
function existingDeps(src, key) {
  const match = new RegExp(`${key}\\s*:\\s*\\[`).exec(src);
  if (!match) return [];
  const start = src.indexOf("[", match.index);
  const block = readValue(src, start);
  if (!block) return [];
  return [...block.matchAll(/\{\s*label:\s*['"]([^'"]+)['"][^}]*?path:\s*['"]([^'"]+)['"]/g)].map(
    (m) => ({ label: m[1], path: m[2] }),
  );
}

// ── Generación de una story ─────────────────────────────────────────────────
function generateOne(componentName) {
  const componentPath = fg.sync(`${componentsDir}/**/${componentName}.vue`, {
    ignore: ["**/customElements/**"],
  })[0];
  if (!componentPath) {
    console.error(`❌ No se encontró ${componentsDir}/**/${componentName}.vue`);
    return false;
  }

  const source = readFileSync(resolve(ROOT, componentPath), "utf-8");
  const parts = componentPath.split("/");
  const category = parts[2] === `${componentName}.vue` ? "" : parts[2];
  const storyDir = category ? `${storiesDirBase}/${category}` : storiesDirBase;
  const kebab = camelToKebab(componentName);
  const tag = `cu-${kebab}`;
  const storyPath = `${storyDir}/${componentName}.stories.ts`;
  const testPath = `${storyDir}/${componentName}.l1.test.ts`;
  const libEntry = fg.sync(`src/lib/**/${kebab}.ts`)[0];
  const isPublic = Boolean(libEntry);

  // Contrato del componente, leído del `.vue` real.
  const contract = parseComponent(resolve(ROOT, componentPath), source);
  const props = contract.props;
  const emits = contract.emits;
  const sample = SLOT_SAMPLES[componentName] ?? componentName;
  const hasDefaultSlot = contract.hasDefaultSlot;
  const rootClass = `cu-${kebab}`;
  const hasRootClass = source.includes(rootClass);

  // ── Config por componente ─────────────────────────────────────────────────
  const configPath = resolve(ROOT, storyDir, `${componentName}.stories.config.json`);
  let storyConfig = {};
  if (existsSync(configPath)) {
    try {
      storyConfig = JSON.parse(readFileSync(configPath, "utf-8"));
    } catch (error) {
      console.error(`⚠️  ${componentName}.stories.config.json inválido: ${error.message}`);
    }
  }

  const asOverride = (value) => (typeof value === "string" ? { description: value } : value ?? {});
  const apiConfig = storyConfig.api ?? {};

  // Story existente: preservar descripciones y deps curadas al regenerar.
  const existingSource = existsSync(resolve(ROOT, storyPath))
    ? readFileSync(resolve(ROOT, storyPath), "utf-8")
    : "";
  const existing = existingApiRows(existingSource);

  const propsRows = props.map((prop) => {
    const override = asOverride(apiConfig.props?.[prop.name]);
    const description = override.description ?? existing.props.get(prop.name);
    return {
      name: prop.name,
      type: override.type ?? prop.type,
      ...(override.default !== undefined || prop.default !== undefined
        ? { default: override.default ?? prop.default }
        : {}),
      ...(description ? { description } : {}),
    };
  });
  const slotsRows = contract.slots.map((slot) => {
    const override = asOverride(apiConfig.slots?.[slot.name]);
    const description = override.description ?? existing.slots.get(slot.name);
    return { name: slot.name, ...(description ? { description } : {}) };
  });
  const eventsRows = emits.map((emit) => {
    const override = asOverride(apiConfig.events?.[emit.name]);
    const description = override.description ?? existing.events.get(emit.name);
    return {
      name: emit.name,
      type: override.type ?? emit.type,
      ...(description ? { description } : {}),
    };
  });
  const exposesRows = contract.exposes.map((expose) => {
    const override = asOverride(apiConfig.exposes?.[expose.name]);
    const description = override.description ?? existing.exposes.get(expose.name);
    return {
      name: expose.name,
      type: override.type ?? expose.type,
      ...(description ? { description } : {}),
    };
  });
  const componentRows =
    storyConfig.components ??
    (contract.components.length ? contract.components : existingDeps(existingSource, "components"));
  const tokenRows = storyConfig.tokens ?? contract.tokens;
  const subComponentRows = storyConfig.subComponents ?? existingDeps(existingSource, "subComponents");

  const api = {};
  if (componentRows.length) api.components = componentRows;
  if (propsRows.length) api.props = propsRows;
  if (slotsRows.length) api.slots = slotsRows;
  if (eventsRows.length) api.events = eventsRows;
  if (exposesRows.length) api.exposes = exposesRows;
  if (storyConfig.interfaceCode) api.interfaceCode = storyConfig.interfaceCode;

  const metaLines = [];
  if (tokenRows.length) metaLines.push(field("tokens", tokenRows));
  if (subComponentRows.length) metaLines.push(field("subComponents", subComponentRows));
  if (Object.keys(api).length) metaLines.push(field("api", api));

  /** Emite la página física opcional (la usa el plugin como override). */
  function emitPage() {
    const pageFile = pageName ?? componentName;
    const pagePath = `${playgroundDir}/${pageFile}.vue`;
    const storyImport = `@/${storyPath.replace(/^src\//, "").replace(/\.ts$/, "")}`;
    if (!force && existsSync(resolve(ROOT, pagePath))) {
      console.log(`• ${pagePath} ya existe (no se pisa; usá --force)`);
      return;
    }
    const page = `<!-- Página física generada por cu-playground. Editala a gusto:
     si existe, el plugin la usa en lugar de la página genérica. -->
<script setup lang="ts">
import PlaygroundLayout from "@/plugins/cu-playground/runtime/PlaygroundLayout.vue";
import StoryBody from "@/plugins/cu-playground/runtime/StoryBody.vue";
import { buildOutline } from "@/plugins/cu-playground/runtime/outline";
import { ${`cu${componentName}Stories`} } from "${storyImport}";

const outlineItems = buildOutline(${`cu${componentName}Stories`});
</script>

<template>
  <PlaygroundLayout title="${pageFile}" :outlineItems="outlineItems">
    <StoryBody :story="${`cu${componentName}Stories`}" />
    <!-- Agregá acá secciones custom (con id propio para el outline). -->
  </PlaygroundLayout>
</template>
`;
    mkdirSync(resolve(ROOT, playgroundDir), { recursive: true });
    writeFileSync(resolve(ROOT, pagePath), page);
    console.log(`✅ ${pagePath}`);
  }

  // ── Modo --meta-only ──────────────────────────────────────────────────────
  if (metaOnly) {
    if (!existsSync(resolve(ROOT, storyPath))) {
      console.error(`❌ No existe ${storyPath} para actualizar metadata.`);
      return false;
    }
    function removeField(src, fieldName) {
      const match = new RegExp(`\\n  ${fieldName}: `).exec(src);
      if (!match) return src;
      const valueStart = match.index + match[0].length;
      const value = readValue(src, valueStart);
      if (!value) return src;
      let end = valueStart + value.length;
      if (src[end] === ",") end++;
      return src.slice(0, match.index) + src.slice(end);
    }

    let updated = readFileSync(resolve(ROOT, storyPath), "utf-8");
    for (const f of ["tokens", "subComponents", "api"]) updated = removeField(updated, f);
    const anchor = new RegExp(`(vue:\\s*${componentName},)`);
    if (!anchor.test(updated)) {
      console.error(`⚠️  No se encontró 'vue: ${componentName},' en ${storyPath}; no se insertó metadata.`);
      return false;
    }
    const block = metaLines.length ? "\n" + metaLines.join("\n") : "";
    writeFileSync(resolve(ROOT, storyPath), updated.replace(anchor, `$1${block}`));
    console.log(`✅ ${storyPath} (metadata: ${metaLines.length ? metaLines.map((l) => l.trim().split(":")[0]).join(", ") : "sin campos"})`);
    if (generatePages) emitPage();
    return true;
  }

  // ── Story completa ────────────────────────────────────────────────────────
  if (!force && existsSync(resolve(ROOT, storyPath))) {
    console.error(`❌ Ya existe ${storyPath}. Usá --force para regenerar.`);
    return false;
  }

  const requiredStringDefaults = Object.fromEntries(
    props.filter((prop) => prop.kind === "string" && prop.required).map((prop) => [prop.name, sample]),
  );

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
        return `  <${componentName}${attrs}>${slot}</${componentName}>`;
      })
      .join("\n");
  }

  const sections = [];
  sections.push({
    id: "default",
    title: "Default",
    variants: [
      hasDefaultSlot
        ? { id: "default", props: { ...requiredStringDefaults }, slots: { default: sample } }
        : { id: "default", props: { ...requiredStringDefaults } },
    ],
    checks: hasDefaultSlot ? ["root", "slot"] : ["root"],
  });

  for (const prop of props) {
    if (prop.kind === "enum" && prop.values?.length) {
      const id = camelToKebab(prop.name);
      const variants = prop.values.map((value) => {
        const variant = { id: camelToKebab(value), props: { ...requiredStringDefaults, [prop.name]: value } };
        if (hasDefaultSlot) {
          variant.slots = { default: prop.name === "color" || prop.name === "variant" ? capital(value) : String(value) };
        }
        return variant;
      });
      sections.push({
        id,
        title: SECTION_TITLES[prop.name] ?? capital(prop.name),
        badge: prop.default !== undefined ? String(prop.default) : undefined,
        badgeTitle: prop.default !== undefined ? `Default: ${prop.default}` : undefined,
        variants,
        checks: hasDefaultSlot ? ["root", "slot", prop.name] : ["root", prop.name],
      });
    } else if (prop.kind === "boolean") {
      const id = camelToKebab(prop.name);
      const variants = [
        { id: "false", props: { ...requiredStringDefaults, [prop.name]: false } },
        { id: "true", props: { ...requiredStringDefaults, [prop.name]: true } },
      ];
      if (hasDefaultSlot) variants.forEach((variant) => (variant.slots = { default: sample }));
      sections.push({
        id,
        title: capital(prop.name),
        badge: prop.default !== undefined ? String(prop.default) : undefined,
        badgeTitle: prop.default !== undefined ? `Default: ${prop.default}` : undefined,
        variants,
        checks: hasDefaultSlot ? ["root", "slot", prop.name] : ["root", prop.name],
      });
    } else if (prop.kind === "string" && ["label", "title", "placeholder", "text"].includes(prop.name)) {
      const id = camelToKebab(prop.name);
      const variants = [
        { id: "with-value", props: { ...requiredStringDefaults, [prop.name]: sample } },
        ...(prop.required ? [] : [{ id: "empty", props: { ...requiredStringDefaults } }]),
      ];
      if (hasDefaultSlot) variants.forEach((variant) => (variant.slots = { default: sample }));
      sections.push({
        id,
        title: capital(prop.name),
        variants,
        checks: hasDefaultSlot ? ["root", "slot", prop.name] : ["root", prop.name],
      });
    }
  }

  const include = storyConfig.include;
  const exclude = new Set(storyConfig.exclude ?? []);
  let finalSections = sections.filter(
    (section) => (!include || include.includes(section.id)) && !exclude.has(section.id),
  );

  if (storyConfig.attrs) {
    for (const section of finalSections) {
      section.variants = section.variants.map((variant) => ({
        ...variant,
        attrs: { ...(variant.attrs ?? {}), ...storyConfig.attrs },
      }));
    }
  }

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
    if (overrides.extraAttrs) {
      section.variants = section.variants.map((variant) => ({
        ...variant,
        attrs: { ...(variant.attrs ?? {}), ...overrides.extraAttrs },
      }));
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

  // ── Checks ────────────────────────────────────────────────────────────────
  const KNOWN_CHECKS = {
    root: () =>
      hasRootClass
        ? `          {
            name: "renderiza .${rootClass}",
            run({ wrapper, expect }) {
              expect(wrapper.find(".${rootClass}").exists()).toBe(true);
            },
          },`
        : `          {
            name: "renderiza el componente",
            run({ wrapper, expect }) {
              expect(wrapper.html()).not.toBe("");
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

  function hasClassPattern(propName) {
    return new RegExp(`--\\$\\{(?:props\\.)?${propName}\\}`).test(source) || source.includes(`--${propName}`);
  }

  function emitPropCheck(propName) {
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
  function previewFor(section) {
    const preview = storyConfig.sections?.[section.id]?.preview;
    if (!preview || preview.recipe !== "async-click") return null;
    const append = preview.mode !== "replace";
    const componentName = `${componentName}${capital(section.id)}${append ? "Extra" : "Preview"}`;
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
          ${componentName},
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
      if (previewInfo) lines.push(`      ${previewInfo.append ? "extra" : "preview"}: ${previewInfo.componentName},`);
      lines.push(`      variants: [`);
      lines.push(
        ...section.variants.map((variant) => {
          const parts = [`id: ${JSON.stringify(variant.id)}`];
          if (Object.keys(variant.props ?? {}).length) parts.push(`props: ${JSON.stringify(variant.props)}`);
          if (Object.keys(variant.attrs ?? {}).length) parts.push(`attrs: ${JSON.stringify(variant.attrs)}`);
          if (Object.keys(variant.slots ?? {}).length) parts.push(`slots: ${JSON.stringify(variant.slots)}`);
          return `        { ${parts.join(", ")} },`;
        }),
      );
      lines.push(`      ],`);
      lines.push(`      vue: ${tpl(snippetFor(section.variants, false))},`);
      if (isPublic) lines.push(`      vanilla: ${tpl(snippetFor(section.variants, true))},`);
      lines.push(`      checks: {`);
      lines.push(`        l1: [`);
      const checks = section.checks
        .map((key) => (key === "root" || key === "slot" ? null : emitPropCheck(key)))
        .filter(Boolean);
      lines.push(KNOWN_CHECKS.root(section));
      const slotCheck = section.variants.some((v) => typeof v.slots?.default === "string" && v.slots.default);
      if (slotCheck) lines.push(KNOWN_CHECKS.slot());
      lines.push(...checks);
      lines.push(`          // TODO: checks específicos (eventos, exposes)${emits.length ? ` — emite: ${emits.map((e) => e.name).join(", ")}` : ""}.`);
      lines.push(`        ],`);
      lines.push(`      },`);
      lines.push("    },");
      return lines.join("\n");
    })
    .join("\n\n");

  const extrasPath = resolve(ROOT, storyDir, `${componentName}.stories.extras.ts`);
  const hasExtras = existsSync(extrasPath);
  const runtimePath = resolve(ROOT, storyDir, `${componentName}.stories.runtime.ts`);
  const hasRuntime = existsSync(runtimePath);

  const header = [
    `// Generado por src/plugins/cu-playground/cli/generate.mjs a partir del contrato de ${componentName}.vue.`,
    emits.length ? `// Eventos detectados: ${emits.map((e) => e.name).join(", ")}` : "// (sin eventos declarados)",
    "",
  ].join("\n");

  const story = `${header}
${previews.length ? 'import { defineComponent, h, ref } from "vue";\n' : ""}import ${componentName} from "${`@/${componentPath.replace(/^src\//, "")}`}";
import type { ComponentStory } from "@/stories/types";
${hasExtras ? `import { extras } from "./${componentName}.stories.extras";\n` : ""}${hasRuntime ? `import { setup, global } from "./${componentName}.stories.runtime";\n` : ""}
${previews.join("\n\n")}${previews.length ? "\n\n" : ""}export const ${`cu${componentName}Stories`}: ComponentStory = {
  component: ${JSON.stringify(tag)},
  vue: ${componentName},
${hasRuntime ? "  setup,\n  global,\n" : ""}${metaLines.length ? metaLines.join("\n") + "\n" : ""}${hasExtras ? "  extras,\n" : ""}  sections: [
${sectionsSource}
  ],
};
`;

  const test = `import { ${`cu${componentName}Stories`} } from "./${componentName}.stories";
import { runL1Story } from "@/stories/runner.l1";

runL1Story(${`cu${componentName}Stories`});
`;

  mkdirSync(resolve(ROOT, storyDir), { recursive: true });
  writeFileSync(resolve(ROOT, storyPath), story);
  writeFileSync(resolve(ROOT, testPath), test);

  // ── Página física opcional ────────────────────────────────────────────────
  if (generatePages) emitPage();

  // ── Reporte ───────────────────────────────────────────────────────────────
  console.log(`✅ ${storyPath}`);
  console.log(`✅ ${testPath}`);
  console.log(`   props: ${props.length} · emits: ${emits.length} · exposes: ${contract.exposes.length} · slots: ${contract.slots.length} · tokens: ${tokenRows.length}`);
  console.log(`   secciones: ${sections.map((s) => `${s.title} (${s.variants.length})`).join(", ")}`);
  return true;
}

// ── Entry point ─────────────────────────────────────────────────────────────
if (all) {
  const files = fg.sync(`${componentsDir}/**/*.vue`, {
    ignore: ["**/customElements/**", "**/icons/**", "**/lab/**", "**/legacy/**", "**/archived/**"],
  });
  const names = files
    .map((file) => file.split("/").pop().replace(/\.vue$/, ""))
    .filter((n) => !n.includes(".test") && !configExclude.has(n))
    .sort();
  console.log(`▶ Generando ${names.length} componentes…\n`);
  const results = names.map((n) => generateOne(n));
  const ok = results.filter(Boolean).length;
  console.log(`\n✔ ${ok}/${names.length} ok`);
} else if (name) {
  generateOne(name);
} else {
  console.error("Uso: cu-playground generate <Componente> [--force] [--meta-only] [--pages] [--all]");
  process.exit(1);
}
