<script setup lang="ts">
import { type PropType } from "vue";
import NavbarHorizontal from "../../navigation/NavbarHorizontal.vue";
import { initTokens } from "@/plugins/cu-tokens/css";

initTokens();

const props = defineProps({
  /** Estructura de navegación. **Se asigna como propiedad JS** */
  items: { type: Array as () => unknown[], required: true },
  /** Cómo abren los submenús: `click` o `hover` */
  trigger: {
    type: String as PropType<'click' | 'hover'>,
    default: 'click',
  },
  /** Path activo manual. Si se omite, se toma de la ruta (cuando hay router) */
  activePath: { type: String, default: '' },
});
</script>

<template>
  <NavbarHorizontal
    :items="props.items"
    :trigger="props.trigger"
    :active-path="props.activePath"
  />
</template>

<style>
@unocss-placeholder;
</style>