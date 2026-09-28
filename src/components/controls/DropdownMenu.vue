<script setup lang="ts">
import { ref, computed, type PropType } from 'vue';
import { isAlign, isColor, isPosition, isTextAlign, isVariantFull } from '@/utils/validators'
import Dropdown from "../overlay/Dropdown.vue";
import Button from "../buttons/Button.vue";

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
  color: {
    type: String as PropType<'primary' | 'secondary' | 'neutral' | 'success' | 'warning' | 'danger'>,
    required: false,
    default: "neutral",
    validator: isColor,
  },
  variant: {
    type: String as PropType<'solid' | 'outlined' | 'soft' | 'ghost' | 'subtle' | 'link' | 'none'>,
    required: false,
    default: "ghost",
    validator: isVariantFull,
  },
  disabled: { type: Boolean, required: false, default: false },
  label: { type: String, required: false, default: "" },
  position: {
    type: String as PropType<'bottom' | 'top' | 'left' | 'right'>,
    required: false,
    default: "bottom",
    validator: isPosition,
  },
  align: {
    type: String as PropType<'start' | 'center' | 'end'>,
    required: false,
    default: "start",
    validator: isAlign,
  },
  textAlign: {
    type: String as PropType<'left' | 'center' | 'right'>,
    required: false,
    default: "left",
    validator: isTextAlign,
  },
  offset: { type: Number, required: false, default: 4 },
  fixed: { type: Boolean, required: false, default: false },
  items: { type: Array as () => DropdownItem[], required: false, default: () => [] },
});

const emit = defineEmits(["open", "close"]);
const dropdownRef = ref<InstanceType<typeof Dropdown> | null>(null);

const itemStyle = computed(() => ({ textAlign: props.textAlign }));

function handleItemClick(item: DropdownItem) {
  if (item.disabled || item.divider) return;
  if (item.onClick) item.onClick();
  dropdownRef.value?.close();
}

defineExpose({
  /** Abre el menú. */
  open: () => dropdownRef.value?.open(),
  /** Cierra el menú. */
  close: () => dropdownRef.value?.close(),
  /** Alterna la visibilidad del menú. */
  toggle: () => dropdownRef.value?.toggle(),
  /** Devuelve true si el menú está abierto. */
  isOpen: () => dropdownRef.value?.isOpen() ?? false,
});
</script>

<template>
  <Dropdown
    ref="dropdownRef"
    :color="color"
    :variant="variant"
    :disabled="disabled"
    :label="label"
    :position="position"
    :align="align"
    :offset="offset"
    :fixed="fixed"
    @open="emit('open')"
    @close="emit('close')"
  >
    <template #toggle="{ toggle, isOpen }">
      <!-- Contenido del trigger; scoped: { toggle, isOpen }. -->
      <slot name="toggle" :toggle="toggle" :isOpen="isOpen">
        <Button
          :color="color"
          :variant="variant"
          :disabled="disabled"
          class="cu-dropdown-toggle"
          @click="toggle"
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
            class="cu-dropdown-chevron"
            :class="{ 'cu-dropdown-chevron--open': isOpen }"
          >
            <path d="m18 15-6-6-6 6"/>
          </svg>
        </Button>
      </slot>
    </template>
    <template #default>
      <template v-if="items && items.length > 0">
        <template v-for="(item, i) in items" :key="i">
          <hr v-if="item.divider" class="cu-dropdown-divider" />
          <Button
            v-else
            :color="item.color || color"
            :variant="item.variant || 'ghost'"
            :to="item.href"
            :target="item.target"
            :disabled="item.disabled"
            class="cu-dropdown-item"
            :style="itemStyle"
            @click="handleItemClick(item)"
          >
            <span v-if="item.icon" v-html="item.icon" class="cu-dropdown-icon"></span>
            <span v-if="item.label">{{ item.label }}</span>
          </Button>
        </template>
      </template>
      <!-- Contenido del panel. -->
      <slot v-else></slot>
    </template>
  </Dropdown>
</template>

<style scoped>
.cu-dropdown-toggle {
  gap: var(--cu-space-md);
}

.cu-dropdown-divider {
  margin: var(--cu-space-xs) auto;
  width: 90%;
  border: 0;
  border-top: var(--cu-border-thin) solid var(--cu-border-color);
}

.cu-dropdown-item {
  width: 100%;
  justify-content: flex-start;
}

.cu-dropdown-icon {
  transform: translateY(2px);
  opacity: 0.6;
}

.cu-dropdown-chevron {
  transition: transform 200ms ease;
}

.cu-dropdown-chevron--open {
  transform: rotate(90deg);
}
</style>
