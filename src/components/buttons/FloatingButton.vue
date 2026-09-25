<script setup lang="ts">
import { type PropType } from "vue";
import Button from "./Button.vue";

const props = defineProps({
  /** Color semántico del FAB: `primary`, `secondary`, `neutral`, `success`, `warning`, `danger` */
  color: {
    type: String as PropType<'primary' | 'secondary' | 'neutral' | 'success' | 'warning' | 'danger'>,
    required: false,
    default: "primary",
  },
  /** Variante visual, heredada de `Button`: `solid`, `outlined`, `soft`, `ghost`, `subtle`, `link`, `none` */
  variant: {
    type: String,
    required: false,
    default: "solid",
    validator: (value: string) =>
      ["solid", "outlined", "soft", "ghost", "subtle", "link", "none"].includes(value),
  },
  /** Tamaño, heredado de `Button`: `sm`, `md`, `lg` */
  size: {
    type: String as PropType<'sm' | 'md' | 'lg'>,
    required: false,
    default: "lg",
    validator: (value: string) => ["sm", "md", "lg"].includes(value),
  },
  /** Deshabilita el botón. */
  disabled: {
    type: Boolean,
    required: false,
    default: false,
  },
  /** Muestra un spinner y deshabilita el botón mientras está activo. */
  loading: {
    type: Boolean,
    required: false,
    default: false,
  },
});
</script>

<template>
  <Button
    :color="props.color"
    :variant="props.variant"
    :size="props.size"
    :disabled="props.disabled"
    :loading="props.loading"
    class="cu-floating-button"
  >
    <slot />
  </Button>
</template>

<style scoped>
/* Clase duplicada a propósito: (0,3,0) le gana a `.cu-button` (0,2,0) de
   Button.vue, sin depender del orden de inyección de estilos. */
.cu-floating-button.cu-floating-button {
  position: fixed;
  bottom: var(--cu-space-lg);
  right: var(--cu-space-lg);
  z-index: 1000;
  box-shadow: var(--cu-shadow-lg);
}

.cu-floating-button.cu-floating-button:hover:not(.cu-button--disabled) {
  box-shadow: var(--cu-shadow-xl);
  transform: translateY(-2px);
}
</style>
