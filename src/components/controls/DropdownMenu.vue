<script setup lang="ts">
import { ref, computed, watch, nextTick, onMounted, onUnmounted, type PropType } from 'vue';
import { isAlign, isColor, isPosition, isTextAlign, isVariantFull } from '@/utils/validators'
import { textAlignStyle } from '@/utils/textAlign'
import { useUniqueId } from '@/utils/uniqueId'
import Dropdown from "../overlay/Dropdown.vue";
import Button from "../buttons/Button.vue";
import MenuOption from "./MenuOption.vue";

interface DropdownItem {
  label?: string;
  icon?: string;
  href?: string;
  onClick?: () => void;
  color?: string;
  variant?: string;
  disabled?: boolean;
  divider?: boolean;
  target?: string;
  /** Muestra el check de lucide al final del item (estado de selección). */
  selected?: boolean;
}

const props = defineProps({
  color: {
    type: String as PropType<'primary' | 'secondary' | 'neutral' | 'success' | 'warning' | 'danger'>,
    required: false,
    default: "neutral",
    validator: isColor,
  },
  variant: {
    type: String as PropType<'solid' | 'outlined' | 'soft' | 'ghost' | 'subtle' | 'link' | 'none'>,
    required: false,
    default: "ghost",
    validator: isVariantFull,
  },
  disabled: { type: Boolean, required: false, default: false },
  label: { type: String, required: false, default: "" },
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
  /** Alineación del texto de los items del panel: `left` (default), `center`, `right`. */
  textAlign: {
    type: String as PropType<'left' | 'center' | 'right'>,
    required: false,
    default: "left",
    validator: isTextAlign,
  },
  offset: { type: Number, required: false, default: 4 },
  fixed: { type: Boolean, required: false, default: false },
  items: { type: Array as () => DropdownItem[], required: false, default: () => [] },
});

const emit = defineEmits(["open", "close"]);
const dropdownRef = ref<InstanceType<typeof Dropdown> | null>(null);

// Un `position`/`align`/`textAlign` fuera del set no tiene rama en el panel: quedaba
// posicionado en el flujo (ni abajo ni arriba) en vez de en el borde del trigger. Los
// validadores sólo avisan, así que el componente cae al default documentado.
const safePosition = computed(() => (isPosition(props.position) ? props.position : "bottom"));
const safeAlign = computed(() => (isAlign(props.align) ? props.align : "start"));
const safeTextAlign = computed(() => (isTextAlign(props.textAlign) ? props.textAlign : "left"));

const itemStyle = computed(() => textAlignStyle(safeTextAlign.value));

// `items` puede llegar de datos (una API, un JSON): una entrada nula o que no sea
// objeto rompía el render entero (el menú desaparecía, trigger incluido). Se
// descartan las entradas inválidas en vez de romper el componente.
const menuItems = computed<DropdownItem[]>(() =>
  (Array.isArray(props.items) ? props.items : []).filter(
    (item): item is DropdownItem => !!item && typeof item === "object",
  ),
);

// Patrón menu button: el panel es `role="menu"` (lo pone `Dropdown`), el trigger lo
// referencia con `aria-controls` y las filas son `menuitem`. El id es único por
// instancia: `useId` de Vue se repite entre custom elements (cada uno monta su app).
const uid = useUniqueId("cu-dropdown-menu");
const panelId = `${uid}-menu`;
const isOpen = computed(() => dropdownRef.value?.isOpen() ?? false);

const toggleAria = computed(() => ({
  'aria-haspopup': 'menu',
  'aria-expanded': isOpen.value ? 'true' : 'false',
  'aria-controls': panelId,
}));

function handleItemClick(item: DropdownItem) {
  if (item.disabled || item.divider) return;
  if (item.onClick) item.onClick();
  dropdownRef.value?.close();
}

// ── Teclado del menú ──
// Con `role="menu"` el teclado es parte del contrato: flechas/Home/End recorren las
// filas, las letras buscan por label (typeahead), Tab sale del menú (y lo cierra) y
// Escape lo cierra devolviendo el foco al trigger (eso último lo hace `Popover`).
// La parada de tabulación es el trigger; dentro del panel se usa roving tabindex
// (una sola fila con `tabindex="0"`, la enfocada).

/** Raíz del popover: contiene el trigger y el panel (el `$el` de `Dropdown`). */
function rootEl(): HTMLElement | null {
  return (dropdownRef.value?.$el as HTMLElement | null) ?? null;
}

function panelEl(): HTMLElement | null {
  return (rootEl()?.querySelector(".cu-popover-panel") as HTMLElement | null) ?? null;
}

/** Filas elegibles por teclado: sin deshabilitar (botón nativo o link con guarda). */
function enabledRows(): HTMLElement[] {
  const panel = panelEl();
  if (!panel) return [];
  return Array.from(panel.querySelectorAll<HTMLElement>(".cu-dropdown-item")).filter(
    (row) => !row.hasAttribute("disabled") && row.getAttribute("aria-disabled") !== "true",
  );
}

/**
 * Índice (dentro de `menuItems`) de cada fila elegible, en el mismo orden que el DOM.
 * Es lo que permite el roving tabindex sin depender del slot: la fila activa es la
 * única con `tabindex="0"`, así Tab entra al menú y sale de él en la posición correcta.
 */
const enabledItemIndices = computed(() =>
  menuItems.value
    .map((item, index) => ({ item, index }))
    .filter(({ item }) => !item.divider && !item.disabled)
    .map(({ index }) => index),
);

/** Fila activa: índice dentro de las filas elegibles. */
const activeRow = ref(0);
const effectiveActiveRow = computed(() =>
  Math.min(activeRow.value, Math.max(0, enabledItemIndices.value.length - 1)),
);

function itemTabindex(index: number): number {
  const position = enabledItemIndices.value.indexOf(index);
  return position >= 0 && position === effectiveActiveRow.value ? 0 : -1;
}

function focusRow(rows: HTMLElement[], index: number) {
  const position = (index + rows.length) % rows.length;
  const row = rows[position];
  if (!row) return;
  activeRow.value = position;
  row.focus();
  row.scrollIntoView?.({ block: "nearest" });
}

/** Texto comparable del typeahead (sin acentos ni mayúsculas). */
function foldText(value: string): string {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\s+/g, " ")
    .trim()
    .toLowerCase();
}

let typeahead = "";
let typeaheadTimer: ReturnType<typeof setTimeout> | null = null;

function clearTypeahead() {
  typeahead = "";
  if (typeaheadTimer) {
    clearTimeout(typeaheadTimer);
    typeaheadTimer = null;
  }
}

function searchByPrefix(char: string, rows: HTMLElement[], from: number) {
  typeahead += foldText(char);
  if (typeaheadTimer) clearTimeout(typeaheadTimer);
  typeaheadTimer = setTimeout(clearTypeahead, 500);

  const start = from >= 0 ? from : 0;
  for (let step = 1; step <= rows.length; step++) {
    const index = (start + step) % rows.length;
    if (foldText(rows[index]!.textContent ?? "").startsWith(typeahead)) {
      focusRow(rows, index);
      return;
    }
  }
}

function onMenuKeydown(e: KeyboardEvent) {
  if (!isOpen.value || e.altKey || e.ctrlKey || e.metaKey) return;
  const panel = panelEl();
  const target = e.target as HTMLElement | null;
  if (!panel || !target || !panel.contains(target)) return;
  // Un dropdown anidado en el panel trae su propio handler: si la tecla nace en el
  // submenú, el menú padre no vuelve a mover el foco (dos saltos por flecha).
  if (target.closest(".cu-dropdown") !== rootEl()) return;

  const rows = enabledRows();
  if (rows.length === 0) return;
  const current = rows.indexOf(target.closest(".cu-dropdown-item") as HTMLElement);

  if (e.key === "ArrowDown") {
    e.preventDefault();
    focusRow(rows, current < 0 ? 0 : current + 1);
    return;
  }
  if (e.key === "ArrowUp") {
    e.preventDefault();
    focusRow(rows, current < 0 ? rows.length - 1 : current - 1);
    return;
  }
  if (e.key === "Home") {
    e.preventDefault();
    focusRow(rows, 0);
    return;
  }
  if (e.key === "End") {
    e.preventDefault();
    focusRow(rows, rows.length - 1);
    return;
  }
  if (e.key === "Tab") {
    // El foco sigue su camino (la fila activa es la única con tabindex 0) y el menú se
    // cierra en `focusout`, cuando el foco ya salió: así `restoreFocus` no lo roba.
    tabLeaving = true;
    return;
  }
  if (e.key === " ") {
    // Un link no se activa con Espacio (el navegador scrollea): se replica el click.
    const row = target.closest(".cu-dropdown-item") as HTMLElement | null;
    if (row && row.tagName === "A") {
      e.preventDefault();
      row.click();
    }
    return;
  }
  if (e.key.length === 1) {
    e.preventDefault();
    searchByPrefix(e.key, rows, current);
  }
}

// Tab tiene que cerrar el menú, pero el cierre se decide cuando el foco ya se movió:
// cerrar en el `keydown` hacía que `Popover.restoreFocus` devolviera el foco al trigger
// y se tragara el Tab.
let tabLeaving = false;

/** Un gesto de puntero no es Tab: descarta el cierre pendiente por foco. */
function onRootPointerDown() {
  tabLeaving = false;
}

function onRootFocusOut(e: FocusEvent) {
  if (!tabLeaving || !isOpen.value) return;
  tabLeaving = false;
  const next = e.relatedTarget as Node | null;
  if (next && rootEl()?.contains(next)) return;
  setTimeout(() => {
    if (dropdownRef.value?.isOpen()) dropdownRef.value?.close();
  }, 0);
}

// Abrir con el teclado deja el foco en la primera/última fila (patrón menu button).
// Abrir por click o por API no mueve el foco: el usuario está en el trigger o en otro lado.
let openIntent: "first" | "last" | null = null;

function onToggleKeydown(e: KeyboardEvent) {
  if (props.disabled) return;
  const isArrow = e.key === "ArrowDown" || e.key === "ArrowUp";
  if (isOpen.value) {
    if (!isArrow) return;
    e.preventDefault();
    const rows = enabledRows();
    if (rows.length > 0) focusRow(rows, e.key === "ArrowUp" ? rows.length - 1 : 0);
    return;
  }
  if (!isArrow && e.key !== "Enter" && e.key !== " ") return;
  openIntent = e.key === "ArrowUp" ? "last" : "first";
  if (isArrow) {
    e.preventDefault();
    dropdownRef.value?.open();
  }
}

watch(isOpen, async (open) => {
  if (!open) {
    openIntent = null;
    tabLeaving = false;
    clearTypeahead();
    return;
  }
  const intent = openIntent;
  openIntent = null;
  await nextTick();
  const rows = enabledRows();
  if (rows.length === 0) return;
  if (intent) focusRow(rows, intent === "last" ? rows.length - 1 : 0);
  else activeRow.value = 0;
});

/**
 * El roving tabindex sigue al foco real (click o teclado): la fila enfocada es la
 * que queda como parada de tabulación del menú.
 */
function onRootFocusIn(e: FocusEvent) {
  const target = e.target as HTMLElement | null;
  const row = target?.closest?.(".cu-dropdown-item") as HTMLElement | null;
  if (!row) return;
  const position = enabledRows().indexOf(row);
  if (position >= 0) activeRow.value = position;
}

let menuRoot: HTMLElement | null = null;
onMounted(() => {
  menuRoot = rootEl();
  menuRoot?.addEventListener("keydown", onMenuKeydown);
  menuRoot?.addEventListener("focusout", onRootFocusOut);
  menuRoot?.addEventListener("focusin", onRootFocusIn);
  menuRoot?.addEventListener("pointerdown", onRootPointerDown);
});
onUnmounted(() => {
  menuRoot?.removeEventListener("keydown", onMenuKeydown);
  menuRoot?.removeEventListener("focusout", onRootFocusOut);
  menuRoot?.removeEventListener("focusin", onRootFocusIn);
  menuRoot?.removeEventListener("pointerdown", onRootPointerDown);
  menuRoot = null;
  clearTypeahead();
});

defineExpose({
  /** Abre el menú. */
  open: () => dropdownRef.value?.open(),
  /** Cierra el menú. */
  close: () => dropdownRef.value?.close(),
  /** Alterna la visibilidad del menú. */
  toggle: () => dropdownRef.value?.toggle(),
  /** Devuelve true si el menú está abierto. */
  isOpen: () => dropdownRef.value?.isOpen() ?? false,
});
</script>

<template>
  <Dropdown
    ref="dropdownRef"
    :color="color"
    :variant="variant"
    :disabled="disabled"
    :label="label"
    :position="safePosition"
    :align="safeAlign"
    :offset="offset"
    :fixed="fixed"
    :panel-id="panelId"
    @open="emit('open')"
    @close="emit('close')"
  >
    <template #toggle="{ toggle, isOpen }">
      <!-- Contenido del trigger; scoped: { toggle, isOpen, aria }. -->
      <slot name="toggle" :toggle="toggle" :isOpen="isOpen" :aria="toggleAria">
        <Button
          :color="color"
          :variant="variant"
          :disabled="disabled"
          v-bind="toggleAria"
          class="cu-dropdown-toggle"
          @click="toggle"
          @keydown="onToggleKeydown"
        >
          {{ label || "Menú" }}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            class="cu-dropdown-chevron"
            :class="{ 'cu-dropdown-chevron--open': isOpen }"
            aria-hidden="true"
            focusable="false"
          >
            <path d="m18 15-6-6-6 6"/>
          </svg>
        </Button>
      </slot>
    </template>
    <template #default>
      <template v-if="menuItems.length > 0">
        <template v-for="(item, i) in menuItems" :key="i">
          <hr v-if="item.divider" class="cu-dropdown-divider" />
          <MenuOption
            v-else
            :label="item.label"
            :icon="item.icon"
            icon-class="cu-dropdown-icon"
            :color="item.color || color"
            :variant="item.variant || 'ghost'"
            :href="item.href"
            :target="item.target"
            :disabled="item.disabled"
            :selected="!!item.selected"
            :role="item.selected ? 'menuitemcheckbox' : 'menuitem'"
            :aria-checked="item.selected ? 'true' : undefined"
            :tabindex="itemTabindex(i)"
            class="cu-dropdown-item"
            :style="itemStyle"
            @click="handleItemClick(item)"
          />
        </template>
      </template>
      <!-- Contenido del panel. -->
      <slot v-else></slot>
    </template>
  </Dropdown>
</template>

<style scoped>
.cu-dropdown-toggle {
  gap: var(--cu-space-md);
}

.cu-dropdown-divider {
  margin: var(--cu-space-xs) auto;
  width: 90%;
  border: 0;
  border-top: var(--cu-border-thin) solid var(--cu-border-color);
}

.cu-dropdown-item {
  width: 100%;
  /* La alineación del contenido la pone `textAlign` inline (`justify-content`): un
     `text-align` solo no mueve nada dentro de un `Button` flex. Default: `flex-start`. */
}

/* Item deshabilitado: la fila es un Button deshabilitado (alpha-disabled 0.7) y esa
   opacidad deja el texto por debajo de 4.5:1 en varios temas (nord-snow-storm,
   catppuccin-latte…). Se reemplaza por el color atenuado medido. */
.cu-dropdown-item.cu-button--disabled {
  opacity: 1;
  color: var(--cu-color-neutral-text-muted);
}

.cu-dropdown-icon {
  transform: translateY(2px);
  color: var(--cu-color-neutral-text-subtle);
}

.cu-dropdown-chevron {
  transition: transform 200ms ease;
}

.cu-dropdown-chevron--open {
  transform: rotate(90deg);
}
</style>
