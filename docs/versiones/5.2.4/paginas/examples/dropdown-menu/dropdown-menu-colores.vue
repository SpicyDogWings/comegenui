<script setup lang="ts">
// Refleja el ejemplo "Colores": los 6 nombres semánticos del toggle, con variant solid.
const colors = ["primary", "secondary", "neutral", "success", "warning", "danger"] as const;

const items = [{ label: "Editar" }, { label: "Duplicar" }, { label: "Eliminar", color: "danger" }];
</script>

<template>
  <VanillaDemo :use="['CuDropdownMenu']">
    <div class="cu-demo-controls">
      <cu-dropdown-menu
        v-for="color in colors"
        :key="color"
        :label="color"
        :color="color"
        variant="solid"
        :items.prop="items"
      />
    </div>
  </VanillaDemo>
</template>
