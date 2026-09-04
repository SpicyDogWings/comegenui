<script setup lang="ts">
import { computed, defineModel, useTemplateRef, ref, watch } from "vue";
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

function onTextInput(hex: string) {
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

defineExpose({ get, set, reset, focus: () => inputRef.value?.focus() });
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
  width: 88px;
}

.cu-color-picker--disabled {
  opacity: 0.5;
  pointer-events: none;
}
</style>
