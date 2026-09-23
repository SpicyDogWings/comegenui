<script setup lang="ts">
import { getCurrentInstance, type PropType } from "vue";
import Card from "../../information/Card.vue";
import { initTokens } from "@/plugins/cu-tokens/css";

initTokens();

const props = defineProps({
  /** Color semántico: `primary`, `secondary`, `neutral`, `success`, `warning`, `danger` */
  color: {
    type: String as PropType<'primary' | 'secondary' | 'neutral' | 'success' | 'warning' | 'danger'>,
    default: "neutral",
  },
  /** `ghost` (default), `outlined`, `soft`, `subtle`, `solid` */
  variant: {
    type: String,
    default: "ghost",
  },
  /** `vertical` (media arriba) o `horizontal` (media al costado) */
  layout: {
    type: String as PropType<'vertical' | 'horizontal'>,
    default: "vertical",
  },
  /** Título del header */
  title: String,
  /** Subtítulo bajo el título */
  subtitle: String,
  /** URL de imagen que se muestra como media en la parte superior (o al costado con `layout="horizontal"`) */
  image: String,
});

const instance = getCurrentInstance();
function ceEmit(event: string, payload: unknown) {
  const el = instance?.vnode.el as HTMLElement | null;
  const host = el?.getRootNode()?.host || el;
  if (host) {
    host.dispatchEvent(new CustomEvent(event, {
      detail: payload,
      bubbles: true,
      composed: true,
    }));
  }
}
</script>

<template>
  <Card
    :color="props.color"
    :variant="props.variant"
    :layout="props.layout"
    :title="props.title"
    :subtitle="props.subtitle"
    :image="props.image"
    @click="ceEmit('click', $event)"
  >
    <template #media>
      <!-- Contenido de la parte superior (si no se usa el prop `image`). Reemplaza la imagen -->
      <slot name="media"></slot>
    </template>
    <template #header>
      <!-- Reemplaza el título/subtítulo por defecto -->
      <slot name="header"></slot>
    </template>
    <template #footer>
      <!-- Contenido al pie de la tarjeta (se separa con una línea) -->
      <slot name="footer"></slot>
    </template>
    <!-- Contenido principal del cuerpo de la tarjeta -->
    <slot></slot>
  </Card>
</template>

<style>
@unocss-placeholder;
:host {
  display: block;
  width: 100%;
}
</style>
