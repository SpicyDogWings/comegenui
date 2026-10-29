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

// La doc es la fuente y está versionada: `docs/versiones/<id>/` (id = la `latest` del manifiesto).
const DOC_ID = JSON.parse(readFileSync(resolve(ROOT, "docs/versions.json"), "utf-8")).versions.find(
  (v) => v.latest,
)?.id;
const DOC = `docs/versiones/${DOC_ID}`;

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
    find: `      <img v-if="props.image && !hasMediaSlot" :src="props.image" alt="" class="cu-card-image" />`,
    replace: `      <img v-if="props.image" :src="props.image" alt="" class="cu-card-image" />`,
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
    id: "divider-vertical-sin-aria-orientation",
    file: "src/components/information/Divider.vue",
    expect: "el divider vertical declara `aria-orientation`",
    find: `    :aria-orientation="isVertical() ? 'vertical' : undefined"`,
    replace: ``,
  },
  {
    id: "divider-ignora-label",
    file: "src/components/information/Divider.vue",
    expect: "el divider con `label` muestra el texto entre las líneas",
    find: `<span v-if="hasContent()" class="cu-divider-label"><slot>{{ props.label }}</slot></span>`,
    replace: `<span v-if="hasContent()" class="cu-divider-label"></span>`,
  },
  {
    id: "divider-ignora-variante",
    file: "src/components/information/Divider.vue",
    expect: "aplica la clase de la variante del trazo (solid/dashed/dotted)",
    find: "`cu-divider--${props.variant}`",
    replace: "`cu-divider--solid`",
  },
  {
    id: "divider-ce-slot-siempre",
    file: "src/components/customElements/information/Divider.ce.vue",
    test: "src/components/information/Divider.test.ts",
    expect: "el CE sin hijos renderiza un <hr> (no pasa un slot vacío)",
    find: `<template v-if="hasHostContent" #default>`,
    replace: `<template #default>`,
  },
  {
    id: "skeleton-ignora-lines",
    file: "src/components/information/Skeleton.vue",
    expect: "con shape=text renderiza N barras (lines)",
    find: `const barCount = computed(() =>
  props.shape === "text" ? Math.max(1, Math.floor(props.lines) || 1) : 1,
);`,
    replace: `const barCount = computed(() => 1);`,
  },
  {
    id: "skeleton-radius-default-mal",
    file: "src/components/information/Skeleton.vue",
    expect: "el radio por defecto depende del shape (circle = full)",
    find: `const resolvedRadius = computed(() => props.radius || shapeDefaults.value.radius);`,
    replace: `const resolvedRadius = computed(() => props.radius || "md");`,
  },
  {
    id: "skeleton-sin-aria-hidden",
    file: "src/components/information/Skeleton.vue",
    expect: "el placeholder es decorativo (aria-hidden)",
    find: `    aria-hidden="true"
`,
    replace: ``,
  },
  {
    id: "skeleton-ignora-animation",
    file: "src/components/information/Skeleton.vue",
    expect: "aplica la clase de la animación pedida (pulse/wave/none)",
    find: "`cu-skeleton--${props.animation}`",
    replace: "`cu-skeleton--pulse`",
  },
  {
    id: "skeleton-ignora-width-default",
    file: "src/components/information/Skeleton.vue",
    expect: "circle mide 40px de ancho por defecto (width por shape)",
    find: `  "--cu-skeleton-width": props.width || shapeDefaults.value.width,`,
    replace: `  "--cu-skeleton-width": "100%",`,
  },
  {
    id: "label-no-focus-on-for",
    file: "src/components/form/Label.vue",
    expect: "con `for` enfoca el elemento con ese id",
    find: `  const control = props.for ? document.getElementById(props.for) : slotControl();`,
    replace: `  const control = props.for ? null : slotControl();`,
  },
  {
    id: "date-picker-value-format-no-format",
    file: "src/components/form/DatePicker.vue",
    expect: "con value-format, getFormattedValue y los eventos formateados devuelven el string",
    find: `  if (!date || !props.valueFormat) return null
  return formatDate(date, props.valueFormat, props.locale)`,
    replace: `  if (!date || !props.valueFormat) return null
  return null`,
  },
  {
    id: "date-picker-value-format-no-range-start",
    file: "src/components/form/DatePicker.vue",
    expect: "con value-format, el rango emite update:formattedStartDate",
    find: `  rangeStart.value = value
  emit('update:startDate', value)
  if (props.valueFormat) emit('update:formattedStartDate', fmt(value))`,
    replace: `  rangeStart.value = value
  emit('update:startDate', value)`,
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
    id: "collapse-description-no-render",
    file: "src/components/overlay/Collapse.vue",
    expect: "renderiza la descripción del trigger bajo el label",
    find: `        <p v-if="props.description" class="cu-collapse-description">{{ props.description }}</p>`,
    replace: `        <p v-if="false" class="cu-collapse-description">{{ props.description }}</p>`,
  },
  {
    id: "collapse-disabled-ignores-toggle-guard",
    file: "src/components/overlay/Collapse.vue",
    expect: "con disabled el trigger no alterna el estado",
    find: `function toggle() {
  if (props.disabled) return
  setOpen(!isOpen.value)
}`,
    replace: `function toggle() {
  setOpen(!isOpen.value)
}`,
  },
  {
    id: "collapse-disabled-ignores-open-guard",
    file: "src/components/overlay/Collapse.vue",
    expect: "con disabled open() no abre el collapse",
    find: `function open() {
  if (props.disabled) return
  setOpen(true)
}`,
    replace: `function open() {
  setOpen(true)
}`,
  },
  {
    id: "collapse-disabled-no-disabled-attr",
    file: "src/components/overlay/Collapse.vue",
    expect: "con disabled el trigger queda con el atributo disabled",
    find: `      :disabled="props.disabled"`,
    replace: `      :disabled="false"`,
  },
  {
    id: "side-over-persistent-ignored",
    file: "src/components/overlay/SideOver.vue",
    expect: "persistent no se cierra por backdrop ni Escape",
    find: `  if (props.persistent) return`,
    replace: `  if (false) return`,
  },
  {
    id: "side-over-show-no-abre",
    file: "src/components/customElements/overlay/SideOver.ce.vue",
    test: "src/components/customElements/ce-parity.test.ts",
    expect: "show() abre el panel sin que la prop booleana open lo tape",
    find: `function show() { isOpen.value = true; }`,
    replace: `function show() { /* mutado */ }`,
  },
  {
    id: "side-over-open-attr-ignorado",
    file: "src/components/customElements/overlay/SideOver.ce.vue",
    test: "src/components/customElements/ce-parity.test.ts",
    expect: "el atributo open abre y cierra el panel",
    find: `watch(() => props.open, (value) => {
  isOpen.value = value;
});`,
    replace: `watch(() => props.open, () => {
  /* mutado */
});`,
  },
  {
    id: "side-over-ce-teleport-rompe-slot",
    file: "src/components/customElements/overlay/SideOver.ce.vue",
    test: "src/components/customElements/ce-parity.test.ts",
    expect: "el CE proyecta el slot del host dentro del panel",
    find: `    :teleport="false"`,
    replace: `    :teleport="true"`,
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
  if (props.readOnly || option.disabled) return;
  selectedValue.value = option.value;
  emit("update:modelValue", option.value);
  emit("select", option);
  emit("change", option.value);
  dropdownRef.value?.close();
}`,
    replace: `function onSelect(option: SelectOption) {
  if (props.readOnly || option.disabled) return;
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
    id: "select-readonly-abre",
    file: "src/components/form/Select.vue",
    expect: "readOnly no abre el dropdown",
    find: `      :disabled="disabled || readOnly"`,
    replace: `      :disabled="disabled"`,
  },
  {
    id: "select-readonly-no-cierra",
    file: "src/components/form/Select.vue",
    expect: "al pasar a readOnly cierra el panel abierto",
    find: `watch(() => props.readOnly, (value) => {
  if (value) dropdownRef.value?.close();
});`,
    replace: `watch(() => props.readOnly, () => {
  /* mutado */
});`,
  },
  {
    id: "select-opcion-seleccionada-sin-check",
    file: "src/components/form/Select.vue",
    expect: "la opción con el value seleccionado muestra el check",
    find: `            :selected="opt.value === selectedValue"`,
    replace: `            :selected="false"`,
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
    id: "switch-label-position-ignorado",
    file: "src/components/form/Switch.vue",
    expect: "labelPosition aplica la clase del lado pedido (start/end)",
    find: "      `cu-switch--label-${props.labelPosition}`,",
    replace: "      `cu-switch--label-end`,",
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
    id: "popover-scroll-listener-no-pasivo",
    file: "src/components/overlay/Popover.vue",
    expect: "el listener de scroll del documento es pasivo (no bloquea el scrolling)",
    find: `document.addEventListener("scroll", onViewportChange, SCROLL_OPTS);`,
    replace: `document.addEventListener("scroll", onViewportChange, true);`,
  },
  {
    id: "popover-cierra-con-click-redisparado",
    file: "src/components/overlay/Popover.vue",
    expect: "un click sintético reemitido por un ancestro (cu-card) no cierra el panel",
    find: `  if (!(e instanceof MouseEvent)) return;`,
    replace: `  // mutado: cualquier evento "click" cuenta como click afuera`,
  },
  {
    id: "popover-sin-fallback-fixed",
    file: "src/components/overlay/Popover.vue",
    expect: "si un ancestro con overflow recorta el panel, el panel pasa a fixed",
    find: `  autoFixed.value = true;
  positionPanel();`,
    replace: `  autoFixed.value = false;
  positionPanel();`,
  },
  {
    id: "popover-fallback-ignora-containing-block",
    file: "src/components/overlay/Popover.vue",
    expect: "con un ancestro que ancla fixed (transform) el fallback no se activa",
    find: `    if (anchorsFixedDescendants(cs)) return false;`,
    replace: `    // mutado: no mira si el ancestro ancla fixed`,
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
    id: "dropdown-menu-sin-check-seleccionado",
    file: "src/components/controls/DropdownMenu.vue",
    expect: "un item con selected muestra el check",
    find: `            :selected="!!item.selected"`,
    replace: `            :selected="false"`,
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
    id: "button-link-disabled-href",
    file: "src/components/buttons/Button.vue",
    expect: "un link disabled no conserva el href (no navega)",
    find: `    :href="isDisabled ? undefined : safeTo"`,
    replace: `    :href="safeTo"`,
  },
  {
    id: "button-link-disabled-aria",
    file: "src/components/buttons/Button.vue",
    expect: "un link disabled expone aria-disabled y sale del tab order",
    find: `    :aria-disabled="isDisabled ? 'true' : undefined"\n`,
    replace: ``,
  },
  {
    id: "button-link-disabled-click",
    file: "src/components/buttons/Button.vue",
    expect: "el click de un link disabled se cancela y no burbujea",
    find: `  event.preventDefault()\n  event.stopPropagation()`,
    replace: `  /* mutado */`,
  },
  {
    id: "button-link-rel",
    file: "src/components/buttons/Button.vue",
    expect: "target=_blank agrega rel noopener noreferrer",
    find: `    :rel="props.target === '_blank' && !isDisabled ? 'noopener noreferrer' : undefined"`,
    replace: `    :rel="undefined"`,
  },
  {
    id: "button-to-esquema-peligroso",
    file: "src/components/buttons/Button.vue",
    expect: "javascript:/data:/vbscript: en `to` no se renderizan como link",
    find: `  if (/^(?:javascript|vbscript|data):/i.test(compact)) return undefined`,
    replace: `  /* mutado: sin chequeo de esquema */`,
  },
  {
    id: "button-color-invalido",
    file: "src/components/buttons/Button.vue",
    expect: "un color inválido cae a neutral",
    find: `const safeColor = computed(() => (isColor(props.color) ? props.color : 'neutral'))`,
    replace: `const safeColor = computed(() => props.color)`,
  },
  {
    id: "button-type-invalido",
    file: "src/components/buttons/Button.vue",
    expect: "un type inválido cae a button",
    find: `const buttonType = computed(() => (isButtonType(props.type) ? props.type : 'button'))`,
    replace: `const buttonType = computed(() => props.type)`,
  },
  {
    id: "button-loading-aria-busy",
    file: "src/components/buttons/Button.vue",
    expect: "loading marca aria-busy en el botón",
    find: `    :disabled="isDisabled"\n    :aria-busy="props.loading ? 'true' : undefined"\n    @click="onButtonClick"`,
    replace: `    :disabled="isDisabled"\n    @click="onButtonClick"`,
  },
  {
    id: "button-spinner-aria-hidden",
    file: "src/components/buttons/Button.vue",
    expect: "el spinner está oculto para lectores de pantalla",
    find: `    <LucideLoader\n      v-if="props.loading"\n      class="cu-button-spinner"\n      aria-hidden="true"\n      focusable="false"\n    />`,
    replace: `    <LucideLoader\n      v-if="props.loading"\n      class="cu-button-spinner"\n      aria-hidden="false"\n      focusable="false"\n    />`,
  },
  {
    id: "button-ce-submit",
    file: "src/components/buttons/Button.vue",
    expect: "type=submit envía el form del host desde el custom element",
    find: `  }\n  form.requestSubmit()\n}`,
    replace: `  }\n  /* mutado */\n}`,
  },
  {
    id: "button-ce-reset",
    file: "src/components/buttons/Button.vue",
    expect: "type=reset resetea el form del host desde el custom element",
    find: `    form.reset()\n    return`,
    replace: `    return`,
  },
  {
    id: "button-ce-formnovalidate",
    file: "src/components/buttons/Button.vue",
    expect: "formnovalidate en el host desactiva la validación del submit",
    find: `  if (button.formNoValidate) {`,
    replace: `  if (false) {`,
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
  filtering.value = true;
}`,
    replace: `function set(val: string) {
  searchValue.value = val;
  filtering.value = true;
  dropdownRef.value?.open();
}`,
  },
  {
    id: "autocomplete-seleccion-cierra-panel",
    file: "src/components/form/Autocomplete.vue",
    expect: "seleccionar un item no cierra el panel",
    find: `  filtering.value = false;
  emit("select", item);
}`,
    replace: `  filtering.value = false;
  emit("select", item);
  dropdownRef.value?.close();
}`,
  },
  {
    id: "autocomplete-seleccion-no-resetea-filtro",
    file: "src/components/form/Autocomplete.vue",
    expect: "seleccionar resetea el filtrado y muestra todos los items",
    find: `  filtering.value = false;`,
    replace: `  filtering.value = true;`,
  },
  {
    id: "autocomplete-item-seleccionado-sin-check",
    file: "src/components/form/Autocomplete.vue",
    expect: "el item seleccionado muestra el check",
    find: `          :selected="isSelected(item)"`,
    replace: `          :selected="false"`,
  },
  {
    id: "autocomplete-ce-check-compara-proxy",
    file: "src/components/form/Autocomplete.vue",
    test: "src/components/customElements/ce-parity.test.ts",
    expect: "el check aparece aunque el item llegue crudo por la propiedad del CE",
    find: `  return !!sel && toRaw(sel) === toRaw(item);`,
    replace: `  return !!sel && sel === item;`,
  },
  {
    id: "autocomplete-ce-selected-item-devuelve-fn",
    file: "src/components/customElements/form/Autocomplete.ce.vue",
    test: "src/components/customElements/ce-parity.test.ts",
    expect: "selectedItem() del CE devuelve el item, no la función interna",
    find: `  selectedItem: () => autocompleteRef.value?.selectedItem?.() ?? null,`,
    replace: `  selectedItem: () => autocompleteRef.value?.selectedItem || null,`,
  },
  {
    id: "select-ce-selected-item-devuelve-fn",
    file: "src/components/customElements/form/Select.ce.vue",
    test: "src/components/customElements/ce-parity.test.ts",
    expect: "selectedItem() del CE devuelve la opción, no la función interna",
    find: `  selectedItem: () => selectRef.value?.selectedItem?.() ?? null,`,
    replace: `  selectedItem: () => selectRef.value?.selectedItem || null,`,
  },
  {
    id: "autocomplete-no-limpia-seleccion-al-cambiar-texto",
    file: "src/components/form/Autocomplete.vue",
    expect: "cambiar el texto limpia la selección cuando deja de coincidir",
    find: `watch(searchValue, (val) => syncSelectionWithText(val));`,
    replace: `watch(searchValue, () => {
  /* mutado */
});`,
  },
  {
    id: "code-scheme-invierte-fondo",
    file: "src/plugins/cu-tokens/css.ts",
    expect: "el fondo del code block es siempre oscuro (el polo oscuro del tema)",
    find: `const bg = toHex(mix(darkPole, '#000000', 0.35))`,
    replace: `const bg = lightPole`,
  },
  {
    id: "code-accent-sin-contraste",
    file: "src/plugins/cu-tokens/shiki.ts",
    expect: "los acentos de sintaxis garantizan contraste WCAG >= 4.5:1 sobre el fondo",
    find: `if (base) accents[key] = readable(base, code.bg)`,
    replace: `if (base) accents[key] = base`,
  },
  {
    id: "alpha-tokens-ignora-override",
    file: "src/plugins/cu-tokens/css.ts",
    expect: "un override de shared.alpha se refleja en los tokens --cu-alpha-*",
    find: `const alpha = { ...DEFAULTS.alpha, ...(shared.alpha ?? {}) }`,
    replace: `const alpha = { ...DEFAULTS.alpha }`,
  },
  {
    id: "alpha-token-muted-no-emite",
    file: "src/plugins/cu-tokens/css.ts",
    expect: "se emite --cu-alpha-muted (items, opciones y filas deshabilitadas)",
    find: `    --cu-alpha-muted: \${alpha.muted};\n`,
    replace: ``,
  },
  {
    id: "ficha-api-default-mentiroso",
    file: `${DOC}/partials/alert/props-vue.md`,
    test: "src/contracts/ficha-api.test.ts",
    expect:
      "el default documentado coincide con el del SFC (la ficha se lee siguiendo sus @include)",
    find: `| \`variant\` | \`"solid" \\| "outlined" \\| "soft" \\| "ghost" \\| "subtle"\` | \`"soft"\` | — |`,
    replace: `| \`variant\` | \`"solid" \\| "outlined" \\| "soft" \\| "ghost" \\| "subtle"\` | \`"solid"\` | — |`,
  },
  {
    id: "advanced-table-actions-fn-ignorada",
    file: "src/components/data/AdvancedTable.vue",
    expect: "`actions` como función resuelve los ítems de cada fila",
    find: `  const actions = typeof props.actions === "function" ? props.actions(row) : props.actions;`,
    replace: `  const actions = Array.isArray(props.actions) ? props.actions : [];`,
  },
  {
    id: "advanced-table-boton-disabled-fn-ignorada",
    file: "src/components/data/AdvancedTable.vue",
    expect: "`disabled` como función se evalúa por fila (y no queda siempre deshabilitado)",
    find: `  return typeof value === 'function' ? value(row) : !!value;`,
    replace: `  return !!value;`,
  },
  {
    id: "advanced-table-action-hidden-ignorado",
    file: "src/components/data/AdvancedTable.vue",
    expect: "`hidden` descarta el ítem del dropdown en esa fila",
    find: `    .filter(action => !isButtonHidden(action, row))`,
    replace: `    .filter(() => true)`,
  },
  {
    id: "advanced-table-divisores-huerfanos",
    file: "src/components/data/AdvancedTable.vue",
    expect: "los divisores que quedan huérfanos al ocultar un ítem se descartan",
    find: `  return items.filter((item, i) =>
    !item.divider || (i > 0 && i < items.length - 1 && !items[i - 1]?.divider)
  );`,
    replace: `  return items;`,
  },
  {
    id: "advanced-table-toggle-sin-acciones",
    file: "src/components/data/AdvancedTable.vue",
    expect: "sin acciones visibles no se renderiza el toggle '...'",
    find: `const hasVisibleRowActions = (row: Record<string, any>): boolean =>
  getRowActions(row).some(action => !action.divider && !isButtonHidden(action, row));`,
    replace: `const hasVisibleRowActions = (_row: Record<string, any>): boolean => true;`,
  },
  {
    id: "advanced-table-indice-edicion-sin-paginacion",
    file: "src/components/data/AdvancedTable.vue",
    expect:
      "sin paginación, editar una fila más allá de itemsPerPage guarda en esa fila (no en -1)",
    find: `const renderedData = computed(() =>
  props.pagination ? pagination.displayData.value : sortedData.value
);`,
    replace: `const renderedData = computed(() => pagination.displayData.value);`,
  },
  {
    id: "advanced-table-indice-visible-sin-traducir",
    file: "src/components/data/AdvancedTable.vue",
    expect:
      "con paginación, el índice visible se traduce al índice original (página 2 → fila 11)",
    find: `  localData.value.findIndex((row) => row === renderedData.value[displayIndex]);`,
    replace: `  displayIndex;`,
  },
  {
    id: "number-input-clamp-max-ignorado",
    file: "src/components/form/NumberInput.vue",
    expect: "tipear por encima de max clampea al máximo",
    find: `  if (maxValue.value !== undefined) clamped = Math.min(maxValue.value, clamped);`,
    replace: `  /* mutado: sin tope máximo */`,
  },
  {
    id: "number-input-clamp-min-ignorado",
    file: "src/components/form/NumberInput.vue",
    expect: "tipear por debajo de min clampea al mínimo",
    find: `  if (minValue.value !== undefined) clamped = Math.max(minValue.value, clamped);`,
    replace: `  /* mutado: sin piso mínimo */`,
  },
  {
    id: "number-input-controles-por-defecto",
    file: "src/components/form/NumberInput.vue",
    expect: "showControls es true por defecto (botones − / +)",
    find: `  showControls: {
    type: Boolean,
    required: false,
    default: true,
  },`,
    replace: `  showControls: {
    type: Boolean,
    required: false,
    default: false,
  },`,
  },
  {
    id: "number-input-select-de-paso-por-defecto",
    file: "src/components/form/NumberInput.vue",
    expect: "showStepSelect es false por defecto (no hay select de paso)",
    find: `  showStepSelect: {
    type: Boolean,
    required: false,
    default: false,
  },`,
    replace: `  showStepSelect: {
    type: Boolean,
    required: false,
    default: true,
  },`,
  },
  {
    id: "number-input-paso-ignorado",
    file: "src/components/form/NumberInput.vue",
    expect: "los botones usan el paso activo (step o el select)",
    find: `  const next = clamp(roundLike(base + stepValue.value, base, stepValue.value));`,
    replace: `  const next = clamp(roundLike(base + 1, base, stepValue.value));`,
  },
  {
    id: "number-input-resta-suma",
    file: "src/components/form/NumberInput.vue",
    expect: "decrement() resta el paso (no suma)",
    find: `  const next = clamp(roundLike(base - stepValue.value, base, stepValue.value));`,
    replace: `  const next = clamp(roundLike(base + stepValue.value, base, stepValue.value));`,
  },
  {
    id: "number-input-paso-select-ignorado",
    file: "src/components/form/NumberInput.vue",
    expect: "elegir un paso en el select cambia el paso activo",
    find: `  if (next !== undefined && next > 0) activeStep.value = next;`,
    replace: `  if (next !== undefined && next > 0) { /* mutado */ }`,
  },
  {
    id: "number-input-readonly-ignorado",
    file: "src/components/form/NumberInput.vue",
    expect: "readOnly bloquea botones y teclado",
    find: `const isLocked = computed(() => props.disabled || props.readOnly);`,
    replace: `const isLocked = computed(() => props.disabled);`,
  },
  {
    id: "number-input-disabled-ignorado",
    file: "src/components/form/NumberInput.vue",
    expect: "disabled bloquea el incremento",
    find: `const canIncrement = computed(() => !isLocked.value && !atMax.value);`,
    replace: `const canIncrement = computed(() => !atMax.value);`,
  },
  {
    id: "number-input-max-sin-deshabilitar",
    file: "src/components/form/NumberInput.vue",
    expect: "en el máximo el botón + queda deshabilitado",
    find: `  () => maxValue.value !== undefined && value.value !== null && value.value >= maxValue.value,`,
    replace: `  () => false,`,
  },
  {
    id: "number-input-teclado-sin-flechas",
    file: "src/components/form/NumberInput.vue",
    expect: "ArrowUp incrementa con el teclado",
    find: `      @keydown.up.prevent="increment"`,
    replace: `      @keydown.up.prevent="() => {}"`,
  },
  {
    id: "number-input-change-sin-edicion",
    file: "src/components/form/NumberInput.vue",
    expect: "change no se repite al perder el foco sin editar",
    find: `  if (!dirty) return;
  dirty = false;
  emit('change', next);`,
    replace: `  dirty = false;
  emit('change', next);`,
  },
  {
    id: "number-input-tipeo-no-actualiza",
    file: "src/components/form/NumberInput.vue",
    expect: "tipear actualiza el valor y emite update:modelValue",
    find: `  if (next !== value.value) value.value = next;
}

/** Confirma el texto (Enter o blur) y emite \`change\` si hubo edición. */`,
    replace: `}

/** Confirma el texto (Enter o blur) y emite \`change\` si hubo edición. */`,
  },
  {
    id: "number-input-set-sin-change",
    file: "src/components/form/NumberInput.vue",
    expect: "set() emite change",
    find: `  applyValue(next, { change: true });`,
    replace: `  applyValue(next, {});`,
  },
  {
    id: "number-input-reset-sin-change",
    file: "src/components/form/NumberInput.vue",
    expect: "reset() emite change con null",
    find: `  applyValue(null, { change: true });`,
    replace: `  applyValue(null, {});`,
  },
  {
    id: "number-input-increment-sin-evento",
    file: "src/components/form/NumberInput.vue",
    expect: "incrementar emite increment con el valor nuevo",
    find: `  if (options.kind === 'increment') emit('increment', nextValue as number);`,
    replace: `  if (options.kind === 'increment') { /* mutado */ }`,
  },
  {
    id: "number-input-precision-ignorada",
    file: "src/components/form/NumberInput.vue",
    expect: "los pasos decimales no arrastran polvo de coma flotante",
    find: `  return Number(next.toFixed(places));`,
    replace: `  return next;`,
  },
  {
    id: "number-input-focus-noop",
    file: "src/components/form/NumberInput.vue",
    expect: "focus() enfoca el input real",
    find: `  inputRef.value?.focus();`,
    replace: `  /* mutado */`,
  },
  {
    id: "number-input-atributos-string-ignorados",
    file: "src/components/form/NumberInput.vue",
    expect: "min/max/step en string (atributos HTML del CE) se normalizan a número",
    find: `function toNumber(raw: unknown): number | undefined {
  if (raw === null || raw === undefined || raw === '') return undefined;
  const parsed = Number(raw);
  return Number.isFinite(parsed) ? parsed : undefined;
}`,
    replace: `function toNumber(raw: unknown): number | undefined {
  return typeof raw === 'number' && Number.isFinite(raw) ? raw : undefined;
}`,
  },
  {
    id: "number-input-paso-ignorado",
    file: "src/components/form/NumberInput.vue",
    expect: "el paso elegido en el select define cuánto suman/restan botones y flechas",
    find: `  if (next !== undefined && next > 0) activeStep.value = next;`,
    replace: `  if (next !== undefined && next > 0) void next;`,
  },
  {
    id: "label-slot-no-enfoca",
    file: "src/components/form/Label.vue",
    expect: "sin `for`, el click enfoca el primer control del slot",
    find: `  const control = props.for ? document.getElementById(props.for) : slotControl();`,
    replace: `  const control = props.for ? document.getElementById(props.for) : null;`,
  },
  {
    id: "label-shadow-no-entra",
    file: "src/components/form/Label.vue",
    expect: "si el control del slot es un custom element, enfoca el control de su shadow root",
    find: `  return inner ?? el;`,
    replace: `  return el;`,
  },
  {
    id: "label-click-no-emite",
    file: "src/components/form/Label.vue",
    expect: "el click en el label emite `click`",
    find: `  emit('click');`,
    replace: `  void 0;`,
  },
  {
    id: "label-vue-no-busca-control",
    file: "src/components/form/Label.vue",
    expect: "en Vue enfoca el input interno de un Checkbox/Switch del slot",
    find: `    ?? (el.matches(FOCUSABLE) ? el : el.querySelector<HTMLElement>(FOCUSABLE));`,
    replace: `    ?? el;`,
  },
  {
    id: "autocomplete-loading-ignorado",
    file: "src/components/form/Autocomplete.vue",
    expect: "loading llega al Dropdown (spinner del panel)",
    find: `    :loading="loading"`,
    replace: ``,
  },
  {
    id: "card-media-ignora-slot",
    file: "src/components/information/Card.vue",
    expect: "el slot media muestra el contenedor de media",
    find: `  hasMediaSlot.value = wrapHasContent(mediaWrap.value);`,
    replace: `  hasMediaSlot.value = false;`,
  },
  {
    id: "card-footer-siempre-oculto",
    file: "src/components/information/Card.vue",
    expect: "el slot footer muestra el pie",
    find: `  hasFooter.value = wrapHasContent(footerWrap.value);`,
    replace: `  hasFooter.value = false;`,
  },
  {
    id: "card-header-sin-prioridad",
    file: "src/components/information/Card.vue",
    expect: "el slot header tiene prioridad sobre title/subtitle",
    find: `        <h3 v-if="props.title && !hasHeaderSlot" class="cu-card-title">{{ props.title }}</h3>`,
    replace: `        <h3 v-if="props.title" class="cu-card-title">{{ props.title }}</h3>`,
  },
  {
    id: "date-picker-label-no-enfoca",
    file: "src/components/form/DatePicker.vue",
    expect: "el click en el label enfoca el trigger y abre el panel",
    find: `  trigger?.focus()`,
    replace: ``,
  },
  {
    id: "label-activa-control",
    file: "src/components/form/Label.vue",
    expect: "el click en el label activa el control (toggle)",
    find: `      if (esToggle) target.click();`,
    replace: `      if (esToggle) target.focus();`,
  },
  {
    id: "dropdown-menu-text-align-solo-text-align",
    file: "src/components/controls/DropdownMenu.vue",
    expect: "textAlign alinea los items del panel (justify-content, no sólo text-align)",
    find: `const itemStyle = computed(() => textAlignStyle(props.textAlign));`,
    replace: `const itemStyle = computed(() => ({ textAlign: props.textAlign }));`,
  },
  {
    id: "select-trigger-sin-alinear",
    file: "src/components/form/Select.vue",
    expect: "textAlign alinea el label del trigger",
    find: `            :style="labelStyle"`,
    replace: ``,
  },
  {
    id: "select-opciones-sin-justify",
    file: "src/components/form/Select.vue",
    expect: "textAlign alinea las opciones del panel (justify-content)",
    find: `const optionStyle = computed(() => textAlignStyle(props.textAlign));`,
    replace: `const optionStyle = computed(() => ({ textAlign: props.textAlign }));`,
  },
  {
    id: "autocomplete-input-sin-alinear",
    file: "src/components/form/Autocomplete.vue",
    expect: "textAlign alinea el texto del input",
    find: `        :style="inputStyle"`,
    replace: `        style="width:100%"`,
  },
  {
    id: "autocomplete-items-sin-justify",
    file: "src/components/form/Autocomplete.vue",
    expect: "textAlign alinea los items del panel (justify-content)",
    find: `const itemStyle = computed(() => textAlignStyle(props.textAlign));`,
    replace: `const itemStyle = computed(() => ({ textAlign: props.textAlign }));`,
  },
  {
    id: "menu-option-sin-check",
    file: "src/components/controls/MenuOption.vue",
    expect: "la fila con selected dibuja el check de lucide",
    find: `    <LucideCheck v-if="props.selected"`,
    replace: `    <LucideCheck v-if="false"`,
  },
  {
    id: "menu-option-icon-ignorado",
    file: "src/components/controls/MenuOption.vue",
    expect: "la fila renderiza el ícono con la clase de su lista",
    find: `    <span v-if="props.icon" v-html="props.icon" :class="props.iconClass"></span>`,
    replace: `    <span v-if="false" v-html="props.icon" :class="props.iconClass"></span>`,
  },
  {
    id: "menu-option-href-ignorado",
    file: "src/components/controls/MenuOption.vue",
    expect: "con href la fila se renderiza como link",
    find: `    :to="props.href || undefined"`,
    replace: `    :to="undefined"`,
  },
  {
    id: "ce-forwarding-cameliza-atributos",
    file: "src/utils/comegen-element.ts",
    test: "src/utils/comegen-element.test.ts",
    expect: "aria-*/data-*/kebab llegan al nodo interno con su nombre original exacto",
    find: `      this._applyProp(isProp ? camelKey : key, this.getAttribute(key), camelKey)`,
    replace: `      this._applyProp(camelKey, this.getAttribute(key), camelKey)`,
  },
  {
    id: "ce-forwarding-baja-no-remueve",
    file: "src/utils/comegen-element.ts",
    test: "src/utils/comegen-element.test.ts",
    expect: "quitar un atributo del host lo quita del nodo interno",
    find: `      if (!Object.prototype.hasOwnProperty.call(self._props, propKey)) return
      delete self._props[propKey]`,
    replace: `      return`,
  },
  {
    id: "ce-forwarding-id-duplicado",
    file: "src/utils/comegen-element.ts",
    test: "src/utils/comegen-element.test.ts",
    expect: "el id del host no se copia al nodo interno (sin ids duplicados)",
    find: `      if (!isProp && key === 'id') return
`,
    replace: ``,
  },
  {
    id: "ce-tabindex-host-tab-stop",
    file: "src/utils/comegen-element.ts",
    test: "src/utils/comegen-element.test.ts",
    expect: "tabindex se reenvía al control y el host queda en -1 (una sola parada)",
    find: `          this.setAttribute(FOCUS_ATTR, '-1')`,
    replace: `          void 0`,
  },
  {
    id: "button-icon-only-ignorado",
    file: "src/components/buttons/Button.vue",
    expect: "iconOnly aplica la clase de padding cuadrado",
    find: `    'cu-button--icon-only': props.iconOnly,`,
    replace: `    'cu-button--icon-only': false,`,
  },
  {
    id: "button-link-anidado",
    file: "src/components/buttons/Button.vue",
    expect: "con `to` hay un único <a>, sin <button> adentro",
    find: `    <slot></slot>
  </a>`,
    replace: `    <button type="button"></button>
    <slot></slot>
  </a>`,
  },
  {
    id: "button-solid-color-crudo",
    file: "src/components/buttons/Button.vue",
    expect: "solid/none usan la variante -solid de fondo, no el color crudo",
    find: "  '--btn-solid': `var(--cu-color-${safeColor.value}-solid)`,",
    replace: "  '--btn-solid': `var(--cu-color-${safeColor.value})`,",
  },
  {
    id: "button-solid-texto-negro",
    file: "src/components/buttons/Button.vue",
    expect: "solid/none conservan el texto del tema (nunca negro por color)",
    find: "  '--btn-solid-text': `var(--cu-color-surface)`,",
    replace: "  '--btn-solid-text': '#000000',",
  },
  {
    id: "button-texto-color-crudo",
    file: "src/components/buttons/Button.vue",
    expect: "las variantes tintadas usan -text adaptativo, no el color crudo",
    find: "  '--btn-text': `var(--cu-color-${safeColor.value}-text)`,",
    replace: "  '--btn-text': `var(--cu-color-${safeColor.value})`,",
  },
  {
    id: "badge-solid-color-crudo",
    file: "src/components/information/Badge.vue",
    expect: "badge solid usa la variante -solid de fondo",
    find: "  '--badge-solid': `var(--cu-color-${props.color}-solid)`,",
    replace: "  '--badge-solid': `var(--cu-color-${props.color})`,",
  },
  {
    id: "alert-solid-color-crudo",
    file: "src/components/information/Alert.vue",
    expect: "alert solid usa la variante -solid de fondo",
    find: "  '--alert-solid': `var(--cu-color-${props.color}-solid)`,",
    replace: "  '--alert-solid': `var(--cu-color-${props.color})`,",
  },
  {
    id: "token-text-no-adapta",
    file: "src/plugins/cu-tokens/css.ts",
    test: "src/plugins/cu-tokens/contrast.test.ts",
    expect: "el texto de las variantes tintadas garantiza 4.5:1 en los 15 temas",
    find: "  return ensureContrast(value, compositeOver(value, surface, 0.35), MIN_TEXT_CONTRAST)",
    replace: "  return toHex(darken(value, 0.25))",
  },
  {
    id: "token-solid-sin-ajuste",
    file: "src/plugins/cu-tokens/css.ts",
    test: "src/plugins/cu-tokens/contrast.test.ts",
    expect: "solid ajusta el fondo hasta que el texto del tema alcanza 4.5:1",
    find: "  if (contrastRatio(value, surface) >= MIN_TEXT_CONTRAST) return toHex(value)",
    replace: "  return toHex(value)",
  },
  {
    id: "token-solid-hover-hacia-superficie",
    file: "src/plugins/cu-tokens/css.ts",
    test: "src/plugins/cu-tokens/contrast.test.ts",
    expect: "hover/active de solid se alejan del texto (siguen en 4.5:1)",
    find: "  return toHex(relLuma(surface) < 0.5 ? lighten(solid, amount) : darken(solid, amount))",
    replace: "  return toHex(relLuma(surface) < 0.5 ? darken(solid, amount) : lighten(solid, amount))",
  },
  {
    id: "token-borde-sin-contraste",
    file: "src/plugins/cu-tokens/css.ts",
    test: "src/plugins/cu-tokens/contrast.test.ts",
    expect: "los bordes garantizan 3:1 contra el tinte y la superficie",
    find: `  let border = ensureContrast(value, tint, MIN_BORDER_CONTRAST)
  border = ensureContrast(border, surface, MIN_BORDER_CONTRAST)
  return border`,
    replace: `  return toHex(transparentize(value, 0.5))`,
  },
  {
    id: "ce-idref-sin-fallback",
    file: "src/utils/comegen-element.ts",
    test: "src/utils/comegen-element.test.ts",
    expect: "un aria-labelledby/describedby externo igual resuelve nombre y descripción del control",
    find: `        if (!authorSet && root.getAttribute(fallback) !== text) root.setAttribute(fallback, text)`,
    replace: `        void text`,
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
