<script setup lang="ts">
// Refleja el ejemplo "Items": todos los campos del array `items` (label, icon,
// color, variant, disabled, divider, href, target, selected y onClick).
import { ref } from "vue";

const salida = ref("(sin clicks todavía)");

const lapiz =
  '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 3a2.85 2.85 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/></svg>';
const copiar =
  '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg>';
const basura =
  '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>';

const items = [
  { label: "Editar", icon: lapiz, selected: true, onClick: () => (salida.value = "Editar") },
  { label: "Duplicar", icon: copiar, variant: "soft", onClick: () => (salida.value = "Duplicar") },
  { label: "Deshabilitado", disabled: true },
  { divider: true },
  { label: "Sitio externo", href: "https://developer.mozilla.org", target: "_blank" },
  { label: "Eliminar", icon: basura, color: "danger", onClick: () => (salida.value = "Eliminar") },
];
</script>

<template>
  <VanillaDemo :use="['CuDropdownMenu']">
    <cu-dropdown-menu
      label="Acciones"
      color="neutral"
      variant="outlined"
      :items.prop="items"
    />
    <pre class="cu-demo-output">{{ salida }}</pre>
  </VanillaDemo>
</template>
