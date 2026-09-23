<script setup lang="ts">
import Avatar from "../../information/Avatar.vue";
import { initTokens } from "@/plugins/cu-tokens/css";

initTokens();

const props = defineProps({
  /** Color semántico: `primary`, `secondary`, `neutral`, `success`, `warning`, `danger`. Si se omite, se elige por hash de las iniciales */
  color: { type: String, default: "" },
  /** Tamaño: `sm`, `md`, `lg` */
  size: { type: String, default: "md" },
  /** Texto que se muestra como iniciales cuando no hay `src` */
  initials: { type: String, default: "" },
  /** URL de la imagen. **Nota:** el wrapper CE declara la prop pero no la forwardea al componente interno (ver `docs/notes/05-wrappers-ce-incompletos.md`); por ahora la imagen no se renderiza vía Custom Element */
  src: { type: String, default: "" },
});
</script>

<template>
  <Avatar :color="props.color" :size="props.size" :initials="props.initials" />
</template>
