<script setup lang="ts">
import { ref, getCurrentInstance, onMounted, onBeforeUnmount, type PropType } from "vue";
import Divider from "../../information/Divider.vue";
import { isColor, isDividerVariant, isOrientation } from '@/utils/validators'

const props = defineProps({
  /** `horizontal` (línea de izquierda a derecha) o `vertical` (de arriba a abajo) */
  orientation: {
    type: String as PropType<'horizontal' | 'vertical'>,
    default: "horizontal",
    validator: isOrientation,
  },
  /** Texto centrado sobre la línea; la línea se corta a los costados */
  label: { type: String, default: "" },
  /** `solid`, `dashed`, `dotted` */
  variant: {
    type: String as PropType<'solid' | 'dashed' | 'dotted'>,
    default: "solid",
    validator: isDividerVariant,
  },
  /** Color semántico del trazo: `primary`, `secondary`, `neutral`, `success`, `warning`, `danger` */
  color: {
    type: String as PropType<'primary' | 'secondary' | 'neutral' | 'success' | 'warning' | 'danger'>,
    default: "neutral",
    validator: isColor,
  },
});

const instance = getCurrentInstance();

// El CE siempre declara un `<slot>` en su template, así que el Divider interno
// vería `$slots.default` aunque el host no tenga hijos y con label vacío
// renderizaría el contenedor con rol en vez del `<hr>`. Sólo pasamos el slot
// cuando el host tiene contenido real (ignorando espacios y comentarios) y
// reaccionamos si ese contenido cambia.
const hasHostContent = ref(false);
let hostObserver: MutationObserver | null = null;

function nodeCountsAsContent(node: ChildNode): boolean {
  if (node.nodeType === Node.TEXT_NODE) return !!node.textContent?.trim();
  if (node.nodeType === Node.COMMENT_NODE) return false;
  return true;
}

onMounted(() => {
  const el = instance?.vnode.el as HTMLElement | null;
  const host = (el?.getRootNode() as ShadowRoot | null)?.host as HTMLElement | null;
  if (!host) return;

  const update = () => {
    hasHostContent.value = Array.from(host.childNodes).some(nodeCountsAsContent);
  };

  update();
  hostObserver = new MutationObserver(update);
  hostObserver.observe(host, { childList: true, subtree: true, characterData: true });
});

onBeforeUnmount(() => hostObserver?.disconnect());
</script>

<template>
  <Divider
    :orientation="props.orientation"
    :label="props.label"
    :variant="props.variant"
    :color="props.color"
  >
    <!-- Contenido rico sobre la línea (reemplaza el texto de `label`) -->
    <template v-if="hasHostContent" #default>
      <slot></slot>
    </template>
  </Divider>
</template>

<style>
:host {
  display: block;
}
/* En una fila flex el divisores vertical toma el alto del contenedor. */
:host([orientation="vertical"]) {
  align-self: stretch;
}
@unocss-placeholder
</style>
