<script setup lang="ts">
import { ref, computed } from "vue";
import DropdownMenu from "../../controls/DropdownMenu.vue";

const props = defineProps({
  theme: { type: String, required: false, default: "" },
  color: {
    type: String,
    required: false,
    default: "neutral",
    validator: (value: string) =>
      ["primary", "secondary", "neutral", "success", "warning", "danger"].includes(value),
  },
  variant: {
    type: String,
    required: false,
    default: "ghost",
    validator: (value: string) =>
      ["solid", "outlined", "soft", "ghost", "subtle", "link", "none"].includes(value),
  },
  disabled: { type: Boolean, required: false, default: false },
  label: { type: String, required: false, default: "" },
  position: {
    type: String,
    required: false,
    default: "bottom",
    validator: (value: string) => ["bottom", "top"].includes(value),
  },
  align: {
    type: String,
    required: false,
    default: "start",
    validator: (value: string) => ["start", "center", "end"].includes(value),
  },
  textAlign: {
    type: String,
    required: false,
    default: "left",
    validator: (value: string) => ["left", "center", "right"].includes(value),
  },
  offset: { type: Number, required: false, default: 4 },
  fixed: { type: Boolean, required: false, default: false },
  items: { type: Array, required: false, default: () => [] },
});

const emit = defineEmits(["open", "close"]);

const resolvedItems = computed(() =>
  (props.items || []).map((item: any) => ({
    ...item,
    color: item.color || undefined,
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
    :color="props.color"
    :variant="props.variant"
    :disabled="props.disabled"
    :label="props.label"
    :position="props.position"
    :align="props.align"
    :text-align="props.textAlign"
    :fixed="props.fixed"
    :offset="props.offset"
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
