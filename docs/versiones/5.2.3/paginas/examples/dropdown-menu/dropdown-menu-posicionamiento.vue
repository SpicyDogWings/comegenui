<script setup lang="ts">
// Refleja el ejemplo "Posicionamiento": `position` (bottom, top), `align`
// (start, center, end), `offset` y `fixed`.
const combos = [
  { label: "bottom / start", position: "bottom", align: "start" },
  { label: "bottom / center", position: "bottom", align: "center" },
  { label: "bottom / end", position: "bottom", align: "end" },
  { label: "top / start", position: "top", align: "start" },
  { label: "top / center", position: "top", align: "center" },
  { label: "top / end", position: "top", align: "end" },
] as const;

const items = [{ label: "Editar" }, { label: "Duplicar" }, { label: "Eliminar", color: "danger" }];
</script>

<template>
  <VanillaDemo :use="['CuDropdownMenu']">
    <div class="cu-demo-controls">
      <cu-dropdown-menu
        v-for="combo in combos"
        :key="combo.label"
        :label="combo.label"
        color="primary"
        variant="outlined"
        :position="combo.position"
        :align="combo.align"
        :items.prop="items"
      />
      <cu-dropdown-menu
        label="offset 16"
        color="primary"
        variant="outlined"
        :offset="16"
        :items.prop="items"
      />
      <cu-dropdown-menu label="fixed" color="primary" variant="outlined" fixed :items.prop="items" />
    </div>
  </VanillaDemo>
</template>
