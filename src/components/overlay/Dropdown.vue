<script setup lang="ts">
import { ref, computed, nextTick, onMounted, onUnmounted, type PropType } from "vue";
import { isAlign, isPosition, isVariantFull } from '@/utils/validators'
import { detectDropdownNesting } from "@/utils/dropdownNesting";
import { useUniqueId } from "@/utils/uniqueId";
import { sanitizeIcon } from "@/utils/sanitizeIcon";
import { useMenuNavigation } from "@/composables/useMenuNavigation";
import Button from "../buttons/Button.vue";
import Loader from "../information/Loader.vue";
import Popover from "./Popover.vue";
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

// Los íconos son HTML/SVG del consumidor: se sanitizan antes de `v-html`
// (mismo criterio que `Tabs`): sólo SVG inline, sin `<script>`, `on*`, `<a>`/`<img>`.
const props = defineProps({
  color: {
    type: String as PropType<'primary' | 'secondary' | 'neutral' | 'success' | 'warning' | 'danger'>,
    required: false,
    default: "neutral",
  },
  variant: {
    type: String as PropType<'solid' | 'outlined' | 'soft' | 'ghost' | 'subtle' | 'link' | 'none'>,
    required: false,
    default: "ghost",
    validator: isVariantFull,
  },
  disabled: { type: Boolean, required: false, default: false },
  label: { type: String, required: false, default: "" },
  /** Ícono del trigger (SVG/HTML). */
  icon: { type: String, required: false, default: "" },
  // Cómo se abre el panel: "click" (por defecto) o "hover" (abre al pasar el
  // mouse por el trigger y cierra al salir, con un pequeño delay).
  trigger: {
    type: String as PropType<'click' | 'hover'>,
    required: false,
    default: 'click',
  },
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
  // Útil cuando el contenido del panel es más ancho que el trigger (ej: un calendario).
  panelWidth: { type: String, required: false, default: "" },
  /** Rol ARIA del panel: `menu` (default, listas de acciones), `dialog` (paneles con contenido propio, como el date-picker), `listbox`… */
  panelRole: { type: String, required: false, default: "menu" },
  /** `id` del panel: el trigger lo referencia con `aria-controls` (patrón combobox/listbox). */
  panelId: { type: String, required: false, default: "" },
  loading: { type: Boolean, required: false, default: false },
  cooldown: { type: Boolean, required: false, default: false },
  cooldownKey: { type: Number, required: false, default: 0 },
  /**
   * Estilo de la barra de cooldown: `ghost`/`ghost-hover` (color suave, default) o
   * `solid` (color lleno). Se resuelve con los tokens del color activo.
   */
  cooldownVariant: { type: String, required: false, default: "ghost-hover" },
  delay: { type: Number, required: false, default: 2000 },
  // Items de menú nativos (hojas). Se renderizan como filas de menú con el
  // mismo estilo que el trigger de un submenú anidado. Útil para menús de
  // navegación sin tener que armar Buttons a mano.
  items: { type: Array as () => DropdownMenuItem[], required: false, default: () => [] },
});

/** Valor seleccionado (v-model). */
const selectedValue = defineModel<string>({ default: "" });

const emit = defineEmits(["open", "close"]);

const popoverRef = ref<InstanceType<typeof Popover> | null>(null);

// Un dropdown anidado (renderizado dentro del panel de otro dropdown) se
// comporta como un submenú en cascada: su trigger es una fila de menú nativa,
// se abre hacia la derecha y mantiene el padre abierto mientras se navega.
const isNested = ref(false);
// `role` del panel del menú padre: una fila de submenú sólo es `menuitem` si el panel
// que la contiene es un `menu` (dentro de un `dialog`, un `menuitem` sería inválido).
const nestedInMenu = ref(false);

/**
 * Un dropdown dentro del panel de otro es un submenú: fila nativa, cascada a la derecha
 * y el padre sigue abierto. La detección (compartida con `DropdownMenu`) cruza shadow
 * roots y slots: ver `detectDropdownNesting`.
 */
function detectNested() {
  const context = detectDropdownNesting(popoverRef.value?.$el as HTMLElement | null);
  isNested.value = context.nested;
  nestedInMenu.value = context.inMenu;
}

// Un dropdown anidado abre en cascada hacia la derecha. Sólo un `position` distinto del
// default (`bottom`) lo sobrescribe: `DropdownMenu` siempre pasa su `position`, así que
// mirar si la prop "llegó explícita" dejaba los submenús sin cascada.
const effectivePosition = computed(() =>
  isNested.value && props.position === "bottom" ? "right" : props.position
);
const effectiveAlign = computed(() => props.align);

const panelClass = computed(() => ({
  "cu-dropdown-panel": true,
  "cu-dropdown-panel--loading": props.loading,
}));

/**
 * Color de la barra de cooldown. `Loader` pinta `var(--cu-color-{color})`, así que la
 * variante se resuelve pasando el **sufijo** del token: `ghost`/`ghost-hover` usan el
 * tono suave del color (`-ghost-hover`) y `solid` el tono lleno (base). Antes la prop
 * llegaba hasta acá como atributo suelto y no tenía ningún efecto.
 */
const cooldownColor = computed(() =>
  props.cooldownVariant === "solid" ? props.color : `${props.color}-ghost-hover`,
);

function onItemClick(item: DropdownMenuItem) {
  if (item.disabled || item.divider) return;
  if (item.onClick) item.onClick();
  popoverRef.value?.close();
}

// ── Menú por `items` ──
// Con `items` el panel es un menú de verdad: filas `menuitem`, una sola parada de
// tabulación (roving) y teclado de menú (flechas/Home/End/typeahead; `Tab` cierra).
// `Select`/`Autocomplete`/`DatePicker` no pasan `items` (tienen su propio
// combobox/dialog), así que su teclado queda intacto.
const uid = useUniqueId("cu-dropdown");

/** `items` puede venir de datos: las entradas inválidas se descartan sin romper el menú. */
const menuItems = computed<DropdownMenuItem[]>(() =>
  (Array.isArray(props.items) ? props.items : []).filter(
    (item): item is DropdownMenuItem => !!item && typeof item === "object",
  ),
);

const isMenu = computed(() => menuItems.value.length > 0 && props.panelRole === "menu");

/** `id` del panel del menú: el trigger lo referencia con `aria-controls`. */
const panelIdentifier = computed(() =>
  props.panelId || (isMenu.value ? `${uid}-menu` : ""),
);

/** Índice en `items` de cada fila navegable (sin divisores ni deshabilitadas). */
const enabledItemIndices = computed(() =>
  menuItems.value
    .map((item, index) => ({ item, index }))
    .filter(({ item }) => !item.divider && !item.disabled)
    .map(({ index }) => index),
);

const nav = useMenuNavigation({
  root: () => (popoverRef.value?.$el as HTMLElement | null) ?? null,
  panel: () =>
    ((popoverRef.value?.$el as HTMLElement | null)?.querySelector(
      ".cu-dropdown-panel",
    ) as HTMLElement | null) ?? null,
  rowSelector: ".cu-dropdown-menu-item",
  enabledIndices: enabledItemIndices,
  isOpen: () => popoverRef.value?.isOpen() ?? false,
  close: () => popoverRef.value?.close(),
  enabled: () => isMenu.value,
});

/** Estado del panel: `Popover` avisa por eventos (el componente no tiene un `isOpen` propio). */
const panelOpen = ref(false);

// Abrir con flechas deja el foco en la primera/última fila (patrón menu button).
let openIntent: "first" | "last" | null = null;

function onToggleKeydown(e: KeyboardEvent) {
  if (!isMenu.value || props.disabled) return;
  if (e.key !== "ArrowDown" && e.key !== "ArrowUp") return;
  e.preventDefault();
  if (popoverRef.value?.isOpen()) {
    const rows = nav.enabledRows();
    if (rows.length > 0) nav.focusRow(rows, e.key === "ArrowUp" ? rows.length - 1 : 0);
    return;
  }
  openIntent = e.key === "ArrowUp" ? "last" : "first";
  popoverRef.value?.open();
}

function onPanelOpen() {
  panelOpen.value = true;
  emit("open");
  if (!isMenu.value) return;
  const intent = openIntent;
  openIntent = null;
  void nextTick(() => {
    const rows = nav.enabledRows();
    if (rows.length === 0) return;
    if (intent) nav.focusRow(rows, intent === "last" ? rows.length - 1 : 0);
    else nav.activeRow.value = 0;
  });
}

function onPanelClose() {
  panelOpen.value = false;
  openIntent = null;
  nav.reset();
  emit("close");
}

/** `aria-haspopup` según el rol del panel (menu/dialog/listbox). */
const togglePopup = computed<"menu" | "dialog" | "listbox" | undefined>(() =>
  props.panelRole === "menu" || props.panelRole === "dialog" || props.panelRole === "listbox"
    ? props.panelRole
    : undefined,
);

/** AA del trigger por defecto: sólo cuando el panel es el menú de `items`. */
const toggleAria = computed(() =>
  isMenu.value
    ? {
        "aria-haspopup": togglePopup.value,
        "aria-expanded": panelOpen.value ? "true" : "false",
        "aria-controls": panelIdentifier.value,
      }
    : {},
);

onMounted(() => {
  detectNested();
  nav.attach((popoverRef.value?.$el as HTMLElement | null) ?? null);
});

onUnmounted(() => {
  nav.detach();
  nav.reset();
});

/** Devuelve el valor seleccionado. */
function get() { return selectedValue.value; }
/** Setea el valor seleccionado. */
function set(val: string) { selectedValue.value = val; }
/** Limpia el valor seleccionado. */
function reset() { selectedValue.value = ""; }

defineExpose({
  /** Abre el panel. */
  open: () => popoverRef.value?.open(),
  /** Cierra el panel. */
  close: () => popoverRef.value?.close(),
  /** Alterna la visibilidad del panel. */
  toggle: () => popoverRef.value?.toggle(),
  get,
  set,
  reset,
  /** Devuelve true si el panel está abierto. */
  isOpen: () => popoverRef.value?.isOpen() ?? false,
});
</script>

<template>
  <Popover
    ref="popoverRef"
    :position="effectivePosition"
    :align="effectiveAlign"
    :offset="offset"
    :fixed="fixed"
    :panel-width="panelWidth"
    :disabled="disabled"
    :hover="trigger === 'hover'"
    :hover-delay="0"
    :role="panelRole"
    :panel-id="panelIdentifier"
    :panel-class="panelClass"
    class="cu-dropdown"
    :class="{ 'cu-dropdown--nested': isNested }"
    @open="onPanelOpen"
    @close="onPanelClose"
  >
    <template #toggle="{ toggle, isOpen }">
      <slot name="toggle" :toggle="toggle" :isOpen="isOpen">
        <button
          v-if="isNested"
          type="button"
          class="cu-dropdown-menu-item"
          :role="nestedInMenu ? 'menuitem' : undefined"
          :aria-haspopup="togglePopup"
          :aria-expanded="panelOpen ? 'true' : 'false'"
          :aria-controls="isMenu ? panelIdentifier : undefined"
          @click="toggle"
        >
          <span v-if="icon" class="cu-dropdown-menu-item-icon" v-html="sanitizeIcon(icon)"></span>
          <span class="cu-dropdown-menu-item-label">{{ label || "Submenú" }}</span>
          <LucideChevronRight
            :width="14"
            :height="14"
            class="cu-dropdown-menu-item-chevron"
            aria-hidden="true"
            focusable="false"
          />
        </button>
        <Button
          v-else
          :color="color"
          :variant="variant"
          :disabled="disabled"
          v-bind="toggleAria"
          @click="toggle"
          @keydown="onToggleKeydown"
        >
          {{ label || "Dropdown" }}
        </Button>
      </slot>
    </template>

    <Loader
      v-if="loading"
      :color="color"
      animation="loading"
    />
    <Loader
      v-if="cooldown && !loading"
      :key="cooldownKey"
      :color="cooldownColor"
      animation="cooldown"
      :delay="delay"
    />
    <template v-if="!loading">
      <template v-for="(item, i) in menuItems" :key="i">
        <hr v-if="item.divider" class="cu-dropdown-menu-divider" />
        <a
          v-else-if="item.to || item.href"
          :href="item.to || item.href"
          :class="['cu-dropdown-menu-item', { 'cu-dropdown-menu-item--disabled': item.disabled }]"
          :role="isMenu ? 'menuitem' : undefined"
          :aria-disabled="isMenu && item.disabled ? 'true' : undefined"
          :tabindex="isMenu ? nav.itemTabindex(i) : undefined"
          @click="onItemClick(item)"
        >
          <span v-if="item.icon" class="cu-dropdown-menu-item-icon" v-html="sanitizeIcon(item.icon)"></span>
          <span class="cu-dropdown-menu-item-label">{{ item.label }}</span>
        </a>
        <button
          v-else
          type="button"
          :class="['cu-dropdown-menu-item', { 'cu-dropdown-menu-item--disabled': item.disabled }]"
          :role="isMenu ? 'menuitem' : undefined"
          :disabled="item.disabled"
          :tabindex="isMenu ? nav.itemTabindex(i) : undefined"
          @click="onItemClick(item)"
        >
          <span v-if="item.icon" class="cu-dropdown-menu-item-icon" v-html="sanitizeIcon(item.icon)"></span>
          <span class="cu-dropdown-menu-item-label">{{ item.label }}</span>
        </button>
      </template>
      <slot></slot>
    </template>
  </Popover>
</template>

<style scoped>
/* El wrapper: el motor (position/display) lo aporta .cu-popover. Acá solo
   ajustes específicos del dropdown sobre el panel del Popover. */

.cu-dropdown :deep(.cu-dropdown-panel--loading) {
  pointer-events: none;
}

/* Dropdown anidado: ocupa el ancho de la fila del menú padre y el panel en
   cascada es más angosto (auto) */
.cu-dropdown.cu-dropdown--nested {
  display: block;
  width: 100%;
  --cu-popover-width: auto;
  --cu-popover-min-width: 160px;
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
  color: var(--cu-color-neutral-text-muted);
  cursor: not-allowed;
}

.cu-dropdown-menu-item-label {
  text-align: left;
  white-space: nowrap;
}

.cu-dropdown-menu-item-chevron {
  flex-shrink: 0;
  color: var(--cu-color-neutral-text-muted);
}

.cu-dropdown-menu-item-icon {
  flex-shrink: 0;
  color: var(--cu-color-neutral-text-subtle);
}

.cu-dropdown-menu-divider {
  margin: var(--cu-space-2xs) 0;
  border: 0;
  border-top: var(--cu-border-thin) solid var(--cu-border-color);
}
</style>