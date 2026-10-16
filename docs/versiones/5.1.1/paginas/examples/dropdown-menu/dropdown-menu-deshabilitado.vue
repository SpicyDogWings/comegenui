<script setup lang="ts">
// Refleja el ejemplo "Estados": el toggle con `disabled`.
const items = [{ label: "Editar" }, { label: "Duplicar" }, { label: "Eliminar", color: "danger" }];
</script>

<template>
  <VanillaDemo :use="['CuDropdownMenu']">
    <cu-dropdown-menu
      label="Deshabilitado"
      color="primary"
      variant="solid"
      disabled
      :items.prop="items"
    />
  </VanillaDemo>
</template>
