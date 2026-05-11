<script setup lang="ts">
import { computed, ref, watch } from "vue";

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
    default: "#3b82f6",
    validator: (value: string) =>
      /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/i.test(value),
  },
  variant: {
    type: String,
    required: false,
    default: "outlined",
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
});

const emit = defineEmits(["update:modelValue", "change"]);
const checked = ref(props.modelValue || props.checked);

const checkboxClasses = computed(() => ({
  "cursor-not-allowed opacity-70": props.disabled,
}));

const boxClasses = computed(() => [
  {
    "border-solid border-2": props.variant === "outlined",
  },
  {
    "bg-transparent": props.variant === "outlined" && !checked.value,
  },
  {
    "border-2 border-solid border-1": props.variant === "subtle",
  },
  {
    "border-2 border-solid border-transparent": props.variant === "ghost",
  },
  {
    "w-4 h-4": props.variant === "soft",
  },
  {
    "border-solid border-1 border-charcoal-100": props.variant === "none",
  },
  {
    "bg-transparent": props.variant === "none" && !checked.value,
  },
  {
    "bg-[var(--checkbox-bg)] border-[var(--checkbox-bg)]":
      props.variant === "outlined" && checked.value,
  },
  {
    "bg-[var(--checkbox-bg)] border-[var(--checkbox-bg)]":
      props.variant === "subtle" && checked.value,
  },
  {
    "bg-[var(--checkbox-bg)]":
      props.variant === "soft" && checked.value,
  },
  {
    "border-[var(--checkbox-bd)] bg-[var(--checkbox-bg)]":
      props.variant === "ghost" && checked.value,
  },
  {
    "bg-[var(--checkbox-bg)]":
      props.variant === "none" && checked.value,
  },
  {
    "bg-[var(--checkbox-bg)] bg-opacity-10":
      props.variant === "soft" && !checked.value,
  },
  {
    "border-[var(--checkbox-bd)] bg-[var(--checkbox-bg)] bg-opacity-10":
      props.variant === "subtle" && !checked.value,
  },
  {
    "bg-transparent hover:bg-[var(--checkbox-bg)] hover:bg-opacity-10":
      props.variant === "ghost" && !checked.value,
  },
]);

const fgColor = computed(() => {
  const c = props.color;
  if (c === "#2c2c2c") return "#ffffff";
  if (c === "#3b82f6") return "#ffffff";
  if (c === "#22c55e") return "#ffffff";
  if (c === "#f59e0b") return "#ffffff";
  if (c === "#ef4444") return "#ffffff";
  return c;
});

const handleClick = () => {
  if (props.disabled) return;
  checked.value = !checked.value;
  emit("update:modelValue", checked.value);
  emit("change", { target: { checked: checked.value } });
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
  <label
    class="flex items-center gap-2 cursor-pointer"
    :class="checkboxClasses"
  >
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
      class="absolute opacity-0 w-0 h-0"
    />
    <div
      class="relative w-3.5 h-3.5 rounded-cu flex items-center justify-center transition-all duration-200"
      :class="boxClasses"
      :style="{
        '--checkbox-bg': props.color,
        '--checkbox-bd': props.color,
        '--checkbox-fg': fgColor,
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
        class="text-[var(--checkbox-fg)]"
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
