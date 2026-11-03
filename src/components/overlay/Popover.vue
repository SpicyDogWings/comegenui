<script setup lang="ts">
import { ref, computed, nextTick, onMounted, onUnmounted, type PropType } from "vue";
import { isAlign, isPosition } from '@/utils/validators'
import { parentInFlatTree } from "@/utils/flatTree";
import {
  registerOverlay,
  unregisterOverlay,
  type OverlayId,
} from "@/composables/useOverlayStack";

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
  /** `id` del panel: el trigger lo referencia con `aria-controls` (patrón combobox/listbox). */
  panelId: { type: String, required: false, default: "" },
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

// Fallback automático a `fixed`: si un ancestro recorta el panel (`.cu-card`,
// `.cu-table`, cualquier contenedor con `overflow` distinto de `visible`),
// `position: absolute` queda cortado en su borde. En ese caso el panel se posiciona
// contra el viewport, con la misma maquinaria que ya usa la prop `fixed`.
// No se activa si un ancestro crea containing block para `fixed` (transform, filter,
// contain, …): ahí `fixed` quedaría desplazado y el recorte es el mal menor.
const autoFixed = ref(false);
const fixedMode = computed(() => props.fixed || autoFixed.value);

const panelStyle = computed(() => {
  // Anchos y fondo vía CSS vars para que los wrappers (Tooltip, etc.) los
  // puedan sobrescribir sin pelear con estilos inline.
  const base: Record<string, string> = {
    backgroundColor: "var(--cu-popover-bg, var(--cu-color-surface))",
    minWidth: "var(--cu-popover-min-width, 200px)",
    maxWidth: "var(--cu-popover-max-width, 80vw)",
  };

  if (fixedMode.value) {
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
// Panel renderizado: se mide para decidir si un ancestro lo recorta.
const panelEl = ref<HTMLElement | null>(null);

// ── Nombre accesible del panel ──
// `menu` y `dialog` exigen nombre y el panel no tiene un título propio del que sacarlo:
// sin esto el lector de pantalla anunciaba "menú"/"diálogo" a secas. Se deriva del
// trigger (`aria-label`, `title`, `label` del CE o su texto), que es lo que nombra el
// patrón menu button. Con `role` vacío (tooltip, contenido libre) no se toca nada.
const NAMED_ROLES: Record<string, true> = { menu: true, dialog: true, alertdialog: true };
const panelLabel = ref("");

/** Primer elemento del slot `toggle` (el ancla que el consumidor abre). */
function toggleElement(): HTMLElement | null {
  const root = popoverRef.value;
  if (!root) return null;
  for (const child of Array.from(root.children)) {
    if (child === panelEl.value) continue;
    if (child instanceof HTMLElement) return child;
  }
  return null;
}

/** Texto del trigger, con la misma precedencia que usa su nombre accesible. */
function triggerLabel(el: HTMLElement | null): string {
  if (!el) return "";
  return (
    el.getAttribute("aria-label") ||
    el.getAttribute("title") ||
    // convención de los custom elements de la lib (`<cu-button label="…">`)
    el.getAttribute("label") ||
    el.textContent ||
    ""
  )
    .replace(/\s+/g, " ")
    .trim();
}

function namePanel() {
  panelLabel.value = NAMED_ROLES[props.role] ? triggerLabel(toggleElement()) : "";
}

// ── Pila de overlays ──
// `Escape` lo atiende la pila compartida y sólo sobre el overlay de arriba: con un
// listener propio, un Escape cerraba el menú y su submenú a la vez.
let overlayId: OverlayId | null = null;

function claimOverlay() {
  if (overlayId) return;
  overlayId = registerOverlay({ close });
}

function releaseOverlay() {
  if (!overlayId) return;
  unregisterOverlay(overlayId);
  overlayId = null;
}

// ── Foco ──
// Al abrir se recuerda quién tenía el foco (el trigger). Al cerrar, si el foco
// quedó adentro del panel o se perdió en el `body`, vuelve ahí: antes, cerrar con
// Escape (o elegir un día/ítem) dejaba el foco en el body. En modo `hover`
// (Tooltip) nunca se mueve el foco: el mouse no enfoca nada.
let focusBeforeOpen: HTMLElement | null = null;

/**
 * Elemento enfocado dentro del mismo árbol (shadow root o documento).
 *
 * Dentro de un shadow root `activeElement` es `null` cuando el foco está afuera: eso
 * **no** significa "foco perdido" (puede estar en otro control del documento), así que
 * se cae a `document.activeElement` y se descarta el host, que es un destino inútil.
 */
function activeInTree(): HTMLElement | null {
  const root = popoverRef.value?.getRootNode() as Document | ShadowRoot | undefined;
  const inRoot = (root?.activeElement as HTMLElement | null) ?? null;
  if (inRoot) return inRoot;
  if (!root || !(root instanceof ShadowRoot)) return null;
  const host = root.host as HTMLElement | null;
  const docActive = document.activeElement as HTMLElement | null;
  if (docActive && docActive !== document.body && docActive !== host) return docActive;
  return null;
}

/** Primer elemento enfocable del trigger (slot `#toggle`). */
function triggerElement(): HTMLElement | null {
  const root = popoverRef.value;
  if (!root) return null;
  const focusables = root.querySelectorAll<HTMLElement>(
    'button, a[href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
  );
  for (const el of focusables) {
    if (!panelEl.value?.contains(el)) return el;
  }
  return null;
}

function rememberFocus() {
  const active = activeInTree();
  // `body` no es un destino útil (foco perdido): mejor el trigger al cerrar.
  focusBeforeOpen =
    active && active !== document.body && !panelEl.value?.contains(active) ? active : null;
}

function restoreFocus() {
  if (props.hover) return;
  const panel = panelEl.value;
  const active = activeInTree();
  const insidePanel = !!panel && !!active && panel.contains(active);
  // Click afuera sobre algo no enfocable: el foco ya se perdió en el body.
  const lost = !active || active === document.body;
  const target = insidePanel ? (focusBeforeOpen ?? triggerElement()) : lost ? focusBeforeOpen : null;
  focusBeforeOpen = null;
  if (!target || !target.isConnected) return;
  target.focus();
}

// Un click fuera del popover cierra el panel en fase CAPTURA. Si el mismo click
// dispara un toggle() externo, el flag marca "este click ya cerró" y no reabre.
let closedByOutsideClick = false;

function onDocumentClick(e: MouseEvent) {
  if (!isOpen.value || !popoverRef.value) return;
  // Un `click` que no viene de un puntero no es un click del usuario: es un
  // `CustomEvent('click')` redisparado por un ancestro (p. ej. `<cu-card>` re-emite
  // el click de su contenido). Tratarlo como "click afuera" cerraba el panel con el
  // mismo gesture que lo abría, así que dentro de una card el menú nunca quedaba abierto.
  if (!(e instanceof MouseEvent)) return;
  if (!e.composedPath().includes(popoverRef.value)) {
    closedByOutsideClick = true;
    isOpen.value = false;
    emit("close");
    restoreFocus();
    setTimeout(() => { closedByOutsideClick = false; }, 0);
  }
}

// El listener de scroll va PASIVO: sólo lee geometría para reposicionar el panel
// (nunca llama a `preventDefault`), así que no debe bloquear el scrolling
// asíncrono. Un listener de scroll no pasivo en `document` es exactamente lo que
// Firefox marca como "scroll-linked positioning effect".
const SCROLL_OPTS = { capture: true, passive: true } as const;

// Elemento raíz recordado al montar: en `onUnmounted` el template ref ya es `null` y
// sin esto el registry de hover se quedaba con una entrada muerta (que además
// apuntaba a un nodo desconectado).
let mountedRoot: HTMLElement | null = null;

onMounted(() => {
  mountedRoot = popoverRef.value;
  document.addEventListener("click", onDocumentClick, true);
  window.addEventListener("resize", onViewportChange);
  document.addEventListener("scroll", onViewportChange, SCROLL_OPTS);
});
onUnmounted(() => {
  clearHoverTimers();
  unregisterHover();
  releaseOverlay();
  document.removeEventListener("click", onDocumentClick, true);
  window.removeEventListener("resize", onViewportChange);
  document.removeEventListener("scroll", onViewportChange, SCROLL_OPTS);
  document.removeEventListener("mousemove", onPointerMove, true);
  pointerListening = false;
  mountedRoot = null;
});

// Margen mínimo entre el panel y el borde del viewport al voltear/clamp.
const VIEWPORT_MARGIN = 8;

/**
 * Inicio del eje cruzado (X en `bottom`/`top`, Y en `left`/`right`) según `align`.
 */
function crossAxisStart(anchorStart: number, anchorSize: number, panelSize: number, align: string): number {
  if (align === "start") return anchorStart;
  if (align === "end") return anchorStart + anchorSize - panelSize;
  return anchorStart + anchorSize / 2 - panelSize / 2;
}

/** Deja el panel dentro del viewport sin generar scroll (nunca negativo). */
function clampToViewport(value: number, size: number, viewport: number): number {
  const max = Math.max(VIEWPORT_MARGIN, viewport - size - VIEWPORT_MARGIN);
  return Math.min(Math.max(value, VIEWPORT_MARGIN), max);
}

/**
 * Recalcula la posición del panel en modo fixed (coordenadas de viewport) al abrir y
 * en cada scroll/resize mientras está abierto.
 *
 * Con el tamaño medido el panel se ubica por coordenadas y se **voltea** al lado
 * opuesto si no entra (right→left, bottom→top) y se **clampea** al viewport: antes,
 * `position="right"` en el borde derecho generaba scroll horizontal (scrollWidth
 * 1201 > 900) y `left` daba x=-308.
 */
function positionPanel(measured?: { width: number; height: number }) {
  if (!fixedMode.value || !popoverRef.value) return;
  const r = popoverRef.value.getBoundingClientRect();
  const vw = window.innerWidth;
  const vh = window.innerHeight;
  const align = effectiveAlign.value;
  const gap = props.offset;
  const style: Record<string, string> = {};

  const box = measured ?? panelEl.value?.getBoundingClientRect();
  const pw = box?.width ?? 0;
  const ph = box?.height ?? 0;

  // Espacio libre a cada lado del ancla (descontando el gap y el margen).
  const room = {
    right: vw - r.right - gap - VIEWPORT_MARGIN,
    left: r.left - gap - VIEWPORT_MARGIN,
    bottom: vh - r.bottom - gap - VIEWPORT_MARGIN,
    top: r.top - gap - VIEWPORT_MARGIN,
  };

  let pos = effectivePosition.value;
  if (pw > 0) {
    if (pos === "right" && room.right < pw && room.left >= pw) pos = "left";
    else if (pos === "left" && room.left < pw && room.right >= pw) pos = "right";
  }
  if (ph > 0) {
    if (pos === "bottom" && room.bottom < ph && room.top >= ph) pos = "top";
    else if (pos === "top" && room.top < ph && room.bottom >= ph) pos = "bottom";
  }

  if (pw > 0 || ph > 0) {
    let left: number;
    let top: number;
    if (pos === "bottom" || pos === "top") {
      left = crossAxisStart(r.left, r.width, pw, align);
      top = pos === "bottom" ? r.bottom + gap : r.top - gap - ph;
    } else {
      top = crossAxisStart(r.top, r.height, ph, align);
      left = pos === "right" ? r.right + gap : r.left - gap - pw;
    }
    if (pw > 0) left = clampToViewport(left, pw, vw);
    if (ph > 0) top = clampToViewport(top, ph, vh);
    style.left = `${left}px`;
    style.top = `${top}px`;
  } else if (pos === "bottom") {
    style.top = `${r.bottom + gap}px`;
    if (align === "start") style.left = `${r.left}px`;
    else if (align === "end") style.right = `${vw - r.right}px`;
    else { style.left = `${r.left + r.width / 2}px`; style.transform = "translateX(-50%)"; }
  } else if (pos === "top") {
    style.bottom = `${vh - r.top + gap}px`;
    if (align === "start") style.left = `${r.left}px`;
    else if (align === "end") style.right = `${vw - r.right}px`;
    else { style.left = `${r.left + r.width / 2}px`; style.transform = "translateX(-50%)"; }
  } else if (pos === "right") {
    style.left = `${r.right + gap}px`;
    if (align === "start") style.top = `${r.top}px`;
    else if (align === "end") style.bottom = `${vh - r.bottom}px`;
    else { style.top = `${r.top + r.height / 2}px`; style.transform = "translateY(-50%)"; }
  } else {
    style.right = `${vw - r.left + gap}px`;
    if (align === "start") style.top = `${r.top}px`;
    else if (align === "end") style.bottom = `${vh - r.bottom}px`;
    else { style.top = `${r.top + r.height / 2}px`; style.transform = "translateY(-50%)"; }
  }
  // En el fallback automático el panel no puede heredar el `width: 100%` del modo
  // absoluto (ya no está en el flujo del ancla): conserva el ancho ya medido (el del
  // ancla si era `100%`, el del contenido si era `auto`). Con `fixed` explícito o
  // `panelWidth` no se toca nada.
  if (autoFixed.value && !props.panelWidth && pw > 0) style.width = `${pw}px`;
  panelPos.value = style;
}

function onViewportChange() {
  if (isOpen.value && fixedMode.value) positionPanel();
}

// ¿Este ancestro ancla a sus descendientes `fixed`? Entonces `fixed` no escapa del
// recorte: quedaría desplazado respecto del ancla, que es peor que quedar recortado.
function anchorsFixedDescendants(cs: CSSStyleDeclaration): boolean {
  const notNone = (v: string | undefined) => !!v && v !== "none";
  return (
    notNone(cs.transform) ||
    notNone(cs.filter) ||
    notNone(cs.perspective) ||
    notNone(cs.backdropFilter) ||
    (!!cs.contain && /paint|layout|strict|content/.test(cs.contain)) ||
    (!!cs.willChange && /transform|filter|perspective/.test(cs.willChange))
  );
}

// `overflow` distinto de `visible` recorta a sus descendientes (hidden/auto/scroll/clip).
function clipsDescendants(cs: CSSStyleDeclaration): boolean {
  return !!cs.overflow && cs.overflow !== "visible";
}

// Recorre el árbol desde el ancla (en el flat tree) buscando un ancestro que recorte
// el panel ya renderizado. Sin layout (jsdom) devuelve false: no hay nada que medir.
function isClippedByAncestor(panel: HTMLElement, anchor: HTMLElement, pr: DOMRect): boolean {
  if (!pr.width && !pr.height) return false;
  let el: Element | null = parentInFlatTree(anchor);
  while (el) {
    const cs = getComputedStyle(el);
    if (anchorsFixedDescendants(cs)) return false;
    if (clipsDescendants(cs)) {
      const r = el.getBoundingClientRect();
      if (pr.top < r.top || pr.left < r.left || pr.bottom > r.bottom || pr.right > r.right) {
        return true;
      }
    }
    el = parentInFlatTree(el);
  }
  return false;
}

/** ¿El panel medido se sale del viewport? (en `absolute` eso genera scroll). */
function overflowsViewport(pr: DOMRect): boolean {
  if (!pr.width && !pr.height) return false;
  return pr.left < 0 || pr.top < 0 || pr.right > window.innerWidth || pr.bottom > window.innerHeight;
}

// Se decide después del render (necesita el rect del panel) y dentro del mismo tick:
// el panel pasa a `fixed` antes del primer paint, sin parpadeo en `absolute`. Además
// del recorte por ancestro, se pasa a `fixed` si el panel se sale del viewport: ahí
// `positionPanel` lo voltea y lo clampea (nunca scroll horizontal).
async function autoFixIfNeeded() {
  await nextTick();
  const panel = panelEl.value;
  const anchor = popoverRef.value;
  if (!panel || !anchor || !isOpen.value || props.fixed) return;
  const box = panel.getBoundingClientRect();
  if (!isClippedByAncestor(panel, anchor, box) && !overflowsViewport(box)) return;
  autoFixed.value = true;
  positionPanel({ width: box.width, height: box.height });
}

// `undefined` (y no `null`) para "sin timer": `clearTimeout` lo acepta sin guarda.
let hoverTimer: ReturnType<typeof setTimeout> | undefined;
let hoverCloseTimer: ReturnType<typeof setTimeout> | undefined;

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

/** ¿`ancestor` contiene a `el` en el flat tree? Un submenú puede vivir en otro shadow. */
function containsOverlay(ancestor: HTMLElement, el: HTMLElement): boolean {
  for (let node: Element | null = el; node; node = parentInFlatTree(node)) {
    if (node === ancestor) return true;
  }
  return false;
}

function registerHoverOpen() {
  const el = popoverRef.value;
  if (!el) return;
  const reg = hoverRegistry();
  const toClose = reg.filter((entry) => entry.el !== el && !containsOverlay(entry.el, el));
  reg.push({ el, close });
  for (const entry of toClose) entry.close();
}

function unregisterHover() {
  const el = popoverRef.value ?? mountedRoot;
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

/**
 * Cancela los timers de hover. Sin esto, desmontar dentro del delay dejaba correr un
 * `open()`/`close()` sobre un nodo ya desconectado: sumaba el popover al registry
 * global de hover, a la pila de overlays, y emitía eventos de un componente que ya no
 * existe. Es el único corte necesario: los dos timers viven por instancia y se crean
 * siempre acá, así que `onUnmounted` los alcanza.
 */
function clearHoverTimers() {
  clearTimeout(hoverTimer);
  hoverTimer = undefined;
  clearTimeout(hoverCloseTimer);
  hoverCloseTimer = undefined;
}

function onMouseEnter() {
  if (!props.hover || props.disabled) return;
  clearTimeout(hoverTimer);
  hoverTimer = undefined;
  clearTimeout(hoverCloseTimer);
  hoverCloseTimer = undefined;
  if (props.hoverDelay === 0) {
    open();
  } else {
    hoverTimer = setTimeout(() => {
      hoverTimer = undefined;
      open();
    }, props.hoverDelay);
  }
}

function onMouseLeave() {
  if (!props.hover) return;
  clearTimeout(hoverTimer);
  hoverTimer = undefined;
  ensurePointerListener();
  clearTimeout(hoverCloseTimer);
  hoverCloseTimer = setTimeout(() => {
    hoverCloseTimer = undefined;
    if (isPointerInside()) return;
    close();
  }, 120);
}

function open() {
  if (props.disabled) return;
  // Cada apertura vuelve a decidir el modo: el ancestro pudo cambiar (scroll, layout).
  autoFixed.value = false;
  rememberFocus();
  positionPanel();
  namePanel();
  isOpen.value = true;
  claimOverlay();
  emit("open");
  if (props.hover) registerHoverOpen();
  // Sin `fixed` explícito, el panel se mide ya renderizado: si un ancestro lo recorta o
  // se sale del viewport, se posiciona contra el viewport (fallback automático).
  if (!props.fixed) void autoFixIfNeeded();
  // `fixed` explícito también necesita el tamaño del panel ya renderizado para
  // voltearlo/clampearlo contra el viewport.
  else void nextTick(() => { if (isOpen.value) positionPanel(); });
}
function close() {
  if (!isOpen.value) return;
  isOpen.value = false;
  autoFixed.value = false;
  releaseOverlay();
  emit("close");
  unregisterHover();
  restoreFocus();
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
      ref="panelEl"
      :id="props.panelId || undefined"
      :style="panelStyle"
      :class="['cu-popover-panel', panelClass]"
      :role="role || undefined"
      :aria-label="panelLabel || undefined"
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