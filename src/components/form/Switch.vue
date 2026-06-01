<script setup lang="ts">
import { computed, ref, watch, useTemplateRef } from "vue";
import { getBgClasses, getFgClasses } from "../../utils/palette";
import { useFocus } from "@vueuse/core";

const props = defineProps({
  modelValue: {
    type: Boolean,
    required: false,
    default: false,
  },
  checked: {
    type: Boolean,
    required: false,
    default: false,
  },
  color: {
    type: String,
    required: false,
    default: "#2c2c2c",
    validator: (value: string) =>
      /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/i.test(value),
  },
  size: {
    type: String,
    required: false,
    default: "md",
    validator: (value: string) => ["sm", "md"].includes(value),
  },
  disabled: {
    type: Boolean,
    required: false,
    default: false,
  },
  hightContrast: {
    type: Boolean,
    required: false,
    default: false,
  },
});

const emit = defineEmits(["update:modelValue", "change"]);
const checked = ref(props.modelValue || props.checked);
const inputRef = useTemplateRef("input");
const { focused: inputFocus } = useFocus(inputRef);

const bgClass = computed(() =>
  getBgClasses(props.color, "solid", props.hightContrast),
);
const fgClass = computed(() =>
  getFgClasses(props.color, "solid", props.hightContrast),
);

const toggle = () => {
  if (props.disabled) return;
  checked.value = !checked.value;
  emit("update:modelValue", checked.value);
  emit("change", checked.value);
};

const get = () => checked.value;
const set = (value: boolean) => {
  checked.value = value;
  emit("update:modelValue", value);
  emit("change", value);
};
const reset = () => {
  checked.value = false;
  emit("update:modelValue", false);
  emit("change", false);
};

watch(
  () => props.modelValue,
  (val) => {
    checked.value = val;
  },
);
watch(
  () => props.checked,
  (val) => {
    checked.value = val;
  },
);

defineExpose({
  get,
  set,
  reset,
  focus: () => (inputFocus.value = true),
});
</script>

<template>
  <div
    @click="toggle"
    class="relative inline-flex items-center rounded-full transition-all duration-150 cursor-pointer box-border"
    :class="{
      'w-12 h-8': props.size === 'md',
      'w-8 h-5': props.size === 'sm',
      'opacity-70 cursor-not-allowed pointer-events-none': props.disabled,
      'bg-[var(--btn-bg)]': checked,
      'bg-charcoal-300': !checked,
    }"
    :style="{
      '--btn-bg': bgClass.main,
      '--btn-fg': fgClass.main,
    }"
    role="switch"
    :aria-checked="checked"
  >
    <span
      class="absolute rounded-full transition-all duration-150 shadow-sm bg-white"
      :class="{
        'left-1 top-1 w-6 h-6': props.size === 'md',
        'left-0.5 top-0.5 w-4 h-4': props.size === 'sm',
        'translate-x-4': checked && props.size === 'md',
        'translate-x-3': checked && props.size === 'sm',
        'translate-x-0': !checked,
      }"
    />
    <input
      ref="input"
      type="checkbox"
      :checked="checked"
      class="absolute opacity-0 w-0 h-0"
      :disabled="props.disabled"
    />
  </div>
</template>

<style>
@unocss-placeholder;
</style>
