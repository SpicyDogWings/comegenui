<script setup lang="ts">
// Refleja el ejemplo "Límites (min / max)".
import NumberInput from "@/components/form/NumberInput.vue";
</script>

<template>
  <NumberInput :min="0" :max="10" placeholder="0 a 10" />
  <NumberInput :min="1" :max="5" :step="1" placeholder="1 a 5" />
  <NumberInput :min="0" :max="100" :step="10" show-step-select placeholder="0 a 100, paso 10" />
</template>
