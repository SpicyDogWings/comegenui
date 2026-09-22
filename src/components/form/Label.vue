<script setup lang="ts">
import { computed, type PropType } from "vue";

const props = defineProps({
  for: {
    type: String,
    required: false,
    default: "",
  },
  label: {
    type: String,
    required: false,
    default: "",
  },
  color: {
    type: String as PropType<'primary' | 'secondary' | 'neutral' | 'success' | 'warning' | 'danger'>,
    required: false,
    default: "neutral",
  },
  hightContrast: {
    type: Boolean,
    required: false,
    default: false,
  },
});

const colorStyles = computed(() => ({
  '--label-fg': `var(--cu-color-${props.color})`,
}));

const emit = defineEmits<{
  (e: 'click'): void
}>()

const handleClick = () => {
  if (props.for) {
    const target = document.getElementById(props.for);
    if (target) target.focus();
  }
  emit('click');
};
</script>

<template>
  <label
    :style="colorStyles"
    class="cu-label"
  >
    <span v-if="props.label" @click="handleClick" class="cu-label-text">{{ props.label }}</span>
    <slot></slot>
  </label>
</template>

<style scoped>
.cu-label {
  display: inline-flex;
  flex-direction: column;
  gap: var(--cu-space-xs);
  font-family: var(--cu-font-sans);
}

.cu-label-text {
  width: fit-content;
  cursor: pointer;
  font-family: var(--cu-font-sans);
}

/* Clases duplicadas a propósito: le ganan a las reglas globales del
   consumidor que fuerzan color en label/span (p. ej. el playground:
   `.playground :is(..., span, label)` → (0,2,1)). Scoped compila a (0,3,0). */
.cu-label.cu-label,
.cu-label-text.cu-label-text {
  color: var(--label-fg);
}
</style>
