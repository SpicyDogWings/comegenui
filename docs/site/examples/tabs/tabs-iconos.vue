<script setup lang="ts">
// Refleja el ejemplo "Iconos": el icono llega por el slot `tab-icon-{key}`.
const tabs = [{ key: "home", label: "Home" }];
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
    </cu-tabs>
  </VanillaDemo>
</template>
