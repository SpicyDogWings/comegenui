<script setup lang="ts">
import { computed, ref, watch, useTemplateRef } from "vue";
import { getBgClasses, getFgClasses } from "../../utils/palette";
import { useFocus } from "@vueuse/core";

interface SelectOption {
  value: string;
  label: string;
}

const props = defineProps({
  modelValue: {
    type: String,
    required: false,
    default: "",
  },
  options: {
    type: Array as () => SelectOption[],
    required: false,
    default: () => [],
  },
  color: {
    type: String,
    required: false,
    default: "#2c2c2c",
    validator: (value: string) =>
      /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/i.test(value),
  },
  variant: {
    type: String,
    required: false,
    default: "ghost",
    validator: (value: string) =>
      ["outlined", "soft", "ghost", "subtle", "none"].includes(value),
  },
  placeholder: {
    type: String,
    required: false,
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

const emit = defineEmits(["update:modelValue"]);
const selectedValue = ref(props.modelValue);
const selectRef = useTemplateRef("select");
const { focused: selectFocus } = useFocus(selectRef);

const bgClass = computed(() =>
  getBgClasses(props.color, props.variant, props.hightContrast),
);
const fgClass = computed(() =>
  getFgClasses(props.color, props.variant, props.hightContrast),
);

const get = () => selectedValue.value;
const set = (value: string) => {
  selectedValue.value = value;
};
const reset = () => {
  selectedValue.value = "";
};

watch(
  () => props.modelValue,
  (val) => {
    selectedValue.value = val;
  },
  { immediate: true },
);

defineExpose({
  get,
  set,
  reset,
  focus: () => (selectFocus.value = true),
});
</script>

<template>
  <div
    class="relative w-full"
    :style="{
      '--btn-fg': fgClass.main,
      '--btn-bg': bgClass.main,
      '--btn-bg-hover': bgClass.hover,
      '--btn-bg-active': bgClass.active,
      '--btn-bd': fgClass.border,
    }"
  >
    <select
      ref="select"
      :value="selectedValue"
      @change="
        (e) => {
          selectedValue = (e.target as HTMLSelectElement).value;
          emit('update:modelValue', selectedValue);
        }
      "
      class="py-2 px-3 pr-8 rounded-cu font-sans border-none text-[var(--btn-fg)] focus:outline-none focus:ring-2 w-full bg-[var(--btn-bg)] box-border appearance-none cursor-pointer"
      :class="{
        'focus:ring-[var(--btn-bd)]': true,
        'cursor-not-allowed opacity-70': props.disabled,
        'border-solid border-1 border-[var(--btn-bd)]': props.variant === 'subtle',
        'bg-transparent border-solid border-2 border-[var(--btn-bd)] hover:bg-[var(--btn-bg-hover)]': props.variant === 'outlined',
        'hover:bg-[var(--btn-bg-hover)]': props.variant === 'soft' || props.variant === 'ghost',
        'bg-transparent border-solid border-1 border-charcoal-100': props.variant === 'none',
      }"
      :disabled="props.disabled"
    >
      <option v-if="props.placeholder" value="" disabled :selected="!selectedValue" class="text-charcoal-800 bg-white">
        {{ props.placeholder }}
      </option>
      <option
        v-for="option in props.options"
        :key="option.value"
        :value="option.value"
        class="text-charcoal-800 bg-white"
      >
        {{ option.label }}
      </option>
    </select>
    <div class="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none text-[var(--btn-fg)]">
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="m6 9l6 6l6-6"/>
      </svg>
    </div>
  </div>
</template>

<style>
@unocss-placeholder;
</style>
