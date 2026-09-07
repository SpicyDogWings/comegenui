<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, getCurrentInstance, type PropType } from "vue";
import Button from "../buttons/Button.vue";
import Loader from "../information/Loader.vue";
import LucideChevronRight from "@/components/icons/LucideChevronRight.vue";

export interface DropdownMenuItem {
  label?: string;
  to?: string;
  href?: string;
  icon?: string;
  disabled?: boolean;
  divider?: boolean;
  onClick?: () => void;
}

const props = defineProps({
  color: {
    type: String as PropType<'primary' | 'secondary' | 'neutral' | 'success' | 'warning' | 'danger'>,
    required: false,
    default: "neutral",
  },
  variant: {
    type: String,
    required: false,
    default: "ghost",
    validator: (value: string) =>
      ["solid", "outlined", "soft", "ghost", "subtle", "link", "none"].includes(value),
  },
  disabled: { type: Boolean, required: false, default: false },
  label: { type: String, required: false, default: "" },
  // Cómo se abre el panel: "click" (por defecto) o "hover" (abre al pasar el
  // mouse por el trigger y cierra al salir, con un pequeño delay).
  trigger: {
    type: String as PropType<'click' | 'hover'>,
    required: false,
    default: 'click',
  },
  position: {
    type: String,
    required: false,
    default: "bottom",
    validator: (value: string) => ["bottom", "top", "left", "right"].includes(value),
  },
  align: {
    type: String,
    required: false,
    default: "start",
    validator: (value: string) => ["start", "center", "end"].includes(value),
  },
  offset: { type: Number, required: false, default: 4 },
  fixed: { type: Boolean, required: false, default: false },
  // Ancho del panel (CSS, ej: "280px"). Default "" = width:100% del trigger.
  // Útil cuando el contenido del panel es más ancho que el trigger (ej: un calendario).
  panelWidth: { type: String, required: false, default: "" },
  loading: { type: Boolean, required: false, default: false },
  cooldown: { type: Boolean, required: false, default: false },
  cooldownKey: { type: Number, required: false, default: 0 },
  delay: { type: Number, required: false, default: 2000 },
  // Items de menú nativos (hojas). Se renderizan como filas de menú con el
  // mismo estilo que el trigger de un submenú anidado. Útil para menús de
  // navegación sin tener que armar Buttons a mano.
  items: { type: Array as () => DropdownMenuItem[], required: false, default: () => [] },
});

// Un dropdown anidado (renderizado dentro del panel de otro dropdown) se
// comporta como un submenú en cascada: su trigger es una fila de menú nativa,
// se abre hacia la derecha y mantiene el padre abierto mientras se navega.
const isNested = ref(false);

function detectNested() {
  const el = dropdownRef.value;
  if (!el) return;
  let parent = el.parentElement;
  while (parent) {
    if (parent.classList.contains("cu-dropdown")) {
      isNested.value = true;
      return;
    }
    parent = parent.parentElement;
  }
}

// Si el usuario setea position explícitamente, respetarlo; si no, un dropdown
// anidado abre en cascada hacia la derecha.
const instance = getCurrentInstance();
const positionExplicit = computed(
  () => instance?.vnode?.props?.position !== undefined,
);

const effectivePosition = computed(() =>
  isNested.value && !positionExplicit.value ? "right" : props.position
);
const effectiveAlign = computed(() => props.align);

const panelPos = ref<Record<string, string>>({ top: "0px", left: "0px" });

const panelStyle = computed(() => {
  const base: Record<string, string> = {
    backgroundColor: "var(--cu-color-surface)",
    maxWidth: "80vw",
  };

  if (props.fixed) {
    return {
      ...base,
      minWidth: "200px",
      position: "fixed",
      ...panelPos.value,
      zIndex: "10000",
      ...(props.panelWidth ? { width: props.panelWidth } : {}),
    };
  }

  base.position = "absolute";
  base.zIndex = isNested.value ? "1001" : "1000";
  base.width = props.panelWidth || (isNested.value ? "auto" : "100%");
  base.minWidth = isNested.value ? "160px" : "200px";

  // Eje vertical (bottom/top) → panel abajo/arriba del trigger; eje horizontal (left/right) → a los costados.
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

  // Alineación: horizontal para bottom/top, vertical para left/right.
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

const selectedValue = defineModel<string>({ default: "" });

const emit = defineEmits(["open", "close"]);
const isOpen = ref(false);
const dropdownRef = ref<HTMLElement | null>(null);

// Registry (global, sobre globalThis) de dropdowns abiertos por hover: al abrir
// uno nuevo se cierran los hermanos abiertos al INSTANTE (sin esperar el delay
// de salida), así no quedan dos menús superpuestos. Los ancestros se preservan
// (entrar a un submenú no cierra su padre).
//
// NOTA: se guarda en globalThis (no como estado de módulo) porque el módulo puede
// evaluarse más de una vez (tests, ramas del graph de build/HMR): con estado de
// módulo cada instancia tendría su propio registry y los hermanos no se cerrarían.
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
  const el = dropdownRef.value;
  if (!el) return;
  const reg = hoverRegistry();
  const toClose = reg.filter((entry) => entry.el !== el && !entry.el.contains(el));
  reg.push({ el, close });
  for (const entry of toClose) entry.close();
}

function unregisterHover() {
  const el = dropdownRef.value;
  if (!el) return;
  const reg = hoverRegistry();
  const idx = reg.findIndex((entry) => entry.el === el);
  if (idx !== -1) reg.splice(idx, 1);
}

// Un click fuera del dropdown cierra el panel en fase CAPTURA (antes que los handlers
// del target). Si el mismo click dispara un toggle() externo (ej. botón programático),
// toggle() vería el panel cerrado y lo reabriría: el flag marca "este click ya cerró"
// y toggle() no reabre. Expira con el mismo evento (setTimeout 0).
let closedByOutsideClick = false;

let closeTimer: ReturnType<typeof setTimeout> | null = null;

// Última posición del puntero (se actualiza con un listener global mientras un
// dropdown hover está abierto). Sirve para no cerrar un menú cuando el mouse
// cruza el pequeño gap entre el trigger y el panel (o entre paneles anidados):
// al dispararse el timer de cierre, se verifica que el puntero NO esté dentro
// del área del menú antes de cerrarlo.
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
  const el = dropdownRef.value;
  if (!el) return false;
  const panel = el.querySelector(".cu-dropdown-panel") as HTMLElement | null;
  const rects = [el.getBoundingClientRect()];
  if (panel) rects.push(panel.getBoundingClientRect());
  return rects.some(
    (r) => lastPointer.x >= r.left && lastPointer.x <= r.right &&
           lastPointer.y >= r.top && lastPointer.y <= r.bottom,
  );
}

// En modo hover, el panel se abre al pasar el mouse por el trigger y se cierra
// al salir del dropdown (trigger + panel viven dentro del mismo root, así que
// moverse del trigger al panel no lo cierra). El timer verifica la posición
// real del puntero para no derribar el menú mientras se navega por los paneles.
function onRootEnter() {
  if (props.trigger !== 'hover') return
  if (closeTimer) { clearTimeout(closeTimer); closeTimer = null }
  open()
}

function onRootLeave() {
  if (props.trigger !== 'hover') return
  ensurePointerListener()
  if (closeTimer) clearTimeout(closeTimer)
  closeTimer = setTimeout(() => {
    if (isPointerInside()) return
    close()
  }, 150)
}

function onDocumentClick(e: MouseEvent) {
  if (!isOpen.value || !dropdownRef.value) return;
  if (!e.composedPath().includes(dropdownRef.value)) {
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
  detectNested();
  document.addEventListener("click", onDocumentClick, true);
  document.addEventListener("keydown", onKeyDown);
  window.addEventListener("resize", onViewportChange);
  // capture: captura el scroll de TODOS los contenedores (página y overflow interno tipo tabla)
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

// Recalcula la posición del panel en modo fixed (coordenadas de viewport). Se llama al
// abrir y de nuevo en cada scroll/resize mientras está abierto: como el panel es
// position: fixed, no sigue solo al trigger cuando scrollea la página o un contenedor
// interno (ej. la tabla con overflow) — sin esto quedaría flotando en las coordenadas
// viejas (o escondido si quedó fuera de pantalla).
function positionPanel() {
  if (!props.fixed || !dropdownRef.value) return;
  // El modo fixed espeja EXACTAMENTE el modo absolute pero en coordenadas de viewport:
  // en vez de "top: 100% / bottom: 100% / left: 100% / right: 100%" sobre el trigger,
  // usamos top/bottom/left/right del viewport calculados con getBoundingClientRect.
  // Importante: para top/left el panel se ancla por el borde OPUESTO (bottom/right) —
  // si se usara "top: r.top - offset" el panel crecería hacia abajo y taparía el trigger.
  // El centrado usa transform (no estima el ancho/alto del panel).
  const r = dropdownRef.value.getBoundingClientRect();
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
  } else { // left
    style.right = `${vw - r.left + props.offset}px`;
    if (align === "start") style.top = `${r.top}px`;
    else if (align === "end") style.bottom = `${vh - r.bottom}px`;
    else { style.top = `${r.top + r.height / 2}px`; style.transform = "translateY(-50%)"; }
  }
  panelPos.value = style;
}

// Mientras el panel está abierto en modo fixed, re-posicionarlo en cada scroll/resize
// para que siga al trigger (el fixed no se mueve solo con el contenido).
function onViewportChange() {
  if (isOpen.value && props.fixed) positionPanel();
}

function open() {
  if (props.disabled) return;
  positionPanel();
  isOpen.value = true;
  emit("open");
  if (props.trigger === 'hover') registerHoverOpen();
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

function onItemClick(item: DropdownMenuItem) {
  if (item.disabled || item.divider) return;
  if (item.onClick) item.onClick();
  close();
}

function get() { return selectedValue.value; }
function set(val: string) { selectedValue.value = val; }
function reset() { selectedValue.value = ""; }

defineExpose({ open, close, toggle, get, set, reset, isOpen: () => isOpen.value });
</script>

<template>
  <div
    ref="dropdownRef"
    class="cu-dropdown"
    :class="{ 'cu-dropdown--nested': isNested }"
    @mouseenter="onRootEnter"
    @mouseleave="onRootLeave"
  >
    <slot name="toggle" :toggle="toggle" :isOpen="isOpen">
      <button
        v-if="isNested"
        type="button"
        class="cu-dropdown-menu-item"
        @click="toggle"
      >
        <span class="cu-dropdown-menu-item-label">{{ label || "Submenú" }}</span>
        <LucideChevronRight :width="14" :height="14" class="cu-dropdown-menu-item-chevron" />
      </button>
      <Button
        v-else
        :color="color"
        :variant="variant"
        :disabled="disabled"
        @click="toggle"
      >
        {{ label || "Dropdown" }}
      </Button>
    </slot>

    <div
      v-if="isOpen"
      :style="panelStyle"
      class="cu-dropdown-panel"
      :class="{
        'cu-dropdown-panel--loading': loading,
        'cu-dropdown-panel--nested': isNested,
      }"
      role="menu"
    >
      <Loader
        v-if="loading"
        :color="color"
        animation="loading"
      />
      <Loader
        v-if="cooldown && !loading"
        :key="cooldownKey"
        :color="color"
        animation="cooldown"
        :delay="delay"
      />
      <template v-if="!loading">
        <template v-for="(item, i) in props.items" :key="i">
          <hr v-if="item.divider" class="cu-dropdown-menu-divider" />
          <a
            v-else-if="item.to || item.href"
            :href="item.to || item.href"
            :class="['cu-dropdown-menu-item', { 'cu-dropdown-menu-item--disabled': item.disabled }]"
            @click="onItemClick(item)"
          >
            <span v-if="item.icon" class="cu-dropdown-menu-item-icon" v-html="item.icon"></span>
            <span class="cu-dropdown-menu-item-label">{{ item.label }}</span>
          </a>
          <button
            v-else
            type="button"
            :class="['cu-dropdown-menu-item', { 'cu-dropdown-menu-item--disabled': item.disabled }]"
            :disabled="item.disabled"
            @click="onItemClick(item)"
          >
            <span v-if="item.icon" class="cu-dropdown-menu-item-icon" v-html="item.icon"></span>
            <span class="cu-dropdown-menu-item-label">{{ item.label }}</span>
          </button>
        </template>
        <slot></slot>
      </template>
    </div>
  </div>
</template>

<style scoped>
.cu-dropdown {
  position: relative;
  display: inline-block;
  box-sizing: border-box;
}

/* Dropdown anidado: ocupa el ancho de la fila del menú padre */
.cu-dropdown--nested {
  display: block;
  width: 100%;
}

.cu-dropdown-panel {
  padding: var(--cu-space-sm);
  border-radius: var(--cu-radius-md);
  font-family: var(--cu-font-sans);
  box-shadow: var(--cu-shadow-xl);
}

.cu-dropdown-panel--nested {
  padding: var(--cu-space-2xs);
}

/* Item de menú nativo (hojas + trigger de submenú anidado) */
.cu-dropdown-menu-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--cu-space-md);
  width: 100%;
  padding: var(--cu-space-sm) var(--cu-space-md);
  box-sizing: border-box;
  background: transparent;
  border: none;
  cursor: pointer;
  font-family: var(--cu-font-sans);
  font-size: var(--cu-font-size-sm);
  color: var(--cu-color-neutral);
  text-decoration: none;
  border-radius: var(--cu-radius-sm);
  transition: background-color 150ms ease;
}

.cu-dropdown-menu-item:hover:not(.cu-dropdown-menu-item--disabled) {
  background-color: var(--cu-color-neutral-ghost-hover);
}

.cu-dropdown-menu-item--disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.cu-dropdown-menu-item-label {
  text-align: left;
  white-space: nowrap;
}

.cu-dropdown-menu-item-chevron {
  flex-shrink: 0;
  opacity: 0.5;
}

.cu-dropdown-menu-item-icon {
  flex-shrink: 0;
  opacity: 0.6;
}

.cu-dropdown-menu-divider {
  margin: var(--cu-space-2xs) 0;
  border: 0;
  border-top: var(--cu-border-thin) solid var(--cu-border-color);
}

/* Mientras carga el panel muestra solo el loader (slot oculto) — sin opacity:
   atenuar el panel lo hacía transparente y se veía la página a través */
.cu-dropdown-panel--loading {
  pointer-events: none;
}
</style>
