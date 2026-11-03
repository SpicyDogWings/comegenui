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
    find: `<div v-show="hasHeader" class="cu-alert-header">`,
    replace: `<div v-show="hasHeader || props.close" class="cu-alert-header">`,
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
    find: `  if (!props.persistent && startedOnBackdrop && event.target === event.currentTarget) {`,
    replace: `  if (startedOnBackdrop && event.target === event.currentTarget) {`,
  },
  {
    id: "modal-close-emits-nothing",
    file: "src/components/overlay/Modal.vue",
    expect: "cerrar el modal emite close/closed",
    find: `  if (!newVal) emit("close");\n`,
    replace: ``,
  },
  {
    id: "modal-foco-sin-trampa",
    file: "src/components/overlay/Modal.vue",
    expect: "Tab no sale del diálogo (focus trap)",
    find: `    document.addEventListener("keydown", handleKeydown);\n`,
    replace: ``,
  },
  {
    id: "modal-foco-sin-retorno",
    file: "src/components/overlay/Modal.vue",
    expect: "al cerrar, el foco vuelve al trigger",
    find: `    restoreFocus();\n`,
    replace: ``,
  },
  {
    id: "modal-pisa-foco-del-consumidor",
    file: "src/components/overlay/Modal.vue",
    test: "src/components/overlay/CommandPalette.test.ts",
    expect: "el foco inicial del consumidor (buscador de CommandPalette) no se pisa",
    find: `  if (active && (focusables.includes(active as HTMLElement) || root.contains(active))) return;\n`,
    replace: ``,
  },
  {
    id: "modal-nombre-accesible-sin-fallback",
    file: "src/components/overlay/Modal.vue",
    expect: "sin title el diálogo conserva un nombre accesible (aria-label)",
    find: `((attrs['aria-label'] as string | undefined) || 'Diálogo')`,
    replace: `(attrs['aria-label'] as string | undefined)`,
  },
  {
    id: "modal-ids-compartidos",
    file: "src/components/overlay/Modal.vue",
    expect: "dos modales no comparten el id del título",
    find: "const titleId = `${uid}-title`;",
    replace: `const titleId = "modal-title";`,
  },
  {
    id: "modal-trampa-sin-topmost",
    file: "src/components/overlay/Modal.vue",
    expect: "con otro modal abierto encima, Tab en el de arriba no cae en el de abajo",
    find: `  if (!overlayId || !isTopmostOverlay(overlayId)) return;\n`,
    replace: ``,
  },
  {
    id: "modal-sin-scroll-lock",
    file: "src/components/overlay/Modal.vue",
    expect: "el modal abierto bloquea el scroll del body",
    find: `    lockScroll: true,\n`,
    replace: ``,
  },
  {
    id: "modal-cierra-con-arrastre",
    file: "src/components/overlay/Modal.vue",
    expect: "un click que empieza dentro del panel no cierra por el backdrop",
    find: `  if (!props.persistent && startedOnBackdrop && event.target === event.currentTarget) {`,
    replace: `  if (!props.persistent && event.target === event.currentTarget) {`,
  },
  {
    id: "modal-foco-sin-restaurar-al-desmontar",
    file: "src/components/overlay/Modal.vue",
    expect: "desmontar el modal abierto devuelve el foco al trigger",
    find: `\n  restoreFocus();\n});`,
    replace: `\n});`,
  },
  {
    id: "modal-autofocus-slot-ignorado",
    file: "src/components/overlay/Modal.vue",
    test: "src/components/customElements/ce-parity.test.ts",
    expect: "el [autofocus] del contenido sloteado recibe el foco al abrir",
    find: `    focusables.find((el) => el.hasAttribute('autofocus')) ??\n    (root.querySelector('[autofocus]') as HTMLElement | null);`,
    replace: `    (root.querySelector('[autofocus]') as HTMLElement | null);`,
  },
  {
    id: "modal-ce-footer-vacio-pisa-el-default",
    file: "src/components/customElements/overlay/Modal.ce.vue",
    test: "src/components/customElements/ce-parity.test.ts",
    expect: "el custom element sin footer propio muestra el pie por defecto",
    find: `<template v-if="hasFooter" #footer>`,
    replace: `<template #footer>`,
  },
  {
    id: "command-palette-nombre-accesible-sin-fallback",
    file: "src/components/overlay/CommandPalette.vue",
    expect: "el diálogo de la paleta se anuncia aunque no haya title",
    find: `:aria-label="title || 'Paleta de comandos'"`,
    replace: `:aria-label="title"`,
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
    id: "avatar-sin-fallback-imagen",
    file: "src/components/information/Avatar.vue",
    expect: "si la imagen no carga, vuelve a las iniciales (no queda un círculo vacío)",
    find: `      @error="imageFailed = true"
`,
    replace: ``,
  },
  {
    id: "avatar-slot-siempre",
    file: "src/components/information/Avatar.vue",
    expect: "con iniciales o src el slot no se renderiza (un solo contenido)",
    find: `<slot v-if="showSlot" />`,
    replace: `<slot />`,
  },
  {
    id: "avatar-color-base-sin-solid",
    file: "src/components/information/Avatar.vue",
    expect: "el fondo usa el token `-solid` del color (contraste del tema)",
    find: "`var(--cu-color-${resolvedColor.value}-solid, #4338ca)`",
    replace: "`var(--cu-color-${resolvedColor.value}, #4338ca)`",
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
    id: "author-card-avatar-no-decorativo",
    file: "src/components/information/AuthorCard.vue",
    expect: "el avatar de la tarjeta es decorativo (el nombre ya está en texto)",
    find: `      aria-hidden="true"`,
    replace: ``,
  },
  {
    id: "divider-vertical-sin-aria-orientation",
    file: "src/components/information/Divider.vue",
    expect: "el divider vertical declara `aria-orientation`",
    find: `    :aria-orientation="isVertical() ? 'vertical' : undefined"`,
    replace: ``,
  },
  {
    id: "divider-color-fuera-del-set",
    file: "src/components/information/Divider.vue",
    expect: "un color fuera del set cae al neutral (la línea no desaparece)",
    find: `const safeColor = computed(() => (isColor(props.color) ? props.color : "neutral"));`,
    replace: `const safeColor = computed(() => props.color);`,
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
    id: "skeleton-shape-fuera-del-set",
    file: "src/components/information/Skeleton.vue",
    expect: "una shape fuera del set cae a rect y no rompe el render",
    find: `const resolvedShape = computed(() => SHAPE_DEFAULTS[props.shape] ? props.shape : "rect");`,
    replace: `const resolvedShape = computed(() => props.shape);`,
  },
  {
    id: "skeleton-color-fuera-del-set",
    file: "src/components/information/Skeleton.vue",
    expect: "un color fuera del set cae al neutral (el placeholder no queda transparente)",
    find: `const resolvedColor = computed(() => (isColor(props.color) ? props.color : "neutral"));`,
    replace: `const resolvedColor = computed(() => props.color);`,
  },
  {
    id: "skeleton-ignora-lines",
    file: "src/components/information/Skeleton.vue",
    expect: "con shape=text renderiza N barras (lines)",
    find: `const barCount = computed(() =>
  resolvedShape.value === "text"
    ? Math.min(MAX_LINES, Math.max(1, Math.floor(props.lines) || 1))
    : 1,
);`,
    replace: `const barCount = computed(() => 1);`,
  },
  {
    id: "skeleton-lines-sin-tope",
    file: "src/components/information/Skeleton.vue",
    expect: "recorta `lines` al tope de 100 barras",
    find: `    ? Math.min(MAX_LINES, Math.max(1, Math.floor(props.lines) || 1))`,
    replace: `    ? Math.max(1, Math.floor(props.lines) || 1)`,
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
    id: "tooltip-no-focus-open",
    file: "src/components/overlay/Tooltip.vue",
    expect: "enfocar el trigger muestra el tooltip (teclado, no sólo hover)",
    find: `    @focusin="onFocusIn"`,
    replace: `    @focusin="() => {}"`,
  },
  {
    id: "tooltip-empty-pill",
    file: "src/components/overlay/Tooltip.vue",
    expect: "sin text ni slot content no abre un panel vacío",
    find: `  return props.text.trim().length > 0 || !!slots.content;`,
    replace: `  return true;`,
  },
  {
    id: "tooltip-ce-drops-content-slot",
    file: "src/components/customElements/overlay/Tooltip.ce.vue",
    test: "src/components/customElements/ce-parity.test.ts",
    expect: "el CE reenvía el slot content del host al panel",
    find: `  hasContent.value = !!host?.querySelector('[slot="content"]');`,
    replace: `  hasContent.value = false;`,
  },
  {
    id: "tooltip-no-aria-description",
    file: "src/components/overlay/Tooltip.vue",
    expect: "al abrir describe el trigger con el texto del tooltip",
    find: `    el.setAttribute(DESCRIPTION_ATTR, text);`,
    replace: `    /* mutado */`,
  },
  {
    id: "tooltip-no-aria-restore",
    file: "src/components/overlay/Tooltip.vue",
    expect: "al cerrar restaura el aria-description del autor",
    find: `    else el.setAttribute(DESCRIPTION_ATTR, previous);`,
    replace: `    else el.removeAttribute(DESCRIPTION_ATTR);`,
  },
  {
    id: "tooltip-invalid-color-no-fallback",
    file: "src/components/overlay/Tooltip.vue",
    expect: "un color fuera del set cae a neutral",
    find: `const safeColor = computed(() => (isColor(props.color) ? props.color : 'neutral'));`,
    replace: `const safeColor = computed(() => props.color);`,
  },
  {
    id: "tooltip-disabled-stays-open",
    file: "src/components/overlay/Tooltip.vue",
    expect: "pasar disabled con el panel abierto lo cierra",
    find: `  if (props.disabled || !hasContent()) {
    popover.value?.close();
    return;
  }`,
    replace: `  if (props.disabled || !hasContent()) {
    return;
  }`,
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
    find: `        <span v-if="props.description" class="cu-collapse-description">{{ props.description }}</span>`,
    replace: `        <span v-if="false" class="cu-collapse-description">{{ props.description }}</span>`,
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
    id: "collapse-aria-expanded-fijo",
    file: "src/components/overlay/Collapse.vue",
    expect: "aria-expanded refleja el estado abierto/cerrado",
    find: `      :aria-expanded="isOpen ? 'true' : 'false'"`,
    replace: `      :aria-expanded="'false'"`,
  },
  {
    id: "collapse-aria-controls-sin-id",
    file: "src/components/overlay/Collapse.vue",
    expect: "aria-controls apunta al id del contenido",
    find: `      :aria-controls="contentId"`,
    replace: `      aria-controls="cu-collapse-content"`,
  },
  {
    id: "collapse-chevron-expuesto",
    file: "src/components/overlay/Collapse.vue",
    expect: "el chevron es decorativo y no entra al árbol accesible",
    find: `        aria-hidden="true"
        focusable="false"
      />`,
    replace: `      />`,
  },
  {
    id: "collapse-reduced-motion-sin-guard",
    file: "src/components/overlay/Collapse.vue",
    expect: "con prefers-reduced-motion no manipula la altura inline",
    find: `function onEnter(el: Element) {
  if (reducedMotion()) return`,
    replace: `function onEnter(el: Element) {`,
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
    find: `function show() { setOpen(true); }`,
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
    id: "side-over-dialogo-sin-nombre",
    file: "src/components/overlay/SideOver.vue",
    expect: "el diálogo se nombra con el título vía aria-labelledby",
    find: `        :aria-labelledby="props.title ? titleId : undefined"`,
    replace: `        :aria-labelledby="undefined"`,
  },
  {
    id: "side-over-fallback-sin-nombre",
    file: "src/components/overlay/SideOver.vue",
    expect: "sin título el diálogo conserva un aria-label de respaldo",
    find: `  props.title ? undefined : ((attrs['aria-label'] as string | undefined) || 'Panel'),`,
    replace: `  props.title ? undefined : '',`,
  },
  {
    id: "side-over-foco-no-inicial",
    file: "src/components/overlay/SideOver.vue",
    expect: "al abrir el foco entra al panel",
    find: `  (autofocus ?? focusables[0] ?? panel).focus();`,
    replace: `  /* mutado */`,
  },
  {
    id: "side-over-foco-no-devuelve",
    file: "src/components/overlay/SideOver.vue",
    expect: "al cerrar el foco vuelve al trigger",
    find: `  if (!el || !el.isConnected) return;
  el.focus();`,
    replace: `  if (!el || !el.isConnected) return;`,
  },
  {
    id: "side-over-tab-sin-wrap",
    file: "src/components/overlay/SideOver.vue",
    expect: "Tab en el último focusable vuelve al primero",
    find: `  } else if (event.shiftKey && index === 0) {
    event.preventDefault();
    last.focus();
  } else if (!event.shiftKey && index === focusables.length - 1) {
    event.preventDefault();
    first.focus();`,
    replace: `  } else if (event.shiftKey && index === 0) {
    event.preventDefault();
  } else if (!event.shiftKey && index === focusables.length - 1) {
    event.preventDefault();`,
  },
  {
    id: "side-over-montado-abierto-sin-lock",
    file: "src/components/overlay/SideOver.vue",
    expect: "montar el panel ya abierto bloquea el scroll",
    find: `  if (props.modelValue) register();`,
    replace: `  /* mutado */`,
  },
  {
    id: "side-over-unlock-con-otro-abierto",
    file: "src/composables/useOverlayStack.ts",
    test: "src/components/overlay/SideOver.test.ts",
    expect: "cerrar un panel no libera el scroll si queda otro abierto",
    find: `  if (stack.scrollLocks === 0 && typeof document !== "undefined") {`,
    replace: `  if (typeof document !== "undefined") {`,
  },
  {
    id: "side-over-ce-metodos-sin-evento",
    file: "src/components/customElements/overlay/SideOver.ce.vue",
    test: "src/components/customElements/ce-parity.test.ts",
    expect: "show()/close()/toggle() emiten update:open",
    find: `  ceEmit("update:open", value);
  if (!value) ceEmit("close", undefined);`,
    replace: `  if (!value) ceEmit("close", undefined);`,
  },
  {
    id: "side-over-ce-sin-evento-close",
    file: "src/components/customElements/overlay/SideOver.ce.vue",
    test: "src/components/customElements/ce-parity.test.ts",
    expect: "cerrar el panel emite close una sola vez",
    find: `  if (!value) ceEmit("close", undefined);`,
    replace: `  /* mutado */`,
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
    id: "command-palette-enter-toma-item-enfocado",
    file: "src/components/overlay/CommandPalette.vue",
    expect: "Enter con el foco en un comando no ejecuta el comando resaltado",
    find: `  if ((event.target as HTMLElement | null)?.closest?.(".cu-command-palette-item")) return;`,
    replace: `  /* mutado */`,
  },
  {
    id: "command-palette-cierre-modal-no-resetea",
    file: "src/components/overlay/CommandPalette.vue",
    expect: "cerrar por Escape/backdrop/botón del modal limpia la búsqueda",
    find: `@close="handleClose"`,
    replace: `@close="emit('close')"`,
  },
  {
    id: "command-palette-resaltado-sin-scroll",
    file: "src/components/overlay/CommandPalette.vue",
    expect: "el comando resaltado se acerca a la vista al moverse",
    find: `  resultsRef.value
    ?.querySelector<HTMLElement>(".cu-command-palette-item--active")
    ?.scrollIntoView?.({ block: "nearest" });`,
    replace: `  /* mutado */`,
  },
  {
    id: "command-palette-cierre-no-resetea-scroll",
    file: "src/components/overlay/CommandPalette.vue",
    expect: "al reabrir, el listado vuelve arriba",
    find: `  if (resultsRef.value) resultsRef.value.scrollTop = 0;`,
    replace: `  /* mutado */`,
  },
  {
    id: "command-palette-label-como-html",
    file: "src/components/overlay/CommandPalette.vue",
    expect: "label/description/icon se muestran como texto",
    find: `{{ item.cmd.label }}`,
    replace: `<span v-html="item.cmd.label"></span>`,
  },
  {
    id: "command-palette-expanded-siempre",
    file: "src/components/overlay/CommandPalette.vue",
    expect: "aria-expanded refleja si la paleta está desplegada",
    find: `          :aria-expanded="expanded"`,
    replace: `          aria-expanded="true"`,
  },
  {
    id: "command-palette-sin-activedescendant",
    file: "src/components/overlay/CommandPalette.vue",
    expect: "el buscador anuncia el comando activo por aria-activedescendant",
    find: `          :aria-activedescendant="activeDescendant"`,
    replace: ``,
  },
  {
    id: "command-palette-items-paradas-de-tab",
    file: "src/components/overlay/CommandPalette.vue",
    expect: "los comandos no son paradas de tab",
    find: `              tabindex="-1"`,
    replace: `              tabindex="0"`,
  },
  {
    id: "command-palette-end-al-principio",
    file: "src/components/overlay/CommandPalette.vue",
    expect: "End lleva el activo al último comando",
    find: `    activeIndex.value = filtered.value.length - 1;`,
    replace: `    activeIndex.value = 0;`,
  },
  {
    id: "command-palette-option-siempre-seleccionada",
    file: "src/components/overlay/CommandPalette.vue",
    expect: "sólo el comando activo tiene aria-selected=true",
    find: `              :aria-selected="item.index === activeIndex"`,
    replace: `              aria-selected="true"`,
  },
  {
    id: "command-palette-sin-listbox",
    file: "src/components/overlay/CommandPalette.vue",
    expect: "el listado es un listbox; sin resultados no hay listbox",
    find: `        :role="filtered.length ? 'listbox' : undefined"`,
    replace: `        role="presentation"`,
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
    emit("change", value);
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
    commitValue(hex);
    emit("change", hex);
  }`,
    replace: `  value.value = hex;
  emit("change", hex);`,
  },
  {
    id: "color-picker-metodos-con-valor-viejo",
    file: "src/components/form/ColorPicker.vue",
    expect: "set()/get()/reset() ven el valor nuevo en el mismo tick (host con v-model)",
    find: `function commitValue(next: string) {
  current.value = next;
  if (next !== value.value) value.value = next;
}`,
    replace: `function commitValue(next: string) {
  if (next !== value.value) value.value = next;
}`,
  },
  {
    id: "color-picker-swatch-sin-nombre",
    file: "src/components/form/ColorPicker.vue",
    expect: "el swatch es un botón con nombre accesible",
    find: `      class="cu-color-picker-swatch"
      aria-label="Elegir color"`,
    replace: `      class="cu-color-picker-swatch"`,
  },
  {
    id: "color-picker-picker-nativo-expuesto",
    file: "src/components/form/ColorPicker.vue",
    expect: "el picker nativo queda fuera del árbol de accesibilidad",
    find: `      aria-hidden="true"
`,
    replace: ``,
  },
  {
    id: "color-picker-swatch-no-abre-picker",
    file: "src/components/form/ColorPicker.vue",
    expect: "el click en el swatch abre el picker nativo",
    find: `  pickerRef.value?.click();`,
    replace: `  /* mutado */`,
  },
  {
    id: "color-picker-swatch-disabled-ignorado",
    file: "src/components/form/ColorPicker.vue",
    expect: "con disabled el swatch queda deshabilitado (no abre el picker)",
    find: `      @click="onSwatchClick"
      :disabled="disabled"`,
    replace: `      @click="onSwatchClick"`,
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
  positionPanel({ width: box.width, height: box.height });`,
    replace: `  autoFixed.value = false;
  positionPanel({ width: box.width, height: box.height });`,
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
    id: "dropdown-menu-trigger-sin-aria",
    file: "src/components/controls/DropdownMenu.vue",
    expect: "el trigger anuncia aria-haspopup/aria-controls del panel",
    find: `  'aria-haspopup': 'menu',
  'aria-expanded': isOpen.value ? 'true' : 'false',
  'aria-controls': panelId,`,
    replace: `  'aria-expanded': isOpen.value ? 'true' : 'false',`,
  },
  {
    id: "dropdown-menu-filas-sin-menuitem",
    file: "src/components/controls/DropdownMenu.vue",
    expect: "cada fila del panel es role=menuitem",
    find: `            :role="item.selected ? 'menuitemcheckbox' : 'menuitem'"
`,
    replace: ``,
  },
  {
    id: "dropdown-menu-selected-sin-estado",
    file: "src/components/controls/DropdownMenu.vue",
    expect: "un item selected se anuncia como menuitemcheckbox marcado",
    find: `            :aria-checked="item.selected ? 'true' : undefined"
`,
    replace: ``,
  },
  {
    id: "dropdown-menu-flechas-no-mueven",
    file: "src/composables/useMenuNavigation.ts",
    expect: "las flechas mueven el foco entre las filas",
    find: `  function focusRow(rows: HTMLElement[], index: number) {
    const position = (index + rows.length) % rows.length;`,
    replace: `  function focusRow(rows: HTMLElement[], index: number) {
    if (rows.length >= 0) return;
    const position = (index + rows.length) % rows.length;`,
  },
  {
    id: "dropdown-menu-typeahead-sin-buscar",
    file: "src/composables/useMenuNavigation.ts",
    test: "src/components/controls/DropdownMenu.test.ts",
    expect: "tipear una letra enfoca la fila que empieza con ella",
    find: `    searchByPrefix(e.key, rows, current);`,
    replace: `    void e.key;`,
  },
  {
    id: "dropdown-menu-tab-no-cierra",
    file: "src/composables/useMenuNavigation.ts",
    test: "src/components/controls/DropdownMenu.test.ts",
    expect: "Tab saca el foco del menú y lo cierra",
    find: `      tabLeaving = true;
      return;`,
    replace: `    tabLeaving = false;
    return;`,
  },
  {
    id: "dropdown-menu-items-sin-filtro",
    file: "src/components/controls/DropdownMenu.vue",
    expect: "las entradas nulas de items se ignoran sin romper el menú",
    find: `  (Array.isArray(props.items) ? props.items : []).filter(
    (item): item is DropdownItem => !!item && typeof item === "object",
  ),`,
    replace: `  Array.isArray(props.items) ? props.items : [],`,
  },
  {
    id: "dropdown-menu-roving-sin-tabindex",
    // El roving vive en el composable compartido (lo usan DropdownMenu y Dropdown).
    file: "src/composables/useMenuNavigation.ts",
    expect: "la fila activa es la única parada de tabulación del menú",
    find: `    return position >= 0 && position === effectiveActiveRow.value ? 0 : -1;`,
    replace: `    return -1;`,
  },
  {
    id: "dropdown-menu-posicion-sin-fallback",
    file: "src/components/controls/DropdownMenu.vue",
    expect: "un position fuera del set cae a bottom",
    find: `const safePosition = computed(() => (isPosition(props.position) ? props.position : "bottom"));`,
    replace: `const safePosition = computed(() => props.position);`,
  },
  {
    id: "dropdown-menu-ce-items-sin-guarda",
    file: "src/components/customElements/controls/DropdownMenu.ce.vue",
    test: "src/components/customElements/ce-real.test.ts",
    expect: "un items que no es array no rompe el custom element",
    find: `  (Array.isArray(props.items) ? props.items : [])
    .filter((item: any) => !!item && typeof item === "object")`,
    replace: `  (props.items || [])`,
  },
  {
    id: "dropdown-menu-ce-toggle-sin-aria",
    file: "src/components/customElements/controls/DropdownMenu.ce.vue",
    test: "src/components/customElements/ce-real.test.ts",
    expect: "el trigger del light DOM recibe aria-expanded al abrir/cerrar",
    find: `watch(menuOpen, syncToggleAria);`,
    replace: ``,
  },
  {
    id: "pagination-pagesize-no-reset",
    file: "src/components/controls/Pagination.vue",
    expect: "cambiar el tamaño de página resetea a la página 1",
    find: `  emit("update:itemsPerPage", size);
  emit("update:currentPage", 1);`,
    replace: `  emit("update:itemsPerPage", size);`,
  },
  {
    id: "pagination-itemsperpage-fuera-de-opciones",
    file: "src/components/controls/Pagination.vue",
    expect: "el tamaño actual se agrega a las opciones del selector (no queda 'Seleccionar...')",
    find: `  const sizes = new Set([...configured, perPage.value]);`,
    replace: `  const sizes = new Set(configured);`,
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
    id: "navbar-horizontal-sin-padre-activo",
    file: "src/components/navigation/NavbarHorizontal.vue",
    expect: "un item activo dentro de un submenú resalta al padre",
    find: `  if (target === item) return true
  const contains = (children?: NavItem[]): boolean =>
    (children ?? []).some((child) => child === target || contains(child.children))
  return contains(item.children)`,
    replace: `  return target === item`,
  },
  {
    id: "navbar-horizontal-trigger-sin-type",
    file: "src/components/navigation/NavbarHorizontal.vue",
    expect: "el trigger del submenú es un button type=button (no envía un form)",
    find: `          <button
            type="button"
            class="cu-navbar-dropdown-trigger"`,
    replace: `          <button
            class="cu-navbar-dropdown-trigger"`,
  },
  {
    id: "navbar-horizontal-trigger-sin-aria-expanded",
    file: "src/components/navigation/NavbarHorizontal.vue",
    expect: "el trigger del submenú expone aria-expanded",
    find: `            :aria-expanded="isOpen ? 'true' : 'false'"`,
    replace: `            :aria-expanded="undefined"`,
  },
  {
    id: "navbar-horizontal-sin-aria-current",
    file: "src/components/navigation/NavbarHorizontal.vue",
    expect: "el enlace activo expone aria-current=page",
    find: `        :aria-current="activeItem === item ? 'page' : undefined"`,
    replace: `        :aria-current="undefined"`,
  },
  {
    id: "usenavbar-items-undefined",
    file: "src/composables/useNavbar.ts",
    test: "src/components/navigation/NavbarHorizontal.test.ts",
    expect: "el CE tolera `items` undefined hasta que la propiedad JS se asigna",
    find: `const navItems = (): NavItem[] => options.items() ?? []`,
    replace: `const navItems = (): NavItem[] => options.items() as NavItem[]`,
  },
  {
    id: "usenavbar-scroll-global",
    file: "src/composables/useNavbar.ts",
    test: "src/components/navigation/NavbarHorizontal.test.ts",
    expect: "el scroll del activo busca el marcador dentro de su propia nav",
    find: `    if (root) return root.querySelector<HTMLElement>(\`[\${attr}]\`)`,
    replace: `    if (root) return document.querySelector<HTMLElement>(\`[\${attr}]\`)`,
  },
  {
    id: "navbar-horizontal-sin-haspopup",
    file: "src/components/navigation/NavbarHorizontal.vue",
    expect: "el trigger del submenú anuncia que abre un menú",
    find: `            aria-haspopup="menu"
            :aria-expanded`,
    replace: `            :aria-expanded`,
  },
  {
    id: "navbar-menu-trigger-sin-flechas",
    file: "src/utils/navbarMenuTrigger.ts",
    test: "src/components/navigation/NavbarHorizontal.test.ts",
    expect: "ArrowDown/ArrowUp en el trigger abren el menú y enfocan una fila",
    find: `  if (event.key !== 'ArrowDown' && event.key !== 'ArrowUp') return
  event.preventDefault()`,
    replace: `  return
  event.preventDefault()`,
  },
  {
    id: "navbar-menu-sin-roving-tabindex",
    file: "src/components/navigation/NavbarMenu.vue",
    expect: "el menú es una sola parada de tabulación (roving tabindex)",
    find: `  return position === active ? 0 : -1`,
    replace: `  return -1`,
  },
  {
    id: "navbar-menu-sin-flechas",
    file: "src/components/navigation/NavbarMenu.vue",
    expect: "las flechas recorren las filas del menú",
    find: `    focusRow(list, current < 0 ? 0 : current + 1)`,
    replace: `    void list`,
  },
  {
    id: "navbar-menu-sin-aria-expanded",
    file: "src/components/navigation/NavbarMenu.vue",
    expect: "la fila de submenú refleja el estado del panel",
    find: `            :aria-expanded="isOpen ? 'true' : 'false'"`,
    replace: `            :aria-expanded="undefined"`,
  },
  {
    id: "sanitizeicon-allowlist-html",
    file: "src/utils/sanitizeIcon.ts",
    expect: "el allowlist de iconos deja sólo SVG inline (sin <a>/<img>/handlers)",
    find: `    ALLOWED_TAGS: ICON_TAGS,`,
    replace: `    ALLOWED_TAGS: undefined,`,
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
    find: `:href="safePath(item.path)"`,
    replace: `href="#"`,
  },
  {
    id: "navbar-responsive-dinamico",
    file: "src/components/navigation/Navbar.vue",
    expect: "activar `responsive` después de montar engancha el modo auto (pantalla chica)",
    find: `watch(() => props.responsive, syncTinyWatcher)`,
    replace: `watch(() => false, syncTinyWatcher)`,
  },
  {
    id: "navbar-items-sin-guard",
    file: "src/composables/useNavbar.ts",
    test: "src/components/navigation/Navbar.test.ts",
    expect: "montar la nav antes de asignar `items` no rompe el render (CE)",
    find: `const navItems = (): NavItem[] => options.items() ?? []`,
    replace: `const navItems = (): NavItem[] => options.items()`,
  },
  {
    id: "navbar-scroll-global-entre-instancias",
    file: "src/components/navigation/Navbar.vue",
    expect: "cada instancia scrollea su propio marcador (no el primero del documento)",
    find: `  <div ref="navRef" class="cu-navbar-responsive"`,
    replace: `  <div class="cu-navbar-responsive"`,
  },
  {
    id: "navbar-panel-teleport-fuera-del-shadow",
    file: "src/components/navigation/Navbar.vue",
    expect: "dentro de un shadow root el panel no se teleporta a body (conserva estilos)",
    find: `  return !(typeof ShadowRoot !== 'undefined' && root instanceof ShadowRoot)`,
    replace: `  return true`,
  },
  {
    id: "navbar-sideover-position-sin-fallback",
    file: "src/components/navigation/Navbar.vue",
    expect: "un sideOverPosition inválido cae al borde seguro",
    find: `const safeSideOverPosition = computed(() =>
  isPosition(props.sideOverPosition) ? props.sideOverPosition : 'left',
)`,
    replace: `const safeSideOverPosition = computed(() => props.sideOverPosition)`,
  },
  {
    id: "navbar-dialogo-sin-nombre",
    file: "src/components/navigation/Navbar.vue",
    expect: "el diálogo del menú mobile tiene nombre accesible propio",
    find: `      aria-label="Menú"
`,
    replace: ``,
  },
  {
    id: "navbar-list-compact-sin-nombre-accesible",
    file: "src/components/navigation/NavbarList.vue",
    expect: "en compact el item hoja conserva su nombre accesible",
    find: `:aria-label="compact ? item.label : undefined"`,
    replace: `:aria-label="undefined"`,
  },
  {
    id: "navbar-list-compact-trigger-sin-expanded",
    file: "src/components/navigation/NavbarList.vue",
    expect: "el trigger del flyout expone aria-expanded",
    find: `:aria-expanded="isOpen ? 'true' : 'false'"`,
    replace: `:aria-expanded="undefined"`,
  },
  {
    id: "navbar-menu-path-sin-validar",
    file: "src/components/navigation/NavbarMenu.vue",
    expect: "un path con esquema ejecutable no se renderiza como enlace",
    find: `  if (/^(?:javascript|vbscript|data):/i.test(compact)) return undefined
`,
    replace: ``,
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
    id: "code-block-sin-foco-teclado",
    file: "src/components/markdown/CodeBlock.vue",
    expect: "el bloque scrolleable es focusable por teclado (tabindex/role/label)",
    find: `tabindex="0" role="region" :aria-label="codeLabel"`,
    replace: `:aria-label="codeLabel"`,
  },
  {
    id: "markdown-link-sanitizado-sin-target",
    file: "src/components/markdown/Markdown.vue",
    expect: "los links de blockquotes y celdas abren en pestaña nueva",
    find: `const SANITIZE_OPTIONS = { ADD_ATTR: ['target'] }`,
    replace: `const SANITIZE_OPTIONS = {}`,
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
    id: "inline-renderer-image-href-sin-escapar",
    file: "src/components/markdown/InlineRenderer.vue",
    expect: "una URL de imagen con comillas no inyecta atributos (XSS)",
    find: "`<img src=\"${escapeHtml(token.href)}\" alt=\"${escapeText(plainText(token.tokens || []) || token.text || '')}\" class=\"cu-md-image\" />`",
    replace: "`<img src=\"${token.href}\" alt=\"${escapeText(plainText(token.tokens || []) || token.text || '')}\" class=\"cu-md-image\" />`",
  },
  {
    id: "inline-renderer-alt-entidades-doble-escape",
    file: "src/components/markdown/InlineRenderer.vue",
    expect: "el alt no vuelve a escapar las entidades (&amp; → &)",
    find: "alt=\"${escapeText(plainText(token.tokens || []) || token.text || '')}\"",
    replace: "alt=\"${escapeHtml(plainText(token.tokens || []) || token.text || '')}\"",
  },
  {
    id: "inline-renderer-escape-sin-escapar",
    file: "src/components/markdown/InlineRenderer.vue",
    expect: "un token escape con `<` no reabre una etiqueta (XSS)",
    find: `      return escapeHtml(token.text)
    default:`,
    replace: `      return token.text
    default:`,
  },
  {
    id: "markdown-heading-id-desde-html",
    file: "src/markdown/index.ts",
    test: "src/components/markdown/Markdown.test.ts",
    expect: "el id del heading sale del texto, no del HTML con clases",
    find: "const base = slugify(plainText(token.tokens)) || 'section'",
    replace: "const base = slugify(marked.parser([token])) || 'section'",
  },
  {
    id: "markdown-heading-ids-duplicados",
    file: "src/markdown/index.ts",
    test: "src/components/markdown/Markdown.test.ts",
    expect: "dos headings iguales reciben ids únicos",
    find: "id: count === 0 ? base : `${base}-${count}`,",
    replace: "id: base,",
  },
  {
    id: "markdown-tabla-columnas-duplicadas",
    file: "src/markdown/index.ts",
    test: "src/components/markdown/Markdown.test.ts",
    expect: "dos columnas con el mismo encabezado conservan sus celdas",
    find: "return { key: count === 0 ? base : `${base}-${count}`, label }",
    replace: "return { key: base, label }",
  },
  {
    id: "markdown-tabla-celda-sin-encabezado",
    file: "src/markdown/index.ts",
    test: "src/components/markdown/Markdown.test.ts",
    expect: "una columna sin encabezado conserva su celda",
    find: "if (column) obj[column.key] = marked.parseInline(cell.text)",
    replace: "if (column && column.label) obj[column.key] = marked.parseInline(cell.text)",
  },
  {
    id: "markdown-tabla-encabezado-con-marcado",
    file: "src/markdown/index.ts",
    test: "src/components/markdown/Markdown.test.ts",
    expect: "el encabezado de tabla muestra texto plano, sin marcado",
    find: "const label = plainText(cell.tokens)",
    replace: "const label = cell.text",
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
    id: "floating-button-posicion-sin-vars",
    file: "src/components/buttons/FloatingButton.vue",
    expect: "la posición del FAB sale de --cu-fab-bottom/right con el spacing del tema",
    find: `  bottom: 'calc(var(--cu-fab-bottom, var(--cu-space-lg)) + env(safe-area-inset-bottom, 0px))',`,
    replace: `  bottom: 'var(--cu-space-lg)',`,
  },
  {
    id: "floating-button-sin-zona-segura",
    file: "src/components/buttons/FloatingButton.vue",
    expect: "el margen derecho suma la zona segura de iOS (env)",
    find: `  right: 'calc(var(--cu-fab-right, var(--cu-space-lg)) + env(safe-area-inset-right, 0px))',`,
    replace: `  right: 'var(--cu-fab-right, var(--cu-space-lg))',`,
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
    id: "texto-atenuado-sin-contraste",
    file: "src/plugins/cu-tokens/css.ts",
    test: "src/plugins/cu-tokens/contrast.test.ts",
    expect: "los tokens -text-muted/-text-subtle garantizan 4.5:1 / 6:1 (color, no opacity)",
    find: `--cu-color-\${name}-text-muted: \${mutedTextColor(text, mutedBg, MIN_TEXT_CONTRAST)};`,
    replace: `--cu-color-\${name}-text-muted: \${mutedTextColor(text, mutedBg, 3)};`,
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
    id: "advanced-table-icon-sin-sanitizar",
    file: "src/components/data/AdvancedTable.vue",
    expect: "el icono de un botón de celda pasa por DOMPurify antes del v-html",
    find: `v-html="sanitizeIcon(button.icon as string)"`,
    replace: `v-html="button.icon"`,
  },
  {
    id: "advanced-table-action-icon-sin-sanitizar",
    file: "src/components/data/AdvancedTable.vue",
    expect: "el icono de una acción del dropdown pasa por DOMPurify",
    find: `      icon: typeof action.icon === "string" ? sanitizeIcon(action.icon) : action.icon,\n`,
    replace: ``,
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
    expect: "confirmar por encima de max recorta al máximo",
    find: `  if (maxValue.value !== undefined) clamped = Math.min(maxValue.value, clamped);`,
    replace: `  /* mutado: sin tope máximo */`,
  },
  {
    id: "number-input-clamp-min-ignorado",
    file: "src/components/form/NumberInput.vue",
    expect: "confirmar por debajo de min recorta al mínimo",
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
    find: `  () => maxValue.value !== undefined && current.value !== null && current.value >= maxValue.value,`,
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
    expect: "tipear un valor en rango actualiza el modelo y emite update:modelValue",
    find: `  if (clamp(parsed) === parsed && parsed !== current.value) commitValue(parsed);
}

/** Confirma el texto (Enter o blur) y emite \`change\` si hubo edición. */`,
    replace: `}

/** Confirma el texto (Enter o blur) y emite \`change\` si hubo edición. */`,
  },
  {
    id: "number-input-clamp-al-tipear",
    file: "src/components/form/NumberInput.vue",
    expect: "tipear fuera de rango no reescribe el texto ni toca el modelo",
    find: `  if (clamp(parsed) === parsed && parsed !== current.value) commitValue(parsed);`,
    replace: `  const clamped = clamp(parsed);
  if (clamped !== parsed) text.value = numberToText(clamped);
  if (clamped !== current.value) commitValue(clamped);`,
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
    id: "number-input-metodos-con-valor-viejo",
    file: "src/components/form/NumberInput.vue",
    expect: "set()/get()/increment() ven el valor nuevo en el mismo tick (host con v-model)",
    find: `function commitValue(next: number | null) {
  current.value = next;
  if (next !== value.value) value.value = next;
}`,
    replace: `function commitValue(next: number | null) {
  if (next !== value.value) value.value = next;
}`,
  },
  {
    id: "number-input-paso-exponencial-ignorado",
    file: "src/components/form/NumberInput.vue",
    expect: "un paso por debajo de 1e-6 (notación exponencial) también suma",
    find: `  const [mantissa = '', exponent] = String(next).split('e');`,
    replace: `  const [mantissa = '', exponent] = [String(next), undefined];`,
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
    find: `          target.click();`,
    replace: `          target.focus();`,
  },
  {
    id: "dropdown-menu-text-align-solo-text-align",
    file: "src/components/controls/DropdownMenu.vue",
    expect: "textAlign alinea los items del panel (justify-content, no sólo text-align)",
    find: `const itemStyle = computed(() => textAlignStyle(safeTextAlign.value));`,
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
    find: `    <span v-if="safeIcon" v-html="safeIcon" :class="props.iconClass"></span>`,
    replace: `    <span v-if="false" v-html="safeIcon" :class="props.iconClass"></span>`,
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
    find: "  '--badge-solid': `var(--cu-color-${safeColor.value}-solid)`,",
    replace: "  '--badge-solid': `var(--cu-color-${safeColor.value})`,",
  },
  {
    id: "alert-solid-color-crudo",
    file: "src/components/information/Alert.vue",
    expect: "alert solid usa la variante -solid de fondo",
    find: "  '--alert-solid': `var(--cu-color-${safeColor.value}-solid)`,",
    replace: "  '--alert-solid': `var(--cu-color-${safeColor.value})`,",
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
  {
    id: "advanced-table-escape-guarda-valor",
    file: "src/components/data/EditableTableCell.vue",
    expect: "Escape cancela: no emite edit-save y no escribe la fila (el blur del editor desmontado no guarda)",
    find: `  saving.value = true;
  nextTick(() => { saving.value = false; });
  if (inlineEdit.value) {`,
    replace: `  if (inlineEdit.value) {`,
  },
  {
    id: "editable-cell-regex-stateful",
    file: "src/components/data/EditableTableCell.vue",
    expect: "un RegExp con flag `g` valida igual en guardados consecutivos (no alterna por lastIndex)",
    find: `  pattern.lastIndex = 0;
  const matches = pattern.test(value);
  pattern.lastIndex = 0;`,
    replace: `  const matches = pattern.test(value);`,
  },
  {
    id: "editable-cell-vista-sin-teclado",
    file: "src/components/data/EditableTableCell.vue",
    expect: "la vista del lápiz es enfocable y se anuncia como botón (editable con teclado)",
    find: `        :role="canEdit ? 'button' : undefined"
        :tabindex="canEdit ? 0 : undefined"`,
    replace: ``,
  },
  {
    id: "advanced-table-empty-default-sin-texto",
    file: "src/components/customElements/data/AdvancedTable.ce.vue",
    test: "src/components/data/AdvancedTable.test.ts",
    expect: "sin `empty` el custom element muestra el texto por defecto (no una celda vacía)",
    find: `    default: "No hay datos que mostrar",`,
    replace: `    default: "",`,
  },
  {
    id: "advanced-table-itemsperpage-invalido",
    file: "src/components/data/AdvancedTable.vue",
    expect: "un `itemsPerPage` 0 o negativo en caliente cae al default y no vacía la tabla",
    find: `  return Number.isFinite(size) && size >= 1 ? Math.floor(size) : DEFAULT_ITEMS_PER_PAGE;`,
    replace: `  return size;`,
  },
  {
    id: "advanced-table-aria-sort-ignorado",
    file: "src/components/data/AdvancedTable.vue",
    expect: "`aria-sort` del th refleja el ordenamiento (none → ascending → descending)",
    find: `      'aria-sort':
        sortBy.value === col.key && sortDir.value
          ? sortDir.value === 'asc' ? 'ascending' : 'descending'
          : 'none',`,
    replace: `      'aria-sort': 'none',`,
  },
  {
    id: "advanced-table-sort-sin-nombre-accesible",
    file: "src/components/data/AdvancedTable.vue",
    expect: "el botón de ordenamiento tiene nombre accesible (`Ordenar por …`)",
    find: `              :aria-label="\`Ordenar por \${column.label ?? column.key}\`"
`,
    replace: ``,
  },
  {
    id: "advanced-table-toggle-acciones-sin-nombre",
    file: "src/components/data/AdvancedTable.vue",
    expect: "el toggle '...' de acciones tiene nombre accesible (es un botón de solo ícono)",
    find: `                aria-label="Acciones de la fila"
`,
    replace: ``,
  },
  {
    id: "cu-table-getdata-sin-filtro",
    file: "src/components/customElements/data/AdvancedTable.ce.vue",
    test: "src/components/data/AdvancedTable.test.ts",
    expect: "`getData(fn)` en el custom element filtra igual que en el componente Vue",
    find: `  getData: (filterFn?: (row: Record<string, any>) => boolean) => tableRef.value?.getData(filterFn),`,
    replace: `  getData: () => tableRef.value?.getData(),`,
  },
  {
    id: "advanced-table-cell-array-render",
    file: "src/components/data/AdvancedTable.vue",
    expect: "un `cell` que devuelve string[] se renderiza una línea por elemento (no el JSON de Vue)",
    find: `  if (!Array.isArray(value)) return null;
  return value.map((line) => (line == null ? "" : String(line)));`,
    replace: `  void value;
  return null;`,
  },
  {
    id: "tabs-active-disabled-no-se-saltea",
    file: "src/components/Tabs.vue",
    expect: "un modelValue que apunta a una tab deshabilitada cae en la primera habilitada",
    find: `  const requested = tabList.value.find((t) => t.key === active.value)
  if (requested && !requested.disabled) return requested.key`,
    replace: `  const requested = tabList.value.find((t) => t.key === active.value)
  if (requested) return requested.key`,
  },
  {
    id: "tabs-aria-controls-panel-inexistente",
    file: "src/components/Tabs.vue",
    expect: "aria-controls sólo se declara cuando el panel existe",
    find: `:aria-controls="hasPanel(tab) ? panelId(tab.key) : undefined"`,
    replace: `:aria-controls="panelId(tab.key)"`,
  },
  {
    id: "tabs-color-sin-fallback",
    file: "src/components/Tabs.vue",
    expect: "un color fuera del set cae en primary (tab activo visible)",
    find: `const safeColor = computed(() => (isColor(props.color) ? props.color : 'primary'))`,
    replace: `const safeColor = computed(() => props.color)`,
  },
  {
    id: "tabs-change-en-misma-tab",
    file: "src/components/Tabs.vue",
    expect: "click en la tab ya activa no emite change",
    find: `  if (key === activeKey.value) return;`,
    replace: `  /* mutado */`,
  },
  {
    id: "tabs-tabindex-todas-cero",
    file: "src/components/Tabs.vue",
    expect: "roving tabindex: sólo la tab activa tiene 0",
    find: `:tabindex="tab.key === activeKey ? 0 : -1"`,
    replace: `:tabindex="0"`,
  },
  {
    id: "tabs-keepalive-desmonta",
    file: "src/components/Tabs.vue",
    expect: "un panel keepAlive se queda montado al cambiar de tab",
    find: `v-if="tab.keepAlive || tab.key === activeKey"`,
    replace: `v-if="tab.key === activeKey"`,
  },
  {
    id: "tabs-flechas-pisan-deshabilitadas",
    file: "src/components/Tabs.vue",
    expect: "la navegación por flechas saltea las tabs deshabilitadas",
    find: `    if (tab && !tab.disabled) {
      select(tab.key);`,
    replace: `    if (tab) {
      select(tab.key);`,
  },
  {
    id: "tabs-tabs-null-sin-normalizar",
    file: "src/components/Tabs.vue",
    expect: "tabs null no rompe el render ni la API",
    find: `  const raw = Array.isArray(props.tabs) ? props.tabs : []`,
    replace: `  const raw = props.tabs`,
  },
  {
    id: "tabs-ids-sin-prefijo-instancia",
    file: "src/components/Tabs.vue",
    expect: "dos instancias con las mismas keys generan ids distintos",
    find: `const idPrefix = \`cu-tabs-\${idSafe(uid)}\`;`,
    replace: `const idPrefix = "cu-tabs";`,
  },
  {
    id: "menu-option-icon-sin-sanitizar",
    file: "src/components/controls/MenuOption.vue",
    expect: "el ícono compartido de las listas se sanitiza antes del v-html",
    find: `const safeIcon = computed(() => (props.icon ? DOMPurify.sanitize(props.icon) : undefined));`,
    replace: `const safeIcon = computed(() => props.icon);`,
  },
  {
    id: "dropdown-item-icon-sin-sanitizar",
    file: "src/components/overlay/Dropdown.vue",
    expect: "el ícono de un item del dropdown se sanitiza antes del v-html",
    find: `          <span v-if="item.icon" class="cu-dropdown-menu-item-icon" v-html="sanitizeIcon(item.icon)"></span>
          <span class="cu-dropdown-menu-item-label">{{ item.label }}</span>
        </button>`,
    replace: `          <span v-if="item.icon" class="cu-dropdown-menu-item-icon" v-html="item.icon"></span>
          <span class="cu-dropdown-menu-item-label">{{ item.label }}</span>
        </button>`,
  },
  {
    id: "dropdown-nested-icon-sin-sanitizar",
    file: "src/components/overlay/Dropdown.vue",
    expect: "el ícono del trigger anidado se sanitiza antes del v-html",
    find: `          <span v-if="icon" class="cu-dropdown-menu-item-icon" v-html="sanitizeIcon(icon)"></span>`,
    replace: `          <span v-if="icon" class="cu-dropdown-menu-item-icon" v-html="icon"></span>`,
  },
  {
    id: "collapse-icon-sin-sanitizar",
    file: "src/components/overlay/Collapse.vue",
    expect: "el ícono del collapse se sanitiza antes del v-html",
    find: `const safeIcon = computed(() => (props.icon ? DOMPurify.sanitize(props.icon) : undefined))`,
    replace: `const safeIcon = computed(() => props.icon)`,
  },
  {
    id: "navbar-list-icon-sin-sanitizar",
    file: "src/components/navigation/NavbarList.vue",
    expect: "el ícono de un item de la nav se sanitiza antes del v-html",
    find: `  if (item.icon) return sanitizeIcon(item.icon) ?? ''`,
    replace: `  if (item.icon) return item.icon`,
  },
  {
    id: "navbar-horizontal-icon-sin-sanitizar",
    file: "src/components/navigation/NavbarHorizontal.vue",
    expect: "el ícono de un item horizontal se sanitiza antes del v-html",
    find: `        <span v-if="item.icon" class="cu-navbar-icon" v-html="sanitizeIcon(item.icon)"></span>
        <span class="cu-navbar-label">`,
    replace: `        <span v-if="item.icon" class="cu-navbar-icon" v-html="item.icon"></span>
        <span class="cu-navbar-label">`,
  },
  {
    id: "navbar-menu-icon-sin-sanitizar",
    file: "src/components/navigation/NavbarMenu.vue",
    expect: "el ícono de un item del menú se sanitiza antes del v-html",
    find: `        <span v-if="item.icon" class="cu-navbar-menu-icon" v-html="sanitizeIcon(item.icon)"></span>
        <span class="cu-navbar-menu-item-label">{{ item.label }}</span>
      </a>`,
    replace: `        <span v-if="item.icon" class="cu-navbar-menu-icon" v-html="item.icon"></span>
        <span class="cu-navbar-menu-item-label">{{ item.label }}</span>
      </a>`,
  },
  {
    id: "tabs-icon-sin-sanitizar",
    file: "src/components/Tabs.vue",
    expect: "el icono se sanitiza antes del v-html (sin script ni handlers on*)",
    find: `icon: sanitizeIcon(t.icon)`,
    replace: `icon: t.icon`,
  },
  {
    id: "tabs-foco-no-se-restaura",
    file: "src/components/Tabs.vue",
    expect: "al eliminar la tab enfocada el foco pasa a la nueva tab activa",
    find: `    tabRefs.value[next]?.focus();`,
    replace: `    void next;`,
  },
  {
    id: "calendar-setvalue-ignora-deshabilitados",
    file: "src/components/controls/Calendar.vue",
    expect: "setValue no selecciona un día deshabilitado (min/max/weekdays/dates)",
    find: `  if (isDisabledDay(parsed)) return`,
    replace: `  if (parsed === null) return`,
  },
  {
    id: "calendar-clear-en-single",
    file: "src/components/controls/Calendar.vue",
    expect: "clear() en single no emite un change con forma de rango",
    find: `  if (!isRange.value) return
  clearRange()`,
    replace: `  clearRange()`,
  },
  {
    id: "calendar-mes-inicial-sin-rango",
    file: "src/components/controls/Calendar.vue",
    expect: "en modo rango el mes visible arranca en rangeStart/rangeEnd",
    find: `    parseDate(props.modelValue) ??
    parseDate(props.rangeStart) ??
    parseDate(props.rangeEnd) ??
    startOfCurrentMonth()`,
    replace: `    parseDate(props.modelValue) ??
    startOfCurrentMonth()`,
  },
  {
    id: "calendar-viewmonth-sin-recorte",
    file: "src/components/controls/Calendar.vue",
    expect: "el viewMonth controlado se recorta a min/max (header y grilla coinciden)",
    find: `const viewMonth = computed<Date>(() => clampMonth(viewMonthProp.value ?? internalViewMonth.value))`,
    replace: `const viewMonth = computed<Date>(() => viewMonthProp.value ?? internalViewMonth.value)`,
  },
  {
    id: "calendar-eventos-fecha-invalida",
    file: "src/components/controls/Calendar.vue",
    expect: "un evento con fecha inválida no rompe el render de la grilla",
    find: `    return date !== null && sameDay(date, day)`,
    replace: `    return sameDay(date as Date, day)`,
  },
  {
    id: "calendar-aria-selected",
    file: "src/components/controls/Calendar.vue",
    expect: "el día seleccionado se anuncia con aria-selected",
    find: `:aria-selected="isDaySelected(cell.date) ? 'true' : 'false'"`,
    replace: `aria-selected="false"`,
  },
  {
    id: "calendar-roving-tabindex",
    file: "src/components/controls/Calendar.vue",
    expect: "la grilla tiene un solo tab-stop (roving tabindex)",
    find: `:tabindex="isTabStop(cell.date) ? 0 : -1"`,
    replace: `tabindex="0"`,
  },
  {
    id: "calendar-teclado-flecha-derecha",
    file: "src/components/controls/Calendar.vue",
    expect: "ArrowRight mueve el foco al día siguiente",
    find: `    case 'ArrowRight':
      next = findEnabledDay(current, 1)
      break`,
    replace: `    case 'ArrowRight':
      break`,
  },
  {
    id: "calendar-teclado-saltea-deshabilitados",
    file: "src/components/controls/Calendar.vue",
    expect: "las flechas saltean los días deshabilitados (button disabled)",
    find: `  let candidate = addDays(from, step)
  for (let i = 0; i < 370; i++) {
    if (isOutOfLimits(candidate)) return null
    if (!isDisabledDay(candidate)) return candidate
    candidate = addDays(candidate, step)
  }
  return null`,
    replace: `  const candidate = addDays(from, step)
  return isOutOfLimits(candidate) ? null : candidate`,
  },
  {
    id: "calendar-teclado-home-end",
    file: "src/components/controls/Calendar.vue",
    expect: "Home/End caen en un borde habilitado de la semana",
    find: `  const step = edge === 'start' ? 1 : -1
  let candidate = edge === 'start' ? weekStart : addDays(weekStart, 6)
  for (let i = 0; i < 7; i++) {
    if (!isOutOfLimits(candidate) && !isDisabledDay(candidate)) return candidate
    candidate = addDays(candidate, step)
  }
  return null`,
    replace: `  const candidate = edge === 'start' ? weekStart : addDays(weekStart, 6)
  return isOutOfLimits(candidate) ? null : candidate`,
  },
  {
    id: "calendar-teclado-page-nearest",
    file: "src/components/controls/Calendar.vue",
    expect: "PageUp/PageDown caen en el día habilitado más cercano",
    find: `  for (let delta = 0; delta < daysInMonth; delta++) {
    for (const day of delta === 0 ? [dayOfMonth] : [dayOfMonth + delta, dayOfMonth - delta]) {
      if (day < 1 || day > daysInMonth) continue
      const candidate = new Date(year, month, day)
      if (!isOutOfLimits(candidate) && !isDisabledDay(candidate)) return candidate
    }
  }
  return null`,
    replace: `  void daysInMonth
  void dayOfMonth
  return isOutOfLimits(target) ? null : target`,
  },
  {
    id: "calendar-tabstop-nunca-deshabilitado",
    file: "src/components/controls/Calendar.vue",
    expect: "el tab-stop de la grilla nunca es un día deshabilitado",
    find: `  if (focused && sameMonth(focused, viewMonth.value) && !isDisabledDay(focused)) return focused`,
    replace: `  if (focused && sameMonth(focused, viewMonth.value)) return focused`,
  },
  {
    id: "calendar-teclado-page-down",
    file: "src/components/controls/Calendar.vue",
    expect: "PageDown pasa al mes siguiente",
    find: `    case 'PageDown':
      next = nearestEnabledInMonth(shiftMonth(current, 1))
      break`,
    replace: `    case 'PageDown':
      break`,
  },
  {
    id: "calendar-aria-disabled",
    file: "src/components/controls/Calendar.vue",
    expect: "el día deshabilitado se anuncia con aria-disabled",
    find: `:aria-disabled="isDisabledDay(cell.date) ? 'true' : undefined"`,
    replace: `:aria-disabled="undefined"`,
  },
  {
    id: "calendar-columnheader",
    file: "src/components/controls/Calendar.vue",
    expect: "los encabezados de día son columnheader con nombre completo",
    find: `        role="columnheader"
        :aria-label="label.long"`,
    replace: ``,
  },
  {
    id: "date-picker-hoy-fuera-de-rango",
    file: "src/components/form/DatePicker.vue",
    expect: "«Hoy» fuera de min/max no emite un valor inválido",
    find: `  if (isDisabledDate(now)) return`,
    replace: ``,
  },
  {
    id: "date-picker-hoy-sin-deshabilitar",
    file: "src/components/form/DatePicker.vue",
    expect: "«Hoy» se deshabilita cuando hoy queda fuera de min/max",
    find: `            :disabled="todayDisabled"`,
    replace: ``,
  },
  {
    id: "date-picker-setvalue-fuera-de-rango",
    file: "src/components/form/DatePicker.vue",
    expect: "setValue no selecciona un día fuera de min/max",
    find: `  if (isDisabledDate(parsed)) return`,
    replace: ``,
  },
  {
    id: "date-picker-aria-expanded",
    file: "src/components/form/DatePicker.vue",
    expect: "el trigger refleja el estado del panel con aria-expanded",
    find: `:aria-expanded="isOpen ? 'true' : 'false'"`,
    replace: `aria-expanded="false"`,
  },
  {
    id: "date-picker-panel-sin-rol",
    file: "src/components/form/DatePicker.vue",
    expect: "el panel del date-picker se anuncia como dialog",
    find: `      panel-role="dialog"
`,
    replace: ``,
  },
  {
    id: "dual-calendar-meses-sin-recorte",
    file: "src/components/controls/DualCalendar.vue",
    expect: "los dos meses se recortan a min/max",
    find: `  if (minMonth && target < minMonth) return minMonth
  if (maxMonth && target > maxMonth) return maxMonth
  return target`,
    replace: `  void minMonth
  void maxMonth
  return target`,
  },
  {
    id: "popover-foco-no-vuelve-al-cerrar",
    file: "src/components/overlay/Popover.vue",
    expect: "al cerrar, el foco que estaba en el panel vuelve al trigger",
    find: `  unregisterHover();
  restoreFocus();
}`,
    replace: `  unregisterHover();
}`,
  },
  {
    id: "popover-foco-roba-el-click-afuera",
    file: "src/components/overlay/Popover.vue",
    expect: "un click afuera sobre otro control no le roba el foco",
    find: `  const target = insidePanel ? (focusBeforeOpen ?? triggerElement()) : lost ? focusBeforeOpen : null;`,
    replace: `  void insidePanel;
  void lost;
  const target = focusBeforeOpen ?? triggerElement();`,
  },
  {
    id: "dropdown-panelrole-ignorado",
    file: "src/components/overlay/Dropdown.vue",
    expect: "panelRole define el rol ARIA del panel (el date-picker usa dialog)",
    find: `    :role="panelRole"`,
    replace: `    :role="'menu'"`,
  },
  {
    id: "autocomplete-foco-reabre-el-panel",
    file: "src/components/form/Autocomplete.vue",
    expect: "el foco restaurado al cerrar no reabre la lista",
    find: `  if (ignoreFocusAfterClose) return;`,
    replace: `  if (false) return;`,
  },
  {
    id: "month-slider-label-contraste",
    file: "src/components/controls/month-slider/MonthSliderLabel.vue",
    test: "src/components/controls/month-slider/MonthSliderLabel.contrast.test.ts",
    expect: "el label usa el tono de texto accesible (-text), no el color base",
    find: `.cu-month-slider-label.cu-month-slider-label--soft {
  background-color: var(--ms-soft);
  color: var(--ms-accent-text);
}`,
    replace: `.cu-month-slider-label.cu-month-slider-label--soft {
  background-color: var(--ms-soft);
  color: var(--ms-accent);
}`,
  },
  {
    id: "year-slider-sin-tokens-del-label",
    file: "src/components/controls/YearSlider.vue",
    test: "src/components/controls/month-slider/MonthSliderLabel.contrast.test.ts",
    expect: "YearSlider declara las variables del label (solid/outlined no quedan vacías)",
    find: `  '--ms-solid': \`var(--cu-color-\${props.color}-solid)\`,
  '--ms-solid-hover': \`var(--cu-color-\${props.color}-solid-hover)\`,
`,
    replace: ``,
  },
  // ── lote 3 · cu-select / cu-autocomplete ──
  {
    id: "autocomplete-foco-fuera-no-cierra-panel",
    file: "src/components/form/Autocomplete.vue",
    expect: "el foco que sale del campo cierra el panel",
    find: `  if (dropdownRef.value?.isOpen()) setTimeout(() => dropdownRef.value?.close(), 0);`,
    replace: `  /* mutado */`,
  },
  {
    id: "autocomplete-click-no-reabre",
    file: "src/components/form/Autocomplete.vue",
    expect: "un click en el campo reabre la lista cerrada por un click afuera",
    find: `        @focus="onFocus"
        @click="onClick"`,
    replace: `        @focus="onFocus"`,
  },
  {
    id: "autocomplete-items-null-rompe",
    file: "src/components/form/Autocomplete.vue",
    expect: "items null renderiza el campo vacío en vez de romperlo",
    find: `const searchItems = computed(() => props.items ?? []);`,
    replace: `const searchItems = computed(() => props.items);`,
  },
  {
    id: "autocomplete-seleccion-no-se-reancla",
    file: "src/components/form/Autocomplete.vue",
    expect: "reemplazar items con objetos nuevos conserva el check y selectedItem",
    find: `    selectedItem.value = (items ?? []).find((item) => itemText(item) === text) ?? null;`,
    replace: `    /* mutado */`,
  },
  {
    id: "autocomplete-item-deshabilitado-sin-atenuar",
    file: "src/components/form/Autocomplete.vue",
    expect: "el item deshabilitado se ve atenuado (color muted inline)",
    find: `          :style="item.disabled ? disabledItemStyle : itemStyle"`,
    replace: `          :style="itemStyle"`,
  },
  {
    id: "autocomplete-ce-remite-blur",
    file: "src/components/customElements/form/Autocomplete.ce.vue",
    test: "src/components/customElements/ce-parity.test.ts",
    expect: "el CE no re-emite `blur` como CustomEvent (ya llega el nativo)",
    find: `    @select="ceEmit('select', $event)"`,
    replace: `    @select="ceEmit('select', $event)"
    @blur="ceEmit('blur', $event)"`,
  },
  {
    id: "select-foco-fuera-no-cierra-panel",
    file: "src/components/form/Select.vue",
    expect: "el foco que sale del control cierra el panel",
    find: `  if (dropdownRef.value?.isOpen()) setTimeout(() => dropdownRef.value?.close(), 0);`,
    replace: `  /* mutado */`,
  },
  {
    id: "select-cierre-no-corta-cooldown",
    file: "src/components/form/Select.vue",
    expect: "cerrar el panel corta el cooldown (no reaparece al reabrir)",
    find: `  // Cerrar el panel corta la búsqueda: el timer del cooldown no sigue corriendo
  // fuera de vista ni deja texto viejo para la próxima apertura.
  clearSearch();`,
    replace: `  /* mutado */`,
  },
  {
    id: "select-busqueda-no-se-resetea",
    file: "src/components/form/Select.vue",
    expect: "el texto acumulado de la búsqueda se resetea al abrir/cerrar",
    find: `  searchText.value = "";
  cooldownActive.value = false;
}`,
    replace: `  cooldownActive.value = false;
}`,
  },
  {
    id: "select-options-null-rompe",
    file: "src/components/form/Select.vue",
    expect: "options null renderiza el select vacío en vez de romperlo",
    find: `const optionsList = computed(() => props.options ?? []);`,
    replace: `const optionsList = computed(() => props.options as SelectOption[]);`,
  },
  {
    id: "select-opcion-deshabilitada-sin-atenuar",
    file: "src/components/form/Select.vue",
    expect: "la opción deshabilitada se ve atenuada (color muted inline)",
    find: `            :style="opt.disabled ? disabledOptionStyle : optionStyle"`,
    replace: `            :style="optionStyle"`,
  },
  // ── lote 3 bis · combobox/listbox, cooldown y foco en shadow root ──
  {
    id: "select-sin-activedescendant",
    file: "src/components/form/Select.vue",
    expect: "la opción activa se anuncia con aria-activedescendant",
    find: `  isOpen.value && activeIndex.value >= 0 ? optionId(activeIndex.value) : undefined,`,
    replace: `  undefined,`,
  },
  {
    id: "select-sin-panel-id",
    file: "src/components/form/Select.vue",
    expect: "el trigger referencia el listbox con aria-controls",
    find: `      :panel-id="listboxId"`,
    replace: `      :panel-id="''"`,
  },
  {
    id: "select-panel-rol-menu",
    file: "src/components/form/Select.vue",
    expect: "el panel es un listbox (no un menú)",
    find: `      :panel-role="'listbox'"`,
    replace: `      :panel-role="'menu'"`,
  },
  {
    id: "select-options-sin-role",
    file: "src/components/form/Select.vue",
    expect: "cada opción es un `option`",
    find: `            role="option"`,
    replace: `            role="presentation"`,
  },
  {
    id: "select-flecha-no-abre",
    file: "src/components/form/Select.vue",
    expect: "la flecha abre el panel con una opción activa",
    find: `    if (!isOpen.value) {
      activeIndex.value = firstEnabled(e.key === "ArrowUp");
      dropdownRef.value?.open();
      scrollToActive();
      return;
    }`,
    replace: `    if (!isOpen.value) {
      return;
    }`,
  },
  {
    id: "select-enter-no-elige",
    file: "src/components/form/Select.vue",
    expect: "Enter elige la opción activa",
    find: `      e.preventDefault();
      onSelect(option);`,
    replace: `      e.preventDefault();`,
  },
  {
    id: "select-ids-compartidos",
    file: "src/components/form/Select.vue",
    expect: "dos instancias no comparten ids",
    find: `const uid = useUniqueId("cu-select");`,
    replace: `const uid = "cu-select";`,
  },
  {
    id: "autocomplete-sin-activedescendant",
    file: "src/components/form/Autocomplete.vue",
    expect: "el item activo se anuncia con aria-activedescendant",
    find: `  isOpen.value && activeIndex.value >= 0 ? optionId(activeIndex.value) : undefined,`,
    replace: `  undefined,`,
  },
  {
    id: "autocomplete-sin-panel-id",
    file: "src/components/form/Autocomplete.vue",
    expect: "el input referencia el listbox con aria-controls",
    find: `    :panel-id="listboxId"`,
    replace: `    :panel-id="''"`,
  },
  {
    id: "autocomplete-options-sin-role",
    file: "src/components/form/Autocomplete.vue",
    expect: "cada sugerencia es un `option`",
    find: `          role="option"`,
    replace: `          role="presentation"`,
  },
  {
    id: "autocomplete-flecha-no-mueve",
    file: "src/components/form/Autocomplete.vue",
    expect: "las flechas mueven el item activo",
    find: `    moveActive(e.key === "ArrowDown" ? 1 : -1);
    return;`,
    replace: `    return;`,
  },
  {
    id: "autocomplete-enter-no-elige",
    file: "src/components/form/Autocomplete.vue",
    expect: "Enter elige el item activo",
    find: `      e.preventDefault();
      onItemClick(item);`,
    replace: `      e.preventDefault();`,
  },
  {
    id: "autocomplete-ids-compartidos",
    file: "src/components/form/Autocomplete.vue",
    expect: "dos instancias no comparten ids",
    find: `const uid = useUniqueId("cu-autocomplete");`,
    replace: `const uid = "cu-autocomplete";`,
  },
  {
    id: "autocomplete-vacio-sin-mensaje",
    file: "src/components/form/Autocomplete.vue",
    expect: "sin items el panel muestra 'Sin opciones'",
    find: `      <div v-else class="cu-autocomplete-empty">
        Sin opciones
      </div>`,
    replace: `      <div v-else />`,
  },
  {
    id: "cooldown-variant-ignorado",
    file: "src/components/overlay/Dropdown.vue",
    test: "src/components/form/Select.test.ts",
    expect: "`cooldownVariant` cambia el token de la barra (ghost suave / solid lleno)",
    find: `  props.cooldownVariant === "solid" ? props.color : \`\${props.color}-ghost-hover\`,`,
    replace: `  props.color,`,
  },
  {
    id: "select-ce-remite-blur",
    file: "src/components/customElements/form/Select.ce.vue",
    test: "src/components/customElements/ce-parity.test.ts",
    expect: "el CE no re-emite `blur` como CustomEvent (ya llega el nativo)",
    find: `    @close="ceEmit('close', $event)"`,
    replace: `    @close="ceEmit('close', $event)"
    @blur="ceEmit('blur', $event)"`,
  },
  {
    id: "file-input-no-limpia-input-nativo",
    file: "src/components/form/FileInput.vue",
    expect: "el input nativo se vacía al procesar (se puede volver a elegir el mismo archivo)",
    find: `  // El input nativo se vacía al terminar: si no, el navegador no vuelve a emitir
  // \`change\` cuando el usuario elige el mismo archivo (después de un rechazo o
  // de quitarlo) y la selección parece no responder.
  input.value = "";`,
    replace: ``,
  },
  {
    id: "file-input-dragleave-en-hijos",
    file: "src/components/form/FileInput.vue",
    expect: "cruzar un hijo del campo no apaga el resaltado del drag",
    find: `  if (next && containerRef.value?.contains(next)) return;`,
    replace: `  // mutado: cualquier dragleave apaga el resaltado`,
  },
  {
    id: "file-input-link-disabled-navega",
    file: "src/components/form/FileInput.vue",
    expect: "con disabled el nombre del archivo no queda como link navegable",
    find: `:href="props.disabled ? undefined : fileUrl"`,
    replace: `:href="fileUrl"`,
  },
  {
    id: "file-input-quitar-sin-nombre",
    file: "src/components/form/FileInput.vue",
    expect: "el botón de quitar tiene nombre accesible",
    find: `        :aria-label="\`Quitar \${value.name}\`"
`,
    replace: ``,
  },
  {
    id: "file-zone-no-limpia-input-nativo",
    file: "src/components/form/FileInputZone.vue",
    expect: "el input nativo de la zona se vacía al procesar (se puede reelegir el mismo archivo)",
    find: `  // Vaciar el input nativo: si no, elegir el mismo archivo otra vez (después de
  // quitarlo) no vuelve a emitir \`change\` y la zona parece no responder.
  input.value = "";`,
    replace: ``,
  },
  {
    id: "file-zone-dragleave-en-hijos",
    file: "src/components/form/FileInputZone.vue",
    expect: "cruzar un hijo de la zona no apaga el resaltado del drag",
    find: `  if (next && dropZoneRef.value?.contains(next)) return;`,
    replace: `  // mutado: cualquier dragleave apaga el resaltado`,
  },
  {
    id: "file-zone-drop-sin-items",
    file: "src/components/form/FileInputZone.vue",
    expect: "un drop sin `items` cae en `dataTransfer.files`",
    find: `  if (dropped.length === 0) {
    const files = e.dataTransfer?.files;
    if (files && files.length > 0) dropped.push(...Array.from(files));
  }
`,
    replace: ``,
  },
  {
    id: "file-zone-drop-desordenado",
    file: "src/components/form/FileInputZone.vue",
    expect: "el orden de los archivos soltados es el del drop, no el de lectura",
    find: `      const slot = slots[i]!;`,
    replace: `      const slot = slots[0]!;`,
  },
  {
    id: "cells-importer-change-duplicado",
    file: "src/components/form/CellsImporter.vue",
    expect: "quitar el archivo emite change(null) una sola vez",
    find: `  fileInputRef.value?.reset();
  file.value = null;
  clearResult();
}`,
    replace: `  fileInputRef.value?.reset();
  file.value = null;
  clearResult();
  emit('change', null);
}`,
  },
  {
    id: "cells-importer-parse-viejo-pisa",
    file: "src/components/form/CellsImporter.vue",
    expect: "un parseo que termina tarde no pisa el archivo actual",
    find: `    if (token !== parseToken) return;
    rows.value = parsedRows;`,
    replace: `    rows.value = parsedRows;`,
  },
  {
    id: "cells-importer-plantilla-ignora-delimiter",
    file: "src/components/form/CellsImporter.vue",
    expect: "la plantilla se genera con el separador configurado",
    find: `  downloadTemplate(props.columns, { ...props.template, delimiter: props.delimiter });`,
    replace: `  downloadTemplate(props.columns, props.template);`,
  },
  {
    id: "file-input-readonly-permite-quitar",
    file: "src/components/form/FileInput.vue",
    expect: "con readOnly no se puede quitar el archivo",
    find: `        v-if="value && !props.disabled && !props.readOnly"`,
    replace: `        v-if="value && !props.disabled"`,
  },
  {
    id: "file-input-trigger-ignora-readonly",
    file: "src/components/form/FileInput.vue",
    expect: "con readOnly el control de selección queda deshabilitado",
    find: `        :disabled="props.disabled || props.readOnly"
      >
        <svg
          v-if="!value"`,
    replace: `        :disabled="props.disabled"
      >
        <svg
          v-if="!value"`,
  },
  {
    id: "file-input-foco-al-contenedor",
    file: "src/components/form/FileInput.vue",
    expect: "focus() enfoca el control de selección, no el contenedor",
    find: `const focus = () => { triggerRef.value?.focus(); };`,
    replace: `const focus = () => { containerRef.value?.focus(); };`,
  },
  {
    id: "file-input-contenedor-role-button",
    file: "src/components/form/FileInput.vue",
    expect: "el contenedor con el link y el quitar no se anuncia como botón",
    find: `      class="cu-file-input"
      :class="[`,
    replace: `      class="cu-file-input"
      role="button"
      tabindex="0"
      :class="[`,
  },
  {
    id: "file-zone-role-button",
    file: "src/components/form/FileInputZone.vue",
    expect: "la zona es un grupo y no un botón con controles adentro",
    find: `      role="group"`,
    replace: `      role="button"
      tabindex="0"`,
  },
  {
    id: "file-zone-trigger-ignora-readonly",
    file: "src/components/form/FileInputZone.vue",
    expect: "con readOnly el control de selección de la zona queda deshabilitado",
    find: `        class="cu-file-zone-trigger"
        :aria-label="triggerLabel"
        :disabled="props.disabled || props.readOnly"`,
    replace: `        class="cu-file-zone-trigger"
        :aria-label="triggerLabel"
        :disabled="props.disabled"`,
  },
  {
    id: "file-zone-readonly-permite-quitar",
    file: "src/components/form/FileInputZone.vue",
    expect: "con readOnly no se puede quitar un archivo de la lista",
    find: `          :color="props.color"
          :disabled="props.disabled || props.readOnly"`,
    replace: `          :color="props.color"
          :disabled="props.disabled"`,
  },
  {
    id: "file-zone-foco-al-contenedor",
    file: "src/components/form/FileInputZone.vue",
    expect: "focus() de la zona enfoca el control de selección",
    find: `const focus = () => { triggerRef.value?.focus(); };`,
    replace: `const focus = () => { dropZoneRef.value?.focus(); };`,
  },
  {
    id: "file-list-quitar-sin-nombre",
    file: "src/components/FileList.vue",
    expect: "el botón de quitar de cada fila tiene nombre accesible",
    find: `        :aria-label="\`Quitar \${file.name}\`"
`,
    replace: ``,
  },
  {
    id: "file-list-nombre-sin-control",
    file: "src/components/FileList.vue",
    expect: "el nombre de la fila es un botón (operable con teclado)",
    find: `      <button
        type="button"
        class="cu-file-list-name"
        @click.stop="emit('select', i)"
      >{{ file.name }}</button>`,
    replace: `      <span class="cu-file-list-name">{{ file.name }}</span>`,
  },
  {
    id: "file-list-fila-role-button",
    file: "src/components/FileList.vue",
    expect: "la fila no se anuncia como botón (no anida el quitar)",
    find: `      class="cu-file-list-item"
      @click.stop="emit('select', i)"`,
    replace: `      class="cu-file-list-item"
      role="button"
      tabindex="0"
      @click.stop="emit('select', i)"`,
  },
  {
    id: "cells-importer-readonly-permite-quitar",
    file: "src/components/form/CellsImporter.vue",
    expect: "con readOnly/disabled no se ofrece quitar el archivo",
    find: `        v-if="file && !props.disabled && !props.readOnly"`,
    replace: `        v-if="file"`,
  },
  {
    id: "cells-importer-csv-bom",
    file: "src/utils/cellsImporter.ts",
    test: "src/components/form/CellsImporter.test.ts",
    expect: "el BOM no contamina el primer encabezado ni la primera celda",
    find: `  const text = raw.charCodeAt(0) === 0xfeff ? raw.slice(1) : raw`,
    replace: `  const text = raw`,
  },
  {
    id: "cells-importer-csv-delimiter",
    file: "src/utils/cellsImporter.ts",
    test: "src/components/form/CellsImporter.test.ts",
    expect: "el CSV respeta el separador configurado",
    find: `    if (char === delimiter) {`,
    replace: `    if (char === ',') {`,
  },
  {
    id: "cells-importer-xlsx-fechas",
    file: "src/utils/cellsImporter.ts",
    test: "src/components/form/CellsImporter.test.ts",
    expect: "una celda de fecha de .xlsx llega como Date, no como número de serie",
    find: `  const wb = XLSX.read(buf, { type: 'array', cellDates: true })`,
    replace: `  const wb = XLSX.read(buf, { type: 'array' })`,
  },
  {
    id: "checkbox-foco-fuera-de-tab",
    file: "src/components/form/Checkbox.vue",
    expect: "el input del checkbox es la parada de tab (no tabindex=-1)",
    find: `        class="cu-checkbox-input"`,
    replace: `        tabindex="-1"
        class="cu-checkbox-input"`,
  },
  {
    id: "checkbox-change-sin-valor",
    file: "src/components/form/Checkbox.vue",
    expect: "el change del usuario lleva el valor nuevo (boolean), no el Event",
    find: `  const value = (e.target as HTMLInputElement).checked;
  checked.value = value;
  emit("change", value);`,
    replace: `  const value = (e.target as HTMLInputElement).checked;
  checked.value = value;
  emit("change", e);`,
  },
  {
    id: "checkbox-color-sin-fallback",
    file: "src/components/form/Checkbox.vue",
    expect: "un color inválido cae a neutral (la caja marcada no queda transparente)",
    find: `const safeColor = computed(() => (isColor(props.color) ? props.color : 'neutral'));`,
    replace: `const safeColor = computed(() => props.color);`,
  },
  {
    id: "checkbox-size-sin-fallback",
    file: "src/components/form/Checkbox.vue",
    expect: "un size inválido cae a md (la caja no queda sin tamaño)",
    find: `const safeSize = computed(() => (isSizeSm(props.size) ? props.size : 'md'));`,
    replace: `const safeSize = computed(() => props.size);`,
  },
  {
    id: "switch-foco-fuera-de-tab",
    file: "src/components/form/Switch.vue",
    expect: "el input del switch es la parada de tab (no tabindex=-1)",
    find: `        class="cu-switch-input"`,
    replace: `        tabindex="-1"
        class="cu-switch-input"`,
  },
  {
    id: "switch-role-duplicado-en-track",
    file: "src/components/form/Switch.vue",
    expect: "role=switch vive en el input, no en el track (un solo nodo accesible)",
    find: `<span
      class="cu-switch-track"
      :class="{ 'cu-switch--checked': checked }"
      :style="switchStyles"
    >`,
    replace: `<span
      class="cu-switch-track"
      :class="{ 'cu-switch--checked': checked }"
      :style="switchStyles"
      role="switch"
      :aria-checked="!!checked"
    >`,
  },
  {
    id: "switch-bg-tono-plano",
    file: "src/components/form/Switch.vue",
    expect: "el track encendido usa la variante -solid del color (contraste del thumb)",
    find: `  '--switch-bg': \`var(--cu-color-\${safeColor.value}-solid)\`,`,
    replace: `  '--switch-bg': \`var(--cu-color-\${safeColor.value})\`,`,
  },
  {
    id: "switch-color-sin-fallback",
    file: "src/components/form/Switch.vue",
    expect: "un color inválido cae a neutral (el track encendido no queda transparente)",
    find: `const safeColor = computed(() => (isColor(props.color) ? props.color : 'neutral'));`,
    replace: `const safeColor = computed(() => props.color);`,
  },
  {
    id: "switch-size-sin-fallback",
    file: "src/components/form/Switch.vue",
    expect: "un size inválido cae a md (el track no queda en 0x0)",
    find: `const safeSize = computed(() => (isSizeSm(props.size) ? props.size : 'md'));`,
    replace: `const safeSize = computed(() => props.size);`,
  },
  {
    id: "ce-attr-boolean-sin-castear",
    file: "src/utils/comegen-element.ts",
    test: "src/utils/comegen-element.test.ts",
    expect: "`disabled=\"false\"` no deshabilita y `model-value=\"false\"` no marca el checkbox",
    find: `  if (types.boolean) return value.trim().toLowerCase() !== 'false'`,
    replace: `  if (types.boolean) return value`,
  },
  {
    id: "ce-attr-number-sin-castear",
    file: "src/utils/comegen-element.ts",
    test: "src/utils/comegen-element.test.ts",
    expect: "`count=\"7\"` llega como número, no como string",
    find: `  if (types.number && !types.string) {`,
    replace: `  if (types.number && false) {`,
  },
  {
    id: "tokens-borde-sin-piso",
    file: "src/plugins/cu-tokens/css.ts",
    test: "src/plugins/cu-tokens/contrast.test.ts",
    expect: "el borde normal (checkbox desmarcado) no baja de 3:1",
    find: '    --cu-border-color: ${ensureContrast(colors.default || DEFAULT_COLORS.default, colors.surface, MIN_BORDER_CONTRAST)};',
    replace: '    --cu-border-color: ${colors.default || DEFAULT_COLORS.default};',
  },
  {
    id: "tokens-foco-sin-piso",
    file: "src/plugins/cu-tokens/css.ts",
    test: "src/plugins/cu-tokens/contrast.test.ts",
    expect: "el anillo de foco no baja de 3:1 (nord-snow-storm)",
    find: '    --cu-border-color-focus: ${ensureContrast(colors.focus || DEFAULT_COLORS.focus, colors.surface, MIN_BORDER_CONTRAST)};',
    replace: '    --cu-border-color-focus: ${colors.focus || DEFAULT_COLORS.focus};',
  },
  {
    id: "foco-acento-crudo",
    file: "src/components/overlay/SideOver.vue",
    test: "src/plugins/cu-tokens/contrast.test.ts",
    expect: "ningún outline de :focus-visible usa un acento crudo (1.69:1)",
    find: `  outline: 2px solid var(--cu-border-color-focus);`,
    replace: `  outline: 2px solid var(--cu-color-primary);`,
  },
  {
    id: "input-ime-emite-intermedio",
    file: "src/components/form/Input.vue",
    expect: "el input no emite valores intermedios durante una composición IME",
    find: `  if (composing.value) return;
  value.value = (event.target as HTMLInputElement).value;`,
    replace: `  value.value = (event.target as HTMLInputElement).value;`,
  },
  {
    id: "textarea-ime-emite-intermedio",
    file: "src/components/form/Textarea.vue",
    expect: "el textarea no emite valores intermedios durante una composición IME",
    find: `  if (composing.value) return;
  value.value = (event.target as HTMLTextAreaElement).value;`,
    replace: `  value.value = (event.target as HTMLTextAreaElement).value;`,
  },
  {
    id: "input-focus-noop",
    file: "src/components/form/Input.vue",
    expect: "focus() enfoca el input real",
    find: `  focus: () => inputFocus.value = true,`,
    replace: `  focus: () => void inputFocus.value,`,
  },
  {
    id: "textarea-focus-noop",
    file: "src/components/form/Textarea.vue",
    expect: "focus() enfoca el textarea real",
    find: `const focus = () => { textareaRef.value?.focus(); };`,
    replace: `const focus = () => { void textareaRef; };`,
  },
  {
    id: "input-reset-restaura-startvalue",
    file: "src/components/form/Input.vue",
    expect: "reset() limpia a \"\": startValue no se aplica",
    find: `const reset = () => { value.value = ""; };`,
    replace: `const reset = () => { value.value = props.startValue ?? ""; };`,
  },
  {
    id: "textarea-reset-restaura-startvalue",
    file: "src/components/form/Textarea.vue",
    expect: "reset() limpia a \"\": startValue no se aplica",
    find: `const reset = () => { value.value = ""; };`,
    replace: `const reset = () => { value.value = props.startValue ?? ""; };`,
  },
  {
    id: "label-color-token-base",
    file: "src/components/form/Label.vue",
    expect: "el texto del label usa el token de texto (contraste AA), no el color base",
    find: `  '--label-fg': \`var(--cu-color-\${props.color}-text)\`,`,
    replace: `  '--label-fg': \`var(--cu-color-\${props.color})\`,`,
  },
  {
    id: "label-interactivo-ajeno",
    file: "src/components/form/Label.vue",
    expect: "un link/botón/campo que no es el control conserva su click (default y foco)",
    find: `  return found ?? null;`,
    replace: `  return null;`,
  },
  {
    id: "input-ce-sin-emit",
    file: "src/components/customElements/form/Input.ce.vue",
    expect: "el custom element emite update:modelValue al teclear",
    find: `  ceEmit("update:modelValue", val);`,
    replace: `  void val;`,
  },
  {
    id: "input-ce-set-noop",
    file: "src/components/customElements/form/Input.ce.vue",
    expect: "el custom element expone set()",
    find: `const set = (value: string | number) => inputRef.value?.set(value);`,
    replace: `const set = (value: string | number) => { void value; };`,
  },
  {
    id: "textarea-ce-sin-emit",
    file: "src/components/customElements/form/Textarea.ce.vue",
    expect: "el custom element emite update:modelValue al teclear",
    find: `  ceEmit("update:modelValue", val);`,
    replace: `  void val;`,
  },
  {
    id: "textarea-ce-reset-noop",
    file: "src/components/customElements/form/Textarea.ce.vue",
    expect: "el custom element expone reset()",
    find: `const reset = () => textareaRef.value?.reset();`,
    replace: `const reset = () => { void textareaRef; };`,
  },

  // ── Overlays: pila compartida, submenús anidados, posición y a11y ──────────
  {
    id: "overlay-escape-cierra-todos",
    file: "src/composables/useOverlayStack.ts",
    test: "src/components/overlay/overlayStack.test.ts",
    expect: "Escape cierra sólo el overlay de arriba (no el menú y el submenú a la vez)",
    find: `  stack.entries[stack.entries.length - 1]?.close();`,
    replace: `  for (const entry of [...stack.entries]) entry.close();`,
  },
  {
    id: "overlay-sin-scroll-lock",
    file: "src/composables/useOverlayStack.ts",
    test: "src/components/overlay/overlayStack.test.ts",
    expect: "el bloqueo del scroll del body se pide a la pila (coordinado entre overlays)",
    find: `  if (handle.lockScroll) lockScroll(stack);`,
    replace: `  void handle.lockScroll;`,
  },
  {
    id: "modal-escape-fuera-de-la-pila",
    file: "src/components/overlay/Modal.vue",
    expect: "Escape cierra el modal abierto (vía pila compartida)",
    find: `  isOpen.value = true;
  claimOverlay();`,
    replace: `  isOpen.value = true;`,
  },
  {
    id: "sideover-sin-scroll-lock",
    file: "src/components/overlay/SideOver.vue",
    expect: "el SideOver bloquea el scroll del body mientras está abierto",
    find: `overlayId = registerOverlay({ close, lockScroll: true });`,
    replace: `overlayId = registerOverlay({ close });`,
  },
  {
    id: "popover-panel-sin-nombre",
    file: "src/components/overlay/Popover.vue",
    expect: "un panel menu/dialog toma su nombre accesible del trigger",
    find: `      :aria-label="panelLabel || undefined"\n`,
    replace: ``,
  },
  {
    id: "popover-nombre-en-cualquier-rol",
    file: "src/components/overlay/Popover.vue",
    expect: "sólo menu/dialog reciben nombre del trigger (el listbox del combobox no)",
    find: `  panelLabel.value = NAMED_ROLES[props.role] ? triggerLabel(toggleElement()) : "";`,
    replace: `  panelLabel.value = triggerLabel(toggleElement());`,
  },
  {
    id: "popover-sin-flip-horizontal",
    file: "src/components/overlay/Popover.vue",
    expect: "sin espacio a la derecha el panel se voltea a la izquierda",
    find: `    if (pos === "right" && room.right < pw && room.left >= pw) pos = "left";`,
    replace: `    /* mutado: sin flip */`,
  },
  {
    id: "popover-sin-clamp-horizontal",
    file: "src/components/overlay/Popover.vue",
    expect: "el panel clampea al borde del viewport (nunca genera scroll horizontal)",
    find: `    if (pw > 0) left = clampToViewport(left, pw, vw);`,
    replace: `    /* mutado: sin clamp */`,
  },
  {
    id: "popover-sin-fallback-por-viewport",
    file: "src/components/overlay/Popover.vue",
    expect: "un panel que se sale del viewport pasa a fixed (para voltearse/clampearse)",
    find: `  if (!isClippedByAncestor(panel, anchor, box) && !overflowsViewport(box)) return;`,
    replace: `  if (!isClippedByAncestor(panel, anchor, box)) return;`,
  },
  {
    id: "popover-timers-sin-limpiar",
    file: "src/components/overlay/Popover.vue",
    expect: "desmontar cancela los timers de hover (no abre un overlay desconectado)",
    find: `onUnmounted(() => {
  clearHoverTimers();`,
    replace: `onUnmounted(() => {`,
  },
  {
    id: "popover-registry-sin-limpiar",
    file: "src/components/overlay/Popover.vue",
    expect: "desmontar saca el popover del registry global de hover",
    find: `  unregisterHover();
  releaseOverlay();`,
    replace: `  releaseOverlay();`,
  },
  {
    id: "dropdown-items-sin-menuitem",
    file: "src/components/overlay/Dropdown.vue",
    expect: "una fila con href es menuitem del menú de items",
    find: `          :role="isMenu ? 'menuitem' : undefined"
          :aria-disabled="isMenu && item.disabled ? 'true' : undefined"`,
    replace: `          :aria-disabled="isMenu && item.disabled ? 'true' : undefined"`,
  },
  {
    id: "menu-roving-sin-tabindex",
    file: "src/composables/useMenuNavigation.ts",
    test: "src/components/overlay/Dropdown.test.ts",
    expect: "la fila activa es la única parada de tabulación del menú",
    find: `    return position >= 0 && position === effectiveActiveRow.value ? 0 : -1;`,
    replace: `    return -1;`,
  },
  {
    id: "dropdown-items-sin-teclado",
    file: "src/components/overlay/Dropdown.vue",
    expect: "el menú de items responde a flechas/Home/End/typeahead",
    find: `  enabled: () => isMenu.value,`,
    replace: `  enabled: () => false,`,
  },
  {
    id: "dropdown-submenu-sin-deteccion-light-dom",
    file: "src/utils/dropdownNesting.ts",
    test: "src/components/customElements/ce-real.test.ts",
    expect: "un cu-dropdown-menu dentro de otro se detecta como submenú al montar",
    find: `    if (NESTED_HOST_TAGS[node.tagName]) return { nested: !inToggleSlot, inMenu: true };`,
    replace: `    if (NESTED_HOST_TAGS[node.tagName]) return { nested: false, inMenu: false };`,
  },
  {
    id: "flat-tree-sin-slot-host",
    file: "src/utils/flatTree.ts",
    test: "src/components/customElements/ce-real.test.ts",
    expect: "el recorrido de ancestros cruza slots y shadow roots (submenú en CE)",
    find: `  const slotted = (el as Element & { assignedSlot?: Element | null }).assignedSlot;
  if (slotted) return slotted;
  if (el.parentElement) return el.parentElement;
  const root = el.getRootNode() as ShadowRoot | Document;
  return "host" in root ? (root.host as Element) : null;`,
    replace: `  return el.parentElement;`,
  },
  {
    id: "dropdown-menu-submenu-con-toggle-propio",
    file: "src/components/controls/DropdownMenu.vue",
    test: "src/components/customElements/ce-real.test.ts",
    expect: "un submenú lo dibuja el motor como fila de menú (sin Button suelto)",
    find: `    <template v-if="!nested" #toggle="{ toggle, isOpen }">`,
    replace: `    <template #toggle="{ toggle, isOpen }">`,
  },
  {
    id: "button-variant-sin-fallback",
    file: "src/components/buttons/Button.vue",
    expect: "una variante inválida cae a ghost en vez de quedar sin estilos",
    find: `const safeVariant = computed(() => (isVariantFull(props.variant) ? props.variant : 'ghost'))`,
    replace: `const safeVariant = computed(() => props.variant)`,
  },
  {
    id: "dropdown-chevron-sin-aria-hidden",
    file: "src/components/overlay/Dropdown.vue",
    expect: "el chevron del submenú es decorativo",
    find: `            class="cu-dropdown-menu-item-chevron"
            aria-hidden="true"
            focusable="false"`,
    replace: `            class="cu-dropdown-menu-item-chevron"`,
  },
  {
    id: "navbar-list-chevron-sin-aria-hidden",
    file: "src/components/navigation/NavbarList.vue",
    expect: "el chevron del trigger compacto es decorativo",
    find: `              class="cu-navbar-compact-chevron"
              aria-hidden="true"
              focusable="false"`,
    replace: `              class="cu-navbar-compact-chevron"`,
  },
  {
    id: "pagination-sin-clamp-fuera-de-rango",
    file: "src/components/controls/Pagination.vue",
    expect: "una `currentPage` fuera de rango se renderiza como la última página disponible",
    find: `  return Number.isFinite(page) ? Math.min(Math.max(1, page), pageCount.value) : 1;`,
    replace: `  return Number.isFinite(page) ? page : 1;`,
  },
  {
    id: "pagination-totalpages-sin-entero",
    file: "src/components/controls/Pagination.vue",
    expect: "un `totalPages` decimal no agrega una página inexistente",
    find: `  const total = Math.trunc(Number(props.totalPages));
  return Number.isFinite(total) ? Math.max(1, total) : 1;`,
    replace: `  return props.totalPages;`,
  },
  {
    id: "pagination-itemsperpage-sin-sanea",
    file: "src/components/controls/Pagination.vue",
    expect: "un `itemsPerPage` inválido (0/negativo) no invierte el rango de la info",
    find: `  return Number.isFinite(value) && value > 0 ? value : 1;`,
    replace: `  return Number(value) || 0;`,
  },
  {
    id: "pagination-rango-sin-tope",
    file: "src/components/controls/Pagination.vue",
    expect: "un rango que arranca después del total no se muestra invertido",
    find: `  return Math.min(start, itemCount.value);`,
    replace: `  return start;`,
  },
  {
    id: "pagination-totalitems-sin-sanea",
    file: "src/components/controls/Pagination.vue",
    expect: "un `totalItems` negativo no muestra un total negativo",
    find: `  return Number.isFinite(value) && value > 0 ? value : 0;`,
    replace: `  return Math.trunc(Number(props.totalItems)) || 0;`,
  },
  {
    id: "pagination-pagesizeoptions-no-array",
    file: "src/components/controls/Pagination.vue",
    expect: "un `pageSizeOptions` que no es array no rompe el selector",
    find: `  const configured = (Array.isArray(props.pageSizeOptions) ? props.pageSizeOptions : [5, 10, 20, 50])`,
    replace: `  const configured = props.pageSizeOptions as number[]`,
  },
  {
    id: "pagination-nav-sin-label",
    file: "src/components/controls/Pagination.vue",
    expect: "el landmark de páginas tiene nombre accesible",
    find: `<nav class="cu-pagination-pages" aria-label="Paginación">`,
    replace: `<nav class="cu-pagination-pages">`,
  },
  {
    id: "pagination-pagina-sin-aria-current",
    file: "src/components/controls/Pagination.vue",
    expect: "la página activa se anuncia con aria-current=page",
    find: `            :aria-current="activePage === page ? 'page' : undefined"`,
    replace: `            :aria-current="undefined"`,
  },
  {
    id: "pagination-pagina-sin-nombre",
    file: "src/components/controls/Pagination.vue",
    expect: "los botones numerados tienen nombre accesible «Página N»",
    find: `            :aria-label="\`Página \${page}\`"
`,
    replace: ``,
  },
  {
    id: "pagination-elipsis-en-arbol-accesible",
    file: "src/components/controls/Pagination.vue",
    expect: "la elipsis queda fuera del árbol accesible",
    find: `<span v-if="page === '...'" class="cu-pagination-ellipsis" aria-hidden="true">...</span>`,
    replace: `<span v-if="page === '...'" class="cu-pagination-ellipsis">...</span>`,
  },
  {
    id: "alert-icono-en-slot-oculto",
    file: "src/components/information/Alert.vue",
    expect: "el ícono se renderiza una sola vez, en el slot visible de la cabecera",
    find: `      <div ref="iconWrap" class="cu-alert-title">
        <slot name="icon" />`,
    replace: `      <div ref="iconWrap" class="cu-alert-title">
        <span style="display: none"><slot name="icon" /></span>
        <slot name="icon" />`,
  },
  {
    id: "alert-icono-sin-detectar-en-ce",
    file: "src/components/information/Alert.vue",
    expect: "un ícono sin título arma la cabecera en el custom element",
    find: `    return (el as HTMLSlotElement).assignedNodes().some(nodeHasIconContent);`,
    replace: `    return false;`,
  },
  {
    id: "alert-boton-cerrar-sin-type",
    file: "src/components/information/Alert.vue",
    expect: "el botón de cerrar de la cabecera no envía el formulario",
    find: `      <button
        v-if="props.close && hasHeader"
        type="button"`,
    replace: `      <button
        v-if="props.close && hasHeader"`,
  },
  {
    id: "alert-boton-cerrar-flotante-sin-type",
    file: "src/components/information/Alert.vue",
    expect: "el botón de cerrar flotante no envía el formulario",
    find: `    <button
      v-if="props.close && !hasHeader"
      type="button"`,
    replace: `    <button
      v-if="props.close && !hasHeader"`,
  },
  {
    id: "alert-color-invalido-sin-fallback",
    file: "src/components/information/Alert.vue",
    expect: "un color inválido cae al color seguro",
    find: `  '--alert-solid': \`var(--cu-color-\${safeColor.value}-solid)\`,`,
    replace: `  '--alert-solid': \`var(--cu-color-\${props.color}-solid)\`,`,
  },
  {
    id: "badge-color-invalido-sin-fallback",
    file: "src/components/information/Badge.vue",
    expect: "un color inválido cae al color seguro",
    find: `  '--badge-solid': \`var(--cu-color-\${safeColor.value}-solid)\`,`,
    replace: `  '--badge-solid': \`var(--cu-color-\${props.color}-solid)\`,`,
  },
  {
    id: "card-color-invalido-sin-fallback",
    file: "src/components/information/Card.vue",
    expect: "un color inválido cae al color seguro",
    find: `  '--card-solid': \`var(--cu-color-\${safeColor.value}-solid)\`,`,
    replace: `  '--card-solid': \`var(--cu-color-\${props.color}-solid)\`,`,
  },
  {
    id: "card-subtitulo-con-opacity",
    file: "src/components/information/Card.vue",
    test: "src/components/information/Card.contrast.test.ts",
    expect: "el subtítulo usa un token atenuado (≥4.5:1), no opacity",
    find: `  color: var(--card-text-muted);`,
    replace: `  opacity: 0.75;
  color: inherit;`,
  },
  {
    id: "alert-rol-siempre-alert",
    file: "src/components/information/Alert.vue",
    expect: "sólo warning/danger usan role=alert; el resto es status",
    find: `const ariaRole = computed(() => (isUrgent.value ? 'alert' : 'status'));`,
    replace: `const ariaRole = computed(() => 'alert');`,
  },
  {
    id: "card-click-redisparado",
    file: "src/components/customElements/information/Card.ce.vue",
    test: "src/components/information/Card.test.ts",
    expect: "el click del contenido llega al host una sola vez",
    find: `  <Card
    :color="props.color"`,
    replace: `  <Card
    @click="(e) => e.target.getRootNode().host.dispatchEvent(new CustomEvent('click', { bubbles: true, composed: true }))"
    :color="props.color"`,
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
