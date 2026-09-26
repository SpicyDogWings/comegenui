<script setup lang="ts">
import Avatar from "../../information/Avatar.vue";
import { initTokens } from "@/plugins/cu-tokens/css";
import type { PropType } from "vue";

initTokens();

const props = defineProps({
  /** Color semántico: `primary`, `secondary`, `neutral`, `success`, `warning`, `danger`. Si se omite, se elige por hash de las iniciales */
  color: { type: String as PropType<'primary' | 'secondary' | 'neutral' | 'success' | 'warning' | 'danger'>, default: "" },
  /** Tamaño: `sm`, `md`, `lg` */
  size: { type: String as PropType<'sm' | 'md' | 'lg'>, default: "md" },
  /** Texto que se muestra como iniciales cuando no hay `src` */
  initials: { type: String, default: "" },
  /** URL de la imagen */
  src: { type: String, default: "" },
});
</script>

<template>
  <Avatar :color="props.color" :size="props.size" :initials="props.initials" :src="props.src">
    <!-- Contenido del avatar (alternativo a `initials`) -->
    <slot></slot>
  </Avatar>
</template>
