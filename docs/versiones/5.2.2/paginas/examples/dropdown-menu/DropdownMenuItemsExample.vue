<script setup lang="ts">
import { ref } from "vue";
import DropdownMenu from "@/components/controls/DropdownMenu.vue";

const salida = ref("Sin acciones todavía.");

const lapiz =
  '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 3a2.85 2.85 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/></svg>';
const copiar =
  '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="14" height="14" x="8" y="8" rx="2"/><path d="M4 16V4a2 2 0 0 1 2-2h12"/></svg>';
const basura =
  '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"/><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>';

const items = [
  { label: "Editar", icon: lapiz, onClick: () => (salida.value = "Editar") },
  { label: "Duplicar", icon: copiar, onClick: () => (salida.value = "Duplicar") },
  { label: "Deshabilitado", disabled: true },
  { divider: true },
  { label: "Sitio externo", href: "https://developer.mozilla.org", target: "_blank" },
  { label: "Eliminar", icon: basura, color: "danger", variant: "ghost", onClick: () => (salida.value = "Eliminar") },
];
</script>

<template>
  <DropdownMenu label="Acciones" color="neutral" variant="outlined" :items="items" />
  <pre class="cu-demo-output">{{ salida }}</pre>
</template>
