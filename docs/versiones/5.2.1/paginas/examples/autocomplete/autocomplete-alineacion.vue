<script setup lang="ts">
// Refleja el ejemplo "Alineación del texto": `text-align` con sus 3 valores.
// Alinea el texto del input y los items del panel (enfocá o escribí para verlo).
const aligns = ["left", "center", "right"] as const;

const items = [
  { label: "Administrador" },
  { label: "Editor de contenido" },
  { label: "Visor de reportes" },
];
</script>

<template>
  <VanillaDemo :use="['CuAutocomplete']">
    <cu-autocomplete
      v-for="align in aligns"
      :key="align"
      :placeholder="`text-align: ${align}`"
      :text-align="align"
      :items.prop="items"
    ></cu-autocomplete>
  </VanillaDemo>
</template>
