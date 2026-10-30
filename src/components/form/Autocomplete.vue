<script setup lang="ts">
import { ref, computed, watch, defineModel, toRaw, type PropType } from 'vue';
import { isAlign, isColor, isFieldVariant, isPosition, isTextAlign } from '@/utils/validators'
import { textAlignStyle } from '@/utils/textAlign'
import Dropdown from "../overlay/Dropdown.vue";
import Input from "./Input.vue";
import MenuOption from "../controls/MenuOption.vue";
import { useSearch } from "@/composables/useSearch";

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
/** El `<input>` es un campo de texto nativo: acá sí alinea `text-align`. */
const inputStyle = computed(() => ({ width: "100%", textAlign: props.textAlign }));

const searchItems = computed(() => props.items);
const { filteredData: matches } = useSearch(searchItems, {
  searchQuery: searchValue,
  searchFields: ["label", "value"],
});
const filteredItems = computed(() => (filtering.value ? matches.value : searchItems.value));

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

function onFocus() {
  // El cierre del panel devuelve el foco al input (`Popover`); ese `focus` no
  // debe reabrir la lista, o Escape con el foco en una sugerencia no cerraría.
  if (props.disabled || ignoreFocusAfterClose) return;
  if (searchValue.value.length < props.minChars) return;
  if (filteredItems.value.length > 0) {
    dropdownRef.value?.open();
  }
}

/** Cierre del panel (Escape, click afuera): no reabrir por el foco restaurado. */
function onDropdownClose() {
  ignoreFocusAfterClose = true;
  queueMicrotask(() => {
    ignoreFocusAfterClose = false;
  });
}

function onInput(val: string) {
  searchValue.value = val;
  filtering.value = true;

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
  if (!rootRef.value?.contains(e.relatedTarget as Node)) {
    emit("blur");
  }
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
        @update:model-value="onInput"
        @focus="onFocus"
      />
    </template>
    <template #default>
      <div v-if="filteredItems.length > 0" class="cu-autocomplete-options">
        <MenuOption
          v-for="(item, i) in filteredItems"
          :key="i"
          :label="item.label"
          :icon="item.icon"
          icon-class="cu-autocomplete-icon"
          color="neutral"
          variant="ghost"
          :disabled="item.disabled"
          :selected="isSelected(item)"
          class="cu-autocomplete-option"
          :class="{ 'cu-autocomplete-option--disabled': item.disabled }"
          :style="itemStyle"
          @click="onItemClick(item)"
        />
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
  /* Estado deshabilitado por color (≥ 4.5:1), no por opacity: la fila es un
     Button deshabilitado (alpha-disabled 0.7) y la opacidad acumulada dejaba el
     texto en ~2:1. El color muted es el que se audita. */
  opacity: 1;
  color: var(--cu-color-neutral-text-muted);
  cursor: not-allowed;
}

.cu-autocomplete-icon {
  transform: translateY(2px);
  color: var(--cu-color-neutral-text-subtle);
}
</style>
