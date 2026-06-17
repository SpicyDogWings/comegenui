<script setup lang="ts">
import { ref } from "vue";
import Dropdown from "./Dropdown.vue";
import Button from "./Button.vue";

interface DropdownItem {
  label?: string;
  icon?: string;
  href?: string;
  onClick?: () => void;
  color?: string;
  variant?: string;
  disabled?: boolean;
  divider?: boolean;
  target?: string;
}

const props = defineProps({
  color: { type: String, required: false, default: "#2c2c2c" },
  hightContrast: { type: Boolean, required: false, default: false },
  variant: { type: String, required: false, default: "ghost" },
  disabled: { type: Boolean, required: false, default: false },
  label: { type: String, required: false, default: "" },
  position: { type: String, required: false, default: "bottom" },
  align: { type: String, required: false, default: "start" },
  placement: { type: String, required: false, default: "" },
  offset: { type: Number, required: false, default: 4 },
  menuBg: { type: String, required: false, default: "#ffffff" },
  items: { type: Array as () => DropdownItem[], required: false, default: () => [] },
});

const emit = defineEmits(["open", "close"]);
const dropdownRef = ref<InstanceType<typeof Dropdown> | null>(null);

function handleItemClick(item: DropdownItem) {
  if (item.disabled || item.divider) return;
  if (item.onClick) item.onClick();
  dropdownRef.value?.close();
}

defineExpose({
  open: () => dropdownRef.value?.open(),
  close: () => dropdownRef.value?.close(),
  toggle: () => dropdownRef.value?.toggle(),
  get isOpen() { return dropdownRef.value?.isOpen || false },
});
</script>

<template>
  <Dropdown
    ref="dropdownRef"
    :color="color"
    :variant="variant"
    :disabled="disabled"
    :hight-contrast="hightContrast"
    :label="label"
    :position="position"
    :align="align"
    :placement="placement"
    :offset="offset"
    :menu-bg="menuBg"
    @open="emit('open')"
    @close="emit('close')"
  >
    <template #toggle>
      <slot name="toggle" :toggle="dropdownRef?.toggle" :isOpen="dropdownRef?.isOpen">
        <Button
          :color="color"
          :variant="variant"
          :disabled="disabled"
          :hight-contrast="hightContrast"
          @click="dropdownRef?.toggle"
        >
          {{ label || "Menú" }}
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
            :class="{ 'rotate-180': dropdownRef?.isOpen }"
            class="transition-transform duration-200"
          >
            <path d="m6 9 6 6 6-6"/>
          </svg>
        </Button>
      </slot>
    </template>
    <template #default>
      <template v-if="items && items.length > 0">
        <template v-for="(item, i) in items" :key="i">
          <hr v-if="item.divider" class="my-1 w-[90%] mx-auto border-0 border-t border-t-neutral-50" />
          <Button
            v-else
            :color="item.color || color"
            :variant="item.variant || 'ghost'"
            :to="item.href"
            :target="item.target"
            :disabled="item.disabled"
            :hight-contrast="hightContrast"
            style="width:100%;justify-content:flex-start"
            @click="handleItemClick(item)"
          >
            <span v-if="item.icon" v-html="item.icon" class="transform translate-y-0.5"></span>
            <span v-if="item.label">{{ item.label }}</span>
          </Button>
        </template>
      </template>
      <slot v-else></slot>
    </template>
  </Dropdown>
</template>

<style>
@unocss-placeholder;
</style>
