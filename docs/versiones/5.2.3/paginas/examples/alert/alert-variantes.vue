<script setup lang="ts">
// Refleja el ejemplo "Variantes": las 5 variantes con color primary.
const variants = ["solid", "outlined", "soft", "ghost", "subtle"] as const;
</script>

<template>
  <VanillaDemo :use="['CuAlert']">
    <cu-alert v-for="variant in variants" :key="variant" color="primary" :variant="variant">
      Variante <code>{{ variant }}</code>.
    </cu-alert>
  </VanillaDemo>
</template>
