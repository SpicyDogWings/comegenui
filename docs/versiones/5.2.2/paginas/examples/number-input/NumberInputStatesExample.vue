<script setup lang="ts">
// Refleja el ejemplo "Estados": disabled, readOnly y habilitado.
import NumberInput from "@/components/form/NumberInput.vue";
</script>

<template>
  <NumberInput :model-value="3" disabled />
  <NumberInput :model-value="3" read-only />
  <NumberInput placeholder="habilitado" />
</template>
