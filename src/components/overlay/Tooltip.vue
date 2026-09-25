<script setup lang="ts">
import { computed, type PropType } from "vue";
import { isAlign, isPosition } from '@/utils/validators'
import Popover from "./Popover.vue";

const props = defineProps({
  // Texto simple del tooltip. Si se usa el slot #content, tiene prioridad.
  text: { type: String, required: false, default: "" },
  color: {
    type: String as PropType<'primary' | 'secondary' | 'neutral' | 'success' | 'warning' | 'danger'>,
    required: false,
    default: "neutral",
  },
  position: {
    type: String as PropType<'bottom' | 'top' | 'left' | 'right'>,
    required: false,
    default: "top",
    validator: isPosition,
  },
  align: {
    type: String as PropType<'start' | 'center' | 'end'>,
    required: false,
    default: "center",
    validator: isAlign,
  },
  offset: { type: Number, required: false, default: 6 },
  // Delay (ms) hasta que aparece el tooltip al hacer hover.
  delay: { type: Number, required: false, default: 200 },
  disabled: { type: Boolean, required: false, default: false },
});

const tooltipStyles = computed(() => ({
  '--cu-popover-bg': `var(--cu-color-${props.color})`,
}));
</script>

<template>
  <Popover
    hover
    :position="position"
    :align="align"
    :offset="offset"
    :hover-delay="delay"
    :disabled="disabled"
    role="tooltip"
    :panel-class="'cu-tooltip-panel'"
    :style="tooltipStyles"
    class="cu-tooltip"
  >
    <template #toggle>
      <slot />
    </template>
    <slot name="content">{{ text }}</slot>
  </Popover>
</template>

<style scoped>
.cu-tooltip {
  --cu-popover-width: max-content;
  --cu-popover-min-width: 0;
  --cu-popover-max-width: 18rem;
}

.cu-tooltip :deep(.cu-tooltip-panel) {
  color: var(--cu-color-surface);
  font-size: var(--cu-font-size-xs);
  font-weight: var(--cu-font-weight-medium);
  padding: var(--cu-space-xs) var(--cu-space-sm);
  border-radius: var(--cu-radius-sm);
  box-shadow: var(--cu-shadow-md);
}
</style>