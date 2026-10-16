<script setup lang="ts">
// Refleja el ejemplo "Alineación del texto": `textAlign` con sus 3 valores.
const aligns = ["left", "center", "right"] as const;

const items = [{ label: "Editar" }, { label: "Duplicar" }, { label: "Eliminar", color: "danger" }];
</script>

<template>
  <VanillaDemo :use="['CuDropdownMenu']">
    <div class="cu-demo-controls">
      <cu-dropdown-menu
        v-for="align in aligns"
        :key="align"
        :label="align"
        color="primary"
        variant="outlined"
        :text-align="align"
        :items.prop="items"
      />
    </div>
  </VanillaDemo>
</template>
