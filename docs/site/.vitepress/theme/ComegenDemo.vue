<script setup lang="ts">
// docs/site/.vitepress/theme/ComegenDemo.vue
// Renderiza el demo real de un ejemplo de la ficha a partir de su `id`
// (el de `<!-- demo:id -->`). Registrado global → usable desde el markdown.
import { computed } from "vue";
import { demos } from "./comegen-demos";

const props = defineProps<{ id: string }>();

const demo = computed(() => demos[props.id]);
</script>

<template>
  <component :is="demo" v-if="demo" />
  <p v-else class="cu-demo-output">Demo «{{ id }}» no encontrado.</p>
</template>
