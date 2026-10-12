<script setup lang="ts">
// Refleja el ejemplo "Estado de carga": `loading` mientras corre una acción
// asincrónica (acá simulada; la doc usa `fetch`).
import { ref } from "vue";

const loading = ref(false);

async function guardar() {
  loading.value = true;
  // await fetch('/api/guardar', { method: 'POST' });
  await new Promise((resolve) => setTimeout(resolve, 1500));
  loading.value = false;
}
</script>

<template>
  <VanillaDemo :use="['CuButton']">
    <cu-button color="primary" variant="solid" :loading="loading" @click="guardar">
      Guardar
    </cu-button>
  </VanillaDemo>
</template>
