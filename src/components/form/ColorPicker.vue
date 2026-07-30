<script setup lang="ts">
import { computed, defineModel, useTemplateRef, ref, watch } from "vue";
import { useFocus } from "@vueuse/core";

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

const inputRef = useTemplateRef("input");
const pickerRef = useTemplateRef("picker");
const { focused } = useFocus(inputRef);

const localHex = ref(value.value);

watch(value, (v) => {
  localHex.value = v;
});

const pickerStyles = computed(() => ({
  "--cp-bg": `var(--cu-color-${props.color})`,
  "--cp-soft": `var(--cu-color-${props.color}-soft)`,
  "--cp-soft-hover": `var(--cu-color-${props.color}-soft-hover)`,
  "--cp-subtle-border": `var(--cu-color-${props.color}-subtle-border)`,
}));

function onSwatchClick() {
  if (props.disabled) return;
  pickerRef.value?.click();
}

function onPickerInput(e: Event) {
  const hex = (e.target as HTMLInputElement).value;
  localHex.value = hex;
  value.value = hex;
  emit("change", hex);
}

function onTextInput(e: Event) {
  let hex = (e.target as HTMLInputElement).value;
  localHex.value = hex;
  if (/^#[0-9a-fA-F]{6}$/.test(hex)) {
    value.value = hex;
    emit("change", hex);
  }
}

function onTextInputBlur() {
  if (!/^#[0-9a-fA-F]{6}$/.test(localHex.value)) {
    localHex.value = value.value;
  }
}

function get() { return value.value; }
function set(v: string) { value.value = v; localHex.value = v; }
function reset() { value.value = "#000000"; localHex.value = "#000000"; }

defineExpose({ get, set, reset, focus: () => (focused.value = true) });
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
      @click="onSwatchClick"
      :disabled="disabled"
    >
      <span class="cu-color-picker-swatch-color" :style="{ backgroundColor: value }" />
    </button>
    <input
      ref="picker"
      type="color"
      :value="value"
      class="cu-color-picker-native"
      @input="onPickerInput"
      :disabled="disabled"
      tabindex="-1"
    />
    <input
      ref="input"
      type="text"
      :value="localHex"
      class="cu-color-picker-input"
      :disabled="disabled"
      @input="onTextInput"
      @blur="onTextInputBlur"
      maxlength="7"
      spellcheck="false"
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
  width: 32px;
  height: 32px;
  padding: 0;
  border: var(--cu-border-thin) solid var(--cu-subtle-border, var(--cu-border-color));
  border-radius: var(--cu-radius-md);
  cursor: pointer;
  background: none;
  overflow: hidden;
  flex-shrink: 0;
  transition: border-color 150ms ease;
}

.cu-color-picker-swatch:hover {
  border-color: var(--cp-subtle-border);
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
  width: 80px;
  padding: var(--cu-space-sm) var(--cu-space-md);
  border: var(--cu-border-thin) solid var(--cu-border-color);
  border-radius: var(--cu-radius-md);
  font-family: var(--cu-font-mono);
  font-size: var(--cu-font-size-sm);
  background: var(--cu-color-surface);
  color: var(--cu-color-neutral);
  outline: none;
  transition: border-color 150ms ease, box-shadow 150ms ease;
}

.cu-color-picker-input:focus {
  border-color: var(--cp-subtle-border);
  box-shadow: 0 0 0 2px var(--cp-soft);
}

.cu-color-picker--disabled {
  opacity: 0.5;
  pointer-events: none;
}
</style>
