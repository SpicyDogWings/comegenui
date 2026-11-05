<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, ref, useSlots, watch, type PropType } from "vue";
import { isAlign, isColor, isPosition } from '@/utils/validators'
import Popover from "./Popover.vue";

const props = defineProps({
  // Texto simple del tooltip. Si se usa el slot #content, tiene prioridad.
  text: { type: String, required: false, default: "" },
  color: {
    type: String as PropType<'primary' | 'secondary' | 'neutral' | 'success' | 'warning' | 'danger'>,
    required: false,
    default: "neutral",
    validator: isColor,
  },
  position: {
    type: String as PropType<'bottom' | 'top' | 'left' | 'right'>,
    required: false,
    default: "top",
    validator: isPosition,
  },
  align: {
    type: String as PropType<'start' | 'center' | 'end'>,
    required: false,
    default: "center",
    validator: isAlign,
  },
  offset: { type: Number, required: false, default: 6 },
  // Delay (ms) hasta que aparece el tooltip al hacer hover.
  delay: { type: Number, required: false, default: 200 },
  disabled: { type: Boolean, required: false, default: false },
});

const safeColor = computed(() => (isColor(props.color) ? props.color : 'neutral'));

const tooltipStyles = computed(() => ({
  // El fondo es el color del tema y el texto, el extremo de máximo contraste
  // contra ese fondo (`-solid-text`): no siempre es el `surface` del tema.
  '--cu-popover-bg': `var(--cu-color-${safeColor.value}-solid)`,
  '--cu-popover-fg': `var(--cu-color-${safeColor.value}-solid-text)`,
}));

const popover = ref<InstanceType<typeof Popover> | null>(null);
const slots = useSlots();

// Sin `text` ni slot `content` no hay nada que mostrar: abrir igual dejaba un
// rectángulo del color de fondo, vacío, sobre el elemento. Se evalúa en cada
// render (no `computed`): `$slots` no es reactivo, y el CE recién reenvía el slot
// `content` después del mount (cuando el host ya se puede inspeccionar).
function hasContent() {
  return props.text.trim().length > 0 || !!slots.content;
}

// Mismo contenido con teclado que con mouse. El hover no es el único disparador:
// un tooltip que sólo aparece al pasar el puntero es inaccesible por teclado
// (WCAG 2.1.1) y el texto nunca llega a quien tabula hasta el control. Al enfocar
// se muestra sin delay; al salir el foco del trigger, se oculta.
function onFocusIn() {
  popover.value?.open();
}

function onFocusOut(event: FocusEvent) {
  const root = event.currentTarget as HTMLElement | null;
  const next = event.relatedTarget as Node | null;
  // El foco puede moverse dentro del contenido (trigger → slot): sigue visible.
  if (root && next instanceof Node && root.contains(next)) return;
  popover.value?.close();
}

// ── Descripción accesible ──
// El panel se anuncia con `role="tooltip"`, pero un IDREF (`aria-describedby`) no
// cruza el shadow boundary del CE: el trigger vive en la luz del host y el panel
// en el shadow tree, así que ese id no resuelve. `aria-description` lleva el
// texto directo y sí funciona en los dos modos. Se escribe al abrir y se
// restaura al cerrar, incluido el valor que hubiera puesto el autor.
const DESCRIPTION_ATTR = "aria-description";
let described: Array<{ el: HTMLElement; previous: string | null }> = [];

function popoverRoot(): HTMLElement | null {
  return (popover.value?.$el as HTMLElement | undefined) ?? null;
}

/** Elementos del slot default: lo que el usuario ve como trigger. */
function triggerElements(): HTMLElement[] {
  const root = popoverRoot();
  if (!root) return [];
  // En el CE el trigger real es el contenido asignado al `<slot>` que vive en el
  // shadow; en Vue son los hijos directos del wrapper (sin el panel).
  const children = Array.from(root.children);
  const outlet = children.find((el) => el.localName === "slot") as HTMLSlotElement | undefined;
  const assigned = outlet?.assignedElements() ?? [];
  const nodes =
    assigned.length > 0
      ? assigned
      : children.filter((el) => !el.classList.contains("cu-popover-panel"));
  return nodes.filter((node): node is HTMLElement => node instanceof HTMLElement);
}

/** Texto visible del panel, con el slot `content` resuelto en el flat tree. */
function tooltipText(): string {
  const panel = popoverRoot()?.querySelector(".cu-popover-panel") as HTMLElement | null;
  if (!panel) return "";
  const outlet = panel.querySelector('slot[name="content"]') as HTMLSlotElement | null;
  const raw = outlet
    ? outlet.assignedElements().map((el) => el.textContent ?? "").join(" ")
    : panel.textContent ?? "";
  return raw.replace(/\s+/g, " ").trim();
}

function restoreDescription() {
  for (const { el, previous } of described) {
    if (previous === null) el.removeAttribute(DESCRIPTION_ATTR);
    else el.setAttribute(DESCRIPTION_ATTR, previous);
  }
  described = [];
}

async function describeTrigger() {
  await nextTick();
  restoreDescription();
  // Si se cerró antes del render, no hay a quién describir.
  if (!popoverRoot()?.querySelector(".cu-popover-panel")) return;
  const text = tooltipText();
  if (!text) return;
  for (const el of triggerElements()) {
    described.push({ el, previous: el.getAttribute(DESCRIPTION_ATTR) });
    el.setAttribute(DESCRIPTION_ATTR, text);
  }
}

function onOpen() {
  void describeTrigger();
}

function onClose() {
  restoreDescription();
}

// `disabled` y `text` pueden cambiar con el panel abierto: la ficha dice que
// `disabled` lo apaga, y un tooltip que se quedó sin contenido no debe seguir
// visible. Si sólo cambió el texto, la descripción accesible sigue el ritmo.
watch([() => props.disabled, () => props.text], () => {
  if (props.disabled || !hasContent()) {
    popover.value?.close();
    return;
  }
  if (popover.value?.isOpen()) void describeTrigger();
});

onBeforeUnmount(restoreDescription);
</script>

<template>
  <Popover
    ref="popover"
    hover
    :position="position"
    :align="align"
    :offset="offset"
    :hover-delay="delay"
    :disabled="disabled || !hasContent()"
    role="tooltip"
    :panel-class="'cu-tooltip-panel'"
    :style="tooltipStyles"
    class="cu-tooltip"
    @focusin="onFocusIn"
    @focusout="onFocusOut"
    @open="onOpen"
    @close="onClose"
  >
    <template #toggle>
      <slot />
    </template>
    <slot name="content">{{ text }}</slot>
  </Popover>
</template>

<style scoped>
.cu-tooltip {
  --cu-popover-width: max-content;
  --cu-popover-min-width: 0;
  --cu-popover-max-width: 18rem;
}

.cu-tooltip :deep(.cu-tooltip-panel) {
  color: var(--cu-popover-fg, var(--cu-color-surface));
  font-size: var(--cu-font-size-xs);
  font-weight: var(--cu-font-weight-medium);
  padding: var(--cu-space-xs) var(--cu-space-sm);
  border-radius: var(--cu-radius-sm);
  box-shadow: var(--cu-shadow-md);
}
</style>