<script setup lang="ts">
// Refleja el ejemplo "Uso básico": `placeholder` y el evento `change`.
import { ref } from "vue";

const ultimo = ref("(sin fecha)");

function onCambio(e: Event) {
  const d = (e as CustomEvent).detail as
    | Date
    | { start: Date | null; end: Date | null }
    | null;
  if (d instanceof Date) ultimo.value = d.toISOString().slice(0, 10);
  else if (d) ultimo.value = "rango";
  else ultimo.value = "— sin fecha";
}
</script>

<template>
  <VanillaDemo :use="['CuDatePicker']">
    <cu-date-picker placeholder="Elegí una fecha" @change="onCambio"></cu-date-picker>
    <p class="cu-demo-output">change → {{ ultimo }}</p>
  </VanillaDemo>
</template>
