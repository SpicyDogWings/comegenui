<script setup lang="ts">
// Refleja el ejemplo "Variantes": las 7 variantes del toggle, con color primary.
const variants = ["solid", "outlined", "soft", "ghost", "subtle", "link", "none"] as const;

const items = [{ label: "Editar" }, { label: "Duplicar" }, { label: "Eliminar", color: "danger" }];
</script>

<template>
  <VanillaDemo :use="['CuDropdownMenu']">
    <div class="cu-demo-controls">
      <cu-dropdown-menu
        v-for="variant in variants"
        :key="variant"
        :label="variant"
        color="primary"
        :variant="variant"
        :items.prop="items"
      />
    </div>
  </VanillaDemo>
</template>
