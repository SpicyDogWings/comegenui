<script setup lang="ts">
import { ref, computed, watch, nextTick, onUnmounted, type PropType } from 'vue';
import { isColor, isFieldVariant, isSelectSearchMode, isTextAlign } from '@/utils/validators'
import { textAlignStyle } from '@/utils/textAlign'
import Dropdown from "../overlay/Dropdown.vue";
import Button from "../buttons/Button.vue";
import MenuOption from "../controls/MenuOption.vue";
import { matchesQuery } from "@/utils/search";

interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
  color?: string;
  variant?: string;
}

const props = defineProps({
  color: {
    type: String as PropType<'primary' | 'secondary' | 'neutral' | 'success' | 'warning' | 'danger'>,
    required: false,
    default: "neutral",
    validator: isColor,
  },
  variant: {
    type: String as PropType<'outlined' | 'soft' | 'ghost' | 'subtle'>,
    required: false,
    default: "soft",
    validator: isFieldVariant,
  },
  disabled: { type: Boolean, required: false, default: false },
  /** No abre el dropdown ni cambia la selección; el control sigue enfocable. */
  readOnly: { type: Boolean, required: false, default: false },
  placeholder: { type: String, required: false, default: "" },
  placeholderWrap: { type: Boolean, required: false, default: false },
  position: { type: String, required: false, default: "bottom" },
  align: { type: String, required: false, default: "start" },
  /**
   * Alineación del texto: el label del trigger (placeholder o selección) y las opciones del
   * panel. `left` (default), `center`, `right`.
   */
  textAlign: {
    type: String as PropType<'left' | 'center' | 'right'>,
    required: false,
    default: "left",
    validator: isTextAlign,
  },
  fixed: { type: Boolean, required: false, default: false },
  modelValue: { type: String, required: false, default: "" },
  options: { type: Array as () => SelectOption[], required: false, default: () => [] },
  searchEnabled: { type: Boolean, required: false, default: false },
  searchMode: {
    type: String as PropType<'startsWith' | 'includes'>,
    required: false,
    default: "startsWith",
    validator: isSelectSearchMode,
  },
  searchResetDelay: { type: Number, required: false, default: 1000 },
  loading: { type: Boolean, required: false, default: false },
  cooldownVariant: { type: String, required: false, default: "ghost-hover" },
});

const emit = defineEmits(["update:modelValue", "select", "change", "close", "blur"]);
/** `options` puede llegar como `null` (Vue no avisa): sin guarda, `.find`/`v-for` rompen. */
const optionsList = computed(() => props.options ?? []);
const selectedValue = ref(props.modelValue);
const dropdownRef = ref<InstanceType<typeof Dropdown> | null>(null);
const selectRoot = ref<HTMLElement | null>(null);
const nativeInputRef = ref<HTMLInputElement | null>(null);
const searchText = ref("");
const cooldownActive = ref(false);
const cooldownKey = ref(0);
let resetTimeout: ReturnType<typeof setTimeout> | null = null;

const matchIndex = computed(() => {
  const q = searchText.value;
  if (!q) return -1;
  return optionsList.value.findIndex(o =>
    !o.disabled && matchesQuery(o.label, q, { mode: props.searchMode }),
  );
});

/** Búsqueda por teclado a cero: sin texto acumulado, sin barra de cooldown colgada. */
function clearSearch() {
  if (resetTimeout) {
    clearTimeout(resetTimeout);
    resetTimeout = null;
  }
  searchText.value = "";
  cooldownActive.value = false;
}

function scheduleReset() {
  if (resetTimeout) clearTimeout(resetTimeout);
  cooldownActive.value = true;
  resetTimeout = setTimeout(() => {
    resetTimeout = null;
    searchText.value = "";
    cooldownActive.value = false;
  }, props.searchResetDelay);
}

function onKeyDown(e: KeyboardEvent) {
  if (props.readOnly || !props.searchEnabled) return;
  if (e.key === "Escape" || e.key === "Tab") return;

  if (e.key.length === 1 && !e.ctrlKey && !e.metaKey) {
    e.preventDefault();
    searchText.value += e.key;
    cooldownKey.value++;
    scheduleReset();
    if (matchIndex.value >= 0) {
      nextTick(() => scrollToMatch(matchIndex.value));
    }
  } else if (e.key === "Backspace") {
    e.preventDefault();
    searchText.value = searchText.value.slice(0, -1);
    cooldownKey.value++;
    scheduleReset();
  }
}

function scrollToMatch(index: number) {
  const optionsEl = selectRoot.value?.querySelector(".cu-select-options");
  if (!optionsEl) return;
  const optionEl = optionsEl.children[index] as HTMLElement | undefined;
  if (optionEl) optionEl.scrollIntoView({ block: "nearest" });
}

function onDropdownOpen() {
  if (props.searchEnabled) {
    // Cada apertura arranca la búsqueda de cero: si el panel se cerró a mitad del
    // cooldown, el texto acumulado y la barra no deben reaparecer al reabrir.
    clearSearch();
    nextTick(() => {
      const input = nativeInputRef.value;
      if (input) {
        input.addEventListener("keydown", onKeyDown);
        input.focus();
      }
    });
  }
}

function onDropdownClose() {
  const input = nativeInputRef.value;
  if (input) {
    input.removeEventListener("keydown", onKeyDown);
  }
  // Cerrar el panel corta la búsqueda: el timer del cooldown no sigue corriendo
  // fuera de vista ni deja texto viejo para la próxima apertura.
  clearSearch();
}

watch(() => dropdownRef.value?.isOpen(), (open) => {
  if (open) onDropdownOpen();
  else onDropdownClose();
});

// Si readOnly se activa con el panel abierto, lo cerramos.
watch(() => props.readOnly, (value) => {
  if (value) dropdownRef.value?.close();
});

const selectedLabel = computed(() => {
  const opt = optionsList.value.find(o => o.value === selectedValue.value);
  return opt ? opt.label : props.placeholder || "Seleccionar...";
});

watch(() => props.modelValue, (val) => {
  selectedValue.value = val;
}, { immediate: true });

function onSelect(option: SelectOption) {
  if (props.readOnly || option.disabled) return;
  selectedValue.value = option.value;
  emit("update:modelValue", option.value);
  emit("select", option);
  emit("change", option.value);
  dropdownRef.value?.close();
}

const optionStyle = computed(() => textAlignStyle(props.textAlign));
/**
 * Look de la opción deshabilitada. Va inline porque la fila es un `Button`: su variante
 * (`ghost`/`soft`, scoped) declara `color` y `--disabled` declara `opacity`, y con la
 * misma especificidad le ganaban a la clase del padre. `opacity: 1` evita apilar la
 * atenuación del `Button` sobre el color muted (dejaba el texto bajo 4.5:1).
 */
const disabledOptionStyle = computed(() => ({
  ...optionStyle.value,
  color: "var(--cu-color-neutral-text-muted)",
  opacity: "1",
}));
/** El label del trigger alinea su texto dentro del espacio que deja el chevron. */
const labelStyle = computed(() => ({ textAlign: props.textAlign }));

/** Devuelve el valor seleccionado. */
function get() { return selectedValue.value; }
/** Setea el valor seleccionado y emite `change`. */
function set(value: string) { selectedValue.value = value; emit("change", value); }
/** Limpia la selección y emite `change`. */
function reset() { selectedValue.value = ""; emit("change", ""); }
/** Enfoca el trigger del select. */
function focus() {
  // Enfoca el trigger real (el botón), no el wrapper: el div es tabindex -1,
  // se enfoca sin ningún feedback visible y sin soporte de teclado
  selectRoot.value?.querySelector<HTMLElement>(".cu-select-toggle")?.focus();
}

function onFocusOut(e: FocusEvent) {
  const next = e.relatedTarget as HTMLElement | null;
  if (selectRoot.value?.contains(next as Node)) return;
  // El foco se fue del control (Tab, foco programático): el panel flotante no puede
  // quedar abierto tapando el resto de la página. `Popover` solo cierra con Escape o
  // click afuera, así que el cierre por salida del foco es del componente.
  if (dropdownRef.value?.isOpen()) {
    dropdownRef.value.close();
    // Al cerrar, `Popover` devuelve el foco al trigger; dentro de un shadow root lee
    // "foco perdido" cuando en realidad se fue a otro control, así que el control se
    // tragaría el Tab. Devolvemos el foco a donde iba (el fix de fondo es de `Popover`).
    if (next && next.isConnected) next.focus();
  }
  emit("blur");
}

onUnmounted(clearSearch);

defineExpose({
  get, set, reset, focus,
  /** Indica si el panel está abierto. */
  isOpen: () => dropdownRef.value?.isOpen() ?? false,
  /** Devuelve la opción seleccionada o null. */
  selectedItem: () => optionsList.value.find(o => o.value === selectedValue.value) || null,
});
</script>

<template>
  <div
    ref="selectRoot"
    class="cu-select"
    :class="{ 'cu-select--readonly': readOnly }"
    tabindex="-1"
    @focusout="onFocusOut"
  >
    <Dropdown
      ref="dropdownRef"
      :color="color"
      :disabled="disabled || readOnly"
      :position="position"
      :align="align"
      :fixed="fixed"
      :offset="4"
      :loading="loading"
      :cooldown="cooldownActive"
      :cooldown-key="cooldownKey"
      :cooldown-variant="cooldownVariant"
      :delay="searchResetDelay"
      @close="emit('close')"
    >
      <template #toggle="{ toggle, isOpen }">
        <Button
          :color="color"
          :variant="variant"
          :disabled="disabled"
          :aria-readonly="readOnly ? 'true' : undefined"
          class="cu-select-toggle"
          @click="toggle"
        >
          <span
            :class="['cu-select-label', { 'cu-select-label--wrap': placeholderWrap }]"
            :style="labelStyle"
          >
            {{ selectedLabel }}
          </span>
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
            class="cu-select-chevron"
            :class="{ 'cu-select-chevron--open': isOpen }"
          >
            <path d="m6 9 6 6 6-6"/>
          </svg>
        </Button>
      </template>
      <template #default>
        <input
          v-if="searchEnabled"
          ref="nativeInputRef"
          type="text"
          class="cu-select-hidden-input cu-input cu-input--ghost"
          tabindex="-1"
          autocomplete="off"
        />
        <div v-if="optionsList.length > 0" class="cu-select-options">
          <MenuOption
            v-for="(opt, i) in optionsList"
            :key="i"
            :label="opt.label"
            :color="opt.color || color"
            :variant="opt.variant || (opt.value === selectedValue ? 'soft' : 'ghost')"
            :disabled="opt.disabled"
            :selected="opt.value === selectedValue"
            class="cu-select-option"
            :class="{ 'cu-select-option--disabled': opt.disabled }"
            :style="opt.disabled ? disabledOptionStyle : optionStyle"
            @click="onSelect(opt)"
          />
        </div>
        <div v-else class="cu-select-empty">
          Sin opciones
        </div>
      </template>
    </Dropdown>
  </div>
</template>

<style scoped>
.cu-select {
  width: 100%;
  outline: none;
}

.cu-select :deep(.cu-dropdown) {
  width: 100%;
}

.cu-select-toggle {
  width: 100%;
  justify-content: space-between;
  gap: var(--cu-space-md);
  box-sizing: border-box;
}

/* Anillo de focus del trigger (como .cu-input:focus) — focus() enfoca el botón
   de verdad: visible para el usuario y para teclado */
.cu-select-toggle:focus {
  box-shadow: 0 0 0 var(--cu-border-thin) var(--btn-subtle-border);
}

.cu-select--readonly .cu-select-toggle {
  cursor: default;
}

.cu-select-label {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  min-width: 0;
  /* Ocupa el espacio que deja el chevron: sin esto el `text-align` del label no tiene
     ancho propio y la alineación no se ve. */
  flex: 1 1 auto;
}

.cu-select-label--wrap {
  white-space: normal;
}

.cu-select-chevron {
  transition: transform 200ms ease;
  flex-shrink: 0;
}

.cu-select-chevron--open {
  transform: rotate(180deg);
}

.cu-select-options {
  max-height: 240px;
  overflow-y: auto;
}

.cu-select-option {
  width: 100%;
  /* La alineación la pone `textAlign` inline (`justify-content`): dentro de un `Button`
     flex el `text-align` solo no mueve nada. Default: `flex-start`. */
}

.cu-select-option--disabled {
  /* El color muted y la opacidad 1 van inline (`disabledOptionStyle`): la fila es un
     `Button` y sus reglas scoped le ganaban a esta clase (la opción deshabilitada se
     veía igual que una habilitada). Acá queda solo el cursor. */
  cursor: not-allowed;
}

.cu-select-hidden-input {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
  opacity: 0;
}

.cu-select-empty{
  padding: var(--cu-space-md);
  font-family: var(--cu-font-sans);
  font-size: var(--cu-font-size-sm);
  color: var(--cu-color-neutral-text-subtle);
  text-align: center;
}
</style>
