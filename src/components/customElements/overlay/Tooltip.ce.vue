<script setup lang="ts">
import Tooltip from "../../overlay/Tooltip.vue";
import { initTokens } from "@/plugins/cu-tokens/css";

initTokens();

const props = defineProps({
  /** Texto del tooltip. Si se usa el slot `content`, tiene prioridad */
  text: { type: String, default: "" },
  /** Color semántico del fondo: `primary`, `secondary`, `neutral`, `success`, `warning`, `danger` */
  color: { type: String, default: "neutral" },
  /** Lado donde aparece: `top`, `bottom`, `left`, `right` */
  position: { type: String, default: "top" },
  /** Alineación respecto al elemento: `start`, `center`, `end` */
  align: { type: String, default: "center" },
  /** Distancia (px) entre el elemento y el tooltip */
  offset: { type: Number, default: 6 },
  /** Retardo (ms) antes de mostrar el tooltip al hacer hover */
  delay: { type: Number, default: 200 },
  /** Deshabilita el tooltip (no se muestra) */
  disabled: { type: Boolean, default: false },
});
</script>

<template>
  <Tooltip
    :text="props.text"
    :color="props.color"
    :position="props.position"
    :align="props.align"
    :offset="props.offset"
    :delay="props.delay"
    :disabled="props.disabled"
  >
    <slot></slot>
  </Tooltip>
</template>