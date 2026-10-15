<script setup lang="ts">
// Refleja el ejemplo "Paneles persistentes": el input sobrevive al cambiar de tab
// porque su panel queda montado (`keepAlive: true`).
const tabs = [
  { key: "form", label: "Formulario", keepAlive: true },
  { key: "otro", label: "Otro" },
];
</script>

<template>
  <VanillaDemo :use="['CuTabs']">
    <cu-tabs variant="solid" color="primary" :tabs.prop="tabs">
      <div slot="form"><input placeholder="Escribí algo y cambiá de tab" /></div>
      <div slot="otro">Volvé: el formulario sigue como lo dejaste.</div>
    </cu-tabs>
  </VanillaDemo>
</template>
