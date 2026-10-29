<script setup lang="ts">
// Refleja el ejemplo "Colores": los 6 nombres semánticos con la variante soft.
const colors = ["primary", "secondary", "neutral", "success", "warning", "danger"] as const;
</script>

<template>
  <VanillaDemo :use="['CuAlert']">
    <cu-alert v-for="color in colors" :key="color" :color="color" variant="soft">
      Color <code>{{ color }}</code>.
    </cu-alert>
  </VanillaDemo>
</template>
