<script setup lang="ts">
// Refleja el ejemplo "Estados": disabled, readonly y habilitado.
</script>

<template>
  <VanillaDemo :use="['CuNumberInput']">
    <cu-number-input :model-value="3" disabled></cu-number-input>
    <cu-number-input :model-value="3" read-only></cu-number-input>
    <cu-number-input placeholder="habilitado"></cu-number-input>
  </VanillaDemo>
</template>
