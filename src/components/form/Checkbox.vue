<script setup lang="ts">
import { computed, ref, watch } from "vue";
import { getBgClasses, getFgClasses } from "../../utils/palette";

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
  variant: {
    type: String,
    required: false,
    default: "ghost",
    validator: (value: string) =>
      ["outlined", "soft", "ghost", "subtle", "none"].includes(value),
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
  hightContrast: {
    type: Boolean,
    required: false,
    default: false,
  },
});

const emit = defineEmits(["update:modelValue", "change"]);
const checked = ref(props.modelValue || props.checked);

const bgClass = computed(() =>
  getBgClasses(props.color, props.variant, props.hightContrast),
);
const fgClass = computed(() =>
  getFgClasses(props.color, props.variant, props.hightContrast),
);

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
  get: () => checked.value,
  set: (value: boolean) => {
    checked.value = value;
    emit("update:modelValue", value);
    emit("change", { target: { checked: value } });
  },
  reset: () => {
    checked.value = false;
    emit("update:modelValue", false);
    emit("change", { target: { checked: false } });
  },
});
</script>

<template>
  <label class="flex items-center gap-2 cursor-pointer box-border w-fit" :class="{ 'pointer-events-none': props.disabled }">
    <input
      type="checkbox"
      :checked="checked"
      @change="
        (e) => {
          checked = (e.target as HTMLInputElement).checked;
          emit('update:modelValue', checked);
          emit('change', e);
        }
      "
      :disabled="props.disabled"
      class="absolute opacity-0 w-0 h-0 box-border"
    />
    <div
      class="relative w-3.5 h-3.5 rounded-cu flex items-center justify-center transition-all duration-200 text-[var(--btn-fg)] bg-[var(--btn-bg)] box-border"
      :class="{
        'border-solid border-2 border-[var(--btn-bd)] bg-transparent hover:bg-opacity-10': props.variant === 'outlined' && !checked,
        'border-solid border-2 border-[var(--btn-bd)]': props.variant === 'outlined' && checked,
        'border-2 border-solid border-[var(--btn-bd)] bg-opacity-10': props.variant === 'subtle' && !checked,
        'border-2 border-solid border-[var(--btn-bd)]': props.variant === 'subtle' && checked,
        'bg-opacity-10 hover:bg-opacity-20': props.variant === 'ghost' && !checked,
        'w-4 h-4 bg-opacity-10 hover:bg-opacity-20': props.variant === 'soft' && !checked,
        'w-4 h-4': props.variant === 'soft' && checked,
        'border-solid border-1 border-charcoal-100 bg-transparent': props.variant === 'none' && !checked,
        'border-solid border-1 border-[var(--btn-bd)]': props.variant === 'none' && checked,
        'cursor-not-allowed opacity-70': props.disabled,
      }"
      :style="{
        '--btn-fg': fgClass.main,
        '--btn-bg': bgClass.main,
        '--btn-bg-hover': bgClass.hover,
        '--btn-bg-active': bgClass.active,
        '--btn-bd': fgClass.border,
      }"
    >
      <svg
        v-if="checked"
        xmlns="http://www.w3.org/2000/svg"
        :width="props.variant === 'soft' ? 16 : 14"
        :height="props.variant === 'soft' ? 16 : 14"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="3"
        stroke-linecap="round"
        stroke-linejoin="round"
        class="text-[var(--btn-fg)]"
      >
        <path d="M20 6L9 17l-5-5" />
      </svg>
    </div>
    <span v-if="props.label" class="text-sm text-charcoal-800 font-sans">{{ props.label }}</span>
  </label>
</template>

<style>
@unocss-placeholder;
</style>
