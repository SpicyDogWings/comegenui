<script setup lang="ts">
import { computed, ref, defineModel, type PropType } from "vue";
import { isColor, isSizeSm } from '@/utils/validators'

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
  },
});

const emit = defineEmits(["change"]);
const inputRef = ref<HTMLInputElement | null>(null);

// Igual que Button/Tabs: una prop fuera del set no puede dejar el control
// invisible (una custom property inexistente deja el fondo en transparent).
const safeColor = computed(() => (isColor(props.color) ? props.color : 'neutral'));
const safeSize = computed(() => (isSizeSm(props.size) ? props.size : 'md'));

const checkboxStyles = computed(() => ({
  '--cb-bg': `var(--cu-color-${safeColor.value})`,
  '--cb-solid': `var(--cu-color-${safeColor.value}-solid)`,
  '--cb-solid-text': `var(--cu-color-surface)`,
  '--cb-soft': `var(--cu-color-${safeColor.value}-soft)`,
  '--cb-ghost-hover': `var(--cu-color-${safeColor.value}-ghost-hover)`,
  '--cb-text': `var(--cu-color-${safeColor.value}-text)`,
}));

const onInput = (e: Event) => {
  const value = (e.target as HTMLInputElement).checked;
  checked.value = value;
  emit("change", value);
};

defineExpose({
  /** Devuelve si el checkbox está marcado. */
  get: () => checked.value,
  /** Setea el estado marcado y emite change. */
  set: (value: boolean) => {
    checked.value = value;
    emit("change", value);
  },
  /** Desmarca el checkbox y emite change. */
  reset: () => {
    checked.value = false;
    emit("change", false);
  },
  /** Enfoca el input nativo. */
  focus: () => inputRef.value?.focus(),
});
</script>

<template>
  <label
    class="cu-checkbox"
    :class="[
      `cu-checkbox--${safeSize}`,
      { 'cu-checkbox--disabled': props.disabled }
    ]"
  >
    <div
      class="cu-checkbox-box"
      :class="{ 'cu-checkbox-box--checked': checked }"
      :style="checkboxStyles"
    >
      <!-- El input nativo cubre la caja visual: es el control real y la única
           parada de tab. No lleva `tabindex="-1"`: con eso el teclado no podía
           llegar al checkbox. -->
      <input
        ref="inputRef"
        type="checkbox"
        :checked="checked"
        :disabled="props.disabled"
        class="cu-checkbox-input"
        @change="onInput"
      />
      <svg
        v-if="checked"
        xmlns="http://www.w3.org/2000/svg"
        width="14"
        height="14"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="3"
        stroke-linecap="round"
        stroke-linejoin="round"
        class="cu-checkbox-icon"
      >
        <path d="M20 6L9 17l-5-5" />
      </svg>
    </div>
    <span v-if="props.label" class="cu-checkbox-label">{{ props.label }}</span>
  </label>
</template>

<style scoped>
.cu-checkbox {
  position: relative;
  display: inline-flex;
  align-items: center;
  gap: var(--cu-space-sm);
  cursor: pointer;
  box-sizing: border-box;
  width: fit-content;
}

.cu-checkbox--md {
  gap: var(--cu-space-sm);
}

.cu-checkbox--sm {
  gap: var(--cu-space-xs);
}

.cu-checkbox--disabled {
  cursor: not-allowed;
  opacity: var(--cu-alpha-disabled, 0.7);
}

/* El control real es el input nativo, estirado sobre la caja visual: recibe el
   click, el foco del teclado (Space alterna) y el anillo de `:focus-within`.
   Sin `width/height: 0`, que dejaba el foco fuera de la vista. */
.cu-checkbox-input {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  margin: 0;
  opacity: 0;
  cursor: inherit;
  box-sizing: border-box;
}

.cu-checkbox-box {
  position: relative;
  border-radius: var(--cu-radius-sm);
  display: flex;
  align-items: center;
  justify-content: center;
  /* Sin `all`: al aparecer el anillo de foco, el outline no debe animarse
     desde los valores iniciales (3px negro) hasta el color del tema. */
  transition: background-color 200ms ease, border-color 200ms ease;
  border: var(--cu-border-medium) solid var(--cu-border-color);
  background-color: transparent;
  box-sizing: border-box;
  flex-shrink: 0;
}

.cu-checkbox--md .cu-checkbox-box {
  width: var(--cu-space-lg);
  height: var(--cu-space-lg);
}

.cu-checkbox--sm .cu-checkbox-box {
  width: var(--cu-space-md);
  height: var(--cu-space-md);
}

.cu-checkbox-box--checked {
  background-color: var(--cb-solid);
  border-color: var(--cb-solid);
}

.cu-checkbox:not(.cu-checkbox--disabled) .cu-checkbox-box:hover {
  border-color: var(--cb-bg);
  background-color: var(--cb-ghost-hover);
}

.cu-checkbox:not(.cu-checkbox--disabled) .cu-checkbox-box--checked:hover {
  background-color: var(--cb-solid);
}

/* Anillo de foco: el input es transparente, el anillo va sobre la caja visible
   (mismo criterio que FileInput/FileInputZone con `:focus-within`). */
.cu-checkbox-box:focus-within {
  outline: var(--cu-border-medium) solid var(--cu-border-color-focus);
  outline-offset: var(--cu-space-2xs);
}

.cu-checkbox-icon {
  color: var(--cb-solid-text);
}

.cu-checkbox-label {
  font-family: var(--cu-font-sans);
  color: var(--cu-color-neutral);
}

.cu-checkbox--md .cu-checkbox-label {
  font-size: var(--cu-font-size-sm);
}

.cu-checkbox--sm .cu-checkbox-label {
  font-size: var(--cu-font-size-xs);
}

.cu-checkbox--disabled .cu-checkbox-label {
  opacity: var(--cu-alpha-disabled, 0.7);
}
</style>
