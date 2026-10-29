<script setup lang="ts">
// Refleja el ejemplo "Variantes": las 4 variantes.
const variantes = [
  { variant: "outlined", color: "success" },
  { variant: "soft", color: "primary" },
  { variant: "ghost", color: "warning" },
  { variant: "subtle", color: "danger" },
] as const;
</script>

<template>
  <VanillaDemo :use="['CuTextarea']">
    <div class="cu-demo-controls">
      <cu-textarea
        v-for="v in variantes"
        :key="v.variant"
        :variant="v.variant"
        :color="v.color"
        :placeholder="v.variant"
      ></cu-textarea>
    </div>
  </VanillaDemo>
</template>
