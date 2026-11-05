<script setup lang="ts">
import Autocomplete from "@/components/form/Autocomplete.vue";

// Alinea el texto del input y los items del panel (enfocá o escribí para verlo).
const aligns = ["left", "center", "right"] as const;

const items = [
  { label: "Administrador" },
  { label: "Editor de contenido" },
  { label: "Visor de reportes" },
];
</script>

<template>
  <Autocomplete
    v-for="align in aligns"
    :key="align"
    :placeholder="`textAlign: ${align}`"
    :text-align="align"
    :items="items"
  />
</template>
