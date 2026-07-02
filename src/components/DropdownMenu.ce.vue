<script setup lang="ts">
import { computed, ref } from "vue";
import DropdownMenu from "./DropdownMenu.vue";
import { getColorMap } from "../utils/palette";
import { getHostTheme } from "../utils/getHostTheme";
import { isValidTheme, type ThemeName } from "../config/theme";

const props = defineProps({
  theme: { type: String, required: false, default: "", validator: isValidTheme },
  color: {
    type: String,
    required: false,
    default: "neutral",
    validator: (value: string) =>
      ["primary", "neutral", "success", "warning", "danger"].includes(value),
  },
  variant: {
    type: String,
    required: false,
    default: "none",
    validator: (value: string) =>
      ["solid", "outlined", "soft", "ghost", "subtle", "link", "none"].includes(value),
  },
  disabled: { type: Boolean, required: false, default: false },
  hightContrast: { type: Boolean, required: false, default: false },
  label: { type: String, required: false, default: "" },
  position: { type: String, required: false, default: "bottom" },
  align: { type: String, required: false, default: "start" },
  placement: { type: String, required: false, default: "" },
  offset: { type: Number, required: false, default: 4 },
  fixed: { type: Boolean, required: false, default: false },
  items: { type: Array, required: false, default: () => [] },
});

const emit = defineEmits(["open", "close"]);

const effectiveTheme = computed(() => props.theme || getHostTheme());
const hexColor = computed(() => {
  const map = getColorMap(effectiveTheme.value as "light" | "dark");
  return map[props.color as keyof typeof map] || props.color;
});

const themeMap = computed(() => getColorMap(effectiveTheme.value as ThemeName));

const resolvedItems = computed(() =>
  (props.items || []).map((item: any) => ({
    ...item,
    color: item.color ? (themeMap.value[item.color as keyof typeof themeMap.value] || item.color) : undefined,
  })),
);

const dropdownRef = ref<InstanceType<typeof DropdownMenu> | null>(null);

defineExpose({
  open: () => dropdownRef.value?.open(),
  close: () => dropdownRef.value?.close(),
  toggle: () => dropdownRef.value?.toggle(),
  isOpen: () => dropdownRef.value?.isOpen || false,
});
</script>

<template>
  <DropdownMenu
    ref="dropdownRef"
    :color="hexColor"
    :variant="props.variant"
    :disabled="props.disabled"
    :hight-contrast="props.hightContrast"
    :label="props.label"
    :position="props.position"
    :align="props.align"
    :placement="props.placement"
    :fixed="props.fixed"
    :offset="props.offset"
    :menu-bg="themeMap.surface"
    :items="resolvedItems"
    @open="emit('open')"
    @close="emit('close')"
  >
    <div slot="toggle">
      <slot name="toggle"></slot>
    </div>
    <slot></slot>
  </DropdownMenu>
</template>

<style>
@unocss-placeholder;
</style>
