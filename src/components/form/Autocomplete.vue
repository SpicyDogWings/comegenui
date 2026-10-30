<script setup lang="ts">
import { ref, computed, watch, nextTick, defineModel, toRaw, type PropType } from 'vue';
import { isAlign, isColor, isFieldVariant, isPosition, isTextAlign } from '@/utils/validators'
import { textAlignStyle } from '@/utils/textAlign'
import Dropdown from "../overlay/Dropdown.vue";
import Input from "./Input.vue";
import MenuOption from "../controls/MenuOption.vue";
import { useSearch } from "@/composables/useSearch";
import { useUniqueId } from "@/utils/uniqueId";

interface AutocompleteItem {
  label: string;
  icon?: string;
  value?: string;
  disabled?: boolean;
}

const props = defineProps({
  color: {
    type: String as PropType<'primary' | 'secondary' | 'neutral' | 'success' | 'warning' | 'danger'>,
    required: false,
    default: "neutral",
    validator: isColor,
  },
  disabled: { type: Boolean, required: false, default: false },
  readOnly: { type: Boolean, required: false, default: false },
  placeholder: { type: String, required: false, default: "" },
  variant: {
    type: String as PropType<'outlined' | 'soft' | 'ghost' | 'subtle'>,
    required: false,
    default: "soft",
    validator: isFieldVariant,
  },
  type: { type: String, required: false, default: "text" },
  /** Muestra el spinner de carga en el panel de sugerencias. */
  loading: { type: Boolean, required: false, default: false },
  minChars: { type: Number, required: false, default: 0 },
  items: { type: Array as () => AutocompleteItem[], required: false, default: () => [] },
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
  fixed: { type: Boolean, required: false, default: false },
  /**
   * Alineación del texto: el input (texto y placeholder) y los items del panel.
   * `left` (default), `center`, `right`.
   */
  textAlign: {
    type: String as PropType<'left' | 'center' | 'right'>,
    required: false,
    default: "left",
    validator: isTextAlign,
  },
});

const emit = defineEmits(["select", "blur"]);
/** Valor del texto de búsqueda (v-model). */
const searchValue = defineModel<string>({ default: "" });

/** Evita que el `focus` restaurado al cerrar el panel reabra la lista. */
let ignoreFocusAfterClose = false;

const dropdownRef = ref<InstanceType<typeof Dropdown> | null>(null);
const inputRef = ref<InstanceType<typeof Input> | null>(null);
const rootRef = ref<HTMLElement | null>(null);
const selectedItem = ref<AutocompleteItem | null>(null);
/**
 * `false` tras seleccionar: la lista ignora el texto y muestra todos los items (con el
 * elegido checkeado). Al volver a escribir se reactiva y filtra con la cadena actual.
 */
const filtering = ref(true);

/** Los items son filas flex: la alineación va por `justify-content`, no por `text-align`. */
const itemStyle = computed(() => textAlignStyle(props.textAlign));
/**
 * Look del item deshabilitado. Va inline porque la fila es un `Button` cuya variante
 * (`ghost`, scoped) declara `color` y la clase `--disabled` declara `opacity`: con la
 * misma especificidad ganaba el `Button` y el item se veía igual que uno habilitado.
 * `opacity: 1` evita apilar la atenuación del `Button` sobre el color muted (dejaba el
 * texto por debajo de 4.5:1).
 */
const disabledItemStyle = computed(() => ({
  ...itemStyle.value,
  color: "var(--cu-color-neutral-text-muted)",
  opacity: "1",
}));
/** El `<input>` es un campo de texto nativo: acá sí alinea `text-align`. */
const inputStyle = computed(() => ({ width: "100%", textAlign: props.textAlign }));

// `items` puede llegar como `null` desde el consumidor (Vue no avisa: `null` pasa el
// chequeo de tipo): sin la guarda, `filteredItems.length` rompe el render del campo.
const searchItems = computed(() => props.items ?? []);
const { filteredData: matches } = useSearch(searchItems, {
  searchQuery: searchValue,
  searchFields: ["label", "value"],
});
const filteredItems = computed(() => (filtering.value ? matches.value : searchItems.value));

// Patrón combobox + listbox: el foco queda en el input y el item activo se anuncia con
// `aria-activedescendant`. Los ids salen de `useId` para que dos campos montados a la
// vez no compartan listbox/opciones.
// `useUniqueId` cubre el caso de varios custom elements (cada uno con su propia app).
const uid = useUniqueId("cu-autocomplete");
const listboxId = `${uid}-listbox`;
const optionId = (index: number) => `${uid}-option-${index}`;
/** Item activo por teclado (`aria-activedescendant` y `Enter`). `-1` = ninguno. */
const activeIndex = ref(-1);

const isOpen = computed(() => dropdownRef.value?.isOpen() ?? false);
const activeDescendant = computed(() =>
  isOpen.value && activeIndex.value >= 0 ? optionId(activeIndex.value) : undefined,
);

/** Mueve el item activo `step` posiciones, salteando deshabilitados y con wrap. */
function moveActive(step: number) {
  const items = filteredItems.value;
  if (items.length === 0) return;
  let index = activeIndex.value;
  for (let i = 0; i < items.length; i++) {
    index = (index + step + items.length) % items.length;
    if (!items[index]!.disabled) break;
  }
  activeIndex.value = items[index]?.disabled ? activeIndex.value : index;
  scrollToActive();
}

/** Primer/último item habilitado (Home/End y apertura con flechas). */
function firstEnabled(fromEnd = false) {
  const items = filteredItems.value;
  const order = fromEnd ? [...items.keys()].reverse() : [...items.keys()];
  return order.find((i) => !items[i]!.disabled) ?? -1;
}

/** Deja visible el item activo dentro del panel con scroll. */
function scrollToActive() {
  const index = activeIndex.value;
  if (index < 0) return;
  nextTick(() => {
    const optionsEl = rootRef.value?.querySelector(".cu-autocomplete-options");
    const optionEl = optionsEl?.children[index] as HTMLElement | undefined;
    if (optionEl) optionEl.scrollIntoView({ block: "nearest" });
  });
}

function onKeyDown(e: KeyboardEvent) {
  if (props.disabled) return;

  if (e.key === "ArrowDown" || e.key === "ArrowUp") {
    e.preventDefault();
    if (!isOpen.value) {
      if (!canShowList()) return;
      activeIndex.value = firstEnabled(e.key === "ArrowUp");
      dropdownRef.value?.open();
      scrollToActive();
      return;
    }
    if (activeIndex.value < 0) {
      activeIndex.value = firstEnabled(e.key === "ArrowUp");
      scrollToActive();
      return;
    }
    moveActive(e.key === "ArrowDown" ? 1 : -1);
    return;
  }

  if (e.key === "Home" || e.key === "End") {
    if (!isOpen.value) return;
    e.preventDefault();
    activeIndex.value = firstEnabled(e.key === "End");
    scrollToActive();
    return;
  }

  if (e.key === "Enter") {
    const item = isOpen.value ? filteredItems.value[activeIndex.value] : undefined;
    if (item && !item.disabled) {
      // Sin esto, Enter elegiría el item **y** enviaría el formulario.
      e.preventDefault();
      onItemClick(item);
    }
    return;
  }

  if (e.key === "Escape") {
    if (isOpen.value) {
      activeIndex.value = -1;
      // Cerrar acá evita que el navegador interprete el Escape como "cancelar"
      // (por ejemplo, restore del valor en un `<input>`).
      e.preventDefault();
      dropdownRef.value?.close();
    }
  }
}


/** Texto que el item escribe en el input (y que define si sigue siendo el seleccionado). */
function itemText(item: AutocompleteItem) {
  return item.label || item.value || "";
}

/** La selección vive mientras el texto del input sea el del item elegido. */
function syncSelectionWithText(val: string) {
  if (selectedItem.value && val !== itemText(selectedItem.value)) {
    selectedItem.value = null;
  }
}

/**
 * Identidad del item seleccionado. `selectedItem` guarda el proxy del `ref`, mientras
 * los items pueden llegar crudos (propiedad JS del custom element): comparar los
 * proxies directamente da false y el check no aparece. `toRaw` normaliza ambos lados.
 */
function isSelected(item: AutocompleteItem) {
  const sel = selectedItem.value;
  return !!sel && toRaw(sel) === toRaw(item);
}

// Cubre también un `modelValue` externo (v-model), que no pasa por `onInput`.
watch(searchValue, (val) => syncSelectionWithText(val));

/**
 * Los items pueden reemplazarse con objetos nuevos (carga async). La selección se
 * re-resuelve por texto —la misma regla que `syncSelectionWithText`, "sigue mientras el
 * input diga lo mismo"— para que el check y `selectedItem()` apunten al item vigente en
 * vez de quedar colgados del array anterior.
 */
watch(
  () => props.items,
  (items) => {
    const sel = selectedItem.value;
    if (!sel) return;
    const text = itemText(sel);
    selectedItem.value = (items ?? []).find((item) => itemText(item) === text) ?? null;
  },
);

/** El panel solo tiene sentido con items para mostrar y el texto sobre `minChars`. */
function canShowList() {
  return (
    !props.disabled &&
    searchValue.value.length >= props.minChars &&
    filteredItems.value.length > 0
  );
}

function onFocus() {
  // El cierre del panel devuelve el foco al input (`Popover`); ese `focus` no
  // debe reabrir la lista, o Escape con el foco en una sugerencia no cerraría.
  if (ignoreFocusAfterClose) return;
  if (canShowList()) {
    dropdownRef.value?.open();
  }
}

/**
 * Click en el campo: reabre la lista. El cierre por click afuera devuelve el foco al
 * input, así que un segundo click no dispara `focus` y la lista quedaba inalcanzable
 * sin salir y volver a entrar al campo.
 */
function onClick() {
  if (dropdownRef.value?.isOpen()) return;
  if (canShowList()) {
    dropdownRef.value?.open();
  }
}

/** Cierre del panel (Escape, click afuera): no reabrir por el foco restaurado. */
function onDropdownClose() {
  activeIndex.value = -1;
  ignoreFocusAfterClose = true;
  queueMicrotask(() => {
    ignoreFocusAfterClose = false;
  });
}

function onInput(val: string) {
  searchValue.value = val;
  filtering.value = true;
  // Filtro nuevo, navegación nueva: el activo vuelve a "ninguno".
  activeIndex.value = -1;

  if (val.length < props.minChars || filteredItems.value.length === 0) {
    dropdownRef.value?.close();
    return;
  }

  dropdownRef.value?.open();
}

function onItemClick(item: AutocompleteItem) {
  if (item.disabled) return;
  searchValue.value = itemText(item);
  selectedItem.value = item;
  // El panel queda abierto: se resetea el filtrado para mostrar todos los items con
  // el elegido checkeado. Escribir de nuevo reactiva el filtro (`onInput`).
  filtering.value = false;
  emit("select", item);
}

function onFocusOut(e: FocusEvent) {
  const next = e.relatedTarget as Node | null;
  if (rootRef.value?.contains(next as Node)) return;
  // El foco se fue del campo (Tab, foco programático): el panel flotante no puede
  // quedar abierto tapando el resto de la página. `Popover` solo cierra con Escape o
  // click afuera, así que el cierre por salida del foco es del componente. Se cierra en
  // la tarea siguiente: durante el `focusout` el foco todavía no terminó de moverse
  // (`document.activeElement` sigue siendo el host) y el `restoreFocus` de `Popover`
  // lo leería como "perdido" y se tragaría el Tab.
  if (dropdownRef.value?.isOpen()) setTimeout(() => dropdownRef.value?.close(), 0);
  emit("blur");
}

/** Devuelve el texto actual. */
function get() { return searchValue.value; }
/** Setea el texto actual en el input sin abrir el panel (para ver sugerencias usá `open()`). */
function set(val: string) {
  searchValue.value = val;
  filtering.value = true;
}
/** Limpia el texto de búsqueda y la selección. */
function reset() {
  searchValue.value = "";
  selectedItem.value = null;
  filtering.value = true;
}
/** Enfoca el input. */
function focus() { inputRef.value?.focus(); }
/** Abre el panel de sugerencias (ignora `minChars`). */
function open() { dropdownRef.value?.open(); }
/** Cierra el panel de sugerencias. */
function close() { dropdownRef.value?.close(); }
/** Alterna la visibilidad del panel de sugerencias. */
function toggle() { dropdownRef.value?.toggle(); }

defineExpose({
  get, set, reset, focus, open, close, toggle,
  /** Indica si el panel está abierto. */
  isOpen: () => dropdownRef.value?.isOpen() ?? false,
  /** Devuelve el item seleccionado o null. */
  selectedItem: () => selectedItem.value,
});
</script>

<template>
  <div ref="rootRef" tabindex="-1" @focusout="onFocusOut">
    <Dropdown
    ref="dropdownRef"
    :color="color"
    :disabled="disabled"
    :position="position"
    :align="align"
    :fixed="fixed"
    :loading="loading"
    :offset="4"
    panel-role="listbox"
    :panel-id="listboxId"
    style="width:100%"
    @close="onDropdownClose"
  >
    <template #toggle>
      <Input
        ref="inputRef"
        :model-value="searchValue"
        :placeholder="placeholder"
        :disabled="disabled"
        :read-only="readOnly"
        :color="color"
        :variant="variant"
        :type="type"
        :style="inputStyle"
        role="combobox"
        aria-autocomplete="list"
        aria-haspopup="listbox"
        :aria-expanded="isOpen ? 'true' : 'false'"
        :aria-controls="listboxId"
        :aria-activedescendant="activeDescendant"
        @update:model-value="onInput"
        @focus="onFocus"
        @click="onClick"
        @keydown="onKeyDown"
      />
    </template>
    <template #default>
      <div v-if="filteredItems.length > 0" class="cu-autocomplete-options" tabindex="-1">
        <MenuOption
          v-for="(item, i) in filteredItems"
          :key="i"
          :id="optionId(i)"
          role="option"
          tabindex="-1"
          :aria-selected="isSelected(item) ? 'true' : 'false'"
          :label="item.label"
          :icon="item.icon"
          icon-class="cu-autocomplete-icon"
          color="neutral"
          variant="ghost"
          :disabled="item.disabled"
          :selected="isSelected(item)"
          :class="[
            'cu-autocomplete-option',
            {
              'cu-autocomplete-option--disabled': item.disabled,
              'cu-autocomplete-option--active': i === activeIndex,
            },
          ]"
          :style="item.disabled ? disabledItemStyle : itemStyle"
          @mousedown.prevent
          @click="onItemClick(item)"
        />
      </div>
      <div v-else class="cu-autocomplete-empty">
        Sin opciones
      </div>
    </template>
    </Dropdown>
  </div>
</template>

<style scoped>
.cu-autocomplete {
  width: 100%;
  outline: none;
}

.cu-autocomplete-options {
  max-height: 240px;
  overflow-y: auto;
}

.cu-autocomplete-option {
  width: 100%;
  /* La alineación la pone `textAlign` inline (`justify-content`): dentro de un `Button`
     flex el `text-align` solo no mueve nada. Default: `flex-start`. */
}

.cu-autocomplete-option--disabled {
  /* El color muted y la opacidad 1 van inline (`disabledItemStyle`): la fila es un
     `Button` y sus reglas scoped le ganaban a esta clase. Acá queda solo el cursor. */
  cursor: not-allowed;
}

/* Item activo (el que anuncia `aria-activedescendant`): el foco queda en el input, así
   que el resaltado es la única señal visual de dónde está parada la navegación. */
.cu-autocomplete-option--active:not(.cu-autocomplete-option--disabled) {
  background-color: var(--cu-color-neutral-ghost-hover);
}

.cu-autocomplete-empty {
  padding: var(--cu-space-md);
  font-family: var(--cu-font-sans);
  font-size: var(--cu-font-size-sm);
  color: var(--cu-color-neutral-text-subtle);
  text-align: center;
}

.cu-autocomplete-icon {
  transform: translateY(2px);
  color: var(--cu-color-neutral-text-subtle);
}
</style>
