<script setup lang="ts">
import Tabs from "@/components/Tabs.vue";

// El icono de cada tab puede venir en el campo `icon` del item (HTML/SVG string)
// o por el slot dinámico `tab-icon-{key}` (ver el ejemplo de Slots).
const homeIcon =
  '<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><path d="M9 22V12h6v10"/></svg>';
const userIcon =
  '<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>';

const tabs = [
  { key: "home", label: "Inicio", icon: homeIcon },
  { key: "user", label: "Perfil", icon: userIcon },
];
</script>

<template>
  <Tabs :tabs="tabs" variant="boxed" color="primary">
    <template #home>Icono definido en el campo <code>icon</code> del item.</template>
    <template #user>Segundo panel con su propio icono.</template>
  </Tabs>
</template>
