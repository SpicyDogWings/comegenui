<script setup lang="ts">
// Refleja el ejemplo "Iconos": uno por el slot `tab-icon-{key}` y otro por el campo `icon`.
const tabs = [
  { key: "home", label: "Home" },
  {
    key: "config",
    label: "Config",
    icon: '<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="9"/></svg>',
  },
];
</script>

<template>
  <VanillaDemo :use="['CuTabs']">
    <cu-tabs id="iconos" variant="solid" color="primary" :tabs.prop="tabs">
      <svg
        slot="tab-icon-home"
        width="14"
        height="14"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      >
        <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
      </svg>
      <div slot="home">Contenido Home</div>
      <div slot="config">Contenido Config</div>
    </cu-tabs>
  </VanillaDemo>
</template>
