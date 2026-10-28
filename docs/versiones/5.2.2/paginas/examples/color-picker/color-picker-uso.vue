<script setup lang="ts">
// Refleja el ejemplo "Uso en HTML plano": cargás el bundle y escuchás `change`.
import { ref } from "vue";

const ultimo = ref("(sin cambios todavía)");

function onCambio(e: Event) {
  ultimo.value = (e as CustomEvent<string>).detail;
}
</script>

<template>
  <VanillaDemo :use="['CuColorPicker']">
    <cu-color-picker color="primary" @change="onCambio"></cu-color-picker>
    <pre class="cu-demo-output">change → {{ ultimo }}</pre>
  </VanillaDemo>
</template>
