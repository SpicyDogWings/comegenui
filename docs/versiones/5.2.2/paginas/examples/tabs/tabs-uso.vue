<script setup lang="ts">
// Refleja el ejemplo "Uso en HTML plano" de la ficha: `tabs` es un array.
const tabs = [
  { key: "general", label: "General" },
  { key: "advanced", label: "Advanced" },
  { key: "locked", label: "Locked", disabled: true },
];
</script>

<template>
  <VanillaDemo :use="['CuTabs']">
    <cu-tabs id="misTabs" variant="solid" color="primary" :tabs.prop="tabs">
      <div slot="general">Contenido General</div>
      <div slot="advanced">Contenido Advanced</div>
      <div slot="locked">Contenido Locked</div>
    </cu-tabs>
  </VanillaDemo>
</template>
