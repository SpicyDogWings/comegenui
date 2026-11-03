<script setup lang="ts">
import Tooltip from "../../overlay/Tooltip.vue";
import { onMounted, onUnmounted, ref, useHost, type PropType } from "vue";
import { isAlign, isColor, isPosition } from "@/utils/validators";

const props = defineProps({
  /** Texto del tooltip. Si se usa el slot `content`, tiene prioridad */
  text: { type: String, default: "" },
  /** Color semántico del fondo: `primary`, `secondary`, `neutral`, `success`, `warning`, `danger` */
  color: { type: String as PropType<'primary' | 'secondary' | 'neutral' | 'success' | 'warning' | 'danger'>, default: "neutral", validator: isColor },
  /** Lado donde aparece: `top`, `bottom`, `left`, `right` */
  position: { type: String as PropType<'bottom' | 'top' | 'left' | 'right'>, default: "top", validator: isPosition },
  /** Alineación respecto al elemento: `start`, `center`, `end` */
  align: { type: String as PropType<'start' | 'center' | 'end'>, default: "center", validator: isAlign },
  /** Distancia (px) entre el elemento y el tooltip */
  offset: { type: Number, default: 6 },
  /** Retardo (ms) antes de mostrar el tooltip al hacer hover */
  delay: { type: Number, default: 200 },
  /** Deshabilita el tooltip (no se muestra) */
  disabled: { type: Boolean, default: false },
});

// Un CE con shadow root no tiene `$slots`: el slot `content` lo asigna el navegador
// al `<slot name="content">` del shadow tree. Si el host no trae ningún hijo con
// `slot="content"`, hay que NO reenviar el slot, o un slot vacío pisaría el fallback
// `text` del `.vue` (y el tooltip quedaría en blanco). Por eso se mira la luz del
// host en vez de `useSlots()`.
const host = useHost() as HTMLElement | null;
const hasContent = ref(false);
let observer: MutationObserver | null = null;

function syncContent() {
  hasContent.value = !!host?.querySelector('[slot="content"]');
}

onMounted(() => {
  if (!host) return;
  syncContent();
  // El contenido puede llegar después del upgrade (render diferido, frameworks):
  // altas/bajas de hijos o cambios del atributo `slot` recalculan la presencia.
  observer = new MutationObserver(syncContent);
  observer.observe(host, {
    childList: true,
    subtree: true,
    attributes: true,
    attributeFilter: ["slot"],
  });
});

onUnmounted(() => {
  observer?.disconnect();
  observer = null;
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
    <!-- El elemento que dispara el tooltip al hacer hover -->
    <slot></slot>
    <template v-if="hasContent" #content>
      <slot name="content"></slot>
    </template>
  </Tooltip>
</template>
