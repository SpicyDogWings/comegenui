<script setup lang="ts">
// Refleja el ejemplo "Límites": el valor nunca se sale de min/max.
</script>

<template>
  <VanillaDemo :use="['CuNumberInput']">
    <cu-number-input :min="0" :max="10" placeholder="0 a 10"></cu-number-input>
    <cu-number-input :min="1" :max="5" :step="1" placeholder="1 a 5"></cu-number-input>
    <cu-number-input
      :min="0"
      :max="100"
      :step="10"
      show-step-select
      placeholder="0 a 100, paso 10"
    ></cu-number-input>
  </VanillaDemo>
</template>
