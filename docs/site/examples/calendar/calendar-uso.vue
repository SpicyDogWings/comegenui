<script setup lang="ts">
// Refleja el ejemplo "Uso básico": seleccionar una fecha y registrar el `select`.
import { ref } from "vue";

const seleccion = ref("(tocá un día)");

function onSelect(e: CustomEvent) {
  const value = e.detail as Date;
  seleccion.value = value.toISOString().slice(0, 10);
}
</script>

<template>
  <VanillaDemo :use="['CuCalendar']">
    <cu-calendar color="primary" @select="onSelect"></cu-calendar>
    <p class="cu-demo-output">Seleccionado: {{ seleccion }}</p>
  </VanillaDemo>
</template>
