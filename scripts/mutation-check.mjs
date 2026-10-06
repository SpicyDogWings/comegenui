#!/usr/bin/env node
// scripts/mutation-check.mjs — LA prueba de fuego contra falsos verdes.
//
// Un test que "da verde" no sirve si sigue verde cuando el componente está roto.
// Este script aplica mutaciones conocidas (una por una), corre el test DEL
// COMPONENTE mutado (no la suite entera), y FALLA si alguna mutación no es
// detectada. Cada mutación declara en qué archivo y qué cambio rompe el
// comportamiento; si el cambio se aplica pero los tests siguen pasando, el test
// que "cubría" eso es un falso verde.
//
//   node scripts/mutation-check.mjs                 # todas
//   node scripts/mutation-check.mjs --solo alert    # las que matcheen
//   node scripts/mutation-check.mjs --list          # lista sin correr
//   node scripts/mutation-check.mjs --json
import { readFileSync, writeFileSync, existsSync, mkdirSync, unlinkSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");

// Si nos matan a mitad de una mutación (SIGKILL no se puede atrapar y `spawnSync`
// bloquea el event loop), dejamos el original acá para repararlo en la próxima corrida.
const PENDING = resolve(ROOT, "node_modules/.cache/comegen-mutation-pending.json");

/**
 * Cada mutación: `find`/`replace` en `file`, y qué test debería caer.
 * El test se deriva de `file` (`.vue` → `.test.ts`); override explícito con `test`.
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
    id: "alert-close-cabecera-sin-titulo",
    file: "src/components/information/Alert.vue",
    expect: "sin título, el close no genera una cabecera propia",
    find: `<div v-if="props.title || hasIcon" class="cu-alert-header">`,
    replace: `<div v-if="props.title || props.close || hasIcon" class="cu-alert-header">`,
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
  {
    id: "card-ignores-media-slot",
    file: "src/components/information/Card.vue",
    expect: "el slot media tiene prioridad sobre la prop image",
    find: `const hasMedia = computed(() => slotHasContent('media'));`,
    replace: `const hasMedia = computed(() => false);`,
  },
  {
    id: "author-card-bad-initials",
    file: "src/components/information/AuthorCard.vue",
    expect: "genera iniciales de nombre y apellido (primera y última palabra)",
    find: `    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();`,
    replace: `    return (parts[0][0] + parts[0][0]).toUpperCase();`,
  },
  {
    id: "avatar-ignores-size",
    file: "src/components/information/Avatar.vue",
    expect: "aplica la clase del tamaño sm/lg",
    find: `const sizeClass = computed(() => \`cu-avatar--\${props.size}\`);`,
    replace: `const sizeClass = computed(() => \`cu-avatar--md\`);`,
  },
  {
    id: "badge-ignores-variant",
    file: "src/components/information/Badge.vue",
    expect: "aplica la clase de cada variante visual",
    find: "  <span :class=\"['cu-badge', `cu-badge--${props.variant}`]\" :style=\"badgeStyles\">",
    replace: "  <span :class=\"['cu-badge', `cu-badge--soft`]\" :style=\"badgeStyles\">",
  },
  {
    id: "loader-ignores-delay",
    file: "src/components/information/Loader.vue",
    expect: "propaga delay en ms a la CSS var",
    find: `  "--cu-loader-delay": \`\${props.delay}ms\`,`,
    replace: `  "--cu-loader-delay": \`2000ms\`,`,
  },
  {
    id: "label-no-focus-on-for",
    file: "src/components/form/Label.vue",
    expect: "con `for` enfoca el elemento con ese id",
    find: `    if (target) target.focus();`,
    replace: `    if (target) { /* mutado */ }`,
  },
  {
    id: "tooltip-drops-text-fallback",
    file: "src/components/overlay/Tooltip.vue",
    expect: "usa la prop text cuando no hay slot content",
    find: `    <slot name="content">{{ text }}</slot>`,
    replace: `    <slot name="content"></slot>`,
  },
  {
    id: "collapse-no-toggle-emit",
    file: "src/components/overlay/Collapse.vue",
    expect: "click en el trigger alterna y emite toggle con el nuevo estado",
    find: `  isOpen.value = value
  emit('toggle', value)`,
    replace: `  isOpen.value = value
  /* mutado */`,
  },
  {
    id: "side-over-persistent-ignored",
    file: "src/components/overlay/SideOver.vue",
    expect: "persistent no se cierra por backdrop ni Escape",
    find: `  if (props.persistent) return`,
    replace: `  if (false) return`,
  },
  {
    id: "command-palette-run-no-action",
    file: "src/components/overlay/CommandPalette.vue",
    expect: "run() ejecuta la action del comando",
    find: `  cmd.action();
  emit("select", cmd);
  return cmd;`,
    replace: `  emit("select", cmd);
  return cmd;`,
  },
  {
    id: "select-on-select-no-update",
    file: "src/components/form/Select.vue",
    expect: "seleccionar una opción emite update:modelValue y select",
    find: `function onSelect(option: SelectOption) {
  if (option.disabled) return;
  selectedValue.value = option.value;
  emit("update:modelValue", option.value);
  emit("select", option);
  emit("change", option.value);
  dropdownRef.value?.close();
}`,
    replace: `function onSelect(option: SelectOption) {
  if (option.disabled) return;
  selectedValue.value = option.value;
  dropdownRef.value?.close();
}`,
  },
  {
    id: "select-on-select-no-change",
    file: "src/components/form/Select.vue",
    expect: "seleccionar una opción emite change",
    find: `  emit("select", option);
  emit("change", option.value);`,
    replace: `  emit("select", option);`,
  },
  {
    id: "select-set-no-change",
    file: "src/components/form/Select.vue",
    expect: "set() emite change",
    find: `function set(value: string) { selectedValue.value = value; emit("change", value); }`,
    replace: `function set(value: string) { selectedValue.value = value; }`,
  },
  {
    id: "select-reset-no-change",
    file: "src/components/form/Select.vue",
    expect: "reset() emite change",
    find: `function reset() { selectedValue.value = ""; emit("change", ""); }`,
    replace: `function reset() { selectedValue.value = ""; }`,
  },
  {
    id: "checkbox-set-not-emit-change",
    file: "src/components/form/Checkbox.vue",
    expect: "set() emite change",
    find: `  set: (value: boolean) => {
    checked.value = value;
    emit("change", { target: { checked: value } });
  },`,
    replace: `  set: (value: boolean) => {
    checked.value = value;
  },`,
  },
  {
    id: "switch-toggle-no-emit",
    file: "src/components/form/Switch.vue",
    expect: "cambiar el switch emite change",
    find: `  const value = next ?? !checked.value;
  if (value === checked.value) return;
  checked.value = value;
  emit("change", value);
};`,
    replace: `  const value = next ?? !checked.value;
  if (value === checked.value) return;
  checked.value = value;
};`,
  },
  {
    id: "textarea-reset-keeps-value",
    file: "src/components/form/Textarea.vue",
    expect: "reset() limpia el textarea",
    find: `const reset = () => { value.value = ""; };`,
    replace: `const reset = () => { /* mutado */ };`,
  },
  {
    id: "color-picker-text-accepts-invalid",
    file: "src/components/form/ColorPicker.vue",
    expect: "el campo de texto solo confirma un hex válido",
    find: `  if (/^#[0-9a-fA-F]{6}$/.test(hex)) {
    value.value = hex;
    emit("change", hex);
  }`,
    replace: `  value.value = hex;
  emit("change", hex);`,
  },
  {
    id: "file-input-accept-ignored",
    file: "src/components/form/FileInput.vue",
    expect: "un archivo que no cumple accept se rechaza",
    find: `function matchesAccept(file: File): boolean {
  if (!props.accept) return true;`,
    replace: `function matchesAccept(file: File): boolean {
  if (true) return true;`,
  },
  {
    id: "file-zone-single-keeps-array",
    file: "src/components/form/FileInputZone.vue",
    expect: "sin multiple/directory se guarda un solo File, no un array",
    find: `  if (effectiveMultiple.value) {
    value.value = validFiles;
  } else {
    value.value = validFiles[0];
  }`,
    replace: `  value.value = validFiles;`,
  },
  {
    id: "cells-importer-set-no-parse",
    file: "src/components/form/CellsImporter.vue",
    expect: "set() del importer parsea el archivo (watcher sobre file)",
    find: `watch(file, handleFileChange);`,
    replace: `// watch(file, handleFileChange);`,
  },
  {
    id: "popover-disabled-blocks-open",
    file: "src/components/overlay/Popover.vue",
    expect: "con disabled el popover no abre",
    find: `function open() {
  if (props.disabled) return;`,
    replace: `function open() {`,
  },
  {
    id: "dropdown-item-click-no-close",
    file: "src/components/overlay/Dropdown.vue",
    expect: "click en un item del dropdown cierra el panel",
    find: `  if (item.onClick) item.onClick();
  popoverRef.value?.close();
}`,
    replace: `  if (item.onClick) item.onClick();
}`,
  },
  {
    id: "dropdown-menu-disabled-item-fires",
    file: "src/components/controls/DropdownMenu.vue",
    expect: "un item disabled no dispara onClick",
    find: `  if (item.disabled || item.divider) return;`,
    replace: `  if (item.divider) return;`,
  },
  {
    id: "pagination-pagesize-no-reset",
    file: "src/components/controls/Pagination.vue",
    expect: "cambiar el tamaño de página resetea a la página 1",
    find: `  emit("update:itemsPerPage", Number(val));
  emit("update:currentPage", 1);`,
    replace: `  emit("update:itemsPerPage", Number(val));`,
  },
  {
    id: "table-rowdisabled-ignores-fn",
    file: "src/components/data/Table.vue",
    expect: "rowDisabled como función deshabilita las filas que cumplen",
    find: `return typeof rd === "function" ? rd(row) : !!rd;`,
    replace: `return !!rd;`,
  },
  {
    id: "tabs-selects-disabled-tab",
    file: "src/components/Tabs.vue",
    expect: "una tab disabled no se activa al clickear",
    find: `if (!tab || tab.disabled) return;`,
    replace: `if (!tab) return;`,
  },
  {
    id: "navbar-compactable-ignores-toggle",
    file: "src/components/navigation/Navbar.vue",
    expect: "compactable alterna el modo compacto al clickear el botón",
    find: `const effectiveCompact = computed(() => (props.compactable ? localCompact.value : props.compact))`,
    replace: `const effectiveCompact = computed(() => props.compact)`,
  },
  {
    id: "navbar-horizontal-no-active",
    file: "src/components/navigation/NavbarHorizontal.vue",
    expect: "marca el item activo según la ruta",
    find: `:data-navbar-active="activeItem === item ? '' : undefined"
      >
        <span v-if="item.icon"`,
    replace: `:data-navbar-active="undefined"
      >
        <span v-if="item.icon"`,
  },
  {
    id: "navbar-list-collapsed-opens",
    file: "src/components/navigation/NavbarList.vue",
    expect: "collapsed inicia los submenús cerrados",
    find: `:defaultOpen="!collapsed"`,
    replace: `:defaultOpen="true"`,
  },
  {
    id: "navbar-menu-href-constant",
    file: "src/components/navigation/NavbarMenu.vue",
    expect: "un item hoja usa su path como href",
    find: `:href="item.path"`,
    replace: `href="#"`,
  },
  {
    id: "markdown-heading-ids-empty",
    file: "src/components/markdown/Markdown.vue",
    expect: "el parseo reporta y expone los ids de los encabezados",
    find: `headingIds.value = extractHeadingIds(parsed)`,
    replace: `headingIds.value = []`,
  },
  {
    id: "code-block-sin-clase-line-numbers",
    file: "src/components/markdown/CodeBlock.vue",
    expect: "`lineNumbers` agrega la clase y numera las líneas",
    find: `{ 'cu-code-block--line-numbers': props.lineNumbers },`,
    replace: `{ 'cu-code-block--line-numbers': false },`,
  },
  {
    id: "blockquote-color-fijo",
    file: "src/components/markdown/Blockquote.vue",
    expect: "aplica el color semántico pedido",
    find: "`cu-blockquote--${color}`",
    replace: "`cu-blockquote--primary`",
  },
  {
    id: "copy-button-no-confirma",
    file: "src/components/buttons/CopyButton.vue",
    expect: "tras copiar muestra el copiedLabel de confirmación",
    find: `copied.value = true;`,
    replace: `copied.value = false;`,
  },
  {
    id: "inline-renderer-strong-como-b",
    file: "src/components/markdown/InlineRenderer.vue",
    expect: "renderiza negrita como <strong>",
    find: "`<strong>${(token.tokens || []).map(tokenToHtml).join('')}</strong>`",
    replace: "`<b>${(token.tokens || []).map(tokenToHtml).join('')}</b>`",
  },
  {
    id: "month-slider-label-flecha-invertida",
    file: "src/components/controls/month-slider/MonthSliderLabel.vue",
    expect: "flecha derecha emite +steps",
    find: `@keydown.right.prevent="props.draggable && props.canNavigateNext && emit('navigate', props.steps)"`,
    replace: `@keydown.right.prevent="props.draggable && props.canNavigateNext && emit('navigate', -props.steps)"`,
  },
  {
    id: "year-slider-no-emite-change",
    file: "src/components/controls/YearSlider.vue",
    expect: "cambiar el año emite change",
    find: `  emit('update:modelValue', clamped)
  emit('change', clamped)`,
    replace: `  emit('update:modelValue', clamped)`,
  },
  {
    id: "theme-dropdown-no-aplica",
    file: "src/components/theme/ThemeDropdown.vue",
    expect: "click en un tema lo aplica al store",
    find: `  store.setTheme(name);`,
    replace: `  /* mutado */`,
  },
  {
    id: "toggle-color-sheme-no-togglea",
    file: "src/components/buttons/ToggleColorSheme.vue",
    expect: "click alterna el tema claro/oscuro",
    find: `  store.toggleLightDark()`,
    replace: `  /* mutado */`,
  },
  {
    id: "floating-button-variant-fija",
    file: "src/components/buttons/FloatingButton.vue",
    expect: "pasa la variante pedida al Button",
    find: `    :variant="props.variant"`,
    replace: `    variant="solid"`,
  },
  {
    id: "file-list-remove-index-mal",
    file: "src/components/FileList.vue",
    expect: "quitar un archivo emite remove con su índice",
    find: `@click.stop="emit('remove', i)"`,
    replace: `@click.stop="emit('remove', i + 1)"`,
  },
  {
    id: "autocomplete-set-abre-panel",
    file: "src/components/form/Autocomplete.vue",
    expect: "set() setea el texto sin abrir el panel",
    find: `function set(val: string) {
  searchValue.value = val;
}`,
    replace: `function set(val: string) {
  searchValue.value = val;
  if (inputRef.value) inputRef.value.set(val);
}`,
  },
];

export { MUTATIONS };

function main() {
const argv = process.argv.slice(2);
const only = argv.includes("--solo") ? argv[argv.indexOf("--solo") + 1] : null;
const asJson = argv.includes("--json");

const selected = MUTATIONS.filter((m) => !only || m.id.includes(only));

if (argv.includes("--list")) {
  for (const m of selected) console.log(`${m.id}\t${m.file}\t${m.expect}`);
  process.exit(0);
}

/** Deriva el test que debería detectar la mutación (override explícito con `m.test`). */
function testFileFor(m) {
  return m.test ?? m.file.replace(/\.vue$/, ".test.ts");
}

// Correr la suite ENTERA por cada mutación saturaba la máquina (43 × 65 archivos /
// 1644 tests × ~11 workers). Ahora se corre SOLO el test del componente mutado.
const MAX_WORKERS = process.env.MUT_MAX_WORKERS ?? "2";
const PER_TEST_TIMEOUT_MS = 120_000;

/** Corre SOLO el test del componente mutado; true si igual pasa (no detectó nada). */
function testsPass(m) {
  const res = spawnSync(
    "pnpm",
    ["exec", "vitest", "run", "--silent", `--maxWorkers=${MAX_WORKERS}`, testFileFor(m)],
    { cwd: ROOT, encoding: "utf-8", timeout: PER_TEST_TIMEOUT_MS },
  );
  if (res.error?.code === "ETIMEDOUT") {
    console.warn(
      `   ⏱️  ${testFileFor(m)} excedió ${PER_TEST_TIMEOUT_MS / 1000}s: lo trato como detectado.`,
    );
    return false;
  }
  return res.status === 0;
}

function applyMutation(m) {
  const path = resolve(ROOT, m.file);
  const original = readFileSync(path, "utf-8");
  if (!original.includes(m.find)) {
    return { ok: false, path, original };
  }
  writePending({ file: m.file, original });
  writeFileSync(path, original.replace(m.find, m.replace));
  return { ok: true, path, original };
}

/** Guarda el original en disco antes de mutar (por si nos interrumpen). */
function writePending(data) {
  mkdirSync(dirname(PENDING), { recursive: true });
  writeFileSync(PENDING, JSON.stringify(data));
}

function clearPending() {
  try {
    if (existsSync(PENDING)) unlinkSync(PENDING);
  } catch {
    /* noop */
  }
}

/** Repara una corrida anterior que quedó a mitad de una mutación. */
function healPending() {
  if (!existsSync(PENDING)) return;
  try {
    const { file, original } = JSON.parse(readFileSync(PENDING, "utf-8"));
    writeFileSync(resolve(ROOT, file), original);
    console.warn(`\n⚠️  Reparé ${file}: quedó mutado por una corrida interrumpida.\n`);
  } catch (e) {
    console.warn(`\n⚠️  No pude reparar ${PENDING}: ${e.message}\n`);
  }
  clearPending();
}

const results = [];
let pending = null; // restauración de la mutación en curso (por si nos interrumpen)
const restorePending = () => {
  if (pending) {
    try {
      writeFileSync(pending.path, pending.original);
    } catch {
      /* noop */
    }
    pending = null;
  }
};
process.on("SIGINT", () => {
  restorePending();
  clearPending();
  process.exit(130);
});
process.on("SIGTERM", () => {
  restorePending();
  clearPending();
  process.exit(143);
});

healPending();

for (const m of selected) {
  const { ok, path, original } = applyMutation(m);
  if (!ok) {
    results.push({ id: m.id, status: "stale", expect: m.expect });
    continue;
  }
  pending = { path, original };
  let detected = false;
  const testFile = testFileFor(m);
  if (!asJson) process.stdout.write(`🧬 ${m.id} → ${testFile} … `);
  try {
    detected = !testsPass(m);
  } finally {
    writeFileSync(path, original); // siempre restaurar
    clearPending();
    pending = null;
  }
  if (!asJson) console.log(detected ? "detectado ✅" : "NO detectado ❌");
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
}

if (resolve(process.argv[1] ?? "") === fileURLToPath(import.meta.url)) main();
