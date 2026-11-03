<script setup lang="ts">
import { computed, useTemplateRef, ref, watch } from "vue";
import Input from "./Input.vue";

const value = defineModel<string>({ default: "#000000" });

const props = defineProps({
  color: {
    type: String,
    required: false,
    default: "neutral",
    validator: (v: string) =>
      ["primary", "secondary", "neutral", "success", "warning", "danger"].includes(v),
  },
  disabled: {
    type: Boolean,
    required: false,
    default: false,
  },
});

const emit = defineEmits(["change"]);

const inputRef = useTemplateRef<InstanceType<typeof Input>>("input");
const pickerRef = useTemplateRef<HTMLInputElement>("picker");

const localHex = ref(value.value);

/**
 * Valor vigente dentro del componente. Es la fuente de verdad inmediata: los
 * métodos (`get`, `set`, `reset`) no esperan al re-render del host, que cuando
 * el `model-value` lo controla un padre (el custom element espeja su estado)
 * llega recién en el tick siguiente.
 */
const current = ref(value.value);

watch(value, (v) => {
  current.value = v;
  localHex.value = v;
});

/** Escribe el valor: estado interno ya, y `update:modelValue` para el host. */
function commitValue(next: string) {
  current.value = next;
  if (next !== value.value) value.value = next;
}

const pickerStyles = computed(() => ({
  "--cp-subtle-border": `var(--cu-color-${props.color}-subtle-border)`,
}));

function onSwatchClick() {
  if (props.disabled) return;
  pickerRef.value?.click();
}

function onPickerInput(e: Event) {
  const hex = (e.target as HTMLInputElement).value;
  localHex.value = hex;
  commitValue(hex);
  emit("change", hex);
}

function onTextInput(hex: string) {
  localHex.value = hex;
  if (/^#[0-9a-fA-F]{6}$/.test(hex)) {
    commitValue(hex);
    emit("change", hex);
  }
}

function onTextInputBlur() {
  if (!/^#[0-9a-fA-F]{6}$/.test(localHex.value)) {
    localHex.value = current.value;
  }
}

/** Devuelve el color actual en formato hex. */
function get() { return current.value; }
/** Setea el color actual en formato hex. */
function set(v: string) { commitValue(v); localHex.value = v; }
/** Restaura el color al negro (#000000). */
function reset() { commitValue("#000000"); localHex.value = "#000000"; }

defineExpose({ get, set, reset, /** Enfoca el input de texto del color. */ focus: () => inputRef.value?.focus() });
</script>

<template>
  <div
    class="cu-color-picker"
    :class="{ 'cu-color-picker--disabled': disabled }"
    :style="pickerStyles"
  >
    <button
      type="button"
      class="cu-color-picker-swatch"
      aria-label="Elegir color"
      @click="onSwatchClick"
      :disabled="disabled"
    >
      <span class="cu-color-picker-swatch-color" :style="{ backgroundColor: current }" />
    </button>
    <!-- El picker nativo es un detalle de implementación: lo maneja el swatch
         (que es el control con nombre), así que no aparece en el árbol de a11y. -->
    <input
      ref="picker"
      type="color"
      :value="current"
      class="cu-color-picker-native"
      aria-hidden="true"
      @input="onPickerInput"
      :disabled="disabled"
      tabindex="-1"
    />
    <Input
      ref="input"
      class="cu-color-picker-input"
      :model-value="localHex"
      :disabled="disabled"
      maxlength="7"
      spellcheck="false"
      @update:model-value="onTextInput"
      @blur="onTextInputBlur"
    />
  </div>
</template>

<style>
.cu-color-picker {
  display: inline-flex;
  align-items: center;
  gap: var(--cu-space-sm);
  font-family: var(--cu-font-sans);
}

.cu-color-picker-swatch {
  position: relative;
  width: var(--cu-space-2xl);
  height: var(--cu-space-2xl);
  padding: 0;
  border: var(--cu-border-thin) solid var(--cu-subtle-border, var(--cu-border-color));
  border-radius: var(--cu-radius-md);
  cursor: pointer;
  background: none;
  overflow: hidden;
  flex-shrink: 0;
  transition: border-color 150ms ease;
}

.cu-color-picker-swatch:hover:not(:disabled) {
  border-color: var(--cp-subtle-border);
}

.cu-color-picker-swatch:disabled {
  opacity: var(--cu-alpha-disabled, 0.7);
  cursor: not-allowed;
}

.cu-color-picker-swatch-color {
  display: block;
  width: 100%;
  height: 100%;
}

.cu-color-picker-native {
  position: absolute;
  width: 0;
  height: 0;
  opacity: 0;
  pointer-events: none;
}

.cu-color-picker-input {
  width: var(--cu-space-5xl);
}

/* El wrapper no apila opacidad: el swatch y el input de texto la aplican cada
   uno (apilarla dejaría el picker más apagado que un campo disabled vecino). */
.cu-color-picker--disabled {
  cursor: not-allowed;
}
</style>
