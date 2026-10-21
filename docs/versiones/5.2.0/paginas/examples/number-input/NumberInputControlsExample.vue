<script setup lang="ts">
// Refleja los ejemplos "Controles" y "Paso".
import NumberInput from "@/components/form/NumberInput.vue";
import { ref } from "vue";

const valor = ref<number | null>(0);
</script>

<template>
  <NumberInput v-model="valor" placeholder="con controles" />
  <NumberInput v-model="valor" :show-controls="false" placeholder="sin controles" />
  <NumberInput :step="5" placeholder="paso 5" />
  <NumberInput :step="10" show-step-select placeholder="paso 10 + select" />
  <NumberInput :steps="[2, 4, 8]" show-step-select placeholder="steps custom" />
</template>
