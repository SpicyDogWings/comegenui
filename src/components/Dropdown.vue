<script setup lang="ts">
import { computed, ref } from "vue";
import { onClickOutside, useMagicKeys, whenever } from "@vueuse/core";
import { getBgClasses, getFgClasses } from "../utils/palette";
import Button from "./Button.vue";

const props = defineProps({
  color: {
    type: String,
    required: false,
    default: "#2c2c2c",
    validator: (value: string) =>
      /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/i.test(value),
  },
  hightContrast: {
    type: Boolean,
    required: false,
    default: false,
  },
  variant: {
    type: String,
    required: false,
    default: "ghost",
    validator: (value: string) =>
      ["solid", "outlined", "soft", "ghost", "subtle"].includes(value),
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
  placement: {
    type: String,
    required: false,
    default: "bottom-start",
    validator: (value: string) =>
      ["bottom-start", "bottom-end", "top-start", "top-end"].includes(value),
  },
  offset: {
    type: Number,
    required: false,
    default: 4,
  },
});

const emit = defineEmits(["open", "close"]);
const isOpen = ref(false);
const dropdownRef = ref<HTMLElement | null>(null);

onClickOutside(dropdownRef, () => {
  if (isOpen.value) close();
});

const keys = useMagicKeys({ target: window });
whenever(() => keys.Escape?.value, () => {
  if (isOpen.value) close();
});

function open() {
  if (props.disabled) return;
  isOpen.value = true;
  emit("open");
}
function close() {
  isOpen.value = false;
  emit("close");
}
function toggle() {
  if (props.disabled) return;
  if (isOpen.value) close();
  else open();
}

const bgClass = computed(() =>
  getBgClasses(props.color, props.variant, props.hightContrast),
);
const fgClass = computed(() =>
  getFgClasses(props.color, props.variant, props.hightContrast),
);

const menuStyle = computed(() => {
  const base = {
    "--btn-fg": fgClass.value.main,
    "--btn-bg": bgClass.value.main,
    "--btn-bg-hover": bgClass.value.hover,
    "--btn-bg-active": bgClass.value.active,
    "--btn-bd": fgClass.value.border,
  } as Record<string, string>;
  return base;
});

const menuClasses = computed(() => {
  const base = [
    "absolute z-1000 min-w-[200px] rounded-cu py-1 font-sans text-[var(--btn-fg)] bg-[var(--btn-bg)] shadow-xl",
    "border-solid border-1 border-[var(--btn-bd)]",
    {
      "hover:bg-[var(--btn-bg-hover)]":
        props.variant === "soft" || props.variant === "ghost",
      "bg-transparent": props.variant === "outlined",
      "bg-opacity-10": props.variant === "soft" || props.variant === "subtle",
      "border-[var(--btn-bd)]":
        props.variant === "subtle" || props.variant === "outlined",
      "top-full left-0 mt-[var(--offset)]": props.placement === "bottom-start",
      "top-full right-0 mt-[var(--offset)]": props.placement === "bottom-end",
      "bottom-full left-0 mb-[var(--offset)]": props.placement === "top-start",
      "bottom-full right-0 mb-[var(--offset)]": props.placement === "top-end",
    },
  ];
  return base;
});

defineExpose({
  open,
  close,
  toggle,
  get isOpen() { return isOpen.value },
});
</script>

<template>
  <div ref="dropdownRef" class="relative inline-block box-border">
    <slot name="toggle" :toggle="toggle" :isOpen="isOpen">
      <Button
        :color="props.color"
        :variant="props.variant"
        :disabled="props.disabled"
        :hightContrast="props.hightContrast"
        @click="toggle"
      >
        {{ props.label || "Dropdown" }}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
          :class="{ 'rotate-180': isOpen }"
          class="transition-transform duration-200"
        >
          <path d="m6 9 6 6 6-6"/>
        </svg>
      </Button>
    </slot>

    <Transition name="cu-dropdown">
      <div
        v-if="isOpen"
        :style="{ ...menuStyle, '--offset': offset + 'px' }"
        :class="menuClasses"
        role="menu"
      >
        <slot></slot>
      </div>
    </Transition>
  </div>
</template>

<style>
@unocss-placeholder;
</style>

<style>
.cu-dropdown-enter-active,
.cu-dropdown-leave-active {
  transition: opacity 0.15s ease, transform 0.15s ease;
}
.cu-dropdown-enter-from,
.cu-dropdown-leave-to {
  opacity: 0;
  transform: translateY(-4px);
}
</style>
