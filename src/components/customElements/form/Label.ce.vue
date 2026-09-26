<script setup lang="ts">
import { type PropType } from "vue";
import Label from "../../form/Label.vue";

const props = defineProps({
  /** ID del elemento a enfocar al hacer clic (atributo HTML `for`) */
  for: {
    type: String,
    required: false,
    default: "",
  },
  /** Texto del label (modo declarativo) */
  label: {
    type: String,
    required: false,
    default: "",
  },
  /** Color semántico del texto; se resuelve vía el token `--cu-color-{color}` */
  color: {
    type: String as PropType<'primary' | 'secondary' | 'neutral' | 'success' | 'warning' | 'danger'>,
    required: false,
    default: "neutral",
  },
  /** Modo de alto contraste para el texto */
  hightContrast: {
    type: Boolean,
    required: false,
    default: false,
  },
});
</script>

<template>
  <Label
    :for="props.for"
    :label="props.label"
    :color="props.color"
    :hight-contrast="props.hightContrast"
  >
    <!-- Contenido asociado (input, checkbox, etc.) -->
    <slot></slot>
  </Label>
</template>

<style>
@unocss-placeholder;
</style>
