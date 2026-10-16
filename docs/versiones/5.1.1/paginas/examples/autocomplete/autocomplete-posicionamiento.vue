<script setup lang="ts">
// Refleja el ejemplo "Posicionamiento": `position` + `align`.
// Se cargan items para que el panel tenga contenido al abrir.
const items = [
  { label: "Opción A" },
  { label: "Opción B" },
  { label: "Opción C" },
];
</script>

<template>
  <VanillaDemo :use="['CuAutocomplete']">
    <cu-autocomplete
      position="top"
      align="end"
      placeholder="position=top / align=end"
      :items.prop="items"
    ></cu-autocomplete>
    <cu-autocomplete
      position="bottom"
      align="end"
      placeholder="position=bottom / align=end"
      :items.prop="items"
    ></cu-autocomplete>
  </VanillaDemo>
</template>
