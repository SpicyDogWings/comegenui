<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, type PropType } from "vue";
import { isAlign, isPosition } from '@/utils/validators'

const props = defineProps({
  position: {
    type: String as PropType<'bottom' | 'top' | 'left' | 'right'>,
    required: false,
    default: "bottom",
    validator: isPosition,
  },
  align: {
    type: String as PropType<'start' | 'center' | 'end'>,
    required: false,
    default: "start",
    validator: isAlign,
  },
  offset: { type: Number, required: false, default: 4 },
  fixed: { type: Boolean, required: false, default: false },
  // Ancho del panel (CSS, ej: "280px"). Default "" = width:100% del trigger.
  panelWidth: { type: String, required: false, default: "" },
  disabled: { type: Boolean, required: false, default: false },
  // hover: abre con mouseenter, cierra con mouseleave (para tooltip/contextual).
  hover: { type: Boolean, required: false, default: false },
  hoverDelay: { type: Number, required: false, default: 200 },
  // role del panel (menu, tooltip, dialog...) y clase extra del panel.
  role: { type: String, required: false, default: "" },
  panelClass: {
    type: [String, Array, Object] as PropType<string | string[] | Record<string, boolean>>,
    required: false,
    default: "",
  },
});

const emit = defineEmits(["open", "close"]);

const effectivePosition = computed(() => props.position);
const effectiveAlign = computed(() => props.align);

const panelPos = ref<Record<string, string>>({ top: "0px", left: "0px" });

const panelStyle = computed(() => {
  // Anchos y fondo vía CSS vars para que los wrappers (Tooltip, etc.) los
  // puedan sobrescribir sin pelear con estilos inline.
  const base: Record<string, string> = {
    backgroundColor: "var(--cu-popover-bg, var(--cu-color-surface))",
    minWidth: "var(--cu-popover-min-width, 200px)",
    maxWidth: "var(--cu-popover-max-width, 80vw)",
  };

  if (props.fixed) {
    return {
      ...base,
      position: "fixed",
      ...panelPos.value,
      zIndex: "10000",
      ...(props.panelWidth ? { width: props.panelWidth } : {}),
    };
  }

  base.position = "absolute";
  base.zIndex = "1000";
  base.width = props.panelWidth || "var(--cu-popover-width, 100%)";

  const pos = effectivePosition.value;
  if (pos === "bottom") {
    base.top = "100%";
    base.marginTop = `${props.offset}px`;
  } else if (pos === "top") {
    base.bottom = "100%";
    base.marginBottom = `${props.offset}px`;
  } else if (pos === "right") {
    base.left = "100%";
    base.marginLeft = `${props.offset}px`;
  } else if (pos === "left") {
    base.right = "100%";
    base.marginRight = `${props.offset}px`;
  }

  if (pos === "left" || pos === "right") {
    if (effectiveAlign.value === "start") {
      base.top = "0";
    } else if (effectiveAlign.value === "end") {
      base.bottom = "0";
    } else {
      base.top = "50%";
      base.transform = "translateY(-50%)";
    }
  } else {
    if (effectiveAlign.value === "start") {
      base.left = "0";
    } else if (effectiveAlign.value === "end") {
      base.right = "0";
    } else {
      base.left = "50%";
      base.transform = "translateX(-50%)";
    }
  }

  return base;
});

const isOpen = ref(false);
const popoverRef = ref<HTMLElement | null>(null);

// Un click fuera del popover cierra el panel en fase CAPTURA. Si el mismo click
// dispara un toggle() externo, el flag marca "este click ya cerró" y no reabre.
let closedByOutsideClick = false;

function onDocumentClick(e: MouseEvent) {
  if (!isOpen.value || !popoverRef.value) return;
  if (!e.composedPath().includes(popoverRef.value)) {
    closedByOutsideClick = true;
    isOpen.value = false;
    emit("close");
    setTimeout(() => { closedByOutsideClick = false; }, 0);
  }
}

function onKeyDown(e: KeyboardEvent) {
  if (e.key === "Escape" && isOpen.value) {
    isOpen.value = false;
    emit("close");
  }
}

onMounted(() => {
  document.addEventListener("click", onDocumentClick, true);
  document.addEventListener("keydown", onKeyDown);
  window.addEventListener("resize", onViewportChange);
  document.addEventListener("scroll", onViewportChange, true);
});
onUnmounted(() => {
  unregisterHover();
  document.removeEventListener("click", onDocumentClick, true);
  document.removeEventListener("keydown", onKeyDown);
  window.removeEventListener("resize", onViewportChange);
  document.removeEventListener("scroll", onViewportChange, true);
  document.removeEventListener("mousemove", onPointerMove, true);
  pointerListening = false;
});

// Recalcula la posición del panel en modo fixed (coordenadas de viewport) al
// abrir y en cada scroll/resize mientras está abierto.
function positionPanel() {
  if (!props.fixed || !popoverRef.value) return;
  const r = popoverRef.value.getBoundingClientRect();
  const vw = window.innerWidth;
  const vh = window.innerHeight;
  const pos = effectivePosition.value;
  const align = effectiveAlign.value;
  const style: Record<string, string> = {};

  if (pos === "bottom") {
    style.top = `${r.bottom + props.offset}px`;
    if (align === "start") style.left = `${r.left}px`;
    else if (align === "end") style.right = `${vw - r.right}px`;
    else { style.left = `${r.left + r.width / 2}px`; style.transform = "translateX(-50%)"; }
  } else if (pos === "top") {
    style.bottom = `${vh - r.top + props.offset}px`;
    if (align === "start") style.left = `${r.left}px`;
    else if (align === "end") style.right = `${vw - r.right}px`;
    else { style.left = `${r.left + r.width / 2}px`; style.transform = "translateX(-50%)"; }
  } else if (pos === "right") {
    style.left = `${r.right + props.offset}px`;
    if (align === "start") style.top = `${r.top}px`;
    else if (align === "end") style.bottom = `${vh - r.bottom}px`;
    else { style.top = `${r.top + r.height / 2}px`; style.transform = "translateY(-50%)"; }
  } else {
    style.right = `${vw - r.left + props.offset}px`;
    if (align === "start") style.top = `${r.top}px`;
    else if (align === "end") style.bottom = `${vh - r.bottom}px`;
    else { style.top = `${r.top + r.height / 2}px`; style.transform = "translateY(-50%)"; }
  }
  panelPos.value = style;
}

function onViewportChange() {
  if (isOpen.value && props.fixed) positionPanel();
}

let hoverTimer: ReturnType<typeof setTimeout> | null = null;
let hoverCloseTimer: ReturnType<typeof setTimeout> | null = null;

// Registry (global, sobre globalThis) de popovers abiertos por hover: al abrir
// uno nuevo se cierran los hermanos abiertos AL INSTANTE (sin esperar el delay
// de salida), así no quedan dos paneles superpuestos. Los ancestros se preservan
// (entrar a un submenú no cierra su padre). Se guarda en globalThis porque el
// módulo puede evaluarse más de una vez (tests/HMR) y cada copia tendría su propio.
interface HoverEntry {
  el: HTMLElement;
  close: () => void;
}
const HOVER_REGISTRY_KEY = '__cu_hover_registry__';
function hoverRegistry(): HoverEntry[] {
  const g = globalThis as unknown as Record<string, HoverEntry[] | undefined>;
  return (g[HOVER_REGISTRY_KEY] ??= []);
}

function registerHoverOpen() {
  const el = popoverRef.value;
  if (!el) return;
  const reg = hoverRegistry();
  const toClose = reg.filter((entry) => entry.el !== el && !entry.el.contains(el));
  reg.push({ el, close });
  for (const entry of toClose) entry.close();
}

function unregisterHover() {
  const el = popoverRef.value;
  if (!el) return;
  const reg = hoverRegistry();
  const idx = reg.findIndex((entry) => entry.el === el);
  if (idx !== -1) reg.splice(idx, 1);
}

// Última posición del puntero: al dispararse el timer de cierre por hover se
// verifica que el puntero NO esté dentro del área del popover (trigger + panel)
// antes de cerrarlo — cruzar el pequeño gap entre trigger y panel no lo derriba.
let lastPointer = { x: -1, y: -1 };
let pointerListening = false;

function ensurePointerListener() {
  if (pointerListening) return;
  pointerListening = true;
  document.addEventListener("mousemove", onPointerMove, true);
}

function onPointerMove(e: MouseEvent) {
  lastPointer = { x: e.clientX, y: e.clientY };
}

function isPointerInside() {
  const el = popoverRef.value;
  if (!el) return false;
  const panel = el.querySelector(".cu-popover-panel") as HTMLElement | null;
  const rects = [el.getBoundingClientRect()];
  if (panel) rects.push(panel.getBoundingClientRect());
  return rects.some(
    (r) => lastPointer.x >= r.left && lastPointer.x <= r.right &&
           lastPointer.y >= r.top && lastPointer.y <= r.bottom,
  );
}

function onMouseEnter() {
  if (!props.hover || props.disabled) return;
  if (hoverTimer) clearTimeout(hoverTimer);
  if (hoverCloseTimer) { clearTimeout(hoverCloseTimer); hoverCloseTimer = null; }
  if (props.hoverDelay === 0) {
    open();
  } else {
    hoverTimer = setTimeout(() => open(), props.hoverDelay);
  }
}

function onMouseLeave() {
  if (!props.hover) return;
  if (hoverTimer) clearTimeout(hoverTimer);
  ensurePointerListener();
  if (hoverCloseTimer) clearTimeout(hoverCloseTimer);
  hoverCloseTimer = setTimeout(() => {
    if (isPointerInside()) return;
    close();
  }, 120);
}

function open() {
  if (props.disabled) return;
  positionPanel();
  isOpen.value = true;
  emit("open");
  if (props.hover) registerHoverOpen();
}
function close() {
  if (!isOpen.value) return;
  isOpen.value = false;
  emit("close");
  unregisterHover();
}
function toggle() {
  if (props.disabled) return;
  if (closedByOutsideClick) {
    closedByOutsideClick = false;
    return;
  }
  if (isOpen.value) close();
  else open();
}

defineExpose({ open, close, toggle, isOpen: () => isOpen.value });
</script>

<template>
  <div
    ref="popoverRef"
    class="cu-popover"
    @mouseenter="onMouseEnter"
    @mouseleave="onMouseLeave"
  >
    <slot name="toggle" :toggle="toggle" :isOpen="isOpen" />
    <div
      v-if="isOpen"
      :style="panelStyle"
      :class="['cu-popover-panel', panelClass]"
      :role="role || undefined"
    >
      <slot />
    </div>
  </div>
</template>

<style scoped>
.cu-popover {
  position: relative;
  display: inline-block;
  box-sizing: border-box;
}

.cu-popover-panel {
  padding: var(--cu-space-sm);
  border-radius: var(--cu-radius-md);
  font-family: var(--cu-font-sans);
  box-shadow: var(--cu-shadow-xl);
}
</style>