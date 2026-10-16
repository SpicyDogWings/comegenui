<script setup lang="ts">
// Refleja el ejemplo "Tamaños": los 3 tamaños con la variante solid.
const sizes = ["sm", "md", "lg"] as const;
const tabs = [
  { key: "uno", label: "Uno" },
  { key: "dos", label: "Dos" },
];
</script>

<template>
  <VanillaDemo :use="['CuTabs']">
    <div class="cu-demo-controls">
      <cu-tabs
        v-for="size in sizes"
        :key="size"
        :size="size"
        variant="solid"
        color="primary"
        :tabs.prop="tabs"
      >
        <div slot="uno">Tamaño {{ size }}.</div>
        <div slot="dos">Segundo panel.</div>
      </cu-tabs>
    </div>
  </VanillaDemo>
</template>
