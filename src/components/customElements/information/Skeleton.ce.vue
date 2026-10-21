<script setup lang="ts">
import { type PropType } from "vue";
import Skeleton from "../../information/Skeleton.vue";
import { isColor, isSkeletonAnimation, isSkeletonRadius, isSkeletonShape } from '@/utils/validators'

const props = defineProps({
  /** `rect` (bloque), `circle` (avatar) o `text` (líneas de texto) */
  shape: {
    type: String as PropType<'rect' | 'circle' | 'text'>,
    default: "rect",
    validator: isSkeletonShape,
  },
  /** Ancho CSS (`100%`, `48px`, `12rem`); vacío = el default del `shape` */
  width: {
    type: String,
    default: "",
  },
  /** Alto CSS (`1rem`, `48px`); vacío = el default del `shape` (en `text`, alto de cada línea) */
  height: {
    type: String,
    default: "",
  },
  /** Cantidad de barras con `shape="text"` (se ignora en `rect` y `circle`) */
  lines: {
    type: Number,
    default: 1,
  },
  /** `pulse` (opacidad), `wave` (barrido) o `none`; con `prefers-reduced-motion` no anima */
  animation: {
    type: String as PropType<'pulse' | 'wave' | 'none'>,
    default: "pulse",
    validator: isSkeletonAnimation,
  },
  /** Color semántico: `primary`, `secondary`, `neutral`, `success`, `warning`, `danger` */
  color: {
    type: String as PropType<'primary' | 'secondary' | 'neutral' | 'success' | 'warning' | 'danger'>,
    default: "neutral",
    validator: isColor,
  },
  /** Radio de las esquinas; vacío = el default del `shape` (`rect` md, `circle` full, `text` sm) */
  radius: {
    type: String as PropType<'none' | 'sm' | 'md' | 'lg' | 'full'>,
    default: "",
    validator: isSkeletonRadius,
  },
});
</script>

<template>
  <Skeleton
    :shape="props.shape"
    :width="props.width"
    :height="props.height"
    :lines="props.lines"
    :animation="props.animation"
    :color="props.color"
    :radius="props.radius"
  />
</template>

<style>
:host {
  display: block;
}

/* Un círculo ocupa sólo su tamaño: puede ir dentro de una fila de texto. */
:host([shape="circle"]) {
  display: inline-block;
}

@unocss-placeholder
</style>
