<script setup lang="ts">
// Refleja el ejemplo "Teclado": ↑ / ↓ aplican el paso activo.
</script>

<template>
  <VanillaDemo :use="['CuNumberInput']">
    <cu-number-input placeholder="Enfocá y usá ↑ / ↓"></cu-number-input>
    <cu-number-input :step="5" placeholder="↑ / ↓ de a 5"></cu-number-input>
  </VanillaDemo>
</template>
