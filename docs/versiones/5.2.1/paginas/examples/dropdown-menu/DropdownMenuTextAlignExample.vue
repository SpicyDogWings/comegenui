<script setup lang="ts">
import DropdownMenu from "@/components/controls/DropdownMenu.vue";

// La alineación se ve al abrir cada menú: `textAlign` mueve el bloque ícono + label.
const pencil =
  '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 3a2.85 2.85 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/></svg>';

const aligns = ["left", "center", "right"] as const;

const items = [
  { label: "Editar", icon: pencil },
  { label: "Duplicar", icon: pencil },
  { label: "Eliminar", icon: pencil, color: "danger" },
];
</script>

<template>
  <div class="cu-demo-controls">
    <DropdownMenu
      v-for="align in aligns"
      :key="align"
      :label="`textAlign: ${align}`"
      color="primary"
      variant="outlined"
      :text-align="align"
      :items="items"
    />
  </div>
</template>
