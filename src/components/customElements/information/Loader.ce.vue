<script setup lang="ts">
import { type PropType } from "vue";
import Loader from "../../information/Loader.vue";
import { isColor, isLoaderAnimation } from "@/utils/validators";

const props = defineProps({
  /** Color semántico: `primary`, `secondary`, `neutral`, `success`, `warning`, `danger` */
  color: {
    type: String as PropType<"primary" | "secondary" | "neutral" | "success" | "warning" | "danger">,
    required: false,
    default: "primary",
    validator: isColor,
  },
  /** `loading` (barrido infinito) o `cooldown` (se consume una vez en `delay` ms) */
  animation: {
    type: String as PropType<"loading" | "cooldown">,
    required: false,
    default: "loading",
    validator: isLoaderAnimation,
  },
  /** Milisegundos que tarda en vaciarse `cooldown` (se ignora en `loading`) */
  delay: { type: Number, required: false, default: 2000 },
});
</script>

<template>
  <Loader :color="props.color" :animation="props.animation" :delay="props.delay" />
</template>

<style>
/* El loader interno es `position: absolute`: el host ancla la barra y la deja
   superpuesta al contenido que sigue. */
:host {
  display: block;
  position: relative;
}
@unocss-placeholder
</style>
