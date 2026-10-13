<script setup lang="ts">
// Refleja el ejemplo "Valor formateado (`value-format`)".
import { ref } from "vue";

const salida = ref("(elegí una fecha)");

function onChange(e: Event) {
  salida.value = String((e as CustomEvent).detail ?? "—");
}
</script>

<template>
  <VanillaDemo :use="['CuDatePicker']">
    <cu-date-picker value-format="dd-MM-yyyy" @change-formatted="onChange" />
    <p class="cu-demo-output">change-formatted → {{ salida }}</p>
  </VanillaDemo>
</template>
