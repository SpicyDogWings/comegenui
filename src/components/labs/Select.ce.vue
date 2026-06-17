<script setup lang="ts">
import { computed, ref, watch, getCurrentInstance } from "vue";
import Select from "./Select.vue";
import { getColorMap } from "../../utils/palette";
import { getHostTheme } from "../../utils/getHostTheme";
import { isValidTheme, type ThemeName } from "../../config/theme";

interface SelectOption {
  value: string;
  label: string;
}

const props = defineProps({
  theme: { type: String, required: false, default: "", validator: isValidTheme },
  modelValue: { type: String, required: false, default: "" },
  options: { type: Array as () => SelectOption[], required: false, default: () => [] },
  color: { type: String, required: false, default: "neutral" },
  variant: {
    type: String,
    required: false,
    default: "none",
    validator: (value: string) =>
      ["solid", "outlined", "soft", "ghost", "subtle", "link", "none"].includes(value),
  },
  placeholder: { type: String, required: false },
  placeholderWrap: { type: Boolean, required: false, default: false },
  position: { type: String, required: false, default: "bottom" },
  align: { type: String, required: false, default: "start" },
  placement: { type: String, required: false, default: "" },
  disabled: { type: Boolean, required: false, default: false },
  hightContrast: { type: Boolean, required: false, default: false },
});

const effectiveTheme = computed(() => props.theme || getHostTheme());
const hexColor = computed(() => {
  const map = getColorMap(effectiveTheme.value as ThemeName);
  return map[props.color as keyof typeof map] || props.color;
});

const selectRef = ref<InstanceType<typeof Select> | null>(null);
const instance = getCurrentInstance();
const innerValue = ref(props.modelValue);

watch(() => props.modelValue, (val) => {
  innerValue.value = val;
});

watch(() => selectRef.value?.get(), (val) => {
  if (val !== undefined && val !== null && val !== innerValue.value) {
    innerValue.value = val;
    ceEmit("update:modelValue", val);
  }
});

function ceEmit(event: string, payload: unknown) {
  const el = instance?.vnode.el as HTMLElement | null;
  const host = el?.getRootNode()?.host || el;
  if (host) {
    host.dispatchEvent(new CustomEvent(event, {
      detail: payload,
      bubbles: true,
      composed: true,
    }));
  }
}

defineExpose({
  get: () => selectRef.value?.get(),
  set: (val: string) => selectRef.value?.set(val),
  reset: () => selectRef.value?.reset(),
  focus: () => selectRef.value?.focus(),
  get isOpen() { return selectRef.value?.isOpen || false },
  get selectedItem() { return selectRef.value?.selectedItem || null },
});
</script>

<template>
  <Select
    ref="selectRef"
    :color="hexColor"
    :variant="props.variant"
    :disabled="props.disabled"
    :hight-contrast="props.hightContrast"
    :placeholder="props.placeholder"
    :placeholder-wrap="props.placeholderWrap"
    :position="props.position"
    :align="props.align"
    :placement="props.placement"
    :model-value="innerValue"
    :options="props.options"
    :menu-bg="getColorMap(effectiveTheme as ThemeName).surface"
    @select="ceEmit('select', $event)"
    @close="ceEmit('close', $event)"
    @blur="ceEmit('blur', $event)"
  />
</template>

<style>
@unocss-placeholder;
</style>
