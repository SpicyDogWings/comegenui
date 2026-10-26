<script setup lang="ts">
// Refleja el ejemplo "Alineación del texto": `text-align` con sus 3 valores.
// La alineación se ve en el panel (abrí cada menú): mueve el bloque ícono + label.
const aligns = ["left", "center", "right"] as const;

const pencil =
  '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 3a2.85 2.85 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/></svg>';

const items = [
  { label: "Editar", icon: pencil },
  { label: "Duplicar", icon: pencil },
  { label: "Eliminar", icon: pencil, color: "danger" },
];
</script>

<template>
  <VanillaDemo :use="['CuDropdownMenu']">
    <div class="cu-demo-controls">
      <cu-dropdown-menu
        v-for="align in aligns"
        :key="align"
        :label="`text-align: ${align}`"
        color="primary"
        variant="outlined"
        :text-align="align"
        :items.prop="items"
      />
    </div>
  </VanillaDemo>
</template>
