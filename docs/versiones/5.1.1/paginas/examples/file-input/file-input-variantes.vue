<script setup lang="ts">
// Refleja el ejemplo "Variantes": las 4 variantes de campo, con color primary.
const variants = ["outlined", "soft", "ghost", "subtle"] as const;
</script>

<template>
  <VanillaDemo :use="['CuFileInput']">
    <div class="cu-demo-controls">
      <cu-file-input
        v-for="variant in variants"
        :key="variant"
        color="primary"
        :variant="variant"
        :placeholder="variant"
      />
    </div>
  </VanillaDemo>
</template>
