<script setup lang="ts">
import { type PropType } from "vue";
import { isSize, isVariantFull } from '@/utils/validators'
import Button from "./Button.vue";

/**
 * Posición del FAB sin props: quien consume define `--cu-fab-bottom` /
 * `--cu-fab-right` en el host (o en `:root`) y el botón usa ese margen; el
 * default es el spacing del tema. Va inline porque en el custom element el
 * `<button>` vive en el shadow: una clase/`bottom` en el host no lo alcanza,
 * mientras que las custom properties sí heredan.
 *
 * La zona segura de iOS (home indicator, esquinas redondeadas) se suma siempre;
 * en desktop `env()` resuelve a 0 y el margen queda igual que antes.
 */
const fabStyles = {
  bottom: 'calc(var(--cu-fab-bottom, var(--cu-space-lg)) + env(safe-area-inset-bottom, 0px))',
  right: 'calc(var(--cu-fab-right, var(--cu-space-lg)) + env(safe-area-inset-right, 0px))',
};

const props = defineProps({
  /** Color semántico del FAB: `primary`, `secondary`, `neutral`, `success`, `warning`, `danger` */
  color: {
    type: String as PropType<'primary' | 'secondary' | 'neutral' | 'success' | 'warning' | 'danger'>,
    required: false,
    default: "primary",
  },
  /** Variante visual, heredada de `Button`: `solid`, `outlined`, `soft`, `ghost`, `subtle`, `link`, `none` */
  variant: {
    type: String as PropType<'solid' | 'outlined' | 'soft' | 'ghost' | 'subtle' | 'link' | 'none'>,
    required: false,
    default: "solid",
    validator: isVariantFull,
  },
  /** Tamaño, heredado de `Button`: `sm`, `md`, `lg` */
  size: {
    type: String as PropType<'sm' | 'md' | 'lg'>,
    required: false,
    default: "lg",
    validator: isSize,
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
    :style="fabStyles"
  >
    <slot />
  </Button>
</template>

<style scoped>
/* Clase duplicada a propósito: (0,3,0) le gana a `.cu-button` (0,2,0) de
   Button.vue, sin depender del orden de inyección de estilos. */
.cu-floating-button.cu-floating-button {
  position: fixed;
  /* `bottom` y `right` van inline (`:style`) para que `--cu-fab-bottom/right`
     funcione igual en Vue y en el custom element. */
  /* Debajo de la capa de overlays (Modal 1000, SideOver 1100): con el mismo
     `z-index` que el modal, un FAB declarado después en el DOM quedaba pintado y
     clickeable por encima del diálogo abierto. */
  z-index: 900;
  box-shadow: var(--cu-shadow-lg);
}

.cu-floating-button.cu-floating-button:hover:not(.cu-button--disabled) {
  box-shadow: var(--cu-shadow-xl);
  transform: translateY(-2px);
}
</style>
