<script setup lang="ts">
// Refleja el ejemplo "Colores": los 6 nombres semánticos con la variante solid.
const colors = ["primary", "secondary", "neutral", "success", "warning", "danger"] as const;
const tabs = [
  { key: "uno", label: "Uno" },
  { key: "dos", label: "Dos" },
];
</script>

<template>
  <VanillaDemo :use="['CuTabs']">
    <div class="cu-demo-controls">
      <cu-tabs v-for="color in colors" :key="color" :color="color" variant="solid" :tabs.prop="tabs">
        <div slot="uno">{{ color }}</div>
        <div slot="dos">Segundo panel.</div>
      </cu-tabs>
    </div>
  </VanillaDemo>
</template>
