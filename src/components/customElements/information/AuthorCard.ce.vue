<script setup lang="ts">
import AuthorCard from "../../information/AuthorCard.vue";
import { initTokens } from "@/plugins/cu-tokens/css";

initTokens();

const props = defineProps({
  /** Nombre del autor. Genera las iniciales automáticamente (primeras letras del primero y último nombre) */
  name: { type: String, required: true },
  /** Rol o cargo que se muestra bajo el nombre (se oculta si está vacío) */
  role: { type: String, default: "" },
  /** Color semántico del avatar: `primary`, `secondary`, `neutral`, `success`, `warning`, `danger`. Si se omite, se elige por hash de las iniciales */
  color: { type: String, default: "" },
  /** Tamaño del avatar: `sm`, `md`, `lg` */
  size: { type: String, default: "md" },
  /** URL de la imagen del avatar (reemplaza las iniciales) */
  src: { type: String, default: "" },
});
</script>

<template>
  <AuthorCard :name="props.name" :role="props.role" :color="props.color" :size="props.size" :src="props.src" />
</template>
