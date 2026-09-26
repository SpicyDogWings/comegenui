<script setup lang="ts">
import Tooltip from "../../overlay/Tooltip.vue";
import { initTokens } from "@/plugins/cu-tokens/css";
import { computed, useSlots, type PropType } from "vue";

initTokens();

const props = defineProps({
  /** Texto del tooltip. Si se usa el slot `content`, tiene prioridad */
  text: { type: String, default: "" },
  /** Color semántico del fondo: `primary`, `secondary`, `neutral`, `success`, `warning`, `danger` */
  color: { type: String as PropType<'primary' | 'secondary' | 'neutral' | 'success' | 'warning' | 'danger'>, default: "neutral" },
  /** Lado donde aparece: `top`, `bottom`, `left`, `right` */
  position: { type: String as PropType<'bottom' | 'top' | 'left' | 'right'>, default: "top" },
  /** Alineación respecto al elemento: `start`, `center`, `end` */
  align: { type: String as PropType<'start' | 'center' | 'end'>, default: "center" },
  /** Distancia (px) entre el elemento y el tooltip */
  offset: { type: Number, default: 6 },
  /** Retardo (ms) antes de mostrar el tooltip al hacer hover */
  delay: { type: Number, default: 200 },
  /** Deshabilita el tooltip (no se muestra) */
  disabled: { type: Boolean, default: false },
});

const slots = useSlots();
// El slot `content` del `.vue` tiene fallback a `text`: sólo se forwardea si el
// host realmente lo trae; si no, un slot vacío pisaría el fallback.
const hasContent = computed(() => !!slots.content);
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
    <!-- El elemento que dispara el tooltip al hacer hover -->
    <slot></slot>
    <template v-if="hasContent" #content>
      <slot name="content"></slot>
    </template>
  </Tooltip>
</template>