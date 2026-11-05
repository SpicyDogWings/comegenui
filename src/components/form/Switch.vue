<script setup lang="ts">
import { computed, defineModel, useTemplateRef, type PropType } from "vue";
import { isColor, isLabelPosition, isSizeSm } from '@/utils/validators'
import { useFocus } from "@vueuse/core";

const checked = defineModel<boolean>({ default: false });

const props = defineProps({
  color: {
    type: String as PropType<'primary' | 'secondary' | 'neutral' | 'success' | 'warning' | 'danger'>,
    required: false,
    default: "neutral",
    validator: isColor,
  },
  size: {
    type: String as PropType<'sm' | 'md'>,
    required: false,
    default: "md",
    validator: isSizeSm,
  },
  disabled: {
    type: Boolean,
    required: false,
    default: false,
  },
  label: {
    type: String,
    required: false,
    default: "",
  },
  /** Lado del track en el que se muestra la etiqueta: `end` (derecha, default) o `start` (izquierda). */
  labelPosition: {
    type: String as PropType<'start' | 'end'>,
    required: false,
    default: "end",
    validator: isLabelPosition,
  },
});

const emit = defineEmits<{
  /** Valor nuevo, tanto al click como en `set()`/`reset()` (no el `Event` nativo). */
  (e: "change", value: boolean): void;
}>();
const inputRef = useTemplateRef("input");
const { focused: inputFocus } = useFocus(inputRef);

// Igual que Button/Tabs: una prop fuera del set no puede dejar el control
// invisible (custom property inexistente = track transparente).
const safeColor = computed(() => (isColor(props.color) ? props.color : 'neutral'));
const safeSize = computed(() => (isSizeSm(props.size) ? props.size : 'md'));

const switchStyles = computed(() => ({
  // Track encendido con el color del tema y texto del thumb vía `surface`: el
  // relleno plano no llega a 3:1 en varios temas/colores, así que el límite del
  // control lo dibuja el anillo `-border` (≥3:1 contra la superficie).
  '--switch-bg': `var(--cu-color-${safeColor.value}-solid)`,
  '--switch-hover': `var(--cu-color-${safeColor.value}-solid-hover)`,
  '--switch-active': `var(--cu-color-${safeColor.value}-solid-active)`,
  '--switch-border': `var(--cu-color-${safeColor.value}-border)`,
}));

const toggle = (next?: boolean) => {
  if (props.disabled) return;
  const value = next ?? !checked.value;
  if (value === checked.value) return;
  checked.value = value;
  emit("change", value);
};

const onInput = (e: Event) => {
  toggle((e.target as HTMLInputElement).checked);
};

/** Devuelve el estado actual del switch. */
const get = () => checked.value;
/** Setea el estado del switch y emite change. */
const set = (value: boolean) => {
  checked.value = value;
  emit("change", value);
};
/** Apaga el switch y emite change. */
const reset = () => {
  checked.value = false;
  emit("change", false);
};

defineExpose({
  get,
  set,
  reset,
  /** Enfoca el input nativo. */
  focus: () => (inputFocus.value = true),
});
</script>

<template>
  <label
    class="cu-switch"
    :class="[
      `cu-switch--${safeSize}`,
      `cu-switch--label-${props.labelPosition}`,
      { 'cu-switch--disabled': props.disabled }
    ]"
  >
    <span
      class="cu-switch-track"
      :class="{ 'cu-switch--checked': checked }"
      :style="switchStyles"
    >
      <span class="cu-switch-thumb" />
      <!-- El control accesible es el input nativo: `role="switch"` acá (no en el
           track) deja un solo nodo en el árbol de accesibilidad, con el estado
           checked/disabled nativo y una parada de tab real. -->
      <input
        ref="input"
        type="checkbox"
        role="switch"
        :aria-checked="!!checked"
        :checked="checked"
        :disabled="props.disabled"
        class="cu-switch-input"
        @change="onInput"
      />
    </span>
    <span v-if="props.label || $slots.default" class="cu-switch-label">
      <slot>{{ props.label }}</slot>
    </span>
  </label>
</template>

<style>
/* label nativo (misma implementación que Checkbox): el click en el label
   activa el input anidado y su change alterna */
.cu-switch {
  position: relative;
  display: inline-flex;
  align-items: center;
  gap: var(--cu-space-sm);
  vertical-align: middle;
  cursor: pointer;
}

/* `labelPosition`: el track va primero en el DOM y el label después. Con
   `row-reverse` el label queda a la izquierda sin cambiar el markup: el <label>
   nativo sigue envolviendo a los dos y el click en la etiqueta alterna igual.
   El `gap` se mantiene entre ambos y el label conserva su ancho intrínseco. */
.cu-switch--label-end {
  flex-direction: row;
}

.cu-switch--label-start {
  flex-direction: row-reverse;
}

.cu-switch-track {
  position: relative;
  display: inline-flex;
  align-items: center;
  border-radius: var(--cu-radius-full);
  /* Sin `all`: el anillo de foco no se anima desde los valores iniciales. */
  transition: background-color 150ms ease, border-color 150ms ease;
  box-sizing: border-box;
}

.cu-switch--md .cu-switch-track {
  width: var(--cu-space-3xl);
  height: var(--cu-space-2xl);
}

.cu-switch--sm .cu-switch-track {
  width: var(--cu-space-2xl);
  height: var(--cu-space-xl);
}

.cu-switch-track.cu-switch--checked {
  background-color: var(--switch-bg);
  box-shadow: inset 0 0 0 var(--cu-border-thin) var(--switch-border);
}

.cu-switch-track:not(.cu-switch--checked) {
  background-color: var(--cu-color-neutral-soft);
}

/* Encendido: el track es sólido, así que el hover/active son las variantes sólidas
   del color (un poco más oscuro / claro), no las `ghost` translúcidas. */
.cu-switch-track.cu-switch--checked:hover {
  background-color: var(--switch-hover);
}

.cu-switch-track.cu-switch--checked:active {
  background-color: var(--switch-active);
}

.cu-switch-track:not(.cu-switch--checked):hover {
  background-color: var(--cu-color-neutral-ghost-hover);
}

.cu-switch--disabled {
  cursor: not-allowed;
}

.cu-switch--disabled .cu-switch-track {
  opacity: var(--cu-alpha-disabled, 0.7);
  pointer-events: none;
}

.cu-switch--disabled .cu-switch-label {
  opacity: var(--cu-alpha-disabled, 0.7);
}

/* Anillo de foco sobre el track visible (el input es transparente). */
.cu-switch-track:focus-within {
  outline: var(--cu-border-medium) solid var(--cu-border-color-focus);
  outline-offset: var(--cu-space-2xs);
}

.cu-switch-thumb {
  position: absolute;
  border-radius: var(--cu-radius-full);
  background-color: var(--cu-color-surface);
  box-shadow: var(--cu-shadow-sm);
  transition: all 150ms ease;
}

.cu-switch--md .cu-switch-thumb {
  width: var(--cu-space-xl);
  height: var(--cu-space-xl);
  top: var(--cu-space-xs);
  left: var(--cu-space-xs);
}

.cu-switch--sm .cu-switch-thumb {
  width: var(--cu-space-lg);
  height: var(--cu-space-lg);
  top: calc((var(--cu-space-xl) - var(--cu-space-lg)) / 2);
  left: calc((var(--cu-space-xl) - var(--cu-space-lg)) / 2);
}

.cu-switch--md .cu-switch-track.cu-switch--checked .cu-switch-thumb {
  transform: translateX(16px);
}

.cu-switch--sm .cu-switch-track.cu-switch--checked .cu-switch-thumb {
  transform: translateX(8px);
}

/* El input nativo cubre el track: recibe el click, el foco del teclado (Space
   alterna) y el anillo de `:focus-within`. Sin `tabindex="-1"` ni tamaño 0. */
.cu-switch-input {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  margin: 0;
  opacity: 0;
  cursor: inherit;
  box-sizing: border-box;
}

.cu-switch-label {
  font-family: var(--cu-font-sans);
  color: var(--cu-color-neutral);
}

.cu-switch--md .cu-switch-label {
  font-size: var(--cu-font-size-sm);
}

.cu-switch--sm .cu-switch-label {
  font-size: var(--cu-font-size-xs);
}
</style>
