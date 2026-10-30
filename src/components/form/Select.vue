<script setup lang="ts">
import { ref, computed, watch, nextTick, onUnmounted, type PropType } from 'vue';
import { isColor, isFieldVariant, isSelectSearchMode, isTextAlign } from '@/utils/validators'
import { textAlignStyle } from '@/utils/textAlign'
import Dropdown from "../overlay/Dropdown.vue";
import Button from "../buttons/Button.vue";
import MenuOption from "../controls/MenuOption.vue";
import { matchesQuery } from "@/utils/search";
import { useUniqueId } from "@/utils/uniqueId";

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
const searchText = ref("");
const cooldownActive = ref(false);
const cooldownKey = ref(0);
/**
 * Opción activa (la que anuncia `aria-activedescendant` y elige `Enter`). El foco no
 * sale del trigger: el panel es un `listbox` y la navegación es virtual, como en un
 * combobox. `-1` = ninguna.
 */
const activeIndex = ref(-1);
let resetTimeout: ReturnType<typeof setTimeout> | null = null;

// Patrón combobox + listbox: ids únicos por instancia (`useUniqueId` cubre el caso de
// varios custom elements, cada uno con su propia app de Vue).
const uid = useUniqueId("cu-select");
const listboxId = `${uid}-listbox`;
const optionId = (index: number) => `${uid}-option-${index}`;

const isOpen = computed(() => dropdownRef.value?.isOpen() ?? false);
const activeDescendant = computed(() =>
  isOpen.value && activeIndex.value >= 0 ? optionId(activeIndex.value) : undefined,
);

/** Índice de la opción elegida, o -1. */
const selectedIndex = computed(() =>
  optionsList.value.findIndex(o => o.value === selectedValue.value),
);

const matchIndex = computed(() => {
  const q = searchText.value;
  if (!q) return -1;
  return optionsList.value.findIndex(o =>
    !o.disabled && matchesQuery(o.label, q, { mode: props.searchMode }),
  );
});

/** Primera/última opción habilitada (Home/End y apertura con flechas). */
function firstEnabled(fromEnd = false) {
  const list = optionsList.value;
  const order = fromEnd ? [...list.keys()].reverse() : [...list.keys()];
  return order.find((i) => !list[i]!.disabled) ?? -1;
}

/** Mueve la opción activa `step` posiciones, salteando las deshabilitadas y con wrap. */
function moveActive(step: number) {
  const list = optionsList.value;
  if (list.length === 0) return;
  let index = activeIndex.value;
  for (let i = 0; i < list.length; i++) {
    index = (index + step + list.length) % list.length;
    if (!list[index]!.disabled) break;
  }
  activeIndex.value = list[index]?.disabled ? activeIndex.value : index;
  scrollToActive();
}

/** Deja visible la opción activa (el panel tiene scroll propio). */
function scrollToActive() {
  const index = activeIndex.value;
  if (index < 0) return;
  nextTick(() => {
    const optionsEl = selectRoot.value?.querySelector(".cu-select-options");
    const optionEl = optionsEl?.children[index] as HTMLElement | undefined;
    if (optionEl) optionEl.scrollIntoView({ block: "nearest" });
  });
}

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
  if (props.disabled) return;

  if (e.key === "ArrowDown" || e.key === "ArrowUp") {
    e.preventDefault();
    if (props.readOnly) return;
    if (!isOpen.value) {
      activeIndex.value = firstEnabled(e.key === "ArrowUp");
      dropdownRef.value?.open();
      scrollToActive();
      return;
    }
    // Con el panel abierto y sin activa, la primera flecha entra por el extremo pedido.
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

  if (e.key === "Enter" || e.key === " ") {
    const option = isOpen.value ? optionsList.value[activeIndex.value] : undefined;
    if (option && !option.disabled) {
      // Elegir con Enter/Espacio: sin esto, Espacio además dispararía el click del
      // trigger (cerraría el panel) y Enter podría enviar el formulario.
      e.preventDefault();
      onSelect(option);
    }
    return;
  }

  if (e.key === "Escape") {
    if (isOpen.value) activeIndex.value = -1;
    return;
  }

  if (e.key === "Tab") return;

  if (!props.readOnly && props.searchEnabled) {
    if (e.key.length === 1 && !e.ctrlKey && !e.metaKey) {
      e.preventDefault();
      searchText.value += e.key;
      cooldownKey.value++;
      scheduleReset();
      if (matchIndex.value >= 0) {
        activeIndex.value = matchIndex.value;
        scrollToActive();
      }
    } else if (e.key === "Backspace") {
      e.preventDefault();
      searchText.value = searchText.value.slice(0, -1);
      cooldownKey.value++;
      scheduleReset();
    }
  }
}

function onDropdownOpen() {
  // Cada apertura arranca la búsqueda de cero: si el panel se cerró a mitad del
  // cooldown, el texto acumulado y la barra no deben reaparecer al reabrir.
  clearSearch();
  // Si la apertura vino de una flecha, el activo ya está elegido: no pisarlo.
  if (activeIndex.value >= 0) return;
  const sel = selectedIndex.value;
  activeIndex.value = sel >= 0 && !optionsList.value[sel]!.disabled ? sel : firstEnabled();
}

function onDropdownClose() {
  // Cerrar el panel corta la búsqueda: el timer del cooldown no sigue corriendo
  // fuera de vista ni deja texto viejo para la próxima apertura.
  clearSearch();
  activeIndex.value = -1;
}

watch(isOpen, (open) => {
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
  const next = e.relatedTarget as Node | null;
  if (selectRoot.value?.contains(next as Node)) return;
  // El foco se fue del control (Tab, foco programático): el panel flotante no puede
  // quedar abierto tapando el resto de la página. `Popover` solo cierra con Escape o
  // click afuera, así que el cierre por salida del foco es del componente. Se cierra en
  // la tarea siguiente: durante el `focusout` el foco todavía no terminó de moverse
  // (`document.activeElement` sigue siendo el host) y el `restoreFocus` de `Popover`
  // lo leería como "perdido" y se tragaría el Tab.
  if (dropdownRef.value?.isOpen()) setTimeout(() => dropdownRef.value?.close(), 0);
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
      :panel-role="'listbox'"
      :panel-id="listboxId"
      @close="emit('close')"
    >
      <template #toggle="{ toggle, isOpen }">
        <Button
          :color="color"
          :variant="variant"
          :disabled="disabled"
          role="combobox"
          aria-haspopup="listbox"
          :aria-expanded="isOpen ? 'true' : 'false'"
          :aria-controls="listboxId"
          :aria-activedescendant="activeDescendant"
          :aria-readonly="readOnly ? 'true' : undefined"
          class="cu-select-toggle"
          @click="toggle"
          @keydown="onKeyDown"
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
        <div v-if="optionsList.length > 0" class="cu-select-options" tabindex="-1">
          <MenuOption
            v-for="(opt, i) in optionsList"
            :key="i"
            :id="optionId(i)"
            role="option"
            tabindex="-1"
            :aria-selected="opt.value === selectedValue ? 'true' : 'false'"
            :label="opt.label"
            :color="opt.color || color"
            :variant="opt.variant || (opt.value === selectedValue ? 'soft' : 'ghost')"
            :disabled="opt.disabled"
            :selected="opt.value === selectedValue"
            :class="[
              'cu-select-option',
              {
                'cu-select-option--disabled': opt.disabled,
                'cu-select-option--active': i === activeIndex,
              },
            ]"
            :style="opt.disabled ? disabledOptionStyle : optionStyle"
            @mousedown.prevent
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

/* Opción activa (la que anuncia `aria-activedescendant`): el foco queda en el trigger,
   así que el resaltado es la única señal visual de dónde está parada la navegación. */
.cu-select-option--active:not(.cu-select-option--disabled) {
  background-color: var(--cu-color-neutral-ghost-hover);
}

.cu-select-empty{
  padding: var(--cu-space-md);
  font-family: var(--cu-font-sans);
  font-size: var(--cu-font-size-sm);
  color: var(--cu-color-neutral-text-subtle);
  text-align: center;
}
</style>
